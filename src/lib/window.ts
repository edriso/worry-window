/*
 * Pure worry-window maths. The window opens at the set time and stays available
 * for an hour after it (so a missed 18:00 is still reachable at 18:40). The
 * "parked … ago" label is derived from the worry's timestamp.
 */
export function isWindowOpen(windowTime: string, windowMin: number, now: Date): boolean {
  const [hours, minutes] = windowTime.split(':').map(Number);
  const start = new Date(now);
  start.setHours(hours, minutes, 0, 0);
  const minsSinceStart = (now.getTime() - start.getTime()) / 60000;
  return now.getTime() >= start.getTime() && minsSinceStart < windowMin + 60;
}

export function formatAgo(at: number, now: number): string {
  const mins = Math.floor((now - at) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}
