// src/lib/astro/chinese.ts
// Os Quatro Pilares (Bāzì): ano e mês pelos termos solares (o ano muda no
// Lì Chūn, Sol a 315°), dia pelo ciclo sexagenário e hora em ramos de 2 h.

import * as Astronomy from 'astronomy-engine';
import { birthInstant } from './western';
import type { BirthInput, ChineseChart, ChineseElement, Pillar } from './types';

const STEMS = ['Jiǎ', 'Yǐ', 'Bǐng', 'Dīng', 'Wù', 'Jǐ', 'Gēng', 'Xīn', 'Rén', 'Guǐ'];
const STEMS_HAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const STEM_ELEMENTS: ChineseElement[] = ['Madeira', 'Madeira', 'Fogo', 'Fogo', 'Terra', 'Terra', 'Metal', 'Metal', 'Água', 'Água'];

const BRANCHES = ['Zǐ', 'Chǒu', 'Yín', 'Mǎo', 'Chén', 'Sì', 'Wǔ', 'Wèi', 'Shēn', 'Yǒu', 'Xū', 'Hài'];
const BRANCHES_HAN = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const ANIMALS = ['Rato', 'Boi', 'Tigre', 'Coelho', 'Dragão', 'Serpente', 'Cavalo', 'Cabra', 'Macaco', 'Galo', 'Cão', 'Porco'];
const BRANCH_ELEMENTS: ChineseElement[] = ['Água', 'Terra', 'Madeira', 'Madeira', 'Terra', 'Fogo', 'Fogo', 'Terra', 'Metal', 'Metal', 'Terra', 'Água'];

export const CHINESE_ELEMENTS: ChineseElement[] = ['Madeira', 'Fogo', 'Terra', 'Metal', 'Água'];
export const ELEMENT_HAN: Record<ChineseElement, string> = { Madeira: '木', Fogo: '火', Terra: '土', Metal: '金', Água: '水' };

const norm = (x: number) => ((x % 360) + 360) % 360;

function pillar(stemIndex: number, branchIndex: number): Pillar {
  return {
    stemIndex,
    stem: STEMS[stemIndex],
    stemHan: STEMS_HAN[stemIndex],
    stemElement: STEM_ELEMENTS[stemIndex],
    yin: stemIndex % 2 === 1,
    branchIndex,
    branch: BRANCHES[branchIndex],
    branchHan: BRANCHES_HAN[branchIndex],
    animal: ANIMALS[branchIndex],
    branchElement: BRANCH_ELEMENTS[branchIndex]
  };
}

/** Número do dia juliano (calendário gregoriano) para uma data civil. */
function julianDayNumber(y: number, m: number, d: number): number {
  const a = Math.floor((14 - m) / 12);
  const yy = y + 4800 - a;
  const mm = m + 12 * a - 3;
  return d + Math.floor((153 * mm + 2) / 5) + 365 * yy + Math.floor(yy / 4) - Math.floor(yy / 100) + Math.floor(yy / 400) - 32045;
}

export function computeChinese(input: BirthInput): ChineseChart {
  const [y, m, d] = input.date.split('-').map(Number);
  const [hh] = (input.time || '12:00').split(':').map(Number);
  const sun = norm(Astronomy.SunPosition(Astronomy.MakeTime(birthInstant(input))).elon);

  // Ano: em janeiro e início de fevereiro, antes do Lì Chūn, vale o ano anterior
  const chineseYear = m <= 2 && sun >= 270 && sun < 315 ? y - 1 : y;
  const yearIdx = (((chineseYear - 4) % 60) + 60) % 60;
  const year = pillar(yearIdx % 10, yearIdx % 12);

  // Mês solar: o 1º mês (寅) começa com o Sol a 315°
  const monthOffset = Math.floor(norm(sun - 315) / 30);
  const month = pillar((((year.stemIndex % 5) * 2 + 2 + monthOffset) % 10), (2 + monthOffset) % 12);

  // Dia: ciclo de 60 dias, (JDN + 49) mod 60 → 0 = 甲子
  const dayIdx = (julianDayNumber(y, m, d) + 49) % 60;
  const day = pillar(dayIdx % 10, dayIdx % 12);

  // Hora: ramos de 2 h começando às 23h; tronco a partir do tronco do dia
  const hourBranch = Math.floor((((hh || 0) + 1) % 24) / 2);
  const hour = pillar(((day.stemIndex % 5) * 2 + hourBranch) % 10, hourBranch);

  const elements: Record<ChineseElement, number> = { Madeira: 0, Fogo: 0, Terra: 0, Metal: 0, Água: 0 };
  [year, month, day, hour].forEach((p) => {
    elements[p.stemElement]++;
    elements[p.branchElement]++;
  });

  return { year, month, day, hour, chineseYear, elements };
}
