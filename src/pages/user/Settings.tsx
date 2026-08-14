import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Shield, Globe, Lock, Palette, Save, Moon, Languages, Eye } from 'lucide-react';
import { UserPageHeader } from '@/layouts/UserLayout';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

function Toggle({ on, set }: { on: boolean; set: (v: boolean) => void }) {
  return (
    <button onClick={() => set(!on)} className={`w-11 h-6 rounded-full transition-colors relative ${on ? 'bg-soc-primary' : 'bg-soc-border'}`}>
      <motion.span layout transition={{ type: 'spring', stiffness: 500, damping: 30 }} className={`absolute top-0.5 w-5 h-5 rounded-full bg-white ${on ? 'left-5' : 'left-0.5'}`} />
    </button>
  );
}

export default function UserSettings() {
  const [notif, setNotif] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [pushAlerts, setPushAlerts] = useState(false);
  const [privacy, setPrivacy] = useState(true);
  const [analytics, setAnalytics] = useState(false);

  return (
    <div>
      <UserPageHeader title="Settings" subtitle="Customize your preferences and privacy options" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Bell className="w-4 h-4 text-soc-accent" /> Notifications</CardTitle></CardHeader>
          <CardBody className="space-y-4">
            <div className="flex items-center justify-between"><div><p className="text-sm text-white font-medium">Security alerts</p><p className="text-xs text-slate-500">Get notified of suspicious activity</p></div><Toggle on={notif} set={setNotif} /></div>
            <div className="flex items-center justify-between"><div><p className="text-sm text-white font-medium">Email alerts</p><p className="text-xs text-slate-500">Receive alerts by email</p></div><Toggle on={emailAlerts} set={setEmailAlerts} /></div>
            <div className="flex items-center justify-between"><div><p className="text-sm text-white font-medium">Push notifications</p><p className="text-xs text-slate-500">Browser push for critical events</p></div><Toggle on={pushAlerts} set={setPushAlerts} /></div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="w-4 h-4 text-soc-accent" /> Security</CardTitle></CardHeader>
          <CardBody className="space-y-4">
            <div className="flex items-center justify-between"><div><p className="text-sm text-white font-medium">Login alerts</p><p className="text-xs text-slate-500">Alert on every new sign-in</p></div><Toggle on={privacy} set={setPrivacy} /></div>
            <div className="flex items-center justify-between"><div><p className="text-sm text-white font-medium">Anonymous analytics</p><p className="text-xs text-slate-500">Share usage data to improve security</p></div><Toggle on={analytics} set={setAnalytics} /></div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Palette className="w-4 h-4 text-soc-accent" /> Appearance</CardTitle></CardHeader>
          <CardBody className="space-y-3">
            <div className="flex items-center justify-between glass-soft rounded-xl p-3"><div className="flex items-center gap-2"><Moon className="w-4 h-4 text-slate-400" /><span className="text-sm text-slate-200">Dark theme</span></div><Badge variant="low">Active</Badge></div>
            <div className="flex items-center justify-between glass-soft rounded-xl p-3 opacity-50"><div className="flex items-center gap-2"><Eye className="w-4 h-4 text-slate-400" /><span className="text-sm text-slate-200">Light theme</span></div></div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Languages className="w-4 h-4 text-soc-accent" /> Language & Region</CardTitle></CardHeader>
          <CardBody className="space-y-3">
            <div><label className="text-xs text-slate-400">Language</label><select className="w-full mt-1 bg-soc-card2 border border-soc-border rounded-xl px-3 py-2.5 text-sm text-slate-200 outline-none"><option>English (US)</option><option>English (UK)</option><option>Español</option><option>Français</option><option>Deutsch</option><option>日本語</option></select></div>
            <div><label className="text-xs text-slate-400">Time Zone</label><select className="w-full mt-1 bg-soc-card2 border border-soc-border rounded-xl px-3 py-2.5 text-sm text-slate-200 outline-none"><option>UTC-05:00 Eastern</option><option>UTC+00:00 GMT</option><option>UTC+01:00 CET</option><option>UTC+09:00 JST</option></select></div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Lock className="w-4 h-4 text-soc-accent" /> Privacy</CardTitle></CardHeader>
          <CardBody className="space-y-3">
            <div className="flex items-center justify-between"><div><p className="text-sm text-white font-medium">Data retention</p><p className="text-xs text-slate-500">Keep activity logs for 90 days</p></div><Toggle on={true} set={() => {}} /></div>
            <div className="flex items-center justify-between"><div><p className="text-sm text-white font-medium">Session timeout</p><p className="text-xs text-slate-500">Auto sign-out after 30 min idle</p></div><Toggle on={true} set={() => {}} /></div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Globe className="w-4 h-4 text-soc-accent" /> Connected Services</CardTitle></CardHeader>
          <CardBody className="space-y-2">
            {['Mobile Banking App', 'Email Notifications', 'SMS Gateway'].map((s, i) => (
              <motion.div key={s} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }} className="flex items-center justify-between glass-soft rounded-xl p-3">
                <span className="text-sm text-slate-200">{s}</span><span className="text-xs text-emerald-400">Connected</span>
              </motion.div>
            ))}
          </CardBody>
        </Card>
      </div>

      <div className="flex justify-end mt-6"><Button><Save className="w-4 h-4" /> Save Settings</Button></div>
    </div>
  );
}
