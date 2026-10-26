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

/** Validates the two CNPJ check digits. Only numeric CNPJs are supported by the public provider. */
export function isValidCnpj(value: string): boolean {
  const digits = value.replace(/\D/g, '');
  if (!TRADITIONAL_CNPJ.test(digits) || /^(\d)\1{13}$/.test(digits)) return false;
  const calculate = (base: string, weights: number[]) => {
    const sum = base.split('').reduce((total, digit, index) => total + Number(digit) * weights[index], 0);
    const remainder = sum % 11;
    return remainder < 2 ? 0 : 11 - remainder;
  };
  const first = calculate(digits.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  const second = calculate(digits.slice(0, 12) + first, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  return digits.endsWith(`${first}${second}`);
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
