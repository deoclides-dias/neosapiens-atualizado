// src/modules/traditions/index.ts

// Exportar tipos principais
export * from './types/traditionTypes';

// Exportar o registro de tradições
export { traditionRegistry, TraditionRegistry } from './registry/traditionRegistry';

// Exportar módulos de tradições
export { default as WesternAstrologyModule } from './western-astrology/WesternAstrologyModule';
export { default as NumerologyModule } from './numerology/NumerologyModule';
export { default as ChineseAstrologyModule } from './chinese-astrology/ChineseAstrologyModule';

// Utilitário para registrar todas as tradições disponíveis
import { traditionRegistry } from './registry/traditionRegistry';
import WesternAstrologyModule from './western-astrology/WesternAstrologyModule';
import NumerologyModule from './numerology/NumerologyModule';
import ChineseAstrologyModule from './chinese-astrology/ChineseAstrologyModule';
import { FlightPlan, EnhancedFlightPlan } from './types/traditionTypes';

/**
 * Registra todas as tradições disponíveis no sistema
 * Deve ser chamado durante a inicialização da aplicação
 */
export function registerAllTraditions() {
  // Registrar Astrologia Ocidental
  const westernAstrology = new WesternAstrologyModule();
  traditionRegistry.registerModule(westernAstrology);
  
  // Registrar Numerologia
  const numerology = new NumerologyModule();
  traditionRegistry.registerModule(numerology);
  
  // Registrar Astrologia Chinesa
  const chineseAstrology = new ChineseAstrologyModule();
  traditionRegistry.registerModule(chineseAstrology);
  
  // Futuras tradições serão registradas aqui
  // ex: const kabbalah = new KabbalahModule();
  // ex: traditionRegistry.registerModule(kabbalah);
  
  console.log('Todas as tradições foram registradas com sucesso');
  
  return traditionRegistry;
}

/**
 * Inicializa todos os módulos de tradição registrados
 * Deve ser chamado após registerAllTraditions
 */
export async function initializeAllTraditions(config?: any) {
  await traditionRegistry.initializeAllModules(config);
  console.log('Todos os módulos de tradição foram inicializados');
}

/**
 * Verifica as tradições disponíveis para um usuário
 */
export function getAvailableTraditionsForUser(userId: string) {
  return traditionRegistry.listModulesForUser(userId);
}

/**
 * Obtém análises existentes para um usuário
 */
export function getUserAnalyses(userId: string) {
  return traditionRegistry.listAnalysesForUser(userId);
}

/**
 * Cria um exemplo de uso integrado de múltiplas tradições
 */
export function createIntegratedExample(userId: string) {
  // Dados do usuário
  const userData = {
    id: userId,
    name: 'Exemplo Integrado',
    birthDate: '1990-06-15',
    birthTime: '08:30',
    birthPlace: {
      name: 'Rio de Janeiro, Brasil',
      latitude: -22.9068,
      longitude: -43.1729
    }
  };
  
  console.log(`Criando exemplo integrado para usuário ${userId}`);
  
  // Obter as tradições disponíveis
  const traditions = traditionRegistry.listModulesForUser(userId);
  console.log(`Tradições disponíveis: ${traditions.map(t => t.name).join(', ')}`);
  
  // Realizar análises em todas as tradições
  const analyses = traditions.map(tradition => tradition.analyze(userData));
  console.log(`Análises realizadas: ${analyses.length}`);
  
  // Obter insights de cada análise
  const allInsights = analyses.flatMap(analysis => {
    const tradition = traditions.find(t => t.id === analysis.traditionId);
    if (!tradition || analysis.status === 'failed') return [];
    return tradition.getInsights(analysis.id);
  });
  
  console.log(`Total de insights gerados: ${allInsights.length}`);
  
  // Criar plano de voo base com tipo correto
  const basePlan: FlightPlan = {
    userId,
    createdAt: new Date(),
    days: Array.from({ length: 7 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      let focus: 'purpose' | 'body' | 'mind' | 'integration';
      if (i % 4 === 0) focus = 'purpose';
      else if (i % 4 === 1) focus = 'body';
      else if (i % 4 === 2) focus = 'mind';
      else focus = 'integration';
      
      return {
        date,
        focus,
        practices: []
      };
    })
  };
  
  // Enriquecer o plano com cada tradição, sequencialmente
  let enhancedPlan: EnhancedFlightPlan = basePlan as EnhancedFlightPlan;
  
  for (let i = 0; i < analyses.length; i++) {
    const analysis = analyses[i];
    const tradition = traditions.find(t => t.id === analysis.traditionId);
    
    if (tradition && analysis.status === 'completed') {
      enhancedPlan = tradition.integrateWithFlightPlan(enhancedPlan, analysis.id);
      console.log(`Plano enriquecido com ${tradition.name}`);
    }
  }
  
  console.log(`Plano final com ${enhancedPlan.days.reduce((total, day) => total + day.practices.length, 0)} práticas`);
  
  return {
    analyses,
    insights: allInsights,
    enhancedPlan
  };
}