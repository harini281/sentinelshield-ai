import { useCallback, useState } from 'react';
import type { ToastNotification } from '@/types';

export function useToasts() {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const push = useCallback((t: Omit<ToastNotification, 'id' | 'timestamp'>) => {
    const id = Math.random().toString(36).slice(2);
    const toast: ToastNotification = { ...t, id, timestamp: new Date().toISOString() };
    setToasts((prev) => [toast, ...prev].slice(0, 5));
    setTimeout(() => setToasts((prev) => prev.filter((x) => x.id !== id)), 5000);
  }, []);

  const dismiss = useCallback((id: string) => setToasts((prev) => prev.filter((t) => t.id !== id)), []);

  return { toasts, push, dismiss };
}
