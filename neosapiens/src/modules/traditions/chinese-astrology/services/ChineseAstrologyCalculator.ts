// src/modules/traditions/chinese-astrology/services/ChineseAstrologyCalculator.ts

import {
  ChineseZodiacSign,
  ChineseElement,
  ChinesePolarity,
  ElementalSign,
  ChineseAstrologyProfile,
  ChineseLifeCycle,
  ChineseAstrologyCalculationParams
} from '../types/chineseAstrologyTypes';

/**
 * Calculadora de Astrologia Chinesa
 * 
 * Responsável por todos os cálculos astrológicos chineses,
 * incluindo signos, elementos, polaridades e ciclos.
 */
export default class ChineseAstrologyCalculator {
  
  // Arrays de signos em ordem
  private readonly zodiacSigns = [
    ChineseZodiacSign.RAT,
    ChineseZodiacSign.OX,
    ChineseZodiacSign.TIGER,
    ChineseZodiacSign.RABBIT,
    ChineseZodiacSign.DRAGON,
    ChineseZodiacSign.SNAKE,
    ChineseZodiacSign.HORSE,
    ChineseZodiacSign.GOAT,
    ChineseZodiacSign.MONKEY,
    ChineseZodiacSign.ROOSTER,
    ChineseZodiacSign.DOG,
    ChineseZodiacSign.PIG
  ];

  // Arrays de elementos em ordem
  private readonly elements = [
    ChineseElement.WOOD,
    ChineseElement.FIRE,
    ChineseElement.EARTH,
    ChineseElement.METAL,
    ChineseElement.WATER
  ];

  /**
   * Calcula o perfil astrológico chinês completo
   */
  calculateProfile(params: ChineseAstrologyCalculationParams): ChineseAstrologyProfile {
    const birthDate = new Date(params.birthDate);
    const year = birthDate.getFullYear();
    const month = birthDate.getMonth() + 1; // JavaScript month is 0-indexed
    const day = birthDate.getDate();
    
    // Calcular hora se disponível
    let hour = 12; // Meio-dia como padrão
    if (params.birthTime) {
      const timeParts = params.birthTime.split(':');
      hour = parseInt(timeParts[0]);
    }

    // Calcular signos dos 4 pilares
    const yearSign = this.calculateYearSign(year);
    const monthSign = this.calculateMonthSign(year, month);
    const daySign = this.calculateDaySign(year, month, day);
    const hourSign = this.calculateHourSign(hour);

    // Calcular características derivadas
    const allSigns = [yearSign, monthSign, daySign, hourSign];
    const dominantElement = this.calculateDominantElement(allSigns);
    const polarity = this.calculatePolarity(year);
    const elementalBalance = this.calculateElementalBalance(allSigns);

    // Calcular relacionamentos
    const compatibleSigns = this.getCompatibleSigns(yearSign.sign);
    const challengingSigns = this.getChallengingSigns(yearSign.sign);

    // Calcular ciclos de vida
    const lifeCycles = this.calculateLifeCycles(year);

    // Calcular sorte atual
    const currentLuck = this.calculateCurrentLuck(year, new Date().getFullYear());

    return {
      userId: '', // Será preenchido pelo módulo
      birthDate: params.birthDate,
      
      yearSign,
      monthSign,
      daySign,
      hourSign,
      
      dominantElement,
      polarity,
      elementalBalance,
      
      compatibleSigns,
      challengingSigns,
      
      lifeCycles,
      currentLuck,
      
      createdAt: new Date(),
      lastUpdated: new Date()
    };
  }

  /**
   * Calcula o signo do ano
   */
  private calculateYearSign(year: number): ElementalSign {
    // Ano 1900 = Rato de Metal
    // Cada 12 anos o ciclo se repete
    const baseYear = 1900;
    const yearOffset = (year - baseYear) % 12;
    
    // Ajustar para array (que começa em 0)
    const signIndex = yearOffset >= 0 ? yearOffset : yearOffset + 12;
    const sign = this.zodiacSigns[signIndex];
    
    // Calcular elemento (cada elemento dura 2 anos)
    const elementCycle = Math.floor((year - baseYear) / 2) % 5;
    const elementIndex = elementCycle >= 0 ? elementCycle : elementCycle + 5;
    const element = this.elements[elementIndex];
    
    return { sign, element };
  }

  /**
   * Calcula o signo do mês
   */
  private calculateMonthSign(year: number, month: number): ElementalSign {
    // O signo do mês depende do ano e do mês
    // Para simplificar, usaremos uma fórmula baseada no mês
    const monthOffset = (month - 1) % 12;
    const sign = this.zodiacSigns[monthOffset];
    
    // Elemento baseado no ano
    const yearElement = this.calculateYearSign(year).element;
    const elementIndex = this.elements.indexOf(yearElement);
    const monthElementIndex = (elementIndex + Math.floor(month / 3)) % 5;
    const element = this.elements[monthElementIndex];
    
    return { sign, element };
  }

  /**
   * Calcula o signo do dia
   */
  private calculateDaySign(year: number, month: number, day: number): ElementalSign {
    // Fórmula simplificada para calcular o signo do dia
    // Na prática, seria usado um calendário lunar chinês preciso
    const daysSinceEpoch = this.daysSince1900(year, month, day);
    const dayOffset = daysSinceEpoch % 12;
    const sign = this.zodiacSigns[dayOffset];
    
    // Elemento baseado no ciclo de dias
    const elementIndex = Math.floor(daysSinceEpoch / 73) % 5; // ~73 dias por elemento
    const element = this.elements[elementIndex];
    
    return { sign, element };
  }

  /**
   * Calcula o signo da hora
   */
  private calculateHourSign(hour: number): ElementalSign {
    // Cada signo governa 2 horas
    const hourRanges = [
      { start: 23, end: 1, sign: ChineseZodiacSign.RAT },
      { start: 1, end: 3, sign: ChineseZodiacSign.OX },
      { start: 3, end: 5, sign: ChineseZodiacSign.TIGER },
      { start: 5, end: 7, sign: ChineseZodiacSign.RABBIT },
      { start: 7, end: 9, sign: ChineseZodiacSign.DRAGON },
      { start: 9, end: 11, sign: ChineseZodiacSign.SNAKE },
      { start: 11, end: 13, sign: ChineseZodiacSign.HORSE },
      { start: 13, end: 15, sign: ChineseZodiacSign.GOAT },
      { start: 15, end: 17, sign: ChineseZodiacSign.MONKEY },
      { start: 17, end: 19, sign: ChineseZodiacSign.ROOSTER },
      { start: 19, end: 21, sign: ChineseZodiacSign.DOG },
      { start: 21, end: 23, sign: ChineseZodiacSign.PIG }
    ];
    
    let sign = ChineseZodiacSign.RAT; // Default
    
    for (const range of hourRanges) {
      if (range.start <= range.end) {
        if (hour >= range.start && hour < range.end) {
          sign = range.sign;
          break;
        }
      } else {
        // Caso especial para meia-noite (23-1)
        if (hour >= range.start || hour < range.end) {
          sign = range.sign;
          break;
        }
      }
    }
    
    // Elemento baseado na hora (ciclo de 5 elementos em 10 horas)
    const elementIndex = Math.floor(hour / 2.4) % 5;
    const element = this.elements[elementIndex];
    
    return { sign, element };
  }

  /**
   * Calcula o elemento dominante
   */
  private calculateDominantElement(signs: ElementalSign[]): ChineseElement {
    const elementCount: Record<ChineseElement, number> = {
      [ChineseElement.WOOD]: 0,
      [ChineseElement.FIRE]: 0,
      [ChineseElement.EARTH]: 0,
      [ChineseElement.METAL]: 0,
      [ChineseElement.WATER]: 0
    };
    
    // Contar elementos com pesos diferentes
    const weights = [3, 2, 1, 1]; // ano, mês, dia, hora
    
    signs.forEach((sign, index) => {
      const weight = weights[index] || 1;
      elementCount[sign.element] += weight;
    });
    
    // Encontrar elemento com maior contagem
    let dominantElement = ChineseElement.WOOD;
    let maxCount = 0;
    
    for (const [element, count] of Object.entries(elementCount)) {
      if (count > maxCount) {
        maxCount = count;
        dominantElement = element as ChineseElement;
      }
    }
    
    return dominantElement;
  }

  /**
   * Calcula a polaridade baseada no ano
   */
  private calculatePolarity(year: number): ChinesePolarity {
    // Anos pares são Yang, ímpares são Yin
    return year % 2 === 0 ? ChinesePolarity.YANG : ChinesePolarity.YIN;
  }

  /**
   * Calcula o equilíbrio elemental
   */
  private calculateElementalBalance(signs: ElementalSign[]): Record<ChineseElement, number> {
    const balance: Record<ChineseElement, number> = {
      [ChineseElement.WOOD]: 0,
      [ChineseElement.FIRE]: 0,
      [ChineseElement.EARTH]: 0,
      [ChineseElement.METAL]: 0,
      [ChineseElement.WATER]: 0
    };
    
    // Pesos para diferentes pilares
    const weights = [40, 30, 20, 10]; // ano, mês, dia, hora
    
    signs.forEach((sign, index) => {
      const weight = weights[index] || 0;
      balance[sign.element] += weight;
    });
    
    return balance;
  }

  /**
   * Obtém signos compatíveis
   */
  private getCompatibleSigns(sign: ChineseZodiacSign): ChineseZodiacSign[] {
    const compatibilityMap: Record<ChineseZodiacSign, ChineseZodiacSign[]> = {
      [ChineseZodiacSign.RAT]: [ChineseZodiacSign.DRAGON, ChineseZodiacSign.MONKEY],
      [ChineseZodiacSign.OX]: [ChineseZodiacSign.SNAKE, ChineseZodiacSign.ROOSTER],
      [ChineseZodiacSign.TIGER]: [ChineseZodiacSign.HORSE, ChineseZodiacSign.DOG],
      [ChineseZodiacSign.RABBIT]: [ChineseZodiacSign.GOAT, ChineseZodiacSign.PIG],
      [ChineseZodiacSign.DRAGON]: [ChineseZodiacSign.RAT, ChineseZodiacSign.MONKEY],
      [ChineseZodiacSign.SNAKE]: [ChineseZodiacSign.OX, ChineseZodiacSign.ROOSTER],
      [ChineseZodiacSign.HORSE]: [ChineseZodiacSign.TIGER, ChineseZodiacSign.DOG],
      [ChineseZodiacSign.GOAT]: [ChineseZodiacSign.RABBIT, ChineseZodiacSign.PIG],
      [ChineseZodiacSign.MONKEY]: [ChineseZodiacSign.RAT, ChineseZodiacSign.DRAGON],
      [ChineseZodiacSign.ROOSTER]: [ChineseZodiacSign.OX, ChineseZodiacSign.SNAKE],
      [ChineseZodiacSign.DOG]: [ChineseZodiacSign.TIGER, ChineseZodiacSign.HORSE],
      [ChineseZodiacSign.PIG]: [ChineseZodiacSign.RABBIT, ChineseZodiacSign.GOAT]
    };
    
    return compatibilityMap[sign] || [];
  }

  /**
   * Obtém signos desafiadores
   */
  private getChallengingSigns(sign: ChineseZodiacSign): ChineseZodiacSign[] {
    const challengeMap: Record<ChineseZodiacSign, ChineseZodiacSign[]> = {
      [ChineseZodiacSign.RAT]: [ChineseZodiacSign.HORSE],
      [ChineseZodiacSign.OX]: [ChineseZodiacSign.GOAT],
      [ChineseZodiacSign.TIGER]: [ChineseZodiacSign.MONKEY],
      [ChineseZodiacSign.RABBIT]: [ChineseZodiacSign.ROOSTER],
      [ChineseZodiacSign.DRAGON]: [ChineseZodiacSign.DOG],
      [ChineseZodiacSign.SNAKE]: [ChineseZodiacSign.PIG],
      [ChineseZodiacSign.HORSE]: [ChineseZodiacSign.RAT],
      [ChineseZodiacSign.GOAT]: [ChineseZodiacSign.OX],
      [ChineseZodiacSign.MONKEY]: [ChineseZodiacSign.TIGER],
      [ChineseZodiacSign.ROOSTER]: [ChineseZodiacSign.RABBIT],
      [ChineseZodiacSign.DOG]: [ChineseZodiacSign.DRAGON],
      [ChineseZodiacSign.PIG]: [ChineseZodiacSign.SNAKE]
    };
    
    return challengeMap[sign] || [];
  }

  /**
   * Calcula os ciclos de vida
   */
  private calculateLifeCycles(birthYear: number): ChineseLifeCycle[] {
    const cycles: ChineseLifeCycle[] = [];
    
    // Cada ciclo dura aproximadamente 12 anos
    const cycleDuration = 12;
    const maxCycles = 7; // Até aproximadamente 84 anos
    
    for (let i = 0; i < maxCycles; i++) {
      const startAge = i * cycleDuration;
      const endAge = (i + 1) * cycleDuration - 1;
      const elementIndex = i % 5;
      const element = this.elements[elementIndex];
      const polarity = i % 2 === 0 ? ChinesePolarity.YANG : ChinesePolarity.YIN;
      
      cycles.push({
        number: i + 1,
        element,
        polarity,
        startAge,
        endAge,
        description: this.getCycleDescription(element, polarity),
        challenges: this.getCycleChallenges(element),
        opportunities: this.getCycleOpportunities(element)
      });
    }
    
    return cycles;
  }

  /**
   * Calcula a sorte atual
   */
  private calculateCurrentLuck(birthYear: number, currentYear: number): {
    element: ChineseElement;
    phase: string;
    score: number;
  } {
    const age = currentYear - birthYear;
    const cycleIndex = Math.floor(age / 12) % 5;
    const element = this.elements[cycleIndex];
    
    // Fases dentro do ciclo
    const phaseIndex = age % 12;
    const phases = [
      'Início', 'Crescimento', 'Expansão', 'Maturação',
      'Estabilidade', 'Reflexão', 'Transformação', 'Renovação',
      'Preparação', 'Culminação', 'Transição', 'Integração'
    ];
    
    const phase = phases[phaseIndex];
    
    // Score baseado na posição no ciclo
    const score = Math.round(50 + (Math.sin((phaseIndex / 12) * 2 * Math.PI) * 30));
    
    return { element, phase, score };
  }

  /**
   * Utilitário: dias desde 1900
   */
  private daysSince1900(year: number, month: number, day: number): number {
    const date1900 = new Date(1900, 0, 1);
    const targetDate = new Date(year, month - 1, day);
    const diffTime = targetDate.getTime() - date1900.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Descrição do ciclo de vida
   */
  private getCycleDescription(element: ChineseElement, polarity: ChinesePolarity): string {
    const descriptions: Record<ChineseElement, string> = {
      [ChineseElement.WOOD]: 'Período de crescimento e expansão criativa',
      [ChineseElement.FIRE]: 'Fase de manifestação e expressão intensa',
      [ChineseElement.EARTH]: 'Tempo de estabilização e consolidação',
      [ChineseElement.METAL]: 'Período de refinamento e estruturação',
      [ChineseElement.WATER]: 'Fase de renovação e fluxo adaptativo'
    };
    
    const polarityDesc = polarity === ChinesePolarity.YANG 
      ? 'com energia ativa e externa' 
      : 'com energia receptiva e interna';
    
    return `${descriptions[element]} ${polarityDesc}`;
  }

  /**
   * Desafios do ciclo
   */
  private getCycleChallenges(element: ChineseElement): string[] {
    const challenges: Record<ChineseElement, string[]> = {
      [ChineseElement.WOOD]: ['Impaciência', 'Dispersão de energia', 'Excesso de ambição'],
      [ChineseElement.FIRE]: ['Impulsividade', 'Burnout', 'Conflitos intensos'],
      [ChineseElement.EARTH]: ['Estagnação', 'Resistência a mudanças', 'Pessimismo'],
      [ChineseElement.METAL]: ['Rigidez', 'Perfeccionismo', 'Isolamento'],
      [ChineseElement.WATER]: ['Indecisão', 'Instabilidade emocional', 'Falta de direção']
    };
    
    return challenges[element] || [];
  }

  /**
   * Oportunidades do ciclo
   */
  private getCycleOpportunities(element: ChineseElement): string[] {
    const opportunities: Record<ChineseElement, string[]> = {
      [ChineseElement.WOOD]: ['Novos projetos', 'Crescimento pessoal', 'Liderança criativa'],
      [ChineseElement.FIRE]: ['Reconhecimento', 'Inspiração aos outros', 'Transformação rápida'],
      [ChineseElement.EARTH]: ['Construção sólida', 'Relacionamentos duradouros', 'Segurança'],
      [ChineseElement.METAL]: ['Maestria técnica', 'Clareza mental', 'Organização eficaz'],
      [ChineseElement.WATER]: ['Adaptabilidade', 'Intuição apurada', 'Renovação profunda']
    };
    
    return opportunities[element] || [];
  }
}