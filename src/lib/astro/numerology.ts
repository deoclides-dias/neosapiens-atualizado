// src/lib/astro/numerology.ts
// Numerologia pitagórica: números principais a partir da data e do nome
// completo, Grade de Pitágoras e setas. Números mestres 11, 22 e 33 preservados.

import type { NumerologyChart } from './types';

const MASTERS = [11, 22, 33];
const VOWELS = 'aeiou';

const digitSum = (n: number) => String(n).split('').reduce((s, c) => s + Number(c), 0);

export function reduceNumber(n: number, keepMasters = true): number {
  let v = n;
  while (v > 9 && !(keepMasters && MASTERS.includes(v))) v = digitSum(v);
  return v;
}

const letterValue = (ch: string) => {
  const i = 'abcdefghijklmnopqrstuvwxyz'.indexOf(ch);
  return i < 0 ? 0 : (i % 9) + 1;
};

const cleanName = (name: string) =>
  name.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z]/g, '');

export const ARROWS: { id: string; digits: [number, number, number]; name: string }[] = [
  { id: '123', digits: [1, 2, 3], name: 'Planejamento' },
  { id: '456', digits: [4, 5, 6], name: 'Vontade' },
  { id: '789', digits: [7, 8, 9], name: 'Ação' },
  { id: '369', digits: [3, 6, 9], name: 'Intelecto' },
  { id: '258', digits: [2, 5, 8], name: 'Equilíbrio emocional' },
  { id: '147', digits: [1, 4, 7], name: 'Praticidade' },
  { id: '159', digits: [1, 5, 9], name: 'Determinação' },
  { id: '357', digits: [3, 5, 7], name: 'Compaixão' }
];

export function computeNumerology(fullName: string, date: string, referenceYear = new Date().getFullYear()): NumerologyChart {
  const [y, m, d] = date.split('-').map(Number);

  const dayR = reduceNumber(d);
  const monthR = reduceNumber(m);
  const yearSum = digitSum(y);
  const yearR = reduceNumber(yearSum);
  const lifePath = reduceNumber(dayR + monthR + yearR);

  const letters = cleanName(fullName).split('');
  const sum = (list: string[]) => list.reduce((s, c) => s + letterValue(c), 0);
  const expression = reduceNumber(sum(letters));
  const soulUrge = reduceNumber(sum(letters.filter((c) => VOWELS.includes(c))));
  const personality = reduceNumber(sum(letters.filter((c) => !VOWELS.includes(c))));

  const personalYear = reduceNumber(reduceNumber(d) + reduceNumber(m) + reduceNumber(digitSum(referenceYear)), false);

  const grid: Record<number, number> = {};
  for (let i = 1; i <= 9; i++) grid[i] = 0;
  `${String(d).padStart(2, '0')}${String(m).padStart(2, '0')}${y}`
    .split('')
    .forEach((c) => {
      const n = Number(c);
      if (n) grid[n]++;
    });

  return {
    lifePath,
    lifePathSteps: { day: dayR, month: monthR, year: yearR, yearSum },
    expression,
    soulUrge,
    personality,
    birthday: reduceNumber(d),
    personalYear: { year: referenceYear, value: personalYear },
    grid,
    arrows: ARROWS.map((a) => ({ ...a, complete: a.digits.every((n) => grid[n] > 0) })),
    missing: Object.keys(grid).map(Number).filter((n) => grid[n] === 0)
  };
}
