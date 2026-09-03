import { describe, expect, it } from 'vitest';
import { formatFullAddress, normalizeStreetType } from './address';

describe('normalizeStreetType', () => {
  it.each([
    ['AV', { code: 'AV', name: 'Avenida' }],
    ['AV.', { code: 'AV', name: 'Avenida' }],
    ['AVENIDA', { code: 'AV', name: 'Avenida' }],
    ['R.', { code: 'R', name: 'Rua' }],
    ['RODOVIA', { code: 'ROD', name: 'Rodovia' }],
    ['TV', { code: 'TV', name: 'Travessa' }],
    ['AL.', { code: 'AL', name: 'Alameda' }],
    ['PÇ', { code: 'PÇA', name: 'Praça' }],
    ['PÇA', { code: 'PÇA', name: 'Praça' }],
    ['LGO', { code: 'LGO', name: 'Largo' }],
    ['VL', { code: 'VL', name: 'Viela' }],
  ])('normalizes %s', (input, expected) => {
    expect(normalizeStreetType(input)).toEqual(expected);
  });

  it('does not infer a missing type from the street name', () => {
    expect(normalizeStreetType(null)).toBeNull();
  });
});

describe('formatFullAddress', () => {
  it('formats only available fields without placeholder pollution', () => {
    expect(formatFullAddress({
      streetType: 'AVENIDA', street: 'JOSE BENEDITO MIGUEL DE PAULA', number: '123',
      district: 'CENTRO', city: 'Quirinópolis', state: 'GO', postalCode: '75860-000',
    })).toBe('Avenida JOSE BENEDITO MIGUEL DE PAULA, 123\nBairro CENTRO\nQuirinópolis - GO\nCEP 75860-000');
  });

  it('supports missing number, complement and postal code', () => {
    expect(formatFullAddress({ streetType: 'R', street: 'DAS FLORES', city: 'Goiânia', state: 'GO' }))
      .toBe('Rua DAS FLORES\nGoiânia - GO');
  });
});
