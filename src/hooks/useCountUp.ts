import { useEffect, useRef, useState } from 'react';

export function useCountUp(target: number, duration = 1200, start = 0) {
  const [value, setValue] = useState(start);
  const ref = useRef<number>(0);

  useEffect(() => {
    let raf = 0;
    const startTime = performance.now();
    function tick(now: number) {
      const p = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = start + (target - start) * eased;
      setValue(v);
      ref.current = v;
      if (p < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);

  return value;
}
