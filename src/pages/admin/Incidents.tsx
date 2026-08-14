import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Siren, CheckCircle2, AlertTriangle, Clock, ShieldAlert } from 'lucide-react';
import { PageHeader } from '@/layouts/AdminLayout';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { fraudService } from '@/services/api';
import { riskColor } from '@/utils/cn';
import type { Incident } from '@/types';

const sevIcon: Record<string, typeof Siren> = {
  critical: ShieldAlert,
  high: Siren,
  medium: AlertTriangle,
  low: Clock,
};

export default function Incidents() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');

  useEffect(() => {
    (async () => {
      setIncidents(await fraudService.getIncidents());
      setLoading(false);
    })();
  }, []);

  const filtered = incidents.filter((i) => filter === 'all' || (filter === 'resolved' ? i.resolved : !i.resolved));

  return (
    <div>
      <PageHeader title="Incidents" subtitle="Security incident response tracking and resolution status" />

      <div className="flex gap-2 mb-4">
        {(['all', 'open', 'resolved'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-medium capitalize transition-colors ${filter === f ? 'bg-soc-primary text-white' : 'glass-soft text-slate-400 hover:text-white'}`}
          >
            {f === 'all' ? 'All Incidents' : f === 'open' ? 'Open' : 'Resolved'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-44 w-full" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <CheckCircle2 className="w-14 h-14 text-emerald-500/60 mb-3" />
          <p className="text-slate-300 text-sm font-medium">No incidents in this view</p>
          <p className="text-slate-600 text-xs mt-1">All clear — the SOC is operating normally</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((inc, i) => {
            const c = riskColor[inc.severity];
            const Icon = sevIcon[inc.severity] ?? Siren;
            return (
              <motion.div
                key={inc.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.05, 0.4) }}
                whileHover={{ y: -3 }}
              >
                <Card glow className="h-full">
                  <CardBody>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${c.bg} flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${c.text}`} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">{inc.type}</p>
                          <p className="text-xs text-slate-500 font-mono">{inc.id}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5">
                        <Badge variant={inc.severity}>{inc.severity}</Badge>
                        {inc.resolved ? (
                          <span className="flex items-center gap-1 text-xs text-emerald-400"><CheckCircle2 className="w-3.5 h-3.5" /> Resolved</span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs text-amber-400"><Clock className="w-3.5 h-3.5" /> Open</span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Affected User</span>
                        <span className="text-slate-200">{inc.affectedUser}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Timestamp</span>
                        <span className="text-slate-400 font-mono text-xs">{new Date(inc.timestamp).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Recommended Response</span>
                        <span className="text-soc-accent text-right max-w-[60%]">{inc.recommendedResponse}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      {!inc.resolved && <button className="flex-1 text-xs font-medium py-2 rounded-lg bg-soc-primary/20 text-soc-accent border border-soc-primary/40 hover:bg-soc-primary/30 transition-colors">Mark Resolved</button>}
                      <button className="flex-1 text-xs font-medium py-2 rounded-lg glass-soft text-slate-300 hover:border-soc-accent/40 transition-colors">View Details</button>
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
