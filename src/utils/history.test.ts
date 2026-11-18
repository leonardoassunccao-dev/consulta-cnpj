import { beforeEach, describe, expect, it } from 'vitest';
import {
  clearAllLocalData,
  filterExpiredHistory,
  isPrivacyModeActive,
  setPrivacyMode,
  SEVEN_DAYS_MS,
  HISTORY_KEY,
  FAVORITES_KEY,
} from './history';

class MemoryStorage implements Storage {
  private store = new Map<string, string>();
  get length() {
    return this.store.size;
  }
  clear() {
    this.store.clear();
  }
  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }
  key(index: number): string | null {
    return Array.from(this.store.keys())[index] || null;
  }
  removeItem(key: string): void {
    this.store.delete(key);
  }
  setItem(key: string, value: string): void {
    this.store.set(key, String(value));
  }
}

describe('Local storage history and privacy mode utilities', () => {
  beforeEach(() => {
    (globalThis as any).localStorage = new MemoryStorage();
    (globalThis as any).sessionStorage = new MemoryStorage();
  });

  it('manages privacy mode state correctly', () => {
    expect(isPrivacyModeActive()).toBe(false);
    setPrivacyMode(true);
    expect(isPrivacyModeActive()).toBe(true);
    setPrivacyMode(false);
    expect(isPrivacyModeActive()).toBe(false);
  });

  it('automatically prunes history entries older than 7 days', () => {
    const now = Date.now();
    const freshItem = {
      razaoSocial: 'EMPRESA RECENTE',
      cnpj: '47960950000121',
      cidade: 'FRANCA',
      uf: 'SP',
      consultadoEm: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days old
    };
    const expiredItem = {
      razaoSocial: 'EMPRESA ANTIGA',
      cnpj: '00000000000191',
      cidade: 'BRASILIA',
      uf: 'DF',
      consultadoEm: new Date(now - 8 * 24 * 60 * 60 * 1000).toISOString(), // 8 days old
    };

    const result = filterExpiredHistory([freshItem, expiredItem]);
    expect(result.length).toBe(1);
    expect(result[0].cnpj).toBe('47960950000121');
  });

  it('clears all local data when requested', () => {
    localStorage.setItem(HISTORY_KEY, '[]');
    localStorage.setItem(FAVORITES_KEY, '[]');
    clearAllLocalData();
    expect(localStorage.getItem(HISTORY_KEY)).toBeNull();
    expect(localStorage.getItem(FAVORITES_KEY)).toBeNull();
  });
});
