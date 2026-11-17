import { describe, expect, it } from 'vitest';
import { allowRequest, requestIdentity } from './rateLimit';

describe('Zero-Trust Rate Limit and Identity Identification', () => {
  it('prioritizes authoritative framework/socket IP over any client-provided headers', () => {
    const headers = {
      'x-real-ip': '198.51.100.1',
      'x-vercel-forwarded-for': '203.0.113.195',
      'x-forwarded-for': '192.0.2.1',
    };
    // Express provides req.ip from TCP socket
    expect(requestIdentity(headers, '10.0.0.15')).toBe('10.0.0.15');
  });

  it('uses official x-vercel-forwarded-for when no socket IP is provided', () => {
    const headers = {
      'x-vercel-forwarded-for': '203.0.113.50',
      'x-forwarded-for': '198.51.100.2, 10.0.0.1',
    };
    expect(requestIdentity(headers)).toBe('203.0.113.50');
  });

  it('falls back to x-real-ip and x-forwarded-for when x-vercel-forwarded-for is absent', () => {
    expect(requestIdentity({ 'x-real-ip': '198.51.100.42' })).toBe('198.51.100.42');
    expect(requestIdentity({ 'x-forwarded-for': '198.51.100.99, 10.0.0.1' })).toBe('198.51.100.99');
  });

  it('validates IP format strictly, rejecting out-of-range octets and injection payloads', () => {
    expect(requestIdentity({ 'x-vercel-forwarded-for': '999.999.999.999' })).toBe('anonymous');
    expect(requestIdentity({ 'x-real-ip': '127.0.0.1; DROP TABLE' })).toBe('anonymous');
    expect(requestIdentity({ 'x-forwarded-for': '<script>alert(1)</script>' })).toBe('anonymous');
  });

  it('accepts valid IPv4 and IPv6 loopback addresses', () => {
    expect(requestIdentity({ 'x-vercel-forwarded-for': '127.0.0.1' })).toBe('127.0.0.1');
    expect(requestIdentity({ 'x-real-ip': '::1' })).toBe('::1');
  });

  it('correctly throttles requests beyond limit and allows within window', () => {
    const testKey = 'test-rate-limit-client-' + Date.now();
    expect(allowRequest(testKey, 2)).toBe(true);
    expect(allowRequest(testKey, 2)).toBe(true);
    expect(allowRequest(testKey, 2)).toBe(false);
  });
});
