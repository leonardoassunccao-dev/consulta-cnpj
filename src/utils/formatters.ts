/**
 * Utility functions for formatting various data types in Brazilian Portuguese.
 */

/**
 * Handle null, undefined, or empty values, returning a default placeholder.
 */
export function formatFallback(value: any, placeholder: string = 'Não informado'): string {
  if (value === null || value === undefined || value === '') {
    return placeholder;
  }
  return String(value);
}

/**
 * Format CNPJ: 00.000.000/0000-00
 */
export function formatCNPJ(cnpj: string | null | undefined): string {
  if (!cnpj) return 'Não informado';
  const clean = cnpj.replace(/\D/g, '');
  if (clean.length !== 14) return cnpj;
  return clean.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}

/**
 * Format CPF: 000.000.000-00
 */
export function formatCPF(cpf: string | null | undefined): string {
  if (!cpf) return 'Não informado';
  const clean = cpf.replace(/\D/g, '');
  if (clean.length !== 11) return cpf;
  return clean.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
}

/**
 * Format CEP: 00000-000
 */
export function formatCEP(cep: string | null | undefined): string {
  if (!cep) return 'Não informado';
  const clean = cep.replace(/\D/g, '');
  if (clean.length !== 8) return cep;
  return clean.replace(/^(\d{5})(\d{3})$/, '$1-$2');
}

/**
 * Format Phone: (00) 0000-0000 or (00) 00000-0000
 */
export function formatPhone(ddd: string | null | undefined, phone: string | null | undefined): string {
  if (!phone) return 'Não informado';
  const cleanDDD = ddd ? ddd.replace(/\D/g, '') : '';
  const cleanPhone = phone.replace(/\D/g, '');
  
  const formattedPhone = cleanPhone.length === 9
    ? cleanPhone.replace(/^(\d{5})(\d{4})$/, '$1-$2')
    : cleanPhone.replace(/^(\d{4})(\d{4})$/, '$1-$2');

  if (cleanDDD) {
    return `(${cleanDDD}) ${formattedPhone}`;
  }
  return formattedPhone;
}

/**
 * Format YYYY-MM-DD or standard ISO date string to DD/MM/YYYY
 */
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return 'Não informado';
  
  // Test if matches YYYY-MM-DD
  const regexYMD = /^(\d{4})-(\d{2})-(\d{2})/;
  if (regexYMD.test(dateStr)) {
    return dateStr.replace(regexYMD, '$3/$2/$1');
  }

  // Attempt to parse standard date
  try {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    }
  } catch (e) {
    // Ignore and fallback
  }

  return dateStr;
}

/**
 * Format number to Brazilian Real (R$): R$ 1.000,00
 */
export function formatCurrency(amount: number | string | null | undefined): string {
  if (amount === null || amount === undefined || amount === '') return 'Não informado';
  const val = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(val)) return String(amount);
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(val);
}

/**
 * Format percent string or number: 12,50%
 */
export function formatPercent(percent: number | string | null | undefined): string {
  if (percent === null || percent === undefined || percent === '') return 'Não informado';
  const val = typeof percent === 'string' ? parseFloat(percent) : percent;
  if (isNaN(val)) return String(percent);
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val) + '%';
}

/**
 * Format boolean to Sim / Não
 */
export function formatBoolean(val: boolean | string | null | undefined): string {
  if (val === null || val === undefined) return 'Não informado';
  if (typeof val === 'string') {
    const lowercase = val.toLowerCase();
    if (lowercase === 'sim' || lowercase === 'true' || lowercase === 't' || lowercase === '1' || lowercase === 's') return 'Sim';
    return 'Não';
  }
  return val ? 'Sim' : 'Não';
}
