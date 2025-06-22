// src/modules/core/types.ts

/**
 * Enumeração de tipos de módulos do sistema
 */
export enum ModuleType {
  CORE = 'core',
  TRADITION = 'tradition',
  PURPOSE = 'purpose',
  BODY = 'body',
  MIND = 'mind',
  INTEGRATION = 'integration',
  BIOHACKING = 'biohacking',
  COGNITIVE = 'cognitive'
}

/**
 * Interface base para todos os módulos do sistema
 */
export interface BaseModule {
  id: string;
  name: string;
  description: string;
  version: string;
  type: ModuleType;
  
  // Métodos comuns a todos os módulos
  initialize(config?: any): Promise<void>;
  shutdown(): Promise<void>;
  isAvailableForUser(userId: string): boolean;
  getMetadata(): ModuleMetadata;
}

/**
 * Metadados básicos de um módulo
 */
export interface ModuleMetadata {
  id: string;
  name: string;
  description: string;
  version: string;
  author: string;
  dependencies: string[];
  configOptions: ConfigOption[];
}

/**
 * Opção de configuração de módulo
 */
export interface ConfigOption {
  key: string;
  name: string;
  description: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  required: boolean;
  defaultValue?: any;
  validValues?: any[];
  validation?: ValidationRule;
}

/**
 * Regra de validação
 */
export interface ValidationRule {
  min?: number;
  max?: number;
  pattern?: string;
  customValidator?: (value: any) => boolean;
  errorMessage?: string;
}

/**
 * Estado base de um módulo
 */
export interface ModuleState {
  isInitialized: boolean;
  isActive: boolean;
  lastActivity: Date;
  errorCount: number;
  warningCount: number;
}

/**
 * Eventos base do sistema de módulos
 */
export enum ModuleEvent {
  INITIALIZED = 'initialized',
  ACTIVATED = 'activated',
  DEACTIVATED = 'deactivated',
  ERROR = 'error',
  WARNING = 'warning',
  SHUTDOWN = 'shutdown'
}

/**
 * Dados de evento de módulo
 */
export interface ModuleEventData {
  event: ModuleEvent;
  moduleId: string;
  timestamp: Date;
  data?: any;
  error?: string;
}

/**
 * Interface para registry de módulos
 */
export interface ModuleRegistry {
  register(module: BaseModule): void;
  unregister(moduleId: string): boolean;
  get(moduleId: string): BaseModule | undefined;
  listByType(type: ModuleType): BaseModule[];
  listAll(): BaseModule[];
  isActive(moduleId: string): boolean;
  initializeAll(config?: any): Promise<void>;
  shutdownAll(): Promise<void>;
}

/**
 * Perfil base do usuário
 */
export interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
  lastActivity: Date;
  preferences: UserPreferences;
  dimensionalProfile?: DimensionalProfile;
}

/**
 * Preferências do usuário
 */
export interface UserPreferences {
  language: string;
  timezone: string;
  notifications: NotificationPreferences;
  privacy: PrivacyPreferences;
  accessibility: AccessibilityPreferences;
  modules: ModulePreferences;
}

/**
 * Preferências de notificação
 */
export interface NotificationPreferences {
  email: boolean;
  push: boolean;
  sms: boolean;
  frequency: 'immediate' | 'daily' | 'weekly' | 'monthly';
  types: string[];
}

/**
 * Preferências de privacidade
 */
export interface PrivacyPreferences {
  dataSharing: boolean;
  analytics: boolean;
  marketing: boolean;
  publicProfile: boolean;
}

/**
 * Preferências de acessibilidade
 */
export interface AccessibilityPreferences {
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
  reducedMotion: boolean;
  colorBlindness?: 'protanopia' | 'deuteranopia' | 'tritanopia';
}

/**
 * Preferências de módulos
 */
export interface ModulePreferences {
  enabled: string[];
  disabled: string[];
  order: string[];
  customConfigs: Record<string, any>;
}

/**
 * Perfil dimensional do usuário
 */
export interface DimensionalProfile {
  purpose: DimensionScore;
  body: DimensionScore;
  mind: DimensionScore;
  integration: DimensionScore;
  lastAssessment: Date;
  history: DimensionHistory[];
}

/**
 * Score de uma dimensão
 */
export interface DimensionScore {
  current: number;           // 0-100
  potential: number;         // 0-100
  growth: number;            // -100 a +100 (mudança recente)
  categories: Record<string, number>;
}

/**
 * Histórico dimensional
 */
export interface DimensionHistory {
  date: Date;
  purpose: number;
  body: number;
  mind: number;
  integration: number;
  notes?: string;
}

/**
 * Contexto de usuário para módulos
 */
export interface UserContext {
  user: UserProfile;
  session: UserSession;
  environment: EnvironmentContext;
  capabilities: UserCapabilities;
}

/**
 * Sessão do usuário
 */
export interface UserSession {
  id: string;
  startTime: Date;
  lastActivity: Date;
  device: DeviceInfo;
  location?: LocationInfo;
  activeModules: string[];
}

/**
 * Informações do dispositivo
 */
export interface DeviceInfo {
  type: 'desktop' | 'mobile' | 'tablet';
  os: string;
  browser: string;
  screenSize: { width: number; height: number };
  touchEnabled: boolean;
}

/**
 * Informações de localização
 */
export interface LocationInfo {
  country: string;
  timezone: string;
  coordinates?: { lat: number; lon: number };
}

/**
 * Contexto do ambiente
 */
export interface EnvironmentContext {
  isDevelopment: boolean;
  isProduction: boolean;
  version: string;
  features: string[];
  limits: ResourceLimits;
}

/**
 * Limites de recursos
 */
export interface ResourceLimits {
  maxModules: number;
  maxAnalyses: number;
  maxStorageMB: number;
  requestsPerHour: number;
}

/**
 * Capacidades do usuário
 */
export interface UserCapabilities {
  canAccessModule: (moduleId: string) => boolean;
  canPerformAction: (action: string) => boolean;
  hasFeature: (feature: string) => boolean;
  getRateLimit: (operation: string) => number;
}

/**
 * Resultado de operação
 */
export interface OperationResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  warnings?: string[];
  metadata?: Record<string, any>;
}

/**
 * Configuração de logging
 */
export interface LoggingConfig {
  level: 'debug' | 'info' | 'warn' | 'error';
  console: boolean;
  file: boolean;
  remote: boolean;
  maxFileSize: number;
  retentionDays: number;
}

/**
 * Métricas de performance
 */
export interface PerformanceMetrics {
  startTime: Date;
  endTime: Date;
  duration: number;
  memoryUsage: number;
  cpuUsage: number;
  operations: number;
  errors: number;
}

/**
 * Cache configuration
 */
export interface CacheConfig {
  enabled: boolean;
  provider: 'memory' | 'redis' | 'file';
  ttl: number;
  maxSize: number;
  prefix: string;
}

/**
 * Database configuration
 */
export interface DatabaseConfig {
  provider: 'supabase' | 'firebase' | 'postgresql' | 'mongodb';
  connectionString: string;
  maxConnections: number;
  timeoutMs: number;
  retryAttempts: number;
}

/**
 * API configuration
 */
export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
  rateLimiting: {
    enabled: boolean;
    requestsPerMinute: number;
  };
  auth: {
    type: 'bearer' | 'apikey' | 'oauth';
    credentials: Record<string, string>;
  };
}

/**
 * Feature flags
 */
export interface FeatureFlags {
  [key: string]: boolean;
}

/**
 * System configuration
 */
export interface SystemConfig {
  app: {
    name: string;
    version: string;
    environment: 'development' | 'staging' | 'production';
  };
  features: FeatureFlags;
  modules: {
    autoload: boolean;
    loadOrder: string[];
    configs: Record<string, any>;
  };
  logging: LoggingConfig;
  cache: CacheConfig;
  database: DatabaseConfig;
  apis: Record<string, ApiConfig>;
  security: {
    encryption: boolean;
    jwtSecret: string;
    sessionTimeout: number;
  };
}