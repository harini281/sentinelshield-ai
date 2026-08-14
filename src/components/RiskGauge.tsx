import { motion } from 'framer-motion';
import { useCountUp } from '@/hooks/useCountUp';

export function RiskGauge({ value }: { value: number }) {
  const animated = useCountUp(value, 1600);
  const v = Math.round(animated);
  const angle = -90 + (v / 100) * 180; // -90 to 90

  const color = v >= 80 ? '#EF4444' : v >= 60 ? '#F97316' : v >= 35 ? '#F59E0B' : '#22C55E';
  const label = v >= 80 ? 'CRITICAL' : v >= 60 ? 'HIGH' : v >= 35 ? 'MODERATE' : 'LOW';

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[220px] h-[130px]">
        <svg viewBox="0 0 220 130" className="w-full h-full">
          <defs>
            <linearGradient id="gauge-arc" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#22C55E" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>
          {/* background arc */}
          <path d="M 20 110 A 90 90 0 0 1 200 110" fill="none" stroke="#1E2A40" strokeWidth="14" strokeLinecap="round" />
          {/* value arc */}
          <motion.path
            d="M 20 110 A 90 90 0 0 1 200 110"
            fill="none"
            stroke="url(#gauge-arc)"
            strokeWidth="14"
            strokeLinecap="round"
            strokeDasharray="283"
            initial={{ strokeDashoffset: 283 }}
            animate={{ strokeDashoffset: 283 - (283 * v) / 100 }}
            transition={{ duration: 1.6, ease: 'easeOut' }}
          />
          {/* needle */}
          <motion.g
            initial={{ rotate: -90 }}
            animate={{ rotate: angle }}
            transition={{ duration: 1.6, ease: 'easeOut' }}
            style={{ transformOrigin: '110px 110px' }}
          >
            <line x1="110" y1="110" x2="110" y2="40" stroke={color} strokeWidth="3" strokeLinecap="round" />
            <circle cx="110" cy="110" r="6" fill={color} />
          </motion.g>
        </svg>
      </div>
      <div className="-mt-2 text-center">
        <p className="text-4xl font-extrabold" style={{ color }}>{v}</p>
        <p className="text-xs font-semibold tracking-widest mt-1" style={{ color }}>{label}</p>
      </div>
      <div className="flex justify-between w-[220px] mt-3 text-[10px] text-slate-500 font-mono">
        <span>0</span><span>25</span><span>50</span><span>75</span><span>100</span>
      </div>
    </div>
  );
}
