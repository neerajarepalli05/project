import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Target, Zap, TreePine, Users, Shield } from 'lucide-react';
import { heartDiseaseDataset, HeartDiseaseRecord } from '../data/heartDiseaseData';
import {
  LogisticRegression,
  DecisionTree,
  KNearestNeighbors,
  RandomForest,
  SupportVectorMachine,
  EnsembleModel,
  trainTestSplit,
  standardizeFeatures,
  applyStandardization,
  calculateMetrics,
  crossValidation,
  createPolynomialFeatures,
  ModelMetrics,
  MLModel
} from '../utils/mlAlgorithms';

interface ModelResult {
  name: string;
  metrics: ModelMetrics;
  icon: React.ComponentType<any>;
  color: string;
  model: MLModel;
  isStandardized: boolean;
}

const ModelComparison: React.FC = () => {
  const [modelResults, setModelResults] = useState<ModelResult[]>([]);
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);

  const models: { model: MLModel; icon: React.ComponentType<any>; color: string; isStandardized: boolean }[] = [
    { model: new LogisticRegression(), icon: TrendingUp, color: 'blue', isStandardized: true },
    { model: new DecisionTree(), icon: TreePine, color: 'green', isStandardized: false },
    { model: new KNearestNeighbors(), icon: Users, color: 'purple', isStandardized: true },
    { model: new RandomForest(), icon: TreePine, color: 'emerald', isStandardized: false },
    { model: new SupportVectorMachine(), icon: Shield, color: 'red', isStandardized: true },
    { model: new EnsembleModel(), icon: Brain, color: 'indigo', isStandardized: false },
  ];

  const trainModels = async () => {
    setIsTraining(true);
    setTrainingProgress(0);

    // Prepare data
    const X = heartDiseaseDataset.map(record => [
      record.age, record.sex, record.cp, record.trestbps, record.chol,
      record.fbs, record.restecg, record.thalach, record.exang,
      record.oldpeak, record.slope, record.ca, record.thal
    ]);
    const y = heartDiseaseDataset.map(record => record.target);

    // Split data
    const { XTrain, XTest, yTrain, yTest } = trainTestSplit(X, y, 0.2);

    // Standardize features for models that need it
    const { standardized: XTrainStd, mean, std } = standardizeFeatures(XTrain);
    const XTestStd = applyStandardization(XTest, mean, std);

    const results: ModelResult[] = [];

    for (let i = 0; i < models.length; i++) {
      const { model, icon, color, isStandardized } = models[i];
      
      setTrainingProgress((i / models.length) * 100);

      try {
        // Train model
        const trainX = isStandardized ? XTrainStd : XTrain;
        const testX = isStandardized ? XTestStd : XTest;
        
        // Add polynomial features for some models
        let finalTrainX = trainX;
        let finalTestX = testX;
        
        if (model.name === 'Logistic Regression' || model.name === 'Support Vector Machine') {
          finalTrainX = createPolynomialFeatures(trainX);
          finalTestX = createPolynomialFeatures(testX);
        }
        
        model.train(trainX, yTrain);
        
        // Make predictions
        const predictions = model.predict(testX);
        
        // Calculate metrics
        const metrics = calculateMetrics(yTest, predictions);
        
        // Add cross-validation score
        const cvAccuracy = crossValidation(model, trainX, yTrain, 5);
        metrics.crossValAccuracy = cvAccuracy;
        
        results.push({
          name: model.name,
          metrics,
          icon,
          color,
          model,
          isStandardized
        });

        // Simulate training time
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`Error training ${model.name}:`, error);
      }
    }

    setModelResults(results.sort((a, b) => b.metrics.accuracy - a.metrics.accuracy));
    setTrainingProgress(100);
    setIsTraining(false);
  };

  useEffect(() => {
    trainModels();
  }, []);

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; text: string; border: string; accent: string }> = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', accent: 'bg-blue-500' },
      green: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', accent: 'bg-green-500' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', accent: 'bg-purple-500' },
      emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', accent: 'bg-emerald-500' },
      red: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', accent: 'bg-red-500' },
      indigo: { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', accent: 'bg-indigo-500' },
    };
    return colorMap[color] || colorMap.blue;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Brain className="h-8 w-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Model Comparison</h2>
            <p className="text-gray-600">Training and evaluating multiple ML algorithms</p>
          </div>
        </div>
        <button
          onClick={trainModels}
          disabled={isTraining}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <Zap className="h-4 w-4" />
          <span>{isTraining ? 'Training...' : 'Retrain Models'}</span>
        </button>
      </div>

      {isTraining && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Training Progress</span>
            <span className="text-sm text-gray-500">{Math.round(trainingProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${trainingProgress}%` }}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modelResults.map((result, index) => {
          const colorClasses = getColorClasses(result.color);
          const IconComponent = result.icon;
          
          return (
            <div
              key={result.name}
              className={`${colorClasses.bg} ${colorClasses.border} border rounded-lg p-6 transition-all duration-300 hover:shadow-lg`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`${colorClasses.accent} p-2 rounded-lg`}>
                    <IconComponent className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${colorClasses.text}`}>{result.name}</h3>
                    {index === 0 && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                        <Target className="h-3 w-3 mr-1" />
                        Best Model
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Accuracy</span>
                  <span className={`font-semibold ${colorClasses.text}`}>
                    {(result.metrics.accuracy * 100).toFixed(1)}%
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Precision</span>
                  <span className={`font-semibold ${colorClasses.text}`}>
                    {(result.metrics.precision * 100).toFixed(1)}%
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Recall</span>
                  <span className={`font-semibold ${colorClasses.text}`}>
                    {(result.metrics.recall * 100).toFixed(1)}%
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">F1-Score</span>
                  <span className={`font-semibold ${colorClasses.text}`}>
                    {(result.metrics.f1Score * 100).toFixed(1)}%
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">AUC</span>
                  <span className={`font-semibold ${colorClasses.text}`}>
                    {(result.metrics.auc * 100).toFixed(1)}%
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">CV Accuracy</span>
                  <span className={`font-semibold ${colorClasses.text}`}>
                    {(result.metrics.crossValAccuracy * 100).toFixed(1)}%
                  </span>
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <div className="flex justify-between items-center text-xs text-gray-500">
                    <span>Data Preprocessing</span>
                    <span>{result.isStandardized ? 'Standardized' : 'Raw Features'}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {modelResults.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Summary</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-4 font-medium text-gray-700">Model</th>
                  <th className="text-right py-2 px-4 font-medium text-gray-700">Accuracy</th>
                  <th className="text-right py-2 px-4 font-medium text-gray-700">Precision</th>
                  <th className="text-right py-2 px-4 font-medium text-gray-700">Recall</th>
                  <th className="text-right py-2 px-4 font-medium text-gray-700">F1-Score</th>
                  <th className="text-right py-2 px-4 font-medium text-gray-700">AUC</th>
                  <th className="text-right py-2 px-4 font-medium text-gray-700">CV Acc</th>
                </tr>
              </thead>
              <tbody>
                {modelResults.map((result) => (
                  <tr key={result.name} className="border-b border-gray-100">
                    <td className="py-2 px-4 font-medium text-gray-900">{result.name}</td>
                    <td className="py-2 px-4 text-right text-gray-700">
                      {(result.metrics.accuracy * 100).toFixed(2)}%
                    </td>
                    <td className="py-2 px-4 text-right text-gray-700">
                      {(result.metrics.precision * 100).toFixed(2)}%
                    </td>
                    <td className="py-2 px-4 text-right text-gray-700">
                      {(result.metrics.recall * 100).toFixed(2)}%
                    </td>
                    <td className="py-2 px-4 text-right text-gray-700">
                      {(result.metrics.f1Score * 100).toFixed(2)}%
                    </td>
                    <td className="py-2 px-4 text-right text-gray-700">
                      {(result.metrics.auc * 100).toFixed(2)}%
                    </td>
                    <td className="py-2 px-4 text-right text-gray-700">
                      {(result.metrics.crossValAccuracy * 100).toFixed(2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-2">Model Improvements</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Cross-validation for robust evaluation</li>
                <li>• Polynomial features for complex patterns</li>
                <li>• Ensemble methods for better accuracy</li>
                <li>• Hyperparameter optimization</li>
              </ul>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Advanced Metrics</h4>
              <ul className="text-sm text-green-800 space-y-1">
                <li>• AUC-ROC for classification quality</li>
                <li>• Specificity and NPV</li>
                <li>• Cross-validation accuracy</li>
                <li>• Regularization techniques</li>
              </ul>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-900 mb-2">Feature Engineering</h4>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• Standardization for linear models</li>
                <li>• Feature selection in Random Forest</li>
                <li>• Polynomial feature expansion</li>
                <li>• Bootstrap aggregating</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelComparison;