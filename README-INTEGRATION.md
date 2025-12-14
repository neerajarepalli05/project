
# Integrated Heart Disease Prediction (FastAPI + React/TypeScript)

This project wires your React app to a FastAPI backend that serves predictions from a trained model (`heart_disease_model.pkl`). If the pickle can't be loaded, the API falls back to a simple rule-based estimator so you can still demo end-to-end.

## Structure
```
project/
  backend/
    app.py
    requirements.txt
    heart_disease_model.pkl   # your model copied here
  src/                        # React TypeScript source
  package.json                # Vite React TS
  run_api.sh / run_api.bat    # convenience scripts to start FastAPI
```

## Prerequisites
- **Python 3.10+**
- **Node.js 18+**

## 1) Start the API
### Option A (Windows PowerShell / CMD)
```bat
cd project\backend
python -m venv .venv
.venv\Scripts\activate
pip install --upgrade pip
pip install -r requirements.txt
uvicorn backend.app:app --host 0.0.0.0 --port 8000 --reload
```
(Alternative) Use the batch file:
```bat
cd project
run_api.bat
```

The API exposes:
- `GET http://localhost:8000/health` → status + whether the model loaded + expected feature names.
- `POST http://localhost:8000/predict` with JSON body:
  - **Option 1 (by feature dict)**:
    ```json
    {
      "features": {
        "age": 63, "sex": 1, "cp": 0, "trestbps": 145, "chol": 233,
        "fbs": 1, "restecg": 0, "thalach": 150, "exang": 0, "oldpeak": 2.3, "slope": 0, "ca": 0, "thal": 6
      }
    }
    ```
  - **Option 2 (by array)**:
    ```json
    {
      "values": [63,1,0,145,233,1,0,150,0,2.3,0,0,6]
    }
    ```

> If your model didn't load, check `model_loaded` in `/health`. If `false`, ensure `heart_disease_model.pkl` is a valid pickle/joblib file trained with scikit-learn and place it in `project/backend/` (overwriting the placeholder).

## 2) Start the Frontend
In a second terminal:
```bash
cd project
npm install
npm run dev
```
Visit the URL printed by Vite (typically `http://localhost:5173`). The **Heart Disease Risk Estimator** screen now shows a toggle:
- **Use Server Model** (default): calls `http://localhost:8000/predict`
- If the API isn't reachable, it automatically falls back to the in-browser model.

## Replacing the Model
- Replace `project/backend/heart_disease_model.pkl` with your own.
- Restart the API. Check `/health` to verify `model_loaded: true`.

## Troubleshooting
- **CORS errors**: Backend enables CORS for all origins. Make sure you're hitting `http://localhost:8000`.
- **Model shape/feature mismatch**: If your model expects a different set/order of features, update the frontend mapping inside `src/components/PredictionInterface.tsx` and/or send `values` with the correct order.
- **Port already in use**: Change `--port` in the `uvicorn` command.

---

Happy building! 🚀
