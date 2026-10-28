// src/lib/astro/index.ts
// Ponto de entrada do motor das tradições.

import { birthInstant, computeWestern } from './western';
import { computeChinese } from './chinese';
import { computeNumerology } from './numerology';
import type { BirthInput, TraditionsResult } from './types';

export * from './types';
export { computeWestern, formatDegree, zodiacPosition, PLANETS, SIGNS, SIGN_GLYPHS, SIGN_ELEMENTS, ASPECTS } from './western';
export { computeChinese, CHINESE_ELEMENTS, ELEMENT_HAN } from './chinese';
export { computeNumerology, reduceNumber, ARROWS } from './numerology';

export function computeTraditions(input: BirthInput, referenceYear?: number): TraditionsResult {
  return {
    input,
    utc: birthInstant(input).toISOString(),
    western: computeWestern(input),
    chinese: computeChinese(input),
    numerology: computeNumerology(input.fullName, input.date, referenceYear)
  };
}

/**
 * Converte o birth_data salvo pela análise /analysis/birth no formato do motor.
 * Retorna null quando faltam coordenadas ou fuso (registros antigos).
 */
export function birthInputFromSaved(raw: any): BirthInput | null {
  const place = raw?.birthPlace;
  if (!raw?.birthDate || typeof place?.latitude !== 'number' || typeof place?.longitude !== 'number') return null;
  if (typeof place?.utcOffsetMinutes !== 'number') return null;

  return {
    fullName: raw.fullName || '',
    date: raw.birthDate,
    time: raw.birthTime || '12:00',
    utcOffsetMinutes: place.utcOffsetMinutes,
    latitude: place.latitude,
    longitude: place.longitude,
    placeName: place.name || [place.city, place.state, place.country].filter(Boolean).join(', '),
    timezone: place.timezone
  };
}
