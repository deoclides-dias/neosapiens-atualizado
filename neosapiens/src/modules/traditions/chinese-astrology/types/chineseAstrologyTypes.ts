// src/modules/traditions/chinese-astrology/types/chineseAstrologyTypes.ts

export enum ChineseZodiacSign {
  RAT = 'Rato',
  OX = 'Búfalo',
  TIGER = 'Tigre',
  RABBIT = 'Coelho',
  DRAGON = 'Dragão',
  SNAKE = 'Serpente',
  HORSE = 'Cavalo',
  GOAT = 'Cabra',
  MONKEY = 'Macaco',
  ROOSTER = 'Galo',
  DOG = 'Cão',
  PIG = 'Porco'
}

export enum ChineseElement {
  WOOD = 'Madeira',
  FIRE = 'Fogo',
  EARTH = 'Terra',
  METAL = 'Metal',
  WATER = 'Água'
}

export enum ChinesePolarity {
  YIN = 'Yin',
  YANG = 'Yang'
}

// Interface para signo elemental (signo + elemento)
export interface ElementalSign {
  sign: ChineseZodiacSign;
  element: ChineseElement;
}

// Interface para ciclo de vida
export interface ChineseLifeCycle {
  number: number;
  element: ChineseElement;
  polarity: ChinesePolarity;
  startAge: number;
  endAge: number;
  description: string;
  challenges: string[];
  opportunities: string[];
}

// Interface principal do perfil - CORRIGIDA
export interface ChineseAstrologyProfile {
  userId: string;
  birthDate: string;
  
  // Signos dos 4 pilares
  yearSign: ElementalSign;     // Signo do ano (pilar principal)
  monthSign: ElementalSign;    // Signo do mês
  daySign: ElementalSign;      // Signo do dia
  hourSign?: ElementalSign;    // Signo da hora (opcional)
  
  // Características derivadas
  dominantElement: ChineseElement;
  polarity: ChinesePolarity;
  elementalBalance: Record<ChineseElement, number>;
  
  // Relacionamentos
  compatibleSigns: ChineseZodiacSign[];
  challengingSigns: ChineseZodiacSign[];
  
  // Ciclos de vida
  lifeCycles: ChineseLifeCycle[];
  
  // Status atual
  currentLuck?: {
    element: ChineseElement;
    phase: string;
    score: number;
  };
  
  // Metadados
  createdAt: Date;
  lastUpdated: Date;
}

// Interfaces para descrições
export interface ChineseZodiacDescription {
  sign: ChineseZodiacSign;
  generalDescription: string;
  personalityDescriptionBrief: string;
  personality: {
    strengths: string[];
    challenges: string[];
    characteristics: string[];
  };
  relationships: {
    love: string;
    friendship: string;
    family: string;
    bestMatches: ChineseZodiacSign[];
    challengingMatches: ChineseZodiacSign[];
  };
  career: {
    aptitudes: string[];
    environments: string[];
    challenges: string[];
  };
}

export interface ChineseElementDescription {
  element: ChineseElement;
  generalDescription: string;
  personalityDescriptionBrief: string;
  personality: string[];
  strengths: string[];
  challenges: string[];
  physical: string[];
  mental: string[];
  spiritual: string[];
}

// Parâmetros para cálculos de astrologia chinesa - CORRIGIDA

export interface ChineseAstrologyCalculationParams {
  birthDate: string;
  birthTime?: string;
  birthPlace?: {
    name: string;
    latitude: number;
    longitude: number;
  } | string;  // Aceita tanto objeto quanto string
  currentDate?: string;
}

export interface ChineseAstrologyCalculationParams {
  birthDate: string;
  birthTime?: string;
  birthPlace?: string | { name: string; latitude: number; longitude: number; };
  currentDate?: string;
}

// Resultado de compatibilidade
export interface CompatibilityResult {
  otherSign: ChineseZodiacSign;
  score: number;
  type: 'excellent' | 'good' | 'neutral' | 'challenging' | 'difficult';
  description: string;
}

// Interface para visualização
export interface ChineseAstrologyVisualization {
  profile: {
    name: string;
    birthDate: string;
    yearSign: string;
  };
  elements: {
    dominant: ChineseElement;
    balance: Array<{ element: string; value: number }>;
  };
  zodiac: {
    yearSign: ChineseZodiacSign;
    relations: Array<{
      sign: ChineseZodiacSign;
      relation: 'self' | 'compatible' | 'challenging' | 'neutral';
    }>;
  };
  lifeCycles: Array<{
    number: number;
    element: ChineseElement;
    startAge: number;
    endAge: number;
  }>;
  dimensionalBalance: Array<{
    dimension: string;
    value: number;
  }>;
}