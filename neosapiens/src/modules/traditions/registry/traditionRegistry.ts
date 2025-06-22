// src/modules/traditions/registry/traditionRegistry.ts

import { TraditionModule, TraditionAnalysis } from '../types/traditionTypes';

/**
 * Registro central de módulos de tradições
 * 
 * Responsável por gerenciar todos os módulos de tradições disponíveis
 * e suas análises associadas.
 */
export class TraditionRegistry {
  private modules: Map<string, TraditionModule> = new Map();
  private analyses: Map<string, TraditionAnalysis> = new Map();
  
  /**
   * Registra um novo módulo de tradição
   */
  registerModule(module: TraditionModule): void {
    if (this.modules.has(module.id)) {
      throw new Error(`Módulo de tradição com ID ${module.id} já está registrado`);
    }
    
    this.modules.set(module.id, module);
    console.log(`Módulo de tradição '${module.name}' registrado com sucesso.`);
  }
  
  /**
   * Remove um módulo de tradição do registro
   */
  unregisterModule(moduleId: string): boolean {
    return this.modules.delete(moduleId);
  }
  
  /**
   * Obtém um módulo pelo ID
   */
  getModule(moduleId: string): TraditionModule | undefined {
    return this.modules.get(moduleId);
  }
  
  /**
   * Lista todos os módulos de tradição registrados
   */
  listAllModules(): TraditionModule[] {
    return Array.from(this.modules.values());
  }
  
  /**
   * Lista módulos disponíveis para um usuário específico
   */
  listModulesForUser(userId: string): TraditionModule[] {
    return this.listAllModules()
      .filter(module => module.isAvailableForUser(userId));
  }
  
  /**
   * Armazena uma análise no registro
   */
  storeAnalysis(analysis: TraditionAnalysis): void {
    this.analyses.set(analysis.id, analysis);
  }
  
  /**
   * Obtém uma análise pelo ID
   */
  getAnalysis(analysisId: string): TraditionAnalysis | undefined {
    return this.analyses.get(analysisId);
  }
  
  /**
   * Lista análises de um usuário específico
   */
  listAnalysesForUser(userId: string): TraditionAnalysis[] {
    return Array.from(this.analyses.values())
      .filter(analysis => analysis.userId === userId);
  }
  
  /**
   * Lista análises de uma tradição específica
   */
  listAnalysesForTradition(traditionId: string): TraditionAnalysis[] {
    return Array.from(this.analyses.values())
      .filter(analysis => analysis.traditionId === traditionId);
  }
  
  /**
   * Inicializa todos os módulos registrados
   */
  async initializeAllModules(config?: any): Promise<void> {
    const initPromises = Array.from(this.modules.values())
      .map(module => module.initialize(config));
      
    await Promise.all(initPromises);
    console.log(`${this.modules.size} módulos de tradição inicializados.`);
  }
  
  /**
   * Desliga todos os módulos registrados
   */
  async shutdownAllModules(): Promise<void> {
    const shutdownPromises = Array.from(this.modules.values())
      .map(module => module.shutdown());
      
    await Promise.all(shutdownPromises);
    console.log(`${this.modules.size} módulos de tradição desligados.`);
  }
}

// Singleton instance
export const traditionRegistry = new TraditionRegistry();

export default traditionRegistry;