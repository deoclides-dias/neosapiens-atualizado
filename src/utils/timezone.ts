// src/utils/timezone.ts
// Fuso horário a partir das coordenadas (sem chamada de API) e offset UTC
// histórico na data/hora exata do nascimento, incluindo horário de verão.

import tzLookup from '@photostructure/tz-lookup';

/** Fuso IANA (ex.: "America/Fortaleza") para uma coordenada. */
export function timezoneFromCoordinates(lat: number, lng: number): string | null {
  try {
    return tzLookup(lat, lng);
  } catch {
    return null;
  }
}

/** Offset (em minutos) do fuso num instante UTC. */
function offsetAtInstant(timeZone: string, utcMs: number): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  }).formatToParts(new Date(utcMs));

  const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
  const asUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'), get('second'));
  return Math.round((asUtc - utcMs) / 60000);
}

/**
 * Offset UTC (em minutos) para uma data e hora LOCAIS do fuso informado.
 * Ex.: ("America/Sao_Paulo", "1990-01-15", "06:00") → -120 (horário de verão).
 */
export function utcOffsetForLocalTime(timeZone: string, date: string, time = '12:00'): number | null {
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = (time || '12:00').split(':').map(Number);
  if (!y || !m || !d) return null;

  try {
    const wallAsUtc = Date.UTC(y, m - 1, d, hh || 0, mm || 0);
    // Duas iterações resolvem a ambiguidade perto das trocas de horário
    const first = offsetAtInstant(timeZone, wallAsUtc);
    return offsetAtInstant(timeZone, wallAsUtc - first * 60000);
  } catch {
    return null;
  }
}

/** Formata minutos como "+HH:MM" / "-HH:MM". */
export function formatUtcOffset(minutes: number): string {
  const sign = minutes < 0 ? '-' : '+';
  const abs = Math.abs(minutes);
  const h = String(Math.floor(abs / 60)).padStart(2, '0');
  const m = String(abs % 60).padStart(2, '0');
  return `${sign}${h}:${m}`;
}
