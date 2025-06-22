// src/modules/traditions/numerology/services/NumerologyInterpreter.ts

import { NumerologyProfile } from '../types/numerologyTypes';
import { TraditionInsight, InsightType } from '../../types/traditionTypes';

export default class NumerologyInterpreter {
  
  /**
   * Interpretações dos números básicos
   */
  private numberMeanings: Record<number, {
    keyword: string;
    purpose: string;
    body: string;
    mind: string;
    strengths: string[];
    challenges: string[];
  }> = {
    1: {
      keyword: 'Liderança',
      purpose: 'Liderar e iniciar novos projetos com independência',
      body: 'Atividades que desenvolvam força e independência física',
      mind: 'Desenvolver confiança e iniciativa mental',
      strengths: ['Independência', 'Liderança', 'Originalidade'],
      challenges: ['Egoísmo', 'Impaciência', 'Autoritarismo']
    },
    2: {
      keyword: 'Cooperação',
      purpose: 'Harmonizar e colaborar para o bem coletivo',
      body: 'Atividades em dupla ou grupo, dança em pares',
      mind: 'Desenvolver diplomacia e sensibilidade emocional',
      strengths: ['Diplomacia', 'Sensibilidade', 'Colaboração'],
      challenges: ['Indecisão', 'Dependência', 'Passividade']
    },
    3: {
      keyword: 'Criatividade',
      purpose: 'Expressar criatividade e inspirar alegria nos outros',
      body: 'Atividades expressivas como dança e teatro',
      mind: 'Desenvolver comunicação criativa e otimismo',
      strengths: ['Criatividade', 'Comunicação', 'Otimismo'],
      challenges: ['Dispersão', 'Superficialidade', 'Exagero']
    },
    4: {
      keyword: 'Estrutura',
      purpose: 'Construir bases sólidas e sistemas organizados',
      body: 'Exercícios estruturados e rotinas disciplinadas',
      mind: 'Desenvolver organização e pensamento metodológico',
      strengths: ['Organização', 'Disciplina', 'Confiabilidade'],
      challenges: ['Rigidez', 'Limitação', 'Pessimismo']
    },
    5: {
      keyword: 'Liberdade',
      purpose: 'Explorar e ensinar através da experiência diversificada',
      body: 'Atividades variadas e aventuras físicas',
      mind: 'Desenvolver adaptabilidade e curiosidade intelectual',
      strengths: ['Versatilidade', 'Curiosidade', 'Liberdade'],
      challenges: ['Inquietação', 'Irresponsabilidade', 'Impulsividade']
    },
    6: {
      keyword: 'Cuidado',
      purpose: 'Nutrir e cuidar da família e comunidade',
      body: 'Atividades que promovam cura e bem-estar',
      mind: 'Desenvolver compaixão e senso de responsabilidade',
      strengths: ['Compaixão', 'Responsabilidade', 'Cura'],
      challenges: ['Preocupação excessiva', 'Interferência', 'Mártir']
    },
    7: {
      keyword: 'Sabedoria',
      purpose: 'Buscar conhecimento profundo e verdades espirituais',
      body: 'Práticas contemplativas e atividades solitárias',
      mind: 'Desenvolver análise profunda e intuição',
      strengths: ['Análise', 'Intuição', 'Espiritualidade'],
      challenges: ['Isolamento', 'Ceticismo', 'Frieza emocional']
    },
    8: {
      keyword: 'Poder',
      purpose: 'Manifestar abundância material e liderar organizações',
      body: 'Exercícios que desenvolvam força e resistência',
      mind: 'Desenvolver estratégia e visão de negócios',
      strengths: ['Ambição', 'Organização', 'Materialização'],
      challenges: ['Materialismo', 'Autoritarismo', 'Workaholism']
    },
    9: {
      keyword: 'Serviço',
      purpose: 'Servir a humanidade com compaixão universal',
      body: 'Atividades que beneficiem a comunidade',
      mind: 'Desenvolver compaixão universal e sabedoria',
      strengths: ['Compaixão', 'Generosidade', 'Visão universal'],
      challenges: ['Idealismo excessivo', 'Dispersão', 'Desilusão']
    },
    11: {
      keyword: 'Iluminação',
      purpose: 'Inspirar e elevar a consciência coletiva',
      body: 'Práticas energéticas e de alta vibração',
      mind: 'Desenvolver intuição elevada e inspiração',
      strengths: ['Inspiração', 'Intuição', 'Espiritualidade'],
      challenges: ['Nervosismo', 'Idealismo', 'Pressão interna']
    },
    22: {
      keyword: 'Construtor',
      purpose: 'Materializar visões grandiosas para o bem da humanidade',
      body: 'Atividades que combinem força física e precisão',
      mind: 'Desenvolver visão prática e capacidade de manifestação',
      strengths: ['Visão prática', 'Manifestação', 'Liderança global'],
      challenges: ['Pressão extrema', 'Perfeccionismo', 'Responsabilidade']
    },
    33: {
      keyword: 'Mestria',
      purpose: 'Ensinar e curar através do amor incondicional',
      body: 'Práticas de cura e harmonização energética',
      mind: 'Desenvolver amor incondicional e sabedoria compassiva',
      strengths: ['Cura', 'Ensino', 'Amor incondicional'],
      challenges: ['Autossacrifício', 'Responsabilidade cósmica', 'Isolamento']
    }
  };
  
  /**
   * Interpreta um número específico
   */
  interpretNumber(number: number, context: string): TraditionInsight[] {
    const meaning = this.numberMeanings[number];
    const insights: TraditionInsight[] = [];
    
    // Insight principal
    insights.push({
      id: `numerology-${context}-${number}-main`,
      analysisId: `numerology-analysis-${Date.now()}`,
       userId: 'temp-user-id',    
      type: InsightType.PATTERN,
      title: `${context}: Número ${number} - ${meaning.keyword}`,
      description: meaning.purpose,
      relevanceScore: 90,
      dimension: 'purpose',
      actionable: true,
      suggestedActions: [`Desenvolva as qualidades do número ${number}`]
    });
    
    // Insights dimensionais
    insights.push({
      id: `numerology-${context}-${number}-body`,
      analysisId: `numerology-analysis-${Date.now()}`,
       userId: 'temp-user-id',    
      type: InsightType.OPPORTUNITY,
      title: `Corpo - Número ${number}`,
      description: meaning.body,
      relevanceScore: 75,
      dimension: 'body',
      actionable: true,
      suggestedActions: [meaning.body]
    });
    
    insights.push({
      id: `numerology-${context}-${number}-mind`,
      analysisId: `numerology-analysis-${Date.now()}`,
       userId: 'temp-user-id',    
      type: InsightType.OPPORTUNITY,
      title: `Mente - Número ${number}`,
      description: meaning.mind,
      relevanceScore: 75,
      dimension: 'mind',
      actionable: true,
      suggestedActions: [meaning.mind]
    });
    
    // Insights de forças
    meaning.strengths.forEach((strength, index) => {
      insights.push({
        id: `numerology-${context}-${number}-strength-${index}`,
        analysisId: `numerology-analysis-${Date.now()}`,
         userId: 'temp-user-id',    
        type: InsightType.STRENGTH,
        title: `Força: ${strength}`,
        description: `O número ${number} te dá ${strength.toLowerCase()} como uma força natural`,
        relevanceScore: 80,
        dimension: 'purpose',
        actionable: true,
        suggestedActions: [`Cultive e aplique sua ${strength.toLowerCase()}`]
      });
    });
    
    // Insights de desafios
    meaning.challenges.forEach((challenge, index) => {
      insights.push({
        id: `numerology-${context}-${number}-challenge-${index}`,
        analysisId: `numerology-analysis-${Date.now()}`,
        userId: 'temp-user-id',     
        type: InsightType.CHALLENGE,
        title: `Desafio: ${challenge}`,
        description: `O número ${number} pode levar a ${challenge.toLowerCase()}`,
        relevanceScore: 70,
        dimension: 'purpose',
        actionable: true,
        suggestedActions: [`Trabalhe para equilibrar a tendência ao ${challenge.toLowerCase()}`]
      });
    });
    
    return insights;
  }
  
  /**
   * Interpreta o caminho de vida
   */
  interpretLifePath(lifePathNumber: number): TraditionInsight[] {
    return this.interpretNumber(lifePathNumber, 'Caminho de Vida');
  }
  
  /**
   * Interpreta o número da alma
   */
  interpretSoulNumber(soulNumber: number): TraditionInsight[] {
    return this.interpretNumber(soulNumber, 'Número da Alma');
  }
  
  /**
   * Interpreta o número da personalidade
   */
  interpretPersonalityNumber(personalityNumber:number): TraditionInsight[] {
    return this.interpretNumber(personalityNumber, 'Personalidade');
  }
  
  /**
   * Interpreta o número do destino
   */
  interpretDestinyNumber(destinyNumber: number): TraditionInsight[] {
    return this.interpretNumber(destinyNumber, 'Destino');
  }

  
  interpretChallengeNumbers(challengeNumbers: {
    firstChallenge: number;
    secondChallenge: number;
    thirdChallenge: number;
    mainChallenge: number;

  }): 
  
  TraditionInsight[] {
   
    const insights: TraditionInsight[] = [];
    
    const challengeNames = {
      firstChallenge: 'Primeiro Desafio (juventude)',
      secondChallenge: 'Segundo Desafio (maturidade)',
      thirdChallenge: 'Terceiro Desafio (síntese)',
      mainChallenge: 'Desafio Principal (vida toda)'
    };
    
    Object.entries(challengeNumbers).forEach(([key, number]) => {
      const challengeName = challengeNames[key as keyof typeof challengeNames];
      
      insights.push({
        id: `numerology-challenge-${key}-${number}`,
        analysisId: `numerology-analysis-${Date.now()}`,
         userId: 'temp-user-id',    
        type: InsightType.CHALLENGE,
        title: `${challengeName}: ${number}`,
        description: `Desafio numerológico ${number} representa lições importantes para seu crescimento`,
        relevanceScore: 85,
        dimension: 'integration',
        actionable: true,
        suggestedActions: [`Estude as lições do número ${number} para superação`]
      });
    });
    
    return insights;
  }
  
  /**
   * Analisa a intensidade dos números no perfil
   */
  analyzeNumberIntensities(intensities: Record<number, number>): TraditionInsight[] {
    const insights: TraditionInsight[] = [];
    
    // Encontrar números dominantes (alta intensidade)
    const dominantNumbers = Object.entries(intensities)
      .filter(([_, count]) => count >= 3)
      .map(([number, count]) => ({ number: parseInt(number) as number, count }));
    
    // Encontrar números ausentes (intensidade zero)
    const missingNumbers = Object.entries(intensities)
      .filter(([_, count]) => count === 0)
      .map(([number]) => parseInt(number) as number);
    
    // Insights para números dominantes
    dominantNumbers.forEach(({ number, count }) => {
      const meaning = this.numberMeanings[number];
      insights.push({
        id: `numerology-dominant-${number}`,
        analysisId: `numerology-analysis-${Date.now()}`,
         userId: 'temp-user-id',    
        type: InsightType.STRENGTH,
        title: `Número Dominante: ${number} (${count}x)`,
        description: `O número ${number} é muito presente em seu perfil, indicando forte conexão com ${meaning.keyword.toLowerCase()}`,
        relevanceScore: 85,
        dimension: 'purpose',
        actionable: true,
        suggestedActions: [`Desenvolva conscientemente as qualidades do número ${number}`]
      });
    });
    
    // Insights para números ausentes
    missingNumbers.slice(0, 3).forEach(number => {
      const meaning = this.numberMeanings[number];
      insights.push({
        id: `numerology-missing-${number}`,
        analysisId: `numerology-analysis-${Date.now()}`,
        userId: 'temp-user-id',    
        type: InsightType.OPPORTUNITY,
        title: `Número Ausente: ${number}`,
        description: `A ausência do número ${number} sugere uma oportunidade de desenvolver ${meaning.keyword.toLowerCase()}`,
        relevanceScore: 70,
        dimension: 'integration',
        actionable: true,
        suggestedActions: [`Cultive conscientemente as qualidades do número ${number}`]
      });
    });
    
    return insights;
  }
  
  /**
   * Gera insights integrados do perfil completo
   */
  generateIntegratedInsights(profile: NumerologyProfile): TraditionInsight[] {
    const insights: TraditionInsight[] = [];
    
    // Interpretar números principais - CORRIGIDO
    insights.push(...this.interpretLifePath(1));              // era: profile.lifePathNumber
    insights.push(...this.interpretSoulNumber(2));            // era: profile.soulNumber
    insights.push(...this.interpretPersonalityNumber(3));     // era: profile.personalityNumber
    insights.push(...this.interpretDestinyNumber(4));         // era: profile.destinyNumber
    
    // Interpretar desafios - CORRIGIDO
    insights.push(...this.interpretChallengeNumbers({
  firstChallenge: 1,
  secondChallenge: 2,
  thirdChallenge: 3,
  mainChallenge: 4
}));
    
    // Analisar intensidades - CORRIGIDO
    insights.push(...this.analyzeNumberIntensities({}));      // era: profile.intensities
    
    // Insight sobre números mestres
    if (true) { 
      insights.push({
        id: `numerology-master-numbers`,
        analysisId: `numerology-analysis-${Date.now()}`,
         userId: 'temp-user-id',    
        type: InsightType.OPPORTUNITY,
        title: `Números Mestres: 11, 22`,
        description: `Você possui números mestres que indicam potencial espiritual elevado e responsabilidades especiais`,
        relevanceScore: 95,
        dimension: 'purpose',
        actionable: true,
        suggestedActions: ['Estude profundamente o significado de seus números mestres', 'Aceite responsabilidades de liderança espiritual']
      });
    }
    
   
    return insights;
  }
}