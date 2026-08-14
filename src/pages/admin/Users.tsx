import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, MoreVertical, Ban, Eye, ShieldCheck } from 'lucide-react';
import { PageHeader } from '@/layouts/AdminLayout';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { fraudService } from '@/services/api';
import { riskColor, timeAgo } from '@/utils/cn';
import type { User } from '@/types';

const statusVariant: Record<User['status'], 'low' | 'blocked' | 'review'> = {
  active: 'low',
  frozen: 'blocked',
  review: 'review',
};

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | User['status']>('all');

  useEffect(() => {
    (async () => {
      setUsers(await fraudService.getUsers());
      setLoading(false);
    })();
  }, []);

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const matchesQuery = u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [users, query, statusFilter]);

  return (
    <div>
      <PageHeader title="Users" subtitle="Monitor and manage user risk profiles across the institution" />

      <Card>
        <CardBody>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="flex items-center gap-2 bg-soc-card2 border border-soc-border rounded-xl px-3 py-2 flex-1">
              <Search className="w-4 h-4 text-slate-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search users by name or email…"
                className="bg-transparent text-sm text-white placeholder-slate-500 outline-none w-full"
              />
            </div>
            <div className="flex gap-2">
              {(['all', 'active', 'review', 'frozen'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition-colors ${statusFilter === s ? 'bg-soc-primary text-white' : 'glass-soft text-slate-400 hover:text-white'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="space-y-2">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <ShieldCheck className="w-12 h-12 text-slate-600 mb-3" />
                <p className="text-slate-400 text-sm">No users match your filters</p>
                <p className="text-slate-600 text-xs mt-1">Try adjusting your search or status filter</p>
              </div>
            ) : (
              <table className="w-full text-sm min-w-[800px]">
                <thead>
                  <tr className="text-left text-xs text-slate-500 border-b border-soc-border">
                    <th className="py-3 pr-4 font-medium">User</th>
                    <th className="py-3 pr-4 font-medium">Email</th>
                    <th className="py-3 pr-4 font-medium">Risk Score</th>
                    <th className="py-3 pr-4 font-medium">Status</th>
                    <th className="py-3 pr-4 font-medium hidden md:table-cell">Device</th>
                    <th className="py-3 pr-4 font-medium hidden md:table-cell">Country</th>
                    <th className="py-3 pr-4 font-medium hidden lg:table-cell">Last Login</th>
                    <th className="py-3 pr-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.slice(0, 50).map((u, i) => {
                    const c = u.riskScore >= 85 ? riskColor.critical : u.riskScore >= 65 ? riskColor.high : u.riskScore >= 35 ? riskColor.medium : riskColor.low;
                    return (
                      <motion.tr
                        key={u.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: Math.min(i * 0.02, 0.4) }}
                        className="border-b border-soc-border/60 hover:bg-white/5 transition-colors"
                      >
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-soc-primary to-soc-accent flex items-center justify-center text-xs font-bold text-white">{u.name[0]}</div>
                            <span className="text-white font-medium">{u.name}</span>
                          </div>
                        </td>
                        <td className="py-3 pr-4 text-slate-400 font-mono text-xs">{u.email}</td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-2">
                            <span className={`font-bold ${c.text}`}>{u.riskScore}</span>
                            <div className="w-12 h-1.5 rounded-full bg-soc-border overflow-hidden">
                              <div className="h-full rounded-full" style={{ width: `${u.riskScore}%`, background: c.hex }} />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 pr-4"><Badge variant={statusVariant[u.status]}>{u.status}</Badge></td>
                        <td className="py-3 pr-4 text-slate-400 hidden md:table-cell">{u.device}</td>
                        <td className="py-3 pr-4 text-slate-400 hidden md:table-cell">{u.country}</td>
                        <td className="py-3 pr-4 text-slate-500 text-xs hidden lg:table-cell">{timeAgo(u.lastLogin)}</td>
                        <td className="py-3 pr-4">
                          <div className="flex items-center justify-end gap-1.5">
                            <button className="p-1.5 rounded-lg glass-soft hover:border-soc-accent/40 text-slate-400 hover:text-white transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                            <button className="p-1.5 rounded-lg glass-soft hover:border-red-500/40 text-slate-400 hover:text-red-400 transition-colors"><Ban className="w-3.5 h-3.5" /></button>
                            <button className="p-1.5 rounded-lg glass-soft hover:border-soc-accent/40 text-slate-400 hover:text-white transition-colors"><MoreVertical className="w-3.5 h-3.5" /></button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
          {!loading && filtered.length > 50 && (
            <p className="text-xs text-slate-500 text-center mt-4">Showing 50 of {filtered.length} users</p>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
