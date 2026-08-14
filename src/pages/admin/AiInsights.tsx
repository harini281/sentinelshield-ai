import { motion } from 'framer-motion';
import { BrainCircuit, Sparkles, TrendingUp, AlertTriangle, Lightbulb, Cpu } from 'lucide-react';
import { PageHeader } from '@/layouts/AdminLayout';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

const insights = [
  { title: 'Spike in VPN-originated transactions', detail: '28% increase detected from Eastern European IP ranges in the last 6 hours. Recommend tightening geo-velocity rules for retail banking accounts.', severity: 'critical', confidence: 94 },
  { title: 'Impossible travel patterns emerging', detail: '12 accounts show logins from two continents within 90-minute windows. Likely credential stuffing with proxy rotation. Suggest mandatory MFA reset.', severity: 'high', confidence: 88 },
  { title: 'Device fingerprint anomaly cluster', detail: 'A new device fingerprint cluster has appeared across 47 accounts, sharing emulator signatures. Correlated with low-amount card testing below alert thresholds.', severity: 'high', confidence: 81 },
  { title: 'Off-hours login concentration', detail: 'Login volume between 02:00–05:00 UTC increased 3.2x week-over-week. Pattern consistent with automated scripts rather than human users.', severity: 'medium', confidence: 76 },
];

const recommendations = [
  'Enable step-up authentication for transactions above $10,000 originating from new devices.',
  'Add Nigeria and Vietnam to the high-risk geo watchlist pending review.',
  'Reduce velocity limit from 8 to 5 transactions per hour for retail accounts.',
  'Deploy behavioral biometrics model v3.1 to detect emulator-based attacks.',
];

const sevVariant: Record<string, 'critical' | 'high' | 'medium'> = { critical: 'critical', high: 'high', medium: 'medium' };

export default function AiInsights() {
  return (
    <div>
      <PageHeader
        title="AI Insights"
        subtitle="Autonomous analysis and recommendations from the SentinelShield AI engine"
        action={
          <div className="flex items-center gap-2 glass-soft rounded-xl px-3 py-2">
            <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
              <Sparkles className="w-4 h-4 text-soc-accent" />
            </motion.span>
            <span className="text-xs font-semibold text-soc-accent">Model v4.2 · Active</span>
          </div>
        }
      />

      {/* AI assistant panel */}
      <Card className="mb-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-soc-primary/10 via-transparent to-soc-accent/10 pointer-events-none" />
        <CardHeader className="relative">
          <CardTitle className="flex items-center gap-2"><Cpu className="w-4 h-4 text-soc-accent" /> Live AI Assistant</CardTitle>
          <Badge variant="low">online</Badge>
        </CardHeader>
        <CardBody className="relative">
          <div className="flex gap-3">
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-10 h-10 rounded-xl bg-gradient-to-br from-soc-primary to-soc-accent flex items-center justify-center shrink-0"
            >
              <BrainCircuit className="w-5 h-5 text-white" />
            </motion.div>
            <div className="space-y-3 flex-1">
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="glass-soft rounded-2xl rounded-tl-sm p-3 text-sm text-slate-200 max-w-2xl">
                Good evening, Analyst. I've processed <span className="text-soc-accent font-semibold">12,847 events</span> in the last hour and identified <span className="text-red-400 font-semibold">4 notable patterns</span> requiring your attention. Here's my assessment:
              </motion.div>
              <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="glass-soft rounded-2xl rounded-tl-sm p-3 text-sm text-slate-200 max-w-2xl">
                The most urgent is a coordinated credential stuffing campaign targeting retail accounts. I've already auto-blocked 312 transactions and frozen 8 high-risk accounts. Full details below.
              </motion.div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {insights.map((ins, i) => (
          <motion.div key={ins.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} whileHover={{ y: -3 }}>
            <Card glow className="h-full">
              <CardBody>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className={`w-4 h-4 ${ins.severity === 'critical' ? 'text-red-400' : ins.severity === 'high' ? 'text-orange-400' : 'text-amber-400'}`} />
                    <Badge variant={sevVariant[ins.severity]}>{ins.severity}</Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500">Confidence</p>
                    <p className="text-sm font-bold text-soc-accent">{ins.confidence}%</p>
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-white">{ins.title}</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{ins.detail}</p>
                <div className="mt-3 h-1.5 rounded-full bg-soc-border overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${ins.confidence}%` }} transition={{ delay: 0.2 + i * 0.1, duration: 0.8 }} className="h-full bg-gradient-to-r from-soc-primary to-soc-accent" />
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recommendations */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Lightbulb className="w-4 h-4 text-soc-accent" /> Recommended Actions</CardTitle>
        </CardHeader>
        <CardBody className="pt-0">
          <div className="mt-3 space-y-2">
            {recommendations.map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="flex items-start gap-3 glass-soft rounded-xl p-3">
                <TrendingUp className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <p className="text-sm text-slate-200">{r}</p>
              </motion.div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
