// for redis
export function secondsUntilNextUTCMidnight(): number {
  const now = new Date();
  const utcHours = now.getUTCHours();
  const utcMinutes = now.getUTCMinutes();
  const utcSeconds = now.getUTCSeconds();
  const secondsSoFar = utcHours * 3600 + utcMinutes * 60 + utcSeconds;
  const secondsPerDay = 24 * 3600;
  return secondsPerDay - secondsSoFar;
}
