import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import { cn } from '@/utils/cn';

export function ShieldLogo({ size = 40, className = '' }: { size?: number; className?: string }) {
  return (
    <div className={cn('relative inline-flex items-center justify-center', className)} style={{ width: size, height: size }}>
      {/* outer rotating ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-dashed border-soc-accent/40"
        animate={{ rotate: 360 }}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
      />
      {/* inner counter-rotating ring */}
      <motion.div
        className="absolute inset-1.5 rounded-full border border-soc-primary/50"
        style={{ borderTopColor: 'transparent', borderBottomColor: 'transparent' }}
        animate={{ rotate: -360 }}
        transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
      />
      {/* pulse glow */}
      <motion.div
        className="absolute inset-0 rounded-full bg-soc-accent/20 blur-md"
        animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.08, 1] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <ShieldCheck className="relative text-soc-accent" style={{ width: size * 0.5, height: size * 0.5 }} />
    </div>
  );
}
