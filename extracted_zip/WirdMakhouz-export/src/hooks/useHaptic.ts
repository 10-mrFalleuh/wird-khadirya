import { useCallback, useRef } from 'react';

export function useHaptic() {
  const lastVibration = useRef(0);

  const vibrate = useCallback((pattern: number | number[] = 15) => {
    const now = Date.now();
    if (now - lastVibration.current < 50) return;
    lastVibration.current = now;

    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  }, []);

  const lightTap = useCallback(() => {
    vibrate(10);
  }, [vibrate]);

  const mediumTap = useCallback(() => {
    vibrate(25);
  }, [vibrate]);

  const strongTap = useCallback(() => {
    vibrate([50, 30, 50]);
  }, [vibrate]);

  const milestoneTap = useCallback(() => {
    vibrate([100, 50, 100, 50, 100]);
  }, [vibrate]);

  return { lightTap, mediumTap, strongTap, milestoneTap };
}
