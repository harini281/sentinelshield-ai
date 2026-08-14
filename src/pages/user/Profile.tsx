import { useState } from 'react';
import { motion } from 'framer-motion';
import { User as UserIcon, Mail, Lock, Fingerprint, ShieldCheck, Camera, Save, KeyRound, CheckCircle2 } from 'lucide-react';
import { UserPageHeader } from '@/layouts/UserLayout';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';

function Toggle({ on, set }: { on: boolean; set: (v: boolean) => void }) {
  return (
    <button onClick={() => set(!on)} className={`w-11 h-6 rounded-full transition-colors relative ${on ? 'bg-soc-primary' : 'bg-soc-border'}`}>
      <motion.span layout transition={{ type: 'spring', stiffness: 500, damping: 30 }} className={`absolute top-0.5 w-5 h-5 rounded-full bg-white ${on ? 'left-5' : 'left-0.5'}`} />
    </button>
  );
}

export default function UserProfile() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [mfa, setMfa] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [saved, setSaved] = useState(false);

  function save() { setSaved(true); setTimeout(() => setSaved(false), 2000); }

  return (
    <div>
      <UserPageHeader title="Profile" subtitle="Manage your personal information and security settings" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Profile card */}
        <Card className="lg:col-span-1">
          <CardBody className="text-center">
            <div className="relative inline-block">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-soc-primary to-soc-secondary flex items-center justify-center text-3xl font-bold text-white mx-auto">{name[0] ?? 'U'}</div>
              <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-soc-card2 border border-soc-border flex items-center justify-center hover:border-soc-primary/50"><Camera className="w-4 h-4 text-slate-400" /></button>
            </div>
            <h2 className="text-lg font-bold text-white mt-4">{name}</h2>
            <p className="text-xs text-slate-500">{email}</p>
            <div className="mt-3 flex justify-center"><Badge variant="low"><ShieldCheck className="w-3 h-3" /> Verified</Badge></div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-center">
              <div className="glass-soft rounded-xl p-3"><p className="text-xl font-bold text-white">82</p><p className="text-[10px] text-slate-500">Security Score</p></div>
              <div className="glass-soft rounded-xl p-3"><p className="text-xl font-bold text-white">3</p><p className="text-[10px] text-slate-500">Devices</p></div>
            </div>
          </CardBody>
        </Card>

        {/* Personal info + security */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><UserIcon className="w-4 h-4 text-soc-accent" /> Personal Information</CardTitle></CardHeader>
            <CardBody className="space-y-4">
              <div><label className="text-xs text-slate-400">Full Name</label><div className="mt-1.5 relative"><UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /><input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-xl bg-soc-card2 border border-soc-border pl-10 pr-4 py-2.5 text-sm text-white outline-none focus:border-soc-primary" /></div></div>
              <div><label className="text-xs text-slate-400">Email</label><div className="mt-1.5 relative"><Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" /><input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-xl bg-soc-card2 border border-soc-border pl-10 pr-4 py-2.5 text-sm text-white outline-none focus:border-soc-primary" /></div></div>
              <div className="flex justify-end"><Button onClick={save}>{saved ? <><CheckCircle2 className="w-4 h-4" /> Saved</> : <><Save className="w-4 h-4" /> Save Changes</>}</Button></div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Lock className="w-4 h-4 text-soc-accent" /> Security Settings</CardTitle></CardHeader>
            <CardBody className="space-y-4">
              <div className="flex items-center justify-between"><div><p className="text-sm text-white font-medium">Two-Factor Authentication</p><p className="text-xs text-slate-500">Require a code at sign-in</p></div><Toggle on={mfa} set={setMfa} /></div>
              <div className="flex items-center justify-between"><div><p className="text-sm text-white font-medium">Biometric Login</p><p className="text-xs text-slate-500">Use Face ID / fingerprint</p></div><Toggle on={biometric} set={setBiometric} /></div>
              <div className="pt-3 border-t border-soc-border">
                <p className="text-sm font-medium text-white mb-2">Change Password</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="password" placeholder="New password" className="rounded-xl bg-soc-card2 border border-soc-border px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-soc-primary" />
                  <input type="password" placeholder="Confirm password" className="rounded-xl bg-soc-card2 border border-soc-border px-3 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-soc-primary" />
                </div>
                <div className="flex justify-end mt-3"><Button variant="outline" size="sm"><KeyRound className="w-3.5 h-3.5" /> Update Password</Button></div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Fingerprint className="w-4 h-4 text-soc-primary" /> Authentication Methods</CardTitle></CardHeader>
            <CardBody className="space-y-2">
              {['Authenticator App', 'SMS Code', 'Email Backup'].map((m, i) => (
                <motion.div key={m} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }} className="flex items-center justify-between glass-soft rounded-xl p-3">
                  <span className="text-sm text-slate-200">{m}</span>
                  {i < 2 ? <Badge variant="low">Active</Badge> : <Badge variant="neutral">Backup</Badge>}
                </motion.div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
