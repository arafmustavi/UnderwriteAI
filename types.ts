export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  data: string; // Base64 string
  mimeType: string;
}

export enum RiskLevel {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  CRITICAL = 'Critical'
}

export interface IncomeSource {
  source: string;
  amount: number;
  frequency: string;
  verified: boolean;
}

export interface Liability {
  type: string;
  amount: number;
  creditor: string;
}

export interface ApplicantInfo {
  fullName: string;
  currentAddress: string;
  employmentStatus: string;
  estimatedCreditScore?: number;
}

export interface RiskFactor {
  factor: string;
  severity: RiskLevel;
  description: string;
}

export interface LoanProfile {
  applicant: ApplicantInfo;
  income: {
    sources: IncomeSource[];
    totalMonthlyIncome: number;
  };
  liabilities: {
    debts: Liability[];
    totalMonthlyDebt: number;
  };
  metrics: {
    debtToIncomeRatio: number;
    disposableIncome: number;
  };
  riskAssessment: {
    overallRisk: RiskLevel;
    factors: RiskFactor[];
    summary: string;
  };
  recommendation: {
    decision: 'APPROVE' | 'DENY' | 'MANUAL_REVIEW';
    reasoning: string;
    suggestedLoanAmount?: number;
  };
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}