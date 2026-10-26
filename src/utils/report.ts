import { jsPDF } from 'jspdf';
import { companySummary, companyView, activityDuration } from './companyAnalysis';
import { formatCNPJ, formatCurrency, formatDate } from './formatters';

const disclaimer = 'Este relatório possui caráter informativo e foi elaborado com base nas informações disponíveis nas fontes indicadas na data e horário da consulta. A CNPJ Premium não substitui análises jurídicas, contábeis, fiscais, financeiras ou de compliance, nem representa recomendação de contratação ou realização de negócios.';

export function downloadCompanyReport(data: any, consultedAt: string, hiring?: { purpose: string; service: string; level: string; explanation: string } | null) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const view = companyView(data); let y = 20;
  const add = (title: string, body: string) => { if (y > 265) { doc.addPage(); y = 20; } doc.setFont('helvetica','bold'); doc.setFontSize(11); doc.text(title, 18, y); y += 6; doc.setFont('helvetica','normal'); doc.setFontSize(9.5); const lines = doc.splitTextToSize(body, 174); doc.text(lines,18,y); y += lines.length * 5 + 7; };
  doc.setFillColor(9, 10, 15); doc.rect(0,0,210,32,'F'); doc.setTextColor(245,247,250); doc.setFont('helvetica','bold'); doc.setFontSize(18); doc.text('CNPJ Premium',18,16); doc.setFontSize(11); doc.text('Relatório de Análise Empresarial',18,24); doc.setTextColor(20,25,35); y=44;
  add('Identificação', `Razão social: ${view.legalName}\nNome fantasia: ${view.tradeName}\nCNPJ: ${formatCNPJ(view.cnpj)}\nSituação cadastral: ${view.status}`);
  add('Dados cadastrais', `Abertura: ${formatDate(view.openedAt)}\nTempo de atividade: ${activityDuration(view.openedAt)}\nSede: ${view.city}/${view.state}\nPorte: ${view.size}\nCapital social declarado: ${formatCurrency(view.capital)}`);
  add('Atividades econômicas', `CNAE principal: ${view.primaryActivity ? `${view.primaryActivity.code} — ${view.primaryActivity.description}` : 'Informação não disponível na fonte consultada.'}${view.secondaryActivities.length ? `\nCNAEs secundários: ${view.secondaryActivities.map(activity => `${activity.code} — ${activity.description}`).join('; ')}` : ''}`);
  add('Análise', companySummary(view));
  if (hiring) add('Análise para contratação', `Finalidade: ${hiring.purpose}\nServiço informado: ${hiring.service || 'Não informado'}\nCompatibilidade: ${hiring.level}\n${hiring.explanation}`);
  add('Fontes', `Dados cadastrais consultados por meio da CNPJ.ws, com base em dados públicos de CNPJ. Consulta realizada em ${new Intl.DateTimeFormat('pt-BR',{dateStyle:'short',timeStyle:'short'}).format(new Date(consultedAt))}.`);
  add('Aviso', disclaimer);
  doc.save(`cnpj-premium-${view.cnpj || 'relatorio'}.pdf`);
}
