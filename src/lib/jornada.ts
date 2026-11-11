// src/lib/jornada.ts
// A Primeira Jornada: o que a pessoa já leu, o compromisso assinado e as renovações
// diárias. Fica em user_metadata.jornada, como os termos e o Santuário.

export const JORNADA_VERSION = '2026-11-11';

export interface JornadaMeta {
  saber?: { em: string; version: string };
  compromisso?: { texto: string; em: string; version: string };
  renovacoes?: string[]; // datas YYYY-MM-DD (fuso local)
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
