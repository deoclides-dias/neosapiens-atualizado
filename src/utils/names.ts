// src/utils/names.ts
// Nome próprio para exibição: "deoclides DOS santos" → "Deoclides dos Santos".
// Partículas (da, de, do, das, dos, e, d') ficam em minúsculas, exceto no início.

const PARTICLES = new Set(['da', 'de', 'do', 'das', 'dos', 'e', 'di', 'du', 'van', 'von', 'del', 'la', 'le']);

const capitalize = (w: string) => (w ? w.charAt(0).toLocaleUpperCase('pt-BR') + w.slice(1) : w);

export function formatPersonName(name: string): string {
  const words = (name || '').trim().replace(/\s+/g, ' ').toLocaleLowerCase('pt-BR').split(' ');
  return words
    .map((word, i) => {
      if (i > 0 && PARTICLES.has(word)) return word;
      // d'Ávila, Mary-Ann
      if (/^d'/.test(word) && word.length > 2) return `d'${capitalize(word.slice(2))}`;
      return word.split('-').map(capitalize).join('-');
    })
    .join(' ');
}
