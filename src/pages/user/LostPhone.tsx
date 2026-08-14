import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Smartphone, ShieldAlert, ShieldCheck, KeyRound, MapPin, Cpu, Activity,
  CheckCircle2, XCircle, AlertTriangle, Lock, Eye, Brain, Zap, Ban,
  Snowflake, Monitor, Clock, ChevronRight, Info, Fingerprint, ArrowRight,
} from 'lucide-react';
import { UserPageHeader } from '@/layouts/UserLayout';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import {
  VERIFICATION_QUESTIONS, LOST_PHONE_RISK_SCORE, LOST_PHONE_RISK_FACTORS,
  LOST_PHONE_AI_EXPLANATION, generateFailedLoginAttempts, LOST_PHONE_VERIFICATION_STEPS,
  SUCCESS_VERIFICATION_SIGNALS, FAILURE_VERIFICATION_SIGNALS, FAILURE_RECOMMENDED_ACTIONS,
  SUCCESS_RECOMMENDED_ACTIONS, LOST_PHONE_PROGRESSION_STAGES,
  type VerificationResult, type VerificationQuestion,
} from '@/services/lostPhoneData';
import { cn } from '@/utils/cn';

type FlowState =
  | 'idle'
  | 'confirm'
  | 'protected'
  | 'new-device'
  | 'failed-logins'
  | 'verification-intro'
  | 'verification-questions'
  | 'verifying'
  | 'result-success'
  | 'result-failure';

const iconMap: Record<string, typeof Smartphone> = {
  Smartphone, Cpu, Activity, ShieldCheck, KeyRound, MapPin, ShieldAlert,
  ShieldX: Ban, Snowflake, CheckCircle2, Monitor, Lock,
};

const stageIconMap: Record<string, typeof Smartphone> = {
  'normal': ShieldCheck,
  'lost-device': Smartphone,
  'new-device': Monitor,
  'failed-logins': KeyRound,
  'owner-verification': Fingerprint,
  'verified': ShieldCheck,
  'suspicious-access': ShieldAlert,
  'account-compromise': Lock,
  'financial-manipulation': AlertTriangle,
  'fraud-attempt': Ban,
};

export default function UserLostPhone() {
  const [flowState, setFlowState] = useState<FlowState>('idle');
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [verifyStep, setVerifyStep] = useState(0);
  const [failedAttempts, setFailedAttempts] = useState<typeof generateFailedLoginAttempts extends () => infer R ? R : never>([]);
  const [visibleAttempts, setVisibleAttempts] = useState(0);
  const [progressionStage, setProgressionStage] = useState(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  function clearTimers() {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }

  useEffect(() => () => clearTimers(), []);

  function addTimer(fn: () => void, delay: number) {
    const t = setTimeout(fn, delay);
    timersRef.current.push(t);
  }

  function resetFlow() {
    clearTimers();
    setFlowState('idle');
    setAnswers({});
    setCurrentQuestion(0);
    setVerifyStep(0);
    setVisibleAttempts(0);
    setProgressionStage(0);
    setFailedAttempts([]);
  }

  function activateProtection() {
    setFlowState('protected');
    setProgressionStage(1);
  }

  function simulateNewDevice() {
    setFlowState('new-device');
    setProgressionStage(2);
    addTimer(() => {
      setFlowState('failed-logins');
      setProgressionStage(3);
      const attempts = generateFailedLoginAttempts();
      setFailedAttempts(attempts);
      attempts.forEach((_, i) => {
        addTimer(() => setVisibleAttempts(i + 1), 400 * (i + 1));
      });
      addTimer(() => {
        setFlowState('verification-intro');
        setProgressionStage(4);
      }, 400 * (attempts.length + 1) + 800);
    }, 4000);
  }

  function startVerification() {
    setFlowState('verification-questions');
    setCurrentQuestion(0);
    setAnswers({});
  }

  function selectAnswer(qId: string, option: string) {
    const newAnswers = { ...answers, [qId]: option };
    setAnswers(newAnswers);
    if (currentQuestion < VERIFICATION_QUESTIONS.length - 1) {
      addTimer(() => setCurrentQuestion((prev) => prev + 1), 350);
    } else {
      addTimer(() => startVerifying(newAnswers), 400);
    }
  }

  function startVerifying(finalAnswers: Record<string, string>) {
    setFlowState('verifying');
    setVerifyStep(0);
    LOST_PHONE_VERIFICATION_STEPS.forEach((_, i) => {
      addTimer(() => setVerifyStep(i), 900 * i);
    });
    const allCorrect = VERIFICATION_QUESTIONS.every((q) => finalAnswers[q.id] === q.correctAnswer);
    addTimer(() => {
      if (allCorrect) {
        setFlowState('result-success');
        setProgressionStage(5);
      } else {
        setFlowState('result-failure');
        setProgressionStage(6);
      }
    }, 900 * LOST_PHONE_VERIFICATION_STEPS.length + 500);
  }

  const allCorrect = VERIFICATION_QUESTIONS.every((q) => answers[q.id] === q.correctAnswer);

  return (
    <div>
      <UserPageHeader
        title="Lost Device Protection"
        subtitle="Account takeover protection — SentinelShield verifies who is behind every access"
      />

      {/* Product message banner */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-soc-primary/40 bg-gradient-to-r from-soc-primary/15 via-soc-card to-soc-accent/10 p-5 mb-6"
      >
        <div className="absolute inset-0 opacity-20" style={{ background: 'linear-gradient(110deg, transparent 30%, rgba(124,58,237,0.15) 50%, transparent 70%)' }} />
        <div className="relative flex items-center gap-3">
          <Brain className="w-6 h-6 text-soc-primary shrink-0" />
          <div>
            <p className="text-sm font-bold text-white">
              SentinelShield doesn't just detect unusual access. It verifies who is behind it.
            </p>
            <p className="text-xs text-slate-400 mt-0.5">DETECT → CORRELATE → UNDERSTAND → VERIFY → PREDICT → PREVENT → EXPLAIN</p>
          </div>
        </div>
      </motion.div>

      {/* Progression timeline */}
      <Card className="mb-6">
        <CardBody>
          <LostPhoneProgression currentStage={progressionStage} result={flowState === 'result-success' ? 'success' : flowState === 'result-failure' ? 'failure' : 'pending'} />
        </CardBody>
      </Card>

      <AnimatePresence mode="wait">
        {/* IDLE STATE */}
        {flowState === 'idle' && (
          <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card className="max-w-2xl mx-auto">
              <CardBody className="flex flex-col items-center text-center py-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500/20 to-red-500/20 border border-amber-500/40 flex items-center justify-center mb-6"
                >
                  <Smartphone className="w-10 h-10 text-amber-400" />
                </motion.div>
                <h2 className="text-xl font-bold text-white mb-2">Report Lost Device</h2>
                <p className="text-sm text-slate-400 max-w-md mb-6">
                  Lost your phone? Activate Lost Device Mode to increase monitoring for new-device activity.
                  SentinelShield will watch for suspicious access and verify anyone trying to log in.
                </p>
                <Button variant="danger" size="lg" onClick={() => setFlowState('confirm')}>
                  <Smartphone className="w-4 h-4" /> Report Lost Device
                </Button>
                <p className="mt-4 text-xs text-slate-600 flex items-center gap-1">
                  <Info className="w-3 h-3" /> Simulated demo — no real credentials required
                </p>
              </CardBody>
            </Card>
          </motion.div>
        )}

        {/* CONFIRM STATE */}
        {flowState === 'confirm' && (
          <motion.div key="confirm" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><ShieldAlert className="w-4 h-4 text-amber-400" /> Lost Device Protection</CardTitle>
              </CardHeader>
              <CardBody>
                <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 mb-5">
                  <p className="text-sm text-slate-200 leading-relaxed">
                    Your registered device has been reported as lost. SentinelShield will increase
                    monitoring for new-device activity and require owner verification for any access
                    from unrecognized devices.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-5">
                  <Info className="w-3.5 h-3.5" /> Simulated demo data — no real passwords, PINs, or OTPs will be requested.
                </div>
                <div className="flex gap-3">
                  <Button variant="primary" size="lg" className="flex-1" onClick={activateProtection}>
                    <ShieldCheck className="w-4 h-4" /> Activate Protection
                  </Button>
                  <Button variant="ghost" size="lg" onClick={resetFlow}>Cancel</Button>
                </div>
              </CardBody>
            </Card>
          </motion.div>
        )}

        {/* PROTECTED STATE */}
        {flowState === 'protected' && (
          <motion.div key="protected" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card className="max-w-2xl mx-auto">
              <CardBody className="flex flex-col items-center text-center py-10">
                <motion.div
                  initial={{ scale: 0, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500/60 flex items-center justify-center mb-5"
                >
                  <ShieldCheck className="w-10 h-10 text-emerald-400" />
                </motion.div>
                <h2 className="text-xl font-bold text-emerald-400 mb-2">Lost Device Mode: ACTIVE</h2>
                <p className="text-sm text-slate-400 max-w-md mb-6">
                  SentinelShield is now monitoring for new-device activity. If someone tries to
                  access your account from an unrecognized device, we will detect it and verify
                  their identity.
                </p>
                <div className="flex flex-col items-center gap-2 mb-6">
                  {[
                    'Enhanced device monitoring enabled',
                    'Owner verification armed for new devices',
                    'Transaction risk thresholds raised',
                  ].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" /> {item}
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="lg" onClick={simulateNewDevice}>
                  <Eye className="w-4 h-4" /> Simulate Login from New Device
                </Button>
                <p className="mt-3 text-xs text-slate-600">See how SentinelShield responds to suspicious access</p>
              </CardBody>
            </Card>
          </motion.div>
        )}

        {/* NEW DEVICE DETECTED */}
        {flowState === 'new-device' && (
          <motion.div key="new-device" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card className="max-w-2xl mx-auto relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-red-500/10 pointer-events-none" />
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2 text-amber-400">
                  <AlertTriangle className="w-4 h-4" /> NEW DEVICE DETECTED
                </CardTitle>
              </CardHeader>
              <CardBody className="relative">
                <motion.div
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 mb-4"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <Monitor className="w-8 h-8 text-amber-400" />
                    <div>
                      <p className="text-xs text-slate-400">Device</p>
                      <p className="text-lg font-bold text-white">Windows / Chrome</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="glass-soft rounded-lg p-3">
                      <p className="text-xs text-slate-400">Location</p>
                      <p className="text-sm font-semibold text-white">Unrecognized</p>
                    </div>
                    <div className="glass-soft rounded-lg p-3">
                      <p className="text-xs text-slate-400">Device Trust</p>
                      <p className="text-sm font-semibold text-red-400">LOW</p>
                    </div>
                  </div>
                </motion.div>
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3">
                  <p className="text-sm text-slate-200">
                    <ShieldAlert className="w-4 h-4 text-red-400 inline mr-1.5" />
                    Risk increased because this device has never been associated with the account.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 mt-4 text-xs text-slate-500">
                  <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-3.5 h-3.5 border-2 border-soc-accent/30 border-t-soc-accent rounded-full" />
                  SentinelShield is analyzing the access…
                </div>
              </CardBody>
            </Card>
          </motion.div>
        )}

        {/* FAILED LOGINS */}
        {flowState === 'failed-logins' && (
          <motion.div key="failed-logins" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card className="max-w-2xl mx-auto relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-transparent pointer-events-none" />
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2 text-red-400">
                  <KeyRound className="w-4 h-4" /> Authentication Attempts
                </CardTitle>
              </CardHeader>
              <CardBody className="relative">
                <div className="space-y-2 mb-4">
                  {failedAttempts.slice(0, visibleAttempts).map((att) => (
                    <motion.div
                      key={att.attempt}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-3 glass-soft rounded-xl p-3"
                    >
                      <span className="text-xs font-mono text-slate-500 w-24">Attempt {att.attempt}</span>
                      <ArrowRight className="w-3 h-3 text-slate-600" />
                      <span className="flex items-center gap-1.5 text-sm font-semibold text-red-400">
                        <XCircle className="w-4 h-4" /> Failed
                      </span>
                    </motion.div>
                  ))}
                </div>
                {visibleAttempts >= 5 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-xl border-2 border-red-500/50 bg-red-500/15 p-4 text-center"
                  >
                    <p className="text-2xl font-bold text-red-400 flex items-center justify-center gap-2">
                      <ShieldAlert className="w-6 h-6" /> 5 FAILED LOGIN ATTEMPTS
                    </p>
                    <p className="text-sm text-slate-300 mt-1">Authentication Risk: <span className="font-bold text-red-400">HIGH</span></p>
                  </motion.div>
                )}
                {visibleAttempts < 5 && (
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                    <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }} className="w-3.5 h-3.5 border-2 border-red-400/30 border-t-red-400 rounded-full" />
                    Monitoring authentication attempts…
                  </div>
                )}
              </CardBody>
            </Card>
          </motion.div>
        )}

        {/* VERIFICATION INTRO */}
        {flowState === 'verification-intro' && (
          <motion.div key="verification-intro" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card className="max-w-2xl mx-auto relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-soc-primary/10 to-soc-accent/10 pointer-events-none" />
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2 text-soc-primary">
                  <Fingerprint className="w-5 h-5" /> VERIFY ACCOUNT OWNER
                </CardTitle>
              </CardHeader>
              <CardBody className="relative">
                <div className="rounded-xl border border-soc-primary/30 bg-soc-primary/5 p-4 mb-4">
                  <p className="text-sm text-slate-200 leading-relaxed">
                    We detected access from a new device. Please verify that you are the account owner.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs text-amber-400 mb-5">
                  <Info className="w-3.5 h-3.5" /> SIMULATED DEMO DATA — no passwords, PINs, OTPs, or real security answers will be requested.
                </div>
                <Button variant="primary" size="lg" className="w-full" onClick={startVerification}>
                  <Fingerprint className="w-4 h-4" /> Begin Verification
                </Button>
              </CardBody>
            </Card>
          </motion.div>
        )}

        {/* VERIFICATION QUESTIONS */}
        {flowState === 'verification-questions' && (
          <motion.div key="verification-questions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-soc-primary">
                  <Fingerprint className="w-4 h-4" /> Owner Verification
                </CardTitle>
                <Badge variant="neutral">Question {currentQuestion + 1} / {VERIFICATION_QUESTIONS.length}</Badge>
              </CardHeader>
              <CardBody>
                {/* Progress dots */}
                <div className="flex items-center gap-2 mb-5">
                  {VERIFICATION_QUESTIONS.map((q, i) => (
                    <div
                      key={q.id}
                      className={cn(
                        'h-1.5 rounded-full transition-all duration-300',
                        i < currentQuestion ? 'flex-1 bg-emerald-500' : i === currentQuestion ? 'flex-1 bg-soc-primary' : 'flex-1 bg-soc-border',
                      )}
                    />
                  ))}
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestion}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-xs text-slate-500 mb-1">SIMULATED DEMO DATA</p>
                    <p className="text-base font-semibold text-white mb-4">
                      {VERIFICATION_QUESTIONS[currentQuestion].question}
                    </p>
                    <div className="space-y-2">
                      {VERIFICATION_QUESTIONS[currentQuestion].options.map((option) => {
                        const isSelected = answers[VERIFICATION_QUESTIONS[currentQuestion].id] === option;
                        return (
                          <motion.button
                            key={option}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => selectAnswer(VERIFICATION_QUESTIONS[currentQuestion].id, option)}
                            className={cn(
                              'w-full flex items-center justify-between gap-3 rounded-xl border p-3.5 text-left text-sm transition-all',
                              isSelected
                                ? 'border-soc-primary bg-soc-primary/15 text-white'
                                : 'border-soc-border bg-soc-card2 text-slate-300 hover:border-soc-primary/40',
                            )}
                          >
                            <span>{option}</span>
                            {isSelected ? (
                              <CheckCircle2 className="w-4 h-4 text-soc-primary shrink-0" />
                            ) : (
                              <ChevronRight className="w-4 h-4 text-slate-600 shrink-0" />
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>
                </AnimatePresence>
              </CardBody>
            </Card>
          </motion.div>
        )}

        {/* VERIFYING */}
        {flowState === 'verifying' && (
          <motion.div key="verifying" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Card className="max-w-2xl mx-auto relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-soc-primary/10 to-transparent pointer-events-none" />
              <motion.div
                className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-soc-primary/50 to-transparent pointer-events-none"
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              />
              <CardHeader className="relative">
                <CardTitle className="flex items-center gap-2 text-soc-primary">
                  <Brain className="w-4 h-4" /> SentinelShield AI Verification
                </CardTitle>
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60 animate-ping" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
              </CardHeader>
              <CardBody className="relative">
                <div className="space-y-3">
                  {LOST_PHONE_VERIFICATION_STEPS.map((step, i) => {
                    const Icon = iconMap[step.icon] ?? Activity;
                    const isDone = i < verifyStep;
                    const isActive = i === verifyStep;
                    return (
                      <motion.div
                        key={step.label}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={cn(
                          'flex items-center gap-3 rounded-xl border p-3 transition-all',
                          isDone && 'border-emerald-500/30 bg-emerald-500/5',
                          isActive && 'border-soc-primary/40 bg-soc-primary/10',
                          !isDone && !isActive && 'border-soc-border bg-soc-card2 opacity-40',
                        )}
                      >
                        <div className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                          isDone ? 'bg-emerald-500/20' : isActive ? 'bg-soc-primary/20' : 'bg-soc-card2',
                        )}>
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          ) : isActive ? (
                            <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} className="w-3.5 h-3.5 border-2 border-soc-primary/30 border-t-soc-primary rounded-full" />
                          ) : (
                            <Icon className="w-4 h-4 text-slate-500" />
                          )}
                        </div>
                        <span className={cn(
                          'text-sm',
                          isDone ? 'text-emerald-400' : isActive ? 'text-white font-medium' : 'text-slate-500',
                        )}>
                          {step.label}
                        </span>
                      </motion.div>
                    );
                  })}
                </div>
              </CardBody>
            </Card>
          </motion.div>
        )}

        {/* RESULT: SUCCESS */}
        {flowState === 'result-success' && (
          <motion.div key="result-success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="max-w-2xl mx-auto space-y-4">
              <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none" />
                <CardBody className="relative flex flex-col items-center text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mb-4"
                  >
                    <ShieldCheck className="w-10 h-10 text-emerald-400" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-emerald-400 mb-1">OWNER VERIFIED</h2>
                  <p className="text-sm text-slate-300">Identity Confidence: <span className="font-bold text-emerald-400">HIGH</span></p>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Verification Signals</p>
                  <div className="space-y-2">
                    {SUCCESS_VERIFICATION_SIGNALS.map((signal, i) => (
                      <motion.div
                        key={signal}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center gap-2 text-sm text-slate-200"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> {signal}
                      </motion.div>
                    ))}
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-emerald-400"><Zap className="w-4 h-4" /> Recommended Action</CardTitle>
                </CardHeader>
                <CardBody>
                  <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 mb-3">
                    <p className="text-lg font-bold text-emerald-400 text-center">ALLOW ACCESS</p>
                  </div>
                  <div className="rounded-xl border border-soc-accent/30 bg-soc-accent/10 p-4 mb-3">
                    <p className="text-sm font-semibold text-soc-accent text-center">REGISTER DEVICE</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 justify-center">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Customer notification sent.
                  </div>
                </CardBody>
              </Card>

              <Button variant="outline" size="lg" className="w-full" onClick={resetFlow}>
                <ArrowRight className="w-4 h-4" /> Start Over
              </Button>
            </div>
          </motion.div>
        )}

        {/* RESULT: FAILURE */}
        {flowState === 'result-failure' && (
          <motion.div key="result-failure" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="max-w-2xl mx-auto space-y-4">
              <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-red-500/15 to-transparent pointer-events-none" />
                <CardBody className="relative flex flex-col items-center text-center py-8">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="w-20 h-20 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center mb-4"
                  >
                    <ShieldAlert className="w-10 h-10 text-red-400" />
                  </motion.div>
                  <h2 className="text-2xl font-bold text-red-400 mb-1">OWNER VERIFICATION FAILED</h2>
                  <p className="text-sm text-slate-300">Identity Confidence: <span className="font-bold text-red-400">LOW</span></p>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Risk Signals</p>
                  <div className="space-y-2">
                    {FAILURE_VERIFICATION_SIGNALS.map((signal, i) => (
                      <motion.div
                        key={signal}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="flex items-center gap-2 text-sm text-slate-200"
                      >
                        <XCircle className="w-4 h-4 text-red-400 shrink-0" /> {signal}
                      </motion.div>
                    ))}
                  </div>
                </CardBody>
              </Card>

              {/* Risk Score */}
              <Card className="relative overflow-hidden">
                <CardBody>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xs text-slate-400 uppercase tracking-wider">Risk Score</p>
                      <p className="text-5xl font-extrabold text-red-400">
                        {LOST_PHONE_RISK_SCORE}
                        <span className="text-lg text-slate-500 font-normal">/100</span>
                      </p>
                    </div>
                    <Badge variant="critical">CRITICAL</Badge>
                  </div>
                  <div className="h-3 rounded-full bg-soc-border overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${LOST_PHONE_RISK_SCORE}%` }}
                      transition={{ duration: 1.2, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-orange-500 to-red-500"
                    />
                  </div>
                </CardBody>
              </Card>

              {/* Recommended Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-400"><ShieldAlert className="w-4 h-4" /> Recommended Actions</CardTitle>
                </CardHeader>
                <CardBody>
                  <div className="space-y-2">
                    {FAILURE_RECOMMENDED_ACTIONS.map((action, i) => {
                      const Icon = iconMap[action.icon] ?? Ban;
                      return (
                        <motion.div
                          key={action.label}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3"
                        >
                          <Icon className="w-5 h-5 text-red-400 shrink-0" />
                          <span className="text-sm font-bold text-white">{action.label}</span>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardBody>
              </Card>

              {/* AI Explanation */}
              <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-soc-primary/8 to-transparent pointer-events-none" />
                <CardHeader className="relative">
                  <CardTitle className="flex items-center gap-2 text-soc-primary"><Brain className="w-4 h-4" /> AI Risk Explanation</CardTitle>
                </CardHeader>
                <CardBody className="relative">
                  <div className="rounded-xl border border-soc-primary/30 bg-soc-primary/5 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Cpu className="w-4 h-4 text-soc-primary" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-soc-primary">SentinelShield AI Engine</span>
                    </div>
                    <p className="text-sm text-slate-200 leading-relaxed">"{LOST_PHONE_AI_EXPLANATION}"</p>
                  </div>
                  {/* Risk factor breakdown */}
                  <div className="mt-4 space-y-2">
                    {LOST_PHONE_RISK_FACTORS.map((factor, i) => {
                      const Icon = iconMap[factor.icon] ?? Activity;
                      return (
                        <motion.div
                          key={factor.label}
                          initial={{ opacity: 0, x: -12 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.08 }}
                          className="flex items-center gap-3"
                        >
                          <div className="w-8 h-8 rounded-lg bg-soc-card2 flex items-center justify-center shrink-0">
                            <Icon className="w-4 h-4 text-slate-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-slate-300">{factor.label}</span>
                              <span className="text-xs font-bold text-red-400">{factor.contribution}%</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-soc-border overflow-hidden">
                              <motion.div
                                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-red-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${factor.contribution}%` }}
                                transition={{ delay: i * 0.08 + 0.2, duration: 0.8 }}
                              />
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </CardBody>
              </Card>

              <Button variant="outline" size="lg" className="w-full" onClick={resetFlow}>
                <ArrowRight className="w-4 h-4" /> Start Over
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  function LostPhoneProgression({ currentStage, result }: { currentStage: number; result: VerificationResult }) {
    const stages = LOST_PHONE_PROGRESSION_STAGES;
    const verifiedIdx = stages.findIndex((s) => s.id === 'verified');
    const failedStages = stages.filter((s) => s.branch === 'failed');
    const failedStartIdx = stages.findIndex((s) => s.id === 'suspicious-access');

    return (
      <div className="w-full">
        <div className="flex items-center gap-2 mb-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-soc-border to-soc-border" />
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Attack Progression</span>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent via-soc-border to-soc-border" />
        </div>

        {/* Main horizontal timeline (shared stages) */}
        <div className="relative mb-6">
          <div className="absolute top-5 left-5 right-5 h-0.5 bg-soc-border rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #22C55E, #F59E0B, #F97316, #EF4444)' }}
              initial={{ width: '0%' }}
              animate={{ width: `${Math.min(currentStage / 4, 1) * 100}%` }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
            />
          </div>
          <div className="relative flex justify-between">
            {stages.slice(0, 5).map((stage, i) => {
              const isPast = i < currentStage;
              const isCurrent = i === currentStage;
              const Icon = stageIconMap[stage.id] ?? Smartphone;
              const color = isCurrent ? (i <= 1 ? 'text-emerald-400' : i <= 2 ? 'text-amber-400' : 'text-orange-400') : isPast ? 'text-slate-400' : 'text-slate-600';
              return (
                <div key={stage.id} className="flex flex-col items-center" style={{ width: '20%' }}>
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.1, type: 'spring', stiffness: 300 }}
                    className={cn(
                      'relative z-10 w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all',
                      isPast && 'bg-soc-card2 border-soc-border',
                      isCurrent && cn('bg-soc-card2 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.3)]'),
                      !isPast && !isCurrent && 'bg-soc-card2 border-soc-border/50',
                    )}
                  >
                    {isPast ? (
                      <CheckCircle2 className="w-4 h-4 text-slate-400" />
                    ) : (
                      <Icon className={cn('w-4 h-4', color)} />
                    )}
                    {isCurrent && (
                      <motion.span
                        className="absolute inset-0 rounded-full border-2 border-amber-500/50"
                        animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
                      />
                    )}
                  </motion.div>
                  <p className={cn('mt-2 text-[9px] font-semibold uppercase leading-tight text-center', isCurrent ? 'text-amber-400' : isPast ? 'text-slate-400' : 'text-slate-600')}>
                    {stage.shortLabel}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Branch section */}
        <AnimatePresence>
          {result !== 'pending' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 h-px bg-soc-border" />
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500">{result === 'success' ? 'Verified Path' : 'Failed Path'}</span>
                <div className="flex-1 h-px bg-soc-border" />
              </div>

              {result === 'success' ? (
                <div className="flex flex-col items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="flex items-center gap-3 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-5 py-3"
                  >
                    <ShieldCheck className="w-6 h-6 text-emerald-400" />
                    <div>
                      <p className="text-sm font-bold text-emerald-400">LEGITIMATE ACCESS</p>
                      <p className="text-xs text-slate-400">Device Trust Restored</p>
                    </div>
                  </motion.div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  {/* Vertical failed chain */}
                  <div className="relative pl-8 w-full max-w-xs">
                    <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-red-500 via-red-500 to-red-600" />
                    {failedStages.map((stage, i) => {
                      const Icon = stageIconMap[stage.id] ?? ShieldAlert;
                      return (
                        <motion.div
                          key={stage.id}
                          initial={{ opacity: 0, x: -16 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.12 }}
                          className="relative mb-3 last:mb-0"
                        >
                          <span className="absolute -left-[22px] top-1.5 w-4 h-4 rounded-full bg-red-500/20 border-2 border-red-500 flex items-center justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                          </span>
                          <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-2.5">
                            <Icon className="w-4 h-4 text-red-400 shrink-0" />
                            <span className="text-xs font-semibold text-white">{stage.label}</span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
}
