import { motion } from 'framer-motion';
import { BrainCircuit, Cpu, ShieldCheck, ArrowRight, Crosshair } from 'lucide-react';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { attackStageColor, cn } from '@/utils/cn';
import { stageLabel } from '@/services/attackData';
import type { AttackProgression } from '@/types';

interface Props {
  attack: AttackProgression;
  className?: string;
}

export function AiAttackAnalysis({ attack, className }: Props) {
  const stageColor = attackStageColor[attack.currentStage];

  return (
    <Card className={cn('relative overflow-hidden', className)}>
      <div className="absolute inset-0 bg-gradient-to-br from-soc-primary/8 via-transparent to-soc-accent/8 pointer-events-none" />

      {/* Scan line effect */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-soc-primary/40 to-transparent pointer-events-none"
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      />

      <CardHeader className="relative">
        <CardTitle className="flex items-center gap-2">
          <BrainCircuit className="w-4 h-4 text-soc-primary" />
          AI Attack Analysis
        </CardTitle>
        <Badge variant="critical">{attack.confidence}% confidence</Badge>
      </CardHeader>

      <CardBody className="relative">
        {/* AI analysis text — styled like an intelligence panel, not a chatbot */}
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
            "{attack.aiAnalysis}"
          </p>
        </div>

        {/* Structured intelligence output */}
        <div className="mt-4 grid grid-cols-1 gap-2.5">
          <AnalysisRow icon={Crosshair} label="Current Stage" value={stageLabel(attack.currentStage)} valueClass={stageColor.text} />
          <AnalysisRow icon={BrainCircuit} label="Predicted Next Action" value={attack.predictedNextAction} valueClass="text-soc-accent" />
          <AnalysisRow icon={Cpu} label="Confidence" value={`${attack.confidence}%`} valueClass="text-white" />
          <AnalysisRow icon={ShieldCheck} label="Recommended Action" value={attack.recommendedActionLabel} valueClass="text-amber-400" />
        </div>
      </CardBody>
    </Card>
  );
}

function AnalysisRow({ icon: Icon, label, value, valueClass }: { icon: typeof Cpu; label: string; value: string; valueClass: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="flex items-center gap-3 glass-soft rounded-xl p-3"
    >
      <Icon className="w-4 h-4 text-slate-500 shrink-0" />
      <span className="text-xs text-slate-500 shrink-0">{label}</span>
      <ArrowRight className="w-3 h-3 text-slate-600 shrink-0 ml-auto rotate-0" />
      <span className={cn('text-sm font-semibold text-right', valueClass)}>{value}</span>
    </motion.div>
  );
}
