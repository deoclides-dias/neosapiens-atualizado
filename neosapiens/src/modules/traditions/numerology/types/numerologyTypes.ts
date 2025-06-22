// src/modules/traditions/numerology/types/numerologyTypes.ts

/**
 * Números únicos válidos na numerologia (incluindo mestres)
 */
export type SingleNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 11 | 22 | 33;

/**
 * Sistemas numerológicos suportados
 */
export enum NumerologySystem {
  PYTHAGOREAN = 'pythagorean',
  CHALDEAN = 'chaldean',
  KABBALAH = 'kabbalah'
}

export enum NumerologyNumber {
  LIFE_PATH = 'life_path',
  SOUL = 'soul',
  PERSONALITY = 'personality',
  DESTINY = 'destiny',
  MATURITY = 'maturity',
  PERSONAL_YEAR = 'personal_year',
  EXPRESSION = 'expression',
  HEART_DESIRE = 'heart_desire'
}

/**
 * Perfil numerológico completo
 */
export interface NumerologyProfile {
  soulNumber: SingleNumber;
  personalityNumber: SingleNumber;
  destinyNumber: SingleNumber;
  lifePathNumber: SingleNumber;
  challengeNumbers: {
    firstChallenge: SingleNumber;
    secondChallenge: SingleNumber;
    thirdChallenge: SingleNumber;
    mainChallenge: SingleNumber;
  };
  intensities: Record<SingleNumber, number>; // Quantas vezes cada número aparece
  lifeCycles: {
    firstCycle: { number: SingleNumber; endAge: number };
    secondCycle: { number: SingleNumber; endAge: number };
    thirdCycle: { number: SingleNumber; endAge: number };
  };
  masterNumbers: SingleNumber[];
}

/**
 * Dados de análise específicos da numerologia
 */
export interface NumerologyAnalysisData {
  name: string;
  birthDate: string;
  calculations: {
    soulNumberCalculation: string;
    personalityCalculation: string;
    destinyCalculation: string;
    lifePathCalculation: string;
  };
  personalityTraits: string[];
  talentsAndAbilities: string[];
  lifeThemes: string[];
  karmaNumbers: SingleNumber[];
  pinnacles: {
    first: { number: SingleNumber; ageRange: string };
    second: { number: SingleNumber; ageRange: string };
    third: { number: SingleNumber; ageRange: string };
    fourth: { number: SingleNumber; ageRange: string };
  };
}

/**
 * Configurações específicas para visualização numerológica
 */
export interface NumerologyVisualizationConfig {
  showCalculations: boolean;
  showIntensities: boolean;
  showCycles: boolean;
  showChallenges: boolean;
  colorScheme: 'rainbow' | 'monochrome' | 'classical';
  numberSystem: NumerologySystem;
}

/**
 * Práticas recomendadas baseadas na numerologia
 */
export interface NumerologyPractice {
  id: string;
  name: string;
  description: string;
  targetNumbers: SingleNumber[];
  duration: number; // em minutos
  instructions: string[];
  benefits: string[];
  frequency: 'daily' | 'weekly' | 'monthly';
  dimension: 'purpose' | 'body' | 'mind' | 'integration';
  materials?: string[]; // Materiais necessários
}

/**
 * Ciclos numerológicos
 */
export interface NumerologyCycle {
  number: SingleNumber;
  name: string;
  ageRange: { start: number; end: number };
  themes: string[];
  opportunities: string[];
  challenges: string[];
  recommendedActions: string[];
}

/**
 * Compatibilidade numerológica
 */
export interface NumerologyCompatibility {
  number1: SingleNumber;
  number2: SingleNumber;
  compatibilityScore: number; // 0-100
  strengths: string[];
  challenges: string[];
  advice: string[];
}

/**
 * Significados dos números mestres
 */
export interface MasterNumberMeaning {
  number: 11 | 22 | 33;
  title: string;
  mission: string;
  challenges: string[];
  spiritualSignificance: string;
  manifestationTips: string[];
}

/**
 * Transições numerológicas (mudanças de ciclo)
 */
export interface NumerologyTransition {
  fromNumber: SingleNumber;
  toNumber: SingleNumber;
  transitionPeriod: { start: number; end: number }; // idades
  description: string;
  preparationTips: string[];
  integrationPractices: string[];
}