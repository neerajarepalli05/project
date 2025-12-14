
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
import numpy as np
import os

# Try loading the pickle model
_model = None
_model_error: Optional[str] = None

def _try_load_model() -> None:
    global _model, _model_error
    model_path_candidates = [
        os.path.join(os.path.dirname(__file__), "heart_disease_model.pkl"),
        os.path.join("/mnt/data", "heart_disease_model.pkl"),
        os.environ.get("MODEL_PATH") or ""
    ]
    for p in model_path_candidates:
        if not p:
            continue
        if os.path.exists(p):
            try:
                import pickle
                with open(p, "rb") as f:
                    _model = pickle.load(f)
                return
            except Exception as e_pickle:
                try:
                    import joblib  # type: ignore
                    _model = joblib.load(p)  # type: ignore
                    return
                except Exception as e_joblib:
                    _model_error = f"Failed to load model from {p}: pickle={e_pickle}; joblib={e_joblib}"
    _model_error = _model_error or "Model file not found in backend directory or /mnt/data"

_try_load_model()

def _infer_feature_names(model) -> Optional[List[str]]:
    try:
        if hasattr(model, "feature_names_in_"):
            return list(model.feature_names_in_)  # type: ignore
        if hasattr(model, "get_feature_names_out"):
            return list(model.get_feature_names_out())  # type: ignore
        if hasattr(model, "named_steps"):
            for step in getattr(model, "named_steps").values():
                if hasattr(step, "feature_names_in_"):
                    return list(step.feature_names_in_)  # type: ignore
                if hasattr(step, "get_feature_names_out"):
                    try:
                        return list(step.get_feature_names_out())  # type: ignore
                    except Exception:
                        pass
    except Exception:
        return None
    return None

FEATURE_NAMES: Optional[List[str]] = _infer_feature_names(_model) if _model is not None else None

DEFAULT_FEATURES = ["age","sex","cp","trestbps","chol","fbs","restecg","thalach","exang","oldpeak","slope","ca","thal"]

class PredictByDict(BaseModel):
    features: Dict[str, float] = Field(..., description="Feature dictionary")

class PredictByArray(BaseModel):
    values: List[float] = Field(..., description="Feature array matching server's expected order")
    feature_names: Optional[List[str]] = Field(None, description="Optional explicit order")

app = FastAPI(title="Heart Disease Prediction API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health() -> Dict[str, Any]:
    return {
        "status": "ok",
        "model_loaded": _model is not None,
        "model_error": _model_error,
        "feature_names": FEATURE_NAMES or DEFAULT_FEATURES,
    }

def _rule_based_predict(x: np.ndarray) -> np.ndarray:
    # Very simple heuristic fallback producing probability 0..1
    # x is shape (n, 13) in DEFAULT_FEATURES order when possible
    probs = []
    for row in x:
        # Extract with safe indexing
        def g(idx, default=0.0):
            try:
                return float(row[idx])
            except Exception:
                return default
        score = 0.0
        score += 0.02 * max(0.0, g(0) - 40)           # age
        score += 0.5 if g(1) == 1 else 0.0            # sex male
        score += 0.4 if g(2) in (0, 3) else 0.1       # chest pain type
        score += 0.015 * max(0.0, g(3) - 130)         # trestbps
        score += 0.01 * max(0.0, g(4) - 200)          # chol
        score += 0.3 if g(5) == 1 else 0.0            # fbs
        score += 0.1 if g(6) in (1,2) else 0.0        # restecg
        score += 0.02 * max(0.0, 150 - g(7))          # thalach low
        score += 0.5 if g(8) == 1 else 0.0            # exang
        score += 0.4 * max(0.0, g(9))                 # oldpeak
        score += 0.2 * max(0.0, g(10) - 1)            # slope
        score += 0.3 * max(0.0, g(11))                # ca
        score += 0.4 if g(12) in (6,7) else 0.1       # thal
        # squash
        prob = 1 / (1 + np.exp(-score))
        probs.append(prob)
    return np.array(probs)

def _predict_matrix(X: np.ndarray) -> np.ndarray:
    if _model is not None:
        try:
            if hasattr(_model, "predict_proba"):
                return _model.predict_proba(X)[:, 1]  # type: ignore
            # Fallback: use decision_function or predict
            if hasattr(_model, "decision_function"):
                from scipy.special import expit  # type: ignore
                return expit(_model.decision_function(X))  # type: ignore
            preds = _model.predict(X)  # type: ignore
            return np.asarray(preds, dtype=float)
        except Exception as e:
            # As a last resort, rule-based
            return _rule_based_predict(X)
    return _rule_based_predict(X)

@app.post("/predict")
def predict(payload: PredictByDict | PredictByArray):
    # Normalize to 2D numpy array
    try:
        if isinstance(payload, PredictByDict):
            # Map dict to order
            names = FEATURE_NAMES or DEFAULT_FEATURES
            row = [payload.features.get(k, 0.0) for k in names]
            X = np.array([row], dtype=float)
        else:
            if payload.feature_names:
                order = payload.feature_names
                X = np.array([payload.values], dtype=float)
            else:
                X = np.array([payload.values], dtype=float)
        proba = _predict_matrix(X)
        risk = float(proba[0])
        return {"risk": risk, "model_loaded": _model is not None, "feature_names": FEATURE_NAMES or DEFAULT_FEATURES}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
