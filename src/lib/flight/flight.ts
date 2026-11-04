// src/lib/flight/flight.ts
// Plano de Voo: a Bússola (3 rumos sugeridos a partir do Mapa), o formato
// salvo, o diário de bordo e as perguntas da revisão do 7º dia.

import { Computed, Sources } from '../integration/integration';
import { LIFE_AREAS } from '../purpose/purpose';
import { TRAITS, ITEMS as IPIP_ITEMS } from '../psych/miniIpip';

export const FLIGHT_VERSION = 'voo-v1';
export const FLIGHT_DAYS = 7;

// ---------- Bússola ----------

export interface Heading {
  rumo: string; // id em RUMOS
  area?: string; // para o rumo 'area' (área da vida do Propósito)
  title: string;
  reasons: string[];
  score: number;
}

const AREA_LABEL = (id: string) => LIFE_AREAS.find((a) => a.id === id)?.label ?? id;

/** Sugere os rumos, do mais ao menos prioritário */
export function compassHeadings(s: Sources, c: Computed): Heading[] {
  const out: Heading[] = [];
  const bodyArea = (id: string) => c.body?.areas.find((a) => a.id === id)?.score;
  const prio = (id: string) => c.body?.priorities.find((p) => p.id === id);
  const cascade: Record<string, number> = { sono: 15, movimento: 10 };

  // Corpo: urgência (100 − escore) + importância declarada + efeito cascata
  for (const [rumo, areaId, prioId] of [
    ['sono', 'sono', 'sono'],
    ['movimento', 'movimento', 'movimento'],
    ['alimentacao', 'alimentacao', 'alimentacao'],
    ['digestao', 'digestao', 'digestao'],
    ['bemestar', 'bemestar', 'energia']
  ] as const) {
    const v = bodyArea(areaId);
    if (typeof v !== 'number') continue;
    const p = prio(prioId);
    const reasons = [`${rumo === 'bemestar' ? 'Bem-estar' : c.body!.areas.find((a) => a.id === areaId)!.label} mede ${v} de 100.`];
    if (p) reasons.push(`Você deu importância ${p.importance} de 10${p.mismatch === 'se_ve_melhor' ? `, e se vê melhor (${p.satisfaction}/10) do que as respostas mostram` : ''}.`);
    if (cascade[rumo]) reasons.push(rumo === 'sono' ? 'O sono puxa atenção, humor e energia.' : 'O movimento puxa humor, sono e disposição.');
    out.push({ rumo, title: '', reasons, score: (100 - v) * 0.6 + (p ? p.importance * 3 : 15) + (cascade[rumo] ?? 0) });
  }

  // Mente: foco
  const att = c.mind?.find((a) => a.id === 'atencao')?.score;
  const ctl = c.mind?.find((a) => a.id === 'controle')?.score;
  const foco = [att, ctl].filter((x): x is number => typeof x === 'number');
  if (foco.length) {
    const v = Math.round(foco.reduce((a, b) => a + b, 0) / foco.length);
    out.push({ rumo: 'foco', title: '', reasons: [`Foco nos testes: ${v} de 100.`], score: (100 - v) * 0.6 + 15 });
  }

  // Personalidade: estabilidade emocional e organização
  const n = c.traits?.find((t) => t.id === 'N');
  const ng = c.gaps.find((g) => g.id === 'N');
  if (n && (n.score < 50 || (ng && ng.gap >= 16))) {
    out.push({
      rumo: 'emocoes',
      title: '',
      reasons: [`Estabilidade emocional em ${n.score}${ng && ng.gap >= 16 ? `, e você quer chegar a ${ng.ideal}` : ''}.`],
      score: (100 - n.score) * 0.6 + (ng ? Math.max(0, ng.gap) * 0.5 : 0)
    });
  }
  const cg = c.gaps.find((g) => g.id === 'C');
  if (cg && cg.gap >= 16) {
    out.push({ rumo: 'organizacao', title: '', reasons: [`Você quer ser mais organizado(a): hoje ${cg.real}, desejado ${cg.ideal}.`], score: cg.gap * 1.2 });
  }

  // Propósito: relações e a área da vida com maior distância
  if (c.life) {
    const rel = c.life.areas.filter((x) => ['familia', 'casal', 'amizades'].includes(x.id) && x.gap >= 3).sort((a, b) => b.gap - a.gap);
    if (rel.length) {
      out.push({
        rumo: 'relacoes',
        title: '',
        reasons: rel.map((x) => `${x.label}: importância ${x.importance}, vivida ${x.coherence}.`),
        score: rel[0].gap * 10 + rel[0].importance * 2
      });
    }
    const other = c.life.areas.filter((x) => !['familia', 'casal', 'amizades', 'saude'].includes(x.id) && x.gap >= 3).sort((a, b) => b.gap - a.gap)[0];
    if (other) {
      out.push({
        rumo: 'area',
        area: other.id,
        title: '',
        reasons: [`${other.label}: importância ${other.importance}, vivida ${other.coherence}.`],
        score: other.gap * 10 + other.importance * 2
      });
    }
  }

  return out
    .sort((a, b) => b.score - a.score)
    .map((h) => ({ ...h, score: Math.round(h.score) }));
}

// ---------- Formato salvo ----------

export interface DayLog {
  feitas: string[];
  energia?: number;
  nota?: string;
}

export interface FlightData {
  versao: typeof FLIGHT_VERSION;
  rumo: string;
  area?: string;
  porque: string[];
  destino?: string;
  woop: { desejo: string; resultado: string; obstaculo: string; plano: string };
  praticas: { id: string; ancora: string }[];
  inicio: string; // AAAA-MM-DD
  diario: Record<string, DayLog>;
  baseline: Record<string, number>;
  revisao?: { respostas: Record<string, number>; data: string; comentario?: string };
  argonauta?: boolean;
}

export function flightFromSaved(raw: any): FlightData | null {
  if (!raw || raw.versao !== FLIGHT_VERSION) return null;
  return raw as FlightData;
}

export const isoDay = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const addDays = (iso: string, n: number) => {
  const [y, m, d] = iso.split('-').map(Number);
  return isoDay(new Date(y, m - 1, d + n));
};
export const dayIndex = (inicio: string, today: string) => {
  const [y1, m1, d1] = inicio.split('-').map(Number);
  const [y2, m2, d2] = today.split('-').map(Number);
  return Math.round((new Date(y2, m2 - 1, d2).getTime() - new Date(y1, m1 - 1, d1).getTime()) / 86400000);
};

// ---------- Revisão do 7º dia ----------
// OMS-5 para todos + uma ou quatro perguntas do rumo, repetidas do módulo de origem.

export interface ReviewQuestion {
  id: string;
  text: string;
  scale: { value: number; label: string }[];
  /** id da resposta original (para o “antes”) */
  from: string;
  reversed?: boolean;
}

const WHO5_SCALE = [
  { value: 5, label: 'O tempo todo' },
  { value: 4, label: 'A maior parte do tempo' },
  { value: 3, label: 'Mais da metade do tempo' },
  { value: 2, label: 'Menos da metade do tempo' },
  { value: 1, label: 'De vez em quando' },
  { value: 0, label: 'Nunca' }
];
const ZERO_TEN = Array.from({ length: 11 }, (_, i) => ({ value: i, label: String(i) }));
const ONE_TEN = Array.from({ length: 10 }, (_, i) => ({ value: i + 1, label: String(i + 1) }));
const IPIP_SCALE = [
  { value: 1, label: 'Não tem nada a ver comigo' },
  { value: 2, label: 'Tem pouco a ver comigo' },
  { value: 3, label: 'Mais ou menos' },
  { value: 4, label: 'Tem a ver comigo' },
  { value: 5, label: 'Tem tudo a ver comigo' }
];

export const WHO5_REVIEW: ReviewQuestion[] = [
  { id: 'w1', from: 'w1', scale: WHO5_SCALE, text: 'Nos últimos dias, eu me senti alegre e de bom humor.' },
  { id: 'w2', from: 'w2', scale: WHO5_SCALE, text: 'Eu me senti calmo(a) e tranquilo(a).' },
  { id: 'w3', from: 'w3', scale: WHO5_SCALE, text: 'Eu me senti ativo(a) e com energia.' },
  { id: 'w4', from: 'w4', scale: WHO5_SCALE, text: 'Eu acordei me sentindo descansado(a) e revigorado(a).' },
  { id: 'w5', from: 'w5', scale: WHO5_SCALE, text: 'Meu dia a dia foi preenchido com coisas que me interessam.' }
];

const BODY_SAT: Record<string, string> = { sono: 'sono', movimento: 'movimento', alimentacao: 'alimentacao', digestao: 'digestao', bemestar: 'energia' };
const BODY_LABEL: Record<string, string> = { sono: 'seu sono', movimento: 'sua atividade física', alimentacao: 'sua alimentação', digestao: 'sua digestão', energia: 'sua energia e disposição' };

export function reviewQuestions(f: FlightData): ReviewQuestion[] {
  const specific: ReviewQuestion[] = [];
  if (BODY_SAT[f.rumo]) {
    const id = BODY_SAT[f.rumo];
    specific.push({ id: `sat_${id}`, from: `sat_${id}`, scale: ZERO_TEN, text: `De 0 a 10, quão satisfeito(a) você está hoje com ${BODY_LABEL[id]}?` });
  } else if (f.rumo === 'foco') {
    specific.push({ id: 'self_controle', from: 'self_controle', scale: ZERO_TEN, text: 'De 0 a 10, como você avalia hoje o seu foco (não se distrair, resistir ao impulso)?' });
  } else if (f.rumo === 'emocoes' || f.rumo === 'organizacao') {
    const trait = f.rumo === 'emocoes' ? 'N' : 'C';
    IPIP_ITEMS.filter((i) => i.trait === trait).forEach((i) => specific.push({ id: i.id, from: i.id, scale: IPIP_SCALE, text: i.text }));
  } else if (f.rumo === 'relacoes') {
    ['familia', 'casal', 'amizades'].forEach((a) =>
      specific.push({ id: `coe_${a}`, from: `coe_${a}`, scale: ONE_TEN, text: `${AREA_LABEL(a)}: de 1 a 10, quanto você viveu de acordo com o que é importante nesta área nos últimos dias?` })
    );
  } else if (f.rumo === 'area' && f.area) {
    specific.push({ id: `coe_${f.area}`, from: `coe_${f.area}`, scale: ONE_TEN, text: `${AREA_LABEL(f.area)}: de 1 a 10, quanto você viveu de acordo com o que é importante nesta área nos últimos dias?` });
  }
  return [...specific, ...WHO5_REVIEW];
}

/** Respostas originais (o “antes”), lidas dos módulos */
export function baselineFrom(s: Sources): Record<string, number> {
  const out: Record<string, number> = {};
  const put = (k: string, v: unknown) => {
    if (typeof v === 'number') out[k] = v;
  };
  const b = s.body?.respostas ?? {};
  ['w1', 'w2', 'w3', 'w4', 'w5', 'sat_sono', 'sat_movimento', 'sat_alimentacao', 'sat_digestao', 'sat_energia'].forEach((k) => put(k, b[k]));
  put('self_controle', s.mind?.autoavaliacao?.controle);
  const p = s.psych?.respostas ?? {};
  IPIP_ITEMS.filter((i) => i.trait === 'N' || i.trait === 'C').forEach((i) => put(i.id, p[i.id]));
  const pu = s.purpose?.respostas ?? {};
  LIFE_AREAS.forEach((a) => put(`coe_${a.id}`, pu[`coe_${a.id}`]));
  return out;
}

/** Converte um conjunto de respostas no indicador comparável (0–100) */
export function reviewScores(f: FlightData, answers: Record<string, number>) {
  const qs = reviewQuestions(f);
  const who = WHO5_REVIEW.map((q) => answers[q.id]);
  const wellbeing = who.every((x) => typeof x === 'number') ? (who as number[]).reduce((a, b) => a + b, 0) * 4 : null;
  const spec = qs.filter((q) => !WHO5_REVIEW.includes(q));
  let specific: number | null = null;
  if (spec.length && spec.every((q) => typeof answers[q.id] === 'number')) {
    if (f.rumo === 'emocoes' || f.rumo === 'organizacao') {
      const trait = TRAITS.find((t) => t.id === (f.rumo === 'emocoes' ? 'N' : 'C'))!;
      const used = spec.map((q) => {
        const item = IPIP_ITEMS.find((i) => i.id === q.id)!;
        let v = item.reversed ? 6 - answers[q.id] : answers[q.id];
        if (trait.inverted) v = 6 - v;
        return v;
      });
      specific = Math.round(((used.reduce((a, b) => a + b, 0) / used.length - 1) / 4) * 100);
    } else {
      const max = spec[0].scale[spec[0].scale.length - 1].value;
      const min = spec[0].scale[0].value;
      specific = Math.round(((spec.reduce((a, q) => a + answers[q.id], 0) / spec.length - min) / (max - min)) * 100);
    }
  }
  return { wellbeing, specific };
}
