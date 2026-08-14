import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, ExternalLink, Database } from 'lucide-react';
import { PageHeader } from '@/layouts/AdminLayout';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { fraudService } from '@/services/api';
import { riskColor, timeAgo } from '@/utils/cn';
import type { ThreatIntel } from '@/types';

export default function ThreatIntelligence() {
  const [intel, setIntel] = useState<ThreatIntel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setIntel(await fraudService.getThreatIntel());
      setLoading(false);
    })();
  }, []);

  return (
    <div>
      <PageHeader title="Threat Intelligence" subtitle="Federated threat feeds and indicators of compromise from global sources" />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {[
          { label: 'Active Feeds', value: 6, color: 'text-soc-accent' },
          { label: 'New IOCs (24h)', value: 142, color: 'text-amber-400' },
          { label: 'Critical Alerts', value: intel.filter((i) => i.severity === 'critical').length, color: 'text-red-400' },
          { label: 'Sources Online', value: '100%', color: 'text-emerald-400' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card className="p-5">
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-400 mt-1">{s.label}</p>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Database className="w-4 h-4 text-soc-accent" /> Indicators of Compromise</CardTitle>
          <Badge variant="neutral">{intel.length} entries</Badge>
        </CardHeader>
        <CardBody className="pt-0 overflow-x-auto">
          {loading ? (
            <div className="space-y-2 mt-3">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : (
            <table className="w-full text-sm mt-3 min-w-[800px]">
              <thead>
                <tr className="text-left text-xs text-slate-500 border-b border-soc-border">
                  <th className="py-2 pr-3 font-medium">Source</th>
                  <th className="py-2 pr-3 font-medium">Type</th>
                  <th className="py-2 pr-3 font-medium">Severity</th>
                  <th className="py-2 pr-3 font-medium">Description</th>
                  <th className="py-2 pr-3 font-medium hidden md:table-cell">IOC</th>
                  <th className="py-2 pr-3 font-medium hidden lg:table-cell">Detected</th>
                </tr>
              </thead>
              <tbody>
                {intel.map((t, i) => {
                  const c = riskColor[t.severity];
                  return (
                    <motion.tr key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }} className="border-b border-soc-border/60 hover:bg-white/5">
                      <td className="py-3 pr-3"><span className="flex items-center gap-1.5 text-slate-200"><Globe className="w-3.5 h-3.5 text-slate-500" />{t.source}</span></td>
                      <td className="py-3 pr-3 text-slate-300">{t.type}</td>
                      <td className="py-3 pr-3"><Badge variant={t.severity}>{t.severity}</Badge></td>
                      <td className="py-3 pr-3 text-slate-400 text-xs max-w-[260px] truncate">{t.description}</td>
                      <td className="py-3 pr-3 hidden md:table-cell font-mono text-xs text-soc-accent">{t.ioc}</td>
                      <td className="py-3 pr-3 hidden lg:table-cell text-slate-500 text-xs">{timeAgo(t.timestamp)}</td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {['Mandiant', 'CrowdStrike', 'Recorded Future'].map((src, i) => (
          <motion.div key={src} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}>
            <Card className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-soc-primary/15 flex items-center justify-center"><Database className="w-5 h-5 text-soc-primary" /></div>
                <div><p className="text-sm font-semibold text-white">{src}</p><p className="text-xs text-emerald-400">Synced</p></div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-500" />
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
