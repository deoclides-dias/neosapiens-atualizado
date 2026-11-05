// src/lib/integration/bridge.ts
// A Ponte: onde a ciência e as tradições se encontram.
// Não mistura números: põe os dois lados lado a lado e mostra se convergem.
//
// Parte 1 — Corpo e mente × Cinco Elementos: cada elemento recebe uma nota
//   das medidas científicas, agrupadas pelas correspondências da MTC
//   (o agrupamento é tradicional; os números são científicos).
// Parte 2 — Personalidade × signos e números: as características que a
//   astrologia e a numerologia atribuem são traduzidas para as 5 dimensões do
//   Mini-IPIP e comparadas com o teste.

import type { ChineseElement, SignName } from '../astro';
import { WAKE_WINDOWS } from '../body/questions';
import type { Computed, ElementMention, Sources } from './integration';

export type Verdict = 'converge' | 'diverge' | 'parcial' | 'so_ciencia' | 'so_tradicao';

export const VERDICT_LABEL: Record<Verdict, string> = {
  converge: 'Convergem',
  diverge: 'Divergem',
  parcial: 'Em parte',
  so_ciencia: 'Só a ciência fala',
  so_tradicao: 'Só a tradição fala'
};

const avg = (xs: number[]) => (xs.length ? Math.round(xs.reduce((s, x) => s + x, 0) / xs.length) : null);
const clamp = (v: number) => Math.max(0, Math.min(100, Math.round(v)));
const isNum = (v: unknown): v is number => typeof v === 'number' && !Number.isNaN(v);

// ---------------------------------------------------------------------------
// Parte 1: Corpo e mente × Cinco Elementos
// ---------------------------------------------------------------------------

export interface BridgeMeasure {
  label: string;
  origin: string;
  value: number;
  /** true = correspondência clássica da MTC; false = aproximação do NeoSapiens */
  classic: boolean;
  note?: string;
}

export interface ElementBridge {
  element: ChineseElement;
  measures: BridgeMeasure[];
  science: number | null;
  tradition: 'forte' | 'atencao' | 'misto' | null;
  traditionSources: string[];
  verdict: Verdict | null;
  explain: string;
}

export const MIN_MEASURES = 3;

const ART: Record<ChineseElement, string> = { Madeira: 'a', Fogo: 'o', Terra: 'a', Metal: 'o', Água: 'a' };

function measuresFor(s: Sources, c: Computed): Record<ChineseElement, BridgeMeasure[]> {
  const b = (s.body?.respostas ?? {}) as Record<string, unknown>;
  const n = (k: string) => (isNum(b[k]) ? (b[k] as number) : null);
  const area = (id: string) => c.body?.areas.find((a) => a.id === id)?.score ?? null;
  const mind = (id: string) => c.mind?.find((a) => a.id === id)?.score ?? null;
  const trait = (id: string) => c.traits?.find((t) => t.id === id)?.score ?? null;
  const signals = Array.isArray(b.sinais) ? (b.sinais as string[]) : null;
  const out: Record<ChineseElement, BridgeMeasure[]> = { Madeira: [], Fogo: [], Terra: [], Metal: [], Água: [] };
  const add = (e: ChineseElement, m: Omit<BridgeMeasure, 'value'> & { value: number | null }) => {
    if (isNum(m.value)) out[e].push({ ...m, value: clamp(m.value) });
  };

  // Despertar no mesmo horário: conta para o elemento da faixa
  const wake = b.despertar;
  const win = WAKE_WINDOWS.find((w) => w.start === n('despertar_horario'));
  (['Madeira', 'Fogo', 'Metal'] as ChineseElement[]).forEach((e) => {
    if (typeof wake !== 'string') return;
    const hit = wake === 'mesmo' && win?.element === e;
    const starts = WAKE_WINDOWS.filter((w) => w.element === e).map((w) => w.start);
    const hours = `entre ${starts[0]}h e ${(starts[starts.length - 1] + 2) % 24}h`;
    add(e, {
      label: `Noite sem despertar ${hours}`,
      origin: 'Corpo · sono',
      classic: true,
      value: hit ? 15 : wake === 'nao' ? 100 : wake === 'variado' ? 60 : 85,
      note: hit ? `você costuma acordar ${win!.label.toLowerCase()} (${win!.organ})` : undefined
    });
  });

  const signalScore = (keys: string[]) => (signals ? 100 - (signals.filter((x) => keys.includes(x)).length / keys.length) * 100 : null);
  const signalNote = (keys: string[], names: string[]) => {
    const hit = signals ? keys.map((k, i) => (signals.includes(k) ? names[i] : null)).filter(Boolean) : [];
    return hit.length ? `marcou: ${hit.join(', ')}` : undefined;
  };

  // Madeira
  add('Madeira', { label: 'Movimento', origin: 'Corpo · IPAQ', classic: true, value: area('movimento') });
  add('Madeira', {
    label: 'Tendões e unhas (sem cãibras, unhas fracas, formigamento)',
    origin: 'Corpo · sinais',
    classic: true,
    value: signalScore(['caimbras', 'unhas', 'formigamento']),
    note: signalNote(['caimbras', 'unhas', 'formigamento'], ['cãibras', 'unhas fracas', 'formigamento'])
  });
  if (isNum(n('alc1'))) {
    const sum = (n('alc1') ?? 0) + (n('alc2') ?? 0) + (n('alc3') ?? 0);
    add('Madeira', { label: 'Pouco álcool', origin: 'Corpo · AUDIT-C', classic: true, value: 100 - (sum / 12) * 100, note: `AUDIT-C ${sum} de 12` });
  }
  add('Madeira', { label: 'Flexibilidade', origin: 'Mente · teste das trilhas', classic: false, value: mind('flexibilidade') });
  add('Madeira', { label: 'Abertura', origin: 'Personalidade · Mini-IPIP', classic: false, value: trait('I') });

  // Fogo
  const lat = n('latencia');
  add('Fogo', { label: 'Pegar no sono com facilidade', origin: 'Corpo · sono', classic: true, value: lat === null ? null : lat <= 10 ? 100 : lat <= 23 ? 75 : lat <= 45 ? 40 : 10 });
  add('Fogo', { label: 'Alegria e bom humor', origin: 'Corpo · OMS-5', classic: true, value: isNum(n('w1')) ? ((n('w1') as number) / 5) * 100 : null });
  add('Fogo', { label: 'Sem aftas frequentes', origin: 'Corpo · sinais', classic: true, value: signalScore(['aftas']) });
  const rel = c.life?.areas.filter((x) => ['familia', 'casal', 'amizades'].includes(x.id));
  add('Fogo', { label: 'Relações vividas', origin: 'Propósito · áreas da vida', classic: false, value: rel?.length ? avg(rel.map((x) => ((x.coherence - 1) / 9) * 100)) : null });
  add('Fogo', { label: 'Presença de sentido', origin: 'Propósito · MLQ', classic: false, value: c.mlq ? ((c.mlq.presence - 5) / 30) * 100 : null });
  add('Fogo', { label: 'Extroversão', origin: 'Personalidade · Mini-IPIP', classic: false, value: trait('E') });

  // Terra
  const dig = ['inchaco', 'azia', 'gases'].map(n);
  add('Terra', {
    label: 'Digestão tranquila (pouco inchaço, azia e gases)',
    origin: 'Corpo · digestão',
    classic: true,
    value: dig.every(isNum) ? 100 - ((dig as number[]).reduce((a, x) => a + x, 0) / 9) * 100 : null
  });
  const meals = [n('g04'), n('g11'), isNum(n('g17')) ? 3 - (n('g17') as number) : null].filter(isNum);
  add('Terra', { label: 'Refeições regulares, com calma e sentado(a)', origin: 'Corpo · Guia Alimentar', classic: true, value: meals.length >= 2 ? (avg(meals)! / 3) * 100 : null });
  const sweet = [n('g21'), n('g15')].filter(isNum);
  add('Terra', { label: 'Pouco doce e açúcar', origin: 'Corpo · Guia Alimentar', classic: true, value: sweet.length ? 100 - ((sweet.reduce((a, x) => a + x, 0) / sweet.length) / 3) * 100 : null });
  add('Terra', { label: 'Sem sonolência durante o dia', origin: 'Corpo · sono', classic: true, value: isNum(n('sonolencia')) ? 100 - ((n('sonolencia') as number) / 4) * 100 : null });
  add('Terra', {
    label: 'Sem cansaço persistente nem cicatrização lenta',
    origin: 'Corpo · sinais',
    classic: true,
    value: signalScore(['cansaco', 'cicatrizacao']),
    note: signalNote(['cansaco', 'cicatrizacao'], ['cansaço que não melhora', 'cicatrização lenta'])
  });
  add('Terra', { label: 'Foco', origin: 'Mente · teste de cores e palavras', classic: true, value: mind('controle') });
  add('Terra', { label: 'Regularidade dos horários de sono', origin: 'Corpo · sono', classic: false, value: isNum(n('regularidade')) ? ((n('regularidade') as number) / 4) * 100 : null });
  add('Terra', { label: 'Estabilidade emocional', origin: 'Personalidade · Mini-IPIP', classic: false, value: trait('N') });

  // Metal
  const bristol = n('bristol');
  const evac = n('evacuacoes');
  const effort = n('esforco');
  const gut = [
    bristol === null ? null : [3, 4].includes(bristol) ? 100 : [2, 5].includes(bristol) ? 60 : [1, 6].includes(bristol) ? 30 : 10,
    evac === null ? null : [3, 4].includes(evac) ? 100 : evac === 1 ? 20 : 60,
    effort === null ? null : 100 - (effort / 3) * 100
  ].filter(isNum);
  add('Metal', { label: 'Intestino (Bristol, frequência, esforço)', origin: 'Corpo · digestão', classic: true, value: gut.length >= 2 ? avg(gut) : null });
  add('Metal', { label: 'Pele sem ressecamento', origin: 'Corpo · sinais', classic: true, value: signalScore(['pele']) });
  const tab = b.tabaco;
  add('Metal', { label: 'Sem tabaco', origin: 'Corpo · hábitos', classic: true, value: typeof tab === 'string' ? (['nunca', 'parou'].includes(tab) ? 100 : 20) : null });
  add('Metal', { label: 'Organização', origin: 'Personalidade · Mini-IPIP', classic: false, value: trait('C') });
  const out2 = n('ar_livre');
  add('Metal', { label: 'Tempo ao ar livre', origin: 'Corpo · sono', classic: false, value: out2 === null ? null : out2 <= 15 ? 25 : out2 <= 45 ? 55 : out2 <= 90 ? 85 : 100 });

  // Água
  const ur = n('urina');
  const water = n('agua');
  const kid = [ur === null ? null : [100, 80, 45, 20, 5][Math.max(0, ur - 2)] ?? 80, water === null ? null : water <= 3 ? 25 : water <= 5 ? 60 : 100].filter(isNum);
  if (ur === 1) kid[0] = 80;
  add('Água', { label: 'Cor da urina e água bebida', origin: 'Corpo · digestão', classic: true, value: kid.length ? avg(kid) : null });
  add('Água', { label: 'Sem queda de cabelo acima do normal', origin: 'Corpo · sinais', classic: true, value: signalScore(['cabelo']) });
  const rest = [isNum(n('w4')) ? ((n('w4') as number) / 5) * 100 : null, isNum(n('satisfacao_sono')) ? ((n('satisfacao_sono') as number) / 4) * 100 : null].filter(isNum);
  add('Água', { label: 'Acordar descansado(a) e satisfeito(a) com o sono', origin: 'Corpo · OMS-5 e sono', classic: true, value: rest.length ? avg(rest) : null });
  add('Água', { label: 'Memória', origin: 'Mente · sequência de números', classic: true, value: mind('memoria') });
  add('Água', { label: 'Energia e disposição', origin: 'Corpo · OMS-5', classic: false, value: isNum(n('w3')) ? ((n('w3') as number) / 5) * 100 : null });

  return out;
}

export function elementBridge(s: Sources, c: Computed, mentions: ElementMention[]): ElementBridge[] {
  const ms = measuresFor(s, c);
  const order: ChineseElement[] = ['Fogo', 'Terra', 'Metal', 'Água', 'Madeira'];
  return order.map((e) => {
    const m = mentions.filter((x) => x.element === e);
    const sources = Array.from(new Set(m.map((x) => x.source)));
    const forte = m.filter((x) => x.sign === 'forte').length;
    const atencao = m.filter((x) => x.sign === 'atencao').length;
    // Regra da repetição: a tradição só "fala" com duas ou mais fontes
    const tradition = sources.length < 2 ? null : forte > atencao ? 'forte' : atencao > forte ? 'atencao' : 'misto';
    const science = ms[e].length >= MIN_MEASURES ? avg(ms[e].map((x) => x.value)) : null;
    const the = `${ART[e]} ${e}`;
    let verdict: Verdict | null = null;
    let explain = '';
    if (tradition && science !== null) {
      if (tradition === 'forte') verdict = science >= 60 ? 'converge' : science < 45 ? 'diverge' : 'parcial';
      else if (tradition === 'atencao') verdict = science < 50 ? 'converge' : science >= 65 ? 'diverge' : 'parcial';
      else verdict = 'parcial';
      const tSays = tradition === 'forte' ? `as tradições mostram ${the} com força` : tradition === 'atencao' ? `as tradições dizem que ${the} pede atenção` : `as tradições mostram ${the} com força e atenção ao mesmo tempo`;
      const sSays = `as medidas ligadas a ${ART[e] === 'a' ? 'ela' : 'ele'} ficaram em ${science} de 100`;
      explain =
        verdict === 'converge'
          ? `Dois caminhos independentes chegam ao mesmo lugar: ${tSays}, e ${sSays}.`
          : verdict === 'diverge'
            ? `Aqui os caminhos se separam: ${tSays}, mas ${sSays}.` +
              (tradition === 'forte'
                ? ' Na MTC, um elemento muito presente também pode virar excesso; mesmo assim contamos como divergência, para a leitura não ficar sempre “certa”.'
                : ' Uma divergência também ensina: vale observar qual das duas leituras conversa mais com você.')
            : `Os dois lados se tocam sem coincidir: ${tSays}, e ${sSays}.`;
    } else if (science !== null) {
      verdict = 'so_ciencia';
      explain = `As tradições não repetiram ${the} em duas fontes; as medidas ligadas a ${ART[e] === 'a' ? 'ela' : 'ele'} ficaram em ${science} de 100.`;
    } else if (tradition) {
      verdict = 'so_tradicao';
      explain = `Há menos de ${MIN_MEASURES} medidas respondidas para ${the}; por enquanto só a tradição fala.`;
    }
    return { element: e, measures: ms[e], science, tradition, traditionSources: sources, verdict, explain };
  });
}

// ---------------------------------------------------------------------------
// Parte 2: Personalidade × signos e números
// ---------------------------------------------------------------------------

export type TraitId = 'E' | 'A' | 'C' | 'N' | 'I';

export const TRAIT_LABEL: Record<TraitId, string> = {
  E: 'Extroversão',
  A: 'Amabilidade',
  C: 'Organização',
  N: 'Estabilidade emocional',
  I: 'Abertura'
};

/** Características que a astrologia atribui aos signos, traduzidas para as 5 dimensões */
export const SIGN_TRAITS: Record<TraitId, { up: SignName[]; down: SignName[] }> = {
  E: { up: ['Áries', 'Leão', 'Sagitário', 'Gêmeos', 'Libra'], down: ['Câncer', 'Escorpião', 'Capricórnio', 'Virgem'] },
  A: { up: ['Libra', 'Câncer', 'Peixes', 'Touro'], down: ['Áries', 'Escorpião', 'Aquário'] },
  C: { up: ['Virgem', 'Capricórnio', 'Touro'], down: ['Sagitário', 'Gêmeos', 'Peixes'] },
  N: { up: ['Touro', 'Capricórnio'], down: ['Câncer', 'Escorpião', 'Peixes', 'Gêmeos'] },
  I: { up: ['Aquário', 'Sagitário', 'Gêmeos', 'Peixes'], down: ['Touro', 'Capricórnio'] }
};

/** Temas dos números (numerologia pitagórica) e as dimensões que eles sugerem */
export const NUMBER_TRAITS: Record<number, { theme: string; dims: Partial<Record<TraitId, 1 | -1>> }> = {
  1: { theme: 'liderança e independência', dims: { E: 1 } },
  2: { theme: 'cooperação e sensibilidade', dims: { A: 1, N: -1 } },
  3: { theme: 'expressão e comunicação', dims: { E: 1, I: 1 } },
  4: { theme: 'estrutura e método', dims: { C: 1 } },
  5: { theme: 'liberdade e mudança', dims: { I: 1, C: -1 } },
  6: { theme: 'cuidado e responsabilidade', dims: { A: 1 } },
  7: { theme: 'introspecção e análise', dims: { E: -1, I: 1 } },
  8: { theme: 'realização e poder', dims: { C: 1 } },
  9: { theme: 'humanitarismo e compaixão', dims: { A: 1, I: 1 } }
};
const MASTER: Record<number, number> = { 11: 2, 22: 4, 33: 6 };

export interface TraitVoice {
  source: string;
  dir: 1 | -1;
  why: string;
}

export interface TraitBridge {
  id: TraitId;
  label: string;
  score: number | null;
  voices: TraitVoice[];
  tradDir: 1 | -1 | 0;
  verdict: Verdict | 'dividida' | null;
  explain: string;
}

export function personalityBridge(s: Sources, c: Computed): TraitBridge[] {
  const t = s.traditions;
  const sun = t?.western.planets.find((p) => p.id === 'Sun')?.sign;
  const moon = t?.western.planets.find((p) => p.id === 'Moon')?.sign;
  const asc = t?.western.ascendant?.sign;
  const nums = t
    ? [
        { label: 'Caminho de Vida', v: t.numerology.lifePath },
        { label: 'Expressão', v: t.numerology.expression },
        { label: 'Número da Personalidade', v: t.numerology.personality }
      ]
    : [];

  return (['E', 'A', 'C', 'N', 'I'] as TraitId[]).map((id) => {
    const score = c.traits?.find((x) => x.id === id)?.score ?? null;
    const voices: TraitVoice[] = [];
    const sign = (who: string, sg: SignName | undefined) => {
      if (!sg) return;
      if (SIGN_TRAITS[id].up.includes(sg)) voices.push({ source: `${who} em ${sg}`, dir: 1, why: `a astrologia associa ${sg} a mais ${TRAIT_LABEL[id].toLowerCase()}` });
      if (SIGN_TRAITS[id].down.includes(sg)) voices.push({ source: `${who} em ${sg}`, dir: -1, why: `a astrologia associa ${sg} a menos ${TRAIT_LABEL[id].toLowerCase()}` });
    };
    sign('Sol', sun);
    if (id === 'N') sign('Lua', moon);
    if (id === 'E') sign('Ascendente', asc);
    nums.forEach((x) => {
      const base = MASTER[x.v] ?? x.v;
      const nt = NUMBER_TRAITS[base];
      const d = nt?.dims[id];
      if (d) voices.push({ source: `${x.label} ${x.v}`, dir: d, why: `o ${base} fala de ${nt.theme}` });
    });
    const sum = voices.reduce((a, v) => a + v.dir, 0);
    const tradDir: 1 | -1 | 0 = sum > 0 ? 1 : sum < 0 ? -1 : 0;
    let verdict: TraitBridge['verdict'] = null;
    let explain = '';
    const L = TRAIT_LABEL[id].toLowerCase();
    if (score === null) {
      verdict = voices.length ? 'so_tradicao' : null;
      explain = voices.length ? 'Ainda não há o teste de personalidade para comparar.' : '';
    } else if (!voices.length) {
      verdict = 'so_ciencia';
      explain = `Nem o seu mapa nem os seus números falam de ${L}; o teste deu ${score} de 100.`;
    } else if (tradDir === 0) {
      verdict = 'dividida';
      explain = `As vozes das tradições se dividem (umas sugerem mais, outras menos ${L}); o teste deu ${score} de 100.`;
    } else {
      const high = tradDir > 0;
      verdict = high ? (score >= 60 ? 'converge' : score < 45 ? 'diverge' : 'parcial') : score <= 40 ? 'converge' : score > 55 ? 'diverge' : 'parcial';
      const says = `as tradições sugerem ${high ? 'mais' : 'menos'} ${L}`;
      explain =
        verdict === 'converge'
          ? `Coincidem: ${says}, e o teste deu ${score} de 100.`
          : verdict === 'diverge'
            ? `Não coincidem: ${says}, mas o teste deu ${score} de 100.`
            : `Coincidem em parte: ${says}, e o teste ficou no meio (${score} de 100).`;
    }
    return { id, label: TRAIT_LABEL[id], score, voices, tradDir, verdict, explain };
  });
}
