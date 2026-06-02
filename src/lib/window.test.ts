import { describe, expect, it } from 'vitest';
import { formatAgo, isWindowOpen } from './window';

describe('isWindowOpen', () => {
  it('is closed before the window time', () => {
    expect(isWindowOpen('18:00', 10, new Date(2026, 2, 10, 17, 30))).toBe(false);
  });
  it('is open at and just after the window time', () => {
    expect(isWindowOpen('18:00', 10, new Date(2026, 2, 10, 18, 0))).toBe(true);
    expect(isWindowOpen('18:00', 10, new Date(2026, 2, 10, 18, 40))).toBe(true);
  });
  it('closes once more than an hour past the window has elapsed', () => {
    // grace = windowMin + 60 = 70 min; 71 minutes after 18:00 → closed.
    expect(isWindowOpen('18:00', 10, new Date(2026, 2, 10, 19, 11))).toBe(false);
  });
});

describe('formatAgo', () => {
  const now = 10 * 60_000_000;
  it('formats minutes, hours, and days', () => {
    expect(formatAgo(now - 30_000, now)).toBe('just now');
    expect(formatAgo(now - 5 * 60_000, now)).toBe('5m ago');
    expect(formatAgo(now - 3 * 3600_000, now)).toBe('3h ago');
    expect(formatAgo(now - 2 * 24 * 3600_000, now)).toBe('2d ago');
  });
});
