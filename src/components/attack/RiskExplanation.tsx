import { motion } from 'framer-motion';
import { TrendingUp, Shield } from 'lucide-react';
import {
  Smartphone, Globe, KeyRound, Lock, UserPlus, DollarSign,
  Clock, MapPin, Zap, Wallet, Bot, ShieldAlert, Activity,
} from 'lucide-react';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { cn } from '@/utils/cn';

const iconMap: Record<string, typeof Smartphone> = {
  Smartphone, Globe, KeyRound, Lock, UserPlus, DollarSign,
  Clock, MapPin, Zap, Wallet, Bot, ShieldAlert,
};

interface Props {
  riskScore: number;
  riskFactors: { label: string; contribution: number; icon: string }[];
  className?: string;
}

export function RiskExplanation({ riskScore, riskFactors, className }: Props) {
  const maxContribution = Math.max(...riskFactors.map((f) => f.contribution), 1);
  const scoreColor = riskScore >= 85 ? 'text-red-400' : riskScore >= 65 ? 'text-orange-400' : riskScore >= 35 ? 'text-amber-400' : 'text-emerald-400';
  const barColor = riskScore >= 85 ? 'from-red-500 to-red-600' : riskScore >= 65 ? 'from-orange-500 to-red-500' : riskScore >= 35 ? 'from-amber-500 to-orange-500' : 'from-emerald-500 to-cyan-500';

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-soc-accent" />
          Risk Explanation
        </CardTitle>
      </CardHeader>
      <CardBody>
        {/* Score display */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-wider">Risk Score</p>
            <p className={cn('text-4xl font-extrabold', scoreColor)}>
              {riskScore}
              <span className="text-lg text-slate-500 font-normal">/100</span>
            </p>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{riskFactors.length} factors</span>
          </div>
        </div>

        {/* Overall score bar */}
        <div className="h-2.5 rounded-full bg-soc-border overflow-hidden mb-5">
          <motion.div
            className={cn('h-full rounded-full bg-gradient-to-r', barColor)}
            initial={{ width: 0 }}
            animate={{ width: `${riskScore}%` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </div>

        {/* Factor breakdown */}
        <div className="space-y-2.5">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mb-2">Risk Factor Breakdown</p>
          {riskFactors.map((factor, i) => {
            const Icon = iconMap[factor.icon] ?? Activity;
            const widthPct = (factor.contribution / maxContribution) * 100;
            return (
              <motion.div
                key={factor.label}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-soc-card2 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-300 truncate">{factor.label}</span>
                    <span className="text-xs font-bold text-red-400 shrink-0 ml-2">+{factor.contribution}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-soc-border overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-amber-500 to-red-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${widthPct}%` }}
                      transition={{ delay: i * 0.08 + 0.2, duration: 0.8 }}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Total */}
        <div className="mt-4 pt-3 border-t border-soc-border flex items-center justify-between">
          <span className="text-xs text-slate-400">Cumulative Risk</span>
          <span className={cn('text-sm font-bold', scoreColor)}>{riskScore}/100</span>
        </div>
      </CardBody>
    </Card>
  );
}
