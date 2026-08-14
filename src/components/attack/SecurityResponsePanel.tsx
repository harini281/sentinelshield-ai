import { motion } from 'framer-motion';
import { CheckCircle2, ShieldCheck, ShieldAlert, ShieldX, Snowflake, Shield } from 'lucide-react';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { cn, riskColor } from '@/utils/cn';
import type { SecurityResponseType, RiskLevel } from '@/types';

const responses: { type: SecurityResponseType; label: string; risk: RiskLevel; description: string; icon: typeof Shield }[] = [
  { type: 'allow', label: 'Allow / Log', risk: 'low', description: 'Transaction proceeds. Logged for audit trail.', icon: CheckCircle2 },
  { type: 'verify', label: 'Verify User', risk: 'medium', description: 'Step-up authentication required.', icon: ShieldCheck },
  { type: 'hold', label: 'Hold', risk: 'high', description: 'Transaction paused pending review.', icon: ShieldAlert },
  { type: 'block', label: 'Block Transaction', risk: 'critical', description: 'Transaction blocked. User notified.', icon: ShieldX },
  { type: 'freeze', label: 'Freeze Account', risk: 'critical', description: 'Account frozen. All activity halted.', icon: Snowflake },
];

interface Props {
  recommended?: SecurityResponseType;
  className?: string;
  onResponse?: (type: SecurityResponseType) => void;
  compact?: boolean;
}

export function SecurityResponsePanel({ recommended, className, onResponse, compact }: Props) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-soc-accent" />
          Security Response
        </CardTitle>
      </CardHeader>
      <CardBody className={compact ? 'p-3' : undefined}>
        <div className={cn('grid gap-2.5', compact ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-1')}>
          {responses.map((r, i) => {
            const c = riskColor[r.risk];
            const isRecommended = recommended === r.type;
            return (
              <motion.button
                key={r.type}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onResponse?.(r.type)}
                className={cn(
                  'relative flex items-center gap-3 rounded-xl border p-3 text-left transition-all',
                  isRecommended ? cn(c.bg, c.border, 'ring-1 ring-offset-0') : 'border-soc-border bg-soc-card2 hover:border-soc-accent/30',
                )}
              >
                <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center shrink-0', c.bg)}>
                  <r.icon className={cn('w-4.5 h-4.5', c.text)} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{r.label}</span>
                    {isRecommended && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={cn('text-[9px] font-bold uppercase px-1.5 py-0.5 rounded-full', c.bg, c.text, 'border', c.border)}
                      >
                        Recommended
                      </motion.span>
                    )}
                  </div>
                  {!compact && <p className="text-xs text-slate-400 mt-0.5">{r.description}</p>}
                </div>
              </motion.button>
            );
          })}
        </div>
      </CardBody>
    </Card>
  );
}
