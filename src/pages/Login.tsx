import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, Fingerprint, LockKeyhole, ScanFace, KeyRound } from 'lucide-react';
import { useAuth, roleRedirectPath } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { ShieldLogo } from '@/components/ShieldLogo';
import { ParticleBackground } from '@/components/backgrounds/ParticleBackground';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@sentinel.ai');
  const [password, setPassword] = useState('sentinel123');
  const [remember, setRemember] = useState(true);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [forgot, setForgot] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const authUser = await login(email, password);
      navigate(roleRedirectPath(authUser.role));
    } catch {
      setError('Authentication failed. Verify your credentials.');
    } finally {
      setLoading(false);
    }
  }

  function fillDemo(role: 'admin' | 'user') {
    setEmail(role === 'admin' ? 'admin@sentinel.ai' : 'user@sentinel.ai');
    setPassword('sentinel123');
    setError('');
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-soc-bg">
      <div className="absolute inset-0 neon-grid opacity-60" />
      <ParticleBackground density={80} />
      <div className="absolute -top-40 -left-40 w-[480px] h-[480px] rounded-full bg-soc-primary/20 blur-[120px]" />
      <div className="absolute -bottom-40 -right-40 w-[480px] h-[480px] rounded-full bg-soc-secondary/20 blur-[120px]" />

      <div className="relative z-10 min-h-screen grid lg:grid-cols-2">
        {/* Left — branding */}
        <div className="hidden lg:flex flex-col justify-between p-12">
          <div className="flex items-center gap-3">
            <ShieldLogo size={48} />
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">SentinelShield <span className="text-soc-primary">AI</span></h1>
              <p className="text-xs text-slate-400">Financial Security Operations Center</p>
            </div>
          </div>

          <div className="relative max-w-md">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h2 className="text-4xl font-extrabold leading-tight text-white">
                Defending the world's<br />
                <span className="text-glow text-soc-primary">financial frontier</span>
              </h2>
              <p className="mt-4 text-slate-400 leading-relaxed">
                AI-powered fraud detection, real-time threat intelligence, and autonomous response for enterprise banks and their customers.
              </p>
            </motion.div>

            <div className="relative mt-10 h-64">
              <motion.div
                className="absolute left-0 top-6 glass rounded-2xl p-4 w-56"
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4" /> Threat Blocked
                </div>
                <p className="mt-1 text-[11px] text-slate-400">VPN transaction from Lagos intercepted</p>
              </motion.div>

              <motion.div
                className="absolute right-0 top-24 glass rounded-2xl p-4 w-52"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              >
                <div className="flex items-center gap-2 text-soc-primary text-xs font-semibold">
                  <Fingerprint className="w-4 h-4" /> Identity Verified
                </div>
                <p className="mt-1 text-[11px] text-slate-400">Biometric MFA challenge passed</p>
              </motion.div>

              <motion.div
                className="absolute left-10 bottom-0 glass rounded-2xl p-4 w-56"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              >
                <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold">
                  <ScanFace className="w-4 h-4" /> Risk Score 87
                </div>
                <p className="mt-1 text-[11px] text-slate-400">Impossible travel pattern detected</p>
              </motion.div>

              <motion.div
                className="absolute right-12 bottom-8 glass rounded-2xl p-4 w-48"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
              >
                <div className="flex items-center gap-2 text-soc-secondary text-xs font-semibold">
                  <LockKeyhole className="w-4 h-4" /> Session Encrypted
                </div>
                <p className="mt-1 text-[11px] text-slate-400">AES-256 channel established</p>
              </motion.div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-500">
            <span>SOC 2 Type II</span>
            <span>ISO 27001</span>
            <span>PCI DSS</span>
            <span>GDPR</span>
          </div>
        </div>

        {/* Right — login form */}
        <div className="flex items-center justify-center p-6 sm:p-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="glass w-full max-w-md rounded-3xl p-8 shadow-card"
          >
            <div className="lg:hidden flex items-center gap-3 mb-8">
              <ShieldLogo size={44} />
              <div>
                <h1 className="text-lg font-bold text-white">SentinelShield <span className="text-soc-primary">AI</span></h1>
                <p className="text-[11px] text-slate-400">Financial Security</p>
              </div>
            </div>

            {forgot ? (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <KeyRound className="w-5 h-5 text-soc-primary" />
                  <h2 className="text-2xl font-bold text-white">Reset Password</h2>
                </div>
                <p className="text-sm text-slate-400">Enter your email and we'll send a secure reset link.</p>

                {forgotSent ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center mx-auto">
                      <ShieldCheck className="w-7 h-7 text-emerald-400" />
                    </div>
                    <p className="mt-4 text-sm text-white font-semibold">Reset link sent</p>
                    <p className="text-xs text-slate-400 mt-1">Check your inbox for the secure link.</p>
                    <button onClick={() => { setForgot(false); setForgotSent(false); }} className="mt-6 text-xs text-soc-primary hover:underline">
                      Back to sign in
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); setForgotSent(true); }} className="mt-8 space-y-5">
                    <div>
                      <label className="text-xs font-medium text-slate-300">Email</label>
                      <div className="mt-1.5 relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full rounded-xl bg-soc-card2 border border-soc-border pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-soc-primary focus:ring-2 focus:ring-soc-primary/30 outline-none transition"
                          placeholder="you@bank.io"
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit" size="lg" className="w-full">Send Reset Link</Button>
                    <button type="button" onClick={() => setForgot(false)} className="w-full text-center text-xs text-soc-primary hover:underline">
                      Back to sign in
                    </button>
                  </form>
                )}
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-white">Secure Sign In</h2>
                <p className="mt-1 text-sm text-slate-400">Access your security portal</p>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => fillDemo('admin')}
                    className="rounded-xl border border-soc-border bg-soc-card2 px-3 py-2 text-xs text-slate-300 hover:border-soc-primary/50 hover:text-white transition"
                  >
                    Admin demo
                  </button>
                  <button
                    onClick={() => fillDemo('user')}
                    className="rounded-xl border border-soc-border bg-soc-card2 px-3 py-2 text-xs text-slate-300 hover:border-soc-primary/50 hover:text-white transition"
                  >
                    User demo
                  </button>
                </div>

                <form onSubmit={onSubmit} className="mt-6 space-y-5">
                  <div>
                    <label className="text-xs font-medium text-slate-300">Email</label>
                    <div className="mt-1.5 relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-xl bg-soc-card2 border border-soc-border pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-soc-primary focus:ring-2 focus:ring-soc-primary/30 outline-none transition"
                        placeholder="you@bank.io"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-300">Password</label>
                    <div className="mt-1.5 relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type={showPw ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-xl bg-soc-card2 border border-soc-border pl-10 pr-10 py-2.5 text-sm text-white placeholder-slate-500 focus:border-soc-primary focus:ring-2 focus:ring-soc-primary/30 outline-none transition"
                        placeholder="••••••••"
                        required
                      />
                      <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                        {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <button
                        type="button"
                        onClick={() => setRemember((r) => !r)}
                        className={`w-9 h-5 rounded-full transition-colors relative ${remember ? 'bg-soc-primary' : 'bg-soc-border'}`}
                      >
                        <motion.span
                          layout
                          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white ${remember ? 'left-4' : 'left-0.5'}`}
                        />
                      </button>
                      <span className="text-xs text-slate-300">Remember this device</span>
                    </label>
                    <button type="button" onClick={() => setForgot(true)} className="text-xs text-soc-primary hover:underline">
                      Forgot password?
                    </button>
                  </div>

                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2"
                    >
                      {error}
                    </motion.p>
                  )}

                  <Button type="submit" size="lg" disabled={loading} className="w-full gradient-btn">
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                        />
                        Authenticating…
                      </span>
                    ) : (
                      <>Secure Login</>
                    )}
                  </Button>

                  <p className="text-center text-[11px] text-slate-500">
                    Protected by SentinelShield AI · 256-bit encrypted session
                  </p>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
