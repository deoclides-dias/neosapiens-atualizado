// src/modules/traditions/western-astrology/types/astrologyTypes.ts

/**
 * Signos do zodíaco
 */
export enum ZodiacSign {
  ARIES = 'Áries',
  TAURUS = 'Touro',
  GEMINI = 'Gêmeos',
  CANCER = 'Câncer',
  LEO = 'Leão',
  VIRGO = 'Virgem',
  LIBRA = 'Libra',
  SCORPIO = 'Escorpião',
  SAGITTARIUS = 'Sagitário',
  CAPRICORN = 'Capricórnio',
  AQUARIUS = 'Aquário',
  PISCES = 'Peixes'
}

/**
 * Planetas astrológicos
 */
export enum Planet {
  SUN = 'Sol',
  MOON = 'Lua',
  MERCURY = 'Mercúrio',
  VENUS = 'Vênus',
  MARS = 'Marte',
  JUPITER = 'Júpiter',
  SATURN = 'Saturno',
  URANUS = 'Urano',
  NEPTUNE = 'Netuno',
  PLUTO = 'Plutão'
}

/**
 * Casas astrológicas
 */
export enum House {
  FIRST = 'Casa 1',    // Identidade, aparência física, abordagem à vida
  SECOND = 'Casa 2',   // Finanças, posses, valores
  THIRD = 'Casa 3',    // Comunicação, irmãos, ambiente próximo
  FOURTH = 'Casa 4',   // Lar, família, raízes
  FIFTH = 'Casa 5',    // Criatividade, romance, filhos
  SIXTH = 'Casa 6',    // Saúde, trabalho, rotina
  SEVENTH = 'Casa 7',  // Relacionamentos, parcerias
  EIGHTH = 'Casa 8',   // Transformação, recursos compartilhados
  NINTH = 'Casa 9',    // Filosofia, viagens, educação superior
  TENTH = 'Casa 10',   // Carreira, status, autoridades
  ELEVENTH = 'Casa 11', // Amizades, grupos, objetivos
  TWELFTH = 'Casa 12'   // Subconsciente, espiritualidade, isolamento
}

/**
 * Elementos astrológicos
 */
export enum Element {
  FIRE = 'Fogo',    // Energia, ação, entusiasmo
  EARTH = 'Terra',  // Estabilidade, praticidade, sensualidade
  AIR = 'Ar',       // Intelecto, comunicação, sociabilidade
  WATER = 'Água'    // Emoção, intuição, sensibilidade
}

/**
 * Modalidades astrológicas
 */
export enum Modality {
  CARDINAL = 'Cardinal', // Iniciação, liderança
  FIXED = 'Fixo',       // Estabilidade, persistência
  MUTABLE = 'Mutável'   // Adaptabilidade, flexibilidade
}

/**
 * Aspectos astrológicos
 */
export enum Aspect {
  CONJUNCTION = 'Conjunção',      // 0°
  SEXTILE = 'Sextil',             // 60°
  SQUARE = 'Quadratura',          // 90°
  TRINE = 'Trígono',              // 120°
  OPPOSITION = 'Oposição',        // 180°
  QUINCUNX = 'Quincúncio',        // 150°
  SEMISEXTILE = 'Semisextil',     // 30°
  SEMISQUARE = 'Semiquadratura',  // 45°
  SESQUISQUARE = 'Sesquiquadratura' // 135°
}

/**
 * Posição de um planeta no mapa astral
 */
export interface PlanetPosition {
  planet: Planet;
  sign: ZodiacSign;
  house: House;
  degree: number;          // 0-29.99
  retrograde: boolean;     // Movimento retrógrado
  element?: Element;       // Elemento do signo
  modality?: Modality;     // Modalidade do signo
}

/**
 * Aspecto entre planetas
 */
export interface PlanetaryAspect {
  planet1: Planet;
  planet2: Planet;
  aspect: Aspect;
  orb: number;             // Diferença em graus do aspecto exato
  applying: boolean;       // Se o aspecto está se aproximando ou afastando
  strength: number;        // 0-10 força do aspecto
}

/**
 * Mapa astral completo
 */
export interface BirthChart {
  id: string;
  userId: string;
  birthDate: Date;
  birthTime?: string;
  birthPlace?: {
    name: string;
    latitude: number;
    longitude: number;
  };
  ascendant: {
    sign: ZodiacSign;
    degree: number;
  };
  planets: PlanetPosition[];
  houses: {
    number: number;          // 1-12
    sign: ZodiacSign;
    cusp: number;            // Grau do início da casa
  }[];
  aspects: PlanetaryAspect[];
  
  // Dados adicionais específicos
  sunSign: ZodiacSign;
  moonSign: ZodiacSign;
  dominantPlanet?: Planet;
  dominantElement?: Element;
  dominantModality?: Modality;
}

/**
 * Parâmetros para cálculo do mapa astral
 */
export interface ChartCalculationParams {
  date: Date;
  time?: string;           // HH:MM
  latitude?: number;
  longitude?: number;
}