// src/modules/traditions/types/traditionTypes.ts

import { BaseModule } from '../../core/types';

/**
 * Enumeração de tipos de insight de tradições - CORRIGIDA
 */
export enum InsightType {
  STRENGTH = 'strength',                    // Ponto forte ou talento natural
  CHALLENGE = 'challenge',                  // Desafio ou área de crescimento
  OPPORTUNITY = 'opportunity',              // Oportunidade ou potencial inexplorado
  PATTERN = 'pattern',                      // Padrão ou tendência recorrente
  PERSONAL_TRAIT = 'personal_trait',        // Traço de personalidade
  BEHAVIORAL_PATTERN = 'behavioral_pattern', // Padrão comportamental
  DEVELOPMENT_AREA = 'development_area',    // Área de desenvolvimento
  TIMING = 'timing',                        // Questões de timing ou período
  RELATIONSHIP = 'relationship',            // Aspectos relacionais
  DIMENSIONAL_INTEGRATION = 'dimensional_integration' // Integração das dimensões
}

/**
 * Dados do usuário necessários para análise tradicional
 */
export interface UserData {
  id: string;
  name: string;
  birthDate: string;          // YYYY-MM-DD
  birthTime?: string;         // HH:MM (opcional para algumas tradições)
  birthPlace?: {
    name: string;
    latitude: number;
    longitude: number;
  };
  tridimensionalProfile?: {   // Resultados da avaliação tridimensional
    purpose: number;          // 0-100
    body: number;             // 0-100
    mind: number;             // 0-100
  };
  // Outros dados relevantes para análises
  email?: string;
  phone?: string;
  preferences?: any;
}

/**
 * Resultado da análise de uma tradição
 */
export interface TraditionAnalysis {
  id: string;                    // ID único da análise
  userId: string;                // ID do usuário analisado
  traditionId: string;           // ID da tradição usada
  timestamp: Date;               // Data e hora da análise
  rawData: any;                  // Dados brutos da análise
  processedData: any;            // Dados processados da análise
  status: 'pending' | 'completed' | 'failed'; // Estado da análise
  error?: string;                // Mensagem de erro caso status='failed'
}

/**
 * Insight derivado de uma análise tradicional
 */
export interface TraditionInsight {
  id: string;                      // ID único do insight
  analysisId: string;              // ID da análise que gerou este insight
  userId: string;                  // ID do usuário
  type: InsightType;               // Tipo de insight
  title: string;                   // Título descritivo
  description: string;             // Descrição detalhada
  relevanceScore: number;          // Relevância (0-100)
  dimension: 'purpose' | 'body' | 'mind' | 'integration'; // Dimensão afetada
  actionable: boolean;             // Se o insight pode gerar ações
  suggestedActions?: string[];     // Ações sugeridas baseadas no insight
  createdAt?: Date;                // Data de criação
  updatedAt?: Date;                // Data de atualização
}

/**
 * Dados para visualização de uma análise tradicional
 */
export interface VisualizationData {
  type: string;                  // Tipo de visualização (ex: 'astrology-chart')
  data: any;                     // Dados para renderização
  config: any;                   // Configurações de visualização
}

/**
 * Plano de voo básico (para um dia ou período)
 */
export interface FlightPlan {
  userId: string;                      // ID do usuário
  createdAt: Date;                     // Data de criação
  days: FlightPlanDay[];               // Dias do plano
  insights?: any[];                    // Insights gerais
  primaryDimension?: 'purpose' | 'body' | 'mind'; // Dimensão prioritária
  traditionIntegrations?: TraditionIntegration[]; // Integrações com tradições
}

/**
 * Um dia no plano de voo
 */
export interface FlightPlanDay {
  date: Date;                         // Data do dia
  practices: any[];                   // Práticas recomendadas
  focus?: 'purpose' | 'body' | 'mind' | 'integration'; // Foco do dia
  notes?: string;                     // Notas ou instruções específicas
}

/**
 * Integração com tradições no plano de voo
 */
export interface TraditionIntegration {
  traditionId: string;                // ID da tradição
  traditionName: string;              // Nome da tradição
  summary: string;                    // Resumo da influência
  insights: {
    dimension: string;
    recommendation: string;
    priority: 'high' | 'medium' | 'low';
  }[];
  specificGuidance: {
    purpose: string[];
    body: string[];
    mind: string[];
  };
}

/**
 * Plano de voo enriquecido com insights de tradições
 */
export interface EnhancedFlightPlan extends FlightPlan {
  traditionInsights?: TraditionInsight[]; // Insights das tradições
  cosmicInfluences?: any[];              // Influências cósmicas (astrologia)
  numerologicalPatterns?: any[];         // Padrões numerológicos
  energeticConsiderations?: any[];       // Considerações energéticas
}

/**
 * Interface para módulos de tradições ancestrais
 */
export interface TraditionModule extends BaseModule {
  // Realizar análise completa com base nos dados do usuário
  analyze(userData: UserData): TraditionAnalysis;
  
  // Obter insights derivados de uma análise
  getInsights(analysisId: string): TraditionInsight[];
  
  // Gerar dados de visualização para a análise
  generateVisualization(analysisId: string): VisualizationData | null;
  
  // Integrar insights com o plano de voo do usuário
  integrateWithFlightPlan(flightPlan: FlightPlan, analysisId: string): EnhancedFlightPlan;
  
  // Métodos adicionais para gerenciamento
 
}

/**
 * Metadados de módulo tradicional
 */
export interface TraditionModuleMetadata {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  dependencies: string[];
  configOptions: any[];
  supportedInputs: string[];           // Dados de entrada necessários
  outputFormats: string[];             // Formatos de saída suportados
  categories: string[];                // Categorias da tradição
  culturalOrigin: string;              // Origem cultural
  complexity: 'basic' | 'intermediate' | 'advanced'; // Nível de complexidade
  accuracyLevel: number;               // Nível de precisão (0-100)
  requires: {
    birthDate: boolean;
    birthTime: boolean;
    birthPlace: boolean;
    name: boolean;
  };
}

/**
 * Configuração de análise tradicional
 */
export interface TraditionAnalysisConfig {
  includeVisualization: boolean;
  generateInsights: boolean;
  integrationLevel: 'basic' | 'detailed' | 'comprehensive';
  focusDimensions: ('purpose' | 'body' | 'mind')[];
  culturalContext?: string;
  language?: string;
}

/**
 * Resultado de validação de dados de entrada
 */
export interface InputValidationResult {
  isValid: boolean;
  missingFields: string[];
  invalidFields: { field: string; reason: string }[];
  warnings: string[];
  canProceed: boolean;
}

/**
 * Contexto de análise tradicional
 */
export interface TraditionAnalysisContext {
  userId: string;
  traditionId: string;
  timestamp: Date;
  config: TraditionAnalysisConfig;
  userPreferences?: any;
  previousAnalyses?: string[];         // IDs de análises anteriores
  sessionId?: string;                  // ID da sessão atual
}

/**
 * Estatísticas de uma tradição
 */
export interface TraditionStatistics {
  totalAnalyses: number;
  averageAccuracy: number;
  userSatisfaction: number;           // Rating médio (0-5)
  insightsGenerated: number;
  flightPlanIntegrations: number;
  lastUpdated: Date;
  popularityScore: number;            // Score de popularidade (0-100)
}

/**
 * Capacidades de um módulo tradicional
 */
export interface TraditionCapabilities {
  canGenerateVisualization: boolean;
  canIntegrateWithFlightPlan: boolean;
  canProvideTimingAdvice: boolean;
  canAnalyzeCompatibility: boolean;
  canPredictTrends: boolean;
  canSuggestPractices: boolean;
  supportedLanguages: string[];
  maxAnalysesPerUser: number;
  retentionPeriod: number;            // Dias de retenção de análises
}

/**
 * Estado de um módulo tradicional
 */
export interface TraditionModuleState {
  isInitialized: boolean;
  isActive: boolean;
  lastActivity: Date;
  errorCount: number;
  successRate: number;               // Taxa de sucesso (0-100)
  averageProcessingTime: number;     // Tempo médio em ms
  memoryUsage: number;               // Uso de memória em MB
  activeAnalyses: number;            // Análises ativas no momento
}

/**
 * Eventos de um módulo tradicional
 */
export enum TraditionModuleEvent {
  INITIALIZED = 'initialized',
  ANALYSIS_STARTED = 'analysis_started',
  ANALYSIS_COMPLETED = 'analysis_completed',
  ANALYSIS_FAILED = 'analysis_failed',
  INSIGHT_GENERATED = 'insight_generated',
  VISUALIZATION_CREATED = 'visualization_created',
  FLIGHT_PLAN_INTEGRATED = 'flight_plan_integrated',
  ERROR_OCCURRED = 'error_occurred',
  WARNING_ISSUED = 'warning_issued',
  SHUTDOWN = 'shutdown'
}

/**
 * Dados de evento de módulo tradicional
 */
export interface TraditionModuleEventData {
  event: TraditionModuleEvent;
  moduleId: string;
  timestamp: Date;
  userId?: string;
  analysisId?: string;
  data?: any;
  error?: string;
  duration?: number;                 // Duração em ms
}

/**
 * Interface para listener de eventos
 */
export interface TraditionModuleEventListener {
  onEvent(eventData: TraditionModuleEventData): void;
}

/**
 * Configuração de cache para módulos
 */
export interface TraditionCacheConfig {
  enabled: boolean;
  ttl: number;                      // Time to live em segundos
  maxSize: number;                  // Tamanho máximo do cache
  strategy: 'lru' | 'fifo' | 'lfu'; // Estratégia de cache
}

/**
 * Resultado de performance de análise
 */
export interface TraditionPerformanceMetrics {
  analysisId: string;
  startTime: Date;
  endTime: Date;
  duration: number;                 // Duração em ms
  memoryUsed: number;               // Memória usada em bytes
  cpuUsage: number;                 // Uso de CPU em %
  insightsGenerated: number;
  visualizationSize?: number;       // Tamanho da visualização em bytes
  cacheHits: number;
  cacheMisses: number;
}

/**
 * Interface para auditoria de análises
 */
export interface TraditionAnalysisAudit {
  analysisId: string;
  userId: string;
  traditionId: string;
  timestamp: Date;
  inputData: any;                   // Dados de entrada (anonimizados)
  outputSummary: any;               // Resumo da saída
  processingTime: number;
  accuracy?: number;                // Precisão estimada
  userFeedback?: {
    rating: number;                 // 1-5
    comments?: string;
  };
  flags: string[];                  // Flags de auditoria
}

/**
 * Configuração de segurança para tradições
 */
export interface TraditionSecurityConfig {
  encryptData: boolean;
  anonymizeInputs: boolean;
  auditTrail: boolean;
  maxRetentionDays: number;
  accessControl: {
    requireAuth: boolean;
    allowedRoles: string[];
    rateLimit: number;              // Requests por hora
  };
  dataPrivacy: {
    pseudonymizeUserId: boolean;
    hashSensitiveData: boolean;
    allowDataExport: boolean;
    allowDataDeletion: boolean;
  };
}

/**
 * Interface para provider de dados externos
 */
export interface ExternalDataProvider {
  id: string;
  name: string;
  baseUrl: string;
  apiKey?: string;
  rateLimitPerHour: number;
  supportedOperations: string[];
  authenticate(): Promise<boolean>;
  fetchData(query: any): Promise<any>;
  isAvailable(): boolean;
}

/**
 * Configuração de integração externa
 */
export interface ExternalIntegrationConfig {
  providers: ExternalDataProvider[];
  fallbackStrategy: 'fail' | 'offline' | 'cache';
  timeoutMs: number;
  retryAttempts: number;
  cacheDuration: number;            // Cache de dados externos em segundos
}

// Re-exportar tipos do core que são necessários
export type { BaseModule } from '../../core/types';