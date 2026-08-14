import { motion } from 'framer-motion';
import {
  Crosshair, Activity, ShieldAlert, TrendingUp, BrainCircuit,
  AlertTriangle, Zap, ShieldCheck, Eye,
} from 'lucide-react';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AttackProgressionTimeline } from './AttackProgressionTimeline';
import { attackStageColor, cn, attackStatusColor } from '@/utils/cn';
import { stageLabel } from '@/services/attackData';
import type { AttackProgression } from '@/types';

interface Props {
  attack: AttackProgression;
  className?: string;
  onViewDetails?: () => void;
}

export function AttackIntelligenceCard({ attack, className, onViewDetails }: Props) {
  const stageColor = attackStageColor[attack.currentStage];

  const metrics = [
    { label: 'Risk Score', value: `${attack.riskScore}`, suffix: '/100', icon: ShieldAlert, color: stageColor.text },
    { label: 'Confidence', value: `${attack.confidence}`, suffix: '%', icon: TrendingUp, color: 'text-soc-accent' },
    { label: 'Correlated Events', value: `${attack.correlatedEventCount}`, suffix: '', icon: Activity, color: 'text-cyan-400' },
  ];

  return (
    <Card className={cn('relative overflow-hidden', className)}>
      {/* Background glow */}
      <div className={cn('absolute inset-0 opacity-30 pointer-events-none', stageColor.bg)} />
      <div className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-[100px] pointer-events-none" style={{ background: stageColor.hex + '20' }} />

      <CardBody className="relative">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BrainCircuit className="w-5 h-5 text-soc-primary" />
              <span className="text-xs font-bold uppercase tracking-widest text-soc-primary">Attack Progression Intelligence</span>
            </div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white">{attack.attackTypeLabel}</h2>
              <span className={cn('inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold uppercase', attackStatusColor[attack.status])}>
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse2" />
                {attack.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Incident <span className="font-mono text-soc-accent">{attack.id}</span> · User: {attack.affectedUser}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className={cn('rounded-xl border px-3 py-2 text-center', stageColor.border, stageColor.bg)}>
              <p className="text-[10px] uppercase tracking-wider text-slate-400">Current Stage</p>
              <p className={cn('text-sm font-bold', stageColor.text)}>{stageLabel(attack.currentStage)}</p>
            </div>
            {onViewDetails && (
              <button
                onClick={onViewDetails}
                className="flex items-center gap-1 text-xs font-medium text-soc-accent hover:text-white transition-colors px-3 py-2 rounded-xl glass-soft hover:border-soc-accent/40"
              >
                <Eye className="w-3.5 h-3.5" /> Details
              </button>
            )}
          </div>
        </div>

        {/* Progression timeline */}
        <AttackProgressionTimeline currentStage={attack.currentStage} className="mb-6" />

        {/* Metrics row */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-soft rounded-xl p-3 text-center"
            >
              <m.icon className={cn('w-4 h-4 mx-auto mb-1.5', m.color)} />
              <p className={cn('text-2xl font-bold', m.color)}>
                {m.value}<span className="text-xs text-slate-500 font-normal">{m.suffix}</span>
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">{m.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Prediction + Response row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="relative overflow-hidden rounded-xl border border-soc-primary/40 bg-gradient-to-br from-soc-primary/10 to-transparent p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <Zap className="w-3.5 h-3.5 text-soc-primary" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-soc-primary">Predicted Next Action</span>
            </div>
            <p className="text-base font-semibold text-white">{attack.predictedNextAction}</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="flex-1 h-1.5 rounded-full bg-soc-border overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-soc-primary to-soc-accent"
                  initial={{ width: 0 }}
                  animate={{ width: `${attack.predictedNextConfidence}%` }}
                  transition={{ delay: 0.4, duration: 1 }}
                />
              </div>
              <span className="text-xs font-bold text-soc-accent">{attack.predictedNextConfidence}%</span>
            </div>
          </div>

          <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4">
            <div className="flex items-center gap-1.5 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">Recommended Action</span>
            </div>
            <p className="text-base font-semibold text-white">{attack.recommendedActionLabel}</p>
            <div className="flex items-center gap-1.5 mt-2">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs text-slate-400">SOC analyst action required</span>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
