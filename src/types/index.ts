export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type TxStatus = 'approved' | 'pending' | 'blocked' | 'review';
export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  riskScore: number;
  status: 'active' | 'frozen' | 'review';
  device: string;
  country: string;
  lastLogin: string;
  role?: UserRole;
  avatar?: string;
  mfaEnabled?: boolean;
  joinedAt?: string;
  balance?: number;
}

export interface AuthUser {
  email: string;
  name: string;
  role: UserRole;
}

export interface Transaction {
  id: string;
  user: string;
  userId?: string;
  amount: number;
  country: string;
  device: string;
  vpn: boolean;
  riskScore: number;
  status: TxStatus;
  riskLevel: RiskLevel;
  timestamp: string;
  merchant?: string;
  category?: string;
}

export interface Incident {
  id: string;
  type: string;
  timestamp: string;
  severity: RiskLevel;
  affectedUser: string;
  recommendedResponse: string;
  resolved: boolean;
}

export interface ThreatLocation {
  id: string;
  name: string;
  lat: number;
  lng: number;
  severity: RiskLevel;
}

export interface AttackLine {
  from: { x: number; y: number };
  to: { x: number; y: number };
  severity: RiskLevel;
}

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'danger' | 'warning' | 'success' | 'info';
  timestamp: string;
}

export interface KpiCard {
  id: string;
  label: string;
  value: number;
  trend: number;
  icon: string;
  accent: string;
}

export interface SecurityAlert {
  id: string;
  type: 'suspicious_login' | 'high_risk_transaction' | 'unknown_device' | 'vpn_detected' | 'impossible_travel';
  title: string;
  riskScore: number;
  riskLevel: RiskLevel;
  aiExplanation: string;
  timestamp: string;
  location: string;
  device: string;
  recommendedAction: string;
  resolved: boolean;
}

export interface Device {
  id: string;
  name: string;
  browser: string;
  os: string;
  country: string;
  lastLogin: string;
  trusted: boolean;
  current?: boolean;
}

export interface LoginRecord {
  id: string;
  timestamp: string;
  device: string;
  location: string;
  country: string;
  ip: string;
  success: boolean;
  vpn: boolean;
}

export interface ThreatIntel {
  id: string;
  source: string;
  type: string;
  severity: RiskLevel;
  description: string;
  timestamp: string;
  ioc: string;
}

export type AttackStage =
  | 'normal'
  | 'anomaly'
  | 'suspicious_access'
  | 'account_compromise'
  | 'financial_manipulation'
  | 'fraud_attempt';

export type AttackType =
  | 'account_takeover'
  | 'payment_fraud'
  | 'credential_attack'
  | 'synthetic_identity'
  | 'card_testing'
  | 'man_in_the_middle';

export type SecurityResponseType = 'allow' | 'verify' | 'hold' | 'block' | 'freeze';

export interface AttackEventDef {
  id: string;
  type: string;
  label: string;
  description: string;
  severity: RiskLevel;
  riskContribution: number;
  icon: string;
  triggersStage: AttackStage;
}

export interface AttackTimelineEvent {
  id: string;
  timestamp: string;
  eventType: string;
  label: string;
  description: string;
  severity: RiskLevel;
  riskContribution: number;
  icon: string;
}

export interface AttackProgression {
  id: string;
  attackType: AttackType;
  attackTypeLabel: string;
  currentStage: AttackStage;
  riskScore: number;
  confidence: number;
  correlatedEventCount: number;
  predictedNextAction: string;
  predictedNextConfidence: number;
  predictedNextReason: string;
  predictedNextPreparation: string;
  recommendedAction: SecurityResponseType;
  recommendedActionLabel: string;
  aiAnalysis: string;
  affectedUser: string;
  progressPercent: number;
  timeline: AttackTimelineEvent[];
  riskFactors: { label: string; contribution: number; icon: string }[];
  status: 'active' | 'blocked' | 'resolved' | 'monitoring';
}

export interface AttackScenario {
  id: string;
  type: AttackType;
  label: string;
  description: string;
  events: AttackEventDef[];
  predictedActions: { stage: AttackStage; prediction: string; confidence: number; reason: string; preparation: string }[];
  riskFactors: { label: string; contribution: number; icon: string }[];
  aiAnalysisTemplate: string;
}
