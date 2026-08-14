import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Bell, Shield, Globe, Key, Palette, Save } from 'lucide-react';
import { PageHeader } from '@/layouts/AdminLayout';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

function Toggle({ on, set }: { on: boolean; set: (v: boolean) => void }) {
  return (
    <button onClick={() => set(!on)} className={`w-11 h-6 rounded-full transition-colors relative ${on ? 'bg-soc-primary' : 'bg-soc-border'}`}>
      <motion.span layout transition={{ type: 'spring', stiffness: 500, damping: 30 }} className={`absolute top-0.5 w-5 h-5 rounded-full bg-white ${on ? 'left-5' : 'left-0.5'}`} />
    </button>
  );
}

export default function Settings() {
  const [notif, setNotif] = useState(true);
  const [autoBlock, setAutoBlock] = useState(true);
  const [geoFence, setGeoFence] = useState(false);
  const [biometric, setBiometric] = useState(true);
  const [threshold, setThreshold] = useState(75);

  return (
    <div>
      <PageHeader title="Settings" subtitle="Configure detection rules, alerts, and platform preferences" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="w-4 h-4 text-soc-accent" /> Notifications</CardTitle></CardHeader>
          <CardBody className="space-y-4">
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-white font-medium">Real-time alerts</p><p className="text-xs text-slate-500">Push notifications for critical events</p></div>
              <Toggle on={notif} set={setNotif} />
            </div>
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-white font-medium">Auto-block threshold</p><p className="text-xs text-slate-500">Block transactions above this risk score</p></div>
              <Toggle on={autoBlock} set={setAutoBlock} />
            </div>
            <div>
              <label className="text-xs text-slate-400">Risk score threshold: <span className="text-soc-accent font-bold">{threshold}</span></label>
              <input type="range" min="50" max="99" value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} className="w-full mt-2 accent-soc-primary" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="w-4 h-4 text-soc-accent" /> Security</CardTitle></CardHeader>
          <CardBody className="space-y-4">
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-white font-medium">Geo-fencing</p><p className="text-xs text-slate-500">Block transactions from restricted regions</p></div>
              <Toggle on={geoFence} set={setGeoFence} />
            </div>
            <div className="flex items-center justify-between">
              <div><p className="text-sm text-white font-medium">Biometric MFA</p><p className="text-xs text-slate-500">Require biometric step-up for high-risk</p></div>
              <Toggle on={biometric} set={setBiometric} />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Globe className="w-4 h-4 text-soc-accent" /> Region Configuration</CardTitle></CardHeader>
          <CardBody className="space-y-3">
            {['North America', 'Europe', 'Asia Pacific', 'Middle East & Africa'].map((r) => (
              <div key={r} className="flex items-center justify-between glass-soft rounded-xl p-3">
                <span className="text-sm text-slate-200">{r}</span>
                <span className="text-xs text-emerald-400 font-medium">Active</span>
              </div>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Key className="w-4 h-4 text-soc-accent" /> API & Integration</CardTitle></CardHeader>
          <CardBody className="space-y-3">
            <div>
              <label className="text-xs text-slate-400">API Endpoint</label>
              <input readOnly value="https://api.sentinelshield.io/v4" className="w-full mt-1 bg-soc-card2 border border-soc-border rounded-xl px-3 py-2 text-sm text-slate-300 font-mono outline-none" />
            </div>
            <div>
              <label className="text-xs text-slate-400">Access Key</label>
              <input readOnly value="sk-••••••••••••••••93f2" className="w-full mt-1 bg-soc-card2 border border-soc-border rounded-xl px-3 py-2 text-sm text-slate-300 font-mono outline-none" />
            </div>
            <Button variant="outline" size="sm">Rotate Key</Button>
          </CardBody>
        </Card>
      </div>

      <div className="flex justify-end mt-6">
        <Button><Save className="w-4 h-4" /> Save Changes</Button>
      </div>
    </div>
  );
}
