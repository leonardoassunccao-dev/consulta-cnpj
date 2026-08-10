const buckets = new Map<string, { count: number; resetAt: number }>();
const MAX_BUCKETS = 5_000;

function sweepExpired(now: number) {
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
  while (buckets.size >= MAX_BUCKETS) {
    const oldestKey = buckets.keys().next().value;
    if (typeof oldestKey !== 'string') break;
    buckets.delete(oldestKey);
  }
}

export function allowRequest(key: string, limit: number, windowMs = 60_000): boolean {
  const now = Date.now();
  if (buckets.size >= MAX_BUCKETS) sweepExpired(now);
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (bucket.count >= limit) return false;
  bucket.count += 1;
  return true;
}

export function requestIdentity(headers: Record<string, string | string[] | undefined>): string {
  const forwarded = headers['x-real-ip'] || headers['x-forwarded-for'];
  return String(Array.isArray(forwarded) ? forwarded[0] : forwarded || 'anonymous').split(',')[0].trim().slice(0, 64);
}
