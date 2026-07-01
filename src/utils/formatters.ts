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
export function formatCNPJ(cnpj: any): string {
  if (cnpj === null || cnpj === undefined || cnpj === '') return 'Não informado';
  try {
    const str = String(cnpj);
    const clean = str.replace(/\D/g, '');
    if (clean.length !== 14) return str;
    return clean.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
  } catch (e) {
    return String(cnpj);
  }
}

/**
 * Format CPF: 000.000.000-00
 */
export function formatCPF(cpf: any): string {
  if (cpf === null || cpf === undefined || cpf === '') return 'Não informado';
  try {
    const str = String(cpf);
    const clean = str.replace(/\D/g, '');
    if (clean.length !== 11) return str;
    return clean.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  } catch (e) {
    return String(cpf);
  }
}

/**
 * Format CEP: 00000-000
 */
export function formatCEP(cep: any): string {
  if (cep === null || cep === undefined || cep === '') return 'Não informado';
  try {
    const str = String(cep);
    const clean = str.replace(/\D/g, '');
    if (clean.length !== 8) return str;
    return clean.replace(/^(\d{5})(\d{3})$/, '$1-$2');
  } catch (e) {
    return String(cep);
  }
}

/**
 * Format Phone: (00) 0000-0000 or (00) 00000-0000
 */
export function formatPhone(ddd: any, phone: any): string {
  if (!phone) return 'Não informado';
  try {
    const cleanDDD = ddd ? String(ddd).replace(/\D/g, '') : '';
    const cleanPhone = String(phone).replace(/\D/g, '');
    
    const formattedPhone = cleanPhone.length === 9
      ? cleanPhone.replace(/^(\d{5})(\d{4})$/, '$1-$2')
      : cleanPhone.replace(/^(\d{4})(\d{4})$/, '$1-$2');

    if (cleanDDD) {
      return `(${cleanDDD}) ${formattedPhone}`;
    }
    return formattedPhone;
  } catch (e) {
    return String(phone);
  }
}

/**
 * Format YYYY-MM-DD or standard ISO date string to DD/MM/YYYY
 */
export function formatDate(dateStr: any): string {
  if (dateStr === null || dateStr === undefined || dateStr === '') return 'Não informado';
  
  try {
    const str = String(dateStr);
    // Test if matches YYYY-MM-DD
    const regexYMD = /^(\d{4})-(\d{2})-(\d{2})/;
    if (regexYMD.test(str)) {
      return str.replace(regexYMD, '$3/$2/$1');
    }

    // Attempt to parse standard date
    const d = new Date(str);
    if (!isNaN(d.getTime())) {
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    }
  } catch (e) {
    // Ignore and fallback
  }

  return String(dateStr);
}

/**
 * Format number to Brazilian Real (R$): R$ 1.000,00
 */
export function formatCurrency(amount: any): string {
  if (amount === null || amount === undefined || amount === '') return 'Não informado';
  try {
    const val = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
    if (isNaN(val)) return String(amount);
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(val);
  } catch (e) {
    return String(amount);
  }
}

/**
 * Format percent string or number: 12,50%
 */
export function formatPercent(percent: any): string {
  if (percent === null || percent === undefined || percent === '') return 'Não informado';
  try {
    const val = typeof percent === 'string' ? parseFloat(percent) : Number(percent);
    if (isNaN(val)) return String(percent);
    return new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val) + '%';
  } catch (e) {
    return String(percent) + '%';
  }
}

/**
 * Format boolean to Sim / Não
 */
export function formatBoolean(val: any): string {
  if (val === null || val === undefined || val === '') return 'Não informado';
  try {
    if (typeof val === 'string') {
      const lowercase = val.toLowerCase();
      if (lowercase === 'sim' || lowercase === 'true' || lowercase === 't' || lowercase === '1' || lowercase === 's') return 'Sim';
      return 'Não';
    }
    return val ? 'Sim' : 'Não';
  } catch (e) {
    return val ? 'Sim' : 'Não';
  }
}
