import { AnimatePresence, motion } from 'framer-motion';
import { Bell, X, ShieldAlert, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import type { ToastNotification } from '@/types';
import { cn } from '@/utils/cn';

const config = {
  danger: { icon: ShieldAlert, color: 'text-red-400', dot: 'bg-red-500' },
  warning: { icon: AlertTriangle, color: 'text-amber-400', dot: 'bg-amber-500' },
  success: { icon: CheckCircle2, color: 'text-emerald-400', dot: 'bg-emerald-500' },
  info: { icon: Info, color: 'text-cyan-400', dot: 'bg-cyan-500' },
};

interface Props {
  open: boolean;
  onClose: () => void;
  notifications: ToastNotification[];
}

export function NotificationCenter({ open, onClose, notifications }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />
          <motion.aside
            initial={{ x: 380 }}
            animate={{ x: 0 }}
            exit={{ x: 380 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-[380px] max-w-[90vw] glass border-l border-soc-border z-50 flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-soc-border">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-soc-accent" />
                <h3 className="text-sm font-semibold text-white">Notification Center</h3>
                <span className="text-xs text-slate-400">({notifications.length})</span>
              </div>
              <button onClick={onClose} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-slate-500">
                  <Bell className="w-10 h-10 mb-3 opacity-40" />
                  <p className="text-sm">No active notifications</p>
                  <p className="text-xs mt-1">System is monitoring quietly</p>
                </div>
              ) : (
                notifications.map((n, i) => {
                  const c = config[n.type];
                  const Icon = c.icon;
                  return (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="glass-soft rounded-xl p-4 flex items-start gap-3 hover:border-soc-accent/40 transition-colors"
                    >
                      <div className={cn('relative mt-0.5', c.color)}>
                        <Icon className="w-5 h-5" />
                        <span className={cn('absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full animate-pulse2', c.dot)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white">{n.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{n.message}</p>
                        <p className="text-[10px] text-slate-500 mt-1.5 font-mono">{new Date(n.timestamp).toLocaleTimeString()}</p>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
