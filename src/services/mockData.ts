import type {
  User,
  Transaction,
  Incident,
  ThreatLocation,
  RiskLevel,
  TxStatus,
  SecurityAlert,
  Device,
  LoginRecord,
  ThreatIntel,
} from '@/types';

const firstNames = ['James', 'Maria', 'Wei', 'Aisha', 'Carlos', 'Yuki', 'Olga', 'Ahmed', 'Sofia', 'Liam', 'Priya', 'Hans', 'Fatima', 'Diego', 'Anna', 'Kenji', 'Nina', 'Omar', 'Elena', 'Viktor'];
const lastNames = ['Chen', 'Garcia', 'Patel', 'Smith', 'Müller', 'Rossi', 'Kim', 'Silva', 'Novak', 'Hassan', 'Tanaka', 'Dubois', 'Kowalski', 'Andersson', 'Lopez', 'Brown', 'Khan', 'Petrov', 'Mori', 'Cohen'];
const countries = ['United States', 'United Kingdom', 'Germany', 'Japan', 'Brazil', 'India', 'Russia', 'Nigeria', 'Singapore', 'Canada', 'France', 'UAE', 'Mexico', 'Australia', 'South Korea'];
const devices = ['iPhone 15 Pro', 'Pixel 8', 'MacBook Pro', 'Galaxy S24', 'Windows PC', 'iPad Air', 'ThinkPad X1', 'Unknown Device'];
const cities = ['New York', 'London', 'Berlin', 'Tokyo', 'São Paulo', 'Mumbai', 'Moscow', 'Lagos', 'Singapore', 'Toronto', 'Paris', 'Dubai', 'Mexico City', 'Sydney', 'Seoul'];
const browsers = ['Chrome 121', 'Safari 17', 'Firefox 122', 'Edge 121', 'Chrome Mobile', 'Safari Mobile'];
const oses = ['iOS 17', 'Android 14', 'macOS Sonoma', 'Windows 11', 'Linux Ubuntu', 'iPadOS 17'];
const merchants = ['Amazon', 'Stripe', 'PayPal', 'Wire Transfer', 'Crypto Exchange', 'Apple Pay', 'Western Union', 'Visa Direct', 'SWIFT', 'Zelle'];
const categories = ['E-commerce', 'Transfer', 'Subscription', 'Withdrawal', 'Payment', 'Exchange'];

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function riskFromScore(score: number): RiskLevel {
  if (score >= 85) return 'critical';
  if (score >= 65) return 'high';
  if (score >= 35) return 'medium';
  return 'low';
}

function statusFromScore(score: number): TxStatus {
  if (score >= 85) return 'blocked';
  if (score >= 65) return 'review';
  if (score >= 35) return 'pending';
  return 'approved';
}

function uid(prefix: string, i: number) {
  return `${prefix}-${String(i).padStart(5, '0')}`;
}

export function generateUsers(count = 100): User[] {
  return Array.from({ length: count }).map((_, i) => {
    const score = randInt(5, 98);
    return {
      id: uid('USR', i + 1),
      name: `${rand(firstNames)} ${rand(lastNames)}`,
      email: `${rand(firstNames).toLowerCase()}.${rand(lastNames).toLowerCase()}${randInt(1, 99)}@securebank.io`,
      riskScore: score,
      status: score >= 85 ? 'frozen' : score >= 60 ? 'review' : 'active',
      device: rand(devices),
      country: rand(countries),
      lastLogin: new Date(Date.now() - randInt(1, 43200) * 60000).toISOString(),
      role: 'user',
      balance: randInt(1200, 250000),
      mfaEnabled: Math.random() < 0.55,
      joinedAt: new Date(Date.now() - randInt(30, 1500) * 86400000).toISOString(),
    };
  });
}

export function generateTransactions(count = 500, users: User[]): Transaction[] {
  return Array.from({ length: count }).map((_, i) => {
    const user = rand(users);
    const vpn = Math.random() < 0.28;
    const foreign = Math.random() < 0.35;
    const unknownDevice = user.device === 'Unknown Device';
    const amount = randInt(20, 48000);
    let score = randInt(5, 40);
    if (vpn) score += randInt(10, 25);
    if (foreign) score += randInt(10, 25);
    if (unknownDevice) score += randInt(10, 20);
    if (amount > 20000) score += randInt(15, 30);
    score = Math.min(99, score);
    return {
      id: uid('TXN', i + 1),
      user: user.name,
      userId: user.id,
      amount,
      country: foreign ? rand(countries.filter((c) => c !== user.country)) : user.country,
      device: user.device,
      vpn,
      riskScore: score,
      status: statusFromScore(score),
      riskLevel: riskFromScore(score),
      timestamp: new Date(Date.now() - randInt(1, 10080) * 60000).toISOString(),
      merchant: rand(merchants),
      category: rand(categories),
    };
  });
}

export function generateIncidents(transactions: Transaction[], count = 20): Incident[] {
  const types = ['High Risk Transaction', 'VPN Login Detected', 'Multiple Failed Logins', 'Impossible Travel', 'Credential Stuffing', 'Card Testing', 'Account Takeover Attempt', 'Unusual Login Time'];
  const responses = ['Block transaction & notify user', 'Require MFA re-verification', 'Freeze account pending review', 'Alert SOC analyst team', 'Geo-velocity challenge', 'Step-up authentication'];
  const risky = transactions.filter((t) => t.riskScore >= 60).slice(0, count);
  return risky.map((t, i) => ({
    id: uid('INC', i + 1),
    type: rand(types),
    timestamp: t.timestamp,
    severity: t.riskLevel,
    affectedUser: t.user,
    recommendedResponse: rand(responses),
    resolved: Math.random() < 0.35,
  }));
}

export function generateThreats(): ThreatLocation[] {
  return [
    { id: 't1', name: 'New York', lat: 40.71, lng: -74.0, severity: 'high' },
    { id: 't2', name: 'London', lat: 51.5, lng: -0.12, severity: 'medium' },
    { id: 't3', name: 'Moscow', lat: 55.75, lng: 37.6, severity: 'critical' },
    { id: 't4', name: 'Lagos', lat: 6.52, lng: 3.37, severity: 'high' },
    { id: 't5', name: 'Tokyo', lat: 35.68, lng: 139.69, severity: 'medium' },
    { id: 't6', name: 'São Paulo', lat: -23.55, lng: -46.63, severity: 'high' },
    { id: 't7', name: 'Mumbai', lat: 19.07, lng: 72.87, severity: 'medium' },
    { id: 't8', name: 'Dubai', lat: 25.2, lng: 55.27, severity: 'low' },
    { id: 't9', name: 'Singapore', lat: 1.35, lng: 103.82, severity: 'low' },
    { id: 't10', name: 'Berlin', lat: 52.52, lng: 13.4, severity: 'medium' },
  ];
}

export function generateTimeline(transactions: Transaction[]) {
  const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return labels.map((day, i) => {
    const dayTx = transactions.filter((t) => new Date(t.timestamp).getDay() === (i + 1) % 7);
    return {
      day,
      volume: dayTx.length || randInt(40, 120),
      fraud: dayTx.filter((t) => t.riskLevel === 'critical' || t.riskLevel === 'high').length || randInt(2, 14),
      blocked: dayTx.filter((t) => t.status === 'blocked').length || randInt(1, 9),
    };
  });
}

export function generateLoginAttempts() {
  const labels = ['00', '04', '08', '12', '16', '20'];
  return labels.map((h) => ({ hour: `${h}:00`, success: randInt(120, 480), failed: randInt(5, 60) }));
}

export function generateRiskDistribution(transactions: Transaction[]) {
  const levels: RiskLevel[] = ['low', 'medium', 'high', 'critical'];
  return levels.map((level) => ({
    name: level.charAt(0).toUpperCase() + level.slice(1),
    value: transactions.filter((t) => t.riskLevel === level).length || randInt(20, 200),
  }));
}

export function generateSecurityAlerts(count = 100): SecurityAlert[] {
  const alertTypes: SecurityAlert['type'][] = ['suspicious_login', 'high_risk_transaction', 'unknown_device', 'vpn_detected', 'impossible_travel'];
  const titles: Record<SecurityAlert['type'], string> = {
    suspicious_login: 'Suspicious Login',
    high_risk_transaction: 'High Risk Transaction',
    unknown_device: 'Unknown Device',
    vpn_detected: 'VPN Detected',
    impossible_travel: 'Impossible Travel',
  };
  const explanations: Record<SecurityAlert['type'], string[]> = {
    suspicious_login: ['Login from new geo at unusual hour with no prior history.', 'Failed MFA then success from foreign IP.'],
    high_risk_transaction: ['Transaction amount 5x user average with unknown merchant.', 'Rapid consecutive transfers to high-risk jurisdiction.'],
    unknown_device: ['Device fingerprint not in trusted list for this user.', 'New device paired with credential change.'],
    vpn_detected: ['Anonymizing proxy detected on session.', 'Known VPN exit node used for login.'],
    impossible_travel: ['Logins from two continents within 12 minutes.', 'Geo-velocity exceeds 900 km/min threshold.'],
  };
  const actions: Record<SecurityAlert['type'], string> = {
    suspicious_login: 'Verify identity via step-up MFA.',
    high_risk_transaction: 'Block and require manual review.',
    unknown_device: 'Challenge with device trust token.',
    vpn_detected: 'Flag session and restrict transfers.',
    impossible_travel: 'Force re-authentication and notify.',
  };
  return Array.from({ length: count }).map((_, i) => {
    const type = rand(alertTypes);
    const score = randInt(30, 98);
    return {
      id: uid('ALR', i + 1),
      type,
      title: titles[type],
      riskScore: score,
      riskLevel: riskFromScore(score),
      aiExplanation: rand(explanations[type]),
      timestamp: new Date(Date.now() - randInt(1, 10080) * 60000).toISOString(),
      location: `${rand(cities)}, ${rand(countries)}`,
      device: rand(devices),
      recommendedAction: actions[type],
      resolved: Math.random() < 0.3,
    };
  });
}

export function generateDevices(count = 6): Device[] {
  return Array.from({ length: count }).map((_, i) => ({
    id: uid('DEV', i + 1),
    name: rand(devices),
    browser: rand(browsers),
    os: rand(oses),
    country: rand(countries),
    lastLogin: new Date(Date.now() - randInt(1, 4320) * 60000).toISOString(),
    trusted: i < 3,
    current: i === 0,
  }));
}

export function generateLoginHistory(count = 30): LoginRecord[] {
  return Array.from({ length: count }).map((_, i) => ({
    id: uid('LGN', i + 1),
    timestamp: new Date(Date.now() - randInt(1, 10080) * 60000).toISOString(),
    device: rand(devices),
    location: `${rand(cities)}, ${rand(countries)}`,
    country: rand(countries),
    ip: `${randInt(10, 220)}.${randInt(0, 255)}.${randInt(0, 255)}.${randInt(1, 254)}`,
    success: Math.random() < 0.86,
    vpn: Math.random() < 0.2,
  }));
}

export function generateThreatIntel(count = 16): ThreatIntel[] {
  const sources = ['Mandiant', 'CrowdStrike', 'Recorded Future', 'AbuseIPDB', 'AlienVault OTX', 'Internal Honeypot'];
  const types = ['Phishing Campaign', 'Botnet C2', 'Carding Ring', 'Credential Dump', 'Malware C2', 'APT Activity', 'Fraud Ring', 'Darkweb Listing'];
  const descs = [
    'Large-scale phishing kit targeting retail banking customers.',
    'New C2 infrastructure linked to financially motivated APT.',
    'Stolen card batch advertised on underground marketplace.',
    'Credential dump containing 40k banking portal logins.',
    'Trojan variant with banking-overlay capability detected.',
    'Suspected nation-state actor probing financial APIs.',
    'Coordinated fraud ring using synthetic identities.',
    'Customer credentials offered for sale on darkweb forum.',
  ];
  return Array.from({ length: count }).map((_, i) => {
    const score = randInt(35, 99);
    return {
      id: uid('TIN', i + 1),
      source: rand(sources),
      type: rand(types),
      severity: riskFromScore(score),
      description: rand(descs),
      timestamp: new Date(Date.now() - randInt(1, 2880) * 60000).toISOString(),
      ioc: `${randInt(10, 220)}.${randInt(0, 255)}.${randInt(0, 255)}.${randInt(1, 254)}`,
    };
  });
}

export function generateUserTransactions(user: User, count = 50): Transaction[] {
  return Array.from({ length: count }).map((_, i) => {
    const vpn = Math.random() < 0.18;
    const foreign = Math.random() < 0.22;
    const amount = randInt(20, 18000);
    let score = randInt(5, 35);
    if (vpn) score += randInt(8, 22);
    if (foreign) score += randInt(8, 20);
    if (amount > 9000) score += randInt(10, 25);
    score = Math.min(99, score);
    return {
      id: uid('UTX', i + 1),
      user: user.name,
      userId: user.id,
      amount,
      country: foreign ? rand(countries.filter((c) => c !== user.country)) : user.country,
      device: rand(devices),
      vpn,
      riskScore: score,
      status: statusFromScore(score),
      riskLevel: riskFromScore(score),
      timestamp: new Date(Date.now() - randInt(1, 10080) * 60000).toISOString(),
      merchant: rand(merchants),
      category: rand(categories),
    };
  });
}

export const recentIncidents = [
  { time: '08:45 PM', title: 'High Risk Transaction', detail: 'Blocked', severity: 'critical' as RiskLevel },
  { time: '08:30 PM', title: 'VPN Login Detected', detail: 'Reviewing', severity: 'high' as RiskLevel },
  { time: '08:12 PM', title: 'Multiple Failed Logins', detail: '5 attempts', severity: 'medium' as RiskLevel },
  { time: '07:50 PM', title: 'Impossible Travel', detail: 'Flagged', severity: 'high' as RiskLevel },
  { time: '07:32 PM', title: 'Credential Stuffing', detail: 'Mitigated', severity: 'medium' as RiskLevel },
  { time: '07:10 PM', title: 'Unusual Login Time', detail: 'Challenged', severity: 'low' as RiskLevel },
];
