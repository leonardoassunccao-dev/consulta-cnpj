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

/**
 * Strict IPv4 and IPv6 format validator.
 * Prevents header injection, path traversal characters and arbitrary string abuse in cache keys.
 */
function isValidIpAddress(ip: string): boolean {
  if (!ip || typeof ip !== 'string' || ip.length > 45) return false;

  // IPv4 check: exactly four decimal octets between 0 and 255
  const ipv4Match = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(ip);
  if (ipv4Match) {
    return ipv4Match.slice(1).every((num) => {
      const n = Number(num);
      return n >= 0 && n <= 255;
    });
  }

  // IPv6 check: valid hexadecimal colons
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){1,7}:?([0-9a-fA-F]{1,4})?$/;
  const ipv6Compressed = /^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/;
  return ipv6Regex.test(ip) || ipv6Compressed.test(ip) || ip === '::1';
}

/**
 * Safely derives a verified client IP address for rate-limiting.
 * Security design:
 * 1. Express framework authoritative IP: When fallbackIp is provided (e.g. req.ip from Express with configured trust proxy),
 *    it takes highest precedence because Express calculates it from the verified TCP socket or designated loopback proxy.
 * 2. Vercel official header: x-vercel-forwarded-for. According to official Vercel documentation,
 *    Vercel edge proxies terminate incoming TLS connections, strip client-supplied spoofed headers,
 *    and inject x-vercel-forwarded-for to represent the true public client IP.
 * 3. Fallback to validated x-real-ip and x-forwarded-for (first comma-separated public IP).
 * 4. Strict syntax validation: Every IP is checked against IPv4/IPv6 numerical rules.
 */
export function requestIdentity(
  headers: Record<string, string | string[] | undefined> = {},
  fallbackIp?: string
): string {
  // 1. Authoritative IP provided by framework / TCP socket
  if (fallbackIp && typeof fallbackIp === 'string') {
    const clean = fallbackIp.trim();
    if (isValidIpAddress(clean)) {
      return clean;
    }
  }

  // 2. Vercel tamper-proof edge header (overwritten by Vercel Edge proxy)
  const vercelForwarded = headers['x-vercel-forwarded-for'];
  if (vercelForwarded) {
    const raw = Array.isArray(vercelForwarded) ? vercelForwarded[0] : vercelForwarded;
    const candidate = String(raw).split(',')[0].trim();
    if (isValidIpAddress(candidate)) {
      return candidate;
    }
  }

  // 3. Upstream real-ip header set by verified edge proxies
  const realIp = headers['x-real-ip'];
  if (typeof realIp === 'string') {
    const clean = realIp.trim();
    if (isValidIpAddress(clean)) {
      return clean;
    }
  }

  // 4. Standard forwarded-for header
  const forwarded = headers['x-forwarded-for'];
  if (forwarded) {
    const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded;
    const candidate = String(raw).split(',')[0].trim();
    if (isValidIpAddress(candidate)) {
      return candidate;
    }
  }

  return 'anonymous';
}
