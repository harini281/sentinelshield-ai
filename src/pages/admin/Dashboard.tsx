import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer, LineChart, Line, AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import {
  ArrowLeftRight, ShieldAlert, Ban, UserX, Activity, Globe2, Zap, Cpu, Clock,
  BrainCircuit, ShieldCheck, TrendingUp, TrendingDown, Users as UsersIcon,
} from 'lucide-react';
import { PageHeader } from '@/layouts/AdminLayout';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton, SkeletonCard } from '@/components/ui/Skeleton';
import { fraudService } from '@/services/api';
import { recentIncidents } from '@/services/mockData';
import { useCountUp } from '@/hooks/useCountUp';
import { riskColor, statusColor, formatCurrency, formatNumber } from '@/utils/cn';
import { WorldThreatMap } from '@/components/WorldThreatMap';
import { RiskGauge } from '@/components/RiskGauge';
import { FraudSpeedometer } from '@/components/FraudSpeedometer';
import { AttackIntelligenceCard } from '@/components/attack/AttackIntelligenceCard';
import { PredictedNextAction } from '@/components/attack/PredictedNextAction';
import { AiAttackAnalysis } from '@/components/attack/AiAttackAnalysis';
import { AttackEventTimeline } from '@/components/attack/AttackEventTimeline';
import type { Transaction, ToastNotification, AttackProgression } from '@/types';

const riskPieColors = ['#22C55E', '#F59E0B', '#F97316', '#EF4444'];

const kpiDefs = [
  { id: 'totalTransactions', label: 'Total Transactions', icon: ArrowLeftRight, accent: 'text-soc-accent', bg: 'bg-soc-accent/15', trend: 12.4 },
  { id: 'fraudAlerts', label: 'Fraud Alerts', icon: ShieldAlert, accent: 'text-amber-400', bg: 'bg-amber-500/15', trend: -8.1 },
  { id: 'blockedTransactions', label: 'Blocked Transactions', icon: Ban, accent: 'text-red-400', bg: 'bg-red-500/15', trend: 22.6 },
  { id: 'highRiskUsers', label: 'High Risk Users', icon: UserX, accent: 'text-orange-400', bg: 'bg-orange-500/15', trend: 3.7 },
  { id: 'securityHealth', label: 'Security Health', icon: ShieldCheck, accent: 'text-emerald-400', bg: 'bg-emerald-500/15', trend: 5.2 },
  { id: 'aiDecisions', label: 'AI Decisions', icon: BrainCircuit, accent: 'text-soc-primary', bg: 'bg-soc-primary/15', trend: 18.3 },
];

function KpiCard({ label, value, icon: Icon, accent, bg, trend, index }: typeof kpiDefs[number] & { value: number; index: number }) {
  const animated = useCountUp(value, 1400);
  const isPct = label === 'Security Health';
  const display = isPct ? `${Math.round(animated)}` : formatNumber(Math.round(animated));
  const up = trend >= 0;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.07, duration: 0.5 }} whileHover={{ y: -4 }}>
      <Card glow className="p-5 h-full">
        <div className="flex items-start justify-between">
          <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${accent}`} />
          </div>
          <div className={`flex items-center gap-1 text-xs font-semibold ${up ? 'text-emerald-400' : 'text-red-400'}`}>
            {up ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            {Math.abs(trend)}%
          </div>
        </div>
        <p className="mt-4 text-3xl font-bold text-white tracking-tight">{display}{isPct && <span className="text-lg text-slate-500">%</span>}</p>
        <p className="text-xs text-slate-400 mt-1">{label}</p>
        <motion.div className="mt-3 h-1 rounded-full bg-soc-border overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(Math.abs(trend) * 4, 100)}%` }}
            transition={{ delay: index * 0.07 + 0.3, duration: 0.8 }}
            className={`h-full ${up ? 'bg-emerald-500' : 'bg-red-500'}`}
          />
        </motion.div>
      </Card>
    </motion.div>
  );
}

const incidentIcons: Record<string, typeof Activity> = {
  critical: ShieldAlert, high: Ban, medium: UserX, low: Clock,
};

export default function AdminDashboard({ pushToast }: { pushToast: (t: Omit<ToastNotification, 'id' | 'timestamp'>) => void }) {
  const [kpis, setKpis] = useState<Record<string, number> | null>(null);
  const [timeline, setTimeline] = useState<{ day: string; volume: number; fraud: number; blocked: number }[]>([]);
  const [logins, setLogins] = useState<{ hour: string; success: number; failed: number }[]>([]);
  const [riskDist, setRiskDist] = useState<{ name: string; value: number }[]>([]);
  const [tx, setTx] = useState<Transaction[]>([]);
  const [activeAttack, setActiveAttack] = useState<AttackProgression | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      const [k, tl, lg, rd, t, atk] = await Promise.all([
        fraudService.getKpis(), fraudService.getTimeline(), fraudService.getLoginAttempts(),
        fraudService.getRiskDistribution(), fraudService.getTransactions(), fraudService.getActiveAttack(),
      ]);
      if (!active) return;
      setKpis(k); setTimeline(tl); setLogins(lg); setRiskDist(rd); setTx(t); setActiveAttack(atk);
      setLoading(false);
    })();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      const sample = recentIncidents[Math.floor(Math.random() * recentIncidents.length)];
      pushToast({ title: sample.title, message: `${sample.detail} · ${sample.time}`, type: sample.severity === 'critical' ? 'danger' : sample.severity === 'high' ? 'warning' : 'info' });
    }, 14000);
    return () => clearInterval(id);
  }, [pushToast]);

  const topTx = useMemo(() => [...tx].sort((a, b) => b.riskScore - a.riskScore).slice(0, 8), [tx]);

  return (
    <div>
      <PageHeader
        title="Security Operations Center"
        subtitle="Real-time financial threat intelligence · Last updated just now"
        action={
          <div className="flex items-center gap-2 glass-soft rounded-xl px-3 py-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-semibold text-emerald-400">LIVE MONITORING</span>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {loading || !kpis ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />) : kpiDefs.map((k, i) => <KpiCard key={k.id} {...k} value={kpis[k.id]} index={i} />)}
      </div>

      {/* Attack Progression Intelligence Section */}
      {activeAttack && (
        <div className="mt-6">
          <AttackIntelligenceCard attack={activeAttack} />
        </div>
      )}

      {activeAttack && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-4">
          <PredictedNextAction
            predictedAction={activeAttack.predictedNextAction}
            confidence={activeAttack.predictedNextConfidence}
            reason={activeAttack.predictedNextReason}
            preparation={activeAttack.predictedNextPreparation}
            className="xl:col-span-1"
          />
          <AiAttackAnalysis attack={activeAttack} className="xl:col-span-2" />
        </div>
      )}

      {activeAttack && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Activity className="w-4 h-4 text-soc-accent" /> Attack Event Timeline</CardTitle>
              <Badge variant="critical">{activeAttack.timeline.length} events</Badge>
            </CardHeader>
            <CardBody className="pt-0">
              <AttackEventTimeline events={activeAttack.timeline} className="mt-4" />
            </CardBody>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-soc-accent" /> Active Threat Map</CardTitle>
              <Badge variant="critical">LIVE</Badge>
            </CardHeader>
            <CardBody className="pt-0">
              <WorldThreatMap />
            </CardBody>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mt-6">
        <Card className="xl:col-span-2 overflow-hidden">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Globe2 className="w-4 h-4 text-soc-accent" /> Live Threat Map</CardTitle>
            <Badge variant="critical">LIVE</Badge>
          </CardHeader>
          <CardBody className="pt-0">
            {loading ? <Skeleton className="h-[340px] w-full" /> : <WorldThreatMap />}
          </CardBody>
        </Card>
        <AiExplanationPanel loading={loading} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Activity className="w-4 h-4 text-soc-accent" /> Animated Risk Gauge</CardTitle></CardHeader>
          <CardBody>{loading ? <Skeleton className="h-[220px] w-full" /> : <RiskGauge value={73} />}</CardBody>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Zap className="w-4 h-4 text-soc-accent" /> Fraud Probability Speedometer</CardTitle></CardHeader>
          <CardBody>{loading ? <Skeleton className="h-[220px] w-full" /> : <FraudSpeedometer value={97} />}</CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
        <Card>
          <CardHeader><CardTitle>Transaction Volume</CardTitle><Badge variant="neutral">7 days</Badge></CardHeader>
          <CardBody>
            {loading ? <Skeleton className="h-[240px] w-full" /> : (
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={timeline}>
                  <defs><linearGradient id="vol" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#06B6D4" stopOpacity={0.4} /><stop offset="100%" stopColor="#06B6D4" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E2A40" />
                  <XAxis dataKey="day" stroke="#64748B" fontSize={11} /><YAxis stroke="#64748B" fontSize={11} /><Tooltip />
                  <Line type="monotone" dataKey="volume" stroke="#06B6D4" strokeWidth={2.5} dot={{ r: 3, fill: '#06B6D4' }} activeDot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader><CardTitle>Risk Distribution</CardTitle><Badge variant="neutral">live</Badge></CardHeader>
          <CardBody>
            {loading ? <Skeleton className="h-[240px] w-full" /> : (
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie data={riskDist} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} stroke="none">
                    {riskDist.map((_, i) => <Cell key={i} fill={riskPieColors[i]} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
            <div className="flex flex-wrap gap-3 justify-center mt-2">
              {riskDist.map((d, i) => (
                <span key={d.name} className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: riskPieColors[i] }} /> {d.name}
                </span>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader><CardTitle>Fraud Detection Trend</CardTitle><Badge variant="high">elevated</Badge></CardHeader>
          <CardBody>
            {loading ? <Skeleton className="h-[240px] w-full" /> : (
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={timeline}>
                  <defs><linearGradient id="fraud" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#EF4444" stopOpacity={0.5} /><stop offset="100%" stopColor="#EF4444" stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E2A40" />
                  <XAxis dataKey="day" stroke="#64748B" fontSize={11} /><YAxis stroke="#64748B" fontSize={11} /><Tooltip />
                  <Area type="monotone" dataKey="fraud" stroke="#EF4444" strokeWidth={2.5} fill="url(#fraud)" />
                  <Area type="monotone" dataKey="blocked" stroke="#F59E0B" strokeWidth={2} fillOpacity={0.1} strokeOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader><CardTitle>Login Attempts</CardTitle><Badge variant="neutral">24h</Badge></CardHeader>
          <CardBody>
            {loading ? <Skeleton className="h-[240px] w-full" /> : (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={logins}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E2A40" />
                  <XAxis dataKey="hour" stroke="#64748B" fontSize={11} /><YAxis stroke="#64748B" fontSize={11} /><Tooltip />
                  <Bar dataKey="success" fill="#2563EB" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="failed" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <Card className="lg:col-span-1">
          <CardHeader><CardTitle className="flex items-center gap-2"><Clock className="w-4 h-4 text-soc-accent" /> Incident Timeline</CardTitle><Badge variant="critical">{recentIncidents.length}</Badge></CardHeader>
          <CardBody className="pt-0">
            <div className="relative pl-6 mt-4">
              <div className="absolute left-2 top-0 bottom-0 w-px bg-gradient-to-b from-soc-primary via-soc-border to-transparent" />
              {recentIncidents.map((inc, i) => {
                const c = riskColor[inc.severity];
                const Icon = incidentIcons[inc.severity] ?? Activity;
                return (
                  <motion.div key={i} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="relative mb-5 last:mb-0">
                    <span className={`absolute -left-[18px] top-1 w-3 h-3 rounded-full border-2 border-soc-bg ${c.bg} ${c.text.replace('text-', 'bg-')}`} />
                    <div className="flex items-center gap-2"><Icon className={`w-3.5 h-3.5 ${c.text}`} /><span className="text-xs font-mono text-slate-500">{inc.time}</span></div>
                    <p className="text-sm font-semibold text-white mt-1">{inc.title}</p>
                    <p className="text-xs text-slate-400">{inc.detail}</p>
                  </motion.div>
                );
              })}
            </div>
          </CardBody>
        </Card>

        <Card className="lg:col-span-2 overflow-hidden">
          <CardHeader><CardTitle className="flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-soc-accent" /> Threat Feed</CardTitle><Badge variant="neutral">{topTx.length} flagged</Badge></CardHeader>
          <CardBody className="pt-0 overflow-x-auto">
            {loading ? (
              <div className="space-y-2 mt-4">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
            ) : (
              <table className="w-full text-sm mt-4">
                <thead>
                  <tr className="text-left text-xs text-slate-500 border-b border-soc-border">
                    <th className="py-2 pr-3 font-medium">Transaction ID</th>
                    <th className="py-2 pr-3 font-medium">User</th>
                    <th className="py-2 pr-3 font-medium">Amount</th>
                    <th className="py-2 pr-3 font-medium hidden sm:table-cell">Country</th>
                    <th className="py-2 pr-3 font-medium hidden md:table-cell">Device</th>
                    <th className="py-2 pr-3 font-medium hidden md:table-cell">VPN</th>
                    <th className="py-2 pr-3 font-medium">Risk</th>
                    <th className="py-2 pr-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {topTx.map((t, i) => (
                    <motion.tr key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="border-b border-soc-border/60 hover:bg-white/5 transition-colors">
                      <td className="py-2.5 pr-3 font-mono text-xs text-soc-accent">{t.id}</td>
                      <td className="py-2.5 pr-3 text-slate-200">{t.user}</td>
                      <td className="py-2.5 pr-3 text-white font-medium">{formatCurrency(t.amount)}</td>
                      <td className="py-2.5 pr-3 text-slate-400 hidden sm:table-cell">{t.country}</td>
                      <td className="py-2.5 pr-3 text-slate-400 hidden md:table-cell">{t.device}</td>
                      <td className="py-2.5 pr-3 hidden md:table-cell">{t.vpn ? <Badge variant="high">Yes</Badge> : <Badge variant="low">No</Badge>}</td>
                      <td className="py-2.5 pr-3"><span className={`font-bold ${riskColor[t.riskLevel].text}`}>{t.riskScore}</span></td>
                      <td className="py-2.5 pr-3"><span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${statusColor[t.status]}`}>{t.status}</span></td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function AiExplanationPanel({ loading }: { loading: boolean }) {
  const probability = useCountUp(97, 1800);
  const reasons = ['High Transaction Amount', 'Unknown Device', 'VPN Connection', 'Foreign Country', 'Unusual Login Time'];
  return (
    <Card className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-soc-primary/10 via-transparent to-soc-accent/10 pointer-events-none" />
      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2"><Cpu className="w-4 h-4 text-soc-primary" /> AI Fraud Analysis</CardTitle>
        <Badge variant="critical">97% confidence</Badge>
      </CardHeader>
      <CardBody className="relative">
        {loading ? (
          <div className="space-y-3"><Skeleton className="h-24 w-full" /><Skeleton className="h-4 w-3/4" /><Skeleton className="h-4 w-2/3" /></div>
        ) : (
          <>
            <div className="text-center">
              <p className="text-xs text-slate-400 uppercase tracking-wider">Fraud Probability</p>
              <p className="text-6xl font-extrabold text-glow text-red-400 mt-1">{Math.round(probability)}%</p>
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-[10px] text-slate-500 mb-1"><span>Confidence</span><span>97%</span></div>
              <div className="h-2 rounded-full bg-soc-border overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: '97%' }} transition={{ duration: 1.6, ease: 'easeOut' }} className="h-full bg-gradient-to-r from-amber-500 to-red-500" />
              </div>
            </div>
            <div className="mt-5 space-y-2">
              <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Detected Signals</p>
              {reasons.map((r, i) => (
                <motion.div key={r} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }} className="flex items-center gap-2 text-sm text-slate-200">
                  <span className="w-4 h-4 rounded-full bg-emerald-500/20 border border-emerald-500/50 flex items-center justify-center"><span className="text-emerald-400 text-[10px]">✓</span></span>
                  {r}
                </motion.div>
              ))}
              <div className="mt-4 pt-4 border-t border-soc-border">
                <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Recommended Response</p>
                <p className="text-sm text-white mt-1.5">Block transaction and require step-up MFA verification from the account holder.</p>
              </div>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
}
