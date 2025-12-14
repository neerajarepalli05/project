import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Bot, User, Heart } from 'lucide-react';
import { database, ChatMessage } from '../utils/supabase';

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

interface MedicalChatbotProps {
  user: { id: string; email: string; name: string } | null;
}

const MedicalChatbot: React.FC<MedicalChatbotProps> = ({ user }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Hello${user ? ` ${user.name}` : ''}! I'm your AI medical assistant. I can help answer questions about heart disease, symptoms, risk factors, and general cardiovascular health. How can I assist you today?`,
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history
  useEffect(() => {
    const loadChatHistory = async () => {
      if (user) {
        try {
          const history = await database.getChatHistory(user.id);
          // Add recent chat history to messages if needed
        } catch (error) {
          console.error('Error loading chat history:', error);
        }
      }
    };
    loadChatHistory();
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const medicalKnowledge = {
    // Symptoms and Conditions
    'chest pain': 'Chest pain can indicate various heart conditions:\n\n**Types of Chest Pain:**\n• **Angina**: Pressure/squeezing, often triggered by exertion, relieved by rest\n• **Heart Attack**: Severe, crushing pain lasting >20 minutes, may radiate\n• **Pericarditis**: Sharp, stabbing pain that worsens when lying down or breathing deeply\n• **Aortic Dissection**: Sudden, tearing pain radiating to back (medical emergency)\n• **Costochondritis**: Chest wall pain, tender to touch\n• **GERD**: Burning sensation, often after eating\n\n**Atypical Presentations** (especially in women, elderly, diabetics):\n• Jaw, neck, or arm pain\n• Nausea, vomiting, fatigue\n• Shortness of breath without chest pain\n• Upper back or shoulder pain\n\n**Red Flags**: Pain with shortness of breath, nausea, sweating, or radiation to arm/jaw requires immediate medical attention.',
    
    'heart attack': 'A heart attack (myocardial infarction) occurs when coronary arteries are blocked:\n\n**Classic Symptoms:**\n• Severe chest pressure/pain (>20 minutes)\n• Pain radiating to left arm, jaw, neck, or back\n• Shortness of breath\n• Nausea, vomiting, sweating\n• Lightheadedness or fainting\n• Sense of impending doom\n\n**Atypical Symptoms** (especially in women, elderly, diabetics):\n• Extreme fatigue without chest pain\n• Indigestion-like discomfort\n• Upper back or shoulder pain\n• Jaw or tooth pain\n• Shortness of breath alone\n\n**Types of Heart Attacks:**\n• **STEMI**: Complete artery blockage, more severe\n• **NSTEMI**: Partial blockage, less severe but still serious\n• **Silent MI**: Minimal symptoms, often unrecognized\n\n**Immediate Action**: Call 911 immediately. Chew 325mg aspirin if not allergic. Stay calm, sit upright.',
    
    'angina': 'Angina is chest pain due to reduced blood flow to the heart:\n\n**Stable Angina:**\n• Predictable, triggered by exertion/stress/cold weather\n• Relieved by rest or nitroglycerin within 5 minutes\n• Usually lasts 2-5 minutes\n• Same pattern each time\n• Manageable with medication\n\n**Unstable Angina:**\n• Unpredictable, occurs at rest or with minimal exertion\n• More severe and prolonged (>20 minutes)\n• Not relieved by rest or nitroglycerin\n• Medical emergency - may precede heart attack\n• Requires immediate hospitalization\n\n**Variant (Prinzmetal) Angina:**\n• Caused by coronary artery spasm\n• Often occurs at rest, especially at night\n• May cause dangerous arrhythmias\n\n**Treatment**: \n• Medications: Nitrates, beta-blockers, calcium channel blockers\n• Lifestyle changes: Diet, exercise, stress management\n• Procedures: Angioplasty, stenting, bypass surgery\n• Emergency plan with nitroglycerin',
    
    'arrhythmia': 'Arrhythmias are irregular heart rhythms:\n\n**Types:**\n• **Tachycardia**: Fast heart rate (>100 bpm)\n• **Bradycardia**: Slow heart rate (<60 bpm)\n• **Atrial Fibrillation**: Irregular, rapid atrial contractions\n• **Ventricular Fibrillation**: Life-threatening, requires immediate defibrillation\n\n**Symptoms**: Palpitations, dizziness, shortness of breath, chest pain, fainting\n\n**Treatment**: Medications, cardioversion, ablation, pacemaker/ICD implantation.',
    
    // Risk Factors and Prevention
    'high blood pressure': 'Hypertension is a major cardiovascular risk factor:\n\n**Classifications:**\n• Normal: <120/80 mmHg\n• Elevated: 120-129/<80 mmHg\n• Stage 1: 130-139/80-89 mmHg\n• Stage 2: ≥140/90 mmHg\n• Crisis: >180/120 mmHg (emergency)\n\n**Management:**\n• DASH diet (low sodium, high potassium)\n• Regular exercise (150 min/week)\n• Weight management\n• Limit alcohol\n• Medications: ACE inhibitors, ARBs, diuretics, calcium channel blockers',
    
    'cholesterol': 'Cholesterol management is crucial for heart health:\n\n**Target Levels:**\n• **Total Cholesterol**: <200 mg/dL\n• **LDL (Bad)**: <100 mg/dL (<70 for high risk)\n• **HDL (Good)**: >40 mg/dL (men), >50 mg/dL (women)\n• **Triglycerides**: <150 mg/dL\n\n**Management:**\n• Reduce saturated/trans fats\n• Increase fiber intake\n• Regular exercise\n• Statins if lifestyle changes insufficient\n• Monitor with lipid panel every 4-6 years',
    
    'diabetes': 'Diabetes significantly increases cardiovascular risk:\n\n**Cardiovascular Complications:**\n• 2-4x higher risk of heart disease\n• Accelerated atherosclerosis\n• Increased risk of stroke\n• Peripheral artery disease\n\n**Management:**\n• **HbA1c target**: <7% (individualized)\n• Blood pressure <130/80 mmHg\n• LDL cholesterol <70 mg/dL\n• Aspirin therapy (if appropriate)\n• Regular cardiovascular screening',
    
    // Lifestyle and Prevention
    'exercise': 'Exercise is medicine for the heart:\n\n**Recommendations:**\n• **Aerobic**: 150 min moderate OR 75 min vigorous weekly\n• **Strength Training**: 2+ days/week\n• **Examples**: Brisk walking, swimming, cycling, dancing\n\n**Benefits:**\n• Lowers blood pressure and cholesterol\n• Improves insulin sensitivity\n• Strengthens heart muscle\n• Reduces inflammation\n• Helps weight management\n\n**Getting Started**: Consult doctor, start slowly, gradually increase intensity',
    
    'diet': 'Heart-healthy nutrition guidelines:\n\n**Mediterranean/DASH Diet Principles:**\n• **Emphasize**: Fruits, vegetables, whole grains, lean proteins, nuts, olive oil\n• **Limit**: Saturated fats, trans fats, sodium (<2300mg/day), added sugars\n• **Fish**: 2+ servings/week (omega-3 fatty acids)\n• **Fiber**: 25-35g/day\n\n**Specific Foods:**\n• **Good**: Salmon, avocados, berries, leafy greens, oats\n• **Limit**: Processed meats, fried foods, sugary drinks',
    
    'smoking': 'Smoking cessation has immediate and long-term benefits:\n\n**Cardiovascular Risks of Smoking:**\n• Damages blood vessel walls\n• Increases blood clotting\n• Reduces oxygen in blood\n• Raises blood pressure and heart rate\n• Accelerates atherosclerosis\n\n**Benefits of Quitting:**\n• **20 minutes**: Heart rate and BP drop\n• **12 hours**: CO levels normalize\n• **1 year**: Heart disease risk cut in half\n• **5 years**: Stroke risk equals non-smoker\n\n**Cessation aids**: Nicotine replacement, medications, counseling',
    
    // Medications and Treatments
    'medication': 'Common cardiovascular medications:\n\n**Blood Pressure:**\n• **ACE Inhibitors**: Lisinopril, enalapril\n• **ARBs**: Losartan, valsartan\n• **Beta-blockers**: Metoprolol, atenolol\n• **Diuretics**: Hydrochlorothiazide, furosemide\n\n**Cholesterol:**\n• **Statins**: Atorvastatin, simvastatin\n• **PCSK9 inhibitors**: For high-risk patients\n\n**Blood Thinners:**\n• **Aspirin**: Low-dose for prevention\n• **Warfarin/DOACs**: For atrial fibrillation\n\n**Always take as prescribed and discuss side effects with your doctor.**',
    
    'statin': 'Statins are cholesterol-lowering medications:\n\n**How They Work:**\n• Block HMG-CoA reductase enzyme\n• Reduce cholesterol production in liver\n• Also have anti-inflammatory effects\n\n**Common Statins:**\n• Atorvastatin (Lipitor)\n• Simvastatin (Zocor)\n• Rosuvastatin (Crestor)\n\n**Side Effects:**\n• Muscle pain (rare but serious: rhabdomyolysis)\n• Liver enzyme elevation\n• Diabetes risk (small increase)\n\n**Monitoring**: Lipid panel and liver enzymes',
    
    // Emergency and Procedures
    'emergency': '🚨 **CARDIOVASCULAR EMERGENCIES - CALL 911:**\n\n**Heart Attack Signs:**\n• Severe chest pain >20 minutes\n• Pain radiating to arm, jaw, neck\n• Shortness of breath, nausea, sweating\n\n**Stroke Signs (FAST):**\n• **F**ace drooping\n• **A**rm weakness\n• **S**peech difficulty\n• **T**ime to call 911\n\n**Cardiac Arrest:**\n• Unconscious, no pulse\n• Start CPR immediately\n• Use AED if available',
    
    'procedure': 'Common cardiac procedures:\n\n**Diagnostic:**\n• **ECG**: Electrical activity of heart\n• **Echocardiogram**: Ultrasound of heart\n• **Stress Test**: Heart function during exercise\n• **Cardiac Catheterization**: Coronary artery visualization\n\n**Interventional:**\n• **Angioplasty/Stent**: Open blocked arteries\n• **Bypass Surgery**: Reroute blood around blockages\n• **Pacemaker**: Regulate heart rhythm\n• **ICD**: Prevent sudden cardiac death',
    
    // Specific Conditions
    'heart failure': 'Heart failure occurs when the heart cannot pump effectively:\n\n**Types:**\n• **Systolic**: Reduced ejection fraction (<40%)\n• **Diastolic**: Preserved ejection fraction (≥50%)\n\n**Symptoms:**\n• Shortness of breath (especially lying flat)\n• Fatigue, weakness\n• Swelling in legs, ankles, abdomen\n• Rapid weight gain\n\n**Management:**\n• ACE inhibitors/ARBs\n• Beta-blockers\n• Diuretics\n• Lifestyle modifications\n• Device therapy (pacemaker/ICD)',
    
    'valve disease': 'Heart valve disorders affect blood flow:\n\n**Types:**\n• **Stenosis**: Valve doesn\'t open fully\n• **Regurgitation**: Valve doesn\'t close completely\n\n**Common Valve Problems:**\n• **Aortic Stenosis**: Often age-related calcification\n• **Mitral Regurgitation**: Can be functional or structural\n\n**Symptoms**: Shortness of breath, chest pain, fatigue, dizziness\n\n**Treatment**: Monitoring, medications, valve repair/replacement (surgical or transcatheter)',
    
    // Lifestyle and Wellness
    'stress': 'Chronic stress impacts cardiovascular health:\n\n**Stress-Heart Connection:**\n• Increases blood pressure and heart rate\n• Promotes inflammation\n• Can trigger arrhythmias\n• Leads to unhealthy coping behaviors\n\n**Stress Management:**\n• **Relaxation**: Deep breathing, meditation, yoga\n• **Physical Activity**: Regular exercise\n• **Social Support**: Maintain relationships\n• **Professional Help**: Counseling if needed\n• **Time Management**: Prioritize and delegate',
    
    'sleep': 'Sleep quality affects heart health:\n\n**Sleep and Cardiovascular Health:**\n• **Sleep Apnea**: Increases hypertension, arrhythmia risk\n• **Insufficient Sleep**: Linked to obesity, diabetes, hypertension\n• **Optimal Duration**: 7-9 hours for adults\n\n**Sleep Hygiene:**\n• Consistent sleep schedule\n• Cool, dark, quiet environment\n• Avoid screens before bedtime\n• Limit caffeine and alcohol\n• Regular exercise (but not close to bedtime)',
    
    'weight': 'Weight management is crucial for heart health:\n\n**BMI Categories:**\n• Normal: 18.5-24.9\n• Overweight: 25-29.9\n• Obese: ≥30\n\n**Cardiovascular Impact:**\n• Excess weight increases blood pressure\n• Raises cholesterol and triglycerides\n• Increases diabetes risk\n• Strains the heart\n\n**Healthy Weight Loss:**\n• 1-2 pounds per week\n• Combine diet and exercise\n• Focus on sustainable lifestyle changes\n• Consider professional guidance'
  };

  const generateIntelligentResponse = (message: string): string => {
    // Advanced NLP-like response generation
    const keywords = message.split(' ').filter(word => word.length > 2);
    
    // Medical condition detection
    const conditions = ['heart', 'cardiac', 'cardiovascular', 'coronary', 'artery', 'blood', 'pressure', 'cholesterol'];
    const symptoms = ['pain', 'chest', 'breath', 'breathing', 'tired', 'fatigue', 'dizzy', 'palpitation'];
    const treatments = ['medicine', 'medication', 'drug', 'treatment', 'therapy', 'surgery', 'procedure'];
    const lifestyle = ['diet', 'exercise', 'food', 'eat', 'weight', 'smoke', 'alcohol', 'stress'];
    
    const hasCondition = keywords.some(word => conditions.some(cond => word.includes(cond)));
    const hasSymptom = keywords.some(word => symptoms.some(symp => word.includes(symp)));
    const hasTreatment = keywords.some(word => treatments.some(treat => word.includes(treat)));
    const hasLifestyle = keywords.some(word => lifestyle.some(life => word.includes(life)));

    if (hasCondition && hasSymptom) {
      return '**Heart Disease Symptoms & Conditions:**\n\n**Common Cardiovascular Symptoms:**\n• **Chest discomfort**: Pressure, squeezing, fullness, or pain\n• **Shortness of breath**: During activity or at rest\n• **Fatigue**: Unusual tiredness, especially with activity\n• **Palpitations**: Irregular, fast, or pounding heartbeat\n• **Dizziness**: Lightheadedness or fainting\n• **Swelling**: In legs, ankles, feet, or abdomen\n\n**When to Seek Emergency Care:**\n• Severe chest pain lasting >20 minutes\n• Chest pain with shortness of breath, nausea, sweating\n• Sudden severe headache with high blood pressure\n• Loss of consciousness or severe dizziness\n\n**Important**: Symptoms can vary greatly between individuals. Women, elderly, and diabetics may have atypical presentations. Always consult healthcare professionals for proper evaluation.';
    }

    if (hasTreatment) {
      return '**Cardiovascular Treatments & Medications:**\n\n**Medication Categories:**\n• **Blood Pressure**: ACE inhibitors, ARBs, beta-blockers, diuretics\n• **Cholesterol**: Statins, PCSK9 inhibitors, bile acid sequestrants\n• **Blood Thinners**: Aspirin, warfarin, DOACs (apixaban, rivaroxaban)\n• **Heart Rhythm**: Antiarrhythmics, rate control agents\n\n**Procedures:**\n• **Diagnostic**: ECG, echocardiogram, stress test, cardiac catheterization\n• **Interventional**: Angioplasty, stenting, ablation\n• **Surgical**: Bypass surgery, valve repair/replacement, pacemaker/ICD\n\n**Lifestyle Interventions:**\n• Cardiac rehabilitation programs\n• Supervised exercise training\n• Nutritional counseling\n• Stress management techniques\n\n**⚠️ Critical**: Never start, stop, or change medications without consulting your healthcare provider. All treatments should be individualized based on your specific condition and risk factors.';
    }

    if (hasLifestyle) {
      return '**Heart-Healthy Lifestyle Guidelines:**\n\n**Nutrition (Mediterranean/DASH Diet):**\n• **Emphasize**: Fruits, vegetables, whole grains, lean proteins, nuts, olive oil\n• **Fish**: 2+ servings/week (salmon, mackerel, sardines for omega-3s)\n• **Limit**: Saturated fats (<7% calories), trans fats, sodium (<2300mg/day)\n• **Avoid**: Processed meats, sugary drinks, refined carbohydrates\n\n**Physical Activity:**\n• **Aerobic**: 150 min moderate OR 75 min vigorous weekly\n• **Strength**: 2+ days/week, all major muscle groups\n• **Examples**: Brisk walking, swimming, cycling, dancing\n• **Start slowly**: Consult doctor, gradually increase intensity\n\n**Risk Factor Management:**\n• **Smoking**: Complete cessation (reduces risk by 50% within 1 year)\n• **Weight**: Maintain healthy BMI (18.5-24.9)\n• **Stress**: Meditation, yoga, deep breathing, social support\n• **Sleep**: 7-9 hours nightly, treat sleep apnea if present\n• **Alcohol**: Limit to 1 drink/day (women), 2/day (men)\n\n**Monitoring**: Regular check-ups, blood pressure monitoring, lipid panels every 4-6 years (more frequent if abnormal).';
    }

    // General health questions
    if (message.includes('how') || message.includes('what') || message.includes('why') || message.includes('when')) {
      return '**Comprehensive Heart Health Information:**\n\n**Understanding Heart Disease:**\nHeart disease is the leading cause of death globally, but many forms are preventable through lifestyle modifications and proper medical care.\n\n**Key Topics I Can Help With:**\n• **Conditions**: CAD, heart failure, arrhythmias, valve disease, cardiomyopathy\n• **Symptoms**: Chest pain types, shortness of breath, palpitations, fatigue\n• **Risk Assessment**: Age, gender, family history, lifestyle factors\n• **Prevention**: Diet, exercise, smoking cessation, stress management\n• **Treatments**: Medications, procedures, lifestyle interventions\n• **Emergency Care**: When to call 911, first aid, CPR basics\n\n**Personalized Guidance:**\nI can provide detailed information about specific conditions, explain test results, discuss treatment options, and offer evidence-based lifestyle recommendations.\n\n**⚠️ Medical Disclaimer**: This information is educational only. Always consult healthcare professionals for diagnosis, treatment decisions, and personalized medical advice.\n\nWhat specific aspect would you like to explore in detail?';
    }

    // Fallback response
    return '**I\'m here to help with your heart health questions!**\n\nI can provide detailed, evidence-based information about:\n\n**Medical Conditions:**\n• Heart attack, angina, heart failure, arrhythmias\n• High blood pressure, cholesterol disorders\n• Valve disease, cardiomyopathy, congenital heart disease\n\n**Symptoms & Diagnosis:**\n• Chest pain evaluation, shortness of breath\n• Palpitations, dizziness, fatigue\n• Understanding test results and procedures\n\n**Treatment & Management:**\n• Medications and their effects\n• Surgical and interventional procedures\n• Lifestyle modifications and prevention\n\n**Emergency Situations:**\n• Heart attack warning signs\n• When to seek immediate medical care\n• First aid and emergency response\n\n**Lifestyle & Prevention:**\n• Heart-healthy diet and exercise\n• Risk factor modification\n• Stress management and sleep health\n\n**Please ask me anything specific about heart health, and I\'ll provide detailed, accurate information to help you understand and manage cardiovascular wellness.**\n\n*What would you like to know about heart health today?*';
  };

  const generateResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check for specific keywords
    for (const [keyword, response] of Object.entries(medicalKnowledge)) {
      if (lowerMessage.includes(keyword)) {
        return response;
      }
    }

    // General responses based on message content
    if (lowerMessage.includes('symptom')) {
      return '**Common Heart Disease Symptoms:**\n\n**Chest Symptoms:**\n• Chest pain, pressure, or discomfort\n• Tightness or squeezing sensation\n\n**Breathing Issues:**\n• Shortness of breath during activity or rest\n• Difficulty breathing when lying flat\n\n**Physical Signs:**\n• Fatigue and weakness\n• Swelling in legs, ankles, or feet\n• Rapid or irregular heartbeat\n• Dizziness or lightheadedness\n\n**Important**: Symptoms can vary greatly between individuals, especially in women, elderly, and diabetics. Seek immediate medical attention for severe chest pain, especially with shortness of breath or nausea.';
    }
    
    if (lowerMessage.includes('prevent')) {
      return '**Heart Disease Prevention Strategies:**\n\n**Lifestyle Modifications:**\n• **Diet**: Mediterranean/DASH diet, limit sodium\n• **Exercise**: 150 min moderate activity weekly\n• **No Smoking**: Quit if you smoke, avoid secondhand smoke\n• **Weight**: Maintain healthy BMI (18.5-24.9)\n• **Alcohol**: Limit to 1 drink/day (women), 2/day (men)\n\n**Medical Management:**\n• Control blood pressure (<130/80)\n• Manage cholesterol (LDL <100 mg/dL)\n• Monitor blood sugar if diabetic\n• Take prescribed medications\n• Regular check-ups and screenings\n\n**Stress Management**: Practice relaxation techniques, maintain social connections';
    }
    
    if (lowerMessage.includes('risk factor')) {
      return '**Heart Disease Risk Factors:**\n\n**Non-Modifiable:**\n• Age (men >45, women >55)\n• Gender (men at higher risk)\n• Family history of heart disease\n• Race/ethnicity\n\n**Modifiable:**\n• **Major**: Smoking, high blood pressure, high cholesterol, diabetes\n• **Contributing**: Obesity, physical inactivity, unhealthy diet\n• **Emerging**: Chronic stress, sleep disorders, depression\n\n**Risk Assessment**: Your doctor can calculate your 10-year cardiovascular risk using tools like the ASCVD Risk Calculator. Focus on modifying controllable factors through lifestyle changes and medical management.';
    }
    
    if (lowerMessage.includes('medication')) {
      return '**Common Cardiovascular Medications:**\n\n**Blood Pressure:**\n• **ACE Inhibitors**: Lisinopril, enalapril (end in -pril)\n• **ARBs**: Losartan, valsartan (end in -sartan)\n• **Beta-blockers**: Metoprolol, atenolol (end in -lol)\n• **Diuretics**: "Water pills" - reduce fluid retention\n\n**Cholesterol:**\n• **Statins**: Atorvastatin, simvastatin (end in -statin)\n\n**Blood Thinners:**\n• **Aspirin**: Low-dose for prevention\n• **Warfarin/DOACs**: For atrial fibrillation\n\n**⚠️ Important**: Never start, stop, or change medications without consulting your doctor. Take as prescribed and report side effects immediately.';
    }

    if (lowerMessage.includes('emergency') || lowerMessage.includes('911')) {
      return '🚨 **CALL 911 IMMEDIATELY FOR:**\n\n**Heart Attack Warning Signs:**\n• Severe chest pain lasting >20 minutes\n• Pain radiating to arm, jaw, neck, or back\n• Shortness of breath with chest discomfort\n• Nausea, vomiting, sweating\n• Lightheadedness or fainting\n\n**Stroke Signs (FAST):**\n• **F**ace drooping\n• **A**rm weakness\n• **S**peech difficulty\n• **T**ime to call 911\n\n**Cardiac Arrest:**\n• Person unconscious, not breathing normally\n• Start CPR immediately\n\n**While Waiting for EMS:**\n• Chew aspirin (if not allergic)\n• Stay calm, sit upright\n• Loosen tight clothing';
    }

    // Default response
    return generateIntelligentResponse(lowerMessage);
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const responseText = generateResponse(inputText);
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);

      // Save to database if user is logged in
      if (user) {
        database.saveChatMessage({
          user_id: user.id,
          message: inputText,
          response: responseText
        }).catch(error => console.error('Error saving chat message:', error));
      }
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 mb-6">
        <MessageCircle className="h-8 w-8 text-blue-600" />
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Medical AI Assistant</h2>
          <p className="text-gray-600">Ask questions about heart health and cardiovascular conditions</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
            >
              <div
                className={`flex items-start space-x-2 max-w-xs lg:max-w-md ${
                  message.isBot ? 'flex-row' : 'flex-row-reverse space-x-reverse'
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.isBot ? 'bg-blue-100' : 'bg-gray-100'
                  }`}
                >
                  {message.isBot ? (
                    <Bot className="h-4 w-4 text-blue-600" />
                  ) : (
                    <User className="h-4 w-4 text-gray-600" />
                  )}
                </div>
                <div
                  className={`px-4 py-2 rounded-lg ${
                    message.isBot
                      ? 'bg-blue-50 text-blue-900 border border-blue-200'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2 max-w-xs lg:max-w-md">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-blue-600" />
                </div>
                <div className="px-4 py-2 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex space-x-2">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about heart health, symptoms, risk factors..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              rows={2}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isTyping}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <Heart className="h-3 w-3 inline mr-1" />
            This AI assistant provides general information only. Always consult healthcare professionals for medical advice.
          </div>
        </div>
      </div>

      {/* Quick Questions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Questions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'What are the symptoms of heart disease?',
            'How can I prevent heart disease?',
            'What are the main risk factors?',
            'Tell me about high blood pressure',
            'How does exercise help my heart?',
            'What is a heart-healthy diet?',
            'Explain different types of chest pain',
            'What medications are used for heart disease?',
            'Tell me about heart attack warning signs',
            'How does stress affect my heart?',
            'What is the difference between angina and heart attack?',
            'Explain cholesterol and heart health'
          ].map((question) => (
            <button
              key={question}
              onClick={() => setInputText(question)}
              className="text-left p-3 bg-gray-50 hover:bg-blue-50 hover:border-blue-200 border border-transparent rounded-lg text-sm text-gray-700 transition-all duration-200"
            >
              {question}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MedicalChatbot;