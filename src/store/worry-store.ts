import { create } from 'zustand';
import { repository } from '@/lib/repository';
import type { Accent, Settings, Worry } from '@/types/domain';

interface WorryState {
  settings: Settings;
  worries: Worry[];
  add: (txt: string, at: number, id: string) => void;
  remove: (id: string) => void;
  clearAll: () => void;
  setWindowTime: (time: string) => void;
  setWindowMin: (n: number) => void;
  setAccent: (accent: Accent) => void;
}

const initial = repository.getState();

export const useWorryStore = create<WorryState>((set, get) => {
  function commit(worries: Worry[]): void {
    set({ worries: repository.setWorries(worries).worries });
  }
  function patchSettings(patch: Partial<Settings>): void {
    set({ settings: repository.setSettings(patch).settings });
  }
  return {
    settings: initial.settings,
    worries: initial.worries,
    add: (txt, at, id) => {
      if (!txt.trim()) return;
      commit([{ id, txt: txt.trim(), at }, ...get().worries]);
    },
    remove: (id) => commit(get().worries.filter((w) => w.id !== id)),
    clearAll: () => commit([]),
    setWindowTime: (windowTime) => patchSettings({ windowTime }),
    setWindowMin: (windowMin) => patchSettings({ windowMin }),
    setAccent: (accent) => patchSettings({ accent }),
  };
});
