import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, AlertTriangle, ShieldAlert, Info, X } from 'lucide-react';
import type { ToastNotification } from '@/types';
import { cn } from '@/utils/cn';

const config = {
  success: { icon: CheckCircle2, color: 'text-emerald-400', border: 'border-emerald-500/50', glow: 'shadow-[0_0_20px_rgba(34,197,94,0.25)]' },
  warning: { icon: AlertTriangle, color: 'text-amber-400', border: 'border-amber-500/50', glow: 'shadow-[0_0_20px_rgba(245,158,11,0.25)]' },
  danger: { icon: ShieldAlert, color: 'text-red-400', border: 'border-red-500/50', glow: 'shadow-[0_0_20px_rgba(239,68,68,0.3)]' },
  info: { icon: Info, color: 'text-cyan-400', border: 'border-cyan-500/50', glow: 'shadow-[0_0_20px_rgba(6,182,212,0.25)]' },
};

interface Props {
  toasts: ToastNotification[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: Props) {
  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-3 w-[340px] max-w-[calc(100vw-2rem)]">
      <AnimatePresence>
        {toasts.map((t) => {
          const c = config[t.type];
          const Icon = c.icon;
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, x: 60, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              className={cn('glass rounded-xl border p-4 flex items-start gap-3', c.border, c.glow)}
            >
              <Icon className={cn('w-5 h-5 mt-0.5 shrink-0', c.color)} />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{t.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">{t.message}</p>
              </div>
              <button onClick={() => onDismiss(t.id)} className="text-slate-500 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
