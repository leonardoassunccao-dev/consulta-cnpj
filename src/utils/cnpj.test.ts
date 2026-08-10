import { describe, expect, it } from 'vitest';
import { detectSearchKind, formatCnpjInput, isTraditionalCnpj, isValidCnpjFormat, normalizeCnpj } from './cnpj';

describe('CNPJ search input', () => {
  it('normalizes and detects a traditional CNPJ', () => {
    expect(normalizeCnpj('47.960.950/0001-21')).toBe('47960950000121');
    expect(isTraditionalCnpj('47.960.950/0001-21')).toBe(true);
    expect(detectSearchKind('47960950000121')).toBe('cnpj');
  });

  it('formats traditional CNPJ input progressively', () => {
    expect(formatCnpjInput('47960950000121')).toBe('47.960.950/0001-21');
    expect(formatCnpjInput('47.960.950/0001-21')).toBe('47.960.950/0001-21');
    expect(formatCnpjInput('47960')).toBe('47.960');
  });

  it('accepts the future alphanumeric format without breaking traditional values', () => {
    expect(isValidCnpjFormat('AB12CD34EF5601')).toBe(true);
    expect(detectSearchKind('AB12CD34EF5601')).toBe('cnpj');
  });

  it('classifies company names and rejects malformed identifiers', () => {
    expect(detectSearchKind('Magazine Luiza')).toBe('text');
    expect(isValidCnpjFormat('<script>alert(1)</script>')).toBe(false);
    expect(normalizeCnpj('A'.repeat(500))).toHaveLength(14);
  });
});
