export interface HeartDiseaseType {
  id: string;
  name: string;
  description: string;
  symptoms: string[];
  causes: string[];
  riskFactors: string[];
  treatment: string[];
  prognosis: string;
  severity: 'Low' | 'Moderate' | 'High' | 'Critical';
}

export const heartDiseaseTypes: HeartDiseaseType[] = [
  {
    id: 'coronary_artery_disease',
    name: 'Coronary Artery Disease (CAD)',
    description: 'The most common type of heart disease, occurring when the coronary arteries that supply blood to the heart muscle become narrowed or blocked by plaque buildup (atherosclerosis).',
    symptoms: [
      'Chest pain or discomfort (angina)',
      'Shortness of breath',
      'Fatigue during physical activity',
      'Heart palpitations',
      'Weakness or dizziness',
      'Nausea'
    ],
    causes: [
      'Atherosclerosis (plaque buildup in arteries)',
      'High cholesterol levels',
      'High blood pressure',
      'Smoking',
      'Diabetes',
      'Inflammation of arteries'
    ],
    riskFactors: [
      'Age (men over 45, women over 55)',
      'Family history of heart disease',
      'High cholesterol',
      'High blood pressure',
      'Smoking',
      'Diabetes',
      'Obesity',
      'Physical inactivity',
      'Unhealthy diet',
      'Stress'
    ],
    treatment: [
      'Lifestyle changes (diet, exercise, smoking cessation)',
      'Medications (statins, beta-blockers, ACE inhibitors)',
      'Angioplasty and stent placement',
      'Coronary artery bypass surgery',
      'Cardiac rehabilitation programs'
    ],
    prognosis: 'With proper treatment and lifestyle changes, many people with CAD can live normal, active lives. Early detection and treatment significantly improve outcomes.',
    severity: 'High'
  },
  {
    id: 'heart_failure',
    name: 'Heart Failure (Congestive Heart Failure)',
    description: 'A condition where the heart cannot pump blood effectively to meet the body\'s needs. The heart may be too weak or too stiff to pump properly.',
    symptoms: [
      'Shortness of breath during activity or at rest',
      'Fatigue and weakness',
      'Swelling in legs, ankles, and feet',
      'Rapid or irregular heartbeat',
      'Persistent cough with white or pink phlegm',
      'Sudden weight gain from fluid retention',
      'Difficulty concentrating'
    ],
    causes: [
      'Coronary artery disease',
      'High blood pressure',
      'Heart attack damage',
      'Cardiomyopathy',
      'Heart valve disease',
      'Congenital heart defects',
      'Viral infections of the heart'
    ],
    riskFactors: [
      'Coronary artery disease',
      'High blood pressure',
      'Previous heart attack',
      'Diabetes',
      'Sleep apnea',
      'Obesity',
      'Tobacco use',
      'Alcohol abuse'
    ],
    treatment: [
      'ACE inhibitors or ARBs',
      'Beta-blockers',
      'Diuretics (water pills)',
      'Aldosterone antagonists',
      'Lifestyle modifications',
      'Implantable devices (pacemaker, defibrillator)',
      'Heart transplant (severe cases)'
    ],
    prognosis: 'Varies widely depending on the cause and severity. With proper treatment, many people can manage symptoms and maintain quality of life.',
    severity: 'High'
  },
  {
    id: 'arrhythmia',
    name: 'Arrhythmia (Irregular Heartbeat)',
    description: 'A condition where the heart beats too fast, too slow, or with an irregular rhythm due to problems with the heart\'s electrical system.',
    symptoms: [
      'Palpitations (feeling of skipped or extra heartbeats)',
      'Rapid heartbeat (tachycardia)',
      'Slow heartbeat (bradycardia)',
      'Chest pain',
      'Shortness of breath',
      'Dizziness or lightheadedness',
      'Fainting (syncope)',
      'Fatigue'
    ],
    causes: [
      'Heart disease',
      'Electrolyte imbalances',
      'Thyroid disorders',
      'Medications',
      'Caffeine or alcohol excess',
      'Stress',
      'Smoking',
      'Congenital heart defects'
    ],
    riskFactors: [
      'Heart disease',
      'High blood pressure',
      'Thyroid disease',
      'Sleep apnea',
      'Diabetes',
      'Excessive alcohol or caffeine',
      'Drug abuse',
      'Stress',
      'Age'
    ],
    treatment: [
      'Antiarrhythmic medications',
      'Blood thinners (for atrial fibrillation)',
      'Cardioversion (electrical shock therapy)',
      'Catheter ablation',
      'Pacemaker implantation',
      'Implantable cardioverter defibrillator (ICD)',
      'Lifestyle modifications'
    ],
    prognosis: 'Most arrhythmias are manageable with treatment. Some are harmless while others can be life-threatening if untreated.',
    severity: 'Moderate'
  },
  {
    id: 'heart_valve_disease',
    name: 'Heart Valve Disease',
    description: 'A condition where one or more of the heart\'s four valves don\'t work properly, either not opening fully (stenosis) or not closing completely (regurgitation).',
    symptoms: [
      'Shortness of breath during activity or lying down',
      'Chest pain',
      'Fatigue',
      'Dizziness or fainting',
      'Heart palpitations',
      'Swelling in ankles, feet, or abdomen',
      'Heart murmur'
    ],
    causes: [
      'Congenital heart defects',
      'Rheumatic fever',
      'Infections (endocarditis)',
      'Age-related wear and tear',
      'Heart attack',
      'Cardiomyopathy',
      'Radiation therapy'
    ],
    riskFactors: [
      'Age',
      'History of rheumatic fever',
      'Congenital heart disease',
      'Heart attack',
      'High blood pressure',
      'High cholesterol',
      'Diabetes',
      'Previous heart infection'
    ],
    treatment: [
      'Medications (diuretics, blood thinners, blood pressure medications)',
      'Valve repair surgery',
      'Valve replacement surgery',
      'Balloon valvuloplasty',
      'Transcatheter valve procedures',
      'Regular monitoring and follow-up'
    ],
    prognosis: 'Depends on the specific valve affected and severity. Many valve problems can be successfully treated with surgery or procedures.',
    severity: 'Moderate'
  },
  {
    id: 'cardiomyopathy',
    name: 'Cardiomyopathy',
    description: 'A disease of the heart muscle where the heart becomes enlarged, thick, or rigid, making it harder for the heart to pump blood effectively.',
    symptoms: [
      'Shortness of breath',
      'Fatigue',
      'Swelling in legs, ankles, and feet',
      'Bloating of the abdomen',
      'Cough while lying down',
      'Difficulty lying flat to sleep',
      'Dizziness, lightheadedness, and fainting',
      'Chest pain',
      'Heart palpitations'
    ],
    causes: [
      'Genetic conditions',
      'Long-term high blood pressure',
      'Heart tissue damage from heart attack',
      'Chronic rapid heart rate',
      'Heart valve problems',
      'Metabolic disorders',
      'Nutritional deficiencies',
      'Pregnancy complications',
      'Alcohol abuse',
      'Certain chemotherapy drugs'
    ],
    riskFactors: [
      'Family history of cardiomyopathy',
      'High blood pressure',
      'Previous heart attack',
      'Coronary artery disease',
      'Diabetes',
      'Thyroid disease',
      'Obesity',
      'Long-term alcohol abuse',
      'Illegal drug use'
    ],
    treatment: [
      'Medications (ACE inhibitors, beta-blockers, diuretics)',
      'Implanted devices (pacemaker, ICD)',
      'Lifestyle changes',
      'Surgery (septal myectomy)',
      'Heart transplant (severe cases)',
      'Alcohol septal ablation'
    ],
    prognosis: 'Varies by type and severity. Some forms are mild and require minimal treatment, while others can be life-threatening.',
    severity: 'High'
  },
  {
    id: 'congenital_heart_disease',
    name: 'Congenital Heart Disease',
    description: 'Heart defects that are present at birth, affecting the structure and function of the heart. These can range from simple defects with no symptoms to complex problems that are life-threatening.',
    symptoms: [
      'Blue-tinted skin, lips, and fingernails (cyanosis)',
      'Shortness of breath during feeding or exercise',
      'Poor weight gain',
      'Fatigue during exercise',
      'Heart murmur',
      'Swelling in legs, abdomen, or around eyes',
      'Irregular heartbeat'
    ],
    causes: [
      'Genetic factors',
      'Environmental factors during pregnancy',
      'Maternal infections during pregnancy',
      'Maternal diabetes',
      'Certain medications during pregnancy',
      'Alcohol use during pregnancy',
      'Unknown causes (most cases)'
    ],
    riskFactors: [
      'Family history of congenital heart disease',
      'Genetic conditions (Down syndrome)',
      'Maternal diabetes',
      'Maternal rubella infection',
      'Maternal age over 40',
      'Certain medications during pregnancy'
    ],
    treatment: [
      'Regular monitoring (mild defects)',
      'Medications',
      'Catheter procedures',
      'Open-heart surgery',
      'Heart transplant (severe cases)',
      'Lifelong cardiology care'
    ],
    prognosis: 'Varies greatly depending on the type and severity of the defect. Many people with congenital heart disease live normal, active lives with proper treatment.',
    severity: 'Moderate'
  }
];

export function predictHeartDiseaseType(patientData: any, riskProbability: number): HeartDiseaseType {
  // Advanced rule-based prediction with weighted scoring system
  const age = patientData.age;
  const isMale = patientData.sex === 1;
  const hasChestPain = patientData.cp > 0;
  const chestPainType = patientData.cp;
  const hasHighBP = patientData.trestbps > 140;
  const hasVeryHighBP = patientData.trestbps > 160;
  const hasHighCholesterol = patientData.chol > 240;
  const hasVeryHighCholesterol = patientData.chol > 300;
  const hasExerciseAngina = patientData.exang === 1;
  const hasAbnormalECG = patientData.restecg > 0;
  const hasSTAbnormality = patientData.restecg === 1;
  const hasLVHypertrophy = patientData.restecg === 2;
  const lowMaxHeartRate = patientData.thalach < 120;
  const veryLowMaxHeartRate = patientData.thalach < 100;
  const hasSTDepression = patientData.oldpeak > 1;
  const significantSTDepression = patientData.oldpeak > 2;
  const hasMajorVessels = patientData.ca > 0;
  const multipleMajorVessels = patientData.ca > 1;
  const hasThalassemiaDefect = patientData.thal === 6 || patientData.thal === 7;
  const hasReversibleDefect = patientData.thal === 7;
  const hasFixedDefect = patientData.thal === 6;
  const flatSTSlope = patientData.slope === 1;
  const downSlopingSTSlope = patientData.slope === 0;
  const hasHighFBS = patientData.fbs === 1;

  // Advanced weighted scoring system for different heart disease types
  let cadScore = 0;
  let heartFailureScore = 0;
  let arrhythmiaScore = 0;
  let valveScore = 0;
  let cardiomyopathyScore = 0;
  let congenitalScore = 0;

  // CAD (Coronary Artery Disease) scoring - focuses on atherosclerosis indicators
  if (chestPainType === 0) cadScore += 4; // Typical angina is classic CAD symptom
  if (chestPainType === 1) cadScore += 3; // Atypical angina
  if (hasVeryHighCholesterol) cadScore += 4;
  else if (hasHighCholesterol) cadScore += 2;
  if (hasExerciseAngina) cadScore += 4; // Strong CAD indicator
  if (multipleMajorVessels) cadScore += 5; // Multiple vessel disease
  else if (hasMajorVessels) cadScore += 3;
  if (significantSTDepression) cadScore += 3;
  if (age > 60 && isMale) cadScore += 3;
  if (age > 65) cadScore += 2;
  if (hasHighFBS) cadScore += 2; // Diabetes increases CAD risk
  if (downSlopingSTSlope) cadScore += 2;

  // Heart Failure scoring - focuses on pump dysfunction
  if (veryLowMaxHeartRate) heartFailureScore += 4;
  else if (lowMaxHeartRate) heartFailureScore += 2;
  if (hasHighBP) heartFailureScore += 2;
  if (hasVeryHighBP) heartFailureScore += 3;
  if (hasSTDepression) heartFailureScore += 3;
  if (age > 70) heartFailureScore += 3;
  if (chestPainType === 3) heartFailureScore += 2; // Asymptomatic - advanced disease
  if (hasLVHypertrophy) heartFailureScore += 4; // Strong heart failure indicator
  if (patientData.trestbps > 180) heartFailureScore += 3; // Severe hypertension
  if (hasReversibleDefect) heartFailureScore += 2;

  // Arrhythmia scoring - focuses on electrical conduction issues
  if (hasSTAbnormality) arrhythmiaScore += 4; // ECG abnormalities
  if (hasLVHypertrophy) arrhythmiaScore += 2;
  if (flatSTSlope) arrhythmiaScore += 2;
  if (hasThalassemiaDefect) arrhythmiaScore += 2;
  if (patientData.thalach > 180) arrhythmiaScore += 3; // Very high heart rate
  if (patientData.thalach < 60 && age < 50) arrhythmiaScore += 3; // Bradycardia in young
  if (age > 75) arrhythmiaScore += 2; // Age-related conduction issues
  if (hasHighBP && hasAbnormalECG) arrhythmiaScore += 2;

  // Valve disease scoring - focuses on structural heart problems
  if (chestPainType === 2) valveScore += 3; // Non-anginal pain common in valve disease
  if (age > 70) valveScore += 4; // Age-related valve degeneration
  if (age > 60) valveScore += 2;
  if (hasAbnormalECG && !hasExerciseAngina) valveScore += 2;
  if (lowMaxHeartRate && !hasExerciseAngina) valveScore += 3; // Valve limitation
  if (hasHighBP && age > 65) valveScore += 2; // Aortic stenosis pattern
  if (patientData.oldpeak < 1 && hasChestPain) valveScore += 2; // Less ischemic pattern

  // Cardiomyopathy scoring - focuses on heart muscle disease
  if (veryLowMaxHeartRate) cardiomyopathyScore += 4;
  else if (lowMaxHeartRate) cardiomyopathyScore += 2;
  if (significantSTDepression) cardiomyopathyScore += 3;
  else if (hasSTDepression) cardiomyopathyScore += 2;
  if (hasHighBP) cardiomyopathyScore += 1;
  if (hasLVHypertrophy) cardiomyopathyScore += 4; // Classic cardiomyopathy sign
  if (chestPainType === 3 && lowMaxHeartRate) cardiomyopathyScore += 3;
  if (age < 50 && (hasSTDepression || lowMaxHeartRate)) cardiomyopathyScore += 3;
  if (hasFixedDefect) cardiomyopathyScore += 2;
  if (isMale && age < 55) cardiomyopathyScore += 1;

  // Congenital heart disease scoring - more likely in younger patients
  if (age < 40) congenitalScore += 3;
  if (age < 30) congenitalScore += 2;
  if (hasAbnormalECG && age < 45) congenitalScore += 2;
  if (lowMaxHeartRate && age < 40) congenitalScore += 2;
  if (chestPainType === 2 && age < 35) congenitalScore += 2; // Non-anginal pain in young
  if (hasThalassemiaDefect && age < 50) congenitalScore += 2;

  // Determine most likely type based on highest score
  const scores = [
    { type: heartDiseaseTypes[0], score: cadScore }, // CAD
    { type: heartDiseaseTypes[1], score: heartFailureScore }, // Heart Failure
    { type: heartDiseaseTypes[2], score: arrhythmiaScore }, // Arrhythmia
    { type: heartDiseaseTypes[3], score: valveScore }, // Valve Disease
    { type: heartDiseaseTypes[4], score: cardiomyopathyScore }, // Cardiomyopathy
    { type: heartDiseaseTypes[5], score: congenitalScore } // Congenital
  ];

  // Sort by score and return the highest scoring type
  scores.sort((a, b) => b.score - a.score);
  
  // If risk is very low and no clear pattern, default to CAD as it's most common
  if (riskProbability < 0.2 && scores[0].score < 3) {
    return heartDiseaseTypes[0]; // CAD
  }

  // If scores are tied, use additional logic
  if (scores[0].score === scores[1].score) {
    // Tie-breaking logic based on age and risk factors
    if (age > 65) return heartDiseaseTypes[0]; // CAD more common in elderly
    if (age < 40) return heartDiseaseTypes[5]; // Congenital more likely in young
    if (hasExerciseAngina) return heartDiseaseTypes[0]; // CAD
    if (hasLVHypertrophy) return heartDiseaseTypes[1]; // Heart Failure
  }

  return scores[0].type;
}