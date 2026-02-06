// ============================================================================
// src/types/onboarding.ts - INTERFACES COMPLETAS E CORRIGIDAS
// ============================================================================

// 👤 DADOS PESSOAIS (SEM birthDate - isso vai pro BirthData!)
export interface PersonalData {
  fullName: string;
  email: string;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
}

// 🌟 DADOS DE NASCIMENTO (com Google Autocomplete)
export interface BirthData {
  fullName: string;
  birthDate: string;          // YYYY-MM-DD
  birthTime: string;          // HH:MM
  hasExactTime: boolean;
  birthPlace: string;         // Com Google Autocomplete
  coordinates: {
    lat: number;
    lng: number;
  } | null;
  timezone: string;
}

// 💪 DADOS DE BIOHACKING (estrutura completa)
export interface BiohackingData {
  anthropometric: {
    height: number;
    currentWeight: number;
    desiredWeight: number;
    waistCircumference?: number;
    hipCircumference?: number;
    bodyFatPercentage?: number;
    bodyType: string;
    weightHistory: {
      maxWeight: number;
      minAdultWeight: number;
      recentWeightChanges: string;
      easyWeightChange: string;
      weightConcerns: string[];
    };
  };
  sleep: {
    averageSleepDuration: number;
    bedtime: string;
    wakeTime: string;
    sleepQuality: number;
    chronotype: string;
    sleepIssues: string[];
    energyLevels: {
      morning: number;
      afternoon: number;
      evening: number;
    };
    sleepAids: {
      naturalSupplements: string[];
      prescriptionMeds: string[];
      other: string[];
    };
  };
  nutrition: {
    dietaryPattern: string;
    mealsPerDay: number;
    snackingFrequency: string;
    waterIntake: number;
    alcoholConsumption: string;
    caffeine: {
      consumption: string;
      sources: string[];
      timing: string[];
    };
    foodIntolerances: string[];
    supplements: string[];
    digestiveHealth: number;
    eatingPatterns: {
      emotionalEating: boolean;
      socialEating: boolean;
      stressEating: boolean;
      lateNightEating: boolean;
    };
  };
  physicalActivity: {
    weeklyFrequency: number;
    averageSessionDuration: number;
    preferredIntensity: string;
    activityTypes: string[];
    currentFitnessLevel: number;
    functionalCapacity: number;
    limitations: string[];
    goals: string[];
    recovery: {
      quality: number;
      methods: string[];
    };
  };
  healthStatus: {
    overallHealth: number;
    mentalHealth: number;
    chronicConditions: string[];
    medications: string[];
    regularSupplements: string[];
    nutritionalDeficiencies: string[];
    allergies: string[];
    recentHealthChanges: string[];
    stressLevel: number;
    medicalHistory: {
      surgeries: string[];
      hospitalizations: string[];
      significantIllnesses: string[];
      familyHistory: string[];
    };
  };
  functionalMedicine: {
    fiveElements: {
      wood: {
        liverHealth: number;
        angerManagement: number;
        flexibility: number;
        visionHealth: number;
        decisionMaking: number;
        planningAbility: number;
        muscleStrength: number;
        creativity: number;
        adaptability: number;
      };
      fire: {
        heartHealth: number;
        circulation: number;
        socialConnection: number;
        emotionalExpression: number;
        joyfulness: number;
        communicationSkills: number;
        enthusiasm: number;
        sleepDisturbances: boolean;
        anxietyTendency: boolean;
      };
      earth: {
        digestiveStrength: number;
        worryTendency: number;
        overthinking: number;
        sweetCravings: boolean;
        bloatingAfterMeals: boolean;
        concentrationIssues: boolean;
        empathy: number;
        groundedness: number;
        nurturingAbility: number;
      };
      metal: {
        respiratoryHealth: number;
        skinHealth: number;
        griefProcessing: number;
        detoxCapacity: number;
        immuneStrength: number;
        breathingQuality: number;
        organizationSkills: number;
        perfectionism: number;
        boundariesSetting: number;
      };
      water: {
        adrenalFatigue: number;
        fearAnxiety: number;
        sexualVitality: number;
        boneHealth: number;
        willpower: number;
        coldTolerance: number;
        urinaryHealth: number;
        memoryRetention: number;
        motivation: number;
        resilience: number;
      };
    };
  };
  cognitive: {
    focusQuality: number;
    memoryQuality: number;
    mentalClarity: number;
    creativityLevel: number;
    learningSpeed: number;
    cognitiveSymptoms: {
      brainFog: boolean;
      concentrationDifficulty: boolean;
      memoryLapses: boolean;
      mentalFatigue: boolean;
      decisionFatigue: boolean;
      wordFinding: boolean;
      multitaskingDifficulty: boolean;
    };
    preferredLearningStyle: string;
    attentionSpan: number;
    stressResponse: {
      stressTriggers: string[];
      copingMechanisms: string[];
      stressRecovery: number;
    };
  };
}

// 🧠 DADOS PSICOLÓGICOS (INTERFACE QUE ESTAVA FALTANDO!)
export interface PsychologicalData {
  bigFive: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
  disc: {
    dominance: number;
    influence: number;
    steadiness: number;
    conscientiousness: number;
  };
  vark: {
    visual: number;
    auditory: number;
    reading: number;
    kinesthetic: number;
  };
  yinyang: {
    yin: number;
    yang: number;
  };
  mtc: {
    wood: number;
    fire: number;
    earth: number;
    metal: number;
    water: number;
  };
  completionDate?: string;
}

// ⚡ DADOS COGNITIVOS
export interface CognitiveData {
  learningStyle?: string;
  focusLevel?: number;
  creativityAreas?: string[];
  mentalChallenges?: string[];
  currentPractices?: string[];
}

// 📊 ESTADO COMPLETO DO ONBOARDING
export interface OnboardingProgress {
  id?: string;
  user_id: string;
  step: number;
  
  // Dados de cada etapa
  personal_data?: PersonalData;
  birth_data?: BirthData;
  biohacking_data?: BiohackingData;
  psychological_data?: PsychologicalData;
  cognitive_data?: CognitiveData;
  
  // Flags de conclusão
  personal_data_complete: boolean;
  birth_data_complete: boolean;
  biohacking_data_complete: boolean;
  psychological_data_complete: boolean;
  cognitive_data_complete: boolean;
  
  // Timestamps
  created_at?: string;
  updated_at?: string;
  started_at?: string;
  completed_at?: string;
}
