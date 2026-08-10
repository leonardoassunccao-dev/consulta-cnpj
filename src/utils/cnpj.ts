const TRADITIONAL_CNPJ = /^\d{14}$/;
const ALPHANUMERIC_CNPJ = /^[A-Z0-9]{12}\d{2}$/;

export function normalizeCnpj(value: string): string {
  return value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 14);
}

export function formatCnpjInput(value: string): string {
  if (/[A-Za-z]/.test(value)) return normalizeCnpj(value);
  const digits = value.replace(/\D/g, '').slice(0, 14);
  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2');
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
