import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

export function formatNumber(n: number) {
  return new Intl.NumberFormat('en-US').format(n);
}

export function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export const riskColor: Record<string, { text: string; bg: string; border: string; hex: string }> = {
  low: { text: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/40', hex: '#22C55E' },
  medium: { text: 'text-amber-400', bg: 'bg-amber-500/15', border: 'border-amber-500/40', hex: '#F59E0B' },
  high: { text: 'text-orange-400', bg: 'bg-orange-500/15', border: 'border-orange-500/40', hex: '#F97316' },
  critical: { text: 'text-red-400', bg: 'bg-red-500/15', border: 'border-red-500/40', hex: '#EF4444' },
};

export const statusColor: Record<string, string> = {
  approved: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/40',
  pending: 'text-amber-400 bg-amber-500/15 border-amber-500/40',
  blocked: 'text-red-400 bg-red-500/15 border-red-500/40',
  review: 'text-orange-400 bg-orange-500/15 border-orange-500/40',
};

export const attackStageColor: Record<string, { text: string; bg: string; border: string; hex: string; glow: string }> = {
  normal: { text: 'text-emerald-400', bg: 'bg-emerald-500/15', border: 'border-emerald-500/40', hex: '#22C55E', glow: 'shadow-[0_0_20px_rgba(34,197,94,0.4)]' },
  anomaly: { text: 'text-cyan-400', bg: 'bg-cyan-500/15', border: 'border-cyan-500/40', hex: '#06B6D4', glow: 'shadow-[0_0_20px_rgba(6,182,212,0.4)]' },
  suspicious_access: { text: 'text-amber-400', bg: 'bg-amber-500/15', border: 'border-amber-500/40', hex: '#F59E0B', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.4)]' },
  account_compromise: { text: 'text-orange-400', bg: 'bg-orange-500/15', border: 'border-orange-500/40', hex: '#F97316', glow: 'shadow-[0_0_24px_rgba(249,115,22,0.5)]' },
  financial_manipulation: { text: 'text-red-400', bg: 'bg-red-500/15', border: 'border-red-500/40', hex: '#EF4444', glow: 'shadow-[0_0_24px_rgba(239,68,68,0.5)]' },
  fraud_attempt: { text: 'text-red-500', bg: 'bg-red-600/20', border: 'border-red-500/60', hex: '#DC2626', glow: 'shadow-[0_0_28px_rgba(220,38,38,0.6)]' },
};

export const attackStatusColor: Record<string, string> = {
  active: 'text-red-400 bg-red-500/15 border-red-500/40',
  blocked: 'text-orange-400 bg-orange-500/15 border-orange-500/40',
  monitoring: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/40',
  resolved: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/40',
};
