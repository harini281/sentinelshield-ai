import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { generateThreats } from '@/services/mockData';
import { riskColor } from '@/utils/cn';
import type { ThreatLocation, AttackLine } from '@/types';

// Simple equirectangular projection onto a 1000x500 viewBox
function project(lat: number, lng: number) {
  const x = ((lng + 180) / 360) * 1000;
  const y = ((90 - lat) / 180) * 500;
  return { x, y };
}

// Dotted world map (low-res landmass approximation using a sparse dot grid)
const LAND_DOTS: { cx: number; cy: number }[] = (() => {
  const dots: { cx: number; cy: number }[] = [];
  // crude continent bounding regions in lng/lat
  const regions: [number, number, number, number, number][] = [
    // [lngMin, lngMax, latMin, latMax, step]
    [-168, -52, 15, 72, 8],   // N America
    [-82, -35, -55, 15, 8],   // S America
    [-12, 45, 35, 71, 7],     // Europe
    [-18, 52, -35, 37, 8],    // Africa
    [25, 145, 5, 72, 9],      // Asia
    [110, 155, -40, -10, 8],  // Oceania
  ];
  for (const [lngMin, lngMax, latMin, latMax, step] of regions) {
    for (let lat = latMin; lat <= latMax; lat += step) {
      for (let lng = lngMin; lng <= lngMax; lng += step) {
        // skip some to make it look organic
        if (Math.random() > 0.35) continue;
        const p = project(lat, lng);
        dots.push({ cx: p.x, cy: p.y });
      }
    }
  }
  return dots;
})();

export function WorldThreatMap() {
  const [threats, setThreats] = useState<ThreatLocation[]>(generateThreats());
  const [attacks, setAttacks] = useState<AttackLine[]>([]);
  const [pulse, setPulse] = useState(0);

  // rotate threats / generate new attack lines
  useEffect(() => {
    const id = setInterval(() => {
      setThreats(generateThreats());
      setPulse((p) => p + 1);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (threats.length < 2) return;
    const lines: AttackLine[] = [];
    const hq = project(40.71, -74.0); // NY HQ
    const targets = threats.filter((t) => t.severity === 'critical' || t.severity === 'high').slice(0, 4);
    for (const t of targets) {
      const p = project(t.lat, t.lng);
      lines.push({ from: hq, to: p, severity: t.severity });
    }
    setAttacks(lines);
  }, [threats]);

  return (
    <div className="relative w-full rounded-xl overflow-hidden bg-soc-card2 border border-soc-border">
      <svg viewBox="0 0 1000 500" className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
        {/* grid backdrop */}
        <defs>
          <radialGradient id="hq-glow">
            <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.8} />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity={0} />
          </radialGradient>
          <linearGradient id="attack-critical" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#EF4444" stopOpacity={0.1} />
            <stop offset="50%" stopColor="#EF4444" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#EF4444" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="attack-high" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#F97316" stopOpacity={0.1} />
            <stop offset="50%" stopColor="#F97316" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#F97316" stopOpacity={0.1} />
          </linearGradient>
        </defs>

        {/* faint lat/long grid */}
        {Array.from({ length: 9 }).map((_, i) => (
          <line key={`v${i}`} x1={(i + 1) * 100} y1="0" x2={(i + 1) * 100} y2="500" stroke="#1E2A40" strokeWidth="0.5" />
        ))}
        {Array.from({ length: 4 }).map((_, i) => (
          <line key={`h${i}`} x1="0" y1={(i + 1) * 100} x2="1000" y2={(i + 1) * 100} stroke="#1E2A40" strokeWidth="0.5" />
        ))}

        {/* landmass dots */}
        {LAND_DOTS.map((d, i) => (
          <circle key={i} cx={d.cx} cy={d.cy} r="1.4" fill="#2a3a55" opacity="0.7" />
        ))}

        {/* HQ glow */}
        <circle cx={project(40.71, -74).x} cy={project(40.71, -74).y} r="22" fill="url(#hq-glow)" />
        <circle cx={project(40.71, -74).x} cy={project(40.71, -74).y} r="3" fill="#06B6D4" />

        {/* attack lines */}
        <AnimatePresence>
          {attacks.map((a, i) => {
            const c = a.severity === 'critical' ? '#EF4444' : '#F97316';
            const grad = a.severity === 'critical' ? 'attack-critical' : 'attack-high';
            const midX = (a.from.x + a.to.x) / 2;
            const midY = (a.from.y + a.to.y) / 2 - 40;
            const path = `M ${a.from.x} ${a.from.y} Q ${midX} ${midY} ${a.to.x} ${a.to.y}`;
            return (
              <g key={`${pulse}-${i}`}>
                <motion.path
                  d={path}
                  fill="none"
                  stroke={`url(#${grad})`}
                  strokeWidth="1.5"
                  strokeDasharray="6 4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.6, delay: i * 0.2 }}
                />
                {/* moving pulse along path */}
                <motion.circle
                  r="2.5"
                  fill={c}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 1, 0], offsetDistance: ['0%', '100%'] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  style={{ offsetPath: `path('${path}')` } as React.CSSProperties}
                />
              </g>
            );
          })}
        </AnimatePresence>

        {/* threat markers */}
        {threats.map((t) => {
          const p = project(t.lat, t.lng);
          const c = riskColor[t.severity];
          return (
            <g key={t.id}>
              <motion.circle
                cx={p.x}
                cy={p.y}
                r="8"
                fill="none"
                stroke={c.hex}
                strokeWidth="1.5"
                initial={{ scale: 0.4, opacity: 0.8 }}
                animate={{ scale: [0.4, 2.4], opacity: [0.8, 0] }}
                transition={{ duration: 2.2, repeat: Infinity }}
                style={{ transformOrigin: `${p.x}px ${p.y}px` }}
              />
              <circle cx={p.x} cy={p.y} r="3" fill={c.hex} />
              <text x={p.x + 7} y={p.y + 3} fill="#94a3b8" fontSize="9" className="font-mono">{t.name}</text>
            </g>
          );
        })}
      </svg>

      {/* legend overlay */}
      <div className="absolute bottom-3 left-3 glass-soft rounded-lg px-3 py-2 flex items-center gap-3 text-[10px]">
        {(['critical', 'high', 'medium', 'low'] as const).map((s) => (
          <span key={s} className="flex items-center gap-1 text-slate-400">
            <span className="w-2 h-2 rounded-full" style={{ background: riskColor[s].hex }} /> {s}
          </span>
        ))}
      </div>
    </div>
  );
}
