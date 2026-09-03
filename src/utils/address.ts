export interface StreetType {
  code: string;
  name: string;
}

const STREET_TYPES: Record<string, StreetType> = {
  AC: { code: 'AC', name: 'Acesso' },
  AL: { code: 'AL', name: 'Alameda' },
  ALAMEDA: { code: 'AL', name: 'Alameda' },
  AREA: { code: 'AREA', name: 'Área' },
  AV: { code: 'AV', name: 'Avenida' },
  AVENIDA: { code: 'AV', name: 'Avenida' },
  BC: { code: 'BC', name: 'Beco' },
  BECO: { code: 'BC', name: 'Beco' },
  CAM: { code: 'CAM', name: 'Caminho' },
  CAMINHO: { code: 'CAM', name: 'Caminho' },
  CJ: { code: 'CJ', name: 'Conjunto' },
  CONJUNTO: { code: 'CJ', name: 'Conjunto' },
  DIST: { code: 'DIST', name: 'Distrito' },
  DISTRITO: { code: 'DIST', name: 'Distrito' },
  EST: { code: 'EST', name: 'Estrada' },
  ESTRADA: { code: 'EST', name: 'Estrada' },
  FAZENDA: { code: 'FAZ', name: 'Fazenda' },
  FAZ: { code: 'FAZ', name: 'Fazenda' },
  LADEIRA: { code: 'LD', name: 'Ladeira' },
  LD: { code: 'LD', name: 'Ladeira' },
  LGO: { code: 'LGO', name: 'Largo' },
  LARGO: { code: 'LGO', name: 'Largo' },
  PARQUE: { code: 'PQ', name: 'Parque' },
  PASSAGEM: { code: 'PSG', name: 'Passagem' },
  PC: { code: 'PÇA', name: 'Praça' },
  PCA: { code: 'PÇA', name: 'Praça' },
  PRACA: { code: 'PÇA', name: 'Praça' },
  PQ: { code: 'PQ', name: 'Parque' },
  PSG: { code: 'PSG', name: 'Passagem' },
  R: { code: 'R', name: 'Rua' },
  RUA: { code: 'R', name: 'Rua' },
  ROD: { code: 'ROD', name: 'Rodovia' },
  RODOVIA: { code: 'ROD', name: 'Rodovia' },
  SETOR: { code: 'ST', name: 'Setor' },
  SITIO: { code: 'SIT', name: 'Sítio' },
  SIT: { code: 'SIT', name: 'Sítio' },
  ST: { code: 'ST', name: 'Setor' },
  TV: { code: 'TV', name: 'Travessa' },
  TRAV: { code: 'TV', name: 'Travessa' },
  TRAVESSA: { code: 'TV', name: 'Travessa' },
  VIA: { code: 'VIA', name: 'Via' },
  VILA: { code: 'VLA', name: 'Vila' },
  VLA: { code: 'VLA', name: 'Vila' },
  VL: { code: 'VL', name: 'Viela' },
  VIELA: { code: 'VL', name: 'Viela' },
};

function normalizeKey(value: unknown): string {
  return String(value ?? '')
    .trim()
    .replace(/\.+$/g, '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
}

/** Normalizes only an explicit street type supplied by the data source. */
export function normalizeStreetType(value: unknown): StreetType | null {
  const raw = String(value ?? '').trim();
  if (!raw) return null;
  return STREET_TYPES[normalizeKey(raw)] ?? { code: raw.toUpperCase(), name: raw };
}

export interface AddressParts {
  streetType?: unknown;
  street?: unknown;
  number?: unknown;
  complement?: unknown;
  district?: unknown;
  city?: unknown;
  state?: unknown;
  postalCode?: unknown;
}

export function formatFullAddress(parts: AddressParts): string {
  const present = (value: unknown) => value !== null && value !== undefined && String(value).trim() !== '';
  const streetType = normalizeStreetType(parts.streetType)?.name;
  const streetLine = [streetType, present(parts.street) ? String(parts.street).trim() : ''].filter(Boolean).join(' ');
  const numberedStreet = [streetLine, present(parts.number) ? String(parts.number).trim() : ''].filter(Boolean).join(', ');
  const detailedStreet = [numberedStreet, present(parts.complement) ? String(parts.complement).trim() : ''].filter(Boolean).join(' - ');
  const cityState = [present(parts.city) ? String(parts.city).trim() : '', present(parts.state) ? String(parts.state).trim() : '']
    .filter(Boolean)
    .join(' - ');
  const lines = [detailedStreet, present(parts.district) ? `Bairro ${String(parts.district).trim()}` : '', cityState];
  if (present(parts.postalCode)) lines.push(`CEP ${String(parts.postalCode).trim()}`);
  return lines.filter(Boolean).join('\n') || 'Não informado';
}
