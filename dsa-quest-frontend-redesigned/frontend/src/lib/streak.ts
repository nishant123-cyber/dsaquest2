const LOG_KEY = "dsaquest_visit_log"; // array of "YYYY-MM-DD" strings, most recent last

function todayStr(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const ms = new Date(b).getTime() - new Date(a).getTime();
  return Math.round(ms / 86400000);
}

/**
 * Records today's visit (if not already recorded) and returns the current
 * streak length. This is tracked locally in the browser — the backend has
 * no streak field, so this is an intentional frontend-only placeholder
 * rather than a synced, account-wide streak.
 */
export function recordVisitAndGetStreak(): number {
  const raw = localStorage.getItem(LOG_KEY);
  const log: string[] = raw ? JSON.parse(raw) : [];
  const today = todayStr();

  if (log[log.length - 1] !== today) {
    log.push(today);
    localStorage.setItem(LOG_KEY, JSON.stringify(log.slice(-60)));
  }

  let streak = 1;
  for (let i = log.length - 1; i > 0; i--) {
    const gap = daysBetween(log[i - 1], log[i]);
    if (gap === 1) streak++;
    else if (gap === 0) continue;
    else break;
  }
  return streak;
}
