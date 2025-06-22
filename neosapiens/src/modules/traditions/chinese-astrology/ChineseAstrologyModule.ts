// src/modules/traditions/chinese-astrology/ChineseAstrologyModule.ts

import { 
  TraditionModule, 
  TraditionAnalysis, 
  TraditionInsight, 
  VisualizationData,
  FlightPlan,
  EnhancedFlightPlan,
  UserData
} from '../types/traditionTypes';

import { ModuleType } from '../../core/types';
import ChineseAstrologyCalculator from './services/ChineseAstrologyCalculator';
import ChineseAstrologyInterpreter from './services/ChineseAstrologyInterpreter';
import { 
  ChineseAstrologyProfile, 
  ChineseZodiacSign,
  ChineseElement,
  ChinesePolarity,
  ElementalSign,
  ChineseAstrologyVisualization
} from './types/chineseAstrologyTypes';

/**
 * Módulo de Astrologia Chinesa
 * 
 * Implementa a interface TraditionModule para integração
 * com o sistema NeoSapiens.
 */
export default class ChineseAstrologyModule implements TraditionModule {
  // Informações básicas do módulo
  id = 'chinese-astrology';
  name = 'Astrologia Chinesa';
  description = 'Análise baseada na astrologia chinesa e sua integração com as três dimensões';
  version = '1.0.0';
  type = ModuleType.TRADITION;
  
  // Serviços internos
  private calculator: ChineseAstrologyCalculator;
  private interpreter: ChineseAstrologyInterpreter;
  
  // Armazenamento de análises
  private analyses: Map<string, TraditionAnalysis> = new Map();
  private profiles: Map<string, ChineseAstrologyProfile> = new Map();
  private insights: Map<string, TraditionInsight[]> = new Map();
  
  constructor() {
    this.calculator = new ChineseAstrologyCalculator();
    this.interpreter = new ChineseAstrologyInterpreter();
    
    console.log(`Módulo de ${this.name} inicializado`);
  }
  
  /**
   * Inicializa o módulo
   */
  async initialize(config?: any): Promise<void> {
    console.log(`Módulo de ${this.name} inicializado com configurações`, config);
    // Inicializações específicas se necessário
  }
  
  /**
   * Finaliza o módulo
   */
  async shutdown(): Promise<void> {
    console.log(`Módulo de ${this.name} finalizado`);
    // Limpeza de recursos se necessário
  }
  
  /**
   * Verifica se o módulo está disponível para o usuário
   */
  isAvailableForUser(userId: string): boolean {
    // Na implementação real, verificaria permissões ou assinatura
    return true;
  }
  
  /**
   * Retorna metadados do módulo
   */
  getMetadata() {
    return {
      id: this.id,
      name: this.name,
      description: this.description,
      version: this.version,
      author: 'NeoSapiens Team',
      dependencies: [],
      configOptions: []
    };
  }
  
  /**
   * Realiza análise astrológica chinesa completa
   */
  analyze(userData: UserData): TraditionAnalysis {
    // Verificar dados necessários
    if (!userData.birthDate) {
      throw new Error('Data de nascimento é obrigatória para análise de astrologia chinesa');
    }
    
    try {
      // Extrair dados relevantes - CORRIGIDO
      const params = {
        birthDate: userData.birthDate,
        birthTime: userData.birthTime,
        birthPlace: userData.birthPlace, // Agora compatível com a interface
        currentDate: new Date().toISOString().split('T')[0] // Data atual
      };
      
      // Calcular o perfil astrológico chinês
      const profile = this.calculator.calculateProfile(params);
      
      // Atualizar o ID do usuário
      profile.userId = userData.id;
      
      // CORREÇÃO: Criar perfil usando as propriedades corretas da interface
      const correctedProfile: ChineseAstrologyProfile = {
        userId: userData.id,
        birthDate: userData.birthDate,
        
        // Signos dos 4 pilares (usando ElementalSign que tem sign + element)
        yearSign: profile.yearSign,
        monthSign: profile.monthSign,
        daySign: profile.daySign,
        hourSign: profile.hourSign,
        
        // Características derivadas
        dominantElement: profile.dominantElement,
        polarity: profile.polarity,
        elementalBalance: profile.elementalBalance,
        
        // Relacionamentos
        compatibleSigns: profile.compatibleSigns,
        challengingSigns: profile.challengingSigns,
        
        // Ciclos de vida
        lifeCycles: profile.lifeCycles,
        
        // Status atual (opcional)
        currentLuck: profile.currentLuck,
        
        // Metadados
        createdAt: new Date(),
        lastUpdated: new Date()
      };
      
      // Criar a análise
      const analysisId = `${userData.id}-${this.id}-${Date.now()}`;
      
      const analysis: TraditionAnalysis = {
        id: analysisId,
        userId: userData.id,
        traditionId: this.id,
        timestamp: new Date(),
        rawData: correctedProfile,
        processedData: {
          yearSign: correctedProfile.yearSign,
          monthSign: correctedProfile.monthSign,
          daySign: correctedProfile.daySign,
          hourSign: correctedProfile.hourSign,
          dominantElement: correctedProfile.dominantElement,
          elementalBalance: correctedProfile.elementalBalance,
          polarity: correctedProfile.polarity,
          compatibleSigns: correctedProfile.compatibleSigns,
          challengingSigns: correctedProfile.challengingSigns,
          currentLuck: correctedProfile.currentLuck
        },
        status: 'completed'
      };
      
      // Gerar insights
      const insights = this.interpreter.interpretProfile(correctedProfile);
      
      // Armazenar análise, perfil e insights
      this.analyses.set(analysisId, analysis);
      this.profiles.set(analysisId, correctedProfile);
      this.insights.set(analysisId, insights);
      
      // Atualizar os IDs de análise nos insights
      this.insights.get(analysisId)?.forEach(insight => {
        insight.analysisId = analysisId;
      });
      
      return analysis;
      
    } catch (error) {
      // Em caso de erro, retornar análise com status de falha
      const errorAnalysis: TraditionAnalysis = {
        id: `error-${userData.id}-${Date.now()}`,
        userId: userData.id,
        traditionId: this.id,
        timestamp: new Date(),
        rawData: { error },
        processedData: {},
        status: 'failed',
        error: error instanceof Error ? error.message : 'Erro desconhecido na análise'
      };
      
      console.error('Erro na análise de astrologia chinesa:', error);
      return errorAnalysis;
    }
  }

  /**
   * Gera visualizações para o dashboard
   */
  generateVisualization(analysisId: string): VisualizationData | null {
    const profile = this.profiles.get(analysisId);
    
    if (!profile) {
      console.warn(`Perfil não encontrado para análise ${analysisId}`);
      return null;
    }
    
    // Dados para visualização do equilíbrio de elementos 
    // (um pentágono representando o equilíbrio dos 5 elementos)
    const elementalData = Object.entries(profile.elementalBalance).map(([element, value]) => ({
      element,
      value
    }));
    
    // Dados para o zodíaco chinês 
    // (destacando o signo do ano e suas relações)
    const yearSign = profile.yearSign;
    const compatibleSigns = profile.compatibleSigns;
    const challengingSigns = profile.challengingSigns;
    
    const zodiacData = Object.values(ChineseZodiacSign).map(sign => {
      let relation: 'self' | 'compatible' | 'challenging' | 'neutral' = "neutral";
      if (sign === yearSign.sign) {
        relation = "self";
      } else if (compatibleSigns.includes(sign)) {
        relation = "compatible";
      } else if (challengingSigns.includes(sign)) {
        relation = "challenging";
      }
      
      return {
        sign,
        relation
      };
    });
    
    // Dados de ciclos de vida
    const lifeCycleData = profile.lifeCycles.map(cycle => ({
      number: cycle.number,
      element: cycle.element,
      startAge: cycle.startAge,
      endAge: cycle.endAge
    }));
    
    // Dados para a integração tridimensional
    const dimensionalData = [
      { dimension: 'Propósito', value: this.calculateDimensionalValue(profile, 'purpose') },
      { dimension: 'Corpo', value: this.calculateDimensionalValue(profile, 'body') },
      { dimension: 'Mente', value: this.calculateDimensionalValue(profile, 'mind') }
    ];
    
    const visualizationData: ChineseAstrologyVisualization = {
      profile: {
        name: profile.userId, // Em implementação real, teria nome real
        birthDate: profile.birthDate,
        yearSign: `${yearSign.sign} de ${yearSign.element}`
      },
      elements: {
        dominant: profile.dominantElement,
        balance: elementalData
      },
      zodiac: {
        yearSign: yearSign.sign,
        relations: zodiacData
      },
      lifeCycles: lifeCycleData,
      dimensionalBalance: dimensionalData
    };
    
    return {
      type: 'chinese-astrology',
      data: visualizationData,
      config: {
        colorScheme: {
          [ChineseElement.WOOD]: '#4CAF50',  // Verde
          [ChineseElement.FIRE]: '#FF5722',  // Vermelho
          [ChineseElement.EARTH]: '#FFC107', // Amarelo
          [ChineseElement.METAL]: '#BDBDBD', // Cinza
          [ChineseElement.WATER]: '#2196F3'  // Azul
        },
        relationColors: {
          self: '#673AB7',       // Roxo
          compatible: '#4CAF50', // Verde
          challenging: '#F44336',// Vermelho
          neutral: '#9E9E9E'     // Cinza
        },
        dimensionColors: {
          'Propósito': '#9C27B0', // Roxo
          'Corpo': '#4CAF50',     // Verde
          'Mente': '#2196F3'      // Azul
        }
      }
    };
  }
  
  /**
   * Calcula valor dimensional baseado no perfil
   */
  private calculateDimensionalValue(
    profile: ChineseAstrologyProfile,
    dimension: 'purpose' | 'body' | 'mind'
  ): number {
    // Pesos para diferentes aspectos do perfil
    const weights = {
      yearSign: 3,
      dominantElement: 2,
      polarity: 1
    };
    
    let score = 0;
    let totalWeight = 0;
    
    // Avaliar signo anual
    if (this.getDimensionalFocus(profile.yearSign.sign) === dimension) {
      score += weights.yearSign;
    }
    totalWeight += weights.yearSign;
    
    // Avaliar elemento dominante
    if (this.getDimensionalFocus(profile.dominantElement) === dimension) {
      score += weights.dominantElement;
    }
    totalWeight += weights.dominantElement;
    
    // Avaliar polaridade
    const polarityDimension = profile.polarity === ChinesePolarity.YANG ? 'body' : 'mind';
    if (polarityDimension === dimension) {
      score += weights.polarity;
    }
    totalWeight += weights.polarity;
    
    // Retornar porcentagem
    return Math.round((score / totalWeight) * 100);
  }
  
  /**
   * Determina foco dimensional de um signo ou elemento
   */
  private getDimensionalFocus(signOrElement: ChineseZodiacSign | ChineseElement): 'purpose' | 'body' | 'mind' {
    // Mapeamento de signos para dimensões
    const signDimensions: Record<ChineseZodiacSign, 'purpose' | 'body' | 'mind'> = {
      [ChineseZodiacSign.RAT]: 'mind',
      [ChineseZodiacSign.OX]: 'body',
      [ChineseZodiacSign.TIGER]: 'purpose',
      [ChineseZodiacSign.RABBIT]: 'mind',
      [ChineseZodiacSign.DRAGON]: 'purpose',
      [ChineseZodiacSign.SNAKE]: 'mind',
      [ChineseZodiacSign.HORSE]: 'body',
      [ChineseZodiacSign.GOAT]: 'purpose',
      [ChineseZodiacSign.MONKEY]: 'mind',
      [ChineseZodiacSign.ROOSTER]: 'body',
      [ChineseZodiacSign.DOG]: 'purpose',
      [ChineseZodiacSign.PIG]: 'body'
    };
    
    // Mapeamento de elementos para dimensões
    const elementDimensions: Record<ChineseElement, 'purpose' | 'body' | 'mind'> = {
      [ChineseElement.WOOD]: 'purpose',
      [ChineseElement.FIRE]: 'purpose',
      [ChineseElement.EARTH]: 'body',
      [ChineseElement.METAL]: 'mind',
      [ChineseElement.WATER]: 'mind'
    };
    
    // Verificar se é signo ou elemento
    if (Object.values(ChineseZodiacSign).includes(signOrElement as ChineseZodiacSign)) {
      return signDimensions[signOrElement as ChineseZodiacSign];
    } else {
      return elementDimensions[signOrElement as ChineseElement];
    }
  }

  /**
   * Obtém insights de uma análise específica
   */
  getInsights(analysisId: string): TraditionInsight[] {
    return this.insights.get(analysisId) || [];
  }

  /**
   * Integra com plano de voo NeoSapiens
   */
  integrateWithFlightPlan(flightPlan: FlightPlan, analysisId: string): EnhancedFlightPlan {
    const profile = this.profiles.get(analysisId);
    const insights = this.insights.get(analysisId);
    
    if (!profile || !insights) {
      console.warn(`Dados insuficientes para integrar análise ${analysisId} com plano de voo`);
      return {
        ...flightPlan,
        traditionIntegrations: flightPlan.traditionIntegrations || []
      };
    }
    
    // Criar integração específica da astrologia chinesa
    const chineseIntegration = {
      traditionId: this.id,
      traditionName: this.name,
      summary: `Baseado no seu perfil de ${profile.yearSign.sign} de ${profile.yearSign.element}`,
      insights: insights.map(insight => ({
        dimension: insight.dimension,
        recommendation: insight.description,
        priority: (insight.relevanceScore > 80 ? 'high' : insight.relevanceScore > 60 ? 'medium' : 'low') as 'high' | 'medium' | 'low'
      })),
      specificGuidance: {
        purpose: this.getSpecificGuidance(profile, 'purpose'),
        body: this.getSpecificGuidance(profile, 'body'),
        mind: this.getSpecificGuidance(profile, 'mind')
      }
    };
    
    return {
      ...flightPlan,
      traditionIntegrations: [
        ...(flightPlan.traditionIntegrations || []),
        chineseIntegration
      ]
    };
  }

  /**
   * Gera orientação específica para uma dimensão
   */
  private getSpecificGuidance(
    profile: ChineseAstrologyProfile,
    dimension: 'purpose' | 'body' | 'mind'
  ): string[] {
    const { yearSign, dominantElement, polarity } = profile;
    
    // Orientações básicas por dimensão
    const baseGuidance = {
      purpose: [
        `Explore como as qualidades de ${yearSign.sign} podem servir a um propósito maior`,
        `Desenvolva projetos que honrem a energia de ${dominantElement}`,
        `Cultive propósitos que se alinhem com sua natureza ${polarity}`
      ],
      body: [
        `Pratique atividades físicas que complementem a energia de ${yearSign.sign}`,
        `Mantenha rotinas que nutram o elemento ${dominantElement}`,
        `Honre os ritmos ${polarity} do seu corpo`
      ],
      mind: [
        `Cultive práticas mentais alinhadas com ${yearSign.sign}`,
        `Desenvolva pensamentos que reflitam a sabedoria de ${dominantElement}`,
        `Equilibre processos ${polarity} de raciocínio`
      ]
    };
    
    return baseGuidance[dimension];
  }

  /**
   * Obtém análise específica
   */
  getAnalysis(analysisId: string): TraditionAnalysis | undefined {
    return this.analyses.get(analysisId);
  }

  /**
   * Lista todas as análises de um usuário
   */
  getUserAnalyses(userId: string): TraditionAnalysis[] {
    return Array.from(this.analyses.values())
      .filter(analysis => analysis.userId === userId);
  }

  /**
   * Remove uma análise específica
   */
  removeAnalysis(analysisId: string): boolean {
    const removed = this.analyses.delete(analysisId);
    if (removed) {
      this.profiles.delete(analysisId);
      this.insights.delete(analysisId);
    }
    return removed;
  }
}