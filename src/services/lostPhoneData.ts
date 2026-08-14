import type { AttackTimelineEvent, AttackStage, SecurityResponseType } from '@/types';

export type VerificationResult = 'pending' | 'success' | 'failure';

export interface VerificationQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
}

export const VERIFICATION_QUESTIONS: VerificationQuestion[] = [
  {
    id: 'q1',
    question: 'Which recent transaction do you recognize?',
    options: ['Rs. 2,500 — Grocery', 'Rs. 85,000 — Electronics', 'Rs. 12,000 — Online Purchase', 'None of these'],
    correctAnswer: 'Rs. 2,500 — Grocery',
  },
  {
    id: 'q2',
    question: 'Which device was previously associated with this account?',
    options: ['Samsung Galaxy', 'iPhone', 'Windows Laptop', 'None of these'],
    correctAnswer: 'Samsung Galaxy',
  },
  {
    id: 'q3',
    question: 'Which location is commonly associated with this account?',
    options: ['Colombo', 'Kandy', 'Galle', 'None of these'],
    correctAnswer: 'Colombo',
  },
];

export const LOST_PHONE_RISK_FACTORS = [
  { label: 'New Device', contribution: 30, icon: 'Smartphone' },
  { label: 'Multiple Failed Logins', contribution: 35, icon: 'KeyRound' },
  { label: 'Unusual Location', contribution: 20, icon: 'MapPin' },
  { label: 'Owner Verification Failure', contribution: 15, icon: 'ShieldAlert' },
];

export const LOST_PHONE_RISK_SCORE = 91;

export const LOST_PHONE_AI_EXPLANATION =
  'The system cannot confidently establish that the person using the new device is the account owner. Multiple failed authentication attempts combined with a new device and verification mismatch indicate elevated account-takeover risk.';

export const LOST_PHONE_AI_RECOMMENDATION =
  'Verify ownership before allowing sensitive account actions. If verification fails: BLOCK DEVICE + HOLD HIGH-RISK TRANSACTIONS.';

export interface LostPhoneStage {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  branch?: 'verified' | 'failed';
}

export const LOST_PHONE_PROGRESSION_STAGES: LostPhoneStage[] = [
  { id: 'normal', label: 'Normal', shortLabel: 'Normal', description: 'Account operating under normal conditions' },
  { id: 'lost-device', label: 'Lost Device Reported', shortLabel: 'Lost Device', description: 'Customer reported registered device as lost' },
  { id: 'new-device', label: 'New Device', shortLabel: 'New Device', description: 'Login from unrecognized device detected' },
  { id: 'failed-logins', label: 'Multiple Failed Logins', shortLabel: 'Failed Logins', description: '5 consecutive failed authentication attempts' },
  { id: 'owner-verification', label: 'Owner Verification', shortLabel: 'Verification', description: 'SentinelShield initiates owner verification' },
  { id: 'verified', label: 'Legitimate Access', shortLabel: 'Verified', description: 'Owner verified — device trust restored', branch: 'verified' },
  { id: 'suspicious-access', label: 'Suspicious Access', shortLabel: 'Suspicious', description: 'Verification failed — suspicious access confirmed', branch: 'failed' },
  { id: 'account-compromise', label: 'Account Compromise', shortLabel: 'Compromise', description: 'Account compromise detected', branch: 'failed' },
  { id: 'financial-manipulation', label: 'Financial Manipulation', shortLabel: 'Financial', description: 'High-risk transaction attempts detected', branch: 'failed' },
  { id: 'fraud-attempt', label: 'Fraud Attempt', shortLabel: 'Fraud', description: 'Fraud attempt blocked by SentinelShield', branch: 'failed' },
];

export const VERIFICATION_PROCESS_STEPS = [
  { label: 'Analyzing response…', icon: 'Cpu' },
  { label: 'Checking device history…', icon: 'Smartphone' },
  { label: 'Correlating behavioral signals…', icon: 'Activity' },
  { label: 'Evaluating ownership confidence…', icon: 'ShieldCheck' },
];

export interface FailedLoginAttempt {
  attempt: number;
  timestamp: string;
  result: 'Failed';
}

export function generateFailedLoginAttempts(): FailedLoginAttempt[] {
  const now = Date.now();
  return Array.from({ length: 5 }).map((_, i) => ({
    attempt: i + 1,
    timestamp: new Date(now - (5 - i) * 120000).toISOString(),
    result: 'Failed',
  }));
}

export function generateLostPhoneTimelineEvents(result: VerificationResult): AttackTimelineEvent[] {
  const now = Date.now();
  const baseEvents: AttackTimelineEvent[] = [
    {
      id: 'lp-evt-1',
      timestamp: new Date(now - 600000).toISOString(),
      eventType: 'lost_device',
      label: 'Lost Device Reported',
      description: 'Customer reported registered phone as lost. Lost Device Mode activated.',
      severity: 'medium',
      riskContribution: 10,
      icon: 'Smartphone',
    },
    {
      id: 'lp-evt-2',
      timestamp: new Date(now - 480000).toISOString(),
      eventType: 'new_device',
      label: 'New Device Detected',
      description: 'Login attempt from Windows / Chrome — device not in trusted list.',
      severity: 'high',
      riskContribution: 30,
      icon: 'Smartphone',
    },
    {
      id: 'lp-evt-3',
      timestamp: new Date(now - 360000).toISOString(),
      eventType: 'failed_logins',
      label: '5 Failed Login Attempts',
      description: '5 consecutive failed authentication attempts from new device.',
      severity: 'high',
      riskContribution: 35,
      icon: 'KeyRound',
    },
    {
      id: 'lp-evt-4',
      timestamp: new Date(now - 240000).toISOString(),
      eventType: 'unusual_location',
      label: 'Unrecognized Location',
      description: 'Access from unrecognized location — no prior history.',
      severity: 'medium',
      riskContribution: 20,
      icon: 'MapPin',
    },
    {
      id: 'lp-evt-5',
      timestamp: new Date(now - 120000).toISOString(),
      eventType: 'owner_verification',
      label: 'Owner Verification Initiated',
      description: 'SentinelShield initiated account owner verification challenge.',
      severity: 'high',
      riskContribution: 15,
      icon: 'ShieldCheck',
    },
  ];

  if (result === 'failure') {
    baseEvents.push(
      {
        id: 'lp-evt-6',
        timestamp: new Date(now - 60000).toISOString(),
        eventType: 'verification_failed',
        label: 'Owner Verification Failed',
        description: 'Verification answers did not match account context. Identity confidence: LOW.',
        severity: 'critical',
        riskContribution: 15,
        icon: 'ShieldAlert',
      },
      {
        id: 'lp-evt-7',
        timestamp: new Date(now - 30000).toISOString(),
        eventType: 'device_blocked',
        label: 'Device Blocked',
        description: 'SentinelShield blocked the suspicious device and held high-risk transactions.',
        severity: 'critical',
        riskContribution: 0,
        icon: 'ShieldX',
      },
    );
  } else if (result === 'success') {
    baseEvents.push(
      {
        id: 'lp-evt-6',
        timestamp: new Date(now - 60000).toISOString(),
        eventType: 'owner_verified',
        label: 'Owner Verified',
        description: 'Verification answers matched account context. Identity confidence: HIGH.',
        severity: 'low',
        riskContribution: 0,
        icon: 'ShieldCheck',
      },
      {
        id: 'lp-evt-7',
        timestamp: new Date(now - 30000).toISOString(),
        eventType: 'device_registered',
        label: 'Device Trust Restored',
        description: 'New device registered as trusted. Account access restored.',
        severity: 'low',
        riskContribution: 0,
        icon: 'Smartphone',
      },
    );
  }

  return baseEvents;
}

export const LOST_PHONE_VERIFICATION_STEPS = [
  { label: 'Analyzing response…', icon: 'Cpu' },
  { label: 'Checking device history…', icon: 'Smartphone' },
  { label: 'Correlating behavioral signals…', icon: 'Activity' },
  { label: 'Evaluating ownership confidence…', icon: 'ShieldCheck' },
];

export const SUCCESS_VERIFICATION_SIGNALS = [
  'Known transaction recognized',
  'Device/account context matches',
  'Behavioral pattern consistent',
];

export const FAILURE_VERIFICATION_SIGNALS = [
  'New device',
  'Multiple failed login attempts',
  'Unusual location',
  'Verification mismatch',
];

export const FAILURE_RECOMMENDED_ACTIONS: { label: string; type: SecurityResponseType; icon: string }[] = [
  { label: 'BLOCK DEVICE', type: 'block', icon: 'ShieldX' },
  { label: 'HOLD HIGH-RISK TRANSACTIONS', type: 'hold', icon: 'ShieldAlert' },
  { label: 'FREEZE ACCOUNT', type: 'freeze', icon: 'Snowflake' },
];

export const SUCCESS_RECOMMENDED_ACTIONS: { label: string; type: SecurityResponseType; icon: string }[] = [
  { label: 'ALLOW ACCESS', type: 'allow', icon: 'CheckCircle2' },
  { label: 'REGISTER DEVICE', type: 'verify', icon: 'Smartphone' },
];

export function getLostPhoneStageIndex(stageId: string): number {
  return LOST_PHONE_PROGRESSION_STAGES.findIndex((s) => s.id === stageId);
}

export function getLostPhoneStageById(stageId: string): LostPhoneStage | undefined {
  return LOST_PHONE_PROGRESSION_STAGES.find((s) => s.id === stageId);
}

export function stageToAttackStage(stageId: string): AttackStage {
  const map: Record<string, AttackStage> = {
    normal: 'normal',
    'new-device': 'anomaly',
    'failed-logins': 'suspicious_access',
    'owner-verification': 'suspicious_access',
    'suspicious-access': 'suspicious_access',
    'account-compromise': 'account_compromise',
    'financial-manipulation': 'financial_manipulation',
    'fraud-attempt': 'fraud_attempt',
    verified: 'normal',
    'lost-device': 'anomaly',
  };
  return map[stageId] ?? 'normal';
}
