import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FlaskConical, Zap, ShieldAlert, Ban, Globe2, Smartphone, Clock,
  DollarSign, Activity, CheckCircle2, AlertTriangle, Lock, KeyRound,
  MapPin, Fingerprint, ShieldX, Snowflake, Brain, Cpu, XCircle,
} from 'lucide-react';
import { PageHeader } from '@/layouts/AdminLayout';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useCountUp } from '@/hooks/useCountUp';
import { riskColor, formatCurrency, cn } from '@/utils/cn';
import type { ToastNotification, RiskLevel } from '@/types';

interface SimResult {
  amount: number;
  country: string;
  device: string;
  vpn: boolean;
  loginTime: string;
  riskScore: number;
  threatLevel: RiskLevel;
}

const countries = ['Russia', 'Nigeria', 'North Korea', 'Brazil', 'Vietnam', 'Unknown'];
const devices = ['Unknown Device', 'Rooted Android', 'Emulator', 'Burner Phone'];

function generateAttack(): SimResult {
  const amount = Math.floor(Math.random() * 45000) + 5000;
  const score = Math.floor(Math.random() * 14) + 85;
  const level: RiskLevel = score >= 90 ? 'critical' : 'high';
  return {
    amount,
    country: countries[Math.floor(Math.random() * countries.length)],
    device: devices[Math.floor(Math.random() * devices.length)],
    vpn: true,
    loginTime: new Date().toLocaleTimeString(),
    riskScore: score,
    threatLevel: level,
  };
}

export default function Simulation({ pushToast }: { pushToast: (t: Omit<ToastNotification, 'id' | 'timestamp'>) => void }) {
  const [result, setResult] = useState<SimResult | null>(null);
  const [simulating, setSimulating] = useState(false);
  const [timeline, setTimeline] = useState<{ time: string; label: string; icon: typeof Zap; color: string }[]>([]);
  const navigate = useNavigate();

  // Lost phone demo state
  const [lpSimulating, setLpSimulating] = useState(false);
  const [lpStep, setLpStep] = useState(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => () => timersRef.current.forEach(clearTimeout), []);

  function addTimer(fn: () => void, delay: number) {
    const t = setTimeout(fn, delay);
    timersRef.current.push(t);
  }

  function runSim() {
    setSimulating(true);
    setResult(null);
    setTimeline([]);
    const res = generateAttack();

    const steps = [
      { time: '0.2s', label: 'Inbound transaction detected', icon: Zap, color: 'text-soc-accent' },
      { time: '0.6s', label: `Geo analysis: ${res.country}`, icon: Globe2, color: 'text-amber-400' },
      { time: '1.0s', label: `Device fingerprint: ${res.device}`, icon: Smartphone, color: 'text-orange-400' },
      { time: '1.4s', label: 'VPN tunnel identified', icon: Lock, color: 'text-red-400' },
      { time: '1.8s', label: 'AI risk engine scoring…', icon: Activity, color: 'text-soc-accent' },
      { time: '2.2s', label: `Risk score: ${res.riskScore} — ${res.threatLevel.toUpperCase()}`, icon: ShieldAlert, color: riskColor[res.threatLevel].text },
      { time: '2.6s', label: 'Transaction BLOCKED', icon: Ban, color: 'text-red-400' },
    ];

    steps.forEach((s, i) => {
      setTimeout(() => {
        setTimeline((prev) => [...prev, s]);
        if (i === steps.length - 1) {
          setResult(res);
          setSimulating(false);
          pushToast({
            title: 'Fraud Attack Blocked',
            message: `${formatCurrency(res.amount)} from ${res.country} · Risk ${res.riskScore}`,
            type: 'danger',
          });
        }
      }, (i + 1) * 350);
    });
  }

  const lpDemoSteps = [
    { label: 'Lost phone reported', icon: Smartphone, color: 'text-amber-400' },
    { label: 'New device detected: Windows / Chrome', icon: Smartphone, color: 'text-orange-400' },
    { label: 'Location: Unrecognized — Device Trust: LOW', icon: MapPin, color: 'text-orange-400' },
    { label: 'Login Attempt 1 — Failed', icon: KeyRound, color: 'text-red-400' },
    { label: 'Login Attempt 2 — Failed', icon: KeyRound, color: 'text-red-400' },
    { label: 'Login Attempt 3 — Failed', icon: KeyRound, color: 'text-red-400' },
    { label: 'Login Attempt 4 — Failed', icon: KeyRound, color: 'text-red-400' },
    { label: 'Login Attempt 5 — Failed', icon: KeyRound, color: 'text-red-400' },
    { label: '5 FAILED LOGIN ATTEMPTS — Authentication Risk: HIGH', icon: ShieldAlert, color: 'text-red-400' },
    { label: 'Owner verification initiated', icon: Fingerprint, color: 'text-soc-primary' },
    { label: 'Verification answers do not match account context', icon: XCircle, color: 'text-red-400' },
    { label: 'Owner Verification Failed — Identity Confidence: LOW', icon: ShieldAlert, color: 'text-red-400' },
    { label: 'Risk Score: 91/100 — CRITICAL', icon: AlertTriangle, color: 'text-red-400' },
    { label: 'Device BLOCKED', icon: ShieldX, color: 'text-red-400' },
    { label: 'High-risk transactions HELD', icon: ShieldAlert, color: 'text-orange-400' },
    { label: 'Account FROZEN', icon: Snowflake, color: 'text-red-400' },
  ];

  function runLostPhoneSim() {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setLpSimulating(true);
    setLpStep(0);
    setResult(null);
    setSimulating(false);

    lpDemoSteps.forEach((_, i) => {
      addTimer(() => setLpStep(i + 1), (i + 1) * 600);
    });

    addTimer(() => {
      setLpSimulating(false);
      pushToast({
        title: 'Account Takeover Blocked',
        message: 'Lost phone attack · 5 failed logins · Verification failed · Risk 91/100',
        type: 'danger',
      });
    }, (lpDemoSteps.length + 1) * 600);
  }

  return (
    <div>
      <PageHeader
        title="Cyber Attack Simulator"
        subtitle="Generate synthetic fraud attacks and watch the AI defense engine respond in real time"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Control panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FlaskConical className="w-4 h-4 text-soc-accent" /> Attack Simulator</CardTitle>
          </CardHeader>
          <CardBody className="flex flex-col items-center text-center">
            <motion.div
              animate={simulating ? { scale: [1, 1.05, 1], boxShadow: ['0 0 20px rgba(239,68,68,0.3)', '0 0 50px rgba(239,68,68,0.6)', '0 0 20px rgba(239,68,68,0.3)'] } : {}}
              transition={{ duration: 1, repeat: simulating ? Infinity : 0 }}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/40 flex items-center justify-center mb-6"
            >
              <ShieldAlert className={`w-12 h-12 ${simulating ? 'text-red-400 animate-pulse2' : 'text-slate-400'}`} />
            </motion.div>

            <Button variant="danger" size="lg" onClick={runSim} disabled={simulating || lpSimulating} className="w-full">
              {simulating ? (
                <><motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> Simulating…</>
              ) : (
                <><Zap className="w-4 h-4" /> Simulate Fraud Attack</>
              )}
            </Button>

            <p className="mt-4 text-xs text-slate-500">
              Generates a synthetic high-risk transaction. The AI engine will analyze, score, and block it automatically.
            </p>

            {/* Divider */}
            <div className="w-full flex items-center gap-3 my-5">
              <div className="flex-1 h-px bg-soc-border" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-600">Hackathon Demo</span>
              <div className="flex-1 h-px bg-soc-border" />
            </div>

            {/* Lost Phone Demo Button */}
            <motion.div
              animate={lpSimulating ? { scale: [1, 1.03, 1] } : {}}
              transition={{ duration: 1.5, repeat: lpSimulating ? Infinity : 0 }}
              className="w-full rounded-xl border border-soc-primary/40 bg-gradient-to-br from-soc-primary/15 to-soc-accent/10 p-4"
            >
              <div className="flex items-center gap-2 mb-3 justify-center">
                <Brain className="w-5 h-5 text-soc-primary" />
                <span className="text-xs font-bold uppercase tracking-wider text-soc-primary">Main Demo Flow</span>
              </div>
              <Button
                variant="primary"
                size="lg"
                onClick={runLostPhoneSim}
                disabled={simulating || lpSimulating}
                className="w-full"
              >
                {lpSimulating ? (
                  <><motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> Simulating Lost Phone Attack…</>
                ) : (
                  <><Smartphone className="w-4 h-4" /> Simulate Lost Phone Attack</>
                )}
              </Button>
              <p className="mt-3 text-xs text-slate-500">
                Lost Phone → New Device → 5 Failed Logins → Owner Verification → Verification Failure → Risk 91/100 → Block Device → Hold Transaction
              </p>
            </motion.div>
          </CardBody>
        </Card>

        {/* Result */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Simulation Result</CardTitle>
            {result && <Badge variant="blocked">BLOCKED</Badge>}
          </CardHeader>
          <CardBody>
            <AnimatePresence mode="wait">
              {!result && !simulating ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-64 text-center"
                >
                  <FlaskConical className="w-12 h-12 text-slate-600 mb-3" />
                  <p className="text-slate-400 text-sm">No simulation running</p>
                  <p className="text-slate-600 text-xs mt-1">Press the button to launch a synthetic fraud attack</p>
                </motion.div>
              ) : simulating && !result ? (
                <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                  {timeline.map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 glass-soft rounded-xl p-3"
                    >
                      <s.icon className={`w-4 h-4 ${s.color}`} />
                      <span className="text-xs font-mono text-slate-500">{s.time}</span>
                      <span className="text-sm text-slate-200">{s.label}</span>
                    </motion.div>
                  ))}
                </motion.div>
              ) : result ? (
                <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <ResultGrid result={result} />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </CardBody>
        </Card>
      </div>

      {/* Timeline + verdict */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Activity className="w-4 h-4 text-soc-accent" /> Response Timeline</CardTitle>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="relative pl-6 mt-4">
                <div className="absolute left-2 top-0 bottom-0 w-px bg-gradient-to-b from-red-500 via-amber-500 to-emerald-500" />
                {timeline.map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="relative mb-4 last:mb-0"
                  >
                    <span className={`absolute -left-[18px] top-1 w-3 h-3 rounded-full ${s.color.replace('text-', 'bg-')}`} />
                    <div className="flex items-center gap-2">
                      <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
                      <span className="text-xs font-mono text-slate-500">{s.time}</span>
                    </div>
                    <p className="text-sm text-slate-200 mt-0.5">{s.label}</p>
                  </motion.div>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent pointer-events-none" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2"><Ban className="w-4 h-4 text-red-400" /> Final Verdict</CardTitle>
            </CardHeader>
            <CardBody className="relative">
              <div className="flex items-center gap-3 mb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 18 }}
                  className="w-14 h-14 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center"
                >
                  <Ban className="w-7 h-7 text-red-400" />
                </motion.div>
                <div>
                  <p className="text-2xl font-bold text-red-400">Transaction Blocked</p>
                  <p className="text-xs text-slate-400">Autonomous response executed in 2.6s</p>
                </div>
              </div>
              <div className="space-y-2">
                {['Account flagged for review', 'User notified via SMS + email', 'Incident ticket INC-AUTO created', 'Pattern added to threat model'].map((r, i) => (
                  <motion.div key={r} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }} className="flex items-center gap-2 text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {r}
                  </motion.div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Lost Phone Demo Result */}
      {lpSimulating && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          <Card className="lg:col-span-2 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-soc-primary/8 to-transparent pointer-events-none" />
            <motion.div
              className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-soc-primary/40 to-transparent pointer-events-none"
              animate={{ top: ['0%', '100%', '0%'] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2 text-soc-primary">
                <Smartphone className="w-4 h-4" /> Lost Phone Attack — Live Demo
              </CardTitle>
              <Badge variant="critical">{lpStep}/{lpDemoSteps.length} steps</Badge>
            </CardHeader>
            <CardBody className="relative pt-0">
              <div className="space-y-2 mt-4 max-h-[500px] overflow-y-auto">
                {lpDemoSteps.slice(0, lpStep).map((s, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={cn(
                      'flex items-center gap-3 rounded-xl border p-3',
                      i === lpStep - 1
                        ? 'border-soc-primary/40 bg-soc-primary/10'
                        : 'border-soc-border bg-soc-card2 opacity-70',
                    )}
                  >
                    <s.icon className={cn('w-4 h-4 shrink-0', s.color)} />
                    <span className="text-xs font-mono text-slate-500">{`Step ${i + 1}`}</span>
                    <span className="text-sm text-slate-200">{s.label}</span>
                  </motion.div>
                ))}
              </div>
            </CardBody>
          </Card>

          <Card className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent pointer-events-none" />
            <CardHeader className="relative">
              <CardTitle className="flex items-center gap-2 text-soc-primary">
                <Cpu className="w-4 h-4" /> AI Analysis
              </CardTitle>
            </CardHeader>
            <CardBody className="relative">
              <div className="rounded-xl border border-soc-primary/30 bg-soc-primary/5 p-3">
                <p className="text-xs text-slate-200 leading-relaxed">
                  "The system cannot confidently establish that the person using the new device is the account owner. Multiple failed authentication attempts combined with a new device and verification mismatch indicate elevated account-takeover risk."
                </p>
              </div>
              <div className="mt-3 space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">Risk Factors</p>
                {[
                  { label: 'New Device', pct: 30 },
                  { label: 'Multiple Failed Logins', pct: 35 },
                  { label: 'Unusual Location', pct: 20 },
                  { label: 'Owner Verification Failure', pct: 15 },
                ].map((f, i) => (
                  <div key={f.label}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-300">{f.label}</span>
                      <span className="font-bold text-red-400">{f.pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-soc-border overflow-hidden">
                      <motion.div
                        className="h-full rounded-full bg-gradient-to-r from-amber-500 to-red-500"
                        initial={{ width: 0 }}
                        animate={{ width: lpStep > i + 8 ? `${f.pct}%` : 0 }}
                        transition={{ duration: 0.6 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-3 border-t border-soc-border">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">Risk Score</span>
                  <span className="text-2xl font-bold text-red-400">{lpStep >= 13 ? '91' : '...'}<span className="text-sm text-slate-500">/100</span></span>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Lost Phone Demo Completed — open full incident */}
      {!lpSimulating && lpStep > 0 && lpStep >= lpDemoSteps.length && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
          <Card className="relative overflow-hidden border-emerald-500/30">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none" />
            <CardBody className="relative">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="w-14 h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center"
                  >
                    <CheckCircle2 className="w-7 h-7 text-emerald-400" />
                  </motion.div>
                  <div>
                    <p className="text-lg font-bold text-white">Lost Phone Attack Simulation Complete</p>
                    <p className="text-xs text-slate-400">Device blocked · Transactions held · Account frozen · Risk 91/100</p>
                  </div>
                </div>
                <Button variant="primary" size="lg" onClick={() => navigate('/admin/lost-phone-attack')}>
                  <Activity className="w-4 h-4" /> View Full Incident
                </Button>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      )}
    </div>
  );
}

function ResultGrid({ result }: { result: SimResult }) {
  const animatedScore = useCountUp(result.riskScore, 1200);
  const c = riskColor[result.threatLevel];
  const rows = [
    { icon: DollarSign, label: 'Amount', value: formatCurrency(result.amount) },
    { icon: Globe2, label: 'Country', value: result.country },
    { icon: Smartphone, label: 'Device', value: result.device },
    { icon: Lock, label: 'VPN', value: result.vpn ? 'Detected' : 'None' },
    { icon: Clock, label: 'Login Time', value: result.loginTime },
  ];
  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {rows.map((r, i) => (
          <motion.div
            key={r.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-soft rounded-xl p-3"
          >
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <r.icon className="w-3.5 h-3.5" /> {r.label}
            </div>
            <p className="text-sm font-semibold text-white mt-1 truncate">{r.value}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.4 }}
        className={`mt-4 rounded-2xl p-5 border ${c.border} ${c.bg}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className={`w-5 h-5 ${c.text}`} />
            <span className="text-sm font-semibold text-white">Risk Score</span>
          </div>
          <span className={`text-4xl font-extrabold ${c.text}`}>{Math.round(animatedScore)}</span>
        </div>
        <div className="mt-3 h-2.5 rounded-full bg-soc-border overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${result.riskScore}%` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="h-full"
            style={{ background: c.hex }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span className="text-xs text-slate-400">Threat Level</span>
          <Badge variant={result.threatLevel}>{result.threatLevel.toUpperCase()}</Badge>
        </div>
      </motion.div>
    </div>
  );
}
