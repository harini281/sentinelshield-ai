import { motion } from 'framer-motion';
import { useCountUp } from '@/hooks/useCountUp';

export function FraudSpeedometer({ value }: { value: number }) {
  const animated = useCountUp(value, 1800);
  const v = Math.round(animated);
  const angle = -120 + (v / 100) * 240; // -120 to 120 (240deg sweep)

  const color = v >= 85 ? '#EF4444' : v >= 60 ? '#F97316' : v >= 35 ? '#F59E0B' : '#22C55E';
  const tier = v >= 85 ? 'FRAUD LIKELY' : v >= 60 ? 'SUSPICIOUS' : v >= 35 ? 'REVIEW' : 'SAFE';

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[240px] h-[150px]">
        <svg viewBox="0 0 240 150" className="w-full h-full">
          <defs>
            <linearGradient id="speed-arc" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#22C55E" />
              <stop offset="40%" stopColor="#F59E0B" />
              <stop offset="70%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#EF4444" />
            </linearGradient>
          </defs>
          {/* ticks */}
          {Array.from({ length: 13 }).map((_, i) => {
            const a = (-120 + (i * 240) / 12) * (Math.PI / 180);
            const x1 = 120 + 92 * Math.cos(a);
            const y1 = 130 + 92 * Math.sin(a);
            const x2 = 120 + 100 * Math.cos(a);
            const y2 = 130 + 100 * Math.sin(a);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#334155" strokeWidth="2" />;
          })}
          {/* bg arc */}
          <path d="M 28 130 A 92 92 0 0 1 212 130" fill="none" stroke="#1E2A40" strokeWidth="10" strokeLinecap="round" />
          {/* value arc */}
          <motion.path
            d="M 28 130 A 92 92 0 0 1 212 130"
            fill="none"
            stroke="url(#speed-arc)"
            strokeWidth="10"
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray={1}
            initial={{ strokeDashoffset: 1 }}
            animate={{ strokeDashoffset: 1 - v / 100 }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
          />
          {/* needle */}
          <motion.g
            initial={{ rotate: -120 }}
            animate={{ rotate: angle }}
            transition={{ duration: 1.8, ease: 'easeOut' }}
            style={{ transformOrigin: '120px 130px' }}
          >
            <line x1="120" y1="130" x2="120" y2="55" stroke={color} strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="120" cy="130" r="8" fill="#0B1220" stroke={color} strokeWidth="2.5" />
          </motion.g>
        </svg>
      </div>
      <div className="-mt-3 text-center">
        <p className="text-4xl font-extrabold" style={{ color }}>{v}<span className="text-xl text-slate-500">%</span></p>
        <p className="text-xs font-semibold tracking-widest mt-1" style={{ color }}>{tier}</p>
      </div>
      <div className="flex justify-between w-[240px] mt-3 text-[10px] text-slate-500 font-mono">
        <span>SAFE</span><span>REVIEW</span><span>FRAUD</span>
      </div>
    </div>
  );
}
