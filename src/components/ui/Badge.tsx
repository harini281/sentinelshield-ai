import type { HTMLAttributes } from 'react';
import { cn } from '@/utils/cn';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'low' | 'medium' | 'high' | 'critical' | 'approved' | 'pending' | 'blocked' | 'review' | 'neutral';
}

const variants: Record<string, string> = {
  low: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/40',
  medium: 'text-amber-400 bg-amber-500/15 border-amber-500/40',
  high: 'text-orange-400 bg-orange-500/15 border-orange-500/40',
  critical: 'text-red-400 bg-red-500/15 border-red-500/40',
  approved: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/40',
  pending: 'text-amber-400 bg-amber-500/15 border-amber-500/40',
  blocked: 'text-red-400 bg-red-500/15 border-red-500/40',
  review: 'text-orange-400 bg-orange-500/15 border-orange-500/40',
  neutral: 'text-slate-300 bg-slate-500/15 border-slate-500/40',
};

export function Badge({ variant = 'neutral', className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize',
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
