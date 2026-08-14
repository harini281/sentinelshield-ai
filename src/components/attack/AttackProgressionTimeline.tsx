import { motion } from 'framer-motion';
import { Check, Crosshair, AlertTriangle } from 'lucide-react';
import { ATTACK_STAGES } from '@/services/attackData';
import { attackStageColor, cn } from '@/utils/cn';
import type { AttackStage } from '@/types';

interface Props {
  currentStage: AttackStage;
  className?: string;
  compact?: boolean;
}

export function AttackProgressionTimeline({ currentStage, className, compact }: Props) {
  const currentIdx = ATTACK_STAGES.findIndex((s) => s.id === currentStage);

  return (
    <div className={cn('w-full', className)}>
      {!compact && (
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-soc-border to-soc-border" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Attack Progression</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-soc-border to-soc-border" />
        </div>
      )}

      <div className="relative">
        {/* Connecting line */}
        <div className="absolute top-5 left-5 right-5 h-0.5 bg-soc-border rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #22C55E, #06B6D4, #F59E0B, #F97316, #EF4444, #DC2626)' }}
            initial={{ width: '0%' }}
            animate={{ width: `${(currentIdx / (ATTACK_STAGES.length - 1)) * 100}%` }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          />
        </div>

        {/* Stage nodes */}
        <div className="relative flex justify-between">
          {ATTACK_STAGES.map((stage, i) => {
            const isPast = i < currentIdx;
            const isCurrent = i === currentIdx;
            const isFuture = i > currentIdx;
            const isNext = i === currentIdx + 1;
            const color = attackStageColor[stage.id];

            return (
              <div key={stage.id} className="flex flex-col items-center" style={{ width: `${100 / ATTACK_STAGES.length}%` }}>
                {/* Node */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.1, type: 'spring', stiffness: 300, damping: 20 }}
                  className={cn(
                    'relative z-10 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300',
                    isPast && 'bg-soc-card2 border-soc-border',
                    isCurrent && cn(color.bg, color.border, color.glow),
                    isFuture && 'bg-soc-card2 border-soc-border/50',
                  )}
                >
                  {isPast && <Check className="w-4 h-4 text-slate-400" />}
                  {isCurrent && (
                    <motion.span
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className={cn('w-3 h-3 rounded-full', color.text, 'bg-current')}
                    />
                  )}
                  {isFuture && (
                    <span className={cn('w-2 h-2 rounded-full', isNext ? 'bg-amber-400/50' : 'bg-slate-700')} />
                  )}

                  {/* Pulsing ring for current */}
                  {isCurrent && (
                    <motion.span
                      className={cn('absolute inset-0 rounded-full border-2', color.border)}
                      animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                    />
                  )}
                </motion.div>

                {/* Label */}
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 + 0.2 }}
                  className="mt-3 text-center"
                >
                  <p className={cn(
                    'text-[10px] font-semibold uppercase tracking-wide leading-tight',
                    isCurrent ? color.text : isPast ? 'text-slate-400' : 'text-slate-600',
                  )}>
                    {compact ? stage.shortLabel : stage.label}
                  </p>
                  {isCurrent && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mt-1 flex items-center justify-center gap-0.5"
                    >
                      <Crosshair className={cn('w-2.5 h-2.5', color.text)} />
                      <span className={cn('text-[9px] font-bold uppercase', color.text)}>Current</span>
                    </motion.div>
                  )}
                  {isNext && (
                    <div className="mt-1 flex items-center justify-center gap-0.5">
                      <AlertTriangle className="w-2.5 h-2.5 text-amber-400" />
                      <span className="text-[9px] font-bold uppercase text-amber-400">Next</span>
                    </div>
                  )}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
