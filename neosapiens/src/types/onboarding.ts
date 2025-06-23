export interface BirthData {
  fullName: string;
  birthDate: string;
  birthTime: string;
  hasExactTime: boolean;
  birthPlace: string;
  coordinates: {
    lat: number;
    lng: number;
  } | null;
  timezone: string;
}

export interface PlaceSuggestion {
  name: string;
  coordinates: { lat: number; lng: number; };
  timezone: string;
  country?: string;
  state?: string;
  city?: string;
}

export interface OnboardingStep {
  id: number;
  title: string;
  subtitle: string;
  component: React.ComponentType<any>;
  isComplete: boolean;
  isRequired: boolean;
}
