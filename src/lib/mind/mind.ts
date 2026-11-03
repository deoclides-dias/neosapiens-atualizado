// src/lib/mind/mind.ts
// Módulo Mente: autoavaliação, curiosidade intelectual (NCS-6) e cinco
// tarefas feitas no navegador. Aqui ficam as perguntas, os formatos dos
// resultados e os cálculos de 0 a 100, com os passos de cada conta.

// ---------- Autoavaliação ----------

export const SELF_ITEMS = [
  { id: 'atencao', label: 'Atenção', text: 'Sua atenção e prontidão (reagir rápido, não “dar branco”)' },
  { id: 'memoria', label: 'Memória', text: 'Sua memória de curto prazo (guardar um número, uma lista)' },
  { id: 'controle', label: 'Foco', text: 'Seu foco (não se distrair, resistir ao impulso)' },
  { id: 'flexibilidade', label: 'Flexibilidade', text: 'Sua flexibilidade (alternar entre tarefas, mudar de estratégia)' },
  { id: 'criatividade', label: 'Criatividade', text: 'Sua criatividade (ter muitas ideias diferentes)' },
  { id: 'curiosidade', label: 'Curiosidade', text: 'Seu gosto por pensar e aprender coisas difíceis' }
] as const;
export type AxisId = (typeof SELF_ITEMS)[number]['id'];

// ---------- NCS-6 (Lins de Holanda Coelho, Hanel & Wolf, 2020) ----------
// Itens 1, 2, 3, 4, 11 e 15 da Need for Cognition Scale (Cacioppo, Petty & Kao, 1984).
// Tradução do NeoSapiens.

export const NCS_ITEMS = [
  { id: 'n1', text: 'Prefiro problemas complexos a problemas simples.' },
  { id: 'n2', text: 'Gosto de ficar responsável por situações que exigem pensar bastante.' },
  { id: 'n3', text: 'Pensar não é a minha ideia de diversão.', reversed: true },
  { id: 'n4', text: 'Prefiro fazer algo que exija pouco raciocínio a algo que com certeza vai desafiar a minha capacidade de pensar.', reversed: true },
  { id: 'n5', text: 'Gosto muito de tarefas que envolvem encontrar soluções novas para problemas.' },
  { id: 'n6', text: 'Prefiro uma tarefa intelectual, difícil e importante a uma tarefa só razoavelmente importante, mas que não exija muito raciocínio.' }
];

export const NCS_SCALE = [
  { value: 1, label: 'Não tem nada a ver comigo' },
  { value: 2, label: 'Tem pouco a ver comigo' },
  { value: 3, label: 'Mais ou menos' },
  { value: 4, label: 'Tem a ver comigo' },
  { value: 5, label: 'Tem tudo a ver comigo' }
];

// ---------- Resultados brutos das tarefas ----------

export interface ReactionResult {
  rts: number[]; // ms das respostas válidas
  falseStarts: number;
  device: 'toque' | 'mouse';
}
export interface DigitResult {
  forward: number; // maior sequência acertada na ordem direta
  backward: number; // na ordem inversa
  trials: { mode: 'direta' | 'inversa'; length: number; ok: boolean }[];
}
export interface StroopTrial {
  congruent: boolean;
  correct: boolean;
  rt: number;
}
export interface StroopResult {
  trials: StroopTrial[];
}
export interface TrailsResult {
  aMs: number;
  bMs: number;
  aErrors: number;
  bErrors: number;
}
export interface CreativityResult {
  object: string;
  ideas: string[];
  seconds: number;
}

export interface MindData {
  versao: 'mente-v1';
  autoavaliacao: Partial<Record<AxisId, number>>;
  ncs: Record<string, number>;
  contexto: { sonoHoras?: number; cafeinaHoje?: boolean };
  testes: {
    reacao?: ReactionResult;
    digitos?: DigitResult;
    stroop?: StroopResult;
    trilhas?: TrailsResult;
    criatividade?: CreativityResult;
  };
  etapasConcluidas: string[];
  concluidoEm?: string;
}

export const MIND_VERSION = 'mente-v1';

export const STEPS = [
  { id: 'inicio', title: 'Como você se vê', minutes: 2 },
  { id: 'reacao', title: 'Tempo de reação', minutes: 2 },
  { id: 'digitos', title: 'Sequência de números', minutes: 3 },
  { id: 'stroop', title: 'Cores e palavras', minutes: 2 },
  { id: 'trilhas', title: 'Trilhas', minutes: 2 },
  { id: 'criatividade', title: 'Usos criativos', minutes: 2 }
] as const;
export type StepId = (typeof STEPS)[number]['id'];

export function mindFromSaved(raw: any): MindData | null {
  if (!raw || raw.versao !== MIND_VERSION) return null;
  return raw as MindData;
}

// ---------- Utilidades ----------

export const median = (xs: number[]) => {
  if (!xs.length) return 0;
  const s = [...xs].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const clamp = (x: number) => Math.max(0, Math.min(100, Math.round(x)));
/** Escala linear: `good` vale 100, `bad` vale 0 */
const lin = (v: number, good: number, bad: number) => clamp(((v - bad) / (good - bad)) * 100);
const s1 = (n: number) => n.toFixed(1).replace('.', ',');

/** Normaliza uma ideia para contar repetidas uma vez só */
export const normalizeIdea = (t: string) =>
  t
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\b(um|uma|o|a|os|as|de|da|do|para|pra|como)\b/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

export const uniqueIdeas = (ideas: string[]) => {
  const seen = new Set<string>();
  return ideas.filter((i) => {
    const k = normalizeIdea(i);
    if (!k || seen.has(k)) return false;
    seen.add(k);
    return true;
  });
};

// ---------- Escores ----------

export interface AxisScore {
  id: AxisId;
  label: string;
  score: number | null;
  self?: number;
  headline: string;
  steps: string[];
  reference: string;
}

export const LAPSE_MS = 500;

export function scoreReaction(r?: ReactionResult): Pick<AxisScore, 'score' | 'headline' | 'steps' | 'reference'> {
  if (!r || r.rts.length < 5) return { score: null, headline: 'Teste não feito.', steps: [], reference: '' };
  const med = median(r.rts);
  const lapses = r.rts.filter((x) => x >= LAPSE_MS).length;
  // Toque na tela costuma somar ~40 ms ao tempo medido
  const adj = r.device === 'toque' ? med - 40 : med;
  const base = lin(adj, 260, 460);
  const score = clamp(base - lapses * 8 - r.falseStarts * 4);
  return {
    score,
    headline: `Mediana de ${Math.round(med)} ms em ${r.rts.length} respostas, ${lapses} lapso(s) e ${r.falseStarts} antecipação(ões).`,
    steps: [
      `Mediana dos tempos: ${Math.round(med)} ms${r.device === 'toque' ? `; em tela de toque descontamos 40 ms do aparelho → ${Math.round(adj)} ms` : ''}.`,
      `Escala: 260 ms ou menos vale 100, 460 ms ou mais vale 0 → ${base}.`,
      `Desconto de 8 pontos por lapso (resposta de ${LAPSE_MS} ms ou mais) e 4 por antecipação (tocar antes do círculo): ${base} − ${lapses * 8} − ${r.falseStarts * 4} = ${score}.`
    ],
    reference: 'Em adultos descansados, a mediana costuma ficar entre 250 e 350 ms com mouse; sono ruim aumenta tempos e lapsos.'
  };
}

export function scoreDigits(d?: DigitResult): Pick<AxisScore, 'score' | 'headline' | 'steps' | 'reference'> {
  if (!d) return { score: null, headline: 'Teste não feito.', steps: [], reference: '' };
  const f = lin(d.forward, 8, 3);
  const b = lin(d.backward, 7, 2);
  const score = clamp((f + b) / 2);
  return {
    score,
    headline: `${d.forward} números na ordem direta e ${d.backward} na ordem inversa.`,
    steps: [
      `Ordem direta: ${d.forward} (3 vale 0, 8 ou mais vale 100) → ${f}.`,
      `Ordem inversa: ${d.backward} (2 vale 0, 7 ou mais vale 100) → ${b}.`,
      `Média: (${f} + ${b}) ÷ 2 = ${score}.`
    ],
    reference: 'Adultos costumam guardar de 5 a 8 números na ordem direta e de 4 a 6 na inversa.'
  };
}

export function stroopCalc(s?: StroopResult) {
  if (!s || !s.trials.length) return null;
  const ok = s.trials.filter((t) => t.correct);
  const cong = median(ok.filter((t) => t.congruent).map((t) => t.rt));
  const inc = median(ok.filter((t) => !t.congruent).map((t) => t.rt));
  const acc = ok.length / s.trials.length;
  return { cong, inc, effect: inc - cong, acc, errors: s.trials.length - ok.length, n: s.trials.length };
}

export function scoreStroop(s?: StroopResult): Pick<AxisScore, 'score' | 'headline' | 'steps' | 'reference'> {
  const c = stroopCalc(s);
  if (!c) return { score: null, headline: 'Teste não feito.', steps: [], reference: '' };
  const base = lin(c.effect, 40, 260);
  const score = clamp(base * Math.min(1, c.acc / 0.95));
  return {
    score,
    headline: `As cores em conflito custaram ${Math.round(c.effect)} ms a mais; ${Math.round(c.acc * 100)}% de acertos.`,
    steps: [
      `Mediana quando palavra e cor combinam: ${Math.round(c.cong)} ms. Quando não combinam: ${Math.round(c.inc)} ms.`,
      `Efeito Stroop: ${Math.round(c.inc)} − ${Math.round(c.cong)} = ${Math.round(c.effect)} ms (40 ms ou menos vale 100, 260 ms ou mais vale 0) → ${base}.`,
      `Acertos: ${c.n - c.errors} de ${c.n} (${Math.round(c.acc * 100)}%). Abaixo de 95%, o escore é reduzido na mesma proporção → ${score}.`
    ],
    reference: 'Quase todo mundo fica mais lento quando a palavra e a cor não combinam; o que varia é quanto. Diferenças de 50 a 150 ms são comuns.'
  };
}

export function scoreTrails(t?: TrailsResult): Pick<AxisScore, 'score' | 'headline' | 'steps' | 'reference'> {
  if (!t) return { score: null, headline: 'Teste não feito.', steps: [], reference: '' };
  const ratio = t.bMs / Math.max(1, t.aMs);
  const base = lin(ratio, 1.5, 3.5);
  const score = clamp(base - (t.bErrors + t.aErrors) * 5);
  return {
    score,
    headline: `Parte A em ${s1(t.aMs / 1000)} s e parte B em ${s1(t.bMs / 1000)} s: a troca de regra custou ${s1(ratio)} vezes o tempo.`,
    steps: [
      `Razão B ÷ A = ${s1(t.bMs / 1000)} ÷ ${s1(t.aMs / 1000)} = ${s1(ratio)} (1,5 ou menos vale 100, 3,5 ou mais vale 0) → ${base}.`,
      `Desconto de 5 pontos por toque errado (${t.aErrors} na A, ${t.bErrors} na B) → ${score}.`
    ],
    reference: 'A razão B ÷ A separa a flexibilidade da velocidade da mão; em adultos costuma ficar entre 1,5 e 3.'
  };
}

export function scoreCreativity(c?: CreativityResult): Pick<AxisScore, 'score' | 'headline' | 'steps' | 'reference'> {
  if (!c) return { score: null, headline: 'Teste não feito.', steps: [], reference: '' };
  const n = uniqueIdeas(c.ideas).length;
  const score = clamp((n / 12) * 100);
  return {
    score,
    headline: `${n} ideia(s) diferente(s) em ${Math.round(c.seconds / 60)} minutos.`,
    steps: [
      `Ideias repetidas ou só com palavras trocadas contam uma vez: ${c.ideas.length} escritas, ${n} diferentes.`,
      `Escala: 12 ideias ou mais valem 100 → ${n} ÷ 12 × 100 = ${score}.`
    ],
    reference: 'Em 2 minutos, adultos costumam listar de 5 a 10 usos. Aqui contamos a fluência (quantidade); a originalidade fica para uma próxima versão.'
  };
}

export function scoreNcs(ncs: Record<string, number>): Pick<AxisScore, 'score' | 'headline' | 'steps' | 'reference'> {
  if (!NCS_ITEMS.every((i) => typeof ncs[i.id] === 'number')) return { score: null, headline: 'Não respondido.', steps: [], reference: '' };
  const used = NCS_ITEMS.map((i) => (i.reversed ? 6 - ncs[i.id] : ncs[i.id]));
  const mean = used.reduce((s, x) => s + x, 0) / used.length;
  const score = clamp(((mean - 1) / 4) * 100);
  return {
    score,
    headline: `Média ${s1(mean)} de 5 nas 6 frases sobre gostar de pensar.`,
    steps: [
      `Frases 3 e 4 entram invertidas (6 − resposta). Valores usados: ${used.join(', ')}.`,
      `Média ${s1(mean)} → (${s1(mean)} − 1) ÷ 4 × 100 = ${score}.`
    ],
    reference: 'A “necessidade de cognição” é o quanto a pessoa gosta de pensar; está ligada à curiosidade e ao aprendizado ao longo da vida.'
  };
}

export function mindAxes(d: MindData): AxisScore[] {
  const parts: Record<AxisId, Pick<AxisScore, 'score' | 'headline' | 'steps' | 'reference'>> = {
    atencao: scoreReaction(d.testes.reacao),
    memoria: scoreDigits(d.testes.digitos),
    controle: scoreStroop(d.testes.stroop),
    flexibilidade: scoreTrails(d.testes.trilhas),
    criatividade: scoreCreativity(d.testes.criatividade),
    curiosidade: scoreNcs(d.ncs)
  };
  return SELF_ITEMS.map((s) => ({
    id: s.id,
    label: s.label,
    self: typeof d.autoavaliacao[s.id] === 'number' ? (d.autoavaliacao[s.id] as number) * 10 : undefined,
    ...parts[s.id]
  }));
}
