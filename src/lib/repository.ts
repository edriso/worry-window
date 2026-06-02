import {
  type PersistedState,
  persistedStateSchema,
  type Settings,
  type Worry,
} from '@/types/domain';

const STORAGE_KEY = 'ww-v1';

export function createDefaultState(): PersistedState {
  return {
    version: 1,
    settings: { windowTime: '18:00', windowMin: 10, accent: '#9a8fc0' },
    worries: [],
  };
}

export interface Repository {
  getState(): PersistedState;
  saveState(state: PersistedState): void;
  setSettings(patch: Partial<Settings>): PersistedState;
  setWorries(worries: Worry[]): PersistedState;
  clear(): void;
}

export function createLocalStorageRepository(storage: Storage = localStorage): Repository {
  function read(): PersistedState {
    try {
      const raw = storage.getItem(STORAGE_KEY);
      if (!raw) return createDefaultState();
      const parsed = persistedStateSchema.safeParse(JSON.parse(raw));
      return parsed.success ? parsed.data : createDefaultState();
    } catch {
      return createDefaultState();
    }
  }
  function saveState(state: PersistedState): void {
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }
  function setSettings(patch: Partial<Settings>): PersistedState {
    const current = read();
    const next = { ...current, settings: { ...current.settings, ...patch } };
    saveState(next);
    return next;
  }
  function setWorries(worries: Worry[]): PersistedState {
    const next = { ...read(), worries };
    saveState(next);
    return next;
  }
  function clear(): void {
    try {
      storage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  }
  return { getState: read, saveState, setSettings, setWorries, clear };
}

export const repository: Repository = createLocalStorageRepository();
