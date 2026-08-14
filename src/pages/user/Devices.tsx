import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MonitorSmartphone, Smartphone, Globe, Clock, Trash2, ShieldCheck, X } from 'lucide-react';
import { UserPageHeader } from '@/layouts/UserLayout';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { fraudService } from '@/services/api';
import { timeAgo } from '@/utils/cn';
import type { Device } from '@/types';

export default function UserDevices() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => { setDevices(await fraudService.getUserDevices()); setLoading(false); })();
  }, []);

  async function remove(id: string) {
    await fraudService.removeDevice(id);
    setDevices((prev) => prev.filter((d) => d.id !== id));
  }
  async function trust(id: string) {
    await fraudService.trustDevice(id);
    setDevices((prev) => prev.map((d) => d.id === id ? { ...d, trusted: true } : d));
  }

  return (
    <div>
      <UserPageHeader title="My Devices" subtitle="Manage trusted devices that can access your account" />

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-40 w-full" />)}</div>
      ) : devices.length === 0 ? (
        <Card><CardBody className="flex flex-col items-center justify-center py-16"><X className="w-12 h-12 text-slate-600 mb-3" /><p className="text-slate-400 text-sm">No devices registered</p></CardBody></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {devices.map((d, i) => (
            <motion.div key={d.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} whileHover={{ y: -3 }}>
              <Card glow className="h-full">
                <CardBody>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-soc-card2 flex items-center justify-center"><Smartphone className="w-5 h-5 text-soc-accent" /></div>
                      <div><p className="text-sm font-semibold text-white">{d.name}</p>{d.current ? <Badge variant="low" className="mt-1">Current Device</Badge> : d.trusted ? <Badge variant="neutral" className="mt-1">Trusted</Badge> : <Badge variant="medium" className="mt-1">Unverified</Badge>}</div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-slate-400"><Globe className="w-3.5 h-3.5 text-slate-500" /> {d.browser} · {d.os}</div>
                    <div className="flex items-center gap-2 text-slate-400"><MonitorSmartphone className="w-3.5 h-3.5 text-slate-500" /> {d.country}</div>
                    <div className="flex items-center gap-2 text-slate-400"><Clock className="w-3.5 h-3.5 text-slate-500" /> Last login {timeAgo(d.lastLogin)}</div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    {!d.trusted && <Button size="sm" variant="outline" className="flex-1" onClick={() => trust(d.id)}><ShieldCheck className="w-3.5 h-3.5" /> Trust</Button>}
                    {!d.current && <Button size="sm" variant="ghost" className="flex-1 text-red-400 hover:bg-red-500/10" onClick={() => remove(d.id)}><Trash2 className="w-3.5 h-3.5" /> Remove</Button>}
                  </div>
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
