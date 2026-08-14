import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Radar, Crosshair } from 'lucide-react';
import { PageHeader } from '@/layouts/AdminLayout';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { WorldThreatMap } from '@/components/WorldThreatMap';
import { fraudService } from '@/services/api';
import { riskColor, statusColor, formatCurrency } from '@/utils/cn';
import type { Transaction } from '@/types';

export default function ThreatDetection() {
  const [tx, setTx] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const t = await fraudService.getTransactions();
      setTx(t);
      setLoading(false);
    })();
  }, []);

  const threats = tx.filter((t) => t.riskScore >= 65).sort((a, b) => b.riskScore - a.riskScore).slice(0, 15);

  return (
    <div>
      <PageHeader title="Threat Detection" subtitle="Live threat intelligence and active monitoring across all channels" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Radar className="w-4 h-4 text-soc-accent" /> Active Threats</CardTitle></CardHeader>
          <CardBody>
            <p className="text-4xl font-bold text-red-400">{threats.length}</p>
            <p className="text-xs text-slate-400 mt-1">requiring immediate attention</p>
          </CardBody>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Crosshair className="w-4 h-4 text-soc-accent" /> Auto-Blocked</CardTitle></CardHeader>
          <CardBody>
            <p className="text-4xl font-bold text-amber-400">{tx.filter((t) => t.status === 'blocked').length}</p>
            <p className="text-xs text-slate-400 mt-1">transactions this session</p>
          </CardBody>
        </Card>
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-soc-accent" /> Detection Rate</CardTitle></CardHeader>
          <CardBody>
            <p className="text-4xl font-bold text-emerald-400">99.2%</p>
            <p className="text-xs text-slate-400 mt-1">threats caught in real time</p>
          </CardBody>
        </Card>
      </div>

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Live Threat Map</CardTitle>
          <Badge variant="critical">LIVE</Badge>
        </CardHeader>
        <CardBody className="pt-0">
          {loading ? <Skeleton className="h-[340px] w-full" /> : <WorldThreatMap />}
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-soc-accent" /> Active Threat Queue</CardTitle>
          <Badge variant="high">{threats.length}</Badge>
        </CardHeader>
        <CardBody className="pt-0 overflow-x-auto">
          {loading ? (
            <div className="space-y-2 mt-3">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
          ) : (
            <table className="w-full text-sm mt-3 min-w-[800px]">
              <thead>
                <tr className="text-left text-xs text-slate-500 border-b border-soc-border">
                  <th className="py-2 pr-3 font-medium">Transaction ID</th>
                  <th className="py-2 pr-3 font-medium">User</th>
                  <th className="py-2 pr-3 font-medium">Amount</th>
                  <th className="py-2 pr-3 font-medium hidden md:table-cell">Country</th>
                  <th className="py-2 pr-3 font-medium hidden md:table-cell">VPN</th>
                  <th className="py-2 pr-3 font-medium">Risk</th>
                  <th className="py-2 pr-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {threats.map((t, i) => (
                  <motion.tr key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="border-b border-soc-border/60 hover:bg-white/5">
                    <td className="py-2.5 pr-3 font-mono text-xs text-soc-accent">{t.id}</td>
                    <td className="py-2.5 pr-3 text-slate-200">{t.user}</td>
                    <td className="py-2.5 pr-3 text-white font-medium">{formatCurrency(t.amount)}</td>
                    <td className="py-2.5 pr-3 text-slate-400 hidden md:table-cell">{t.country}</td>
                    <td className="py-2.5 pr-3 hidden md:table-cell">{t.vpn ? <Badge variant="high">Yes</Badge> : <Badge variant="low">No</Badge>}</td>
                    <td className="py-2.5 pr-3"><span className={`font-bold ${riskColor[t.riskLevel].text}`}>{t.riskScore}</span></td>
                    <td className="py-2.5 pr-3"><span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${statusColor[t.status]}`}>{t.status}</span></td>
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
