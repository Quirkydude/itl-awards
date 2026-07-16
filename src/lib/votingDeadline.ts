/** Voting closes Jul 23, 2026 at 11:59 PM Ghana time (GMT). */
export const VOTING_ENDS_AT = new Date("2026-07-23T23:59:59+00:00");

export function isVotingOpen(now = new Date()) {
  return now.getTime() < VOTING_ENDS_AT.getTime();
}

export type CountdownParts = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  ended: boolean;
};

export function getCountdown(now = new Date()): CountdownParts {
  const totalMs = Math.max(0, VOTING_ENDS_AT.getTime() - now.getTime());
  const ended = totalMs <= 0;
  const days = Math.floor(totalMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((totalMs / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((totalMs / (1000 * 60)) % 60);
  const seconds = Math.floor((totalMs / 1000) % 60);
  return { days, hours, minutes, seconds, totalMs, ended };
}
