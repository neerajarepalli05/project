import React, { useState } from 'react';
import { Heart, AlertTriangle, CheckCircle, Calculator, User, Activity, Info, FileText } from 'lucide-react';
import { featureDescriptions } from '../data/heartDiseaseData';
import { EnsembleModel, standardizeFeatures, applyStandardization, trainTestSplit } from '../utils/mlAlgorithms';
import { heartDiseaseDataset } from '../data/heartDiseaseData';
import { predictHeartDiseaseType, HeartDiseaseType } from '../utils/heartDiseaseTypes';
import { database, PatientRecord } from '../utils/supabase';

interface PatientData {
  age: number;
  sex: number;
  cp: number;
  trestbps: number;
  chol: number;
  fbs: number;
  restecg: number;
  thalach: number;
  exang: number;
  oldpeak: number;
  slope: number;
  ca: number;
  thal: number;
}

interface PredictionInterfaceProps {
  user: { id: string; email: string; name: string } | null;
}

const PredictionInterface: React.FC<PredictionInterfaceProps> = ({ user }) => {
  const [patientData, setPatientData] = useState<PatientData>({
    age: 50,
    sex: 1,
    cp: 0,
    trestbps: 120,
    chol: 200,
    fbs: 0,
    restecg: 0,
    thalach: 150,
    exang: 0,
    oldpeak: 0,
    slope: 2,
    ca: 0,
    thal: 3
  });

  const [prediction, setPrediction] = useState<{
    risk: number;
    probability: number;
    confidence: string;
    diseaseType: HeartDiseaseType;
  } | null>(null);

  const [isCalculating, setIsCalculating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [patientHistory, setPatientHistory] = useState<PatientRecord[]>([]);
  const [trainedModel, setTrainedModel] = useState<EnsembleModel | null>(null);
  const [modelAccuracy, setModelAccuracy] = useState<number>(0);

  const [useServer, setUseServer] = useState<boolean>(true);
  const [serverStatus, setServerStatus] = useState<string>('checking...');

  React.useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch('http://localhost:8000/health');
        const js = await res.json();
        setServerStatus(js.model_loaded ? 'API ok (model loaded)' : 'API ok (fallback rules)');
      } catch (e) {
        setServerStatus('API not reachable, using local model');
        setUseServer(false);
      }
    };
    check();
  }, []);


  const predictViaServer = async (data: PatientData): Promise<number> => {
    const payload = {
      features: {
        age: data.age,
        sex: data.sex,
        cp: data.cp,
        trestbps: data.trestbps,
        chol: data.chol,
        fbs: data.fbs,
        restecg: data.restecg,
        thalach: data.thalach,
        exang: data.exang,
        oldpeak: data.oldpeak,
        slope: data.slope,
        ca: data.ca,
        thal: data.thal
      }
    };
    const res = await fetch('http://localhost:8000/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error(await res.text());
    const js = await res.json();
    return js.risk as number;
  };

  // Train model on component mount
  React.useEffect(() => {
    const trainModel = async () => {
      const X = heartDiseaseDataset.map(record => [
        record.age, record.sex, record.cp, record.trestbps, record.chol,
        record.fbs, record.restecg, record.thalach, record.exang,
        record.oldpeak, record.slope, record.ca, record.thal
      ]);
      const y = heartDiseaseDataset.map(record => record.target);

      const { XTrain, XTest, yTrain, yTest } = trainTestSplit(X, y, 0.2);
      
      const model = new EnsembleModel();
      model.train(XTrain, yTrain);
      
      // Calculate accuracy
      const predictions = model.predict(XTest);
      const correct = predictions.reduce((sum, pred, i) => sum + (pred === yTest[i] ? 1 : 0), 0);
      const accuracy = correct / predictions.length;
      
      setTrainedModel(model);
      setModelAccuracy(accuracy);
    };

    trainModel();
  }, []);

  // Load patient history
  React.useEffect(() => {
    const loadHistory = async () => {
      if (user) {
        try {
          const history = await database.getPatientRecords(user.id);
          setPatientHistory(history);
        } catch (error) {
          console.error('Error loading patient history:', error);
        }
      }
    };

    loadHistory();
  }, [user]);

  const handleInputChange = (field: keyof PatientData, value: number) => {
    setPatientData(prev => ({
      ...prev,
      [field]: value
    }));
    setPrediction(null);
  };

  const calculateRisk = async () => {
    setIsCalculating(true);
    
    // Simulate calculation time
    await new Promise(resolve => setTimeout(resolve, 1000));

    let probability = 0.5;
    let risk = 0;

    if (useServer) {
      const r = await predictViaServer(patientData);
      probability = r;
    } else if (trainedModel) {
      // Use trained ensemble model for prediction
      const inputData = [[
        patientData.age, patientData.sex, patientData.cp, patientData.trestbps,
        patientData.chol, patientData.fbs, patientData.restecg, patientData.thalach,
        patientData.exang, patientData.oldpeak, patientData.slope, patientData.ca, patientData.thal
      ]];
      
      const predictions = trainedModel.predict(inputData);
      risk = predictions[0];
      
      if (trainedModel.predictProba) {
        const probabilities = trainedModel.predictProba(inputData);
        probability = probabilities[0][1]; // Probability of positive class
      } else {
        probability = risk;
      }
    } else {
      // Fallback to rule-based calculation
      const riskFactors = [
        patientData.age > 55 ? 1 : 0,
        patientData.sex === 1 ? 1 : 0,
        patientData.cp === 0 ? 1 : 0,
        patientData.trestbps > 140 ? 1 : 0,
        patientData.chol > 240 ? 1 : 0,
        patientData.fbs === 1 ? 1 : 0,
        patientData.thalach < 120 ? 1 : 0,
        patientData.exang === 1 ? 1 : 0,
        patientData.oldpeak > 2 ? 1 : 0,
        patientData.ca > 0 ? 1 : 0,
        patientData.thal === 6 || patientData.thal === 7 ? 1 : 0
      ];

      const riskScore = riskFactors.reduce((sum, factor) => sum + factor, 0);
      probability = Math.min(0.95, Math.max(0.05, riskScore / 11));
      risk = probability > 0.5 ? 1 : 0;
    }
    
    const confidence = probability > 0.7 || probability < 0.3 ? 'High' : 'Medium';
    const diseaseType = predictHeartDiseaseType(patientData, probability);

    setPrediction({
      risk,
      probability,
      confidence,
      diseaseType
    });

    // Save to database if user is logged in
    if (user) {
      setIsSaving(true);
      try {
        const record: PatientRecord = {
          user_id: user.id,
          ...patientData,
          prediction_result: risk,
          prediction_probability: probability,
          disease_type: diseaseType.name
        };
        
        await database.savePatientRecord(record);
        
        // Refresh history
        const updatedHistory = await database.getPatientRecords(user.id);
        setPatientHistory(updatedHistory);
      } catch (error) {
        console.error('Error saving patient record:', error);
      } finally {
        setIsSaving(false);
      }
    }

    setIsCalculating(false);
  };

  const getRiskLevel = () => {
    if (!prediction) return 'unknown';
    if (prediction.probability >= 0.7) return 'high';
    if (prediction.probability >= 0.4) return 'medium';
    return 'low';
  };

  const getRiskColor = () => {
    const level = getRiskLevel();
    switch (level) {
      case 'high': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'low': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  const getRiskBgColor = () => {
    const level = getRiskLevel();
    switch (level) {
      case 'high': return 'bg-red-50 border-red-200';
      case 'medium': return 'bg-yellow-50 border-yellow-200';
      case 'low': return 'bg-green-50 border-green-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <Heart className="h-8 w-8 text-red-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Heart Disease Risk Assessment</h2>
          <p className="text-gray-600">Enter patient information to predict cardiovascular risk</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Form */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <User className="h-5 w-5 mr-2" />
            Patient Information
          </h3>
          
          <div className="space-y-6">
            {/* Demographics */}
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-3">Demographics</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age (years)
                  </label>
                  <input
                    type="number"
                    min="20"
                    max="100"
                    value={patientData.age}
                    onChange={(e) => handleInputChange('age', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sex
                  </label>
                  <select
                    value={patientData.sex}
                    onChange={(e) => handleInputChange('sex', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={0}>Female</option>
                    <option value={1}>Male</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Clinical Measurements */}
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-3">Clinical Measurements</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Resting Blood Pressure (mm Hg)
                  </label>
                  <input
                    type="number"
                    min="80"
                    max="200"
                    value={patientData.trestbps}
                    onChange={(e) => handleInputChange('trestbps', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cholesterol (mg/dl)
                  </label>
                  <input
                    type="number"
                    min="100"
                    max="400"
                    value={patientData.chol}
                    onChange={(e) => handleInputChange('chol', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Heart Rate Achieved
                  </label>
                  <input
                    type="number"
                    min="60"
                    max="220"
                    value={patientData.thalach}
                    onChange={(e) => handleInputChange('thalach', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ST Depression (oldpeak)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={patientData.oldpeak}
                    onChange={(e) => handleInputChange('oldpeak', parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Symptoms and Tests */}
            <div>
              <h4 className="text-md font-medium text-gray-700 mb-3">Symptoms & Test Results</h4>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Chest Pain Type
                  </label>
                  <select
                    value={patientData.cp}
                    onChange={(e) => handleInputChange('cp', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={0}>Typical Angina</option>
                    <option value={1}>Atypical Angina</option>
                    <option value={2}>Non-Anginal Pain</option>
                    <option value={3}>Asymptomatic</option>
                  </select>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fasting Blood Sugar &gt; 120 mg/dl
                    </label>
                    <select
                      value={patientData.fbs}
                      onChange={(e) => handleInputChange('fbs', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={0}>No</option>
                      <option value={1}>Yes</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Exercise Induced Angina
                    </label>
                    <select
                      value={patientData.exang}
                      onChange={(e) => handleInputChange('exang', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={0}>No</option>
                      <option value={1}>Yes</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Resting ECG
                    </label>
                    <select
                      value={patientData.restecg}
                      onChange={(e) => handleInputChange('restecg', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={0}>Normal</option>
                      <option value={1}>ST-T Abnormality</option>
                      <option value={2}>LV Hypertrophy</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ST Slope
                    </label>
                    <select
                      value={patientData.slope}
                      onChange={(e) => handleInputChange('slope', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={0}>Upsloping</option>
                      <option value={1}>Flat</option>
                      <option value={2}>Downsloping</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Major Vessels (0-3)
                    </label>
                    <select
                      value={patientData.ca}
                      onChange={(e) => handleInputChange('ca', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value={0}>0</option>
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Thalassemia
                  </label>
                  <select
                    value={patientData.thal}
                    onChange={(e) => handleInputChange('thal', parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value={3}>Normal</option>
                    <option value={6}>Fixed Defect</option>
                    <option value={7}>Reversible Defect</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              onClick={calculateRisk}
              disabled={isCalculating || isSaving}
              className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              <Calculator className="h-5 w-5" />
              <span>
                {isCalculating ? 'Calculating...' : 
                 isSaving ? 'Saving...' : 
                 'Calculate Risk'}
              </span>
            </button>

            {/* Model Information */}
            {trainedModel && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-blue-700 font-medium">AI Model Status</span>
                  <span className="text-blue-600">Ready</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-blue-700">Model Accuracy</span>
                  <span className="text-blue-600 font-medium">{(modelAccuracy * 100).toFixed(1)}%</span>
                </div>
                <p className="text-xs text-blue-600 mt-2">
                  Using advanced ensemble learning with cross-validation
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6">
          {prediction && (
            <div className={`rounded-lg border p-6 ${getRiskBgColor()}`}>
              <div className="flex items-center space-x-3 mb-4">
                {getRiskLevel() === 'high' ? (
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                ) : getRiskLevel() === 'low' ? (
                  <CheckCircle className="h-8 w-8 text-green-600" />
                ) : (
                  <Activity className="h-8 w-8 text-yellow-600" />
                )}
                <div>
                  <h3 className={`text-xl font-bold ${getRiskColor()}`}>
                    {getRiskLevel().charAt(0).toUpperCase() + getRiskLevel().slice(1)} Risk
                  </h3>
                  <p className="text-gray-600">Heart Disease Risk Assessment</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Risk Probability</span>
                    <span className={`font-bold ${getRiskColor()}`}>
                      {(prediction.probability * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        getRiskLevel() === 'high' ? 'bg-red-500' :
                        getRiskLevel() === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${prediction.probability * 100}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="text-sm text-gray-600">Confidence</p>
                    <p className="text-lg font-bold text-gray-900">{prediction.confidence}</p>
                  </div>
                  <div className="text-center p-3 bg-white rounded-lg">
                    <p className="text-sm text-gray-600">Classification</p>
                    <p className="text-lg font-bold text-gray-900">
                      {prediction.risk === 1 ? 'Positive' : 'Negative'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Heart Disease Type Details */}
          {prediction && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center space-x-3 mb-4">
                <FileText className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-900">Most Likely Heart Disease Type</h3>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xl font-bold text-blue-900">{prediction.diseaseType.name}</h4>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    prediction.diseaseType.severity === 'Critical' ? 'bg-red-100 text-red-800' :
                    prediction.diseaseType.severity === 'High' ? 'bg-orange-100 text-orange-800' :
                    prediction.diseaseType.severity === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {prediction.diseaseType.severity} Severity
                  </span>
                </div>
                <p className="text-blue-800 text-sm leading-relaxed">{prediction.diseaseType.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Symptoms */}
                <div>
                  <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Activity className="h-4 w-4 mr-2 text-red-600" />
                    Common Symptoms
                  </h5>
                  <ul className="space-y-2">
                    {prediction.diseaseType.symptoms.map((symptom, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <span className="w-2 h-2 bg-red-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {symptom}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Causes */}
                <div>
                  <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Info className="h-4 w-4 mr-2 text-blue-600" />
                    Primary Causes
                  </h5>
                  <ul className="space-y-2">
                    {prediction.diseaseType.causes.map((cause, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {cause}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Risk Factors */}
                <div>
                  <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2 text-yellow-600" />
                    Risk Factors
                  </h5>
                  <ul className="space-y-2">
                    {prediction.diseaseType.riskFactors.slice(0, 6).map((factor, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <span className="w-2 h-2 bg-yellow-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Treatment Options */}
                <div>
                  <h5 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <Heart className="h-4 w-4 mr-2 text-green-600" />
                    Treatment Options
                  </h5>
                  <ul className="space-y-2">
                    {prediction.diseaseType.treatment.map((treatment, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {treatment}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Prognosis */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h5 className="font-semibold text-gray-900 mb-2">Prognosis & Outlook</h5>
                <p className="text-sm text-gray-700 leading-relaxed">{prediction.diseaseType.prognosis}</p>
              </div>
            </div>
          )}

          {/* Risk Factors */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Risk Factor Analysis</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Age &gt; 55</span>
                <span className={`text-sm font-medium ${patientData.age > 55 ? 'text-red-600' : 'text-green-600'}`}>
                  {patientData.age > 55 ? 'Risk Factor' : 'Normal'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Male Gender</span>
                <span className={`text-sm font-medium ${patientData.sex === 1 ? 'text-red-600' : 'text-green-600'}`}>
                  {patientData.sex === 1 ? 'Risk Factor' : 'Lower Risk'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">High Blood Pressure</span>
                <span className={`text-sm font-medium ${patientData.trestbps > 140 ? 'text-red-600' : 'text-green-600'}`}>
                  {patientData.trestbps > 140 ? 'Risk Factor' : 'Normal'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">High Cholesterol</span>
                <span className={`text-sm font-medium ${patientData.chol > 240 ? 'text-red-600' : 'text-green-600'}`}>
                  {patientData.chol > 240 ? 'Risk Factor' : 'Normal'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Exercise Angina</span>
                <span className={`text-sm font-medium ${patientData.exang === 1 ? 'text-red-600' : 'text-green-600'}`}>
                  {patientData.exang === 1 ? 'Risk Factor' : 'Normal'}
                </span>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          {prediction && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Clinical Recommendations</h3>
              <div className="space-y-3 text-sm text-gray-600">
                {getRiskLevel() === 'high' && (
                  <>
                    <p className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>Immediate consultation with a cardiologist is recommended</span>
                    </p>
                    <p className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>Consider comprehensive cardiac evaluation including stress testing</span>
                    </p>
                    <p className="flex items-start space-x-2">
                      <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
                      <span>Implement immediate lifestyle modifications</span>
                    </p>
                  </>
                )}
                {getRiskLevel() === 'medium' && (
                  <>
                    <p className="flex items-start space-x-2">
                      <Activity className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span>Schedule follow-up with primary care physician</span>
                    </p>
                    <p className="flex items-start space-x-2">
                      <Activity className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span>Consider additional cardiac screening tests</span>
                    </p>
                    <p className="flex items-start space-x-2">
                      <Activity className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span>Focus on modifiable risk factors</span>
                    </p>
                  </>
                )}
                {getRiskLevel() === 'low' && (
                  <>
                    <p className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Continue regular health maintenance</span>
                    </p>
                    <p className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Maintain healthy lifestyle habits</span>
                    </p>
                    <p className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span>Schedule routine preventive care</span>
                    </p>
                  </>
                )}
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs text-blue-700 font-medium">
                    ⚠️ This prediction is based on statistical models and should not replace professional medical diagnosis.
                    Always consult with healthcare professionals for accurate diagnosis and treatment.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Patient History */}
        {user && patientHistory.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Assessment History</h3>
            <div className="space-y-3">
              {patientHistory.slice(0, 5).map((record) => (
                <div key={record.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Age {record.age}, {record.sex === 1 ? 'Male' : 'Female'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(record.created_at || '').toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-medium ${
                      (record.prediction_probability || 0) > 0.5 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {((record.prediction_probability || 0) * 100).toFixed(1)}% Risk
                    </p>
                    <p className="text-xs text-gray-500">{record.disease_type}</p>
                  </div>
                </div>
              ))}
            </div>
            {patientHistory.length > 5 && (
              <p className="text-sm text-gray-500 mt-3 text-center">
                Showing 5 most recent assessments
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionInterface;