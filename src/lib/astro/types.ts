// src/lib/astro/types.ts
// Tipos do motor de cálculo das tradições (ocidental, chinesa, numerologia).

export interface BirthInput {
  fullName: string;
  /** "AAAA-MM-DD" (data civil local) */
  date: string;
  /** "HH:MM" (hora civil local) */
  time: string;
  /** Offset UTC em minutos na data do nascimento (ex.: -180) */
  utcOffsetMinutes: number;
  latitude: number;
  longitude: number;
  placeName?: string;
  timezone?: string;
}

// ---------------------------------------------------------------------------
// Ocidental
// ---------------------------------------------------------------------------
export type PlanetId =
  | 'Sun' | 'Moon' | 'Mercury' | 'Venus' | 'Mars'
  | 'Jupiter' | 'Saturn' | 'Uranus' | 'Neptune' | 'Pluto';

export type SignName =
  | 'Áries' | 'Touro' | 'Gêmeos' | 'Câncer' | 'Leão' | 'Virgem'
  | 'Libra' | 'Escorpião' | 'Sagitário' | 'Capricórnio' | 'Aquário' | 'Peixes';

export type WesternElement = 'Fogo' | 'Terra' | 'Ar' | 'Água';

export interface ZodiacPosition {
  /** Longitude eclíptica tropical 0–360 */
  lon: number;
  sign: SignName;
  signIndex: number;
  /** Grau dentro do signo 0–30 */
  degree: number;
}

export interface PlanetPosition extends ZodiacPosition {
  id: PlanetId;
  name: string;
  glyph: string;
  retrograde: boolean;
  house: number;
}

export type AspectType = 'conjuncao' | 'oposicao' | 'trigono' | 'quadratura' | 'sextil' | 'quintil';

export interface Aspect {
  a: PlanetId;
  b: PlanetId;
  type: AspectType;
  /** Diferença em graus entre o ângulo exato e o real */
  orb: number;
}

export type PatternType = 'grandeTrigono' | 'pipa' | 'tQuadrada' | 'grandeCruz' | 'stellium';

export interface ChartPattern {
  type: PatternType;
  planets: PlanetId[];
  /** Elemento (grande trígono) ou signo (stellium), quando se aplica */
  detail?: string;
  /** Planeta-foco (ponta da pipa, ápice da T-quadrada) */
  focus?: PlanetId;
}

export interface WesternChart {
  planets: PlanetPosition[];
  ascendant: ZodiacPosition;
  midheaven: ZodiacPosition;
  /** 12 cúspides, começando na casa 1 */
  cusps: number[];
  houseSystem: 'Placidus' | 'Casas Iguais';
  aspects: Aspect[];
  patterns: ChartPattern[];
  elements: Record<WesternElement, number>;
  /** Total de pontos usados na contagem de elementos (planetas + AC) */
  elementPoints: number;
}

// ---------------------------------------------------------------------------
// Chinesa
// ---------------------------------------------------------------------------
export type ChineseElement = 'Madeira' | 'Fogo' | 'Terra' | 'Metal' | 'Água';

export interface Pillar {
  stemIndex: number;
  stem: string;
  stemHan: string;
  stemElement: ChineseElement;
  yin: boolean;
  branchIndex: number;
  branch: string;
  branchHan: string;
  animal: string;
  branchElement: ChineseElement;
}

export interface ChineseChart {
  year: Pillar;
  month: Pillar;
  day: Pillar;
  hour: Pillar;
  /** Ano chinês (muda no Lì Chūn, Sol a 315°) */
  chineseYear: number;
  elements: Record<ChineseElement, number>;
}

// ---------------------------------------------------------------------------
// Numerologia
// ---------------------------------------------------------------------------
export interface NumerologyChart {
  lifePath: number;
  lifePathSteps: { day: number; month: number; year: number; yearSum: number };
  expression: number;
  soulUrge: number;
  personality: number;
  birthday: number;
  personalYear: { year: number; value: number };
  /** Quantas vezes cada dígito 1–9 aparece na data */
  grid: Record<number, number>;
  arrows: { id: string; digits: [number, number, number]; name: string; complete: boolean }[];
  missing: number[];
}

export interface TraditionsResult {
  input: BirthInput;
  utc: string;
  western: WesternChart;
  chinese: ChineseChart;
  numerology: NumerologyChart;
}
