import { formatDate, formatFallback } from './formatters';

export type CompatibilityLevel = 'Alta' | 'Parcial' | 'Não identificada';

export interface CompanyView {
  cnpj: string;
  legalName: string;
  tradeName: string;
  status: string;
  openedAt: string | null;
  city: string;
  state: string;
  size: string;
  capital: unknown;
  primaryActivity: { code: string; description: string } | null;
  secondaryActivities: Array<{ code: string; description: string }>;
  partnersCount: number | null;
}

export function companyView(data: any): CompanyView {
  const establishment = data?.estabelecimento ?? {};
  const primary = establishment?.atividade_principal;
  const secondary = Array.isArray(establishment?.atividades_secundarias) ? establishment.atividades_secundarias : [];
  const partners = Array.isArray(data?.socios) ? data.socios : Array.isArray(data?.quadro_societario) ? data.quadro_societario : null;
  return {
    cnpj: String(establishment?.cnpj ?? data?.cnpj ?? '').replace(/\D/g, ''),
    legalName: formatFallback(data?.razao_social),
    tradeName: formatFallback(establishment?.nome_fantasia, 'Sem nome fantasia'),
    status: formatFallback(establishment?.situacao_cadastral, 'Não disponível').toUpperCase(),
    openedAt: establishment?.data_inicio_atividade ?? null,
    city: formatFallback(establishment?.cidade?.nome),
    state: formatFallback(establishment?.estado?.sigla ?? establishment?.uf),
    size: formatFallback(data?.porte?.descricao),
    capital: data?.capital_social,
    primaryActivity: primary?.descricao ? { code: String(primary.id ?? ''), description: String(primary.descricao) } : null,
    secondaryActivities: secondary.filter((item: any) => item?.descricao).map((item: any) => ({ code: String(item.id ?? ''), description: String(item.descricao) })),
    partnersCount: partners ? partners.length : null,
  };
}

export function activityDuration(openedAt: string | null, now = new Date()): string {
  if (!openedAt) return 'Informação não disponível na fonte consultada.';
  const date = new Date(`${openedAt}T12:00:00`);
  if (Number.isNaN(date.getTime()) || date > now) return 'Informação não disponível na fonte consultada.';
  let months = (now.getFullYear() - date.getFullYear()) * 12 + now.getMonth() - date.getMonth();
  if (now.getDate() < date.getDate()) months -= 1;
  const years = Math.floor(months / 12);
  months %= 12;
  return `${years} ${years === 1 ? 'ano' : 'anos'}${months ? ` e ${months} ${months === 1 ? 'mês' : 'meses'}` : ''} de atividade`;
}

export function companySummary(view: CompanyView): string {
  const parts = [`A empresa consta como ${view.status.toLowerCase()}`];
  if (view.openedAt) parts.push(`desde ${formatDate(view.openedAt)}`);
  if (view.city !== 'Não informado' && view.state !== 'Não informado') parts.push(`com sede em ${view.city}/${view.state}`);
  if (view.primaryActivity) parts.push(`e atividade principal em ${view.primaryActivity.description.toLowerCase()}`);
  return `${parts.join(', ')}. Este resumo usa somente dados disponíveis na consulta.`;
}

export function attentionPoints(view: CompanyView): string[] {
  const points: string[] = [];
  if (view.status !== 'ATIVA') points.push(`A fonte informa situação cadastral “${view.status}”. Verifique o contexto antes de seguir.`);
  if (!view.primaryActivity) points.push('A fonte consultada não informou atividade econômica principal.');
  if (!view.openedAt) points.push('A fonte consultada não informou a data de início da atividade.');
  return points;
}

const STOP_WORDS = new Set(['de','da','do','das','dos','e','em','para','por','com','servico','serviços','atividade','atividades','empresa','empresas']);
const tokens = (value: string) => value.toLocaleLowerCase('pt-BR').normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(/[^a-z0-9]+/).filter(token => token.length > 2 && !STOP_WORDS.has(token));

export function assessCompatibility(data: any, expectedService: string): { level: CompatibilityLevel; explanation: string } {
  const view = companyView(data);
  const serviceTokens = tokens(expectedService);
  const activities = [view.primaryActivity, ...view.secondaryActivities].filter(Boolean) as Array<{ code: string; description: string }>;
  if (!expectedService.trim() || !activities.length) return { level: 'Não identificada', explanation: 'Não há informação suficiente para comparar o serviço informado com as atividades disponíveis.' };
  const matches = activities.filter(activity => serviceTokens.some(token => tokens(activity.description).includes(token)));
  if (matches.length) {
    const primaryMatch = view.primaryActivity && matches.some(item => item.code === view.primaryActivity?.code);
    return { level: primaryMatch ? 'Alta' : 'Parcial', explanation: `As atividades cadastradas incluem “${matches[0].description}”, com correspondência ${primaryMatch ? 'direta' : 'parcial'} ao serviço informado.` };
  }
  return { level: 'Não identificada', explanation: 'Não foi encontrada, entre as atividades econômicas disponíveis, uma correspondência clara com o serviço informado. Recomenda-se verificação adicional.' };
}
