// src/utils/dates.ts
// `new Date("1974-03-05")` é interpretado como meia-noite UTC; no Brasil
// (UTC-3) isso vira 04/03 às 21h e desloca dia, signo e numerologia.
// Estas funções tratam a data de nascimento como data LOCAL.

/** "1974-03-05" (+ "06:00") → Date local nesse dia e hora. */
export function parseLocalDate(date: string, time?: string): Date {
  const [y, m, d] = date.split('-').map(Number);
  const [hh, mm] = (time || '00:00').split(':').map(Number);
  return new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0);
}

/** "1974-03-05" → "05/03/1974", sem passar por fuso horário. */
export function formatDateBR(date: string): string {
  const [y, m, d] = date.split('-');
  return y && m && d ? `${d}/${m}/${y}` : date;
}
