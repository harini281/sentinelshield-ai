import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import {
  ShieldCheck, ArrowLeftRight, Bell, MonitorSmartphone, Lock, Download,
  TrendingUp, Activity, Sparkles, Fingerprint, Eye, AlertTriangle, Smartphone,
} from 'lucide-react';
import { UserPageHeader } from '@/layouts/UserLayout';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { fraudService } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { useCountUp } from '@/hooks/useCountUp';
import { riskColor, statusColor, formatCurrency, timeAgo } from '@/utils/cn';
import type { Transaction, SecurityAlert, Device } from '@/types';

const tips = [
  'Enable two-factor authentication for an extra layer of account security.',
  'Never share your PIN or passwords — SentinelShield will never ask for them.',
  'Review your trusted devices regularly and remove unfamiliar ones.',
  'Avoid conducting banking transactions over public Wi-Fi networks.',
];

export default function UserDashboard() {
  const { user } = useAuth();
  const [tx, setTx] = useState<Transaction[]>([]);
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!user) return;
      const [t, a, d] = await Promise.all([
        fraudService.getUserTransactions({ id: 'me', name: user.name, email: user.email, riskScore: 20, status: 'active', device: 'iPhone', country: 'United States', lastLogin: new Date().toISOString(), role: 'user' } as never),
        fraudService.getUserAlerts(),
        fraudService.getUserDevices(),
      ]);
      if (!active) return;
      setTx(t); setAlerts(a); setDevices(d);
      setLoading(false);
    })();
    return () => { active = false; };
  }, [user]);

  const securityScore = useCountUp(82, 1600);
  const recentTx = tx.slice(0, 5);
  const recentAlerts = alerts.slice(0, 4);
  const trustedDevices = devices.filter((d) => d.trusted).slice(0, 3);

  const trend = Array.from({ length: 7 }).map((_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    activity: Math.floor(Math.random() * 30) + 10,
  }));

  const quickActions = [
    { label: 'Download Statement', icon: Download, color: 'text-soc-accent' },
    { label: 'Enable MFA', icon: Fingerprint, color: 'text-soc-primary' },
    { label: 'Manage Devices', icon: MonitorSmartphone, color: 'text-blue-400' },
    { label: 'Report Activity', icon: AlertTriangle, color: 'text-amber-400' },
  ];

  return (
    <div>
      <UserPageHeader title={`Welcome, ${user?.name?.split(' ')[0] ?? 'Customer'}`} subtitle="Your digital banking security portal" />

      {/* Welcome + Security Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-soc-primary/10 via-transparent to-soc-accent/10 pointer-events-none" />
          <CardBody className="relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-soc-primary text-xs font-semibold">
                  <Sparkles className="w-4 h-4" /> Account Protected
                </div>
                <h2 className="text-2xl font-bold text-white mt-2">Your account is secure</h2>
                <p className="text-sm text-slate-400 mt-1">SentinelShield AI monitored {tx.length} transactions this month. No critical threats detected.</p>
                <div className="flex gap-2 mt-4">
                  <Button size="sm" className="gradient-btn"><ShieldCheck className="w-3.5 h-3.5" /> Security Check</Button>
                  <Button variant="outline" size="sm"><Eye className="w-3.5 h-3.5" /> View Report</Button>
                </div>
              </div>
              <div className="relative w-32 h-32 shrink-0 mx-auto">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#1F2937" strokeWidth="10" />
                  <motion.circle
                    cx="60" cy="60" r="50" fill="none" stroke="url(#scoreGrad)" strokeWidth="10" strokeLinecap="round"
                    strokeDasharray={314} initial={{ strokeDashoffset: 314 }} animate={{ strokeDashoffset: 314 - (314 * 82) / 100 }} transition={{ duration: 1.6, ease: 'easeOut' }}
                  />
                  <defs><linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#7C3AED" /><stop offset="100%" stopColor="#06B6D4" /></linearGradient></defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold text-white">{Math.round(securityScore)}</span>
                  <span className="text-[10px] text-slate-400">Security Score</span>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Activity className="w-4 h-4 text-soc-accent" /> Weekly Activity</CardTitle></CardHeader>
          <CardBody>
            {loading ? <Skeleton className="h-[160px] w-full" /> : (
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={trend}>
                  <defs><linearGradient id="ua" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7C3AED" stopOpacity={0.4} /><stop offset="100%" stopColor="#7C3AED" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E2A40" />
                  <XAxis dataKey="day" stroke="#64748B" fontSize={10} /><YAxis stroke="#64748B" fontSize={10} /><Tooltip />
                  <Area type="monotone" dataKey="activity" stroke="#7C3AED" strokeWidth={2.5} fill="url(#ua)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        {quickActions.map((a, i) => (
          <motion.button key={a.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} whileHover={{ y: -3 }} className="text-left">
            <Card glow className="p-4 h-full">
              <div className="w-10 h-10 rounded-xl bg-soc-card2 flex items-center justify-center"><a.icon className={`w-5 h-5 ${a.color}`} /></div>
              <p className="text-sm font-medium text-white mt-3">{a.label}</p>
            </Card>
          </motion.button>
        ))}
      </div>

      {/* Recent transactions + alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="flex items-center gap-2"><ArrowLeftRight className="w-4 h-4 text-soc-accent" /> Recent Transactions</CardTitle><Button variant="ghost" size="sm">View all</Button></CardHeader>
          <CardBody className="pt-0">
            {loading ? <div className="space-y-2 mt-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div> : (
              <div className="mt-3 space-y-2">
                {recentTx.map((t, i) => (
                  <motion.div key={t.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3 glass-soft rounded-xl p-3">
                    <div className="w-9 h-9 rounded-lg bg-soc-card2 flex items-center justify-center"><ArrowLeftRight className="w-4 h-4 text-slate-400" /></div>
                    <div className="flex-1 min-w-0"><p className="text-sm font-medium text-white truncate">{t.merchant}</p><p className="text-xs text-slate-500">{t.country} · {timeAgo(t.timestamp)}</p></div>
                    <div className="text-right"><p className="text-sm font-semibold text-white">{formatCurrency(t.amount)}</p><span className={`inline-flex rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize ${statusColor[t.status]}`}>{t.status}</span></div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="w-4 h-4 text-amber-400" /> Recent Alerts</CardTitle></CardHeader>
          <CardBody className="pt-0">
            {loading ? <div className="space-y-2 mt-3">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div> : (
              <div className="mt-3 space-y-2">
                {recentAlerts.map((a, i) => {
                  const c = riskColor[a.riskLevel];
                  return (
                    <motion.div key={a.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="glass-soft rounded-xl p-3">
                      <div className="flex items-center justify-between"><span className="text-sm font-medium text-white">{a.title}</span><Badge variant={a.riskLevel}>{a.riskScore}</Badge></div>
                      <p className="text-xs text-slate-500 mt-1">{a.location} · {timeAgo(a.timestamp)}</p>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Trusted devices + security tips */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="flex items-center gap-2"><MonitorSmartphone className="w-4 h-4 text-soc-accent" /> Trusted Devices</CardTitle></CardHeader>
          <CardBody className="pt-0">
            {loading ? <div className="space-y-2 mt-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div> : (
              <div className="mt-3 space-y-2">
                {trustedDevices.map((d, i) => (
                  <motion.div key={d.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} className="flex items-center gap-3 glass-soft rounded-xl p-3">
                    <div className="w-9 h-9 rounded-lg bg-soc-card2 flex items-center justify-center"><Smartphone className="w-4 h-4 text-slate-400" /></div>
                    <div className="flex-1 min-w-0"><p className="text-sm font-medium text-white">{d.name}</p><p className="text-xs text-slate-500">{d.os} · {d.country}</p></div>
                    {d.current ? <Badge variant="low">Current</Badge> : <Badge variant="neutral">Trusted</Badge>}
                  </motion.div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>

        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-soc-primary/10 to-transparent pointer-events-none" />
          <CardHeader className="relative"><CardTitle className="flex items-center gap-2"><Lock className="w-4 h-4 text-soc-primary" /> Security Tips</CardTitle></CardHeader>
          <CardBody className="relative">
            <div className="space-y-3">
              {tips.map((tip, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="flex items-start gap-2.5">
                  <TrendingUp className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-slate-300 leading-relaxed">{tip}</p>
                </motion.div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
