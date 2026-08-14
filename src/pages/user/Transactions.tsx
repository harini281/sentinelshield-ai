import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Download, X, MapPin, Smartphone, Clock, Shield } from 'lucide-react';
import { UserPageHeader } from '@/layouts/UserLayout';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { fraudService } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { riskColor, statusColor, formatCurrency, timeAgo } from '@/utils/cn';
import type { Transaction, RiskLevel, TxStatus } from '@/types';

export default function UserTransactions() {
  const { user } = useAuth();
  const [tx, setTx] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [risk, setRisk] = useState<'all' | RiskLevel>('all');
  const [status, setStatus] = useState<'all' | TxStatus>('all');
  const [selected, setSelected] = useState<Transaction | null>(null);

  useEffect(() => {
    (async () => {
      if (!user) return;
      setTx(await fraudService.getUserTransactions({ id: 'me', name: user.name, email: user.email } as never));
      setLoading(false);
    })();
  }, [user]);

  const filtered = useMemo(() => tx.filter((t) => {
    if (query && !t.id.toLowerCase().includes(query.toLowerCase()) && !(t.merchant ?? '').toLowerCase().includes(query.toLowerCase())) return false;
    if (risk !== 'all' && t.riskLevel !== risk) return false;
    if (status !== 'all' && t.status !== status) return false;
    return true;
  }), [tx, query, risk, status]);

  return (
    <div>
      <UserPageHeader title="My Transactions" subtitle="Search and review your transaction history" action={<Button variant="outline" size="sm"><Download className="w-4 h-4" /> Statement</Button>} />

      <Card>
        <CardBody>
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex items-center gap-2 bg-soc-card2 border border-soc-border rounded-xl px-3 py-2 flex-1">
              <Search className="w-4 h-4 text-slate-500" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by merchant or ID…" className="bg-transparent text-sm text-white placeholder-slate-500 outline-none w-full" />
            </div>
            <select value={risk} onChange={(e) => setRisk(e.target.value as 'all' | RiskLevel)} className="bg-soc-card2 border border-soc-border rounded-xl px-3 py-2 text-sm text-slate-200 outline-none">
              <option value="all">All Risk</option><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option>
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value as 'all' | TxStatus)} className="bg-soc-card2 border border-soc-border rounded-xl px-3 py-2 text-sm text-slate-200 outline-none">
              <option value="all">All Status</option><option value="approved">Approved</option><option value="pending">Pending</option><option value="review">Review</option><option value="blocked">Blocked</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            {loading ? <div className="space-y-2">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div> : (
              <table className="w-full text-sm min-w-[700px]">
                <thead><tr className="text-left text-xs text-slate-500 border-b border-soc-border">
                  <th className="py-3 pr-4 font-medium">Merchant</th><th className="py-3 pr-4 font-medium">Amount</th>
                  <th className="py-3 pr-4 font-medium hidden md:table-cell">Country</th><th className="py-3 pr-4 font-medium">Risk</th><th className="py-3 pr-4 font-medium">Status</th><th className="py-3 pr-4 font-medium">Date</th>
                </tr></thead>
                <tbody>
                  {filtered.slice(0, 50).map((t, i) => (
                    <motion.tr key={t.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: Math.min(i * 0.02, 0.3) }} onClick={() => setSelected(t)} className="border-b border-soc-border/60 hover:bg-white/5 cursor-pointer">
                      <td className="py-3 pr-4"><p className="text-white font-medium">{t.merchant}</p><p className="text-xs text-slate-500 font-mono">{t.id}</p></td>
                      <td className="py-3 pr-4 text-white font-medium">{formatCurrency(t.amount)}</td>
                      <td className="py-3 pr-4 text-slate-400 hidden md:table-cell">{t.country}</td>
                      <td className="py-3 pr-4"><span className={`font-bold ${riskColor[t.riskLevel].text}`}>{t.riskScore}</span></td>
                      <td className="py-3 pr-4"><span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${statusColor[t.status]}`}>{t.status}</span></td>
                      <td className="py-3 pr-4 text-slate-500 text-xs">{timeAgo(t.timestamp)}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardBody>
      </Card>

      <AnimatePresence>
        {selected && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelected(null)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[440px] max-w-[calc(100vw-2rem)] z-50">
              <Card className="overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b border-soc-border">
                  <div><p className="text-sm font-semibold text-white">Transaction Details</p><p className="text-xs text-slate-500 font-mono">{selected.id}</p></div>
                  <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white"><X className="w-5 h-5" /></button>
                </div>
                <CardBody className="space-y-3">
                  <div className="text-center py-2"><p className="text-3xl font-bold text-white">{formatCurrency(selected.amount)}</p><p className="text-sm text-slate-400 mt-1">{selected.merchant}</p></div>
                  <div className="grid grid-cols-2 gap-3">
                    {[{ icon: MapPin, label: 'Country', value: selected.country }, { icon: Smartphone, label: 'Device', value: selected.device }, { icon: Clock, label: 'Time', value: new Date(selected.timestamp).toLocaleString() }, { icon: Shield, label: 'Risk', value: `${selected.riskScore} (${selected.riskLevel})` }].map((r) => (
                      <div key={r.label} className="glass-soft rounded-xl p-3"><div className="flex items-center gap-1.5 text-xs text-slate-500"><r.icon className="w-3.5 h-3.5" /> {r.label}</div><p className="text-sm text-white mt-1">{r.value}</p></div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between glass-soft rounded-xl p-3"><span className="text-sm text-slate-400">Status</span><span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${statusColor[selected.status]}`}>{selected.status}</span></div>
                  {selected.vpn && <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-xl p-3"><Filter className="w-4 h-4" /> VPN was detected during this transaction</div>}
                </CardBody>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
