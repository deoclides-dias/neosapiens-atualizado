// src/services/traditionsAnalysisService.ts
import { BirthData } from '../types/onboarding';

// ✅ CORREÇÃO: Imports como DEFAULT (sem chaves)
import WesternAstrologyModule from '../modules/traditions/western-astrology/WesternAstrologyModule';
import ChineseAstrologyModule from '../modules/traditions/chinese-astrology/ChineseAstrologyModule';
import NumerologyModule from '../modules/traditions/numerology/NumerologyModule';

import { supabase } from '../lib/supabase';

export interface TraditionsAnalysisResult {
  id: string;
  userId: string;
  birthData: BirthData;
  westernAstrology: any;
  chineseAstrology: any;
  numerology: any;
  integratedInsights: any[];
  completedAt: Date;
  status: 'processing' | 'completed' | 'error';
}

export class TraditionsAnalysisService {
  
  /**
   * PIPELINE PRINCIPAL: Dados de Nascimento → Análises Completas
   */
  static async processFullAnalysis(userId: string, birthData: BirthData): Promise<TraditionsAnalysisResult> {
    console.log('🔮 Iniciando análise completa das tradições ancestrais...');
    
    try {
      // 1. Criar registro de análise em andamento
      const analysisId = await this.createAnalysisRecord(userId, birthData);
      
      // 2. Executar análises em paralelo (otimização de performance)
      const [westernResult, chineseResult, numerologyResult] = await Promise.all([
        this.processWesternAstrology(birthData),
        this.processChineseAstrology(birthData), 
        this.processNumerology(birthData)
      ]);
      
      // 3. Gerar insights integrados
      const integratedInsights = await this.generateIntegratedInsights(
        westernResult, 
        chineseResult, 
        numerologyResult
      );
      
      // 4. Salvar resultados completos
      const finalResult: TraditionsAnalysisResult = {
        id: analysisId,
        userId,
        birthData,
        westernAstrology: westernResult,
        chineseAstrology: chineseResult,
        numerology: numerologyResult,
        integratedInsights,
        completedAt: new Date(),
        status: 'completed'
      };
      
      await this.saveAnalysisResults(finalResult);
      
      console.log('✨ Análise completa finalizada com sucesso!');
      return finalResult;
      
    } catch (error) {
      console.error('❌ Erro na análise das tradições:', error);
      throw new Error(`Falha na análise: ${error.message}`);
    }
  }
  
  /**
   * ASTROLOGIA OCIDENTAL - Mapa Astral Completo
   */
  private static async processWesternAstrology(birthData: BirthData) {
    console.log('🌟 Processando Astrologia Ocidental...');
    
    // Converter dados do formulário para formato do módulo
    const userData = {
      id: 'temp-user-id',
      name: birthData.fullName,
      birthDate: birthData.birthDate,
      birthTime: birthData.hasExactTime ? birthData.birthTime : undefined,
      birthPlace: {
        name: birthData.birthPlace,
        latitude: birthData.coordinates?.lat || 0,
        longitude: birthData.coordinates?.lng || 0
      }
    };
    
    try {
      // ✅ INSTANCIAR o módulo corretamente
      const module = new WesternAstrologyModule();
      await module.initialize(); // Inicializar se necessário
      
      const analysis = module.analyze(userData);
      const insights = module.getInsights(analysis.id);
      const visualization = module.generateVisualization(analysis.id);
      
      return {
        analysis,
        insights,
        visualization,
        summary: {
          sunSign: analysis.processedData?.sunSign || 'Não calculado',
          moonSign: analysis.processedData?.moonSign || 'Não calculado',
          ascendant: analysis.processedData?.ascendant || 'Não calculado',
          dominantElement: analysis.processedData?.dominantElement || 'Não calculado',
          keyInsights: insights.slice(0, 3).map(i => i.title)
        }
      };
    } catch (error) {
      console.error('Erro na astrologia ocidental:', error);
      // Retornar resultado padrão em caso de erro
      return {
        analysis: { id: 'error', status: 'failed', error: error.message },
        insights: [],
        visualization: null,
        summary: {
          sunSign: 'Erro no cálculo',
          moonSign: 'Erro no cálculo',
          ascendant: 'Erro no cálculo',
          dominantElement: 'Erro no cálculo',
          keyInsights: ['Erro na análise astrológica']
        }
      };
    }
  }
  
  /**
   * ASTROLOGIA CHINESA - 5 Elementos + Zodíaco
   */
  private static async processChineseAstrology(birthData: BirthData) {
    console.log('🐉 Processando Astrologia Chinesa...');
    
    const userData = {
      id: 'temp-user-id',
      name: birthData.fullName,
      birthDate: birthData.birthDate,
      birthPlace: {
        name: birthData.birthPlace,
        latitude: birthData.coordinates?.lat || 0,
        longitude: birthData.coordinates?.lng || 0
      }
    };
    
    try {
      // ✅ INSTANCIAR o módulo corretamente
      const module = new ChineseAstrologyModule();
      await module.initialize(); // Inicializar se necessário
      
      const analysis = module.analyze(userData);
      const insights = module.getInsights(analysis.id);
      const visualization = module.generateVisualization(analysis.id);
      
      return {
        analysis,
        insights,
        visualization,
        summary: {
          zodiacSign: analysis.processedData?.yearSign?.sign || 'Não calculado',
          element: analysis.processedData?.yearSign?.element || 'Não calculado',
          polarity: analysis.processedData?.polarity || 'Não calculado',
          dominantElement: analysis.processedData?.dominantElement || 'Não calculado',
          keyInsights: insights.slice(0, 3).map(i => i.title)
        }
      };
    } catch (error) {
      console.error('Erro na astrologia chinesa:', error);
      return {
        analysis: { id: 'error', status: 'failed', error: error.message },
        insights: [],
        visualization: null,
        summary: {
          zodiacSign: 'Erro no cálculo',
          element: 'Erro no cálculo',
          polarity: 'Erro no cálculo',
          dominantElement: 'Erro no cálculo',
          keyInsights: ['Erro na análise chinesa']
        }
      };
    }
  }
  
  /**
   * NUMEROLOGIA - Números Pessoais Completos
   */
  private static async processNumerology(birthData: BirthData) {
    console.log('🔢 Processando Numerologia...');
    
    const userData = {
      id: 'temp-user-id',
      name: birthData.fullName,
      birthDate: birthData.birthDate,
      birthPlace: {
        name: birthData.birthPlace,
        latitude: birthData.coordinates?.lat || 0,
        longitude: birthData.coordinates?.lng || 0
      }
    };
    
    try {
      // ✅ INSTANCIAR o módulo corretamente
      const module = new NumerologyModule();
      await module.initialize(); // Inicializar se necessário
      
      const analysis = module.analyze(userData);
      const insights = module.getInsights(analysis.id);
      const visualization = module.generateVisualization(analysis.id);
      
      return {
        analysis,
        insights,
        visualization,
        summary: {
          lifePathNumber: analysis.processedData?.lifePathNumber || 0,
          expressionNumber: analysis.processedData?.expressionNumber || 0,
          soulNumber: analysis.processedData?.soulNumber || 0,
          personalityNumber: analysis.processedData?.personalityNumber || 0,
          keyInsights: insights.slice(0, 3).map(i => i.title)
        }
      };
    } catch (error) {
      console.error('Erro na numerologia:', error);
      return {
        analysis: { id: 'error', status: 'failed', error: error.message },
        insights: [],
        visualization: null,
        summary: {
          lifePathNumber: 0,
          expressionNumber: 0,
          soulNumber: 0,
          personalityNumber: 0,
          keyInsights: ['Erro na análise numerológica']
        }
      };
    }
  }
  
  /**
   * INSIGHTS INTEGRADOS - A Magia Acontece Aqui!
   */
  private static async generateIntegratedInsights(western: any, chinese: any, numerology: any) {
    console.log('⚡ Gerando insights integrados...');
    
    const insights = [];
    
    try {
      // CONSONÂNCIA: Quando tradições apontam na mesma direção
      const consonances = this.detectConsonances(western, chinese, numerology);
      consonances.forEach(consonance => {
        insights.push({
          type: 'consonance',
          title: `✨ Confluência: ${consonance.theme}`,
          description: consonance.description,
          traditions: consonance.supportingTraditions,
          strength: consonance.strength,
          dimension: consonance.primaryDimension
        });
      });
      
      // DIVERGÊNCIAS: Quando tradições revelam tensões interessantes
      const divergences = this.detectDivergences(western, chinese, numerology);
      divergences.forEach(divergence => {
        insights.push({
          type: 'divergence',
          title: `⚖️ Tensão Criativa: ${divergence.theme}`,
          description: divergence.description,
          traditions: divergence.conflictingTraditions,
          opportunity: divergence.integrationOpportunity,
          dimension: divergence.primaryDimension
        });
      });
      
      // SÍNTESE TRIDIMENSIONAL
      const synthesis = this.generateTridimensionalSynthesis(western, chinese, numerology);
      insights.push({
        type: 'synthesis',
        title: '🎯 Síntese Tridimensional',
        description: synthesis.description,
        purpose: synthesis.purpose,
        body: synthesis.body,
        mind: synthesis.mind,
        integration: synthesis.integration
      });
      
      return insights.sort((a, b) => (b.strength || 50) - (a.strength || 50));
      
    } catch (error) {
      console.error('Erro ao gerar insights integrados:', error);
      return [{
        type: 'error',
        title: 'Erro na Integração',
        description: 'Houve um problema ao integrar as análises. Os resultados individuais estão disponíveis.',
        traditions: [],
        strength: 0,
        dimension: 'integration'
      }];
    }
  }
  
  /**
   * DETECTAR CONSONÂNCIAS - Quando tradições concordam
   */
  private static detectConsonances(western: any, chinese: any, numerology: any) {
    const consonances = [];
    
    try {
      // Exemplo: Liderança Natural
      if (this.isLeadershipPattern(western, chinese, numerology)) {
        consonances.push({
          theme: 'Liderança Natural',
          description: 'Todas as três tradições apontam para um perfil de liderança inata. Sua astrologia ocidental enfatiza qualidades de comando, o zodíaco chinês confirma energia de pioneirismo, e a numerologia revela números de liderança.',
          supportingTraditions: ['Astrologia Ocidental', 'Astrologia Chinesa', 'Numerologia'],
          strength: 95,
          primaryDimension: 'purpose'
        });
      }
      
      // Exemplo: Sensibilidade Artística
      if (this.isArtisticPattern(western, chinese, numerology)) {
        consonances.push({
          theme: 'Sensibilidade Artística',
          description: 'Suas três tradições convergem para uma natureza profundamente criativa e sensível. Há um chamado claro para expressão artística e beleza.',
          supportingTraditions: ['Astrologia Ocidental', 'Astrologia Chinesa', 'Numerologia'],
          strength: 88,
          primaryDimension: 'mind'
        });
      }
    } catch (error) {
      console.error('Erro ao detectar consonâncias:', error);
    }
    
    return consonances;
  }
  
  /**
   * DETECTAR DIVERGÊNCIAS - Tensões criativas
   */
  private static detectDivergences(western: any, chinese: any, numerology: any) {
    const divergences = [];
    
    try {
      // Exemplo: Estabilidade vs Mudança
      if (this.isStabilityChangeTension(western, chinese, numerology)) {
        divergences.push({
          theme: 'Estabilidade vs Aventura',
          description: 'Interessante tensão entre sua necessidade de estabilidade (forte presença de Terra na astrologia) e seu impulso para mudança e aventura (números de liberdade na numerologia).',
          conflictingTraditions: ['Astrologia Ocidental', 'Numerologia'],
          integrationOpportunity: 'Sua missão pode ser criar estruturas estáveis que permitam aventura segura.',
          primaryDimension: 'integration'
        });
      }
    } catch (error) {
      console.error('Erro ao detectar divergências:', error);
    }
    
    return divergences;
  }
  
  /**
   * SÍNTESE TRIDIMENSIONAL - O Santo Graal
   */
  private static generateTridimensionalSynthesis(western: any, chinese: any, numerology: any) {
    try {
      return {
        description: 'Sua síntese tridimensional revela um padrão único de desenvolvimento humano.',
        purpose: this.synthesizePurposeDimension(western, chinese, numerology),
        body: this.synthesizeBodyDimension(western, chinese, numerology), 
        mind: this.synthesizeMindDimension(western, chinese, numerology),
        integration: this.synthesizeIntegration(western, chinese, numerology)
      };
    } catch (error) {
      console.error('Erro na síntese tridimensional:', error);
      return {
        description: 'Síntese em processamento. Dados individuais disponíveis.',
        purpose: 'Em análise',
        body: 'Em análise',
        mind: 'Em análise',
        integration: 'Em análise'
      };
    }
  }
  
  // ✅ MÉTODOS AUXILIARES COM SAFE GUARDS
  private static isLeadershipPattern(western: any, chinese: any, numerology: any): boolean {
    try {
      const westernLeadership = ['Áries', 'Leão', 'Capricórnio'].includes(western?.summary?.sunSign);
      const chineseLeadership = ['Dragão', 'Tigre', 'Cavalo'].includes(chinese?.summary?.zodiacSign);
      const numerologyLeadership = [1, 8].includes(numerology?.summary?.lifePathNumber);
      
      return (westernLeadership && chineseLeadership) || 
             (westernLeadership && numerologyLeadership) ||
             (chineseLeadership && numerologyLeadership);
    } catch {
      return false;
    }
  }
  
  private static isArtisticPattern(western: any, chinese: any, numerology: any): boolean {
    try {
      const westernArtistic = ['Peixes', 'Libra', 'Câncer'].includes(western?.summary?.sunSign);
      const chineseArtistic = ['Coelho', 'Cabra'].includes(chinese?.summary?.zodiacSign) || 
                             chinese?.summary?.element === 'Água';
      const numerologyArtistic = [3, 6, 9].includes(numerology?.summary?.lifePathNumber);
      
      return (westernArtistic && chineseArtistic) || 
             (westernArtistic && numerologyArtistic) ||
             (chineseArtistic && numerologyArtistic);
    } catch {
      return false;
    }
  }
  
  private static isStabilityChangeTension(western: any, chinese: any, numerology: any): boolean {
    try {
      const westernStable = western?.summary?.dominantElement === 'Terra';
      const numerologyChange = numerology?.summary?.lifePathNumber === 5;
      
      return westernStable && numerologyChange;
    } catch {
      return false;
    }
  }
  
  // Sínteses por dimensão com safe guards
  private static synthesizePurposeDimension(western: any, chinese: any, numerology: any): string {
    try {
      return `Seu propósito integra as qualidades de ${western?.summary?.sunSign || 'seu signo solar'} (astrologia), ${chinese?.summary?.zodiacSign || 'seu animal chinês'} (energia vital) e caminho ${numerology?.summary?.lifePathNumber || 'X'} (numerologia).`;
    } catch {
      return 'Propósito em análise baseado nas tradições ancestrais.';
    }
  }
  
  private static synthesizeBodyDimension(western: any, chinese: any, numerology: any): string {
    try {
      return `Sua dimensão corporal é influenciada pelo elemento ${western?.summary?.dominantElement || 'dominante'} (astrologia ocidental) e ${chinese?.summary?.element || 'elemento'} (medicina chinesa).`;
    } catch {
      return 'Dimensão corporal em análise baseada nos elementos astrológicos.';
    }
  }
  
  private static synthesizeMindDimension(western: any, chinese: any, numerology: any): string {
    try {
      return `Sua mente processa através da lente ${western?.summary?.moonSign || 'lunar'} (emocional) com padrões do ${chinese?.summary?.zodiacSign || 'zodíaco chinês'} (ancestral).`;
    } catch {
      return 'Padrões mentais em análise baseados nas tradições.';
    }
  }
  
  private static synthesizeIntegration(western: any, chinese: any, numerology: any): string {
    return `Sua integração única combina elementos das três tradições ancestrais em um padrão de desenvolvimento personalizado e evolutivo.`;
  }
  
  /**
   * MÉTODOS DE PERSISTÊNCIA
   */
  private static async createAnalysisRecord(userId: string, birthData: BirthData): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('traditions_analysis')
        .insert({
          user_id: userId,
          birth_data: birthData,
          status: 'processing',
          created_at: new Date().toISOString()
        })
        .select('id')
        .single();
        
      if (error) throw error;
      return data.id;
    } catch (error) {
      console.error('Erro ao criar registro de análise:', error);
      // Retornar ID temporário se falhar
      return `temp-analysis-${Date.now()}`;
    }
  }
  
  private static async saveAnalysisResults(result: TraditionsAnalysisResult): Promise<void> {
    try {
      const { error } = await supabase
        .from('traditions_analysis')
        .update({
          western_astrology: result.westernAstrology,
          chinese_astrology: result.chineseAstrology,
          numerology: result.numerology,
          integrated_insights: result.integratedInsights,
          completed_at: result.completedAt.toISOString(),
          status: result.status
        })
        .eq('id', result.id);
        
      if (error) throw error;
    } catch (error) {
      console.error('Erro ao salvar resultados:', error);
      // Não quebrar o fluxo se falhar o salvamento
    }
  }
  
  /**
   * MÉTODO PÚBLICO: Recuperar análise existente
   */
  static async getAnalysisResults(userId: string): Promise<TraditionsAnalysisResult | null> {
    try {
      const { data, error } = await supabase
        .from('traditions_analysis')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'completed')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (error) {
      console.error('Erro ao recuperar análise:', error);
      return null;
    }
  }
}