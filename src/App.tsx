import { lazy, Suspense, type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth, roleRedirectPath } from '@/hooks/useAuth';
import { useToasts } from '@/hooks/useToasts';
import { ToastContainer } from '@/components/ui/Toast';
import { AdminLayout } from '@/layouts/AdminLayout';
import { UserLayout } from '@/layouts/UserLayout';
import { ShieldLogo } from '@/components/ShieldLogo';
import type { UserRole } from '@/types';

const Login = lazy(() => import('@/pages/Login'));
const AdminDashboard = lazy(() => import('@/pages/admin/Dashboard'));
const AdminUsers = lazy(() => import('@/pages/admin/Users'));
const AdminTransactions = lazy(() => import('@/pages/admin/Transactions'));
const AdminIncidents = lazy(() => import('@/pages/admin/Incidents'));
const AdminAnalytics = lazy(() => import('@/pages/admin/Analytics'));
const AdminThreatDetection = lazy(() => import('@/pages/admin/ThreatDetection'));
const AdminThreatIntel = lazy(() => import('@/pages/admin/ThreatIntel'));
const AdminAiInsights = lazy(() => import('@/pages/admin/AiInsights'));
const AdminSimulator = lazy(() => import('@/pages/admin/Simulator'));
const AdminReports = lazy(() => import('@/pages/admin/Reports'));
const AdminSettings = lazy(() => import('@/pages/admin/Settings'));

const UserDashboard = lazy(() => import('@/pages/user/Dashboard'));
const UserTransactions = lazy(() => import('@/pages/user/Transactions'));
const UserDevices = lazy(() => import('@/pages/user/Devices'));
const UserAlerts = lazy(() => import('@/pages/user/Alerts'));
const UserLoginHistory = lazy(() => import('@/pages/user/LoginHistory'));
const UserProfile = lazy(() => import('@/pages/user/Profile'));
const UserSettings = lazy(() => import('@/pages/user/Settings'));

function PageFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <ShieldLogo size={56} />
    </div>
  );
}

function SuspenseWrap({ children }: { children: ReactNode }) {
  return <Suspense fallback={<PageFallback />}>{children}</Suspense>;
}

function RequireRole({ role, children }: { role: UserRole; children: ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (user.role !== role) return <Navigate to={roleRedirectPath(user.role)} replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { toasts, push, dismiss } = useToasts();
  const { user } = useAuth();

  return (
    <>
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
      <Routes>
        <Route path="/" element={user ? <Navigate to={roleRedirectPath(user.role)} replace /> : <SuspenseWrap><Login /></SuspenseWrap>} />

        {/* Admin routes */}
        <Route
          path="/admin"
          element={
            <RequireRole role="admin">
              <AdminLayout notifications={toasts} pushToast={push} />
            </RequireRole>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<SuspenseWrap><AdminDashboard pushToast={push} /></SuspenseWrap>} />
          <Route path="transactions" element={<SuspenseWrap><AdminTransactions /></SuspenseWrap>} />
          <Route path="users" element={<SuspenseWrap><AdminUsers /></SuspenseWrap>} />
          <Route path="threats" element={<SuspenseWrap><AdminThreatDetection /></SuspenseWrap>} />
          <Route path="incidents" element={<SuspenseWrap><AdminIncidents /></SuspenseWrap>} />
          <Route path="analytics" element={<SuspenseWrap><AdminAnalytics /></SuspenseWrap>} />
          <Route path="threat-intel" element={<SuspenseWrap><AdminThreatIntel /></SuspenseWrap>} />
          <Route path="ai-insights" element={<SuspenseWrap><AdminAiInsights /></SuspenseWrap>} />
          <Route path="simulator" element={<SuspenseWrap><AdminSimulator pushToast={push} /></SuspenseWrap>} />
          <Route path="reports" element={<SuspenseWrap><AdminReports /></SuspenseWrap>} />
          <Route path="settings" element={<SuspenseWrap><AdminSettings /></SuspenseWrap>} />
        </Route>

        {/* User routes */}
        <Route
          path="/user"
          element={
            <RequireRole role="user">
              <UserLayout />
            </RequireRole>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<SuspenseWrap><UserDashboard /></SuspenseWrap>} />
          <Route path="transactions" element={<SuspenseWrap><UserTransactions /></SuspenseWrap>} />
          <Route path="devices" element={<SuspenseWrap><UserDevices /></SuspenseWrap>} />
          <Route path="alerts" element={<SuspenseWrap><UserAlerts /></SuspenseWrap>} />
          <Route path="login-history" element={<SuspenseWrap><UserLoginHistory /></SuspenseWrap>} />
          <Route path="profile" element={<SuspenseWrap><UserProfile /></SuspenseWrap>} />
          <Route path="settings" element={<SuspenseWrap><UserSettings /></SuspenseWrap>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
