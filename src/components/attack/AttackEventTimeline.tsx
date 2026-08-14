import { motion } from 'framer-motion';
import {
  Smartphone, Globe, KeyRound, LogIn, Lock, UserPlus, DollarSign,
  Clock, MapPin, Zap, Wallet, Bot, ShieldAlert, Activity,
} from 'lucide-react';
import { attackStageColor, riskColor, cn } from '@/utils/cn';
import type { AttackTimelineEvent } from '@/types';

const iconMap: Record<string, typeof Smartphone> = {
  Smartphone, Globe, KeyRound, LogIn, Lock, UserPlus, DollarSign,
  Clock, MapPin, Zap, Wallet, Bot, ShieldAlert,
};

function formatTime(ts: string): string {
  const d = new Date(ts);
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

interface Props {
  events: AttackTimelineEvent[];
  className?: string;
}

export function AttackEventTimeline({ events, className }: Props) {
  return (
    <div className={cn('relative', className)}>
      <div className="relative pl-8">
        {/* Vertical line */}
        <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-soc-primary via-soc-border to-transparent" />

        {events.map((event, i) => {
          const c = riskColor[event.severity];
          const Icon = iconMap[event.icon] ?? Activity;

          return (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="relative mb-4 last:mb-0"
            >
              {/* Dot */}
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.08 + 0.2, type: 'spring', stiffness: 300 }}
                className={cn(
                  'absolute -left-[22px] top-1.5 w-4 h-4 rounded-full border-2 border-soc-bg flex items-center justify-center',
                  c.bg,
                )}
              >
                <span className={cn('w-1.5 h-1.5 rounded-full', c.text, 'bg-current')} />
              </motion.span>

              {/* Content */}
              <div className="glass-soft rounded-xl p-3 hover:border-soc-accent/30 transition-colors">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon className={cn('w-4 h-4 shrink-0', c.text)} />
                    <span className="text-sm font-semibold text-white truncate">{event.label}</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 shrink-0">{formatTime(event.timestamp)}</span>
                </div>
                <p className="text-xs text-slate-400 mt-1.5">{event.description}</p>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-soc-border/50">
                  <span className={cn('text-[10px] font-bold uppercase', c.text)}>{event.severity}</span>
                  <span className="text-xs text-slate-400">
                    Risk contribution: <span className={cn('font-bold', c.text)}>+{event.riskContribution}</span>
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
