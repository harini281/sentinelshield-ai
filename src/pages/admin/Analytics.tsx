import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer, BarChart, Bar, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import { Flame, TrendingUp, MapPin, Users2, Activity, Calendar } from 'lucide-react';
import { PageHeader } from '@/layouts/AdminLayout';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { fraudService } from '@/services/api';
import { riskColor, formatNumber } from '@/utils/cn';
import type { User, Transaction } from '@/types';

export default function RiskAnalytics() {
  const [users, setUsers] = useState<User[]>([]);
  const [tx, setTx] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [u, t] = await Promise.all([fraudService.getUsers(), fraudService.getTransactions()]);
      setUsers(u);
      setTx(t);
      setLoading(false);
    })();
  }, []);

  // heatmap grid 7x24
  const heat = Array.from({ length: 7 }).map((_, day) =>
    Array.from({ length: 24 }).map((_, hour) => Math.floor(Math.random() * 100)),
  );
  const heatColor = (v: number) => {
    if (v >= 80) return 'bg-red-500/80';
    if (v >= 60) return 'bg-orange-500/70';
    if (v >= 40) return 'bg-amber-500/60';
    if (v >= 20) return 'bg-blue-500/50';
    return 'bg-slate-700/40';
  };

  const topRisky = [...users].sort((a, b) => b.riskScore - a.riskScore).slice(0, 6);

  const countryStats = tx.reduce<Record<string, number>>((acc, t) => {
    acc[t.country] = (acc[t.country] || 0) + 1;
    return acc;
  }, {});
  const topCountries = Object.entries(countryStats).sort((a, b) => b[1] - a[1]).slice(0, 6);

  const dailyStats = Array.from({ length: 7 }).map((_, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
    attacks: Math.floor(Math.random() * 40) + 5,
    blocked: Math.floor(Math.random() * 30) + 2,
  }));

  const riskTrend = Array.from({ length: 12 }).map((_, i) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
    risk: Math.floor(Math.random() * 30) + 50,
  }));

  return (
    <div>
      <PageHeader title="Risk Analytics" subtitle="Heatmaps, trends, and geographic risk distribution across the enterprise" />

      {/* Heatmap */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Flame className="w-4 h-4 text-soc-accent" /> Attack Heatmap (Day × Hour)</CardTitle>
          <Badge variant="high">weekly</Badge>
        </CardHeader>
        <CardBody className="overflow-x-auto">
          {loading ? <Skeleton className="h-48 w-full" /> : (
            <div className="min-w-[640px]">
              <div className="flex">
                <div className="w-10" />
                {Array.from({ length: 24 }).map((_, h) => (
                  <div key={h} className="flex-1 text-center text-[9px] text-slate-500 font-mono">{h}</div>
                ))}
              </div>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, d) => (
                <div key={day} className="flex items-center mt-1">
                  <div className="w-10 text-[10px] text-slate-500 font-mono">{day}</div>
                  {heat[d].map((v, h) => (
                    <motion.div
                      key={h}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: (d * 24 + h) * 0.003 }}
                      whileHover={{ scale: 1.4, zIndex: 10 }}
                      className={`flex-1 aspect-square mx-0.5 rounded-sm ${heatColor(v)} cursor-pointer relative group`}
                    >
                      <span className="absolute inset-0 flex items-center justify-center text-[8px] text-white/0 group-hover:text-white/80 font-bold transition-colors">{v}</span>
                    </motion.div>
                  ))}
                </div>
              ))}
              <div className="flex items-center gap-2 mt-4 text-[10px] text-slate-500">
                <span>Low</span>
                <div className="flex gap-0.5">
                  <span className="w-4 h-3 rounded-sm bg-slate-700/40" />
                  <span className="w-4 h-3 rounded-sm bg-blue-500/50" />
                  <span className="w-4 h-3 rounded-sm bg-amber-500/60" />
                  <span className="w-4 h-3 rounded-sm bg-orange-500/70" />
                  <span className="w-4 h-3 rounded-sm bg-red-500/80" />
                </div>
                <span>High</span>
              </div>
            </div>
          )}
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><TrendingUp className="w-4 h-4 text-soc-accent" /> Risk Trend (12 months)</CardTitle>
          </CardHeader>
          <CardBody>
            {loading ? <Skeleton className="h-[240px] w-full" /> : (
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={riskTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E2A40" />
                  <XAxis dataKey="month" stroke="#64748B" fontSize={10} />
                  <YAxis stroke="#64748B" fontSize={10} />
                  <Tooltip />
                  <Line type="monotone" dataKey="risk" stroke="#06B6D4" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Calendar className="w-4 h-4 text-soc-accent" /> Daily Attack Statistics</CardTitle>
          </CardHeader>
          <CardBody>
            {loading ? <Skeleton className="h-[240px] w-full" /> : (
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={dailyStats}>
                  <defs>
                    <linearGradient id="atk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EF4444" stopOpacity={0.5} />
                      <stop offset="100%" stopColor="#EF4444" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="blk" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22C55E" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1E2A40" />
                  <XAxis dataKey="day" stroke="#64748B" fontSize={10} />
                  <YAxis stroke="#64748B" fontSize={10} />
                  <Tooltip />
                  <Area type="monotone" dataKey="attacks" stroke="#EF4444" strokeWidth={2} fill="url(#atk)" />
                  <Area type="monotone" dataKey="blocked" stroke="#22C55E" strokeWidth={2} fill="url(#blk)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardBody>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        {/* Top risky users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Users2 className="w-4 h-4 text-soc-accent" /> Top Risky Users</CardTitle>
          </CardHeader>
          <CardBody className="pt-0">
            {loading ? <div className="space-y-2 mt-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div> : (
              <div className="mt-3 space-y-2">
                {topRisky.map((u, i) => {
                  const c = u.riskScore >= 85 ? riskColor.critical : u.riskScore >= 65 ? riskColor.high : riskColor.medium;
                  return (
                    <motion.div
                      key={u.id}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="flex items-center gap-3 glass-soft rounded-xl p-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-soc-primary to-soc-accent flex items-center justify-center text-xs font-bold text-white">{u.name[0]}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{u.name}</p>
                        <p className="text-xs text-slate-500">{u.email}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${c.text}`}>{u.riskScore}</p>
                        <p className="text-[10px] text-slate-500">{u.country}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Country map placeholder + distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><MapPin className="w-4 h-4 text-soc-accent" /> Geographic Risk Distribution</CardTitle>
          </CardHeader>
          <CardBody>
            {loading ? <Skeleton className="h-[240px] w-full" /> : (
              <div className="space-y-3">
                {topCountries.map(([country, count], i) => {
                  const max = topCountries[0][1];
                  const pct = (count / max) * 100;
                  return (
                    <div key={country}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-300">{country}</span>
                        <span className="text-slate-500 font-mono">{formatNumber(count)}</span>
                      </div>
                      <div className="h-2.5 rounded-full bg-soc-border overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ delay: i * 0.08, duration: 0.8 }}
                          className="h-full rounded-full"
                          style={{ background: pct > 70 ? '#EF4444' : pct > 40 ? '#F59E0B' : '#06B6D4' }}
                        />
                      </div>
                    </div>
                  );
                })}
                <div className="mt-4 rounded-xl border border-soc-border bg-soc-card2 p-4 text-center">
                  <Activity className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">Interactive geo-map rendering available in the full geographic intelligence module</p>
                </div>
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
