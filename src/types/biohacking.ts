// ============================================================================
// src/types/biohacking.ts - VERSÃO REFATORADA E MELHORADA
// ============================================================================
// ✅ Lógica condicional inteligente (boolean → detalhes)
// ✅ MTC com conceitos corretos (sintomas/características, não órgãos)
// ✅ UI com cores contrastantes
// ✅ Perguntas claras e objetivas
// ============================================================================

import { LucideIcon } from 'lucide-react';

// 🎯 INTERFACE PRINCIPAL - Biohacking Data Completo
export interface BiohackingData {
  
  // ============================================================================
  // 💪 STEP 1: ANTROPOMETRIA E COMPOSIÇÃO CORPORAL
  // ============================================================================
  anthropometric: {
    // Medidas básicas
    height: number;                    // cm
    currentWeight: number;             // kg
    desiredWeight: number;             // kg
    
    // Medidas opcionais (se souber)
    waistCircumference?: number;       // cm
    hipCircumference?: number;         // cm
    bodyFatPercentage?: number;        // %
    
    // Biotipo corporal
    bodyType: 'ectomorph' | 'mesomorph' | 'endomorph' | 'mixed' | 'unknown';
    
    // Histórico de peso
    weightHistory: {
      maxWeight: number;               // Peso máximo já atingido
      minAdultWeight: number;          // Peso mínimo na vida adulta
      recentTrend: 'gaining' | 'losing' | 'stable' | 'fluctuating';
      easyToGain: boolean;             // Ganha peso facilmente?
      easyToLose: boolean;             // Perde peso facilmente?
      mainConcerns: string[];          // Preocupações principais
    };
  };

  // ============================================================================
  // 💤 STEP 2: SONO, ENERGIA E RITMO CIRCADIANO
  // ============================================================================
  sleep: {
    // Padrão de sono
    averageHours: number;              // Horas por noite (5-12)
    bedtime: string;                   // "22:00" formato HH:MM
    wakeTime: string;                  // "06:00" formato HH:MM
    
    // Qualidade do sono
    sleepQuality: 1 | 2 | 3 | 4 | 5;   // 1=péssimo, 5=excelente
    
    // Cronotipo (tipo de ritmo)
    chronotype: 'early_bird' | 'night_owl' | 'intermediate';
    
    // Problemas de sono (SE HOUVER)
    hasSleepIssues: boolean;
    sleepIssues?: ('insomnia' | 'snoring' | 'apnea' | 'restless' | 'nightmares' | 'waking_up' | 'early_waking')[];
    
    // Níveis de energia ao longo do dia
    energyLevels: {
      morning: 1 | 2 | 3 | 4 | 5;      // 1=exausto, 5=energizado
      afternoon: 1 | 2 | 3 | 4 | 5;
      evening: 1 | 2 | 3 | 4 | 5;
    };
    
    // Ajudas para dormir (SE USAR)
    usesSleepAids: boolean;
    sleepAids?: {
      supplements?: string[];          // Ex: melatonina, valeriana
      medications?: string[];           // Ex: prescritos
      techniques?: string[];            // Ex: meditação, chá
    };
  };

  // ============================================================================
  // 🍎 STEP 3: NUTRIÇÃO E HÁBITOS ALIMENTARES
  // ============================================================================
  nutrition: {
    // Padrão alimentar principal
    dietaryPattern: 'omnivore' | 'vegetarian' | 'vegan' | 'pescatarian' | 'keto' | 'paleo' | 'mediterranean' | 'other';
    customDiet?: string;               // Se "other"
    
    // Frequência de refeições
    mealsPerDay: 1 | 2 | 3 | 4 | 5 | 6;
    snackingFrequency: 'never' | 'rarely' | 'sometimes' | 'often' | 'very_often';
    
    // Hidratação
    waterIntake: number;               // Copos por dia (1-15)
    
    // Bebidas
    drinksAlcohol: boolean;
    alcoholFrequency?: 'never' | 'rarely' | 'weekly' | 'daily';
    
    drinksCaffeine: boolean;
    caffeineDetails?: {
      frequency: 'daily' | 'weekly' | 'occasionally';
      sources: ('coffee' | 'tea' | 'energy_drinks' | 'soda' | 'chocolate')[];
      timing: ('morning' | 'afternoon' | 'evening')[];
    };
    
    // Restrições e intolerâncias (SE HOUVER)
    hasRestrictions: boolean;
    restrictions?: {
      intolerances?: ('lactose' | 'gluten' | 'nuts' | 'soy' | 'eggs' | 'shellfish' | 'other')[];
      customIntolerances?: string[];
    };
    
    // Suplementação (SE USAR)
    takesSupplements: boolean;
    supplements?: string[];            // Lista de suplementos
    
    // Saúde digestiva
    digestiveHealth: 1 | 2 | 3 | 4 | 5; // 1=muito ruim, 5=excelente
    
    // Padrões emocionais de alimentação
    eatingPatterns: {
      emotionalEating: boolean;        // Come quando está triste/ansioso?
      stressEating: boolean;           // Come mais quando estressado?
      socialEating: boolean;           // Come mais em situações sociais?
      lateNightEating: boolean;        // Come tarde da noite?
      binge_eating: boolean;           // Episódios de compulsão alimentar?
    };
  };

  // ============================================================================
  // 🏃‍♂️ STEP 4: ATIVIDADE FÍSICA E MOVIMENTO
  // ============================================================================
  physicalActivity: {
    // Frequência
    isActive: boolean;                 // Pratica exercícios regularmente?
    
    weeklyFrequency?: number;          // Dias por semana (SE ATIVO)
    averageSessionDuration?: number;   // Minutos por sessão (SE ATIVO)
    
    // Intensidade preferida (SE ATIVO)
    preferredIntensity?: 'light' | 'moderate' | 'intense' | 'varied';
    
    // Tipos de atividade (SE ATIVO)
    activityTypes?: ('cardio' | 'strength' | 'flexibility' | 'sports' | 'yoga' | 'pilates' | 'martial_arts' | 'dance' | 'walking' | 'swimming' | 'cycling' | 'running' | 'other')[];
    
    // Nível de condicionamento
    currentFitnessLevel: 1 | 2 | 3 | 4 | 5; // 1=sedentário, 5=atleta
    
    // Capacidade funcional no dia a dia
    functionalCapacity: 1 | 2 | 3 | 4 | 5; // 1=limitado, 5=pleno
    
    // Limitações físicas (SE HOUVER)
    hasLimitations: boolean;
    limitations?: ('joint_pain' | 'back_pain' | 'injury_recovery' | 'chronic_condition' | 'balance_issues' | 'other')[];
    customLimitations?: string[];
    
    // Objetivos fitness
    fitnessGoals: ('lose_weight' | 'gain_muscle' | 'improve_endurance' | 'flexibility' | 'general_health' | 'sport_performance' | 'rehabilitation' | 'stress_relief')[];
    
    // Recuperação
    recovery: {
      quality: 1 | 2 | 3 | 4 | 5;      // 1=ruim, 5=excelente
      usesMethods: boolean;
      methods?: ('stretching' | 'foam_roller' | 'massage' | 'ice_bath' | 'sauna' | 'rest_days' | 'active_recovery')[];
    };
  };

  // ============================================================================
  // 🏥 STEP 5: SAÚDE GERAL E HISTÓRICO MÉDICO
  // ============================================================================
  healthStatus: {
    // Autopercepção de saúde
    overallHealth: 1 | 2 | 3 | 4 | 5;  // 1=muito ruim, 5=excelente
    mentalHealth: 1 | 2 | 3 | 4 | 5;   // 1=muito ruim, 5=excelente
    
    // Nível de estresse atual
    stressLevel: 1 | 2 | 3 | 4 | 5;    // 1=muito baixo, 5=muito alto
    
    // Condições crônicas (SE HOUVER)
    hasChronicConditions: boolean;
    chronicConditions?: ('diabetes' | 'hypertension' | 'heart_disease' | 'asthma' | 'autoimmune' | 'thyroid' | 'digestive' | 'mental_health' | 'other')[];
    customConditions?: string[];
    
    // Medicamentos (SE USAR)
    takesMedications: boolean;
    medications?: string[];
    
    // Suplementos regulares (SE USAR)
    takesRegularSupplements: boolean;
    regularSupplements?: string[];
    
    // Deficiências nutricionais (SE DIAGNOSTICADAS)
    hasDeficiencies: boolean;
    deficiencies?: ('vitamin_d' | 'b12' | 'iron' | 'magnesium' | 'calcium' | 'other')[];
    
    // Alergias (SE HOUVER)
    hasAllergies: boolean;
    allergies?: string[];
    
    // Mudanças recentes na saúde (SE HOUVER)
    recentHealthChanges: boolean;
    healthChanges?: string[];
    
    // Histórico médico significativo
    medicalHistory: {
      hasSurgeries: boolean;
      surgeries?: string[];
      
      hasHospitalizations: boolean;
      hospitalizations?: string[];
      
      hasSignificantIllnesses: boolean;
      illnesses?: string[];
      
      hasFamilyHistory: boolean;
      familyHistory?: ('diabetes' | 'heart_disease' | 'cancer' | 'hypertension' | 'alzheimers' | 'depression' | 'autoimmune' | 'other')[];
    };
  };

  // ============================================================================
  // 🧬 STEP 6: MEDICINA TRADICIONAL CHINESA (MTC) - 5 ELEMENTOS
  // ============================================================================
  // NOTA: Perguntas baseadas em SINTOMAS e CARACTERÍSTICAS observáveis
  // Não requer conhecimento de MTC para responder
  // ============================================================================
  
  functionalMedicine: {
    fiveElements: {
      
      // 🌳 ELEMENTO MADEIRA (Primavera, Crescimento, Planejamento)
      wood: {
        // Flexibilidade e adaptação
        flexibility: 1 | 2 | 3 | 4 | 5;           // Rigidez muscular? (1=muito rígido, 5=muito flexível)
        adaptability: 1 | 2 | 3 | 4 | 5;          // Se adapta a mudanças? (1=difícil, 5=fácil)
        
        // Visão e planejamento
        visionClarity: 1 | 2 | 3 | 4 | 5;         // Visão clara de objetivos? (1=confuso, 5=claro)
        planningAbility: 1 | 2 | 3 | 4 | 5;       // Consegue planejar? (1=difícil, 5=fácil)
        decisionMaking: 1 | 2 | 3 | 4 | 5;        // Toma decisões facilmente? (1=difícil, 5=fácil)
        
        // Criatividade e iniciativa
        creativity: 1 | 2 | 3 | 4 | 5;            // Se sente criativo? (1=bloqueado, 5=fluindo)
        initiative: 1 | 2 | 3 | 4 | 5;            // Toma iniciativa? (1=raramente, 5=sempre)
        
        // Gerenciamento emocional (Raiva/Frustração)
        angerControl: 1 | 2 | 3 | 4 | 5;          // Controla raiva/frustração? (1=explode, 5=controla bem)
        frustrationTolerance: 1 | 2 | 3 | 4 | 5;  // Tolera frustrações? (1=baixa, 5=alta)
        
        // Sintomas físicos
        eyeStrain: boolean;                        // Cansaço visual frequente?
        muscleStiffness: boolean;                  // Rigidez muscular frequente?
        headaches: boolean;                        // Dores de cabeça frequentes?
      };
      
      // 🔥 ELEMENTO FOGO (Verão, Alegria, Conexão)
      fire: {
        // Conexão e comunicação
        socialConnection: 1 | 2 | 3 | 4 | 5;      // Se conecta facilmente? (1=isolado, 5=conectado)
        communicationSkills: 1 | 2 | 3 | 4 | 5;   // Expressa pensamentos? (1=difícil, 5=fácil)
        emotionalExpression: 1 | 2 | 3 | 4 | 5;   // Expressa emoções? (1=reprime, 5=expressa)
        
        // Alegria e entusiasmo
        joyfulness: 1 | 2 | 3 | 4 | 5;            // Se sente alegre? (1=apático, 5=alegre)
        enthusiasm: 1 | 2 | 3 | 4 | 5;            // Entusiasmo pela vida? (1=baixo, 5=alto)
        
        // Energia vital
        vitalEnergy: 1 | 2 | 3 | 4 | 5;           // Energia vital? (1=exausto, 5=vibrante)
        
        // Sintomas físicos
        palpitations: boolean;                     // Palpitações cardíacas?
        chestTightness: boolean;                   // Aperto no peito/ansiedade?
        sleepDisturbances: boolean;                // Dificuldade para dormir?
        excessiveSweating: boolean;                // Suor excessivo?
        coldHandsFeet: boolean;                    // Mãos/pés frios frequentemente?
      };
      
      // 🏔️ ELEMENTO TERRA (Fim do Verão, Nutrição, Centralização)
      earth: {
        // Digestão e nutrição
        digestiveStrength: 1 | 2 | 3 | 4 | 5;     // Digestão forte? (1=fraca, 5=forte)
        appetite: 1 | 2 | 3 | 4 | 5;              // Apetite regular? (1=irregular, 5=regular)
        
        // Pensamento e concentração
        overthinking: 1 | 2 | 3 | 4 | 5;          // Pensa demais? (1=sempre, 5=nunca)
        worryTendency: 1 | 2 | 3 | 4 | 5;         // Preocupação excessiva? (1=muito, 5=pouco)
        concentration: 1 | 2 | 3 | 4 | 5;         // Consegue se concentrar? (1=difícil, 5=fácil)
        
        // Estabilidade e apoio
        groundedness: 1 | 2 | 3 | 4 | 5;          // Sente-se centrado? (1=disperso, 5=centrado)
        empathy: 1 | 2 | 3 | 4 | 5;               // Empatia com outros? (1=baixa, 5=alta)
        nurturing: 1 | 2 | 3 | 4 | 5;             // Cuida dos outros? (1=pouco, 5=muito)
        
        // Sintomas físicos
        bloating: boolean;                         // Inchaço após comer?
        sweetCravings: boolean;                    // Desejo por doces?
        fatigue: boolean;                          // Fadiga/cansaço constante?
        weakMuscles: boolean;                      // Músculos fracos?
      };
      
      // ⚙️ ELEMENTO METAL (Outono, Refinamento, Estrutura)
      metal: {
        // Respiração e energia
        breathingQuality: 1 | 2 | 3 | 4 | 5;      // Respira bem? (1=ofegante, 5=profundo)
        energyConsistency: 1 | 2 | 3 | 4 | 5;     // Energia consistente? (1=variável, 5=estável)
        
        // Pele e barreira
        skinHealth: 1 | 2 | 3 | 4 | 5;            // Pele saudável? (1=problemas, 5=saudável)
        immuneStrength: 1 | 2 | 3 | 4 | 5;        // Sistema imune forte? (1=fraco, 5=forte)
        
        // Organização e perfeccionismo
        organizationSkills: 1 | 2 | 3 | 4 | 5;    // Organizado? (1=caótico, 5=organizado)
        perfectionism: 1 | 2 | 3 | 4 | 5;         // Perfeccionista? (1=muito, 5=equilibrado)
        detailOriented: 1 | 2 | 3 | 4 | 5;        // Atento a detalhes? (1=pouco, 5=muito)
        
        // Limites e desapego
        boundariesSetting: 1 | 2 | 3 | 4 | 5;     // Estabelece limites? (1=difícil, 5=fácil)
        lettingGo: 1 | 2 | 3 | 4 | 5;             // Consegue deixar ir? (1=se apega, 5=desapega)
        
        // Processamento emocional (Tristeza)
        griefProcessing: 1 | 2 | 3 | 4 | 5;       // Processa luto/perdas? (1=preso, 5=processa)
        
        // Sintomas físicos
        frequentColds: boolean;                    // Resfriados frequentes?
        skinIssues: boolean;                       // Problemas de pele (acne, eczema)?
        respiratoryIssues: boolean;                // Problemas respiratórios?
        constipation: boolean;                     // Constipação intestinal?
      };
      
      // 💧 ELEMENTO ÁGUA (Inverno, Repouso, Vitalidade Profunda)
      water: {
        // Vitalidade e reservas
        vitalReserves: 1 | 2 | 3 | 4 | 5;         // Reservas de energia? (1=esgotadas, 5=abundantes)
        willpower: 1 | 2 | 3 | 4 | 5;             // Força de vontade? (1=fraca, 5=forte)
        motivation: 1 | 2 | 3 | 4 | 5;            // Motivação? (1=apático, 5=motivado)
        
        // Resiliência e adaptação
        resilience: 1 | 2 | 3 | 4 | 5;            // Resiliente? (1=frágil, 5=resiliente)
        stressTolerance: 1 | 2 | 3 | 4 | 5;       // Tolera estresse? (1=baixa, 5=alta)
        
        // Memória e sabedoria
        memoryRetention: 1 | 2 | 3 | 4 | 5;       // Boa memória? (1=esquece, 5=lembra bem)
        learningAbility: 1 | 2 | 3 | 4 | 5;       // Aprende facilmente? (1=difícil, 5=fácil)
        
        // Medo e coragem
        fearManagement: 1 | 2 | 3 | 4 | 5;        // Gerencia medos? (1=paralisado, 5=corajoso)
        anxietyLevel: 1 | 2 | 3 | 4 | 5;          // Nível de ansiedade? (1=alto, 5=baixo)
        
        // Vitalidade sexual e reprodutiva
        sexualVitality: 1 | 2 | 3 | 4 | 5;        // Vitalidade sexual? (1=baixa, 5=alta)
        
        // Sintomas físicos
        lowerBackPain: boolean;                    // Dor lombar frequente?
        coldSensitivity: boolean;                  // Sensível ao frio?
        urinaryIssues: boolean;                    // Problemas urinários?
        earProblems: boolean;                      // Zumbido/problemas de audição?
        hairLoss: boolean;                         // Queda de cabelo excessiva?
      };
    };
  };

  // ============================================================================
  // 🧠 AVALIAÇÃO COGNITIVA
  // ============================================================================
  cognitive: {
    // Funções cognitivas básicas
    focusQuality: 1 | 2 | 3 | 4 | 5;             // 1=disperso, 5=focado
    memoryQuality: 1 | 2 | 3 | 4 | 5;            // 1=ruim, 5=excelente
    mentalClarity: 1 | 2 | 3 | 4 | 5;            // 1=nebuloso, 5=cristalino
    
    // Criatividade e aprendizado
    creativityLevel: 1 | 2 | 3 | 4 | 5;          // 1=bloqueado, 5=fluindo
    learningSpeed: 1 | 2 | 3 | 4 | 5;            // 1=lento, 5=rápido
    
    // Sintomas cognitivos (SE HOUVER)
    hasCognitiveSymptoms: boolean;
    cognitiveSymptoms?: {
      brainFog: boolean;                          // Névoa mental
      concentrationDifficulty: boolean;           // Dificuldade de concentração
      memoryLapses: boolean;                      // Esquecimentos
      mentalFatigue: boolean;                     // Fadiga mental
      decisionFatigue: boolean;                   // Cansaço para decidir
      wordFinding: boolean;                       // Dificuldade de encontrar palavras
      multitaskingDifficulty: boolean;            // Dificuldade para multitarefa
    };
    
    // Estilo de aprendizagem preferido
    preferredLearningStyle: 'visual' | 'auditory' | 'reading' | 'kinesthetic' | 'mixed';
    
    // Tempo de atenção sustentada
    attentionSpan: number;                        // Minutos (5-120)
    
    // Resposta ao estresse
    stressResponse: {
      mainTriggers: ('work' | 'relationships' | 'finances' | 'health' | 'family' | 'time_pressure' | 'uncertainty' | 'conflict' | 'other')[];
      
      copingMechanisms: ('exercise' | 'meditation' | 'social_support' | 'hobbies' | 'nature' | 'therapy' | 'breathing' | 'avoidance' | 'substances' | 'other')[];
      
      recoveryQuality: 1 | 2 | 3 | 4 | 5;        // 1=não recupera, 5=recupera bem
    };
  };
}

// ============================================================================
// 🎯 STEPS DO FORMULÁRIO
// ============================================================================

export interface BiohackingStep {
  id: number;
  title: string;
  icon: LucideIcon;
  description: string;
  fields: string[];
  estimatedTime: number;                          // minutos
  color: string;                                  // ✅ COR VISÍVEL (não branco!)
}

// ============================================================================
// 📝 PROPS DO COMPONENTE
// ============================================================================

export interface BiohackingFormProps {
  onComplete: (data: BiohackingData) => Promise<void>;
  onBack?: () => void;
  initialData?: Partial<BiohackingData>;
  onStepChange?: (step: number) => void;
  onDataUpdate?: (data: Partial<BiohackingData>) => void;
}

// ============================================================================
// 🔍 TIPOS DE VALIDAÇÃO
// ============================================================================

export interface BiohackingValidation {
  isValid: boolean;
  errors: Record<string, string>;
  warnings: Record<string, string>;
  completionPercentage: number;
}

// ============================================================================
// 📈 PROGRESSO DO FORMULÁRIO
// ============================================================================

export interface BiohackingProgress {
  currentStep: number;
  completedSteps: number[];
  totalSteps: number;
  estimatedTimeRemaining: number;
  canProceed: boolean;
  canGoBack: boolean;
}

// ============================================================================
// 📊 RESULTADO DA ANÁLISE BIOHACKING
// ============================================================================

export interface BiohackingAnalysis {
  userId: string;
  
  // Scores calculados
  scores: {
    overallHealth: number;
    biotype: string;
    chronotype: string;
    metabolicProfile: string;
    stressLevel: number;
    fitnessLevel: number;
    dominantElement: string;                      // Elemento MTC dominante
    deficientElement: string;                     // Elemento MTC deficiente
  };
  
  // Recomendações personalizadas
  recommendations: {
    nutrition: {
      macroTargets: {
        protein: number;                          // % ou gramas
        carbs: number;
        fat: number;
      };
      supplements: string[];
      mealTiming: string[];
      foods: {
        include: string[];                        // Alimentos a incluir
        avoid: string[];                          // Alimentos a evitar
        moderate: string[];                       // Alimentos com moderação
      };
    };
    
    exercise: {
      weeklyPlan: {
        cardio: number;                           // Sessões por semana
        strength: number;
        flexibility: number;
        recovery: number;
      };
      specificActivities: string[];
      intensity: 'light' | 'moderate' | 'intense' | 'varied';
      timing: string[];                           // Melhor horário
    };
    
    sleep: {
      optimalSchedule: {
        bedtime: string;
        wakeTime: string;
        duration: number;                         // Horas
      };
      sleepHygiene: string[];
      environment: string[];
      supplements: string[];
    };
    
    stress: {
      techniques: string[];                       // Técnicas de manejo
      lifestyle: string[];                        // Mudanças de estilo de vida
      professional: string[];                     // Quando buscar ajuda profissional
    };
    
    // Recomendações baseadas em MTC
    traditionalMedicine: {
      dominantElement: {
        name: string;                             // Nome do elemento
        characteristics: string[];                // Características
        balancingTips: string[];                  // Dicas para equilibrar
      };
      
      deficientElement: {
        name: string;
        characteristics: string[];
        strengtheningTips: string[];              // Dicas para fortalecer
      };
      
      seasonalGuidance: string[];                 // Orientações sazonais
      acupressurePoints: string[];                // Pontos de acupressão úteis
    };
  };
  
  // Métricas de progresso
  tracking: {
    keyMetrics: string[];                         // Métricas chave para acompanhar
    frequency: string;                            // Frequência de medição
    targets: Record<string, number>;              // Alvos numéricos
    timeline: string;                             // Prazo para reavaliação
  };
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// 🎨 CONFIGURAÇÃO DE CORES PARA UI (NÃO MAIS BRANCO!)
// ============================================================================

export const STEP_COLORS = {
  anthropometric: 'purple-600',     // Roxo vibrante
  sleep: 'indigo-600',             // Índigo
  nutrition: 'green-600',          // Verde
  activity: 'orange-600',          // Laranja
  health: 'red-600',               // Vermelho
  mtc: 'cyan-600',                 // Ciano/Turquesa
  cognitive: 'pink-600'            // Rosa
};
