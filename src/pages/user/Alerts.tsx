import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, MapPin, Clock, ShieldAlert, Cpu, CheckCircle2 } from 'lucide-react';
import { UserPageHeader } from '@/layouts/UserLayout';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { fraudService } from '@/services/api';
import { riskColor, timeAgo } from '@/utils/cn';
import type { SecurityAlert } from '@/types';

export default function UserAlerts() {
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');

  useEffect(() => {
    (async () => { setAlerts(await fraudService.getUserAlerts()); setLoading(false); })();
  }, []);

  const filtered = alerts.filter((a) => filter === 'all' || (filter === 'resolved' ? a.resolved : !a.resolved));

  return (
    <div>
      <UserPageHeader title="Security Alerts" subtitle="Suspicious activity detected on your account" />

      <div className="flex gap-2 mb-4">
        {(['all', 'open', 'resolved'] as const).map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-xl text-xs font-medium capitalize transition-colors ${filter === f ? 'bg-soc-primary text-white' : 'glass-soft text-slate-400 hover:text-white'}`}>
            {f === 'all' ? 'All Alerts' : f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-40 w-full" />)}</div>
      ) : filtered.length === 0 ? (
        <Card><CardBody className="flex flex-col items-center justify-center py-16"><CheckCircle2 className="w-14 h-14 text-emerald-500/60 mb-3" /><p className="text-slate-300 text-sm font-medium">No alerts in this view</p><p className="text-slate-600 text-xs mt-1">Your account activity looks normal</p></CardBody></Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((a, i) => {
            const c = riskColor[a.riskLevel];
            return (
              <motion.div key={a.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.05, 0.4) }} whileHover={{ y: -2 }}>
                <Card glow>
                  <CardBody>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-xl ${c.bg} flex items-center justify-center`}><ShieldAlert className={`w-5 h-5 ${c.text}`} /></div>
                        <div><p className="text-sm font-semibold text-white">{a.title}</p><p className="text-xs text-slate-500 font-mono">{a.id}</p></div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5"><Badge variant={a.riskLevel}>Risk {a.riskScore}</Badge>{a.resolved ? <span className="flex items-center gap-1 text-xs text-emerald-400"><CheckCircle2 className="w-3.5 h-3.5" /> Resolved</span> : <span className="flex items-center gap-1 text-xs text-amber-400"><Clock className="w-3.5 h-3.5" /> Open</span>}</div>
                    </div>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-slate-400"><MapPin className="w-3.5 h-3.5 text-slate-500" /> {a.location}</div>
                      <div className="flex items-center gap-2 text-slate-400"><Clock className="w-3.5 h-3.5 text-slate-500" /> {timeAgo(a.timestamp)}</div>
                    </div>
                    <div className="mt-3 glass-soft rounded-xl p-3">
                      <div className="flex items-center gap-2 text-xs font-semibold text-soc-primary"><Cpu className="w-3.5 h-3.5" /> AI Explanation</div>
                      <p className="text-sm text-slate-300 mt-1.5">{a.aiExplanation}</p>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="text-xs"><span className="text-slate-500">Recommended: </span><span className="text-soc-accent">{a.recommendedAction}</span></div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      {!a.resolved && <Button size="sm" className="flex-1 gradient-btn">Acknowledge</Button>}
                      <Button size="sm" variant="outline" className="flex-1">Report False Positive</Button>
                    </div>
                  </CardBody>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
