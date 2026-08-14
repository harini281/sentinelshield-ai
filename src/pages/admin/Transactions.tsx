import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Download, X } from 'lucide-react';
import { PageHeader } from '@/layouts/AdminLayout';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { fraudService } from '@/services/api';
import { riskColor, statusColor, formatCurrency } from '@/utils/cn';
import type { Transaction, RiskLevel, TxStatus } from '@/types';

export default function Transactions() {
  const [tx, setTx] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [risk, setRisk] = useState<'all' | RiskLevel>('all');
  const [status, setStatus] = useState<'all' | TxStatus>('all');
  const [country, setCountry] = useState('all');
  const [minAmount, setMinAmount] = useState(0);

  useEffect(() => {
    (async () => {
      setTx(await fraudService.getTransactions());
      setLoading(false);
    })();
  }, []);

  const countries = useMemo(() => Array.from(new Set(tx.map((t) => t.country))).sort(), [tx]);

  const filtered = useMemo(() => {
    return tx.filter((t) => {
      if (query && !t.id.toLowerCase().includes(query.toLowerCase()) && !t.user.toLowerCase().includes(query.toLowerCase())) return false;
      if (risk !== 'all' && t.riskLevel !== risk) return false;
      if (status !== 'all' && t.status !== status) return false;
      if (country !== 'all' && t.country !== country) return false;
      if (t.amount < minAmount) return false;
      return true;
    });
  }, [tx, query, risk, status, country, minAmount]);

  const filtersActive = risk !== 'all' || status !== 'all' || country !== 'all' || minAmount > 0 || query !== '';

  function clearFilters() {
    setQuery('');
    setRisk('all');
    setStatus('all');
    setCountry('all');
    setMinAmount(0);
  }

  return (
    <div>
      <PageHeader
        title="Transactions"
        subtitle="Search and filter all monitored transactions across the network"
        action={<Button variant="outline" size="sm"><Download className="w-4 h-4" /> Export</Button>}
      />

      <Card>
        <CardBody>
          {/* Filters */}
          <div className="flex flex-col lg:flex-row gap-3 mb-4">
            <div className="flex items-center gap-2 bg-soc-card2 border border-soc-border rounded-xl px-3 py-2 flex-1">
              <Search className="w-4 h-4 text-slate-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by Transaction ID or user…"
                className="bg-transparent text-sm text-white placeholder-slate-500 outline-none w-full"
              />
            </div>

            <select value={risk} onChange={(e) => setRisk(e.target.value as 'all' | RiskLevel)} className="bg-soc-card2 border border-soc-border rounded-xl px-3 py-2 text-sm text-slate-200 outline-none">
              <option value="all">All Risk Levels</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>

            <select value={status} onChange={(e) => setStatus(e.target.value as 'all' | TxStatus)} className="bg-soc-card2 border border-soc-border rounded-xl px-3 py-2 text-sm text-slate-200 outline-none">
              <option value="all">All Statuses</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="review">Review</option>
              <option value="blocked">Blocked</option>
            </select>

            <select value={country} onChange={(e) => setCountry(e.target.value)} className="bg-soc-card2 border border-soc-border rounded-xl px-3 py-2 text-sm text-slate-200 outline-none">
              <option value="all">All Countries</option>
              {countries.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>

            <div className="flex items-center gap-2 bg-soc-card2 border border-soc-border rounded-xl px-3 py-2">
              <Filter className="w-4 h-4 text-slate-500" />
              <input type="number" value={minAmount} onChange={(e) => setMinAmount(Number(e.target.value))} placeholder="Min $" className="bg-transparent text-sm text-white placeholder-slate-500 outline-none w-20" />
            </div>

            {filtersActive && (
              <button onClick={clearFilters} className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2">
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="space-y-2">{Array.from({ length: 10 }).map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}</div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <Filter className="w-12 h-12 text-slate-600 mb-3" />
                <p className="text-slate-400 text-sm">No transactions match your filters</p>
                <p className="text-slate-600 text-xs mt-1">Try adjusting or clearing your filters</p>
              </div>
            ) : (
              <table className="w-full text-sm min-w-[900px]">
                <thead>
                  <tr className="text-left text-xs text-slate-500 border-b border-soc-border">
                    <th className="py-3 pr-4 font-medium">Transaction ID</th>
                    <th className="py-3 pr-4 font-medium">User</th>
                    <th className="py-3 pr-4 font-medium">Amount</th>
                    <th className="py-3 pr-4 font-medium hidden md:table-cell">Country</th>
                    <th className="py-3 pr-4 font-medium hidden lg:table-cell">Device</th>
                    <th className="py-3 pr-4 font-medium hidden md:table-cell">VPN</th>
                    <th className="py-3 pr-4 font-medium">Risk Score</th>
                    <th className="py-3 pr-4 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.slice(0, 80).map((t, i) => (
                    <motion.tr
                      key={t.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: Math.min(i * 0.01, 0.3) }}
                      className="border-b border-soc-border/60 hover:bg-white/5 transition-colors"
                    >
                      <td className="py-3 pr-4 font-mono text-xs text-soc-accent">{t.id}</td>
                      <td className="py-3 pr-4 text-slate-200">{t.user}</td>
                      <td className="py-3 pr-4 text-white font-medium">{formatCurrency(t.amount)}</td>
                      <td className="py-3 pr-4 text-slate-400 hidden md:table-cell">{t.country}</td>
                      <td className="py-3 pr-4 text-slate-400 hidden lg:table-cell">{t.device}</td>
                      <td className="py-3 pr-4 hidden md:table-cell">{t.vpn ? <Badge variant="high">Yes</Badge> : <Badge variant="low">No</Badge>}</td>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${riskColor[t.riskLevel].text}`}>{t.riskScore}</span>
                          <div className="w-10 h-1.5 rounded-full bg-soc-border overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${t.riskScore}%`, background: riskColor[t.riskLevel].hex }} />
                          </div>
                        </div>
                      </td>
                      <td className="py-3 pr-4">
                        <span className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${statusColor[t.status]}`}>{t.status}</span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {!loading && filtered.length > 80 && (
            <p className="text-xs text-slate-500 text-center mt-4">Showing 80 of {filtered.length} transactions</p>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
