// src/components/onboarding/BiohackingForm.tsx 
import React, { useState, useCallback } from 'react';
import { 
  Activity, Clock, Apple, Heart, Brain, Beaker, 
  ChevronRight, ChevronLeft, CheckCircle, AlertCircle,
  User, Scale, Bed, Coffee, Dumbbell, Stethoscope
} from 'lucide-react';
import { BiohackingData, BiohackingFormProps, BiohackingStep } from '../../types/biohacking';
type Medication = { name: string; dosage: string; frequency: string; purpose: string };
type Supplement = { name: string; dosage: string; frequency: string; purpose: string };

// 🎯 CONSTANTES
const BODY_TYPES = [
  { value: 'ectomorph', label: 'Ectomorfo', description: 'Magro, dificuldade para ganhar peso' },
  { value: 'mesomorph', label: 'Mesomorfo', description: 'Atlético, facilidade para ganhar massa' },
  { value: 'endomorph', label: 'Endomorfo', description: 'Tendência a acumular gordura' },
  { value: 'unknown', label: 'Não sei', description: 'Preciso de ajuda para identificar' }
];

const CHRONOTYPES = [
  { value: 'morning', label: 'Matutina', description: 'Acordo cedo e rendo mais pela manhã' },
  { value: 'evening', label: 'Noturna', description: 'Prefiro trabalhar à noite, acordo tarde' },
  { value: 'intermediate', label: 'Intermediária', description: 'Não tenho preferência forte' }
];

const BiohackingForm: React.FC<BiohackingFormProps> = ({ 
  onComplete, 
  onBack, 
  initialData,
  onStepChange,
  onDataUpdate 
}) => {
  // 📊 ESTADOS DO FORMULÁRIO
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BiohackingData>(() => {
    const initial = getInitialFormData();
    return initialData ? { ...initial, ...initialData } : initial;
  });
  const [validation, setValidation] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 🎯 CONFIGURAÇÃO DOS STEPS
  const steps: BiohackingStep[] = [
    { 
      id: 1, 
      title: 'Dados Físicos', 
      icon: Activity, 
      description: 'Medidas corporais e composição',
      fields: ['anthropometric'],
      estimatedTime: 5
    },
    { 
      id: 2, 
      title: 'Sono & Energia', 
      icon: Clock, 
      description: 'Padrões de sono e cronótipo',
      fields: ['sleep'],
      estimatedTime: 7
    },
    { 
      id: 3, 
      title: 'Nutrição', 
      icon: Apple, 
      description: 'Hábitos alimentares e digestão',
      fields: ['nutrition'],
      estimatedTime: 8
    },
    { 
      id: 4, 
      title: 'Atividade Física', 
      icon: Heart, 
      description: 'Exercícios e capacidade funcional',
      fields: ['physicalActivity'],
      estimatedTime: 6
    },
    { 
      id: 5, 
      title: 'Saúde Geral', 
      icon: Stethoscope, 
      description: 'Condições e medicamentos',
      fields: ['healthStatus'],
      estimatedTime: 10
    },
    { 
      id: 6, 
      title: 'Medicina Funcional', 
      icon: Beaker, 
      description: 'Avaliação dos 5 elementos',
      fields: ['functionalMedicine', 'cognitive'],
      estimatedTime: 12
    }
  ];

  // 🔧 FUNÇÃO INICIAL DOS DADOS (CORRIGIDA)
  function getInitialFormData(): BiohackingData {
    return {
      anthropometric: {
        height: 0,
        currentWeight: 0,
        desiredWeight: 0,
        waistCircumference: 0,
        hipCircumference: 0,
        bodyFatPercentage: 0,
        bodyType: 'unknown',
        weightHistory: {
          maxWeight: 0,
          minAdultWeight: 0,
          recentWeightChanges: 'stable',
          easyWeightChange: 'neither',
          weightConcerns: []
        }
      },
      sleep: {
        bedtime: '',
        fallAsleepTime: 15,
        wakeupTime: '',
        effectiveSleepHours: 7,
        sleepQuality: 5,
        sleepMedication: false,
        daytimeSleepiness: 5,
        sleepDisorders: {
          snoring: false,
          apnea: false,
          insomnia: false,
          nightmareDisturbances: false,
          restlessLegs: false,
          bruxism: false
        },
        chronotype: 'intermediate',
        energyPattern: {
          morningEnergy: 5,
          afternoonEnergy: 5,
          eveningEnergy: 5
        }
      },
      nutrition: {
        mealsPerDay: 3,
        mealTimes: ['08:00', '13:00', '19:00'],
        waterIntake: 2,
        alcoholConsumption: {
          frequency: 'rarely',
          quantity: 0
        },
        caffeineConsumption: {
          amount: 0,
          lastIntakeTime: '',
          sources: []
        },
        dietaryRestrictions: [],
        foodPreferences: {
          sweetCravings: 5,
          saltyFoods: 5,
          processedFoods: 5,
          organicFoods: 5
        },
        digestiveSymptoms: {
          reflux: false,
          bloating: false,
          constipation: false,
          diarrhea: false,
          gasExcessive: false,
          stomachPain: false,
          foodIntolerances: [],
          digestiveSpeed: 'normal',
          bloatingAfterMeals: false
        }
      },
      physicalActivity: {
        exerciseFrequency: 0,
        preferredActivities: [],
        sessionDuration: 0,
        intensity: 'light',
        physicalLimitations: [],
        sportsHistory: '',
        functionalCapacity: {
          stairClimbing: true,
          carryWeight: true,
          flexibility: false,
          balance: true,
          pushups: 0,
          walkingDistance: 0
        },
        fitnessLevel: 5,
        motivationFactors: []
      },
      healthStatus: {
        chronicConditions: [],
        familyHistory: [],
        currentMedications: [],
        supplements: [],
        allergies: [],
        deficiencySymptoms: {
          chronicFatigue: false,
          hairLoss: false,
          weakNails: false,
          skinProblems: false,
          slowHealing: false,
          frequentInfections: false,
          muscleCramps: false,
          moodSwings: false,
          memoryIssues: false,
          coldIntolerance: false
        },
        mentalHealth: {
          stressLevel: 5,
          anxietyLevel: 5,
          depressionSymptoms: false,
          panicAttacks: false,
          therapyHistory: false
        }
      },
      functionalMedicine: {
        wood: {
          irritability: 5,
          frustrationLevel: 5,
          headaches: 0,
          eyeStrain: false,
          muscleStiffness: false,
          decisionMaking: 5,
          angerManagement: 5,
          planningAbility: 5
        },
        fire: {
          heartPalpitations: false,
          chestTightness: false,
          sleepIssues: false,
          excessiveTalking: false,
          socialAnxiety: 5,
          emotionalInstability: 5,
          joyExpression: 5,
          connectionWithOthers: 5,
          speechClarity: 5
        },
        earth: {
          digestiveStrength: 5,
          worryTendency: 5,
          overthinking: 5,
          sweetCravings: false,
          bloatingAfterMeals: false,
          concentrationIssues: false,
          empathy: 5,
          groundedness: 5,
          nurturingAbility: 5
        },
        metal: {
          respiratoryHealth: 5,
          skinHealth: 5,
          griefProcessing: 5,
          detoxCapacity: 5,
          immuneStrength: 5,
          breathingQuality: 5,
          organizationSkills: 5,
          perfectionism: 5,
          boundariesSetting: 5
        },
        water: {
          adrenalFatigue: 5,
          fearAnxiety: 5,
          sexualVitality: 5,
          boneHealth: 5,
          willpower: 5,
          coldTolerance: 5,
          urinaryHealth: 5,
          memoryRetention: 5,
          motivation: 5,
          resilience: 5
        }
      },
      cognitive: {
        focusQuality: 5,
        memoryQuality: 5,
        mentalClarity: 5,
        creativityLevel: 5,
        learningSpeed: 5,
        cognitiveSymptoms: {
          brainFog: false,
          concentrationDifficulty: false,
          memoryLapses: false,
          mentalFatigue: false,
          decisionFatigue: false,
          wordFinding: false,
          multitaskingDifficulty: false
        },
        preferredLearningStyle: 'visual',
        attentionSpan: 30,
        stressResponse: {
          stressTriggers: [],
          copingMechanisms: [],
          stressRecovery: 5
        }
      }
    };
  }

  // 🔧 FUNÇÕES UTILITÁRIAS
  const updateField = useCallback((path: string, value: any) => {
    setFormData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData as any;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      
      onDataUpdate?.(newData);
      
      return newData;
    });
  }, [onDataUpdate]);

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.anthropometric.height > 0 && formData.anthropometric.currentWeight > 0;
      case 2:
        return formData.sleep.bedtime && formData.sleep.wakeupTime && formData.sleep.sleepQuality > 0;
      case 3:
        return formData.nutrition.mealsPerDay > 0 && formData.nutrition.waterIntake > 0;
      case 4:
        return formData.physicalActivity.exerciseFrequency >= 0 && formData.physicalActivity.fitnessLevel > 0;
      case 5:
        return formData.healthStatus.mentalHealth.stressLevel > 0;
      case 6:
        return formData.cognitive.focusQuality > 0;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      onStepChange?.(nextStep);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      onStepChange?.(prevStep);
    } else {
      onBack?.();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onComplete(formData);
    } catch (error) {
      console.error('Erro ao submeter formulário:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🎨 COMPONENTES DE RENDERIZAÇÃO DOS STEPS

  const renderAnthropometricStep = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <Activity className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900">Dados Físicos</h2>
        <p className="text-gray-600 mt-2">Suas medidas corporais e composição física</p>
      </div>

      {/* Medidas Básicas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Scale className="w-4 h-4 inline mr-2" />
            Altura (cm)
          </label>
          <input
            type="number"
            value={formData.anthropometric.height || ''}
            onChange={(e) => updateField('anthropometric.height', Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="175"
            min="120"
            max="250"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Scale className="w-4 h-4 inline mr-2" />
            Peso Atual (kg)
          </label>
          <input
            type="number"
            value={formData.anthropometric.currentWeight || ''}
            onChange={(e) => updateField('anthropometric.currentWeight', Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="70"
            min="30"
            max="300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Scale className="w-4 h-4 inline mr-2" />
            Peso Desejado (kg)
          </label>
          <input
            type="number"
            value={formData.anthropometric.desiredWeight || ''}
            onChange={(e) => updateField('anthropometric.desiredWeight', Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="68"
            min="30"
            max="300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Circunferência da Cintura (cm) <span className="text-gray-400">- Opcional</span>
          </label>
          <input
            type="number"
            value={formData.anthropometric.waistCircumference || ''}
            onChange={(e) => updateField('anthropometric.waistCircumference', Number(e.target.value) || undefined)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="80"
          />
        </div>
      </div>

      {/* Biotipo Corporal */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          <User className="w-4 h-4 inline mr-2" />
          Qual seu biotipo corporal?
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {BODY_TYPES.map((type) => (
            <div
              key={type.value}
              onClick={() => updateField('anthropometric.bodyType', type.value)}
              className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                formData.anthropometric.bodyType === type.value
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-300 hover:border-blue-300'
              }`}
            >
              <div className="font-medium text-gray-900 mb-1">{type.label}</div>
              <div className="text-sm text-gray-600">{type.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Histórico de Peso */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Histórico de Peso</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maior peso já atingido (kg)
            </label>
            <input
              type="number"
              value={formData.anthropometric.weightHistory.maxWeight || ''}
              onChange={(e) => updateField('anthropometric.weightHistory.maxWeight', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="80"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Menor peso na vida adulta (kg)
            </label>
            <input
              type="number"
              value={formData.anthropometric.weightHistory.minAdultWeight || ''}
              onChange={(e) => updateField('anthropometric.weightHistory.minAdultWeight', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="60"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Mudanças recentes de peso:</label>
          <select
            value={formData.anthropometric.weightHistory.recentWeightChanges}
            onChange={(e) => updateField('anthropometric.weightHistory.recentWeightChanges', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          >
            <option value="stable">Peso estável</option>
            <option value="gain">Ganhando peso</option>
            <option value="loss">Perdendo peso</option>
            <option value="fluctuating">Peso oscilando</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderSleepStep = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <Clock className="w-16 h-16 text-purple-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900">Sono & Energia</h2>
        <p className="text-gray-600 mt-2">Seus padrões de sono e cronótipo natural</p>
      </div>

      {/* Horários de Sono */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Bed className="w-4 h-4 inline mr-2" />
            Horário de Deitar
          </label>
          <input
            type="time"
            value={formData.sleep.bedtime}
            onChange={(e) => updateField('sleep.bedtime', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Bed className="w-4 h-4 inline mr-2" />
            Horário de Acordar
          </label>
          <input
            type="time"
            value={formData.sleep.wakeupTime}
            onChange={(e) => updateField('sleep.wakeupTime', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Tempo para adormecer (minutos)
          </label>
          <input
            type="number"
            value={formData.sleep.fallAsleepTime}
            onChange={(e) => updateField('sleep.fallAsleepTime', Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="15"
            min="1"
            max="180"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Horas efetivas de sono por noite
          </label>
          <input
            type="number"
            step="0.5"
            value={formData.sleep.effectiveSleepHours}
            onChange={(e) => updateField('sleep.effectiveSleepHours', Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            placeholder="7.5"
            min="3"
            max="12"
          />
        </div>
      </div>

      {/* Qualidade do Sono */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Qualidade do sono (1-10)
        </label>
        <div className="flex items-center space-x-4">
          <span className="text-xs text-gray-500">Péssima</span>
          <input
            type="range"
            min="1"
            max="10"
            value={formData.sleep.sleepQuality}
            onChange={(e) => updateField('sleep.sleepQuality', Number(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-purple"
          />
          <span className="text-xs text-gray-500">Excelente</span>
          <span className="font-bold text-purple-600 min-w-8">{formData.sleep.sleepQuality}</span>
        </div>
      </div>

      {/* Sonolência Diurna */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Sonolência durante o dia (1-10)
        </label>
        <div className="flex items-center space-x-4">
          <span className="text-xs text-gray-500">Nunca</span>
          <input
            type="range"
            min="1"
            max="10"
            value={formData.sleep.daytimeSleepiness}
            onChange={(e) => updateField('sleep.daytimeSleepiness', Number(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-purple"
          />
          <span className="text-xs text-gray-500">Sempre</span>
          <span className="font-bold text-purple-600 min-w-8">{formData.sleep.daytimeSleepiness}</span>
        </div>
      </div>

      {/* Medicação para Dormir */}
      <div>
<label className="flex items-center space-x-3 cursor-pointer">
  <input
    type="checkbox"
    checked={formData.functionalMedicine.fire.heartPalpitations}
    onChange={(e) => updateField('functionalMedicine.fire.heartPalpitations', e.target.checked)}
    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
  />
  <span className="text-sm text-gray-700">Palpitações cardíacas</span>
</label>

<label className="flex items-center space-x-3 cursor-pointer">
  <input
    type="checkbox"
    checked={formData.functionalMedicine.fire.chestTightness}
    onChange={(e) => updateField('functionalMedicine.fire.chestTightness', e.target.checked)}
    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
  />
  <span className="text-sm text-gray-700">Aperto no peito</span>
</label>

<label className="flex items-center space-x-3 cursor-pointer">
  <input
    type="checkbox"
    checked={formData.functionalMedicine.fire.sleepIssues}
    onChange={(e) => updateField('functionalMedicine.fire.sleepIssues', e.target.checked)}
    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
  />
  <span className="text-sm text-gray-700">Problemas de sono</span>
</label>

<label className="flex items-center space-x-3 cursor-pointer">
  <input
    type="checkbox"
    checked={formData.functionalMedicine.fire.excessiveTalking}
    onChange={(e) => updateField('functionalMedicine.fire.excessiveTalking', e.target.checked)}
    className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
  />
  <span className="text-sm text-gray-700">Falar excessivamente</span>
</label>
      </div>

      {/* Cronótipo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">Você se considera uma pessoa:</label>
        <div className="space-y-3">
          {CHRONOTYPES.map((type) => (
            <label key={type.value} className="flex items-center space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50">
              <input
                type="radio"
                name="chronotype"
                value={type.value}
                checked={formData.sleep.chronotype === type.value}
                onChange={(e) => updateField('sleep.chronotype', e.target.value)}
                className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
              />
              <div>
                <div className="font-medium text-gray-900">{type.label}</div>
                <div className="text-sm text-gray-600">{type.description}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Padrão de Energia */}
      <div className="bg-purple-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Padrão de Energia Durante o Dia</h3>
        <div className="space-y-4">
          {[
            { key: 'morningEnergy', label: 'Energia pela Manhã', time: '06:00 - 12:00' },
            { key: 'afternoonEnergy', label: 'Energia à Tarde', time: '12:00 - 18:00' },
            { key: 'eveningEnergy', label: 'Energia à Noite', time: '18:00 - 24:00' }
          ].map((period) => (
            <div key={period.key}>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">
                  {period.label} <span className="text-gray-500">({period.time})</span>
                </label>
                <span className="font-bold text-purple-600">
                  {formData.sleep.energyPattern[period.key as keyof typeof formData.sleep.energyPattern]}/10
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={formData.sleep.energyPattern[period.key as keyof typeof formData.sleep.energyPattern]}
                onChange={(e) => updateField(`sleep.energyPattern.${period.key}`, Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-purple"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Distúrbios do Sono */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          Você tem algum destes problemas de sono?
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { key: 'snoring', label: 'Ronco' },
            { key: 'apnea', label: 'Apneia do sono' },
            { key: 'insomnia', label: 'Insônia' },
            { key: 'nightmareDisturbances', label: 'Pesadelos frequentes' },
            { key: 'restlessLegs', label: 'Síndrome das pernas inquietas' },
            { key: 'bruxism', label: 'Bruxismo (ranger dentes)' }
          ].map((disorder) => (
            <label key={disorder.key} className="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-gray-50">
              <input
                type="checkbox"
                checked={Boolean(formData.sleep.sleepDisorders[disorder.key as keyof typeof formData.sleep.sleepDisorders])}
                onChange={(e) => updateField(`sleep.sleepDisorders.${disorder.key}`, e.target.checked)}
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
              />
              <span className="text-sm text-gray-700">{disorder.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const renderNutritionStep = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <Apple className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900">Nutrição</h2>
        <p className="text-gray-600 mt-2">Seus hábitos alimentares e saúde digestiva</p>
      </div>

      {/* Padrões Alimentares Básicos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            <Apple className="w-4 h-4 inline mr-2" />
            Quantas refeições por dia?
          </label>
          <select
            value={formData.nutrition.mealsPerDay}
            onChange={(e) => updateField('nutrition.mealsPerDay', Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value={1}>1 refeição</option>
            <option value={2}>2 refeições</option>
            <option value={3}>3 refeições</option>
            <option value={4}>4 refeições</option>
            <option value={5}>5 refeições</option>
            <option value={6}>6+ refeições</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Litros de água por dia
          </label>
          <input
            type="number"
            step="0.5"
            value={formData.nutrition.waterIntake || ''}
            onChange={(e) => updateField('nutrition.waterIntake', Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            placeholder="2.0"
            min="0"
            max="10"
          />
        </div>
      </div>

      {/* Horários das Refeições */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Horários das principais refeições
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {['Café da manhã', 'Almoço', 'Jantar'].map((meal, index) => (
            <div key={index}>
              <label className="block text-xs text-gray-500 mb-1">{meal}</label>
              <input
                type="time"
                value={formData.nutrition.mealTimes[index] || ''}
                onChange={(e) => {
                  const newTimes = [...formData.nutrition.mealTimes];
                  newTimes[index] = e.target.value;
                  updateField('nutrition.mealTimes', newTimes);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Restrições Dietéticas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Restrições ou dietas que segue:
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { key: 'vegetarian', label: 'Vegetariana' },
            { key: 'vegan', label: 'Vegana' },
            { key: 'keto', label: 'Cetogênica' },
            { key: 'paleo', label: 'Paleolítica' },
            { key: 'intermittent', label: 'Jejum Intermitente' },
            { key: 'lowCarb', label: 'Low Carb' },
            { key: 'glutenFree', label: 'Sem Glúten' },
            { key: 'dairyFree', label: 'Sem Laticínios' }
          ].map((diet) => (
            <label key={diet.key} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.nutrition.dietaryRestrictions.includes(diet.key)}
                onChange={(e) => {
                  const restrictions = formData.nutrition.dietaryRestrictions;
                  if (e.target.checked) {
                    updateField('nutrition.dietaryRestrictions', [...restrictions, diet.key]);
                  } else {
                    updateField('nutrition.dietaryRestrictions', restrictions.filter(d => d !== diet.key));
                  }
                }}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <span className="text-sm text-gray-700">{diet.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Consumo de Álcool */}
      <div className="bg-amber-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">Consumo de Álcool</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Frequência</label>
            <select
              value={formData.nutrition.alcoholConsumption.frequency}
              onChange={(e) => updateField('nutrition.alcoholConsumption.frequency', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
            >
              <option value="never">Nunca</option>
              <option value="rarely">Raramente</option>
              <option value="weekly">Semanalmente</option>
              <option value="daily">Diariamente</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Doses por semana</label>
            <input
              type="number"
              value={formData.nutrition.alcoholConsumption.quantity || ''}
              onChange={(e) => updateField('nutrition.alcoholConsumption.quantity', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
              placeholder="0"
              min="0"
              max="50"
            />
          </div>
        </div>
      </div>

      {/* Cafeína */}
      <div className="bg-amber-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-3">Consumo de Cafeína</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Coffee className="w-4 h-4 inline mr-2" />
              Mg de cafeína por dia
            </label>
            <input
              type="number"
              value={formData.nutrition.caffeineConsumption.amount || ''}
              onChange={(e) => updateField('nutrition.caffeineConsumption.amount', Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
              placeholder="200"
              min="0"
              max="1000"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Último consumo do dia</label>
            <input
              type="time"
              value={formData.nutrition.caffeineConsumption.lastIntakeTime}
              onChange={(e) => updateField('nutrition.caffeineConsumption.lastIntakeTime', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
      </div>

      {/* Saúde Digestiva */}
      <div className="bg-green-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Saúde Digestiva</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Sintomas digestivos que você tem:
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { key: 'bloating', label: 'Inchaço abdominal' },
                { key: 'reflux', label: 'Refluxo ou azia' },
                { key: 'constipation', label: 'Prisão de ventre' },
                { key: 'diarrhea', label: 'Intestino solto' },
                { key: 'gasExcessive', label: 'Gases excessivos' },
                { key: 'stomachPain', label: 'Dor no estômago' }
              ].map((symptom) => (
                <label key={symptom.key} className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.nutrition.digestiveSymptoms[symptom.key as keyof typeof formData.nutrition.digestiveSymptoms])}
                    onChange={(e) => updateField(`nutrition.digestiveSymptoms.${symptom.key}`, e.target.checked)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">{symptom.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Velocidade de digestão
            </label>
            <select
              value={formData.nutrition.digestiveSymptoms.digestiveSpeed}
              onChange={(e) => updateField('nutrition.digestiveSymptoms.digestiveSpeed', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
            >
              <option value="slow">Lenta (digestão demorada)</option>
              <option value="normal">Normal</option>
              <option value="fast">Rápida (fome logo após comer)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPhysicalActivityStep = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <Heart className="w-16 h-16 text-red-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900">Atividade Física</h2>
        <p className="text-gray-600 mt-2">Exercícios, condicionamento e capacidade funcional</p>
      </div>

      {/* Nível de Atividade */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <Dumbbell className="w-4 h-4 inline mr-2" />
          Dias de exercício por semana
        </label>
        <select
          value={formData.physicalActivity.exerciseFrequency}
          onChange={(e) => updateField('physicalActivity.exerciseFrequency', Number(e.target.value))}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
        >
          <option value={0}>Sedentário (0 dias)</option>
          <option value={1}>1 dia por semana</option>
          <option value={2}>2 dias por semana</option>
          <option value={3}>3 dias por semana</option>
          <option value={4}>4 dias por semana</option>
          <option value={5}>5 dias por semana</option>
          <option value={6}>6 dias por semana</option>
          <option value={7}>Todos os dias</option>
        </select>
      </div>

      {/* Duração e Intensidade */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Duração média do exercício (minutos)
          </label>
          <input
            type="number"
            value={formData.physicalActivity.sessionDuration || ''}
            onChange={(e) => updateField('physicalActivity.sessionDuration', Number(e.target.value))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
            placeholder="60"
            min="0"
            max="300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Intensidade habitual dos exercícios
          </label>
          <select
            value={formData.physicalActivity.intensity}
            onChange={(e) => updateField('physicalActivity.intensity', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="light">Leve (caminhada, yoga suave)</option>
            <option value="moderate">Moderado (caminhada rápida, natação)</option>
            <option value="intense">Intenso (corrida, HIIT, musculação pesada)</option>
          </select>
        </div>
      </div>

      {/* Nível de Condicionamento */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Nível de condicionamento físico (1-10)
        </label>
        <div className="flex items-center space-x-4">
          <span className="text-xs text-gray-500">Muito baixo</span>
          <input
            type="range"
            min="1"
            max="10"
            value={formData.physicalActivity.fitnessLevel}
            onChange={(e) => updateField('physicalActivity.fitnessLevel', Number(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-red"
          />
          <span className="text-xs text-gray-500">Atlético</span>
          <span className="font-bold text-red-600 min-w-8">{formData.physicalActivity.fitnessLevel}</span>
        </div>
      </div>

      {/* Atividades Preferidas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Atividades físicas que pratica ou gostaria de praticar:
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            { key: 'walking', label: 'Caminhada' },
            { key: 'running', label: 'Corrida' },
            { key: 'cycling', label: 'Ciclismo' },
            { key: 'swimming', label: 'Natação' },
            { key: 'weightLifting', label: 'Musculação' },
            { key: 'yoga', label: 'Yoga' },
            { key: 'pilates', label: 'Pilates' },
            { key: 'dancing', label: 'Dança' },
            { key: 'martialArts', label: 'Artes Marciais' },
            { key: 'teamSports', label: 'Esportes em Equipe' }
          ].map((activity) => (
            <label key={activity.key} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.physicalActivity.preferredActivities.includes(activity.key)}
                onChange={(e) => {
                  const activities = formData.physicalActivity.preferredActivities;
                  if (e.target.checked) {
                    updateField('physicalActivity.preferredActivities', [...activities, activity.key]);
                  } else {
                    updateField('physicalActivity.preferredActivities', activities.filter(a => a !== activity.key));
                  }
                }}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm text-gray-700">{activity.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Histórico Esportivo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Histórico esportivo (esportes praticados no passado):
        </label>
        <textarea
          value={formData.physicalActivity.sportsHistory}
          onChange={(e) => updateField('physicalActivity.sportsHistory', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500"
          placeholder="Ex: Futebol na adolescência, natação competitiva..."
          rows={2}
        />
      </div>

      {/* Limitações Físicas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Limitações físicas ou lesões:
        </label>
        <textarea
          value={formData.physicalActivity.physicalLimitations.join(', ')}
          onChange={(e) => updateField('physicalActivity.physicalLimitations', e.target.value.split(', ').filter(Boolean))}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500"
          placeholder="Ex: Dor no joelho direito, problemas na coluna..."
          rows={2}
        />
      </div>

      {/* Capacidade Funcional */}
      <div className="bg-red-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Teste de Capacidade Funcional</h3>
        <div className="space-y-4">
          {[
            { key: 'stairClimbing', label: 'Consigo subir 3 lances de escada sem me cansar' },
            { key: 'carryWeight', label: 'Consigo carregar 10kg por 50 metros' },
            { key: 'flexibility', label: 'Consigo tocar os pés sem dobrar os joelhos' },
            { key: 'balance', label: 'Consigo ficar em um pé só por 30 segundos' }
          ].map((test) => (
            <label key={test.key} className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={Boolean(formData.physicalActivity.functionalCapacity[test.key as keyof typeof formData.physicalActivity.functionalCapacity])}
                onChange={(e) => updateField(`physicalActivity.functionalCapacity.${test.key}`, e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm text-gray-700">{test.label}</span>
            </label>
          ))}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantas flexões de braço consegue fazer seguidas?
              </label>
              <input
                type="number"
                value={formData.physicalActivity.functionalCapacity.pushups || ''}
                onChange={(e) => updateField('physicalActivity.functionalCapacity.pushups', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500"
                placeholder="0"
                min="0"
                max="200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Distância que consegue caminhar sem parar (metros)
              </label>
              <input
                type="number"
                value={formData.physicalActivity.functionalCapacity.walkingDistance || ''}
                onChange={(e) => updateField('physicalActivity.functionalCapacity.walkingDistance', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-red-500"
                placeholder="1000"
                min="0"
                max="50000"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderHealthStatusStep = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <Stethoscope className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900">Saúde Geral</h2>
        <p className="text-gray-600 mt-2">Condições de saúde, medicamentos e bem-estar mental</p>
      </div>

      {/* Saúde Mental - Prioridade */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-6">Bem-estar Mental</h3>
        <div className="space-y-6">
          {[
  { key: 'stressLevel', label: 'Nível de Stress no dia a dia', min: 'Muito baixo', max: 'Muito alto' },
  { key: 'anxietyLevel', label: 'Nível de Ansiedade geral', min: 'Nunca ansioso', max: 'Sempre ansioso' }
].map((mental) => (
  <div key={mental.key}>
    <div className="flex justify-between items-center mb-2">
      <label className="text-sm font-medium text-gray-700">{mental.label}</label>
      <span className="font-bold text-blue-600">
        {mental.key === 'stressLevel' ? formData.healthStatus.mentalHealth.stressLevel : formData.healthStatus.mentalHealth.anxietyLevel}/10
      </span>
    </div>
    <div className="flex items-center space-x-4">
      <span className="text-xs text-gray-500">{mental.min}</span>
      <input
        type="range"
        min="1"
        max="10"
        value={mental.key === 'stressLevel' ? formData.healthStatus.mentalHealth.stressLevel : formData.healthStatus.mentalHealth.anxietyLevel}
        onChange={(e) => updateField(`healthStatus.mentalHealth.${mental.key}`, Number(e.target.value))}
        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-blue"
      />
      <span className="text-xs text-gray-500">{mental.max}</span>
    </div>
  </div>
))}

          {/* Sintomas de Saúde Mental */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Você tem ou já teve algum destes sintomas?
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
  { key: 'depressionSymptoms', label: 'Episódios de tristeza profunda' },
  { key: 'panicAttacks', label: 'Ataques de pânico' },
  { key: 'therapyHistory', label: 'Já fez terapia psicológica' }
].map((symptom) => (
  <label key={symptom.key} className="flex items-center space-x-3 cursor-pointer">
    <input
      type="checkbox"
      checked={
        symptom.key === 'depressionSymptoms' ? formData.healthStatus.mentalHealth.depressionSymptoms :
        symptom.key === 'panicAttacks' ? formData.healthStatus.mentalHealth.panicAttacks :
        formData.healthStatus.mentalHealth.therapyHistory
      }
      onChange={(e) => updateField(`healthStatus.mentalHealth.${symptom.key}`, e.target.checked)}
      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
    />
    <span className="text-sm text-gray-700">{symptom.label}</span>
  </label>
))}
            </div>
          </div>
        </div>
      </div>

      {/* Condições Crônicas */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Condições de saúde crônicas ou diagnósticos médicos:
        </label>
        <textarea
          value={formData.healthStatus.chronicConditions.join(', ')}
          onChange={(e) => updateField('healthStatus.chronicConditions', e.target.value.split(', ').filter(Boolean))}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          placeholder="Ex: Hipertensão, Diabetes tipo 2, Hipotireoidismo..."
          rows={2}
        />
      </div>

      {/* Histórico Familiar */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Histórico familiar de doenças relevantes:
        </label>
        <textarea
          value={formData.healthStatus.familyHistory.join(', ')}
          onChange={(e) => updateField('healthStatus.familyHistory', e.target.value.split(', ').filter(Boolean))}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          placeholder="Ex: Diabetes (pai), Hipertensão (mãe), Câncer de mama (avó)..."
          rows={2}
        />
      </div>

      {/* Medicamentos Atuais */}
      <div className="bg-gray-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">💊 Medicamentos Atuais</h3>
        <div className="space-y-4">
          {(formData.healthStatus.currentMedications as Medication[]).map((med, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-white rounded border">
              <input
                type="text"
                placeholder="Nome do medicamento"
                value={med.name}
                onChange={(e) => {
                  const newMeds = [...formData.healthStatus.currentMedications];
                  newMeds[index] = { ...med, name: e.target.value };
                  updateField('healthStatus.currentMedications', newMeds);
                }}
                className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Dosagem"
                value={med.dosage}
                onChange={(e) => {
                  const newMeds = [...formData.healthStatus.currentMedications];
                  newMeds[index] = { ...med, dosage: e.target.value };
                  updateField('healthStatus.currentMedications', newMeds);
                }}
                className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Frequência"
                value={med.frequency}
                onChange={(e) => {
                  const newMeds = [...formData.healthStatus.currentMedications];
                  newMeds[index] = { ...med, frequency: e.target.value };
                  updateField('healthStatus.currentMedications', newMeds);
                }}
                className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => {
                  const newMeds = formData.healthStatus.currentMedications.filter((_, i) => i !== index);
                  updateField('healthStatus.currentMedications', newMeds);
                }}
                className="px-3 py-2 text-red-600 border border-red-300 rounded hover:bg-red-50"
              >
                Remover
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const newMed = { name: '', dosage: '', frequency: '', purpose: '' };
              updateField('healthStatus.currentMedications', [...formData.healthStatus.currentMedications, newMed]);
            }}
            className="w-full px-4 py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-300 hover:text-blue-600"
          >
            + Adicionar Medicamento
          </button>
        </div>
      </div>

      {/* Suplementos */}
      <div className="bg-green-50 p-6 rounded-lg">
        <h3 className="text-lg font-medium text-gray-900 mb-4">💊 Suplementos</h3>
        <div className="space-y-4">
          {(formData.healthStatus.supplements as Supplement[]).map((supplement, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-3 bg-white rounded border">
              <input
                type="text"
                placeholder="Nome do suplemento"
                value={supplement.name}
                onChange={(e) => {
                  const newSupplements = [...formData.healthStatus.supplements];
                  newSupplements[index] = { ...supplement, name: e.target.value };
                  updateField('healthStatus.supplements', newSupplements);
                }}
                className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                placeholder="Dosagem"
                value={supplement.dosage}
                onChange={(e) => {
                  const newSupplements = [...formData.healthStatus.supplements];
                  newSupplements[index] = { ...supplement, dosage: e.target.value };
                  updateField('healthStatus.supplements', newSupplements);
                }}
                className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                placeholder="Frequência"
                value={supplement.frequency}
                onChange={(e) => {
                  const newSupplements = [...formData.healthStatus.supplements];
                  newSupplements[index] = { ...supplement, frequency: e.target.value };
                  updateField('healthStatus.supplements', newSupplements);
                }}
                className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
              />
              <input
                type="text"
                placeholder="Há quanto tempo"
                value={supplement.duration}
                onChange={(e) => {
                  const newSupplements = [...formData.healthStatus.supplements];
                  newSupplements[index] = { ...supplement, duration: e.target.value };
                  updateField('healthStatus.supplements', newSupplements);
                }}
                className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={() => {
                  const newSupplements = formData.healthStatus.supplements.filter((_, i) => i !== index);
                  updateField('healthStatus.supplements', newSupplements);
                }}
                className="px-3 py-2 text-red-600 border border-red-300 rounded hover:bg-red-50"
              >
                Remover
              </button>
            </div>
          ))}
          <button
            onClick={() => {
              const newSupplement = { name: '', dosage: '', frequency: '', purpose: '', duration: '' };
              updateField('healthStatus.supplements', [...formData.healthStatus.supplements, newSupplement]);
            }}
            className="w-full px-4 py-2 border border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-green-300 hover:text-green-600"
          >
            + Adicionar Suplemento
          </button>
        </div>
      </div>

      {/* Alergias */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Alergias conhecidas:
        </label>
        <textarea
          value={formData.healthStatus.allergies.join(', ')}
          onChange={(e) => updateField('healthStatus.allergies', e.target.value.split(', ').filter(Boolean))}
          className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
          placeholder="Ex: Pólen, camarão, amendoim, látex..."
          rows={2}
        />
      </div>

      {/* Sintomas de Deficiências */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          ⚠️ Você tem notado algum destes sintomas? (possíveis deficiências nutricionais)
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
  { key: 'chronicFatigue', label: 'Fadiga crônica/cansaço constante' },
  { key: 'hairLoss', label: 'Queda excessiva de cabelo' },
  { key: 'weakNails', label: 'Unhas fracas ou quebradiças' },
  { key: 'skinProblems', label: 'Problemas de pele (ressecamento, acne)' },
  { key: 'slowHealing', label: 'Cicatrização lenta' },
  { key: 'frequentInfections', label: 'Infecções frequentes' },
  { key: 'muscleCramps', label: 'Cãibras musculares frequentes' },
  { key: 'moodSwings', label: 'Mudanças bruscas de humor' },
  { key: 'memoryIssues', label: 'Problemas de memória' },
  { key: 'coldIntolerance', label: 'Sensibilidade excessiva ao frio' }
].map((symptom) => (
  <label key={symptom.key} className="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-gray-50">
    <input
      type="checkbox"
      checked={
        symptom.key === 'chronicFatigue' ? formData.healthStatus.deficiencySymptoms.chronicFatigue :
        symptom.key === 'hairLoss' ? formData.healthStatus.deficiencySymptoms.hairLoss :
        symptom.key === 'weakNails' ? formData.healthStatus.deficiencySymptoms.weakNails :
        symptom.key === 'skinProblems' ? formData.healthStatus.deficiencySymptoms.skinProblems :
        symptom.key === 'slowHealing' ? formData.healthStatus.deficiencySymptoms.slowHealing :
        symptom.key === 'frequentInfections' ? formData.healthStatus.deficiencySymptoms.frequentInfections :
        symptom.key === 'muscleCramps' ? formData.healthStatus.deficiencySymptoms.muscleCramps :
        symptom.key === 'moodSwings' ? formData.healthStatus.deficiencySymptoms.moodSwings :
        symptom.key === 'memoryIssues' ? formData.healthStatus.deficiencySymptoms.memoryIssues :
        formData.healthStatus.deficiencySymptoms.coldIntolerance
      }
      onChange={(e) => updateField(`healthStatus.deficiencySymptoms.${symptom.key}`, e.target.checked)}
      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
    />
    <span className="text-sm text-gray-700">{symptom.label}</span>
  </label>
))}
        </div>
      </div>
    </div>
  );

  const renderFunctionalMedicineStep = () => (
    <div className="space-y-8">
      <div className="text-center mb-8">
        <Beaker className="w-16 h-16 text-purple-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900">Medicina Funcional</h2>
        <p className="text-gray-600 mt-2">Avaliação dos 5 elementos da Medicina Tradicional Chinesa</p>
        <div className="mt-4 p-4 bg-purple-50 rounded-lg">
          <p className="text-sm text-purple-700">
            Esta seção avalia o equilíbrio energético dos seus órgãos segundo a MTC, 
            correlacionando aspectos físicos e emocionais para um diagnóstico mais completo.
          </p>
        </div>
      </div>

      {/* ELEMENTO MADEIRA (Fígado/Vesícula) */}
      <div className="bg-green-50 p-6 rounded-lg border-l-4 border-green-400">
        <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center">
          🌳 Elemento MADEIRA - Fígado & Vesícula Biliar
        </h3>
        <p className="text-sm text-green-700 mb-6">
          Governa: Planejamento, criatividade, visão, flexibilidade, detoxificação
        </p>

        <div className="space-y-6">
          {[
  { key: 'irritability', label: 'Controle da irritabilidade', min: 'Explodo fácil', max: 'Muito calmo' },
  { key: 'frustrationLevel', label: 'Tolerância à frustração', min: 'Baixa', max: 'Alta' },
  { key: 'decisionMaking', label: 'Capacidade de decisão', min: 'Muito difícil', max: 'Muito fácil' },
  { key: 'angerManagement', label: 'Gestão da raiva', min: 'Difícil', max: 'Excelente' },
  { key: 'planningAbility', label: 'Habilidade de planejar', min: 'Desorganizado', max: 'Estrategista' }
].map((aspect) => (
  <div key={aspect.key}>
    <div className="flex justify-between items-center mb-2">
      <label className="text-sm font-medium text-gray-700">{aspect.label}</label>
      <span className="font-bold text-green-600">
        {
          aspect.key === 'irritability' ? formData.functionalMedicine.wood.irritability :
          aspect.key === 'frustrationLevel' ? formData.functionalMedicine.wood.frustrationLevel :
          aspect.key === 'decisionMaking' ? formData.functionalMedicine.wood.decisionMaking :
          aspect.key === 'angerManagement' ? formData.functionalMedicine.wood.angerManagement :
          formData.functionalMedicine.wood.planningAbility
        }/10
      </span>
    </div>
    <div className="flex items-center space-x-4">
      <span className="text-xs text-gray-500">{aspect.min}</span>
      <input
        type="range"
        min="1"
        max="10"
        value={
          aspect.key === 'irritability' ? formData.functionalMedicine.wood.irritability :
          aspect.key === 'frustrationLevel' ? formData.functionalMedicine.wood.frustrationLevel :
          aspect.key === 'decisionMaking' ? formData.functionalMedicine.wood.decisionMaking :
          aspect.key === 'angerManagement' ? formData.functionalMedicine.wood.angerManagement :
          formData.functionalMedicine.wood.planningAbility
        }
        onChange={(e) => updateField(`functionalMedicine.wood.${aspect.key}`, Number(e.target.value))}
        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-green"
      />
      <span className="text-xs text-gray-500">{aspect.max}</span>
    </div>
  </div>
))}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Sintomas físicos relacionados:</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
  { key: 'eyeStrain', label: 'Tensão/cansaço visual' },
  { key: 'muscleStiffness', label: 'Rigidez muscular (especialmente pescoço/ombros)' }
].map((symptom) => (
  <label key={symptom.key} className="flex items-center space-x-3 cursor-pointer">
    <input
      type="checkbox"
      checked={symptom.key === 'eyeStrain' ? formData.functionalMedicine.wood.eyeStrain : formData.functionalMedicine.wood.muscleStiffness}
      onChange={(e) => updateField(`functionalMedicine.wood.${symptom.key}`, e.target.checked)}
      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
    />
    <span className="text-sm text-gray-700">{symptom.label}</span>
  </label>
))}
            </div>

            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700 mb-2">Dores de cabeça (frequência/mês)</label>
              <input
                type="number"
                value={formData.functionalMedicine.wood.headaches || ''}
                onChange={(e) => updateField('functionalMedicine.wood.headaches', Number(e.target.value))}
                className="w-32 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                min="0"
                max="30"
                placeholder="0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ELEMENTO FOGO (Coração/Intestino Delgado) - VERSÃO CORRIGIDA */}
      <div className="bg-red-50 p-6 rounded-lg border-l-4 border-red-400">
        <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center">
          🔥 Elemento FOGO - Coração & Intestino Delgado
        </h3>
        <p className="text-sm text-red-700 mb-6">
          Governa: Alegria, comunicação, relacionamentos, circulação, sono
        </p>

        <div className="space-y-6">
          {/* Checkboxes - Sintomas Físicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.functionalMedicine.fire.heartPalpitations}
                onChange={(e) => updateField('functionalMedicine.fire.heartPalpitations', e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm text-gray-700">Palpitações cardíacas</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.functionalMedicine.fire.chestTightness}
                onChange={(e) => updateField('functionalMedicine.fire.chestTightness', e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm text-gray-700">Aperto no peito</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.functionalMedicine.fire.sleepIssues}
                onChange={(e) => updateField('functionalMedicine.fire.sleepIssues', e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm text-gray-700">Problemas de sono</span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.functionalMedicine.fire.excessiveTalking}
                onChange={(e) => updateField('functionalMedicine.fire.excessiveTalking', e.target.checked)}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="text-sm text-gray-700">Falar excessivamente</span>
            </label>
          </div>

          {/* Ranges - Aspectos Emocionais/Sociais */}
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">Ansiedade social</label>
                <span className="font-bold text-red-600">{formData.functionalMedicine.fire.socialAnxiety}/10</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-xs text-gray-500">Nunca</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.functionalMedicine.fire.socialAnxiety}
                  onChange={(e) => updateField('functionalMedicine.fire.socialAnxiety', Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-red"
                />
                <span className="text-xs text-gray-500">Sempre</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">Instabilidade emocional</label>
                <span className="font-bold text-red-600">{formData.functionalMedicine.fire.emotionalInstability}/10</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-xs text-gray-500">Estável</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.functionalMedicine.fire.emotionalInstability}
                  onChange={(e) => updateField('functionalMedicine.fire.emotionalInstability', Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-red"
                />
                <span className="text-xs text-gray-500">Instável</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">Expressão de alegria</label>
                <span className="font-bold text-red-600">{formData.functionalMedicine.fire.joyExpression}/10</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-xs text-gray-500">Difícil</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.functionalMedicine.fire.joyExpression}
                  onChange={(e) => updateField('functionalMedicine.fire.joyExpression', Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-red"
                />
                <span className="text-xs text-gray-500">Natural</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">Conexão com outros</label>
                <span className="font-bold text-red-600">{formData.functionalMedicine.fire.connectionWithOthers}/10</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-xs text-gray-500">Difícil</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.functionalMedicine.fire.connectionWithOthers}
                  onChange={(e) => updateField('functionalMedicine.fire.connectionWithOthers', Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-red"
                />
                <span className="text-xs text-gray-500">Fácil</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">Clareza na fala</label>
                <span className="font-bold text-red-600">{formData.functionalMedicine.fire.speechClarity}/10</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-xs text-gray-500">Confusa</span>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.functionalMedicine.fire.speechClarity}
                  onChange={(e) => updateField('functionalMedicine.fire.speechClarity', Number(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-red"
                />
                <span className="text-xs text-gray-500">Muito clara</span>
              </div>
            </div>
          </div>
        </div>
      </div>
              
    
          


      {/* AVALIAÇÃO COGNITIVA */}
      <div className="bg-purple-50 p-6 rounded-lg border-l-4 border-purple-400">
        <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center">
          🧠 Avaliação Cognitiva
        </h3>
        
        <div className="space-y-6">
       <div>
  <div className="flex justify-between items-center mb-2">
    <label className="text-sm font-medium text-gray-700">Qualidade do foco/concentração</label>
    <span className="font-bold text-purple-600">{formData.cognitive.focusQuality}/10</span>
  </div>
  <div className="flex items-center space-x-4">
    <span className="text-xs text-gray-500">Muito disperso</span>
    <input
      type="range"
      min="1"
      max="10"
      value={formData.cognitive.focusQuality}
      onChange={(e) => updateField('cognitive.focusQuality', Number(e.target.value))}
      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-purple"
    />
    <span className="text-xs text-gray-500">Laser focus</span>
  </div>
</div>

<div>
  <div className="flex justify-between items-center mb-2">
    <label className="text-sm font-medium text-gray-700">Qualidade da memória</label>
    <span className="font-bold text-purple-600">{formData.cognitive.memoryQuality}/10</span>
  </div>
  <div className="flex items-center space-x-4">
    <span className="text-xs text-gray-500">Esquecimento</span>
    <input
      type="range"
      min="1"
      max="10"
      value={formData.cognitive.memoryQuality}
      onChange={(e) => updateField('cognitive.memoryQuality', Number(e.target.value))}
      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-purple"
    />
    <span className="text-xs text-gray-500">Excelente</span>
  </div>
</div>

<div>
  <div className="flex justify-between items-center mb-2">
    <label className="text-sm font-medium text-gray-700">Clareza mental</label>
    <span className="font-bold text-purple-600">{formData.cognitive.mentalClarity}/10</span>
  </div>
  <div className="flex items-center space-x-4">
    <span className="text-xs text-gray-500">Névoa mental</span>
    <input
      type="range"
      min="1"
      max="10"
      value={formData.cognitive.mentalClarity}
      onChange={(e) => updateField('cognitive.mentalClarity', Number(e.target.value))}
      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-purple"
    />
    <span className="text-xs text-gray-500">Muito claro</span>
  </div>
</div>

<div>
  <div className="flex justify-between items-center mb-2">
    <label className="text-sm font-medium text-gray-700">Nível de criatividade</label>
    <span className="font-bold text-purple-600">{formData.cognitive.creativityLevel}/10</span>
  </div>
  <div className="flex items-center space-x-4">
    <span className="text-xs text-gray-500">Bloqueado</span>
    <input
      type="range"
      min="1"
      max="10"
      value={formData.cognitive.creativityLevel}
      onChange={(e) => updateField('cognitive.creativityLevel', Number(e.target.value))}
      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-purple"
    />
    <span className="text-xs text-gray-500">Muito criativo</span>
  </div>
</div>

<div>
  <div className="flex justify-between items-center mb-2">
    <label className="text-sm font-medium text-gray-700">Velocidade de aprendizado</label>
    <span className="font-bold text-purple-600">{formData.cognitive.learningSpeed}/10</span>
  </div>
  <div className="flex items-center space-x-4">
    <span className="text-xs text-gray-500">Muito lento</span>
    <input
      type="range"
      min="1"
      max="10"
      value={formData.cognitive.learningSpeed}
      onChange={(e) => updateField('cognitive.learningSpeed', Number(e.target.value))}
      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-purple"
    />
    <span className="text-xs text-gray-500">Muito rápido</span>
  </div>
</div>
        

        {/* Estilo de Aprendizado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Qual seu estilo de aprendizado preferido?
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { value: 'visual', label: 'Visual', desc: 'Aprendo melhor vendo imagens, gráficos, diagramas' },
                { value: 'auditory', label: 'Auditivo', desc: 'Aprendo melhor ouvindo explicações, podcasts, música' },
                { value: 'kinesthetic', label: 'Cinestésico', desc: 'Aprendo melhor fazendo, tocando, movimentando' },
                { value: 'reading', label: 'Leitura/Escrita', desc: 'Aprendo melhor lendo textos e fazendo anotações' }
              ].map((style) => (
                <label key={style.value} className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-white">
                  <input
                    type="radio"
                    name="learningStyle"
                    value={style.value}
                    checked={formData.cognitive.preferredLearningStyle === style.value}
                    onChange={(e) => updateField('cognitive.preferredLearningStyle', e.target.value)}
                    className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500 mt-0.5"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{style.label}</div>
                    <div className="text-sm text-gray-600">{style.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Tempo de Atenção */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Tempo máximo de concentração focada (minutos)
            </label>
            <input
              type="number"
              value={formData.cognitive.attentionSpan || ''}
              onChange={(e) => updateField('cognitive.attentionSpan', Number(e.target.value))}
              className="w-32 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
              placeholder="30"
              min="5"
              max="240"
            />
          </div>
        </div>
      </div>
    </div>
  );

  // Renderizar step atual
  const renderCurrentStep = () => {
    console.log('🔍 Renderizando step:', currentStep);
    
    switch (currentStep) {
      case 1:
        return renderAnthropometricStep();
      case 2:
        return renderSleepStep();
      case 3:
        return renderNutritionStep();
      case 4:
        return renderPhysicalActivityStep();
      case 5:
        return renderHealthStatusStep();
      case 6:
        return renderFunctionalMedicineStep();
      default:
        return null;
    }
  };

  const isStepValid = validateStep(currentStep);
  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header com Progresso */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Avaliação Biohacking</h1>
            <span className="text-sm text-gray-600">
              Etapa {currentStep} de {steps.length}
            </span>
          </div>
          
          {/* Barra de Progresso */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Navegação de Steps */}
          <div className="flex justify-between text-xs mb-2">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex flex-col items-center cursor-pointer transition-all ${
                  currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'
                } ${currentStep === step.id ? 'scale-110' : ''}`}
                onClick={() => setCurrentStep(step.id)}
              >
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mb-1 ${
                  currentStep > step.id 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : currentStep === step.id
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-gray-300 text-gray-400'
                }`}>
                  {currentStep > step.id ? <CheckCircle className="w-4 h-4" /> : <step.icon className="w-4 h-4" />}
                </div>
                <span className="hidden md:block text-center leading-tight">{step.title}</span>
                <span className="hidden lg:block text-gray-500 text-xs">{step.estimatedTime}min</span>
              </div>
            ))}
          </div>
        </div>

        {/* Conteúdo do Step Atual */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          {renderCurrentStep()}
        </div>

        {/* Navegação Inferior */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            className="flex items-center px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            {currentStep > 1 ? 'Anterior' : 'Voltar'}
          </button>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              {isStepValid ? (
                <span className="text-green-600 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Etapa concluída
                </span>
              ) : (
                <span className="text-amber-600 flex items-center">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  Preencha os campos obrigatórios
                </span>
              )}
            </p>
          </div>

          <button
            onClick={handleNext}
            disabled={!isStepValid || isSubmitting}
            className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${
              isStepValid && !isSubmitting
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              'Processando...'
            ) : currentStep < steps.length ? (
              <>
                Próximo
                <ChevronRight className="w-4 h-4 ml-2" />
              </>
            ) : (
              'Finalizar Avaliação'
            )}
          </button>
        </div>
      </div>

      {/* CSS personalizado para sliders */}
      <style jsx>{`
        .slider-purple::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #8b5cf6;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .slider-green::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #10b981;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .slider-red::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #ef4444;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .slider-blue::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3b82f6;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }

        .slider-purple::-moz-range-thumb,
        .slider-green::-moz-range-thumb,
        .slider-red::-moz-range-thumb,
        .slider-blue::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default BiohackingForm;
