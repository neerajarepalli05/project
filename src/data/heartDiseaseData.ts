// Heart Disease Dataset - Based on UCI Cleveland Heart Disease Dataset
export interface HeartDiseaseRecord {
  age: number;
  sex: number; // 1 = male, 0 = female
  cp: number; // chest pain type (0-3)
  trestbps: number; // resting blood pressure
  chol: number; // cholesterol
  fbs: number; // fasting blood sugar > 120 mg/dl (1 = true, 0 = false)
  restecg: number; // resting ECG results (0-2)
  thalach: number; // maximum heart rate achieved
  exang: number; // exercise induced angina (1 = yes, 0 = no)
  oldpeak: number; // ST depression induced by exercise
  slope: number; // slope of peak exercise ST segment
  ca: number; // number of major vessels colored by fluoroscopy (0-3)
  thal: number; // thalassemia (3 = normal, 6 = fixed defect, 7 = reversible defect)
  target: number; // 1 = heart disease, 0 = no heart disease
}

export const heartDiseaseDataset: HeartDiseaseRecord[] = [
  { age: 63, sex: 1, cp: 3, trestbps: 145, chol: 233, fbs: 1, restecg: 0, thalach: 150, exang: 0, oldpeak: 2.3, slope: 0, ca: 0, thal: 6, target: 1 },
  { age: 37, sex: 1, cp: 2, trestbps: 130, chol: 250, fbs: 0, restecg: 1, thalach: 187, exang: 0, oldpeak: 3.5, slope: 0, ca: 0, thal: 3, target: 1 },
  { age: 41, sex: 0, cp: 1, trestbps: 130, chol: 204, fbs: 0, restecg: 0, thalach: 172, exang: 0, oldpeak: 1.4, slope: 2, ca: 0, thal: 3, target: 1 },
  { age: 56, sex: 1, cp: 1, trestbps: 120, chol: 236, fbs: 0, restecg: 1, thalach: 178, exang: 0, oldpeak: 0.8, slope: 2, ca: 0, thal: 3, target: 1 },
  { age: 57, sex: 0, cp: 0, trestbps: 120, chol: 354, fbs: 0, restecg: 1, thalach: 163, exang: 1, oldpeak: 0.6, slope: 2, ca: 0, thal: 3, target: 1 },
  { age: 57, sex: 1, cp: 0, trestbps: 140, chol: 192, fbs: 0, restecg: 1, thalach: 148, exang: 0, oldpeak: 0.4, slope: 1, ca: 0, thal: 6, target: 1 },
  { age: 56, sex: 0, cp: 1, trestbps: 140, chol: 294, fbs: 0, restecg: 0, thalach: 153, exang: 0, oldpeak: 1.3, slope: 1, ca: 0, thal: 3, target: 1 },
  { age: 44, sex: 1, cp: 1, trestbps: 120, chol: 263, fbs: 0, restecg: 1, thalach: 173, exang: 0, oldpeak: 0, slope: 2, ca: 0, thal: 7, target: 1 },
  { age: 52, sex: 1, cp: 2, trestbps: 172, chol: 199, fbs: 1, restecg: 1, thalach: 162, exang: 0, oldpeak: 0.5, slope: 2, ca: 0, thal: 7, target: 1 },
  { age: 57, sex: 1, cp: 2, trestbps: 150, chol: 168, fbs: 0, restecg: 1, thalach: 174, exang: 0, oldpeak: 1.6, slope: 2, ca: 0, thal: 3, target: 1 },
  { age: 54, sex: 1, cp: 0, trestbps: 140, chol: 239, fbs: 0, restecg: 1, thalach: 160, exang: 0, oldpeak: 1.2, slope: 2, ca: 0, thal: 3, target: 1 },
  { age: 48, sex: 0, cp: 2, trestbps: 130, chol: 275, fbs: 0, restecg: 1, thalach: 139, exang: 0, oldpeak: 0.2, slope: 2, ca: 0, thal: 3, target: 1 },
  { age: 49, sex: 1, cp: 1, trestbps: 130, chol: 266, fbs: 0, restecg: 1, thalach: 171, exang: 0, oldpeak: 0.6, slope: 2, ca: 0, thal: 3, target: 1 },
  { age: 64, sex: 1, cp: 3, trestbps: 110, chol: 211, fbs: 0, restecg: 0, thalach: 144, exang: 1, oldpeak: 1.8, slope: 1, ca: 0, thal: 3, target: 1 },
  { age: 58, sex: 0, cp: 3, trestbps: 150, chol: 283, fbs: 1, restecg: 0, thalach: 162, exang: 0, oldpeak: 1, slope: 2, ca: 0, thal: 3, target: 1 },
  { age: 50, sex: 0, cp: 2, trestbps: 120, chol: 219, fbs: 0, restecg: 1, thalach: 158, exang: 0, oldpeak: 1.6, slope: 1, ca: 0, thal: 3, target: 1 },
  { age: 58, sex: 0, cp: 2, trestbps: 120, chol: 340, fbs: 0, restecg: 1, thalach: 172, exang: 0, oldpeak: 0, slope: 2, ca: 0, thal: 3, target: 1 },
  { age: 66, sex: 0, cp: 3, trestbps: 150, chol: 226, fbs: 0, restecg: 1, thalach: 114, exang: 0, oldpeak: 2.6, slope: 0, ca: 0, thal: 3, target: 1 },
  { age: 43, sex: 1, cp: 0, trestbps: 150, chol: 247, fbs: 0, restecg: 1, thalach: 171, exang: 0, oldpeak: 1.5, slope: 2, ca: 0, thal: 3, target: 1 },
  { age: 69, sex: 0, cp: 3, trestbps: 140, chol: 239, fbs: 0, restecg: 1, thalach: 151, exang: 0, oldpeak: 1.8, slope: 2, ca: 2, thal: 3, target: 1 },
  { age: 59, sex: 1, cp: 0, trestbps: 135, chol: 234, fbs: 0, restecg: 1, thalach: 161, exang: 0, oldpeak: 0.5, slope: 1, ca: 0, thal: 7, target: 1 },
  { age: 44, sex: 1, cp: 2, trestbps: 130, chol: 233, fbs: 0, restecg: 1, thalach: 179, exang: 1, oldpeak: 0.4, slope: 2, ca: 0, thal: 3, target: 1 },
  { age: 42, sex: 1, cp: 0, trestbps: 140, chol: 226, fbs: 0, restecg: 1, thalach: 178, exang: 0, oldpeak: 0, slope: 2, ca: 0, thal: 3, target: 1 },
  { age: 61, sex: 1, cp: 2, trestbps: 150, chol: 243, fbs: 1, restecg: 1, thalach: 137, exang: 1, oldpeak: 1, slope: 1, ca: 0, thal: 3, target: 1 },
  { age: 40, sex: 1, cp: 3, trestbps: 140, chol: 199, fbs: 0, restecg: 1, thalach: 178, exang: 1, oldpeak: 1.4, slope: 2, ca: 0, thal: 7, target: 1 },
  { age: 71, sex: 0, cp: 1, trestbps: 160, chol: 302, fbs: 0, restecg: 1, thalach: 162, exang: 0, oldpeak: 0.4, slope: 2, ca: 2, thal: 3, target: 1 },
  { age: 59, sex: 1, cp: 2, trestbps: 150, chol: 212, fbs: 1, restecg: 1, thalach: 157, exang: 0, oldpeak: 1.6, slope: 2, ca: 0, thal: 3, target: 1 },
  { age: 51, sex: 1, cp: 2, trestbps: 110, chol: 175, fbs: 0, restecg: 1, thalach: 123, exang: 0, oldpeak: 0.6, slope: 2, ca: 0, thal: 3, target: 1 },
  { age: 65, sex: 0, cp: 2, trestbps: 140, chol: 417, fbs: 1, restecg: 0, thalach: 157, exang: 0, oldpeak: 0.8, slope: 2, ca: 1, thal: 3, target: 1 },
  { age: 53, sex: 1, cp: 2, trestbps: 130, chol: 197, fbs: 1, restecg: 0, thalach: 152, exang: 0, oldpeak: 1.2, slope: 0, ca: 0, thal: 3, target: 1 },
  // Negative cases (no heart disease)
  { age: 67, sex: 1, cp: 0, trestbps: 160, chol: 286, fbs: 0, restecg: 0, thalach: 108, exang: 1, oldpeak: 1.5, slope: 1, ca: 3, thal: 3, target: 0 },
  { age: 67, sex: 1, cp: 0, trestbps: 120, chol: 229, fbs: 0, restecg: 0, thalach: 129, exang: 1, oldpeak: 2.6, slope: 1, ca: 2, thal: 7, target: 0 },
  { age: 62, sex: 0, cp: 0, trestbps: 140, chol: 268, fbs: 0, restecg: 0, thalach: 160, exang: 0, oldpeak: 3.6, slope: 0, ca: 2, thal: 3, target: 0 },
  { age: 63, sex: 1, cp: 0, trestbps: 130, chol: 254, fbs: 0, restecg: 0, thalach: 147, exang: 0, oldpeak: 1.4, slope: 1, ca: 1, thal: 7, target: 0 },
  { age: 53, sex: 1, cp: 0, trestbps: 140, chol: 203, fbs: 1, restecg: 0, thalach: 155, exang: 1, oldpeak: 3.1, slope: 0, ca: 0, thal: 7, target: 0 },
  { age: 56, sex: 1, cp: 2, trestbps: 130, chol: 256, fbs: 1, restecg: 0, thalach: 142, exang: 1, oldpeak: 0.6, slope: 1, ca: 1, thal: 6, target: 0 },
  { age: 48, sex: 1, cp: 1, trestbps: 110, chol: 229, fbs: 0, restecg: 1, thalach: 168, exang: 0, oldpeak: 1, slope: 0, ca: 0, thal: 7, target: 0 },
  { age: 58, sex: 1, cp: 1, trestbps: 120, chol: 284, fbs: 0, restecg: 0, thalach: 160, exang: 0, oldpeak: 1.8, slope: 1, ca: 0, thal: 3, target: 0 },
  { age: 58, sex: 1, cp: 2, trestbps: 132, chol: 224, fbs: 0, restecg: 0, thalach: 173, exang: 0, oldpeak: 3.2, slope: 2, ca: 2, thal: 7, target: 0 },
  { age: 60, sex: 1, cp: 0, trestbps: 130, chol: 206, fbs: 0, restecg: 0, thalach: 132, exang: 1, oldpeak: 2.4, slope: 1, ca: 2, thal: 7, target: 0 },
  { age: 40, sex: 1, cp: 0, trestbps: 110, chol: 167, fbs: 0, restecg: 0, thalach: 114, exang: 1, oldpeak: 2, slope: 1, ca: 0, thal: 7, target: 0 },
  { age: 60, sex: 1, cp: 0, trestbps: 117, chol: 230, fbs: 1, restecg: 1, thalach: 160, exang: 1, oldpeak: 1.4, slope: 2, ca: 2, thal: 7, target: 0 },
  { age: 64, sex: 1, cp: 2, trestbps: 140, chol: 335, fbs: 0, restecg: 1, thalach: 158, exang: 0, oldpeak: 0, slope: 2, ca: 0, thal: 3, target: 0 },
  { age: 43, sex: 1, cp: 0, trestbps: 120, chol: 177, fbs: 0, restecg: 0, thalach: 120, exang: 1, oldpeak: 2.5, slope: 1, ca: 0, thal: 7, target: 0 },
  { age: 57, sex: 1, cp: 0, trestbps: 150, chol: 276, fbs: 0, restecg: 0, thalach: 112, exang: 1, oldpeak: 0.6, slope: 1, ca: 1, thal: 6, target: 0 },
  { age: 55, sex: 1, cp: 0, trestbps: 132, chol: 353, fbs: 0, restecg: 1, thalach: 132, exang: 1, oldpeak: 1.2, slope: 1, ca: 1, thal: 7, target: 0 },
  { age: 65, sex: 0, cp: 0, trestbps: 150, chol: 225, fbs: 0, restecg: 0, thalach: 114, exang: 0, oldpeak: 1, slope: 1, ca: 3, thal: 7, target: 0 },
  { age: 61, sex: 0, cp: 0, trestbps: 130, chol: 330, fbs: 0, restecg: 0, thalach: 169, exang: 0, oldpeak: 0, slope: 2, ca: 0, thal: 3, target: 0 },
  { age: 58, sex: 1, cp: 2, trestbps: 112, chol: 230, fbs: 0, restecg: 0, thalach: 165, exang: 0, oldpeak: 2.5, slope: 1, ca: 1, thal: 7, target: 0 },
  { age: 50, sex: 1, cp: 0, trestbps: 150, chol: 243, fbs: 0, restecg: 0, thalach: 128, exang: 0, oldpeak: 2.6, slope: 1, ca: 0, thal: 7, target: 0 },
  { age: 44, sex: 1, cp: 0, trestbps: 112, chol: 290, fbs: 0, restecg: 0, thalach: 153, exang: 0, oldpeak: 0, slope: 2, ca: 1, thal: 3, target: 0 },
  { age: 60, sex: 1, cp: 0, trestbps: 130, chol: 253, fbs: 0, restecg: 1, thalach: 144, exang: 1, oldpeak: 1.4, slope: 2, ca: 1, thal: 7, target: 0 },
  { age: 54, sex: 1, cp: 0, trestbps: 124, chol: 266, fbs: 0, restecg: 0, thalach: 109, exang: 1, oldpeak: 2.2, slope: 1, ca: 1, thal: 7, target: 0 },
  { age: 50, sex: 1, cp: 2, trestbps: 140, chol: 233, fbs: 0, restecg: 0, thalach: 163, exang: 0, oldpeak: 0.6, slope: 1, ca: 1, thal: 7, target: 0 },
  { age: 41, sex: 1, cp: 0, trestbps: 110, chol: 172, fbs: 0, restecg: 0, thalach: 158, exang: 0, oldpeak: 0, slope: 2, ca: 0, thal: 7, target: 0 },
  { age: 51, sex: 0, cp: 0, trestbps: 130, chol: 305, fbs: 0, restecg: 1, thalach: 142, exang: 1, oldpeak: 1.2, slope: 1, ca: 0, thal: 7, target: 0 },
  { age: 58, sex: 1, cp: 0, trestbps: 128, chol: 216, fbs: 0, restecg: 0, thalach: 131, exang: 1, oldpeak: 2.2, slope: 1, ca: 3, thal: 7, target: 0 },
  { age: 54, sex: 0, cp: 0, trestbps: 135, chol: 304, fbs: 1, restecg: 1, thalach: 170, exang: 0, oldpeak: 0, slope: 2, ca: 0, thal: 3, target: 0 },
  { age: 60, sex: 1, cp: 0, trestbps: 120, chol: 178, fbs: 1, restecg: 1, thalach: 96, exang: 0, oldpeak: 0, slope: 2, ca: 0, thal: 7, target: 0 },
  { age: 47, sex: 1, cp: 0, trestbps: 110, chol: 275, fbs: 0, restecg: 0, thalach: 118, exang: 1, oldpeak: 1, slope: 1, ca: 1, thal: 3, target: 0 },
  { age: 50, sex: 0, cp: 0, trestbps: 110, chol: 254, fbs: 0, restecg: 0, thalach: 159, exang: 0, oldpeak: 0, slope: 2, ca: 0, thal: 3, target: 0 },
];

export const featureLabels = {
  age: 'Age',
  sex: 'Sex',
  cp: 'Chest Pain Type',
  trestbps: 'Resting Blood Pressure',
  chol: 'Cholesterol',
  fbs: 'Fasting Blood Sugar',
  restecg: 'Resting ECG',
  thalach: 'Max Heart Rate',
  exang: 'Exercise Angina',
  oldpeak: 'ST Depression',
  slope: 'ST Slope',
  ca: 'Major Vessels',
  thal: 'Thalassemia'
};

export const featureDescriptions = {
  age: 'Age in years',
  sex: '1 = male, 0 = female',
  cp: 'Chest pain type (0: typical angina, 1: atypical angina, 2: non-anginal pain, 3: asymptomatic)',
  trestbps: 'Resting blood pressure (mm Hg)',
  chol: 'Serum cholesterol (mg/dl)',
  fbs: 'Fasting blood sugar > 120 mg/dl (1 = true, 0 = false)',
  restecg: 'Resting ECG results (0: normal, 1: ST-T wave abnormality, 2: left ventricular hypertrophy)',
  thalach: 'Maximum heart rate achieved',
  exang: 'Exercise induced angina (1 = yes, 0 = no)',
  oldpeak: 'ST depression induced by exercise relative to rest',
  slope: 'Slope of peak exercise ST segment (0: upsloping, 1: flat, 2: downsloping)',
  ca: 'Number of major vessels (0-3) colored by fluoroscopy',
  thal: 'Thalassemia (3: normal, 6: fixed defect, 7: reversible defect)'
};