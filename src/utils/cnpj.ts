const TRADITIONAL_CNPJ = /^\d{14}$/;
const ALPHANUMERIC_CNPJ = /^[A-Z0-9]{12}\d{2}$/;

export function normalizeCnpj(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 14);
}

export function isTraditionalCnpj(value: string): boolean {
  return TRADITIONAL_CNPJ.test(normalizeCnpj(value));
}

export function isValidCnpjFormat(value: string): boolean {
  const normalized = normalizeCnpj(value);
  return TRADITIONAL_CNPJ.test(normalized) || ALPHANUMERIC_CNPJ.test(normalized);
}

export function detectSearchKind(value: string): 'cnpj' | 'text' | 'empty' {
  const trimmed = value.trim();
  if (!trimmed) return 'empty';
  return isValidCnpjFormat(trimmed) ? 'cnpj' : 'text';
}
