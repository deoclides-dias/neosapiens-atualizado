// src/modules/traditions/chinese-astrology/services/ChineseAstrologyInterpreter.ts

import {
  ChineseZodiacSign,
  ChineseElement,
  ChinesePolarity,
  ElementalSign,
  ChineseAstrologyProfile,
  ChineseZodiacDescription,
  ChineseElementDescription,
  ChineseLifeCycle
} from '../types/chineseAstrologyTypes';
import { TraditionInsight, InsightType } from '../../types/traditionTypes';

// Constantes para ciclos de elementos
const GENERATIVE_CYCLE: Record<ChineseElement, ChineseElement> = {
  [ChineseElement.WOOD]: ChineseElement.FIRE,
  [ChineseElement.FIRE]: ChineseElement.EARTH,
  [ChineseElement.EARTH]: ChineseElement.METAL,
  [ChineseElement.METAL]: ChineseElement.WATER,
  [ChineseElement.WATER]: ChineseElement.WOOD
};

const CONTROLLING_CYCLE: Record<ChineseElement, ChineseElement> = {
  [ChineseElement.WOOD]: ChineseElement.EARTH,
  [ChineseElement.FIRE]: ChineseElement.METAL,
  [ChineseElement.EARTH]: ChineseElement.WATER,
  [ChineseElement.METAL]: ChineseElement.WOOD,
  [ChineseElement.WATER]: ChineseElement.FIRE
};

/**
 * Serviço para interpretação de astrologia chinesa
 */
export default class ChineseAstrologyInterpreter {
  /**
   * Interpreta um perfil de astrologia chinesa e gera insights
   */
  interpretProfile(profile: ChineseAstrologyProfile): TraditionInsight[] {
    const insights: TraditionInsight[] = [];
    
    // Adicionar insight para signo do ano
    const yearSignInsight = this.createYearSignInsight(profile.yearSign, profile.userId);
    insights.push(yearSignInsight);
    
    // Adicionar insight para elemento dominante
    const dominantElementInsight = this.createDominantElementInsight(profile.dominantElement, profile.userId);
    insights.push(dominantElementInsight);
    
    // Adicionar insight para polaridade
    const polarityInsight = this.createPolarityInsight(profile.polarity, profile.userId);
    insights.push(polarityInsight);
    
    // Adicionar insight para equilíbrio elemental
    const elementalBalanceInsight = this.createElementalBalanceInsight(profile.elementalBalance, profile.userId);
    insights.push(elementalBalanceInsight);
    
    // Adicionar insight para ciclo de vida atual
    const currentLifeCycle = this.findCurrentLifeCycle(profile.lifeCycles);
    if (currentLifeCycle) {
      const lifeCycleInsight = this.createLifeCycleInsight(currentLifeCycle, profile.userId);
      insights.push(lifeCycleInsight);
    }
    
    // Adicionar insight para sorte atual (se disponível)
    if (profile.currentLuck) {
      const currentLuckInsight = this.createCurrentLuckInsight(profile.currentLuck, profile.userId);
      insights.push(currentLuckInsight);
    }
    
    // Adicionar insight para compatibilidades
    const compatibilityInsight = this.createCompatibilityInsight(
      profile.compatibleSigns, 
      profile.challengingSigns, 
      profile.userId
    );
    insights.push(compatibilityInsight);
    
    // Adicionar insights para as três dimensões
    const dimensionalInsights = this.createDimensionalInsights(profile);
    insights.push(...dimensionalInsights);
    
    return insights;
  }
  
  /**
   * Cria insight para o signo do ano
   */
  private createYearSignInsight(yearSign: ElementalSign, userId: string): TraditionInsight {
    const signDescription = this.getZodiacDescription(yearSign.sign);
    
    const title = `${yearSign.sign} de ${yearSign.element}`;
    
    let description = `Seu signo chinês principal é o ${yearSign.sign} de ${yearSign.element}. `;
    description += `${signDescription.generalDescription}\n\n`;
    
    description += `Características principais:\n`;
    signDescription.personality.characteristics.slice(0, 3).forEach(trait => {
      description += `• ${trait}\n`;
    });
    
    description += `\nPontos fortes:\n`;
    signDescription.personality.strengths.slice(0, 3).forEach(strength => {
      description += `• ${strength}\n`;
    });
    
    return {
      id: `year-sign-${userId}-${Date.now()}`,
      analysisId: '',
      userId,
      type: InsightType.PATTERN,
      title,
      description,
      relevanceScore: 95,
      dimension: 'purpose',
      actionable: true,
      suggestedActions: [
        `Explore atividades que estimulem suas qualidades naturais de ${yearSign.sign}`,
        `Cultive as características de ${yearSign.element} em suas práticas diárias`,
        `Desenvolva seus pontos fortes de forma equilibrada`
      ]
    };
  }

  /**
   * Cria insight para elemento dominante
   */
  private createDominantElementInsight(dominantElement: ChineseElement, userId: string): TraditionInsight {
    const elementDescription = this.getElementDescription(dominantElement);
    
    const title = `Elemento Dominante: ${dominantElement}`;
    
    let description = `Seu elemento dominante é ${dominantElement}. `;
    description += `${elementDescription.generalDescription}\n\n`;
    
    description += `Qualidades do elemento:\n`;
    elementDescription.personality.slice(0, 3).forEach(quality => {
      description += `• ${quality}\n`;
    });
    
    return {
      id: `dominant-element-${userId}-${Date.now()}`,
      analysisId: '',
      userId,
      type: InsightType.STRENGTH,
      title,
      description,
      relevanceScore: 85,
      dimension: 'body',
      actionable: true,
      suggestedActions: [
        `Integre atividades que nutram o elemento ${dominantElement}`,
        `Observe como este elemento se manifesta em seu dia a dia`,
        `Pratique o equilíbrio com outros elementos`
      ]
    };
  }

  /**
   * Cria insight para polaridade
   */
  private createPolarityInsight(polarity: ChinesePolarity, userId: string): TraditionInsight {
    const title = `Polaridade: ${polarity}`;
    
    let description = `Sua polaridade é ${polarity}, que indica energia `;
    description += polarity === ChinesePolarity.YANG 
      ? "ativa, expansiva e exteriorizada. Você tende a expressar-se de forma direta e buscar ação no mundo."
      : "receptiva, nutridora e interiorizada. Você tende a processar profundamente e agir de forma contemplativa.";
    
    return {
      id: `polarity-${userId}-${Date.now()}`,
      analysisId: '',
      userId,
      type: InsightType.PATTERN,
      title,
      description,
      relevanceScore: 75,
      dimension: 'mind',
      actionable: true,
      suggestedActions: [
        polarity === ChinesePolarity.YANG 
          ? "Equilibre momentos de ação com períodos de reflexão"
          : "Equilibre momentos de introspecção com expressão externa",
        `Honre sua natureza ${polarity} em suas escolhas diárias`,
        "Pratique a integração de ambas as polaridades"
      ]
    };
  }

  /**
   * Cria insight para equilíbrio elemental
   */
  private createElementalBalanceInsight(elementalBalance: Record<ChineseElement, number>, userId: string): TraditionInsight {
    const strongestElement = this.getStrongestElement(elementalBalance);
    const weakestElement = this.getWeakestElement(elementalBalance);
    
    const title = "Equilíbrio Elemental";
    
    let description = `Seu equilíbrio elemental mostra que ${strongestElement} é seu elemento mais forte, `;
    description += `enquanto ${weakestElement} é o que mais precisa de desenvolvimento.\n\n`;
    
    description += "Distribuição elemental:\n";
    Object.entries(elementalBalance).forEach(([element, value]) => {
      description += `• ${element}: ${value}%\n`;
    });
    
    return {
      id: `elemental-balance-${userId}-${Date.now()}`,
      analysisId: '',
      userId,
      type: InsightType.OPPORTUNITY,
      title,
      description,
      relevanceScore: 80,
      dimension: 'integration',
      actionable: true,
      suggestedActions: [
        `Cultive práticas que desenvolvam o elemento ${weakestElement}`,
        `Use sua força em ${strongestElement} como base para crescimento`,
        "Busque atividades que integrem todos os elementos"
      ]
    };
  }

  /**
   * Cria insight para ciclo de vida
   */
  private createLifeCycleInsight(lifeCycle: ChineseLifeCycle, userId: string): TraditionInsight {
    const title = `Ciclo de Vida Atual: ${lifeCycle.element}`;
    
    let description = `Você está no ciclo ${lifeCycle.number} (${lifeCycle.startAge}-${lifeCycle.endAge} anos), `;
    description += `governado pelo elemento ${lifeCycle.element}. `;
    description += `${lifeCycle.description}\n\n`;
    
    description += "Oportunidades desta fase:\n";
    lifeCycle.opportunities.forEach(opp => {
      description += `• ${opp}\n`;
    });
    
    description += "\nDesafios a observar:\n";
    lifeCycle.challenges.forEach(challenge => {
      description += `• ${challenge}\n`;
    });
    
    return {
      id: `life-cycle-${userId}-${Date.now()}`,
      analysisId: '',
      userId,
      type: InsightType.OPPORTUNITY,
      title,
      description,
      relevanceScore: 85,
      dimension: 'purpose',
      actionable: true,
      suggestedActions: [
        `Aproveite as oportunidades específicas do elemento ${lifeCycle.element}`,
        "Mantenha-se atento aos desafios típicos desta fase",
        "Alinhe seus projetos com a energia deste ciclo"
      ]
    };
  }

  /**
   * Cria insight para sorte atual
   */
  private createCurrentLuckInsight(currentLuck: { element: ChineseElement; phase: string; score: number }, userId: string): TraditionInsight {
    const title = `Energia Atual: ${currentLuck.phase}`;
    
    let description = `Você está na fase "${currentLuck.phase}" do elemento ${currentLuck.element}, `;
    description += `com um score energético de ${currentLuck.score}/100.\n\n`;
    
    if (currentLuck.score >= 70) {
      description += "Este é um período favorável para iniciativas importantes.";
    } else if (currentLuck.score >= 40) {
      description += "Este é um período moderado, ideal para consolidação.";
    } else {
      description += "Este é um período de reflexão e preparação para o futuro.";
    }
    
    return {
      id: `current-luck-${userId}-${Date.now()}`,
      analysisId: '',
      userId,
      type: InsightType.OPPORTUNITY,
      title,
      description,
      relevanceScore: 70,
      dimension: 'purpose',
      actionable: true,
      suggestedActions: [
        currentLuck.score >= 70 ? "Aproveite este momento para ações decisivas" : "Use este período para planejamento e preparação",
        `Conecte-se com as qualidades do elemento ${currentLuck.element}`,
        "Observe os sinais de mudança de fase"
      ]
    };
  }

  /**
   * Cria insight para compatibilidades
   */
  private createCompatibilityInsight(compatibleSigns: ChineseZodiacSign[], challengingSigns: ChineseZodiacSign[], userId: string): TraditionInsight {
    const title = "Relacionamentos e Compatibilidades";
    
    let description = "Baseado na astrologia chinesa, suas afinidades naturais são:\n\n";
    
    description += "Signos compatíveis:\n";
    compatibleSigns.forEach(sign => {
      description += `• ${sign} - energia complementar e harmoniosa\n`;
    });
    
    description += "\nSignos desafiadores:\n";
    challengingSigns.forEach(sign => {
      description += `• ${sign} - energias que requerem maior compreensão mútua\n`;
    });
    
    return {
      id: `compatibility-${userId}-${Date.now()}`,
      analysisId: '',
      userId,
      type: InsightType.PATTERN,
      title,
      description,
      relevanceScore: 65,
      dimension: 'purpose',
      actionable: true,
      suggestedActions: [
        "Use as compatibilidades para formar parcerias estratégicas",
        "Aborde relacionamentos desafiadores com maior consciência",
        "Lembre-se que todos os relacionamentos podem ser desenvolvidos"
      ]
    };
  }

  /**
   * Cria insights dimensionais
   */
  private createDimensionalInsights(profile: ChineseAstrologyProfile): TraditionInsight[] {
    const insights: TraditionInsight[] = [];
    
    // Insight para Propósito
    insights.push({
      id: `purpose-dimension-${profile.userId}-${Date.now()}`,
      analysisId: '',
      userId: profile.userId,
      type: InsightType.OPPORTUNITY,
      title: "Integração - Propósito",
      description: this.getDimensionalDescription('purpose', profile),
      relevanceScore: 85,
      dimension: 'purpose',
      actionable: true,
      suggestedActions: this.getDimensionalActions('purpose', profile)
    });
    
    // Insight para Corpo
    insights.push({
      id: `body-dimension-${profile.userId}-${Date.now()}`,
      analysisId: '',
      userId: profile.userId,
      type: InsightType.OPPORTUNITY,
      title: "Integração - Corpo",
      description: this.getDimensionalDescription('body', profile),
      relevanceScore: 85,
      dimension: 'body',
      actionable: true,
      suggestedActions: this.getDimensionalActions('body', profile)
    });
    
    // Insight para Mente
    insights.push({
      id: `mind-dimension-${profile.userId}-${Date.now()}`,
      analysisId: '',
      userId: profile.userId,
      type: InsightType.OPPORTUNITY,
      title: "Integração - Mente",
      description: this.getDimensionalDescription('mind', profile),
      relevanceScore: 85,
      dimension: 'mind',
      actionable: true,
      suggestedActions: this.getDimensionalActions('mind', profile)
    });
    
    return insights;
  }

  /**
   * Encontra o ciclo de vida atual
   */
  private findCurrentLifeCycle(lifeCycles: ChineseLifeCycle[]): ChineseLifeCycle | null {
    if (!lifeCycles || lifeCycles.length === 0) {
      return null;
    }
    
    // Para demonstração, assumimos idade de 30 anos
    const currentAge = 30;
    
    return lifeCycles.find(cycle => 
      currentAge >= cycle.startAge && currentAge <= cycle.endAge
    ) || lifeCycles[0];
  }

  /**
   * Obtém elemento mais forte
   */
  private getStrongestElement(elementalBalance: Record<ChineseElement, number>): ChineseElement {
    let strongest = ChineseElement.WOOD;
    let maxValue = 0;
    
    for (const [element, value] of Object.entries(elementalBalance)) {
      if (value > maxValue) {
        maxValue = value;
        strongest = element as ChineseElement;
      }
    }
    
    return strongest;
  }

  /**
   * Obtém elemento mais fraco
   */
  private getWeakestElement(elementalBalance: Record<ChineseElement, number>): ChineseElement {
    let weakest = ChineseElement.WOOD;
    let minValue = 100;
    
    for (const [element, value] of Object.entries(elementalBalance)) {
      if (value < minValue) {
        minValue = value;
        weakest = element as ChineseElement;
      }
    }
    
    return weakest;
  }

  /**
   * Obtém descrição do zodíaco
   */
  private getZodiacDescription(sign: ChineseZodiacSign): ChineseZodiacDescription {
    const descriptions: Record<ChineseZodiacSign, ChineseZodiacDescription> = {
      [ChineseZodiacSign.RAT]: {
        sign: ChineseZodiacSign.RAT,
        generalDescription: "Pessoas nascidas sob este signo tendem a ser inteligentes, versáteis e possuir excepcional habilidade de adaptação.",
        personalityDescriptionBrief: "Adaptável e inteligente",
        personality: {
          strengths: ["Adaptabilidade", "Inteligência", "Charme", "Versatilidade"],
          challenges: ["Ansiedade", "Dispersão", "Oportunismo", "Inquietação"],
          characteristics: ["Engenhoso", "Astuto", "Sociável", "Perspicaz"]
        },
        relationships: {
          love: "Busca estimulação mental e variedade",
          friendship: "Leal e animado, mantém uma rede social diversificada",
          family: "Protetor e atento às necessidades dos familiares",
          bestMatches: [ChineseZodiacSign.DRAGON, ChineseZodiacSign.MONKEY, ChineseZodiacSign.OX],
          challengingMatches: [ChineseZodiacSign.HORSE, ChineseZodiacSign.GOAT]
        },
        career: {
          aptitudes: ["Negociação", "Comunicação", "Resolução de problemas", "Adaptação a mudanças"],
          environments: ["Dinâmicos", "Variados", "Intelectualmente estimulantes"],
          challenges: ["Rotina excessiva", "Falta de desafios", "Microgerenciamento"]
        }
      },
      [ChineseZodiacSign.OX]: {
        sign: ChineseZodiacSign.OX,
        generalDescription: "Determinado, confiável e persistente, com forte senso de responsabilidade.",
        personalityDescriptionBrief: "Determinado e confiável",
        personality: {
          strengths: ["Persistência", "Confiabilidade", "Força", "Determinação"],
          challenges: ["Teimosia", "Inflexibilidade", "Lentidão para mudanças"],
          characteristics: ["Metódico", "Leal", "Prático", "Honesto"]
        },
        relationships: {
          love: "Busca relacionamentos estáveis e duradouros",
          friendship: "Amigo leal e confiável",
          family: "Provedor dedicado e protetor",
          bestMatches: [ChineseZodiacSign.SNAKE, ChineseZodiacSign.ROOSTER],
          challengingMatches: [ChineseZodiacSign.GOAT, ChineseZodiacSign.TIGER]
        },
        career: {
          aptitudes: ["Trabalho metodológico", "Gestão", "Agricultura", "Construção"],
          environments: ["Estruturados", "Estáveis", "Com responsabilidades claras"],
          challenges: ["Mudanças rápidas", "Ambiguidade", "Pressão por inovação"]
        }
      },
      // Simplificando os demais para o contexto do build
      [ChineseZodiacSign.TIGER]: this.createBasicZodiacDescription(ChineseZodiacSign.TIGER, "Corajoso e líder natural"),
      [ChineseZodiacSign.RABBIT]: this.createBasicZodiacDescription(ChineseZodiacSign.RABBIT, "Gentil e diplomático"),
      [ChineseZodiacSign.DRAGON]: this.createBasicZodiacDescription(ChineseZodiacSign.DRAGON, "Carismático e ambicioso"),
      [ChineseZodiacSign.SNAKE]: this.createBasicZodiacDescription(ChineseZodiacSign.SNAKE, "Sábio e intuitivo"),
      [ChineseZodiacSign.HORSE]: this.createBasicZodiacDescription(ChineseZodiacSign.HORSE, "Livre e energético"),
      [ChineseZodiacSign.GOAT]: this.createBasicZodiacDescription(ChineseZodiacSign.GOAT, "Criativo e sensível"),
      [ChineseZodiacSign.MONKEY]: this.createBasicZodiacDescription(ChineseZodiacSign.MONKEY, "Inteligente e versátil"),
      [ChineseZodiacSign.ROOSTER]: this.createBasicZodiacDescription(ChineseZodiacSign.ROOSTER, "Organizado e confiante"),
      [ChineseZodiacSign.DOG]: this.createBasicZodiacDescription(ChineseZodiacSign.DOG, "Leal e honesto"),
      [ChineseZodiacSign.PIG]: this.createBasicZodiacDescription(ChineseZodiacSign.PIG, "Generoso e honesto")
    };
    
    return descriptions[sign];
  }

  /**
   * Cria descrição básica do zodíaco
   */
  private createBasicZodiacDescription(sign: ChineseZodiacSign, brief: string): ChineseZodiacDescription {
    return {
      sign,
      generalDescription: `Pessoas nascidas sob este signo são caracterizadas como ${brief.toLowerCase()}.`,
      personalityDescriptionBrief: brief,
      personality: {
        strengths: ["Força natural", "Qualidades únicas", "Características especiais"],
        challenges: ["Desafios específicos", "Pontos de atenção", "Áreas de crescimento"],
        characteristics: ["Traço distintivo", "Qualidade marcante", "Característica única"]
      },
      relationships: {
        love: "Abordagem característica nos relacionamentos",
        friendship: "Estilo único de amizade",
        family: "Papel especial na família",
        bestMatches: [],
        challengingMatches: []
      },
      career: {
        aptitudes: ["Habilidade natural", "Talento específico", "Capacidade especial"],
        environments: ["Ambiente ideal", "Contexto favorável", "Situação adequada"],
        challenges: ["Dificuldade específica", "Desafio particular", "Obstáculo comum"]
      }
    };
  }

  /**
   * Obtém descrição do elemento
   */
  private getElementDescription(element: ChineseElement): ChineseElementDescription {
    const descriptions: Record<ChineseElement, ChineseElementDescription> = {
      [ChineseElement.WOOD]: {
        element: ChineseElement.WOOD,
        generalDescription: "O elemento Madeira representa crescimento, flexibilidade e expansão criativa.",
        personalityDescriptionBrief: "crescimento e criatividade",
        personality: ["Criativo", "Flexível", "Inovador", "Expansivo"],
        strengths: ["Adaptabilidade", "Crescimento", "Visão", "Renovação"],
        challenges: ["Impaciência", "Dispersão", "Instabilidade"],
        physical: ["Energia em crescimento", "Flexibilidade", "Vitalidade"],
        mental: ["Criatividade", "Visão de futuro", "Inovação"],
        spiritual: ["Renovação", "Crescimento espiritual", "Conexão com a natureza"]
      },
      [ChineseElement.FIRE]: {
        element: ChineseElement.FIRE,
        generalDescription: "O elemento Fogo representa paixão, transformação e expressão dinâmica.",
        personalityDescriptionBrief: "paixão e transformação",
        personality: ["Apaixonado", "Dinâmico", "Expressivo", "Transformador"],
        strengths: ["Energia", "Carisma", "Inspiração", "Liderança"],
        challenges: ["Impulsividade", "Burnout", "Intensidade excessiva"],
        physical: ["Energia intensa", "Calor", "Atividade"],
        mental: ["Pensamento rápido", "Inspiração", "Clareza"],
        spiritual: ["Iluminação", "Transformação", "Purificação"]
      },
      [ChineseElement.EARTH]: {
        element: ChineseElement.EARTH,
        generalDescription: "O elemento Terra representa estabilidade, nutrição e fundação sólida.",
        personalityDescriptionBrief: "estabilidade e nutrição",
        personality: ["Estável", "Nutridora", "Prática", "Confiável"],
        strengths: ["Estabilidade", "Praticidade", "Apoio", "Persistência"],
        challenges: ["Lentidão", "Resistência a mudanças", "Possessividade"],
        physical: ["Força", "Resistência", "Estabilidade"],
        mental: ["Praticidade", "Método", "Concentração"],
        spiritual: ["Enraizamento", "Conexão com a terra", "Nutrição da alma"]
      },
      [ChineseElement.METAL]: {
        element: ChineseElement.METAL,
        generalDescription: "O elemento Metal representa clareza, precisão e refinamento.",
        personalityDescriptionBrief: "clareza e precisão",
        personality: ["Preciso", "Organizado", "Refinado", "Analítico"],
        strengths: ["Clareza", "Organização", "Análise", "Refinamento"],
        challenges: ["Rigidez", "Perfeccionismo", "Frieza"],
        physical: ["Precisão", "Estrutura", "Resistência"],
        mental: ["Análise", "Lógica", "Clareza"],
        spiritual: ["Purificação", "Clareza espiritual", "Discernimento"]
      },
      [ChineseElement.WATER]: {
        element: ChineseElement.WATER,
        generalDescription: "O elemento Água representa fluidez, sabedoria e adaptação profunda.",
        personalityDescriptionBrief: "fluidez e sabedoria",
        personality: ["Fluido", "Sábio", "Adaptável", "Intuitivo"],
        strengths: ["Adaptabilidade", "Intuição", "Sabedoria", "Fluxo"],
        challenges: ["Indecisão", "Instabilidade", "Tendência ao isolamento"],
        physical: ["Fluidez", "Adaptação", "Renovação"],
        mental: ["Intuição", "Sabedoria", "Flexibilidade mental"],
        spiritual: ["Profundidade", "Sabedoria ancestral", "Conexão com o inconsciente"]
      }
    };
    
    return descriptions[element];
  }

  /**
   * Obtém descrição para dimensão específica
   */
  private getDimensionalDescription(dimension: 'purpose' | 'body' | 'mind', profile: ChineseAstrologyProfile): string {
    const { yearSign, dominantElement, polarity } = profile;
    
    if (dimension === 'purpose') {
      return `Sua dimensão do Propósito é influenciada pelo signo ${yearSign.sign} de ${yearSign.element} e pela energia dominante de ${dominantElement}.

O signo ${yearSign.sign} na tradição chinesa revela sua natureza essencial e caminho de vida. ${this.getZodiacDescription(yearSign.sign).generalDescription}

O elemento ${dominantElement} molda como você expressa seu propósito no mundo, trazendo qualidades de ${this.getElementDescription(dominantElement).personalityDescriptionBrief}.

A polaridade ${polarity} indica que sua expressão de propósito tende a ser mais ${polarity === ChinesePolarity.YANG ? "ativa e manifesta" : "receptiva e nutridora"}.`;
    }
    
    if (dimension === 'body') {
      return `Sua dimensão do Corpo é influenciada pelo signo ${yearSign.sign} de ${yearSign.element} e pela energia dominante de ${dominantElement}.

O signo ${yearSign.sign} tende a manifestar-se fisicamente através de características específicas de força e vitalidade.

O elemento ${dominantElement} influencia seus ritmos físicos e energia vital, trazendo tendências para ${this.getElementDescription(dominantElement).personalityDescriptionBrief}.

A polaridade ${polarity} indica que sua energia física tende a ser mais ${polarity === ChinesePolarity.YANG ? "ativa, expressiva e dinâmica" : "receptiva, conservadora e cíclica"}.`;
    }
    
    if (dimension === 'mind') {
      return `Sua dimensão da Mente é influenciada pelo signo ${yearSign.sign} de ${yearSign.element} e pela energia dominante de ${dominantElement}.

O signo ${yearSign.sign} tende a processar informações através de padrões mentais característicos.

O elemento ${dominantElement} influencia seus padrões mentais, trazendo tendências para ${this.getElementDescription(dominantElement).personalityDescriptionBrief}.

A polaridade ${polarity} indica que seus processos mentais tendem a ser mais ${polarity === ChinesePolarity.YANG ? "analíticos, lógicos e assertivos" : "intuitivos, sintetizadores e receptivos"}.`;
    }
    
    return "Esta dimensão é influenciada por seu perfil astrológico chinês de maneiras únicas.";
  }
  
  /**
   * Obtém ações sugeridas para uma dimensão
   */
  private getDimensionalActions(dimension: 'purpose' | 'body' | 'mind', profile: ChineseAstrologyProfile): string[] {
    const { yearSign, dominantElement, polarity } = profile;
    
    if (dimension === 'purpose') {
      return [
        `Explore atividades que estimulem as qualidades de ${yearSign.sign}`,
        `Cultive práticas que harmonizem com o elemento ${dominantElement}`,
        `Honre sua tendência natural para energia ${polarity}`
      ];
    }
    
    if (dimension === 'body') {
      return [
        `Pratique atividades físicas alinhadas com as energias de ${yearSign.sign}`,
        `Integre práticas que nutram o elemento ${dominantElement} no corpo`,
        `Respeite seus ciclos naturais de ${polarity === ChinesePolarity.YANG ? "atividade e expressão" : "restauração e conservação"}`
      ];
    }
    
    if (dimension === 'mind') {
      return [
        `Cultive práticas mentais que estimulem as qualidades de ${yearSign.sign}`,
        `Desenvolva abordagens intelectuais alinhadas com o elemento ${dominantElement}`,
        `Honre seus processos cognitivos naturalmente ${polarity === ChinesePolarity.YANG ? "ativos e estruturados" : "receptivos e intuitivos"}`
      ];
    }
    
    return [
      "Observe como esta dimensão é influenciada por seu perfil astrológico chinês",
      "Desenvolva consciência sobre padrões recorrentes nesta área",
      "Cultive práticas que honrem suas tendências naturais"
    ];
  }
}