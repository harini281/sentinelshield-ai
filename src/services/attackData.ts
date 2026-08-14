import type {
  AttackStage,
  AttackType,
  AttackEventDef,
  AttackScenario,
  AttackProgression,
  AttackTimelineEvent,
  SecurityResponseType,
  RiskLevel,
} from '@/types';

export const ATTACK_STAGES: { id: AttackStage; label: string; shortLabel: string; index: number }[] = [
  { id: 'normal', label: 'Normal', shortLabel: 'Normal', index: 0 },
  { id: 'anomaly', label: 'Anomaly', shortLabel: 'Anomaly', index: 1 },
  { id: 'suspicious_access', label: 'Suspicious Access', shortLabel: 'Suspicious', index: 2 },
  { id: 'account_compromise', label: 'Account Compromise', shortLabel: 'Compromise', index: 3 },
  { id: 'financial_manipulation', label: 'Financial Manipulation', shortLabel: 'Financial', index: 4 },
  { id: 'fraud_attempt', label: 'Fraud Attempt', shortLabel: 'Fraud', index: 5 },
];

export const ATTACK_TYPE_LABELS: Record<AttackType, string> = {
  account_takeover: 'Account Takeover',
  payment_fraud: 'Payment Fraud',
  credential_attack: 'Credential Attack',
  synthetic_identity: 'Synthetic Identity',
  card_testing: 'Card Testing',
  man_in_the_middle: 'Man-in-the-Middle',
};

export const SECURITY_RESPONSES: { type: SecurityResponseType; label: string; risk: RiskLevel; description: string }[] = [
  { type: 'allow', label: 'Allow / Log', risk: 'low', description: 'Transaction proceeds. Logged for audit trail.' },
  { type: 'verify', label: 'Verify User', risk: 'medium', description: 'Step-up authentication required before proceeding.' },
  { type: 'hold', label: 'Hold', risk: 'high', description: 'Transaction paused pending analyst review.' },
  { type: 'block', label: 'Block Transaction', risk: 'critical', description: 'Transaction blocked. User notified.' },
  { type: 'freeze', label: 'Freeze Account', risk: 'critical', description: 'Account frozen. All transactions halted.' },
];

// ---- Attack event definitions ----

const accountTakeoverEvents: AttackEventDef[] = [
  { id: 'evt-unknown-device', type: 'unknown_device', label: 'Unknown Device', description: 'Login from device not in trusted list', severity: 'medium', riskContribution: 15, icon: 'Smartphone', triggersStage: 'anomaly' },
  { id: 'evt-vpn-login', type: 'vpn_login', label: 'VPN Login', description: 'Anonymizing proxy detected on session', severity: 'medium', riskContribution: 10, icon: 'Globe', triggersStage: 'suspicious_access' },
  { id: 'evt-failed-logins', type: 'failed_logins', label: 'Failed Login Attempts', description: '5 consecutive failed authentication attempts', severity: 'high', riskContribution: 15, icon: 'KeyRound', triggersStage: 'suspicious_access' },
  { id: 'evt-successful-login', type: 'successful_login', label: 'Successful Login', description: 'Authentication succeeded after failures', severity: 'high', riskContribution: 10, icon: 'LogIn', triggersStage: 'account_compromise' },
  { id: 'evt-password-change', type: 'password_change', label: 'Password Changed', description: 'Credentials modified during suspicious session', severity: 'high', riskContribution: 20, icon: 'Lock', triggersStage: 'account_compromise' },
  { id: 'evt-new-beneficiary', type: 'new_beneficiary', label: 'New Beneficiary Created', description: 'Unknown payee added to account', severity: 'critical', riskContribution: 30, icon: 'UserPlus', triggersStage: 'financial_manipulation' },
  { id: 'evt-high-value-tx', type: 'high_value_tx', label: 'High-Value Transaction', description: 'Large transfer to newly added beneficiary', severity: 'critical', riskContribution: 40, icon: 'DollarSign', triggersStage: 'fraud_attempt' },
];

const paymentFraudEvents: AttackEventDef[] = [
  { id: 'evt-unusual-time', type: 'unusual_time', label: 'Unusual Login Time', description: 'Access at 3:47 AM local time', severity: 'low', riskContribution: 8, icon: 'Clock', triggersStage: 'anomaly' },
  { id: 'evt-new-location', type: 'new_location', label: 'New Geo Location', description: 'Login from previously unseen country', severity: 'medium', riskContribution: 12, icon: 'MapPin', triggersStage: 'anomaly' },
  { id: 'evt-rapid-transfers', type: 'rapid_transfers', label: 'Rapid Transfers', description: '4 transfers within 2 minutes', severity: 'high', riskContribution: 20, icon: 'Zap', triggersStage: 'suspicious_access' },
  { id: 'evt-balance-sweep', type: 'balance_sweep', label: 'Balance Sweep Attempt', description: 'Transfer targeting full account balance', severity: 'critical', riskContribution: 25, icon: 'Wallet', triggersStage: 'financial_manipulation' },
  { id: 'evt-large-transfer', type: 'large_transfer', label: 'Large Transfer', description: 'Transfer exceeding daily limit', severity: 'critical', riskContribution: 35, icon: 'DollarSign', triggersStage: 'fraud_attempt' },
];

const credentialAttackEvents: AttackEventDef[] = [
  { id: 'evt-credential-stuffing', type: 'credential_stuffing', label: 'Credential Stuffing', description: 'Automated login attempts from botnet', severity: 'high', riskContribution: 18, icon: 'Bot', triggersStage: 'anomaly' },
  { id: 'evt-vpn-detected', type: 'vpn_detected', label: 'VPN Detected', description: 'Known VPN exit node IP', severity: 'medium', riskContribution: 10, icon: 'Globe', triggersStage: 'suspicious_access' },
  { id: 'evt-mfa-bypass', type: 'mfa_bypass', label: 'MFA Bypass Attempt', description: 'Multiple MFA code requests', severity: 'high', riskContribution: 20, icon: 'ShieldAlert', triggersStage: 'suspicious_access' },
  { id: 'evt-password-change-cred', type: 'password_change_cred', label: 'Password Change', description: 'Credentials modified after suspicious access', severity: 'high', riskContribution: 20, icon: 'Lock', triggersStage: 'account_compromise' },
];

// ---- Scenarios ----

export const ATTACK_SCENARIOS: AttackScenario[] = [
  {
    id: 'scenario-ato',
    type: 'account_takeover',
    label: 'Account Takeover',
    description: 'Attacker gains control of a legitimate account through device spoofing, VPN, and credential brute-force, then attempts financial fraud.',
    events: accountTakeoverEvents,
    predictedActions: [
      { stage: 'normal', prediction: 'Monitoring', confidence: 99, reason: 'No anomalous activity detected. System is in baseline monitoring state.', preparation: 'Continue baseline monitoring.' },
      { stage: 'anomaly', prediction: 'VPN Login', confidence: 72, reason: 'Unknown device access frequently precedes anonymizing proxy usage in account takeover patterns.', preparation: 'Flag session for enhanced monitoring.' },
      { stage: 'suspicious_access', prediction: 'Successful Login', confidence: 81, reason: 'Multiple failed login attempts followed by success is a strong indicator of credential brute-force success.', preparation: 'Require step-up authentication before granting access.' },
      { stage: 'account_compromise', prediction: 'New Beneficiary Creation', confidence: 87, reason: 'Previous attack patterns indicate that account takeover is frequently followed by beneficiary creation to prepare for fund exfiltration.', preparation: 'Require additional customer verification before allowing beneficiary changes.' },
      { stage: 'financial_manipulation', prediction: 'High-Value Transaction', confidence: 93, reason: 'After beneficiary creation, attackers typically initiate high-value transfers to the newly added payee within minutes.', preparation: 'Hold all transactions to new beneficiaries for 24 hours pending review.' },
      { stage: 'fraud_attempt', prediction: 'Transaction Complete', confidence: 97, reason: 'If the high-value transaction is not blocked, funds will be exfiltrated immediately.', preparation: 'Block transaction and freeze account immediately.' },
    ],
    riskFactors: [
      { label: 'Unknown Device', contribution: 15, icon: 'Smartphone' },
      { label: 'VPN Connection', contribution: 10, icon: 'Globe' },
      { label: 'Failed Login Attempts', contribution: 15, icon: 'KeyRound' },
      { label: 'Password Changed', contribution: 20, icon: 'Lock' },
      { label: 'New Beneficiary', contribution: 30, icon: 'UserPlus' },
    ],
    aiAnalysisTemplate: 'The activity appears consistent with an account takeover attack. The account was accessed from an unknown device through a VPN, followed by multiple failed login attempts and a successful authentication. The password was subsequently changed.',
  },
  {
    id: 'scenario-payment-fraud',
    type: 'payment_fraud',
    label: 'Payment Fraud',
    description: 'Legitimate user session is exploited for rapid fund transfers, targeting full account balance through velocity attacks.',
    events: paymentFraudEvents,
    predictedActions: [
      { stage: 'normal', prediction: 'Monitoring', confidence: 99, reason: 'No anomalous activity detected.', preparation: 'Continue baseline monitoring.' },
      { stage: 'anomaly', prediction: 'Rapid Transfers', confidence: 68, reason: 'Unusual access time and new location frequently precede velocity-based fraud.', preparation: 'Set transfer velocity limits.' },
      { stage: 'suspicious_access', prediction: 'Balance Sweep', confidence: 79, reason: 'Rapid consecutive transfers often indicate balance draining behavior.', preparation: 'Flag for analyst review.' },
      { stage: 'financial_manipulation', prediction: 'Large Transfer', confidence: 88, reason: 'Balance sweep attempts are typically followed by a large transfer exceeding daily limits.', preparation: 'Enforce daily transfer caps.' },
      { stage: 'fraud_attempt', prediction: 'Funds Exfiltrated', confidence: 95, reason: 'If the large transfer completes, funds will be lost.', preparation: 'Block and freeze immediately.' },
      { stage: 'fraud_attempt', prediction: 'Funds Exfiltrated', confidence: 95, reason: 'If the large transfer completes, funds will be lost.', preparation: 'Block and freeze immediately.' },
    ],
    riskFactors: [
      { label: 'Unusual Login Time', contribution: 8, icon: 'Clock' },
      { label: 'New Geo Location', contribution: 12, icon: 'MapPin' },
      { label: 'Rapid Transfers', contribution: 20, icon: 'Zap' },
      { label: 'Balance Sweep', contribution: 25, icon: 'Wallet' },
      { label: 'Large Transfer', contribution: 35, icon: 'DollarSign' },
    ],
    aiAnalysisTemplate: 'The activity pattern is consistent with payment fraud. The session originated from a new location at an unusual hour, followed by rapid consecutive transfers targeting the full account balance. This indicates a coordinated fund exfiltration attempt.',
  },
  {
    id: 'scenario-credential',
    type: 'credential_attack',
    label: 'Credential Attack',
    description: 'Automated credential stuffing from a botnet with MFA bypass attempts, targeting account access for later exploitation.',
    events: credentialAttackEvents,
    predictedActions: [
      { stage: 'normal', prediction: 'Monitoring', confidence: 99, reason: 'No anomalous activity detected.', preparation: 'Continue baseline monitoring.' },
      { stage: 'anomaly', prediction: 'VPN Detected', confidence: 64, reason: 'Credential stuffing campaigns frequently use VPN infrastructure to evade IP-based blocking.', preparation: 'Rate-limit authentication attempts.' },
      { stage: 'suspicious_access', prediction: 'Password Change', confidence: 77, reason: 'If MFA bypass succeeds, attackers typically change credentials to lock out the legitimate user.', preparation: 'Alert user of suspicious credential changes.' },
      { stage: 'account_compromise', prediction: 'New Beneficiary', confidence: 83, reason: 'Post-compromise, attackers add payees for fund exfiltration.', preparation: 'Require verification for beneficiary changes.' },
      { stage: 'account_compromise', prediction: 'New Beneficiary', confidence: 83, reason: 'Post-compromise, attackers add payees for fund exfiltration.', preparation: 'Require verification for beneficiary changes.' },
      { stage: 'account_compromise', prediction: 'New Beneficiary', confidence: 83, reason: 'Post-compromise, attackers add payees for fund exfiltration.', preparation: 'Require verification for beneficiary changes.' },
    ],
    riskFactors: [
      { label: 'Credential Stuffing', contribution: 18, icon: 'Bot' },
      { label: 'VPN Connection', contribution: 10, icon: 'Globe' },
      { label: 'MFA Bypass Attempt', contribution: 20, icon: 'ShieldAlert' },
      { label: 'Password Changed', contribution: 20, icon: 'Lock' },
    ],
    aiAnalysisTemplate: 'The activity is consistent with a credential stuffing attack. Automated login attempts were detected from a known VPN exit node, followed by MFA bypass attempts. The pattern suggests a botnet-driven credential attack targeting account access.',
  },
];

export function getScenarioByType(type: AttackType): AttackScenario {
  return ATTACK_SCENARIOS.find((s) => s.type === type) ?? ATTACK_SCENARIOS[0];
}

// ---- Stage mapping ----

export function stageFromEvents(events: AttackEventDef[], triggered: AttackEventDef[]): AttackStage {
  if (triggered.length === 0) return 'normal';
  const stageIndex = Math.max(...triggered.map((e) => {
    const s = ATTACK_STAGES.find((st) => st.id === e.triggersStage);
    return s ? s.index : 0;
  }));
  return ATTACK_STAGES[stageIndex].id;
}

export function stageIndex(stage: AttackStage): number {
  return ATTACK_STAGES.find((s) => s.id === stage)?.index ?? 0;
}

export function stageLabel(stage: AttackStage): string {
  return ATTACK_STAGES.find((s) => s.id === stage)?.label ?? stage;
}

export function getPrediction(scenario: AttackScenario, stage: AttackStage) {
  return scenario.predictedActions.find((p) => p.stage === stage) ?? scenario.predictedActions[0];
}

export function recommendedResponseForScore(score: number): SecurityResponseType {
  if (score >= 90) return 'block';
  if (score >= 75) return 'hold';
  if (score >= 50) return 'verify';
  return 'allow';
}

// ---- Generate active attack progressions (for dashboard & incident list) ----

function generateTimelineFromEvents(events: AttackEventDef[], baseTime: Date): AttackTimelineEvent[] {
  return events.map((e, i) => ({
    id: `te-${i}-${e.id}`,
    timestamp: new Date(baseTime.getTime() + i * 60000).toISOString(),
    eventType: e.type,
    label: e.label,
    description: e.description,
    severity: e.severity,
    riskContribution: e.riskContribution,
    icon: e.icon,
  }));
}

export function generateActiveAttack(): AttackProgression {
  const scenario = ATTACK_SCENARIOS[0];
  const triggered = scenario.events.slice(0, 4); // Account Compromise stage
  const stage = stageFromEvents(scenario.events, triggered);
  const riskScore = triggered.reduce((sum, e) => sum + e.riskContribution, 0);
  const prediction = getPrediction(scenario, stage);
  const baseTime = new Date(Date.now() - triggered.length * 60000);

  return {
    id: 'ATK-LIVE-001',
    attackType: scenario.type,
    attackTypeLabel: scenario.label,
    currentStage: stage,
    riskScore: Math.min(riskScore + 11, 99),
    confidence: 91,
    correlatedEventCount: triggered.length,
    predictedNextAction: prediction.prediction,
    predictedNextConfidence: prediction.confidence,
    predictedNextReason: prediction.reason,
    predictedNextPreparation: prediction.preparation,
    recommendedAction: 'verify',
    recommendedActionLabel: 'Verify User',
    aiAnalysis: scenario.aiAnalysisTemplate,
    affectedUser: 'Maria Chen',
    progressPercent: Math.round((stageIndex(stage) / (ATTACK_STAGES.length - 1)) * 100),
    timeline: generateTimelineFromEvents(triggered, baseTime),
    riskFactors: scenario.riskFactors.slice(0, triggered.length),
    status: 'active',
  };
}

export function generateAttackIncidents(): AttackProgression[] {
  const scenarios = ATTACK_SCENARIOS;
  const configs: { scenario: AttackScenario; triggeredCount: number; user: string; status: AttackProgression['status']; id: string }[] = [
    { scenario: scenarios[0], triggeredCount: 5, user: 'Maria Chen', status: 'active', id: 'INC-1024' },
    { scenario: scenarios[1], triggeredCount: 5, user: 'Carlos Garcia', status: 'active', id: 'INC-1025' },
    { scenario: scenarios[2], triggeredCount: 3, user: 'Wei Patel', status: 'monitoring', id: 'INC-1026' },
    { scenario: scenarios[0], triggeredCount: 7, user: 'Aisha Hassan', status: 'blocked', id: 'INC-1027' },
    { scenario: scenarios[1], triggeredCount: 4, user: 'James Smith', status: 'monitoring', id: 'INC-1028' },
    { scenario: scenarios[0], triggeredCount: 6, user: 'Yuki Tanaka', status: 'active', id: 'INC-1029' },
    { scenario: scenarios[2], triggeredCount: 4, user: 'Olga Novak', status: 'resolved', id: 'INC-1030' },
    { scenario: scenarios[0], triggeredCount: 7, user: 'Sofia Rossi', status: 'blocked', id: 'INC-1031' },
  ];

  return configs.map((cfg) => {
    const triggered = cfg.scenario.events.slice(0, cfg.triggeredCount);
    const stage = stageFromEvents(cfg.scenario.events, triggered);
    const baseRisk = triggered.reduce((sum, e) => sum + e.riskContribution, 0);
    const riskScore = Math.min(baseRisk + 10, 99);
    const prediction = getPrediction(cfg.scenario, stage);
    const response = recommendedResponseForScore(riskScore);
    const responseLabel = SECURITY_RESPONSES.find((r) => r.type === response)?.label ?? 'Verify User';
    const baseTime = new Date(Date.now() - cfg.triggeredCount * 60000 - Math.random() * 3600000);

    return {
      id: cfg.id,
      attackType: cfg.scenario.type,
      attackTypeLabel: cfg.scenario.label,
      currentStage: stage,
      riskScore,
      confidence: Math.min(riskScore + 3, 99),
      correlatedEventCount: triggered.length,
      predictedNextAction: prediction.prediction,
      predictedNextConfidence: prediction.confidence,
      predictedNextReason: prediction.reason,
      predictedNextPreparation: prediction.preparation,
      recommendedAction: response,
      recommendedActionLabel: responseLabel,
      aiAnalysis: cfg.scenario.aiAnalysisTemplate,
      affectedUser: cfg.user,
      progressPercent: Math.round((stageIndex(stage) / (ATTACK_STAGES.length - 1)) * 100),
      timeline: generateTimelineFromEvents(triggered, baseTime),
      riskFactors: cfg.scenario.riskFactors.slice(0, Math.min(triggered.length, cfg.scenario.riskFactors.length)),
      status: cfg.status,
    };
  });
}

export function generateThreatDetectionRows() {
  const scenarios = ATTACK_SCENARIOS;
  const rows: { id: string; attackType: AttackType; attackTypeLabel: string; stage: AttackStage; riskScore: number; confidence: number; predictedNext: string; recommendedAction: SecurityResponseType; recommendedLabel: string; status: AttackProgression['status']; user: string }[] = [
    { id: 'TD-001', attackType: scenarios[0].type, attackTypeLabel: scenarios[0].label, stage: 'account_compromise', riskScore: 91, confidence: 91, predictedNext: 'New Beneficiary Creation', recommendedAction: 'verify', recommendedLabel: 'Verify User', status: 'active', user: 'Maria Chen' },
    { id: 'TD-002', attackType: scenarios[1].type, attackTypeLabel: scenarios[1].label, stage: 'fraud_attempt', riskScore: 97, confidence: 95, predictedNext: 'Large Transfer', recommendedAction: 'block', recommendedLabel: 'Block', status: 'active', user: 'Carlos Garcia' },
    { id: 'TD-003', attackType: scenarios[2].type, attackTypeLabel: scenarios[2].label, stage: 'suspicious_access', riskScore: 74, confidence: 77, predictedNext: 'Password Change', recommendedAction: 'verify', recommendedLabel: 'Verify User', status: 'monitoring', user: 'Wei Patel' },
    { id: 'TD-004', attackType: scenarios[0].type, attackTypeLabel: scenarios[0].label, stage: 'financial_manipulation', riskScore: 88, confidence: 87, predictedNext: 'High-Value Transaction', recommendedAction: 'hold', recommendedLabel: 'Hold', status: 'active', user: 'Yuki Tanaka' },
    { id: 'TD-005', attackType: scenarios[1].type, attackTypeLabel: scenarios[1].label, stage: 'anomaly', riskScore: 52, confidence: 68, predictedNext: 'Rapid Transfers', recommendedAction: 'verify', recommendedLabel: 'Verify User', status: 'monitoring', user: 'James Smith' },
    { id: 'TD-006', attackType: scenarios[0].type, attackTypeLabel: scenarios[0].label, stage: 'fraud_attempt', riskScore: 99, confidence: 97, predictedNext: 'Transaction Complete', recommendedAction: 'freeze', recommendedLabel: 'Freeze Account', status: 'blocked', user: 'Aisha Hassan' },
    { id: 'TD-007', attackType: scenarios[2].type, attackTypeLabel: scenarios[2].label, stage: 'account_compromise', riskScore: 82, confidence: 83, predictedNext: 'New Beneficiary', recommendedAction: 'hold', recommendedLabel: 'Hold', status: 'active', user: 'Olga Novak' },
    { id: 'TD-008', attackType: scenarios[1].type, attackTypeLabel: scenarios[1].label, stage: 'suspicious_access', riskScore: 68, confidence: 79, predictedNext: 'Balance Sweep', recommendedAction: 'verify', recommendedLabel: 'Verify User', status: 'monitoring', user: 'Sofia Rossi' },
  ];
  return rows;
}
