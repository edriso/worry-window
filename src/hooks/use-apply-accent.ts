import { useEffect } from 'react';
import { useWorryStore } from '@/store/worry-store';

export function useApplyAccent(): void {
  const accent = useWorryStore((state) => state.settings.accent);
  useEffect(() => {
    document.documentElement.style.setProperty('--accent', accent);
  }, [accent]);
}
