import { beforeEach, describe, expect, it } from 'vitest';
import { createLocalStorageRepository, type Repository } from './repository';

function memoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    clear: () => map.clear(),
    getItem: (k: string) => map.get(k) ?? null,
    key: (i: number) => Array.from(map.keys())[i] ?? null,
    removeItem: (k: string) => {
      map.delete(k);
    },
    setItem: (k: string, v: string) => {
      map.set(k, v);
    },
  } as Storage;
}

describe('repository', () => {
  let repo: Repository;
  let storage: Storage;
  beforeEach(() => {
    storage = memoryStorage();
    repo = createLocalStorageRepository(storage);
  });
  it('returns defaults / tolerates corrupt data', () => {
    expect(repo.getState().settings.windowTime).toBe('18:00');
    storage.setItem('ww-v1', 'nope');
    expect(repo.getState().worries).toEqual([]);
  });
  it('round-trips worries and settings', () => {
    repo.setWorries([{ id: 'a', txt: 'the meeting', at: 1 }]);
    repo.setSettings({ windowMin: 15 });
    expect(repo.getState().worries).toHaveLength(1);
    expect(repo.getState().settings.windowMin).toBe(15);
  });
});
