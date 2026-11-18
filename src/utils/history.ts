export interface HistoryItem {
  razaoSocial: string;
  cnpj: string;
  cidade: string;
  uf: string;
  consultadoEm: string;
}

export interface FavoriteItem {
  razaoSocial: string;
  cnpj: string;
  cidade: string;
  uf: string;
  favoritadoEm: string;
}

export const HISTORY_KEY = 'premium_cnpj_history';
export const FAVORITES_KEY = 'premium_cnpj_favorites';
export const PRIVACY_MODE_KEY = 'premium_cnpj_privacy_mode';
export const SESSION_KEY = 'premium_cnpj_last_result';

export const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export function isPrivacyModeActive(): boolean {
  try {
    return localStorage.getItem(PRIVACY_MODE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function setPrivacyMode(active: boolean): void {
  try {
    localStorage.setItem(PRIVACY_MODE_KEY, String(active));
    if (active) {
      sessionStorage.removeItem(SESSION_KEY);
    }
  } catch {}
}

/**
 * Filters out history items older than maxAgeMs (default: 7 days).
 * Preserves all fresh and valid items.
 */
export function filterExpiredHistory(items: any[], maxAgeMs = SEVEN_DAYS_MS): HistoryItem[] {
  if (!Array.isArray(items)) return [];
  const now = Date.now();
  return items.filter((item) => {
    if (!item || typeof item !== 'object' || !item.consultadoEm) return false;
    const itemTime = new Date(item.consultadoEm).getTime();
    if (isNaN(itemTime)) return false;
    return now - itemTime <= maxAgeMs;
  });
}

/**
 * Clears all user-associated cache from the local browser workstation.
 */
export function clearAllLocalData(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
    localStorage.removeItem(FAVORITES_KEY);
    sessionStorage.removeItem(SESSION_KEY);
  } catch {}
}
