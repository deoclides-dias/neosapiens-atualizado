// src/lib/jornada.ts
// A Primeira Jornada: o que a pessoa já leu, o compromisso assinado e as renovações
// diárias. Fica em user_metadata.jornada, como os termos e o Santuário.

export const JORNADA_VERSION = '2026-11-11';

export interface JornadaMeta {
  saber?: { em: string; version: string };
  compromisso?: { texto: string; em: string; version: string };
  renovacoes?: string[]; // datas YYYY-MM-DD (fuso local)
  sessoes?: SessaoLog[];
}

export interface SessaoLog {
  dia: number;
  data: string; // YYYY-MM-DD (fuso local)
  antes: number;
  depois: number | null; // null = começou a sessão e não registrou o depois (dormiu, por exemplo)
}

export interface Sessao {
  dia: number;
  titulo: string;
  resumo: string;
  audio: string | null; // null = ainda em gravação
  minutos: number;
}

export const SESSOES: Sessao[] = [
  { dia: 1, titulo: 'O veleiro', resumo: 'Relaxamento profundo no convés de um veleiro ancorado.', audio: '/audio/primeira-jornada-dia-1.mp3', minutos: 15 },
  { dia: 2, titulo: 'Mais fundo', resumo: 'O mesmo veleiro, à noite, um pouco mais fundo e mais depressa.', audio: '/audio/primeira-jornada-dia-2.mp3', minutos: 10 },
  { dia: 3, titulo: 'A chave', resumo: 'O gesto dos dedos ganha um nome: a chave do relaxamento.', audio: '/audio/primeira-jornada-dia-3.mp3', minutos: 9 },
  { dia: 4, titulo: 'O Santuário', resumo: 'Você cria o seu lugar seguro.', audio: null, minutos: 18 },
  { dia: 5, titulo: 'Chegar mais rápido', resumo: 'A chave leva você ao Santuário em poucos minutos.', audio: null, minutos: 14 },
  { dia: 6, titulo: 'Alguém se anuncia', resumo: 'Um encontro marcado para o dia seguinte.', audio: null, minutos: 14 },
  { dia: 7, titulo: 'O Palácio', resumo: 'Juntos, vocês começam o seu Palácio Mental.', audio: null, minutos: 20 }
];

export type SessaoStatus = 'feita' | 'aberta' | 'amanha' | 'gravacao' | 'fechada';

/** Dia 1 sempre abre; o dia N abre no dia seguinte ao da sessão N-1. */
export function sessaoStatus(j: JornadaMeta, dia: number, hoje = today()): SessaoStatus {
  const logs = j.sessoes ?? [];
  if (logs.some((l) => l.dia === dia)) return 'feita';
  const s = SESSOES.find((x) => x.dia === dia);
  if (dia > 1) {
    const prev = logs.filter((l) => l.dia === dia - 1).map((l) => l.data).sort()[0];
    if (!prev) return 'fechada';
    if (prev >= hoje) return 'amanha';
  }
  return s?.audio ? 'aberta' : 'gravacao';
}

export const COMPROMISSO_FRASES = [
  'Durante os próximos sete dias, eu me comprometo a praticar, integralmente, o rumo que escolhi na minha Carta ao Navegante.',
  'Eu me comprometo a fazer uma sessão guiada por dia, num lugar tranquilo, e nunca enquanto dirijo ou opero máquinas.',
  'Eu me comprometo a registrar, todos os dias, o que fiz e como me senti no meu Diário de Bordo.',
  'Eu sei que a Primeira Jornada é uma forma de autoconhecimento, não um tratamento, e que posso pausar quando precisar.',
  'Eu sei que nada nem ninguém me define, e que é o meu propósito que me guia.'
];

export const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export const jornadaFrom = (meta: any): JornadaMeta => (meta && typeof meta.jornada === 'object' && meta.jornada ? meta.jornada : {});

/** "eu concordo", sem diferença de maiúsculas, acentos, espaços ou pontuação */
export const isAgreement = (t: string) =>
  t
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z ]/g, '')
    .replace(/\s+/g, ' ')
    .trim() === 'eu concordo';

export const renewedToday = (j: JornadaMeta) => Boolean(j.renovacoes?.includes(today()));
