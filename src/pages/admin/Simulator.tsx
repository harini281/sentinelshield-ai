import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FlaskConical, Zap, ShieldAlert, Ban, Globe2, Smartphone, Clock,
  DollarSign, Activity, CheckCircle2, AlertTriangle, Lock,
} from 'lucide-react';
import { PageHeader } from '@/layouts/AdminLayout';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useCountUp } from '@/hooks/useCountUp';
import { riskColor, formatCurrency } from '@/utils/cn';
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

            <Button variant="danger" size="lg" onClick={runSim} disabled={simulating} className="w-full">
              {simulating ? (
                <><motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full" /> Simulating…</>
              ) : (
                <><Zap className="w-4 h-4" /> Simulate Fraud Attack</>
              )}
            </Button>

            <p className="mt-4 text-xs text-slate-500">
              Generates a synthetic high-risk transaction. The AI engine will analyze, score, and block it automatically.
            </p>
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
