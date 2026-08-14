import axios from 'axios';
import {
  generateUsers,
  generateTransactions,
  generateIncidents,
  generateThreats,
  generateTimeline,
  generateLoginAttempts,
  generateRiskDistribution,
  generateSecurityAlerts,
  generateDevices,
  generateLoginHistory,
  generateThreatIntel,
  generateUserTransactions,
} from './mockData';
import type {
  User,
  Transaction,
  Incident,
  ThreatLocation,
  SecurityAlert,
  Device,
  LoginRecord,
  ThreatIntel,
} from '@/types';

const api = axios.create({
  baseURL: '/api',
  timeout: 8000,
});

function delay<T>(data: T, ms = 600): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(data), ms));
}

let usersCache: User[] | null = null;
let txCache: Transaction[] | null = null;
let alertsCache: SecurityAlert[] | null = null;
let devicesCache: Device[] | null = null;
let loginCache: LoginRecord[] | null = null;
let threatIntelCache: ThreatIntel[] | null = null;

function seed() {
  if (!usersCache) usersCache = generateUsers(100);
  if (!txCache) txCache = generateTransactions(500, usersCache);
  if (!alertsCache) alertsCache = generateSecurityAlerts(100);
  if (!devicesCache) devicesCache = generateDevices(6);
  if (!loginCache) loginCache = generateLoginHistory(30);
  if (!threatIntelCache) threatIntelCache = generateThreatIntel(16);
}

export const fraudService = {
  // Admin: core entities
  async getUsers(): Promise<User[]> {
    seed();
    return delay([...(usersCache as User[])]);
  },
  async getTransactions(): Promise<Transaction[]> {
    seed();
    return delay([...(txCache as Transaction[])]);
  },
  async getIncidents(): Promise<Incident[]> {
    seed();
    return delay(generateIncidents(txCache as Transaction[], 20));
  },
  async getThreats(): Promise<ThreatLocation[]> {
    return delay(generateThreats());
  },
  async getTimeline() {
    seed();
    return delay(generateTimeline(txCache as Transaction[]));
  },
  async getLoginAttempts() {
    return delay(generateLoginAttempts());
  },
  async getRiskDistribution() {
    seed();
    return delay(generateRiskDistribution(txCache as Transaction[]));
  },
  async getKpis() {
    seed();
    const tx = txCache as Transaction[];
    return delay({
      totalTransactions: tx.length,
      fraudAlerts: tx.filter((t) => t.riskScore >= 65).length,
      blockedTransactions: tx.filter((t) => t.status === 'blocked').length,
      highRiskUsers: (usersCache as User[]).filter((u) => u.riskScore >= 65).length,
      securityHealth: 87,
      aiDecisions: tx.filter((t) => t.status !== 'pending').length,
    });
  },

  // Admin: new features
  async getSecurityAlerts(): Promise<SecurityAlert[]> {
    seed();
    return delay([...(alertsCache as SecurityAlert[])]);
  },
  async getThreatIntel(): Promise<ThreatIntel[]> {
    seed();
    return delay([...(threatIntelCache as ThreatIntel[])]);
  },
  async updateUserStatus(userId: string, status: User['status']): Promise<void> {
    seed();
    const u = (usersCache as User[]).find((x) => x.id === userId);
    if (u) u.status = status;
    return delay(undefined, 400);
  },
  async resolveIncident(id: string): Promise<void> {
    seed();
    return delay(undefined, 400);
  },

  // User-scoped data
  async getUserTransactions(user: User): Promise<Transaction[]> {
    return delay(generateUserTransactions(user, 50));
  },
  async getUserAlerts(): Promise<SecurityAlert[]> {
    seed();
    return delay((alertsCache as SecurityAlert[]).slice(0, 25));
  },
  async getUserDevices(): Promise<Device[]> {
    seed();
    return delay([...(devicesCache as Device[])]);
  },
  async getLoginHistory(): Promise<LoginRecord[]> {
    seed();
    return delay([...(loginCache as LoginRecord[])]);
  },
  async trustDevice(id: string): Promise<void> {
    seed();
    const d = (devicesCache as Device[]).find((x) => x.id === id);
    if (d) d.trusted = true;
    return delay(undefined, 400);
  },
  async removeDevice(id: string): Promise<void> {
    seed();
    const d = (devicesCache as Device[]).find((x) => x.id === id);
    if (d) d.trusted = false;
    return delay(undefined, 400);
  },

  // Attack Progression Intelligence
  async getActiveAttack() {
    const { generateActiveAttack } = await import('./attackData');
    return delay(generateActiveAttack(), 500);
  },
  async getAttackIncidents() {
    const { generateAttackIncidents } = await import('./attackData');
    return delay(generateAttackIncidents(), 600);
  },
  async getThreatDetectionRows() {
    const { generateThreatDetectionRows } = await import('./attackData');
    return delay(generateThreatDetectionRows(), 500);
  },
};

export default api;
