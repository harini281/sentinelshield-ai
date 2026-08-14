import { useState, type ReactNode } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, ArrowLeftRight, MonitorSmartphone, Bell, History,
  User as UserIcon, Settings as SettingsIcon, LogOut, Menu, X, ChevronRight, Shield,
} from 'lucide-react';
import { ShieldLogo } from '@/components/ShieldLogo';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/utils/cn';

const nav = [
  { to: '/user/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/user/transactions', label: 'My Transactions', icon: ArrowLeftRight },
  { to: '/user/devices', label: 'My Devices', icon: MonitorSmartphone },
  { to: '/user/alerts', label: 'Security Alerts', icon: Bell },
  { to: '/user/login-history', label: 'Login History', icon: History },
  { to: '/user/profile', label: 'Profile', icon: UserIcon },
  { to: '/user/settings', label: 'Settings', icon: SettingsIcon },
];

export function UserLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/');
  }

  const SidebarContent = (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 px-5 h-16 border-b border-soc-border shrink-0">
        <ShieldLogo size={36} />
        <div className="leading-tight">
          <p className="text-sm font-bold text-white">SentinelShield<span className="text-soc-primary"> AI</span></p>
          <p className="text-[10px] text-slate-500 font-mono">SECURE PORTAL</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative',
                isActive
                  ? 'bg-soc-primary/20 text-white border border-soc-primary/40'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent',
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.span layoutId="user-nav-active" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full bg-soc-primary" />
                )}
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
                <ChevronRight className={cn('w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-60 transition-opacity', isActive && 'opacity-60')} />
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-soc-border">
        <div className="glass-soft rounded-xl p-3 flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <div className="text-[11px] leading-tight">
            <p className="text-emerald-400 font-semibold">Account protected</p>
            <p className="text-slate-500">MFA · Real-time monitoring</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative min-h-screen bg-soc-bg">
      <div className="absolute inset-0 neon-grid opacity-20 pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-soc-primary/10 blur-[140px] pointer-events-none" />

      <aside className="hidden lg:block fixed inset-y-0 left-0 w-64 glass border-r border-soc-border z-30">
        {SidebarContent}
      </aside>

      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="lg:hidden fixed inset-y-0 left-0 w-64 glass border-r border-soc-border z-50"
            >
              {SidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="lg:pl-64 relative z-10">
        <header className="sticky top-0 z-20 h-16 glass border-b border-soc-border flex items-center gap-4 px-4 sm:px-6">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-slate-300 hover:text-white">
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Account secured</span>
          </div>

          <div className="flex-1" />

          <button
            onClick={() => navigate('/user/alerts')}
            className="relative p-2 rounded-xl glass-soft hover:border-soc-primary/40 transition-colors"
          >
            <Bell className="w-5 h-5 text-slate-300" />
          </button>

          <div className="flex items-center gap-2 p-1 pr-2 rounded-xl glass-soft">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-soc-primary to-soc-secondary flex items-center justify-center text-sm font-bold text-white">
              {user?.name?.[0] ?? 'U'}
            </div>
            <div className="hidden sm:block text-left leading-tight">
              <p className="text-xs font-semibold text-white">{user?.name ?? 'Customer'}</p>
              <p className="text-[10px] text-slate-500">Customer</p>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {sidebarOpen && (
        <button onClick={() => setSidebarOpen(false)} className="lg:hidden fixed top-4 right-4 z-[60] text-white">
          <X className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}

export function UserPageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
