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

/** Rótulos da segunda passada (como gostaria de ser) */
export const SCALE_IDEAL = [
  { value: 1, label: 'Não quero ser assim' },
  { value: 2, label: 'Quero pouco ser assim' },
  { value: 3, label: 'Mais ou menos' },
  { value: 4, label: 'Quero ser assim' },
  { value: 5, label: 'Quero muito ser assim' }
] as const;

/** Terceira passada (como acho que deveria ser): a régua do dever, Higgins (1987) */
export const SCALE_DEVER = [
  { value: 1, label: 'Acho que não devo ser assim' },
  { value: 2, label: 'Acho que devo ser pouco assim' },
  { value: 3, label: 'Mais ou menos' },
  { value: 4, label: 'Acho que devo ser assim' },
  { value: 5, label: 'Acho que devo muito ser assim' }
] as const;

/** Olhar do outro: a pessoa responde junto com alguém próximo, que diz o quanto a frase tem a ver com ela */
export const SCALE_OUTRO = [
  { value: 1, label: 'Diria que não tem nada a ver comigo' },
  { value: 2, label: 'Diria que tem pouco a ver comigo' },
  { value: 3, label: 'Diria que mais ou menos' },
  { value: 4, label: 'Diria que tem a ver comigo' },
  { value: 5, label: 'Diria que tem tudo a ver comigo' }
] as const;

/** Metapercepção: a pessoa responde sozinha, como acha que os outros a descreveriam */
export const SCALE_META = [
  { value: 1, label: 'Acho que diriam: nada a ver comigo' },
  { value: 2, label: 'Acho que diriam: pouco a ver comigo' },
  { value: 3, label: 'Acho que diriam: mais ou menos' },
  { value: 4, label: 'Acho que diriam: tem a ver comigo' },
  { value: 5, label: 'Acho que diriam: tudo a ver comigo' }
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
  { id: 'at1', trait: null, expected: 5, text: 'Para mostrar que está lendo com atenção, escolha a opção 5 nesta frase.' },
  { id: 'c2', trait: 'C', text: 'Muitas vezes esqueço de guardar as coisas no lugar.', reversed: true },
  { id: 'n2', trait: 'N', text: 'Fico tranquilo(a) na maior parte do tempo.', reversed: true },
  { id: 'i2', trait: 'I', text: 'Não me interesso por ideias abstratas.', reversed: true },
  { id: 'e3', trait: 'E', text: 'Nas festas, converso com muitas pessoas diferentes.' },
  { id: 'a3', trait: 'A', text: 'Sinto as emoções dos outros.' },
  { id: 'c3', trait: 'C', text: 'Gosto de ordem.' },
  { id: 'n3', trait: 'N', text: 'Fico chateado(a) com facilidade.' },
  { id: 'i3', trait: 'I', text: 'Tenho dificuldade para entender ideias abstratas.', reversed: true },
  { id: 'at2', trait: null, expected: 1, text: 'Nesta frase, escolha a opção 1.' },
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
  /** Para a comparação hoje × desejado */
  wantMore: string;
  wantLess: string;
}

// Ordem de exibição
export const TRAITS: TraitInfo[] = [
  {
    id: 'I', name: 'Abertura', technical: 'Intelecto / Imaginação', color: '#7c3aed',
    low: 'Você tende a preferir o concreto e o já conhecido às ideias abstratas. Costuma ir direto ao que funciona.',
    mid: 'Você transita entre o prático e o imaginativo: aprecia ideias novas quando elas têm alguma utilidade.',
    high: 'Você tende a se interessar por ideias abstratas e possibilidades. A imaginação é uma ferramenta que você usa com frequência.',
    wantMore: 'mais aberto(a) a ideias novas e à imaginação',
    wantLess: 'mais prático(a) e concreto(a)'
  },
  {
    id: 'C', name: 'Organização', technical: 'Conscienciosidade', color: '#2563eb',
    low: 'Você tende a funcionar com mais flexibilidade do que rotina. Ordem e prazos pesam menos no seu dia a dia.',
    mid: 'Você mantém alguma ordem, mas sem rigidez: organiza o que importa e deixa o resto correr.',
    high: 'Você tende a gostar de ordem e a resolver as tarefas logo. Previsibilidade costuma ajudar você a render.',
    wantMore: 'mais organizado(a) e constante',
    wantLess: 'mais flexível, com menos cobrança de ordem'
  },
  {
    id: 'E', name: 'Extroversão', technical: 'Extroversão', color: '#ea580c',
    low: 'Você tende a ser mais reservado(a) e a preferir poucas conversas, mais próximas. Grupos grandes cansam mais do que animam.',
    mid: 'Você se adapta: aproveita a convivência, mas também precisa de momentos mais quietos.',
    high: 'Você tende a buscar gente e conversa. Ambientes sociais costumam dar energia, em vez de tirar.',
    wantMore: 'mais expansivo(a) e sociável',
    wantLess: 'mais reservado(a)'
  },
  {
    id: 'A', name: 'Amabilidade', technical: 'Amabilidade', color: '#059669',
    low: 'Você tende a ser mais direto(a) e a olhar primeiro para os fatos do que para os sentimentos envolvidos.',
    mid: 'Você equilibra empatia e objetividade: se importa com os outros sem deixar de lado o próprio ponto de vista.',
    high: 'Você tende a perceber e a sentir as emoções dos outros. Cuidar das relações é algo natural para você.',
    wantMore: 'mais empático(a) e atento(a) aos outros',
    wantLess: 'mais direto(a) e firme'
  },
  {
    id: 'N', name: 'Estabilidade emocional', technical: 'Neuroticismo (invertido)', color: '#0891b2', inverted: true,
    low: 'Você tende a sentir as emoções com intensidade e a variar de humor. Isso também costuma trazer sensibilidade ao que acontece ao redor.',
    mid: 'Você tem dias de mais oscilação e dias de mais calma, sem que um dos lados predomine.',
    high: 'Você tende a se manter calmo(a) e a se recuperar rápido dos aborrecimentos.',
    wantMore: 'mais calmo(a) e estável',
    wantLess: 'mais em contato com as próprias emoções'
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

export type Mode = 'real' | 'ideal' | 'dever' | 'outro' | 'meta';

/**
 * Nos modos 'ideal' e 'dever', repetir a mesma resposta é esperado
 * (querer "um pouco mais de tudo"), então essa verificação não conta.
 */
export function checkQuality(answers: Answers, timings: Timings, mode: Mode = 'real'): QualityReport {
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

  const counted = mode === 'ideal' || mode === 'dever' ? checks.filter((c) => c.id !== 'repeticao') : checks;
  const failed = counted.filter((c) => !c.ok).length;
  const status = attentionMisses > 0 || failed >= 2 ? 'invalido' : failed === 1 ? 'atencao' : 'ok';
  return { status, checks: counted };
}

export const INSTRUMENT = {
  id: 'mini-ipip',
  version: 1,
  name: 'Mini-IPIP',
  citation: 'Donnellan, M. B., Oswald, F. L., Baird, B. M., & Lucas, R. E. (2006). The Mini-IPIP scales: Tiny-yet-effective measures of the Big Five factors of personality. Psychological Assessment, 18(2), 192–203.',
  doi: 'https://doi.org/10.1037/1040-3590.18.2.192'
};

export interface IdealResult {
  respostas: Answers;
  tempos: Timings;
  qualidade: QualityReport;
  escores: Record<TraitId, number>;
  concluidoEm: string;
}

export interface PsychologicalResult {
  instrumento: typeof INSTRUMENT.id;
  versao: number;
  respostas: Answers;
  tempos: Timings;
  qualidade: QualityReport;
  escores: Record<TraitId, number>;
  concluidoEm: string;
  /** Segunda passada: as mesmas frases, "como eu gostaria de ser" */
  ideal?: IdealResult;
  /** Terceira passada (Mapa da Psique): "como acho que deveria ser" */
  dever?: IdealResult;
  /** Olhar dos outros (Mapa da Psique): respondido com alguém ou pela metapercepção */
  outro?: OtherResult;
}

export interface OtherResult extends IdealResult {
  /** 'com_alguem' = respondido junto com alguém próximo; 'sozinho' = metapercepção */
  modo: 'com_alguem' | 'sozinho';
  /** Apelido opcional da relação ("minha irmã"); nunca o nome do terceiro */
  relacao?: string;
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

export function buildIdeal(answers: Answers, timings: Timings, mode: Mode = 'ideal'): IdealResult {
  const scores = scoreTraits(answers);
  return {
    respostas: answers,
    tempos: timings,
    qualidade: checkQuality(answers, timings, mode),
    escores: Object.fromEntries(scores.map((s) => [s.id, s.score])) as Record<TraitId, number>,
    concluidoEm: new Date().toISOString()
  };
}

const answersComplete = (a: any) => Boolean(a) && TRAIT_ITEMS.every((i) => typeof a[i.id] === 'number');

/**
 * Diferença mínima entre "hoje" e "desejado" para levar a sério: cada escore tem
 * margem de ±11, então a diferença entre dois deles tem margem de ~±16.
 */
export const GAP_THRESHOLD = 16;

export interface TraitGap {
  id: TraitId;
  real: number;
  ideal: number;
  gap: number;
  meaningful: boolean;
}

export function traitGaps(result: PsychologicalResult, against: 'ideal' | 'dever' | 'outro' = 'ideal'): TraitGap[] {
  const other = result[against];
  if (!other) return [];
  const real = scoreTraits(result.respostas);
  const ideal = scoreTraits(other.respostas);
  return real
    .map((r) => {
      const i = ideal.find((x) => x.id === r.id)!;
      const gap = i.score - r.score;
      return { id: r.id, real: r.score, ideal: i.score, gap, meaningful: Math.abs(gap) >= GAP_THRESHOLD };
    })
    .sort((a, b) => Math.abs(b.gap) - Math.abs(a.gap));
}

/** Lê o psychological_data salvo; devolve null se for o formato antigo (96 perguntas). */
export function resultFromSaved(raw: any): PsychologicalResult | null {
  if (!raw || raw.instrumento !== INSTRUMENT.id || !answersComplete(raw.respostas)) return null;
  const result = { ...raw } as PsychologicalResult;
  if (!answersComplete(raw.ideal?.respostas)) delete result.ideal;
  if (!answersComplete(raw.dever?.respostas)) delete result.dever;
  if (!answersComplete(raw.outro?.respostas)) delete result.outro;
  return result;
}
