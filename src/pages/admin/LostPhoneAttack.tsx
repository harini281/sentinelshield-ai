import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert, Brain, Cpu, KeyRound, MapPin, Smartphone, ShieldCheck,
  ShieldX, Snowflake, Activity, Ban, AlertTriangle, CheckCircle2, XCircle,
  Eye, Fingerprint, Clock, Crosshair, ArrowRight,
} from 'lucide-react';
import { PageHeader } from '@/layouts/AdminLayout';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { AttackEventTimeline } from '@/components/attack/AttackEventTimeline';
import { RiskExplanation } from '@/components/attack/RiskExplanation';
import { SecurityResponsePanel } from '@/components/attack/SecurityResponsePanel';
import { AttackProgressionTimeline } from '@/components/attack/AttackProgressionTimeline';
import {
  LOST_PHONE_RISK_SCORE, LOST_PHONE_RISK_FACTORS, LOST_PHONE_AI_EXPLANATION,
  LOST_PHONE_AI_RECOMMENDATION, generateLostPhoneTimelineEvents,
  LOST_PHONE_PROGRESSION_STAGES,
} from '@/services/lostPhoneData';
import { stageToAttackStage } from '@/services/lostPhoneData';
import { cn } from '@/utils/cn';
import type { SecurityResponseType } from '@/types';

const iconMap: Record<string, typeof Smartphone> = {
  Smartphone, Cpu, Activity, ShieldCheck, KeyRound, MapPin, ShieldAlert, ShieldX: Ban, Snowflake, CheckCircle2,
};

export default function AdminLostPhoneAttack() {
  const [result, setResult] = useState<'failure' | 'success'>('failure');
  const timelineEvents = generateLostPhoneTimelineEvents(result);
  const [selectedResponse, setSelectedResponse] = useState<SecurityResponseType | undefined>(undefined);

  const incidentDetails = [
    { label: 'Customer', value: 'Demo Customer', icon: Fingerprint },
    { label: 'Device', value: 'Unknown', icon: Smartphone },
    { label: 'Failed Attempts', value: '5', icon: KeyRound },
    { label: 'Location', value: 'Unrecognized', icon: MapPin },
    { label: 'Risk', value: `${LOST_PHONE_RISK_SCORE}/100`, icon: ShieldAlert },
    { label: 'Verification', value: result === 'failure' ? 'Failed' : 'Passed', icon: result === 'failure' ? XCircle : CheckCircle2 },
  ];

  return (
    <div>
      <PageHeader
        title="Account Takeover — Owner Verification Required"
        subtitle="Lost device scenario · SentinelShield incident response"
        action={
          <div className="flex items-center gap-2">
            <Button
              variant={result === 'failure' ? 'danger' : 'outline'}
              size="sm"
              onClick={() => setResult('failure')}
            >
              <ShieldX className="w-3.5 h-3.5" /> Verification Failed
            </Button>
            <Button
              variant={result === 'success' ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setResult('success')}
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Verification Passed
            </Button>
          </div>
        }
      />

      {/* Product message */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-soc-primary/40 bg-gradient-to-r from-soc-primary/15 via-soc-card to-soc-accent/10 p-5 mb-6"
      >
        <div className="absolute inset-0 opacity-20" style={{ background: 'linear-gradient(110deg, transparent 30%, rgba(124,58,237,0.15) 50%, transparent 70%)' }} />
        <div className="relative flex items-center gap-3">
          <Brain className="w-6 h-6 text-soc-primary shrink-0" />
          <div>
            <p className="text-sm font-bold text-white">
              SentinelShield doesn't just detect unusual access. It verifies who is behind it.
            </p>
            <p className="text-xs text-slate-400 mt-0.5">DETECT → CORRELATE → UNDERSTAND → VERIFY → PREDICT → PREVENT → EXPLAIN</p>
          </div>
        </div>
      </motion.div>

      {/* Incident header */}
      <Card className={`relative overflow-hidden mb-6 ${result === 'failure' ? 'border-red-500/40' : 'border-emerald-500/40'}`}>
        <div className={`absolute inset-0 ${result === 'failure' ? 'bg-gradient-to-br from-red-500/10' : 'bg-gradient-to-br from-emerald-500/10'} to-transparent pointer-events-none`} />
        <CardBody className="relative">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className={`w-14 h-14 rounded-xl flex items-center justify-center ${result === 'failure' ? 'bg-red-500/20' : 'bg-emerald-500/20'}`}
              >
                {result === 'failure' ? <ShieldAlert className="w-7 h-7 text-red-400" /> : <ShieldCheck className="w-7 h-7 text-emerald-400" />}
              </motion.div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-white">ACCOUNT TAKEOVER</h2>
                  <Badge variant={result === 'failure' ? 'critical' : 'low'}>
                    {result === 'failure' ? 'OWNER VERIFICATION REQUIRED' : 'OWNER VERIFIED'}
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 font-mono mt-0.5">INC-LP-001 · Lost Device Scenario</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">Status</p>
              <Badge variant={result === 'failure' ? 'critical' : 'low'} className="mt-0.5">
                {result === 'failure' ? 'CRITICAL' : 'RESOLVED'}
              </Badge>
            </div>
          </div>

          {/* Incident details grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-5">
            {incidentDetails.map((d, i) => (
              <motion.div
                key={d.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="glass-soft rounded-xl p-3"
              >
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                  <d.icon className="w-3 h-3" /> {d.label}
                </div>
                <p className={cn(
                  'text-sm font-semibold truncate',
                  d.label === 'Risk' ? 'text-red-400' : d.label === 'Verification' ? (result === 'failure' ? 'text-red-400' : 'text-emerald-400') : 'text-white',
                )}>
                  {d.value}
                </p>
              </motion.div>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Attack Progression */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-soc-accent" /> Attack Progression Timeline
          </CardTitle>
        </CardHeader>
        <CardBody>
          <LostPhoneAdminProgression result={result} />
        </CardBody>
      </Card>

      {/* Event Timeline + Risk Explanation */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-soc-accent" /> Attack Event Timeline
            </CardTitle>
            <Badge variant={result === 'failure' ? 'critical' : 'low'}>{timelineEvents.length} events</Badge>
          </CardHeader>
          <CardBody className="pt-0">
            <AttackEventTimeline events={timelineEvents} className="mt-4" />
          </CardBody>
        </Card>

        <RiskExplanation
          riskScore={result === 'failure' ? LOST_PHONE_RISK_SCORE : 25}
          riskFactors={result === 'failure' ? LOST_PHONE_RISK_FACTORS : [
            { label: 'Known Device Recognized', contribution: 5, icon: 'Smartphone' },
            { label: 'Verification Passed', contribution: 10, icon: 'ShieldCheck' },
            { label: 'Normal Location', contribution: 10, icon: 'MapPin' },
          ]}
        />
      </div>

      {/* AI Analysis + Recommendation */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-soc-primary/8 via-transparent to-soc-accent/8 pointer-events-none" />
          <motion.div
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-soc-primary/40 to-transparent pointer-events-none"
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          />
          <CardHeader className="relative">
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-soc-primary" /> AI Attack Analysis
            </CardTitle>
            <Badge variant={result === 'failure' ? 'critical' : 'low'}>{result === 'failure' ? '91% confidence' : '95% confidence'}</Badge>
          </CardHeader>
          <CardBody className="relative">
            <div className="relative rounded-xl border border-soc-primary/30 bg-soc-primary/5 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Cpu className="w-4 h-4 text-soc-primary" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-soc-primary">SentinelShield AI Engine</span>
                <span className="relative flex h-2 w-2 ml-auto">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed">
                "{result === 'failure' ? LOST_PHONE_AI_EXPLANATION : 'The verification answers matched the account context. The person using the new device is confirmed as the legitimate account owner. Device trust can be safely restored.'}"
              </p>
            </div>

            {/* Recommendation */}
            <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
              <div className="flex items-start gap-2">
                <Brain className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-400 mb-1">SentinelShield Recommends</p>
                  <p className="text-sm text-slate-200 leading-relaxed">
                    {result === 'failure' ? LOST_PHONE_AI_RECOMMENDATION : 'Allow access and register the new device as trusted. No further action required.'}
                  </p>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        <SecurityResponsePanel
          recommended={result === 'failure' ? 'block' : 'allow'}
          onResponse={setSelectedResponse}
        />
      </div>

      {/* Analyst action area */}
      {selectedResponse && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
          <Card className={`border-2 ${selectedResponse === 'block' || selectedResponse === 'freeze' ? 'border-red-500/50' : selectedResponse === 'hold' ? 'border-orange-500/50' : selectedResponse === 'verify' ? 'border-amber-500/50' : 'border-emerald-500/50'}`}>
            <CardBody className="flex items-center gap-3">
              {selectedResponse === 'allow' ? <CheckCircle2 className="w-6 h-6 text-emerald-400" /> : <ShieldAlert className="w-6 h-6 text-amber-400" />}
              <div>
                <p className="text-sm font-bold text-white">
                  Analyst action: {selectedResponse.toUpperCase()}
                </p>
                <p className="text-xs text-slate-400">
                  {selectedResponse === 'block' && 'Device blocked and user notified. High-risk transactions held pending review.'}
                  {selectedResponse === 'freeze' && 'Account frozen. All activity halted pending manual review.'}
                  {selectedResponse === 'hold' && 'Transactions paused. Analyst review required before release.'}
                  {selectedResponse === 'verify' && 'Step-up verification challenge sent to account owner.'}
                  {selectedResponse === 'allow' && 'Access allowed. New device registered as trusted.'}
                </p>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      )}
    </div>
  );

  function LostPhoneAdminProgression({ result }: { result: 'failure' | 'success' }) {
    const sharedStages = LOST_PHONE_PROGRESSION_STAGES.slice(0, 5);
    const verifiedStage = LOST_PHONE_PROGRESSION_STAGES.find((s) => s.id === 'verified')!;
    const failedStages = LOST_PHONE_PROGRESSION_STAGES.filter((s) => s.branch === 'failed');

    return (
      <div className="w-full">
        {/* Shared horizontal stages */}
        <div className="relative mb-6">
          <div className="absolute top-5 left-5 right-5 h-0.5 bg-soc-border rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #22C55E, #06B6D4, #F59E0B, #F97316, #EF4444)' }}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
            />
          </div>
          <div className="relative flex justify-between">
            {sharedStages.map((stage, i) => {
              const Icon = stageIconMapAdmin[stage.id] ?? Smartphone;
              return (
                <motion.div
                  key={stage.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.12, type: 'spring', stiffness: 300 }}
                  className="flex flex-col items-center"
                  style={{ width: '20%' }}
                >
                  <div className={cn(
                    'relative z-10 w-10 h-10 rounded-full border-2 flex items-center justify-center',
                    i < 4 ? 'bg-soc-card2 border-soc-border' : 'bg-soc-card2 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.3)]',
                  )}>
                    <Icon className={cn('w-4 h-4', i === 0 ? 'text-emerald-400' : i <= 2 ? 'text-amber-400' : 'text-orange-400')} />
                  </div>
                  <p className="mt-2 text-[9px] font-semibold uppercase leading-tight text-center text-slate-400">
                    {stage.shortLabel}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Branch */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex-1 h-px bg-soc-border" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
            {result === 'success' ? 'Verified → Legitimate Access' : 'Failed → Suspicious Access → Account Compromise → Financial Manipulation → Fraud Attempt'}
          </span>
          <div className="flex-1 h-px bg-soc-border" />
        </div>

        <AnimatePresence mode="wait">
          {result === 'success' ? (
            <motion.div key="verified" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex justify-center">
              <div className="flex items-center gap-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-6 py-3">
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
                <div>
                  <p className="text-sm font-bold text-emerald-400">LEGITIMATE ACCESS</p>
                  <p className="text-xs text-slate-400">Device Trust Restored</p>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div key="failed" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex justify-center">
              <div className="flex flex-wrap items-center justify-center gap-2">
                {failedStages.map((stage, i) => {
                  const Icon = stageIconMapAdmin[stage.id] ?? ShieldAlert;
                  return (
                    <motion.div
                      key={stage.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-2"
                    >
                      <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2">
                        <Icon className="w-4 h-4 text-red-400" />
                        <span className="text-xs font-semibold text-white">{stage.shortLabel}</span>
                      </div>
                      {i < failedStages.length - 1 && <ArrowRight className="w-3 h-3 text-red-400" />}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
}

const stageIconMapAdmin: Record<string, typeof Smartphone> = {
  'normal': ShieldCheck,
  'lost-device': Smartphone,
  'new-device': Smartphone,
  'failed-logins': KeyRound,
  'owner-verification': Fingerprint,
  'verified': ShieldCheck,
  'suspicious-access': ShieldAlert,
  'account-compromise': ShieldAlert,
  'financial-manipulation': AlertTriangle,
  'fraud-attempt': Ban,
};
