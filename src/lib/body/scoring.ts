// src/lib/body/scoring.ts
// Cálculos do módulo Corpo. Cada resultado guarda os passos da conta
// (`steps`) para a página mostrar exatamente como chegou ao número.

import { BodyAnswers, GUIA_ATTENTION, GUIA_ITEMS, PRIORITY_AREAS, SIGNALS, WAKE_WINDOWS } from './questions';

type Level = 'bom' | 'medio' | 'atencao';

export interface Dimension {
  id: string;
  label: string;
  value: string;
  points: 0 | 1 | 2;
  rule: string;
}

export interface AreaScore {
  id: 'sono' | 'movimento' | 'alimentacao' | 'digestao' | 'bemestar';
  label: string;
  score: number; // 0–100
  level: Level;
  summary: string;
  dimensions?: Dimension[];
  steps: string[];
}

export interface Flag {
  id: string;
  label: string;
  detail: string;
  level: Level;
}

export interface Relation {
  id: string;
  title: string;
  seen: string;
  science: string;
  strength: 'forte' | 'moderada' | 'possível';
  /** Leitura da Medicina Tradicional Chinesa, mostrada separada da ciência */
  tradition?: string;
}

export interface Priority {
  id: string;
  label: string;
  satisfaction: number;
  importance: number;
  measured?: number;
  /** importância × (10 − satisfação) */
  weight: number;
  mismatch?: 'se_ve_melhor' | 'se_ve_pior';
}

export interface Composition {
  bmi: number;
  bmiLabel: string;
  whtr?: number;
  whtrLabel?: string;
  waistLabel?: string;
  steps: string[];
}

export interface BodyReport {
  composition: Composition | null;
  areas: AreaScore[];
  flags: Flag[];
  relations: Relation[];
  signals: string[];
  priorities: Priority[];
  who5: number;
  audit: number | null;
  auditPositive: boolean;
  fitness: { sitRise?: number; oneLeg?: number };
}

// ---------- utilidades ----------

const n = (a: BodyAnswers, id: string): number => (typeof a[id] === 'number' ? (a[id] as number) : 0);
const has = (a: BodyAnswers, id: string) => typeof a[id] === 'number';
const fmt1 = (x: number) => x.toFixed(1).replace('.', ',');
const level = (score: number): Level => (score >= 70 ? 'bom' : score >= 45 ? 'medio' : 'atencao');
const pts = (good: boolean, fair: boolean): 0 | 1 | 2 => (good ? 2 : fair ? 1 : 0);

/** "23:30" → minutos desde 00:00 */
export const toMin = (t: unknown): number | null => {
  if (typeof t !== 'string' || !/^\d{1,2}:\d{2}$/.test(t)) return null;
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

/** Duração entre dormir e acordar, atravessando a meia-noite */
const between = (start: number, end: number) => ((end - start + 1440) % 1440) || 1440;

export const hhmm = (min: number) => {
  const m = ((Math.round(min) % 1440) + 1440) % 1440;
  return `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
};
export const hours = (min: number) => {
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  return m ? `${h} h ${m} min` : `${h} h`;
};

// ---------- Sono ----------

/** Minutos acordado(a) durante a noite (zero se disse que dorme direto) */
export const nightAwake = (a: BodyAnswers) => (a.despertar === 'nao' ? 0 : n(a, 'acordado_noite'));

export interface SleepCalc {
  durWork: number;
  durFree: number;
  durAvg: number;
  midFree: number;
  midWork: number;
  socialJetlag: number;
  awake: number;
}

export function sleepCalc(a: BodyAnswers): SleepCalc | null {
  const dw = toMin(a.dorme_trab);
  const aw = toMin(a.acorda_trab);
  const df = toMin(a.dorme_livre);
  const af = toMin(a.acorda_livre);
  if (dw === null || aw === null || df === null || af === null) return null;
  const lat = n(a, 'latencia');
  const waso = nightAwake(a);
  const inBedW = between(dw, aw);
  const inBedF = between(df, af);
  const durWork = Math.max(0, inBedW - lat - waso);
  const durFree = Math.max(0, inBedF - lat - waso);
  const durAvg = (5 * durWork + 2 * durFree) / 7;
  // Meio do sono: início do sono (luz apagada + latência) + metade da duração
  const midWork = (dw + lat + durWork / 2) % 1440;
  const midFree = (df + lat + durFree / 2) % 1440;
  const diff = Math.abs(midFree - midWork);
  const socialJetlag = Math.min(diff, 1440 - diff);
  return { durWork, durFree, durAvg, midFree, midWork, socialJetlag, awake: lat + waso };
}

/** Distância (min) entre um horário e o intervalo [ini, fim] de madrugada */
const distToWindow = (t: number, ini: number, fim: number) => {
  const x = t > 720 ? t - 1440 : t; // 23:00 vira −60
  if (x >= ini && x <= fim) return 0;
  return x < ini ? ini - x : x - fim;
};

function scoreSleep(a: BodyAnswers): AreaScore | null {
  const c = sleepCalc(a);
  if (!c) return null;
  const reg = n(a, 'regularidade');
  const alert = n(a, 'sonolencia');
  const sat = n(a, 'satisfacao_sono');
  const timingDist = distToWindow(c.midFree, 120, 240);

  const dims: Dimension[] = [
    {
      id: 'regularidade',
      label: 'Regularidade',
      value: `${['Nunca', 'Raramente', 'Às vezes', 'Frequentemente', 'Sempre'][reg]} em horários parecidos; diferença de ${hours(c.socialJetlag)} entre o meio do sono em dias de trabalho e livres`,
      points: pts(reg >= 3 && c.socialJetlag < 60, reg >= 2 && c.socialJetlag < 120),
      rule: 'Bom: horários parecidos frequentemente e diferença menor que 1 h. Médio: às vezes e menor que 2 h.'
    },
    {
      id: 'duracao',
      label: 'Duração',
      value: `${hours(c.durAvg)} por noite, em média (trabalho ${hours(c.durWork)}, livres ${hours(c.durFree)})`,
      points: pts(c.durAvg >= 420 && c.durAvg <= 540, c.durAvg >= 360 && c.durAvg <= 600),
      rule: 'Bom: 7 a 9 h. Médio: 6 a 10 h. Média ponderada: 5 dias de trabalho e 2 livres.'
    },
    {
      id: 'horario',
      label: 'Horário',
      value: `meio do sono às ${hhmm(c.midFree)} nos dias livres`,
      points: pts(timingDist === 0, timingDist <= 60),
      rule: 'Bom: meio do sono entre 2h e 4h. Médio: até 1 h fora dessa janela.'
    },
    {
      id: 'eficiencia',
      label: 'Eficiência',
      value: `${c.awake} min acordado(a) na cama (para pegar no sono + durante a noite)`,
      points: pts(c.awake < 30, c.awake <= 60),
      rule: 'Bom: menos de 30 min. Médio: até 1 h.'
    },
    {
      id: 'alerta',
      label: 'Alerta durante o dia',
      value: `luta contra o sono: ${['nunca', 'raramente', 'às vezes', 'frequentemente', 'sempre'][alert]}`,
      points: pts(alert <= 1, alert === 2),
      rule: 'Bom: nunca ou raramente. Médio: às vezes.'
    },
    {
      id: 'satisfacao',
      label: 'Satisfação',
      value: ['nada', 'pouco', 'mais ou menos', 'satisfeito(a)', 'muito satisfeito(a)'][sat],
      points: pts(sat >= 3, sat === 2),
      rule: 'Bom: satisfeito(a) ou muito. Médio: mais ou menos.'
    }
  ];
  const total = dims.reduce((s, d) => s + d.points, 0);
  const score = Math.round((total / 12) * 100);
  return {
    id: 'sono',
    label: 'Sono',
    score,
    level: level(score),
    summary: `${dims.filter((d) => d.points === 2).length} de 6 dimensões em bom nível.`,
    dimensions: dims,
    steps: [
      `Cada dimensão vale 0, 1 ou 2 pontos: ${dims.map((d) => `${d.label.toLowerCase()} ${d.points}`).join(', ')}.`,
      `Total ${total} de 12 → ${total} ÷ 12 × 100 = ${score}.`
    ]
  };
}

// ---------- Movimento (IPAQ curto) ----------

export interface ActivityCalc {
  vig: number; // minutos/semana
  mod: number;
  walk: number;
  met: number;
  whoMinutes: number;
  category: 'Baixo' | 'Moderado' | 'Alto';
  sittingAvg: number;
}

const capDay = (m: number) => Math.min(m, 180); // regra do IPAQ: no máximo 180 min/dia por tipo

export function activityCalc(a: BodyAnswers): ActivityCalc {
  const vd = n(a, 'vig_dias');
  const md = n(a, 'mod_dias');
  const wd = n(a, 'cam_dias');
  const vmin = vd ? capDay(n(a, 'vig_min')) : 0;
  const mmin = md ? capDay(n(a, 'mod_min')) : 0;
  const wmin = wd ? capDay(n(a, 'cam_min')) : 0;
  const vig = vd * (vmin >= 10 ? vmin : 0);
  const mod = md * (mmin >= 10 ? mmin : 0);
  const walk = wd * (wmin >= 10 ? wmin : 0);
  const met = 8 * vig + 4 * mod + 3.3 * walk;
  const days = Math.min(7, vd + md + wd);

  // Categorias do protocolo de pontuação do IPAQ (2005)
  let category: ActivityCalc['category'] = 'Baixo';
  if ((vd >= 3 && 8 * vig >= 1500) || (days >= 7 && met >= 3000)) category = 'Alto';
  else if ((vd >= 3 && vmin >= 20) || (md + wd >= 5 && Math.max(mmin, wmin) >= 30) || (days >= 5 && met >= 600)) category = 'Moderado';

  const sittingAvg = (5 * n(a, 'sentado_semana') + 2 * n(a, 'sentado_fds')) / 7;
  return { vig, mod, walk, met: Math.round(met), whoMinutes: mod + walk + 2 * vig, category, sittingAvg };
}

function scoreMovement(a: BodyAnswers): AreaScore {
  const c = activityCalc(a);
  const score = Math.min(100, Math.round((c.whoMinutes / 300) * 100));
  return {
    id: 'movimento',
    label: 'Movimento',
    score,
    level: level(score),
    summary:
      c.whoMinutes >= 150
        ? `${c.whoMinutes} minutos semanais: dentro da recomendação da OMS (150 a 300).`
        : `${c.whoMinutes} minutos semanais: abaixo dos 150 recomendados pela OMS.`,
    steps: [
      `Vigorosa: ${n(a, 'vig_dias')} dias × ${n(a, 'vig_dias') ? capDay(n(a, 'vig_min')) : 0} min = ${c.vig} min. Moderada: ${c.mod} min. Caminhada: ${c.walk} min.`,
      `Minutos equivalentes (OMS): moderada + caminhada + 2 × vigorosa = ${c.mod} + ${c.walk} + 2 × ${c.vig} = ${c.whoMinutes}.`,
      `Escore: ${c.whoMinutes} ÷ 300 × 100, limitado a 100 = ${score}. (300 min é o topo da faixa recomendada.)`,
      `IPAQ: ${c.met} MET-min/semana (8 × vigorosa + 4 × moderada + 3,3 × caminhada), nível ${c.category.toLowerCase()}.`
    ]
  };
}

// ---------- Alimentação ----------

export function guiaCalc(a: BodyAnswers) {
  const items = GUIA_ITEMS.map((g) => {
    const raw = n(a, g.id);
    return { ...g, raw, used: g.reversed ? 3 - raw : raw };
  });
  const total = items.reduce((s, i) => s + i.used, 0);
  return { items, total };
}

export function fiberCalc(a: BodyAnswers) {
  const parts = [
    { id: 'f_frutas', label: 'frutas' },
    { id: 'f_verduras', label: 'verduras e legumes' },
    { id: 'f_feijao', label: 'feijão e leguminosas' },
    { id: 'f_integrais', label: 'grãos integrais' }
  ].map((p) => ({ ...p, days: n(a, p.id) }));
  const score = Math.round((parts.reduce((s, p) => s + p.days, 0) / 28) * 100);
  return { parts, score };
}

function scoreFood(a: BodyAnswers): AreaScore {
  const g = guiaCalc(a);
  const f = fiberCalc(a);
  const guiaScore = Math.round((g.total / 72) * 100);
  const score = Math.round(0.7 * guiaScore + 0.3 * f.score);
  return {
    id: 'alimentacao',
    label: 'Alimentação',
    score,
    level: level(score),
    summary: `Práticas do Guia Alimentar: ${g.total} de 72 pontos. Fontes de fibra: ${f.score} de 100.`,
    steps: [
      `Guia Alimentar: 24 frases de 0 a 3 pontos (nas 11 frases contrárias ao Guia, “nunca” vale 3). Total ${g.total} de 72 → ${guiaScore} de 100.`,
      'Referência: a média de 1.309 adultos brasileiros no estudo de validação foi 44,1 pontos.',
      `Fontes de fibra: dias na semana com ${f.parts.map((p) => `${p.label} (${fmt1(p.days)})`).join(', ')}. Soma ÷ 28 × 100 = ${f.score}.`,
      `Escore da área: 70% Guia + 30% fibra = 0,7 × ${guiaScore} + 0,3 × ${f.score} = ${score}.`,
      ...foodProfile(a).map((x) => `Radar, ${x.label.toLowerCase()} (${x.value}): ${x.rule}`)
    ]
  };
}

// ---------- Perfil da alimentação (radar) ----------

export interface FoodAxis {
  id: string;
  label: string;
  value: number; // 0–100, maior = mais alinhado às recomendações
  rule: string;
}

/** Eixos do radar da alimentação. Eixos sem resposta (versões antigas) ficam de fora. */
export function foodProfile(a: BodyAnswers): FoodAxis[] {
  const d = (id: string) => (has(a, id) ? n(a, id) / 7 : null);
  const g = (id: string, reversed = false) => (has(a, id) ? (reversed ? 3 - n(a, id) : n(a, id)) / 3 : null);
  const avg = (xs: (number | null)[]) => (xs.some((x) => x === null) ? null : (xs as number[]).reduce((s, x) => s + x, 0) / xs.length);
  const inv = (x: number | null) => (x === null ? null : 1 - x);
  const axes: { id: string; label: string; v: number | null; rule: string }[] = [
    { id: 'frutas', label: 'Frutas e verduras', v: avg([d('f_frutas'), d('f_verduras')]), rule: 'Média dos dias na semana com frutas e com verduras ou legumes, ÷ 7.' },
    { id: 'integrais', label: 'Integrais', v: d('f_integrais'), rule: 'Dias com arroz, pão ou massa integral, aveia ou outros grãos integrais, ÷ 7.' },
    { id: 'leguminosas', label: 'Leguminosas', v: d('f_feijao'), rule: 'Dias com feijão, lentilha, grão-de-bico ou ervilha, ÷ 7.' },
    { id: 'proteinas', label: 'Proteínas', v: avg([d('f_proteina'), d('f_laticinios')]), rule: 'Média dos dias com carne, frango, peixe ou ovos e com leite ou queijo, ÷ 7.' },
    {
      id: 'gorduras',
      label: 'Gorduras boas',
      v: avg([d('f_castanhas'), inv(d('f_frituras'))]),
      rule: 'Média entre os dias com castanhas, sementes ou abacate e os dias SEM frituras, ÷ 7.'
    },
    { id: 'fermentados', label: 'Fermentados', v: d('f_fermentados'), rule: 'Dias com iogurte natural, kefir, coalhada ou outros fermentados, ÷ 7.' },
    {
      id: 'lanches',
      label: 'Poucos lanches',
      v: g('g14', true),
      rule: 'Frase do Guia sobre beliscar entre as refeições: quanto menos, mais para fora (“nunca” vale 3), ÷ 3.'
    },
    {
      id: 'acucar',
      label: 'Pouco açúcar',
      v: avg([g('g15', true), g('g21', true), g('g22', true), g('g23', true)]),
      rule: 'Frases do Guia sobre açúcar no café, guloseimas, sucos industrializados e refrigerante, com “nunca” valendo mais.'
    },
    {
      id: 'processados',
      label: 'Pouco processado',
      v: avg([inv(d('f_ultra')), g('g16', true), g('g18', true)]),
      rule: 'Dias SEM ultraprocessados, e as frases sobre trocar refeição por lanche e frequentar fast-food, com “nunca” valendo mais.'
    },
    {
      id: 'jeito',
      label: 'Jeito de comer',
      v: avg([g('g04'), g('g11'), g('g17', true), g('g19', true), g('g20', true), g('g24', true)]),
      rule: 'Frases do Guia sobre comer com calma, à mesa, sem pular refeições, longe do sofá, da cama e da mesa de trabalho.'
    }
  ];
  return axes.filter((x) => x.v !== null).map((x) => ({ id: x.id, label: x.label, value: Math.round((x.v as number) * 100), rule: x.rule }));
}

// ---------- Digestão ----------

function scoreDigestion(a: BodyAnswers): AreaScore {
  const b = n(a, 'bristol');
  const ev = n(a, 'evacuacoes');
  const eff = n(a, 'esforco') + n(a, 'incompleta');
  const sym = n(a, 'inchaco') + n(a, 'azia') + n(a, 'gases');
  const dims: Dimension[] = [
    {
      id: 'bristol',
      label: 'Formato (Bristol)',
      value: `tipo ${b}`,
      points: pts(b === 3 || b === 4, b === 2 || b === 5),
      rule: 'Bom: tipos 3 e 4. Médio: 2 e 5. Atenção: 1, 6 e 7.'
    },
    {
      id: 'frequencia',
      label: 'Frequência',
      value: ['', 'menos de 3 vezes por semana', '3 a 6 vezes por semana', '1 vez por dia', '2 a 3 vezes por dia', 'mais de 3 vezes por dia'][ev],
      points: pts(ev >= 2 && ev <= 4, false),
      rule: 'Bom: de 3 vezes por semana a 3 vezes por dia (faixa considerada normal).'
    },
    {
      id: 'esforco',
      label: 'Esforço e esvaziamento',
      value: `${eff} de 6 pontos de dificuldade`,
      points: pts(eff <= 1, eff <= 3),
      rule: 'Bom: até 1. Médio: até 3.'
    },
    {
      id: 'sintomas',
      label: 'Inchaço, azia e gases',
      value: `${sym} de 9 pontos de frequência`,
      points: pts(sym <= 1, sym <= 4),
      rule: 'Bom: até 1. Médio: até 4.'
    }
  ];
  const total = dims.reduce((s, d) => s + d.points, 0);
  const score = Math.round((total / 8) * 100);
  return {
    id: 'digestao',
    label: 'Digestão',
    score,
    level: level(score),
    summary: `${dims.filter((d) => d.points === 2).length} de 4 aspectos em bom nível.`,
    dimensions: dims,
    steps: [`Cada aspecto vale 0, 1 ou 2 pontos. Total ${total} de 8 → ${total} ÷ 8 × 100 = ${score}.`]
  };
}

// ---------- Bem-estar (OMS-5) ----------

function scoreWellbeing(a: BodyAnswers): AreaScore {
  const raw = ['w1', 'w2', 'w3', 'w4', 'w5'].reduce((s, id) => s + n(a, id), 0);
  const score = raw * 4;
  return {
    id: 'bemestar',
    label: 'Bem-estar',
    score,
    level: score > 50 ? (score >= 70 ? 'bom' : 'medio') : 'atencao',
    summary:
      score > 50 ? 'Bem-estar adequado nas últimas duas semanas.' : 'Bem-estar baixo nas últimas duas semanas (50 ou menos no índice da OMS).',
    steps: [`OMS-5: 5 frases de 0 a 5 pontos. Soma ${raw} de 25 × 4 = ${score}.`, 'Na pesquisa, 50 ou menos indica bem-estar baixo.']
  };
}

// ---------- Medidas ----------

function composition(a: BodyAnswers): Composition | null {
  const h = n(a, 'altura') / 100;
  const w = n(a, 'peso');
  if (!h || !w) return null;
  const bmi = w / (h * h);
  const bmiLabel = bmi < 18.5 ? 'abaixo do peso' : bmi < 25 ? 'faixa adequada' : bmi < 30 ? 'sobrepeso' : 'obesidade';
  const hm = h.toFixed(2).replace('.', ',');
  const steps = [`IMC = peso ÷ altura² = ${fmt1(w)} ÷ (${hm} × ${hm}) = ${fmt1(bmi)}.`];
  const c: Composition = { bmi, bmiLabel, steps };
  const waist = has(a, 'cintura') ? n(a, 'cintura') : 0;
  if (waist) {
    const whtr = waist / n(a, 'altura');
    c.whtr = whtr;
    c.whtrLabel = whtr < 0.5 ? 'adequada' : whtr < 0.6 ? 'atenção' : 'alta';
    const female = a.sexo === 'F';
    const [inc, high] = female ? [80, 88] : [94, 102];
    c.waistLabel = waist < inc ? 'abaixo do limite de risco' : waist < high ? 'risco aumentado' : 'risco bem aumentado';
    steps.push(`Cintura ÷ altura = ${waist} ÷ ${n(a, 'altura')} = ${whtr.toFixed(2).replace('.', ',')}. Até 0,5 é o recomendado.`);
    steps.push(`Cintura de ${waist} cm: limites da OMS para ${female ? 'mulheres' : 'homens'} são ${inc} cm (risco aumentado) e ${high} cm (bem aumentado).`);
  }
  return c;
}

// ---------- Relatório completo ----------

export function buildReport(a: BodyAnswers): BodyReport {
  const sleep = scoreSleep(a);
  const movement = scoreMovement(a);
  const food = scoreFood(a);
  const digestion = scoreDigestion(a);
  const wellbeing = scoreWellbeing(a);
  const areas = [sleep, movement, food, digestion, wellbeing].filter(Boolean) as AreaScore[];

  const sc = sleepCalc(a);
  const act = activityCalc(a);
  const fiber = fiberCalc(a);
  const female = a.sexo === 'F';

  // AUDIT-C
  const audit = has(a, 'alc1') ? n(a, 'alc1') + (n(a, 'alc1') > 0 ? n(a, 'alc2') + n(a, 'alc3') : 0) : null;
  const auditPositive = audit !== null && audit >= (female ? 3 : 4);

  // Alertas de hábitos
  const flags: Flag[] = [];
  const bedtime = toMin(a.dorme_trab);
  const caffeineLast = n(a, 'cafeina_ultima');
  const caffeineLate = n(a, 'cafeina_qtd') > 0 && bedtime !== null && (bedtime < 720 ? bedtime + 1440 : bedtime) - caffeineLast * 60 < 360;
  if (caffeineLate) flags.push({ id: 'cafeina', level: 'atencao', label: 'Cafeína perto da hora de dormir', detail: 'A última dose fica a menos de 6 horas de apagar a luz.' });
  if (n(a, 'telas') >= 3) flags.push({ id: 'telas', level: 'medio', label: 'Telas na última hora antes de dormir', detail: 'Frequentemente ou sempre.' });
  if (n(a, 'luz_manha') < 3) flags.push({ id: 'luz', level: 'medio', label: 'Pouca luz do dia pela manhã', detail: 'Menos de 3 dias por semana.' });
  if (act.sittingAvg >= 480) flags.push({ id: 'sentado', level: 'atencao', label: 'Muito tempo sentado(a)', detail: `${hours(act.sittingAvg)} por dia, em média.` });
  if (n(a, 'agua') <= 3) flags.push({ id: 'agua', level: 'medio', label: 'Pouca água', detail: 'Menos de 4 copos por dia.' });
  const urine = n(a, 'urina');
  if (urine === 6)
    flags.push({
      id: 'urina',
      level: 'atencao',
      label: 'Urina marrom ou alaranjado-escura',
      detail: 'Se for frequente e não melhorar ao beber mais água, procure um profissional de saúde: pode ter outras causas além de pouca água.'
    });
  else if (urine >= 4)
    flags.push({
      id: 'urina',
      level: 'medio',
      label: 'Urina escura',
      detail: 'Costuma indicar pouca água. Vitaminas do complexo B, alguns alimentos e remédios também mudam a cor.'
    });
  if (n(a, 'f_ultra') >= 5) flags.push({ id: 'ultra', level: 'atencao', label: 'Ultraprocessados frequentes', detail: '5 dias ou mais na semana.' });
  if (auditPositive) flags.push({ id: 'alcool', level: 'atencao', label: 'Consumo de álcool de risco', detail: `AUDIT-C ${audit} (limite ${female ? 3 : 4}).` });
  if (['cigarro', 'vape', 'outro'].includes(String(a.tabaco))) flags.push({ id: 'tabaco', level: 'atencao', label: 'Uso de tabaco ou nicotina', detail: 'Parar é a mudança de maior impacto na saúde.' });

  // Relações entre áreas
  const relations: Relation[] = [];
  const hardStool = n(a, 'bristol') <= 2 || n(a, 'evacuacoes') === 1 || n(a, 'esforco') >= 2;
  if (hardStool && (fiber.score < 50 || n(a, 'agua') <= 5)) {
    relations.push({
      id: 'fibra-intestino',
      title: 'Fibras, água e intestino',
      strength: 'forte',
      seen: `Fezes mais duras ou pouco frequentes, com fontes de fibra em ${fiber.score} de 100 e ${n(a, 'agua') <= 3 ? 'menos de 4' : '4 a 6'} copos de água por dia.`,
      science: 'Aumentar fibras (frutas, verduras, feijão, integrais) e líquidos é a primeira recomendação das diretrizes para intestino preso.'
    });
  } else if (hardStool) {
    relations.push({
      id: 'intestino-sem-causa',
      title: 'Intestino preso mesmo com boa fibra',
      strength: 'moderada',
      seen: `Fezes mais duras ou pouco frequentes, apesar de fontes de fibra em ${fiber.score} de 100.`,
      science: 'Quando fibra e água já estão boas, vale investigar com um profissional: movimento, medicamentos e outras causas também influenciam.'
    });
  }
  if (urine >= 4 && urine <= 5 && n(a, 'agua') <= 5) {
    relations.push({
      id: 'agua-urina',
      title: 'Água e cor da urina',
      strength: 'moderada',
      seen: `Urina ${urine === 4 ? 'amarelo-escura' : 'cor de mel'} durante o dia, com ${n(a, 'agua') <= 3 ? 'menos de 4' : '4 a 6'} copos de água por dia.`,
      science:
        'Em pessoas saudáveis, a cor da urina acompanha razoavelmente bem a hidratação: amarelo-claro costuma indicar boa hidratação, e tons mais escuros, falta de água. A necessidade varia com calor, suor e atividade física.'
    });
  }
  if (n(a, 'bristol') >= 6 && n(a, 'f_ultra') >= 3.5) {
    relations.push({
      id: 'ultra-intestino',
      title: 'Ultraprocessados e fezes moles',
      strength: 'possível',
      seen: 'Fezes moles ou líquidas com ultraprocessados em vários dias da semana.',
      science: 'Há sinais de que ultraprocessados e alguns aditivos alteram a microbiota; vale observar se melhora ao reduzir. Diarreia persistente pede avaliação.'
    });
  }
  if (n(a, 'inchaco') + n(a, 'gases') >= 4 && n(a, 'f_ultra') >= 3.5) {
    relations.push({
      id: 'ultra-sintomas',
      title: 'Ultraprocessados, inchaço e gases',
      strength: 'possível',
      seen: 'Inchaço ou gases frequentes junto com ultraprocessados em vários dias.',
      science: 'Relação plausível, mas inchaço e gases têm muitas causas, inclusive alimentos saudáveis ricos em fibra. Um diário de 2 semanas ajuda a ver o padrão.'
    });
  }
  if (caffeineLate && sc && (n(a, 'latencia') >= 23 || n(a, 'satisfacao_sono') <= 1)) {
    relations.push({
      id: 'cafeina-sono',
      title: 'Cafeína e sono',
      strength: 'forte',
      seen: `Cafeína a menos de 6 h de dormir e ${n(a, 'latencia') >= 23 ? 'demora para pegar no sono' : 'pouca satisfação com o sono'}.`,
      science: 'Em estudo controlado, cafeína tomada até 6 h antes de dormir reduziu o sono em cerca de 1 hora.'
    });
  }
  if (n(a, 'telas') >= 3 && n(a, 'latencia') >= 23) {
    relations.push({
      id: 'telas-sono',
      title: 'Telas e demora para dormir',
      strength: 'moderada',
      seen: 'Telas frequentes na última hora e mais de 15 minutos para pegar no sono.',
      science: 'Luz e estímulo das telas à noite atrasam o sono; o efeito varia de pessoa para pessoa.'
    });
  }
  if (n(a, 'luz_manha') < 3 && sc && (sc.socialJetlag >= 90 || distToWindow(sc.midFree, 120, 240) > 60)) {
    relations.push({
      id: 'luz-ritmo',
      title: 'Luz da manhã e relógio biológico',
      strength: 'forte',
      seen: `Pouca luz pela manhã e ${sc.socialJetlag >= 90 ? `${hours(sc.socialJetlag)} de diferença entre dias de trabalho e livres` : `meio do sono às ${hhmm(sc.midFree)}`}.`,
      science: 'A luz da manhã é o principal sinal que acerta o relógio biológico; pouca luz cedo tende a atrasar o sono.'
    });
  }
  if (auditPositive && nightAwake(a) >= 30) {
    relations.push({
      id: 'alcool-sono',
      title: 'Álcool e despertares',
      strength: 'forte',
      seen: 'Consumo de álcool de risco e 30 minutos ou mais acordado(a) durante a noite.',
      science: 'O álcool ajuda a adormecer, mas fragmenta o sono na segunda metade da noite.'
    });
  }
  if (a.despertar === 'mesmo' && typeof a.despertar_horario === 'number') {
    const w = WAKE_WINDOWS.find((x) => x.start === a.despertar_horario);
    const lateNight = [1, 3, 5].includes(a.despertar_horario as number);
    relations.push({
      id: 'despertar-recorrente',
      title: 'Despertar sempre no mesmo horário',
      strength: 'possível',
      seen: `Você costuma acordar ${w ? w.label.toLowerCase() : 'sempre na mesma faixa de horário'}.`,
      science:
        (lateNight
          ? 'O cortisol, hormônio ligado ao despertar, começa a subir na segunda metade da noite e chega ao pico logo depois de acordar; estresse pode antecipar essa subida. '
          : '') +
        'Despertares regulares também são comuns com álcool à noite, vontade de urinar, refluxo, apneia ou ambiente (calor, barulho, luz). Anotar por 2 semanas o horário e o que aconteceu no dia ajuda a achar o gatilho.',
      tradition: w
        ? `No relógio dos órgãos da Medicina Tradicional Chinesa, o período ${w.label.toLowerCase()} é o de maior atividade ${w.of} (elemento ${w.element}), que se relaciona com ${w.reading}. Para a MTC, acordar sempre nesse horário sugere que essa função pode estar pedindo atenção.`
        : undefined
    });
  }
  if (act.whoMinutes < 150 && wellbeing.score <= 50) {
    relations.push({
      id: 'movimento-humor',
      title: 'Movimento e bem-estar',
      strength: 'forte',
      seen: `${act.whoMinutes} minutos de atividade por semana e bem-estar em ${wellbeing.score}.`,
      science: 'Atividade física regular melhora humor e disposição; o efeito aparece já com caminhadas.'
    });
  }
  if (n(a, 'sonolencia') >= 3 && sc && sc.durAvg < 420) {
    relations.push({
      id: 'sono-energia',
      title: 'Pouco sono e sonolência',
      strength: 'forte',
      seen: `Sonolência frequente durante o dia com ${hours(sc.durAvg)} de sono por noite.`,
      science: 'Dormir menos de 7 horas de forma repetida acumula sonolência e reduz atenção e humor.'
    });
  } else if (n(a, 'sonolencia') >= 3 && sc && sc.durAvg >= 420) {
    relations.push({
      id: 'sonolencia-sem-causa',
      title: 'Sonolência mesmo dormindo o suficiente',
      strength: 'moderada',
      seen: `Sonolência frequente com ${hours(sc.durAvg)} de sono por noite.`,
      science: 'Quando o tempo de sono é suficiente, sonolência frequente pode indicar sono de má qualidade (como ronco e apneia). Vale conversar com um profissional.'
    });
  }

  // Sinais
  const signals = Array.isArray(a.sinais) ? (a.sinais as string[]).filter((s) => SIGNALS.some((x) => x.value === s)) : [];

  // Prioridades: importância × espaço para melhorar, e contraste com o medido
  const measuredOf: Record<string, number | undefined> = {
    sono: sleep?.score,
    movimento: movement.score,
    alimentacao: food.score,
    digestao: digestion.score,
    energia: wellbeing.score
  };
  const priorities: Priority[] = PRIORITY_AREAS.map((p) => {
    const satisfaction = n(a, `sat_${p.id}`);
    const importance = n(a, `imp_${p.id}`);
    const measured = measuredOf[p.id];
    const pr: Priority = { id: p.id, label: p.label, satisfaction, importance, measured, weight: importance * (10 - satisfaction) };
    if (measured !== undefined) {
      const d = satisfaction * 10 - measured;
      if (d >= 35) pr.mismatch = 'se_ve_melhor';
      if (d <= -35) pr.mismatch = 'se_ve_pior';
    }
    return pr;
  }).sort((x, y) => y.weight - x.weight);

  const sr = a.teste_sentar;
  const ol = a.teste_pe;
  return {
    composition: composition(a),
    areas,
    flags,
    relations,
    signals,
    priorities,
    who5: wellbeing.score,
    audit,
    auditPositive,
    fitness: { sitRise: typeof sr === 'number' ? sr : undefined, oneLeg: typeof ol === 'number' ? ol : undefined }
  };
}

// ---------- Qualidade ----------

export interface BodyQuality {
  ok: boolean;
  issues: string[];
}

export function checkBodyQuality(a: BodyAnswers, blockTimes: Record<string, number>): BodyQuality {
  const issues: string[] = [];
  if (Math.abs(n(a, GUIA_ATTENTION.id) - GUIA_ATTENTION.expected) > 0) issues.push('A frase de atenção da alimentação não foi respondida como pedido.');
  const guiaRaw = GUIA_ITEMS.map((g) => n(a, g.id));
  const same = Math.max(...[0, 1, 2, 3].map((v) => guiaRaw.filter((x) => x === v).length));
  if (same >= 20) issues.push(`Na alimentação, a mesma resposta aparece em ${same} de 24 frases, inclusive em frases opostas.`);
  const foodSecs = (blockTimes.alimentacao ?? 0) / 1000;
  if (foodSecs > 0 && foodSecs < 50) issues.push(`O bloco de alimentação, com 35 perguntas, foi respondido em ${Math.round(foodSecs)} segundos.`);
  return { ok: issues.length === 0, issues };
}

// ---------- Formato salvo ----------

export const BODY_VERSION = 'corpo-v1';

export interface BodyData {
  versao: typeof BODY_VERSION;
  respostas: BodyAnswers;
  blocosConcluidos: string[];
  tempos: Record<string, number>;
  qualidade?: BodyQuality;
  concluidoEm?: string;
}

export function bodyFromSaved(raw: any): BodyData | null {
  if (!raw || raw.versao !== BODY_VERSION || typeof raw.respostas !== 'object') return null;
  return raw as BodyData;
}
