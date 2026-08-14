import { motion } from 'framer-motion';
import { FileText, Download, TrendingUp, ShieldCheck, Ban, BrainCircuit, Calendar } from 'lucide-react';
import { PageHeader } from '@/layouts/AdminLayout';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

const reports = [
  { title: 'Monthly Fraud Summary', period: 'July 2026', stats: '412 blocked · 1.2M saved', icon: ShieldCheck, color: 'text-emerald-400' },
  { title: 'Threat Landscape Report', period: 'Q3 2026', stats: '18 APTs tracked', icon: TrendingUp, color: 'text-soc-accent' },
  { title: 'AI Decision Audit', period: 'Jul 15–31', stats: '12,847 auto-decisions', icon: BrainCircuit, color: 'text-soc-primary' },
  { title: 'Blocked Transactions Log', period: 'This week', stats: '207 entries', icon: Ban, color: 'text-red-400' },
];

export default function Reports() {
  return (
    <div>
      <PageHeader
        title="Reports"
        subtitle="Generate and download compliance and operational reports"
        action={<Button variant="outline" size="sm"><Calendar className="w-4 h-4" /> Schedule Report</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((r, i) => (
          <motion.div key={r.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} whileHover={{ y: -3 }}>
            <Card glow className="h-full">
              <CardBody>
                <div className="flex items-start justify-between">
                  <div className={`w-11 h-11 rounded-xl bg-soc-card2 flex items-center justify-center`}>
                    <r.icon className={`w-5 h-5 ${r.color}`} />
                  </div>
                  <Badge variant="neutral">PDF</Badge>
                </div>
                <h3 className="text-base font-semibold text-white mt-4">{r.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{r.period}</p>
                <p className="text-sm text-slate-300 mt-3">{r.stats}</p>
                <div className="mt-4 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1"><Download className="w-3.5 h-3.5" /> Download</Button>
                  <Button variant="ghost" size="sm" className="flex-1"><FileText className="w-3.5 h-3.5" /> Preview</Button>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        ))}
      </div>

      <Card className="mt-4">
        <CardHeader><CardTitle>Recent Generated Reports</CardTitle></CardHeader>
        <CardBody className="pt-0">
          <div className="mt-3 space-y-2">
            {['Weekly Risk Analytics · Jul 28', 'Incident Response Summary · Jul 27', 'User Risk Profile Export · Jul 26'].map((r, i) => (
              <motion.div key={r} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }} className="flex items-center justify-between glass-soft rounded-xl p-3">
                <div className="flex items-center gap-3"><FileText className="w-4 h-4 text-slate-500" /><span className="text-sm text-slate-200">{r}</span></div>
                <button className="text-slate-400 hover:text-white"><Download className="w-4 h-4" /></button>
              </motion.div>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
