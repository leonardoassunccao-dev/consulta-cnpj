export type CompanyStatus = 'ATIVA' | 'SUSPENSA' | 'INAPTA' | 'BAIXADA' | 'OUTRA';

export interface CompanySummary {
  cnpj: string;
  razaoSocial: string;
  nomeFantasia?: string;
  status: CompanyStatus;
  city?: string;
  uf?: string;
  porte?: string;
  matrizFilial?: 'MATRIZ' | 'FILIAL';
  cnaePrincipal?: string;
  dataAbertura?: string;
  capitalSocial?: number;
}

export interface CompanyFilters {
  uf?: string;
  city?: string;
  status?: string;
  porte?: string;
  branchType?: string;
  cnae?: string;
  openedFrom?: string;
  openedTo?: string;
  capitalMin?: string;
  capitalMax?: string;
}

export interface CompanySearchResponse {
  data: CompanySummary[];
  page: number;
  pageSize: number;
  hasMore: boolean;
  source: 'commercial' | 'fallback';
  notice?: string;
}
