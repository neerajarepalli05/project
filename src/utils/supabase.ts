// Supabase configuration and database utilities
export interface User {
  id: string;
  email: string;
  name: string;
  created_at?: string;
}

export interface PatientRecord {
  id?: string;
  user_id: string;
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
  prediction_result?: number;
  prediction_probability?: number;
  disease_type?: string;
  created_at?: string;
}

export interface ChatMessage {
  id?: string;
  user_id: string;
  message: string;
  response: string;
  created_at?: string;
}

// Mock database functions (in a real app, these would connect to Supabase)
class MockDatabase {
  private users: User[] = [];
  private patientRecords: PatientRecord[] = [];
  private chatHistory: ChatMessage[] = [];

  // Initialize with sample data
  constructor() {
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Sample patient records for data analysis
    const sampleRecords: PatientRecord[] = [
      { id: '1', user_id: 'sample', age: 63, sex: 1, cp: 3, trestbps: 145, chol: 233, fbs: 1, restecg: 0, thalach: 150, exang: 0, oldpeak: 2.3, slope: 0, ca: 0, thal: 6, prediction_result: 1, prediction_probability: 0.85, disease_type: 'Coronary Artery Disease (CAD)', created_at: '2024-01-15' },
      { id: '2', user_id: 'sample', age: 37, sex: 1, cp: 2, trestbps: 130, chol: 250, fbs: 0, restecg: 1, thalach: 187, exang: 0, oldpeak: 3.5, slope: 0, ca: 0, thal: 3, prediction_result: 1, prediction_probability: 0.78, disease_type: 'Coronary Artery Disease (CAD)', created_at: '2024-01-16' },
      { id: '3', user_id: 'sample', age: 41, sex: 0, cp: 1, trestbps: 130, chol: 204, fbs: 0, restecg: 0, thalach: 172, exang: 0, oldpeak: 1.4, slope: 2, ca: 0, thal: 3, prediction_result: 1, prediction_probability: 0.65, disease_type: 'Heart Failure (Congestive Heart Failure)', created_at: '2024-01-17' },
      { id: '4', user_id: 'sample', age: 56, sex: 1, cp: 1, trestbps: 120, chol: 236, fbs: 0, restecg: 1, thalach: 178, exang: 0, oldpeak: 0.8, slope: 2, ca: 0, thal: 3, prediction_result: 1, prediction_probability: 0.72, disease_type: 'Arrhythmia (Irregular Heartbeat)', created_at: '2024-01-18' },
      { id: '5', user_id: 'sample', age: 57, sex: 0, cp: 0, trestbps: 120, chol: 354, fbs: 0, restecg: 1, thalach: 163, exang: 1, oldpeak: 0.6, slope: 2, ca: 0, thal: 3, prediction_result: 1, prediction_probability: 0.68, disease_type: 'Heart Valve Disease', created_at: '2024-01-19' },
      { id: '6', user_id: 'sample', age: 67, sex: 1, cp: 0, trestbps: 160, chol: 286, fbs: 0, restecg: 0, thalach: 108, exang: 1, oldpeak: 1.5, slope: 1, ca: 3, thal: 3, prediction_result: 0, prediction_probability: 0.25, disease_type: 'Low Risk', created_at: '2024-01-20' },
      { id: '7', user_id: 'sample', age: 45, sex: 0, cp: 2, trestbps: 110, chol: 180, fbs: 0, restecg: 0, thalach: 165, exang: 0, oldpeak: 0.2, slope: 2, ca: 0, thal: 3, prediction_result: 0, prediction_probability: 0.15, disease_type: 'Low Risk', created_at: '2024-01-21' },
      { id: '8', user_id: 'sample', age: 52, sex: 1, cp: 3, trestbps: 140, chol: 280, fbs: 1, restecg: 1, thalach: 145, exang: 1, oldpeak: 2.1, slope: 1, ca: 1, thal: 6, prediction_result: 1, prediction_probability: 0.82, disease_type: 'Coronary Artery Disease (CAD)', created_at: '2024-01-22' },
      { id: '9', user_id: 'sample', age: 48, sex: 0, cp: 1, trestbps: 125, chol: 220, fbs: 0, restecg: 0, thalach: 155, exang: 0, oldpeak: 1.0, slope: 2, ca: 0, thal: 3, prediction_result: 1, prediction_probability: 0.58, disease_type: 'Heart Failure (Congestive Heart Failure)', created_at: '2024-01-23' },
      { id: '10', user_id: 'sample', age: 35, sex: 1, cp: 0, trestbps: 115, chol: 190, fbs: 0, restecg: 0, thalach: 175, exang: 0, oldpeak: 0.5, slope: 2, ca: 0, thal: 3, prediction_result: 0, prediction_probability: 0.12, disease_type: 'Low Risk', created_at: '2024-01-24' },
      // Add more diverse sample data
      { id: '11', user_id: 'sample', age: 72, sex: 0, cp: 2, trestbps: 165, chol: 310, fbs: 1, restecg: 2, thalach: 95, exang: 1, oldpeak: 3.2, slope: 0, ca: 2, thal: 7, prediction_result: 1, prediction_probability: 0.91, disease_type: 'Cardiomyopathy', created_at: '2024-01-25' },
      { id: '12', user_id: 'sample', age: 28, sex: 1, cp: 1, trestbps: 125, chol: 180, fbs: 0, restecg: 1, thalach: 140, exang: 0, oldpeak: 1.8, slope: 1, ca: 0, thal: 6, prediction_result: 1, prediction_probability: 0.45, disease_type: 'Congenital Heart Disease', created_at: '2024-01-26' },
      { id: '13', user_id: 'sample', age: 59, sex: 1, cp: 0, trestbps: 155, chol: 275, fbs: 1, restecg: 0, thalach: 125, exang: 1, oldpeak: 2.8, slope: 0, ca: 1, thal: 6, prediction_result: 1, prediction_probability: 0.88, disease_type: 'Coronary Artery Disease (CAD)', created_at: '2024-01-27' },
      { id: '14', user_id: 'sample', age: 33, sex: 0, cp: 2, trestbps: 105, chol: 165, fbs: 0, restecg: 0, thalach: 185, exang: 0, oldpeak: 0.1, slope: 2, ca: 0, thal: 3, prediction_result: 0, prediction_probability: 0.08, disease_type: 'Low Risk', created_at: '2024-01-28' },
      { id: '15', user_id: 'sample', age: 68, sex: 0, cp: 3, trestbps: 175, chol: 295, fbs: 0, restecg: 2, thalach: 110, exang: 1, oldpeak: 2.5, slope: 1, ca: 2, thal: 7, prediction_result: 1, prediction_probability: 0.89, disease_type: 'Heart Valve Disease', created_at: '2024-01-29' }
    ];

    this.patientRecords = sampleRecords;
  }

  // User authentication
  async signUp(email: string, password: string, name: string): Promise<User> {
    const user: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      created_at: new Date().toISOString()
    };
    this.users.push(user);
    return user;
  }

  async signIn(email: string, password: string): Promise<User> {
    let user = this.users.find(u => u.email === email);
    if (!user) {
      // Create user if doesn't exist (for demo)
      user = await this.signUp(email, password, email.split('@')[0]);
    }
    return user;
  }

  // Patient records
  async savePatientRecord(record: PatientRecord): Promise<PatientRecord> {
    const newRecord: PatientRecord = {
      ...record,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString()
    };
    this.patientRecords.push(newRecord);
    return newRecord;
  }

  async getPatientRecords(userId: string): Promise<PatientRecord[]> {
    return this.patientRecords.filter(record => record.user_id === userId);
  }

  async getAllPatientRecords(): Promise<PatientRecord[]> {
    return this.patientRecords;
  }

  // Chat history
  async saveChatMessage(message: ChatMessage): Promise<ChatMessage> {
    const newMessage: ChatMessage = {
      ...message,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString()
    };
    this.chatHistory.push(newMessage);
    return newMessage;
  }

  async getChatHistory(userId: string): Promise<ChatMessage[]> {
    return this.chatHistory.filter(msg => msg.user_id === userId);
  }

  // Analytics
  async getAnalytics() {
    const records = this.patientRecords;
    const totalPatients = records.length;
    const withHeartDisease = records.filter(r => r.prediction_result === 1).length;
    
    return {
      totalPatients,
      withHeartDisease,
      withoutHeartDisease: totalPatients - withHeartDisease,
      heartDiseaseRate: (withHeartDisease / totalPatients * 100).toFixed(1),
      avgAge: Math.round(records.reduce((sum, r) => sum + r.age, 0) / totalPatients),
      maleCount: records.filter(r => r.sex === 1).length,
      femaleCount: records.filter(r => r.sex === 0).length,
      diseaseTypeDistribution: this.getDiseaseTypeDistribution(records),
      ageGroupAnalysis: this.getAgeGroupAnalysis(records),
      riskFactorAnalysis: this.getRiskFactorAnalysis(records)
    };
  }

  private getDiseaseTypeDistribution(records: PatientRecord[]) {
    const distribution: Record<string, number> = {};
    records.forEach(record => {
      if (record.disease_type) {
        distribution[record.disease_type] = (distribution[record.disease_type] || 0) + 1;
      }
    });
    return distribution;
  }

  private getAgeGroupAnalysis(records: PatientRecord[]) {
    const groups = {
      '20-39': { withDisease: 0, withoutDisease: 0 },
      '40-49': { withDisease: 0, withoutDisease: 0 },
      '50-59': { withDisease: 0, withoutDisease: 0 },
      '60+': { withDisease: 0, withoutDisease: 0 }
    };

    records.forEach(record => {
      let group: keyof typeof groups;
      if (record.age < 40) group = '20-39';
      else if (record.age < 50) group = '40-49';
      else if (record.age < 60) group = '50-59';
      else group = '60+';

      if (record.prediction_result === 1) {
        groups[group].withDisease++;
      } else {
        groups[group].withoutDisease++;
      }
    });

    return Object.entries(groups).map(([ageRange, data]) => ({
      ageRange,
      withDisease: data.withDisease,
      withoutDisease: data.withoutDisease,
      total: data.withDisease + data.withoutDisease,
      riskRate: ((data.withDisease / (data.withDisease + data.withoutDisease)) * 100).toFixed(1)
    }));
  }

  private getRiskFactorAnalysis(records: PatientRecord[]) {
    const factors = {
      highBP: records.filter(r => r.trestbps > 140).length,
      highCholesterol: records.filter(r => r.chol > 240).length,
      diabetes: records.filter(r => r.fbs === 1).length,
      exerciseAngina: records.filter(r => r.exang === 1).length,
      abnormalECG: records.filter(r => r.restecg > 0).length
    };

    return Object.entries(factors).map(([factor, count]) => ({
      factor,
      count,
      percentage: ((count / records.length) * 100).toFixed(1)
    }));
  }
}

export const database = new MockDatabase();