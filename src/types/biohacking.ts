// ============================================================================
// src/types/biohacking.ts - COMPATÍVEL COM BiohackingForm.tsx
// ============================================================================

import { LucideIcon } from 'lucide-react';

// ============================================================================
// 🎯 TIPOS AUXILIARES
// ============================================================================

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  purpose: string;
}

export interface Supplement {
  name: string;
  dosage: string;
  frequency: string;
  purpose: string;
}

// ============================================================================
// 🎯 INTERFACE PRINCIPAL - BiohackingData
// ============================================================================

export interface BiohackingData {
  anthropometric: {
    height: number;
    currentWeight: number;
    desiredWeight: number;
    waistCircumference?: number;
    hipCircumference?: number;
    bodyFatPercentage?: number;
    bodyType: 'ectomorph' | 'mesomorph' | 'endomorph' | 'mixed' | 'unknown';
    weightHistory: {
      maxWeight: number;
      minAdultWeight: number;
      recentWeightChanges: string;
      easyWeightChange: string;
      weightConcerns?: string[];
    };
  };

  sleep: {
    bedtime: string;
    fallAsleepTime: number;
    wakeupTime: string;
    effectiveSleepHours: number;
    sleepQuality: number;
    sleepMedication: boolean;
    daytimeSleepiness: number;
    sleepDisorders: {
      snoring: boolean;
      apnea: boolean;
      insomnia: boolean;
      nightmareDisturbances: boolean;
      restlessLegs: boolean;
      bruxism: boolean;
    };
    chronotype: 'morning' | 'evening' | 'intermediate';
    energyPattern: {
      morningEnergy: number;
      afternoonEnergy: number;
      eveningEnergy: number;
    };
  };

  nutrition: {
    mealsPerDay: number;
    mealTimes: string[];
    waterIntake: number;
    alcoholConsumption: {
      frequency: 'never' | 'rarely' | 'weekly' | 'daily';
      quantity: number;
    };
    caffeineConsumption: {
      amount: number;
      lastIntakeTime: string;
      sources: string[];
    };
    dietaryRestrictions: string[];
    foodPreferences: {
      sweetCravings: number;
      saltyFoods: number;
      processedFoods: number;
      organicFoods: number;
    };
    digestiveSymptoms: {
      reflux: boolean;
      bloating: boolean;
      constipation: boolean;
      diarrhea: boolean;
      gasExcessive: boolean;
      stomachPain: boolean;
      foodIntolerances: string[];
      digestiveSpeed: 'fast' | 'normal' | 'slow';
      bloatingAfterMeals: boolean;
    };
  };

  physicalActivity: {
    exerciseFrequency: number;
    preferredActivities: string[];
    sessionDuration: number;
    intensity: 'light' | 'moderate' | 'intense';
    physicalLimitations: string[];
    sportsHistory: string;
    functionalCapacity: {
      stairClimbing: boolean;
      carryWeight: boolean;
      flexibility: boolean;
      balance: boolean;
      pushups: number;
      walkingDistance: number;
    };
    fitnessLevel: number;
    motivationFactors: string[];
  };

  healthStatus: {
    chronicConditions: string[];
    familyHistory: string[];
    currentMedications: Medication[];  // ✅ CORRIGIDO: Array de objetos
    supplements: Supplement[];          // ✅ CORRIGIDO: Array de objetos
    allergies: string[];
    deficiencySymptoms: {
      chronicFatigue: boolean;
      hairLoss: boolean;
      weakNails: boolean;
      skinProblems: boolean;
      slowHealing: boolean;
      frequentInfections: boolean;
      muscleCramps: boolean;
      moodSwings: boolean;
      memoryIssues: boolean;
      coldIntolerance: boolean;
    };
    mentalHealth: {
      stressLevel: number;
      anxietyLevel: number;
      depressionSymptoms: boolean;
      panicAttacks: boolean;
      therapyHistory: boolean;
    };
  };

  functionalMedicine: {
    wood: {
      irritability: number;
      frustrationLevel: number;
      headaches: number;
      eyeStrain: boolean;
      muscleStiffness: boolean;
      decisionMaking: number;
      angerManagement: number;
      planningAbility: number;
    };
    fire: {
      heartPalpitations: boolean;
      chestTightness: boolean;
      sleepIssues: boolean;
      excessiveTalking: boolean;
      socialAnxiety: number;
      emotionalInstability: number;
      joyExpression: number;
      connectionWithOthers: number;
      speechClarity: number;
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
    preferredLearningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
    attentionSpan: number;
    stressResponse: {
      stressTriggers: string[];
      copingMechanisms: string[];
      stressRecovery: number;
    };
  };
}

export interface BiohackingStep {
  id: number;
  title: string;
  icon: LucideIcon;
  description: string;
  fields: string[];
  estimatedTime: number;
}

export interface BiohackingFormProps {
  onComplete: (data: BiohackingData) => Promise<void>;
  onBack?: () => void;
  initialData?: Partial<BiohackingData>;
  onStepChange?: (step: number) => void;
  onDataUpdate?: (data: Partial<BiohackingData>) => void;
}

export interface BiohackingValidation {
  isValid: boolean;
  errors: Record<string, string>;
  warnings: Record<string, string>;
  completionPercentage: number;
}

export interface BiohackingProgress {
  currentStep: number;
  completedSteps: number[];
  totalSteps: number;
  estimatedTimeRemaining: number;
  canProceed: boolean;
  canGoBack: boolean;
}

export interface BiohackingAnalysis {
  userId: string;
  scores: {
    overallHealth: number;
    biotype: string;
    chronotype: string;
    metabolicProfile: string;
    stressLevel: number;
    fitnessLevel: number;
    dominantElement: string;
  };
  recommendations: {
    nutrition: {
      macroTargets: { protein: number; carbs: number; fat: number; };
      supplements: string[];
      mealTiming: string[];
      foods: { include: string[]; avoid: string[]; moderate: string[]; };
    };
    exercise: {
      weeklyPlan: { cardio: number; strength: number; flexibility: number; recovery: number; };
      specificActivities: string[];
      intensity: string;
      timing: string[];
    };
    sleep: {
      optimalSchedule: { bedtime: string; wakeTime: string; duration: number; };
      sleepHygiene: string[];
      environment: string[];
      supplements: string[];
    };
    stress: {
      techniques: string[];
      lifestyle: string[];
      professional: string[];
    };
    functionalMedicine: {
      elementBalancing: { overactive: string[]; deficient: string[]; strategies: string[]; };
      organSupport: { liver: string[]; heart: string[]; spleen: string[]; lungs: string[]; kidneys: string[]; };
    };
  };
  tracking: {
    keyMetrics: string[];
    frequency: string;
    targets: Record<string, number>;
    timeline: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
