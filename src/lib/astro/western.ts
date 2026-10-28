// src/lib/astro/western.ts
// Mapa natal tropical: planetas (astronomy-engine), Ascendente, Meio do Céu,
// casas Placidus (Casas Iguais acima de 66° de latitude), aspectos e padrões.

import * as Astronomy from 'astronomy-engine';
import type {
  Aspect, AspectType, BirthInput, ChartPattern, PlanetId, PlanetPosition,
  SignName, WesternChart, WesternElement, ZodiacPosition
} from './types';

export const SIGNS: SignName[] = [
  'Áries', 'Touro', 'Gêmeos', 'Câncer', 'Leão', 'Virgem',
  'Libra', 'Escorpião', 'Sagitário', 'Capricórnio', 'Aquário', 'Peixes'
];
export const SIGN_GLYPHS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
export const SIGN_ELEMENTS: WesternElement[] = ['Fogo', 'Terra', 'Ar', 'Água'];

export const PLANETS: { id: PlanetId; name: string; glyph: string }[] = [
  { id: 'Sun', name: 'Sol', glyph: '☉' },
  { id: 'Moon', name: 'Lua', glyph: '☽' },
  { id: 'Mercury', name: 'Mercúrio', glyph: '☿' },
  { id: 'Venus', name: 'Vênus', glyph: '♀' },
  { id: 'Mars', name: 'Marte', glyph: '♂' },
  { id: 'Jupiter', name: 'Júpiter', glyph: '♃' },
  { id: 'Saturn', name: 'Saturno', glyph: '♄' },
  { id: 'Uranus', name: 'Urano', glyph: '♅' },
  { id: 'Neptune', name: 'Netuno', glyph: '♆' },
  { id: 'Pluto', name: 'Plutão', glyph: '♇' }
];

export const ASPECTS: { type: AspectType; angle: number; orb: number; name: string }[] = [
  { type: 'conjuncao', angle: 0, orb: 8, name: 'Conjunção' },
  { type: 'oposicao', angle: 180, orb: 8, name: 'Oposição' },
  { type: 'trigono', angle: 120, orb: 7, name: 'Trígono' },
  { type: 'quadratura', angle: 90, orb: 7, name: 'Quadratura' },
  { type: 'sextil', angle: 60, orb: 5, name: 'Sextil' },
  { type: 'quintil', angle: 72, orb: 2, name: 'Quintil' }
];

const norm = (x: number) => ((x % 360) + 360) % 360;
const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;

export function zodiacPosition(lon: number): ZodiacPosition {
  const l = norm(lon);
  const signIndex = Math.floor(l / 30);
  return { lon: l, sign: SIGNS[signIndex], signIndex, degree: l - signIndex * 30 };
}

/** Instante UTC do nascimento a partir da data/hora local e do offset. */
export function birthInstant(input: BirthInput): Date {
  const [y, m, d] = input.date.split('-').map(Number);
  const [hh, mm] = (input.time || '12:00').split(':').map(Number);
  return new Date(Date.UTC(y, m - 1, d, hh || 0, mm || 0) - input.utcOffsetMinutes * 60000);
}

function eclipticLongitude(body: PlanetId, time: Astronomy.AstroTime): number {
  if (body === 'Sun') return Astronomy.SunPosition(time).elon;
  if (body === 'Moon') return Astronomy.EclipticGeoMoon(time).lon;
  const vec = Astronomy.GeoVector(body as Astronomy.Body, time, true);
  return Astronomy.Ecliptic(vec).elon;
}

/** Ascendente, Meio do Céu, obliquidade e RAMC (radianos). */
function angles(time: Astronomy.AstroTime, latitude: number, longitude: number) {
  const T = time.tt / 36525;
  const eps = rad(23.4392911 - 0.0130042 * T);
  const ramc = rad(norm(Astronomy.SiderealTime(time) * 15 + longitude));
  const phi = rad(latitude);

  const mc = norm(deg(Math.atan2(Math.sin(ramc), Math.cos(ramc) * Math.cos(eps))));
  const asc = norm(deg(Math.atan2(Math.cos(ramc), -(Math.sin(ramc) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps)))));
  return { asc, mc, eps, ramc, phi };
}

/** Cúspide Placidus intermediária por iteração do semi-arco. */
function placidusCusp(fraction: number, above: boolean, ramc: number, eps: number, phi: number): number {
  let r = above ? ramc + fraction * (Math.PI / 2) : ramc + Math.PI - fraction * (Math.PI / 2);
  for (let i = 0; i < 60; i++) {
    const lam = Math.atan2(Math.sin(r), Math.cos(r) * Math.cos(eps));
    const dec = Math.asin(Math.sin(eps) * Math.sin(lam));
    const ad = Math.asin(Math.max(-1, Math.min(1, Math.tan(phi) * Math.tan(dec))));
    const semi = above ? Math.PI / 2 + ad : Math.PI / 2 - ad;
    const next = above ? ramc + fraction * semi : ramc + Math.PI - fraction * semi;
    if (Math.abs(next - r) < 1e-10) {
      r = next;
      break;
    }
    r = next;
  }
  return norm(deg(Math.atan2(Math.sin(r), Math.cos(r) * Math.cos(eps))));
}

function houseOf(lon: number, cusps: number[]): number {
  for (let i = 0; i < 12; i++) {
    const span = norm(cusps[(i + 1) % 12] - cusps[i]);
    if (norm(lon - cusps[i]) < span) return i + 1;
  }
  return 12;
}

function angularDistance(a: number, b: number): number {
  const d = Math.abs(norm(a) - norm(b));
  return d > 180 ? 360 - d : d;
}

function findAspects(planets: PlanetPosition[]): Aspect[] {
  const list: Aspect[] = [];
  for (let i = 0; i < planets.length; i++) {
    for (let j = i + 1; j < planets.length; j++) {
      const dist = angularDistance(planets[i].lon, planets[j].lon);
      for (const asp of ASPECTS) {
        const orb = Math.abs(dist - asp.angle);
        if (orb <= asp.orb) {
          list.push({ a: planets[i].id, b: planets[j].id, type: asp.type, orb });
          break;
        }
      }
    }
  }
  return list;
}

function findPatterns(planets: PlanetPosition[], aspects: Aspect[]): ChartPattern[] {
  const has = (a: PlanetId, b: PlanetId, type: AspectType) =>
    aspects.some((x) => x.type === type && ((x.a === a && x.b === b) || (x.a === b && x.b === a)));
  const ids = planets.map((p) => p.id);
  const byId = Object.fromEntries(planets.map((p) => [p.id, p])) as Record<PlanetId, PlanetPosition>;
  const patterns: ChartPattern[] = [];

  // Grandes Trígonos (e Pipas a partir deles)
  for (let i = 0; i < ids.length; i++)
    for (let j = i + 1; j < ids.length; j++)
      for (let k = j + 1; k < ids.length; k++) {
        const [a, b, c] = [ids[i], ids[j], ids[k]];
        if (has(a, b, 'trigono') && has(b, c, 'trigono') && has(a, c, 'trigono')) {
          const elems = new Set([a, b, c].map((x) => SIGN_ELEMENTS[byId[x].signIndex % 4]));
          patterns.push({ type: 'grandeTrigono', planets: [a, b, c], detail: elems.size === 1 ? [...elems][0] : undefined });

          for (const f of ids) {
            if ([a, b, c].includes(f)) continue;
            const tri = [a, b, c];
            for (let v = 0; v < 3; v++) {
              const others = tri.filter((_, idx) => idx !== v);
              if (has(f, tri[v], 'oposicao') && others.every((o) => has(f, o, 'sextil'))) {
                patterns.push({ type: 'pipa', planets: [...tri, f], focus: f });
              }
            }
          }
        }
      }

  // T-quadradas e Grandes Cruzes
  const oppositions = aspects.filter((x) => x.type === 'oposicao');
  for (const op of oppositions) {
    for (const apex of ids) {
      if (apex === op.a || apex === op.b) continue;
      if (has(apex, op.a, 'quadratura') && has(apex, op.b, 'quadratura')) {
        patterns.push({ type: 'tQuadrada', planets: [op.a, op.b, apex], focus: apex });
      }
    }
  }
  for (let i = 0; i < oppositions.length; i++)
    for (let j = i + 1; j < oppositions.length; j++) {
      const p = oppositions[i], q = oppositions[j];
      const four = [p.a, p.b, q.a, q.b];
      if (new Set(four).size === 4 && has(p.a, q.a, 'quadratura') && has(p.a, q.b, 'quadratura') &&
          has(p.b, q.a, 'quadratura') && has(p.b, q.b, 'quadratura')) {
        patterns.push({ type: 'grandeCruz', planets: four });
      }
    }

  // Stellium: 3+ planetas no mesmo signo
  const bySign: Record<number, PlanetId[]> = {};
  planets.forEach((p) => (bySign[p.signIndex] = [...(bySign[p.signIndex] || []), p.id]));
  Object.entries(bySign).forEach(([s, list]) => {
    if (list.length >= 3) patterns.push({ type: 'stellium', planets: list, detail: SIGNS[Number(s)] });
  });

  // Remove T-quadradas duplicadas que fazem parte de uma Grande Cruz
  return patterns;
}

export function computeWestern(input: BirthInput): WesternChart {
  const time = Astronomy.MakeTime(birthInstant(input));
  const { asc, mc, eps, ramc, phi } = angles(time, input.latitude, input.longitude);

  let cusps: number[];
  let houseSystem: WesternChart['houseSystem'] = 'Placidus';
  if (Math.abs(input.latitude) < 66) {
    const c11 = placidusCusp(1 / 3, true, ramc, eps, phi);
    const c12 = placidusCusp(2 / 3, true, ramc, eps, phi);
    const c2 = placidusCusp(2 / 3, false, ramc, eps, phi);
    const c3 = placidusCusp(1 / 3, false, ramc, eps, phi);
    cusps = [asc, c2, c3, norm(mc + 180), norm(c11 + 180), norm(c12 + 180),
             norm(asc + 180), norm(c2 + 180), norm(c3 + 180), mc, c11, c12];
  } else {
    // Placidus não é definido perto dos círculos polares
    houseSystem = 'Casas Iguais';
    cusps = Array.from({ length: 12 }, (_, i) => norm(asc + i * 30));
  }

  const nextDay = time.AddDays(1);
  const planets: PlanetPosition[] = PLANETS.map((p) => {
    const lon = norm(eclipticLongitude(p.id, time));
    let delta = norm(eclipticLongitude(p.id, nextDay)) - lon;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    return {
      ...zodiacPosition(lon),
      id: p.id,
      name: p.name,
      glyph: p.glyph,
      retrograde: p.id !== 'Sun' && p.id !== 'Moon' && delta < 0,
      house: houseOf(lon, cusps)
    };
  });

  const aspects = findAspects(planets);
  const patterns = findPatterns(planets, aspects);

  const elements: Record<WesternElement, number> = { Fogo: 0, Terra: 0, Ar: 0, Água: 0 };
  planets.forEach((p) => elements[SIGN_ELEMENTS[p.signIndex % 4]]++);
  const ascPos = zodiacPosition(asc);
  elements[SIGN_ELEMENTS[ascPos.signIndex % 4]]++;

  return {
    planets,
    ascendant: ascPos,
    midheaven: zodiacPosition(mc),
    cusps,
    houseSystem,
    aspects,
    patterns,
    elements,
    elementPoints: planets.length + 1
  };
}

/** "14°25′" */
export function formatDegree(degree: number): string {
  let d = Math.floor(degree);
  let m = Math.round((degree - d) * 60);
  if (m === 60) {
    d += 1;
    m = 0;
  }
  return `${d}°${String(m).padStart(2, '0')}′`;
}
