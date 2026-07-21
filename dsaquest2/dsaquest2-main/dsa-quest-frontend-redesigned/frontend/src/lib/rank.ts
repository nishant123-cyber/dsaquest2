/**
 * Rank and coins are derived entirely on the client from xp/level, the same
 * way lib/streak.ts derives a streak from local visit history. The backend
 * has no rank or coins fields — these are presentational placeholders until
 * a real ranking/economy system exists server-side, not synced or
 * competitive across accounts.
 */

const RANK_TITLES = [
  "Unranked",
  "Bronze Solver",
  "Silver Solver",
  "Gold Solver",
  "Platinum Solver",
  "Diamond Solver",
] as const;

export function getRankTitle(level: number): string {
  const idx = Math.min(Math.floor(level / 3), RANK_TITLES.length - 1);
  return RANK_TITLES[idx];
}

export function getCoins(xp: number): number {
  return Math.floor(xp / 5);
}
