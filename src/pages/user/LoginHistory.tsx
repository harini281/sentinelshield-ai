import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { History, MapPin, MonitorSmartphone, CheckCircle2, XCircle, Globe, Clock } from 'lucide-react';
import { UserPageHeader } from '@/layouts/UserLayout';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { fraudService } from '@/services/api';
import { timeAgo } from '@/utils/cn';
import type { LoginRecord } from '@/types';

export default function LoginHistory() {
  const [logs, setLogs] = useState<LoginRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => { setLogs(await fraudService.getLoginHistory()); setLoading(false); })();
  }, []);

  return (
    <div>
      <UserPageHeader title="Login History" subtitle="Recent sign-in activity and locations" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {[
          { label: 'Successful Logins', value: logs.filter((l) => l.success).length, icon: CheckCircle2, color: 'text-emerald-400' },
          { label: 'Failed Attempts', value: logs.filter((l) => !l.success).length, icon: XCircle, color: 'text-red-400' },
          { label: 'Unique Locations', value: new Set(logs.map((l) => l.country)).size, icon: Globe, color: 'text-soc-accent' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card className="p-5"><div className="flex items-center gap-3"><div className="w-10 h-10 rounded-xl bg-soc-card2 flex items-center justify-center"><s.icon className={`w-5 h-5 ${s.color}`} /></div><div><p className="text-2xl font-bold text-white">{s.value}</p><p className="text-xs text-slate-400">{s.label}</p></div></div></Card>
          </motion.div>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2"><History className="w-4 h-4 text-soc-accent" /> Recent Sign-ins</CardTitle></CardHeader>
        <CardBody className="pt-0 overflow-x-auto">
          {loading ? <div className="space-y-2 mt-3">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div> : (
            <table className="w-full text-sm mt-3 min-w-[700px]">
              <thead><tr className="text-left text-xs text-slate-500 border-b border-soc-border">
                <th className="py-3 pr-4 font-medium">Time</th><th className="py-3 pr-4 font-medium">Device</th><th className="py-3 pr-4 font-medium">Location</th><th className="py-3 pr-4 font-medium hidden md:table-cell">IP</th><th className="py-3 pr-4 font-medium">VPN</th><th className="py-3 pr-4 font-medium">Result</th>
              </tr></thead>
              <tbody>
                {logs.slice(0, 30).map((l, i) => (
                  <motion.tr key={l.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: Math.min(i * 0.02, 0.3) }} className="border-b border-soc-border/60 hover:bg-white/5">
                    <td className="py-3 pr-4 text-slate-400 text-xs"><div className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5 text-slate-500" /> {timeAgo(l.timestamp)}</div></td>
                    <td className="py-3 pr-4 text-slate-200"><div className="flex items-center gap-1.5"><MonitorSmartphone className="w-3.5 h-3.5 text-slate-500" /> {l.device}</div></td>
                    <td className="py-3 pr-4 text-slate-300"><div className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-500" /> {l.location}</div></td>
                    <td className="py-3 pr-4 hidden md:table-cell font-mono text-xs text-slate-500">{l.ip}</td>
                    <td className="py-3 pr-4">{l.vpn ? <Badge variant="medium">Yes</Badge> : <Badge variant="neutral">No</Badge>}</td>
                    <td className="py-3 pr-4">{l.success ? <span className="flex items-center gap-1 text-emerald-400 text-xs"><CheckCircle2 className="w-3.5 h-3.5" /> Success</span> : <span className="flex items-center gap-1 text-red-400 text-xs"><XCircle className="w-3.5 h-3.5" /> Failed</span>}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
