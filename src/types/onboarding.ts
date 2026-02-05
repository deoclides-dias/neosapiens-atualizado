// src/types/onboarding.ts

export interface BirthData {
  fullName: string;
  birthTime: string;
  hasExactTime: boolean;
  birthPlace: string;
  coordinates: {
    lat: number;
    lng: number;
  } | null;
  timezone: string;
}

export interface PersonalData {
  fullName: string;
  email: string;
  age?: number;
  gender?: string;
}

export interface BiohackingData {
  sleepQuality: number;
  energyLevel: number;
  exerciseFrequency: string;
  dietType: string;
  stressLevel: number;
  supplements: string[];
}

export interface CognitiveData {
  learningStyle: string;
  focusLevel: number;
  creativityScore: number;
  memoryQuality: number;
  problemSolvingStyle: string;
}

export interface OnboardingProgress {
  currentStep: number;
  completedSteps: string[];
  personalDataComplete: boolean;
  birthDataComplete: boolean;
  biohackingDataComplete: boolean;
  cognitiveDataComplete: boolean;
}

export interface OnboardingState {
  currentStep: number;
  personalData?: PersonalData;
  birthData?: BirthData;
  biohackingData?: BiohackingData;
  cognitiveData?: CognitiveData;
  progress: OnboardingProgress;
  isComplete: boolean;
}
