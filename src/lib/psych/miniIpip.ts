// src/lib/psych/miniIpip.ts
// Mini-IPIP (Donnellan, Oswald, Baird & Lucas, 2006): 20 itens do
// International Personality Item Pool, de domínio público. Tradução para o
// português feita pelo NeoSapiens (ainda não é uma versão brasileira validada).
// Inclui 2 itens de atenção e verificações de qualidade das respostas.

export type TraitId = 'E' | 'A' | 'C' | 'N' | 'I';

export interface Item {
  id: string;
  text: string;
  trait: TraitId | null; // null = item de atenção
  reversed?: boolean;
  /** Para itens de atenção: a resposta esperada */
  expected?: number;
}

export const SCALE = [
  { value: 1, label: 'Não tem nada a ver comigo' },
  { value: 2, label: 'Tem pouco a ver comigo' },
  { value: 3, label: 'Mais ou menos' },
  { value: 4, label: 'Tem a ver comigo' },
  { value: 5, label: 'Tem tudo a ver comigo' }
] as const;

// Ordem original do Mini-IPIP, com os itens de atenção intercalados
export const ITEMS: Item[] = [
  { id: 'e1', trait: 'E', text: 'Sou a alma da festa.' },
  { id: 'a1', trait: 'A', text: 'Me solidarizo com os sentimentos dos outros.' },
  { id: 'c1', trait: 'C', text: 'Faço as tarefas logo, sem deixar para depois.' },
  { id: 'n1', trait: 'N', text: 'Tenho mudanças de humor frequentes.' },
  { id: 'i1', trait: 'I', text: 'Tenho uma imaginação fértil.' },
  { id: 'e2', trait: 'E', text: 'Não falo muito.', reversed: true },
  { id: 'a2', trait: 'A', text: 'Não me interesso pelos problemas dos outros.', reversed: true },
  { id: 'at1', trait: null, expected: 5, text: 'Para mostrar que está lendo com atenção, escolha “Tem tudo a ver comigo” nesta frase.' },
  { id: 'c2', trait: 'C', text: 'Muitas vezes esqueço de guardar as coisas no lugar.', reversed: true },
  { id: 'n2', trait: 'N', text: 'Fico tranquilo(a) na maior parte do tempo.', reversed: true },
  { id: 'i2', trait: 'I', text: 'Não me interesso por ideias abstratas.', reversed: true },
  { id: 'e3', trait: 'E', text: 'Nas festas, converso com muitas pessoas diferentes.' },
  { id: 'a3', trait: 'A', text: 'Sinto as emoções dos outros.' },
  { id: 'c3', trait: 'C', text: 'Gosto de ordem.' },
  { id: 'n3', trait: 'N', text: 'Fico chateado(a) com facilidade.' },
  { id: 'i3', trait: 'I', text: 'Tenho dificuldade para entender ideias abstratas.', reversed: true },
  { id: 'at2', trait: null, expected: 1, text: 'Nesta frase, escolha “Não tem nada a ver comigo”.' },
  { id: 'e4', trait: 'E', text: 'Prefiro ficar em segundo plano.', reversed: true },
  { id: 'a4', trait: 'A', text: 'Não me interesso muito pelas outras pessoas.', reversed: true },
  { id: 'c4', trait: 'C', text: 'Costumo bagunçar as coisas.', reversed: true },
  { id: 'n4', trait: 'N', text: 'Raramente me sinto para baixo.', reversed: true },
  { id: 'i4', trait: 'I', text: 'Não tenho uma boa imaginação.', reversed: true }
];

export const TRAIT_ITEMS = ITEMS.filter((i) => i.trait);

export interface TraitInfo {
  id: TraitId;
  name: string;
  /** Nome no modelo dos Cinco Grandes Fatores */
  technical: string;
  color: string;
  /** Mostrado invertido: Estabilidade emocional = 100 − Neuroticismo */
  inverted?: boolean;
  low: string;
  mid: string;
  high: string;
}

// Ordem de exibição
export const TRAITS: TraitInfo[] = [
  {
    id: 'I', name: 'Abertura', technical: 'Intelecto / Imaginação', color: '#7c3aed',
    low: 'Você tende a preferir o concreto e o já conhecido às ideias abstratas. Costuma ir direto ao que funciona.',
    mid: 'Você transita entre o prático e o imaginativo: aprecia ideias novas quando elas têm alguma utilidade.',
    high: 'Você tende a se interessar por ideias abstratas e possibilidades. A imaginação é uma ferramenta que você usa com frequência.'
  },
  {
    id: 'C', name: 'Organização', technical: 'Conscienciosidade', color: '#2563eb',
    low: 'Você tende a funcionar com mais flexibilidade do que rotina. Ordem e prazos pesam menos no seu dia a dia.',
    mid: 'Você mantém alguma ordem, mas sem rigidez: organiza o que importa e deixa o resto correr.',
    high: 'Você tende a gostar de ordem e a resolver as tarefas logo. Previsibilidade costuma ajudar você a render.'
  },
  {
    id: 'E', name: 'Extroversão', technical: 'Extroversão', color: '#ea580c',
    low: 'Você tende a ser mais reservado(a) e a preferir poucas conversas, mais próximas. Grupos grandes cansam mais do que animam.',
    mid: 'Você se adapta: aproveita a convivência, mas também precisa de momentos mais quietos.',
    high: 'Você tende a buscar gente e conversa. Ambientes sociais costumam dar energia, em vez de tirar.'
  },
  {
    id: 'A', name: 'Amabilidade', technical: 'Amabilidade', color: '#059669',
    low: 'Você tende a ser mais direto(a) e a olhar primeiro para os fatos do que para os sentimentos envolvidos.',
    mid: 'Você equilibra empatia e objetividade: se importa com os outros sem deixar de lado o próprio ponto de vista.',
    high: 'Você tende a perceber e a sentir as emoções dos outros. Cuidar das relações é algo natural para você.'
  },
  {
    id: 'N', name: 'Estabilidade emocional', technical: 'Neuroticismo (invertido)', color: '#0891b2', inverted: true,
    low: 'Você tende a sentir as emoções com intensidade e a variar de humor. Isso também costuma trazer sensibilidade ao que acontece ao redor.',
    mid: 'Você tem dias de mais oscilação e dias de mais calma, sem que um dos lados predomine.',
    high: 'Você tende a se manter calmo(a) e a se recuperar rápido dos aborrecimentos.'
  }
];

export type Answers = Record<string, number>;
export type Timings = Record<string, number>; // ms até responder cada item

export interface TraitScore {
  id: TraitId;
  /** Média de 1 a 5, já com os itens invertidos corrigidos (direção do traço exibido) */
  mean: number;
  /** 0 a 100 (POMP: porcentagem do máximo possível) */
  score: number;
  low: number;
  high: number;
  band: 'baixo' | 'intermediario' | 'alto';
  /** Cada item com a resposta e o valor usado na conta */
  items: { id: string; text: string; answer: number; reversed: boolean; used: number }[];
}

/**
 * Margem aproximada de ±11 pontos: erro padrão de medida com fidedignidade
 * ~0,70 (escalas de 4 itens do Mini-IPIP ficam entre 0,6 e 0,8 nos estudos)
 * e desvio-padrão de ~20 pontos na escala 0–100.
 */
export const MARGIN = 11;

const round1 = (n: number) => Math.round(n * 10) / 10;

export function scoreTraits(answers: Answers): TraitScore[] {
  return TRAITS.map((t) => {
    const items = TRAIT_ITEMS.filter((i) => i.trait === t.id).map((i) => {
      const answer = answers[i.id];
      // Valor na direção do traço técnico (ex.: Neuroticismo)
      let used = i.reversed ? 6 - answer : answer;
      // Estabilidade emocional é o Neuroticismo invertido
      if (t.inverted) used = 6 - used;
      return { id: i.id, text: i.text, answer, reversed: Boolean(i.reversed) !== Boolean(t.inverted), used };
    });
    const mean = items.reduce((s, i) => s + i.used, 0) / items.length;
    const score = Math.round(((mean - 1) / 4) * 100);
    const band = score <= 35 ? 'baixo' : score >= 65 ? 'alto' : 'intermediario';
    return {
      id: t.id,
      mean: round1(mean),
      score,
      low: Math.max(0, score - MARGIN),
      high: Math.min(100, score + MARGIN),
      band,
      items
    };
  });
}

export interface QualityCheck {
  id: 'atencao' | 'repeticao' | 'rapidez' | 'contradicao';
  ok: boolean;
  label: string;
  detail: string;
}

export interface QualityReport {
  status: 'ok' | 'atencao' | 'invalido';
  checks: QualityCheck[];
}

const median = (xs: number[]) => {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};

export function checkQuality(answers: Answers, timings: Timings): QualityReport {
  // 1. Itens de atenção
  const attention = ITEMS.filter((i) => i.trait === null);
  const attentionMisses = attention.filter((i) => Math.abs((answers[i.id] ?? 0) - (i.expected ?? 0)) > 1).length;

  // 2. Mesma resposta repetida
  const values = TRAIT_ITEMS.map((i) => answers[i.id]);
  const counts = values.reduce<Record<number, number>>((acc, v) => ({ ...acc, [v]: (acc[v] ?? 0) + 1 }), {});
  const maxSame = Math.max(...Object.values(counts));

  // 3. Rapidez: mediana do tempo por frase
  const times = TRAIT_ITEMS.map((i) => timings[i.id]).filter((t) => typeof t === 'number' && t > 0);
  const med = median(times);

  // 4. Contradições: frase direta e frase oposta do mesmo traço com a mesma resposta extrema
  let contradictions = 0;
  for (const t of TRAITS) {
    const its = TRAIT_ITEMS.filter((i) => i.trait === t.id);
    const direct = its.filter((i) => !i.reversed);
    const opposite = its.filter((i) => i.reversed);
    for (const d of direct) {
      for (const o of opposite) {
        const a = answers[d.id];
        const b = answers[o.id];
        if ((a === 5 && b === 5) || (a === 1 && b === 1)) contradictions++;
      }
    }
  }

  const checks: QualityCheck[] = [
    {
      id: 'atencao', ok: attentionMisses === 0, label: 'Frases de atenção',
      detail: attentionMisses === 0 ? 'As duas foram respondidas como pedido.' : `${attentionMisses} de 2 não foram respondidas como pedido.`
    },
    {
      id: 'repeticao', ok: maxSame <= 14, label: 'Variedade das respostas',
      detail: `A resposta mais repetida aparece em ${maxSame} de 20 frases.`
    },
    {
      id: 'rapidez', ok: times.length < 10 || med >= 1200, label: 'Tempo de leitura',
      detail: times.length ? `Mediana de ${(med / 1000).toFixed(1).replace('.', ',')} s por frase.` : 'Tempo não registrado.'
    },
    {
      id: 'contradicao', ok: contradictions < 4, label: 'Coerência entre frases opostas',
      detail: contradictions === 0 ? 'Nenhuma contradição forte.' : `${contradictions} par(es) de frases opostas com a mesma resposta extrema.`
    }
  ];

  const failed = checks.filter((c) => !c.ok).length;
  const status = attentionMisses > 0 || failed >= 2 ? 'invalido' : failed === 1 ? 'atencao' : 'ok';
  return { status, checks };
}

export const INSTRUMENT = {
  id: 'mini-ipip',
  version: 1,
  name: 'Mini-IPIP',
  citation: 'Donnellan, M. B., Oswald, F. L., Baird, B. M., & Lucas, R. E. (2006). The Mini-IPIP scales: Tiny-yet-effective measures of the Big Five factors of personality. Psychological Assessment, 18(2), 192–203.',
  doi: 'https://doi.org/10.1037/1040-3590.18.2.192'
};

export interface PsychologicalResult {
  instrumento: typeof INSTRUMENT.id;
  versao: number;
  respostas: Answers;
  tempos: Timings;
  qualidade: QualityReport;
  escores: Record<TraitId, number>;
  concluidoEm: string;
}

export function buildResult(answers: Answers, timings: Timings): PsychologicalResult {
  const scores = scoreTraits(answers);
  return {
    instrumento: INSTRUMENT.id,
    versao: INSTRUMENT.version,
    respostas: answers,
    tempos: timings,
    qualidade: checkQuality(answers, timings),
    escores: Object.fromEntries(scores.map((s) => [s.id, s.score])) as Record<TraitId, number>,
    concluidoEm: new Date().toISOString()
  };
}

/** Lê o psychological_data salvo; devolve null se for o formato antigo (96 perguntas). */
export function resultFromSaved(raw: any): PsychologicalResult | null {
  if (!raw || raw.instrumento !== INSTRUMENT.id || !raw.respostas) return null;
  const complete = TRAIT_ITEMS.every((i) => typeof raw.respostas[i.id] === 'number');
  return complete ? (raw as PsychologicalResult) : null;
}
