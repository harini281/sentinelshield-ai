import { motion } from 'framer-motion';
import { Sparkles, TrendingUp, ShieldQuestion, Lightbulb } from 'lucide-react';
import { cn } from '@/utils/cn';

interface Props {
  predictedAction: string;
  confidence: number;
  reason: string;
  preparation: string;
  className?: string;
}

export function PredictedNextAction({ predictedAction, confidence, reason, preparation, className }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        'relative overflow-hidden rounded-2xl border border-soc-primary/40 bg-gradient-to-br from-soc-primary/15 via-soc-card to-soc-accent/10 p-5',
        'shadow-[0_0_30px_rgba(124,58,237,0.2)]',
        className,
      )}
    >
      {/* Animated background shimmer */}
      <motion.div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          background: 'linear-gradient(110deg, transparent 30%, rgba(124,58,237,0.15) 50%, transparent 70%)',
        }}
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />

      <div className="relative">
        <div className="flex items-center gap-2 mb-4">
          <div className="relative">
            <Sparkles className="w-5 h-5 text-soc-primary" />
            <motion.span
              className="absolute inset-0"
              animate={{ scale: [1, 1.8], opacity: [0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-5 h-5 text-soc-primary" />
            </motion.span>
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-soc-primary">Predicted Next Action</span>
        </div>

        <motion.h3
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="text-2xl font-bold text-white"
        >
          {predictedAction}
        </motion.h3>

        {/* Confidence bar */}
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-slate-400 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-soc-accent" /> Confidence
            </span>
            <span className="font-bold text-soc-accent">{confidence}%</span>
          </div>
          <div className="h-2.5 rounded-full bg-soc-border overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-soc-primary to-soc-accent"
              initial={{ width: 0 }}
              animate={{ width: `${confidence}%` }}
              transition={{ delay: 0.3, duration: 1.2, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Reason */}
        <div className="mt-4 glass-soft rounded-xl p-3">
          <div className="flex items-start gap-2">
            <ShieldQuestion className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-1">AI Reasoning</p>
              <p className="text-sm text-slate-300 leading-relaxed">{reason}</p>
            </div>
          </div>
        </div>

        {/* Recommended preparation */}
        <div className="mt-3 rounded-xl p-3 border border-amber-500/30 bg-amber-500/10">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-400 mb-1">Recommended Preparation</p>
              <p className="text-sm text-slate-200 leading-relaxed">{preparation}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
