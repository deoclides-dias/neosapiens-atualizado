// src/pages/onboarding.tsx - PARTE 1/4
// ============================================================================
// IMPORTS E INTERFACES
// ============================================================================

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import {
  User,
  Calendar,
  Activity,
  Brain,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Clock,
  Target,
  Zap,
  Star,
  Loader
} from 'lucide-react';

// Hooks e Serviços
import { useAuth } from '../hooks/useAuth';
import { usePsychologicalForm } from '../hooks/usePsychologicalForm';

// Componentes de Formulários
import BirthDataForm from '../components/onboarding/BirthDataForm';
import BiohackingForm from '../components/onboarding/BiohackingForm';
import PsychologicalForm from '../components/onboarding/PsychologicalForm';
import CognitiveForm from '../components/onboarding/CognitiveForm'; 

// CORREÇÃO: Tipos locais em vez de import externo
interface BiohackingData {
  anthropometric: {
    height: number;
    currentWeight: number;
    desiredWeight: number;
    bodyType: string;
    weightHistory: {
      maxWeight: number;
      minAdultWeight: number;
      recentWeightChanges: string;
      easyWeightChange: string;
      weightConcerns: string[];
    };
  };
  sleep: any;
  nutrition: any;
  physicalActivity: any;
  healthStatus: any;
  functionalMedicine: any;
  cognitive: any;
}

// ============================================================================
// INTERFACES E TIPOS
// ============================================================================

// Dados Pessoais
interface PersonalData {
  fullName: string;
  email: string;
  gender?: string;
 }

// Dados de Nascimento
interface BirthData {
  fullName: string;
  birthDate: string;
  birthTime: string;
  hasExactTime: boolean;
  birthPlace: string;
  coordinates: { lat: number; lng: number; } | null;
  timezone: string;
}

// Dados Cognitivos
interface CognitiveData {
  learningStyle?: string;
  focusLevel?: number;
  creativityAreas?: string[];
  mentalChallenges?: string[];
  currentPractices?: string[];
}

// Tipos Psicológicos
interface PsychologicalScores {
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
    compliance: number;
  };
  vark: {
    visual: number;
    auditory: number;
    reading: number;
    kinesthetic: number;
    dominant: string;
  };
  yinyang: {
    yin: number;
    yang: number;
    balance: string;
  };
  mtc: {
    wood: number;
    fire: number;
    earth: number;
    metal: number;
    water: number;
    dominantElement: string;
  };
  completionDate: string;
  totalQuestions: number;
  completedQuestions: number;
  completionPercentage: number;
}

// Estados do Onboarding
type OnboardingStep = 'personal' | 'birth' | 'biohacking' | 'psychological' | 'cognitive' | 'complete';

interface OnboardingState {
  currentStep: OnboardingStep;
  completedSteps: OnboardingStep[];
  personalData?: PersonalData;
  birthData?: BirthData;
  biohackingData?: BiohackingData;
  psychologicalData?: PsychologicalScores;
  cognitiveData?: CognitiveData;
  error?: string;
}
// src/pages/onboarding.tsx - PARTE 2/4
// ============================================================================
// COMPONENTE PRINCIPAL E HANDLERS
// ============================================================================

const OnboardingPage: React.FC = () => {
  const router = useRouter();
  const { user, loading } = useAuth();
  
  // Estados principais
  const [onboardingState, setOnboardingState] = useState<OnboardingState>({
    currentStep: 'personal',
    completedSteps: []
  });
  
  const [isLoading, setIsLoading] = useState(false);

  // Hook psicológico
  const psychologicalForm = usePsychologicalForm();

  // ============================================================================
  // HANDLERS DOS FORMULÁRIOS
  // ============================================================================

  const handlePersonalComplete = async (data: PersonalData): Promise<void> => {
    try {
      console.log('👤 Dados pessoais recebidos:', data);
      
      setOnboardingState(prev => ({
        ...prev,
        personalData: data,
        completedSteps: [...prev.completedSteps.filter(s => s !== 'personal'), 'personal'],
        currentStep: 'birth'
      }));
      
      console.log('✅ Dados pessoais salvos e navegação para birth');
    } catch (error) {
      console.error('❌ Erro no handlePersonalComplete:', error);
      setOnboardingState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Erro ao processar dados pessoais'
      }));
    }
  };

  const handleBirthComplete = async (data: BirthData): Promise<void> => {
    try {
      console.log('🌟 Dados de nascimento recebidos:', data);
      
      setOnboardingState(prev => ({
        ...prev,
        birthData: data,
        completedSteps: [...prev.completedSteps.filter(s => s !== 'birth'), 'birth'],
        currentStep: 'biohacking'
      }));
      
      console.log('✅ Dados de nascimento salvos e navegação para biohacking');
    } catch (error) {
      console.error('❌ Erro no handleBirthComplete:', error);
      setOnboardingState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Erro ao processar dados de nascimento'
      }));
    }
  };

 const handleBiohackingComplete = async (data: any): Promise<void> => {
    try {
      console.log('💪 Dados de biohacking recebidos:', data);
      
      // Validação básica
      if (!data.anthropometric?.height || !data.anthropometric?.currentWeight) {
        throw new Error('Dados antropométricos básicos são obrigatórios');
      }

      setOnboardingState(prev => ({
        ...prev,
        biohackingData: data,
        completedSteps: [...prev.completedSteps.filter(s => s !== 'biohacking'), 'biohacking'],
        currentStep: 'psychological'
      }));
      
      console.log('✅ Dados de biohacking salvos e navegação para psychological');
    } catch (error) {
      console.error('❌ Erro no handleBiohackingComplete:', error);
      setOnboardingState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Erro ao processar dados de biohacking'
      }));
    }
  };

  const handlePsychologicalComplete = async (data: PsychologicalScores): Promise<void> => {
    try {
      console.log('🧠 Dados psicológicos recebidos:', data);
      
      setOnboardingState(prev => ({
        ...prev,
        psychologicalData: data,
        completedSteps: [...prev.completedSteps.filter(s => s !== 'psychological'), 'psychological'],
        currentStep: 'cognitive'
      }));
      
      console.log('✅ Dados psicológicos salvos e navegação para cognitive');
    } catch (error) {
      console.error('❌ Erro no handlePsychologicalComplete:', error);
      setOnboardingState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Erro ao processar dados psicológicos'
      }));
    }
  };

  const handleCognitiveComplete = async (data: CognitiveData): Promise<void> => {
    try {
      console.log('⚡ Dados cognitivos recebidos:', data);
      
      setOnboardingState(prev => ({
        ...prev,
        cognitiveData: data,
        completedSteps: [...prev.completedSteps.filter(s => s !== 'cognitive'), 'cognitive'],
        currentStep: 'complete'
      }));
      
      console.log('✅ Onboarding completo! Navegando para resultados...');
      
      // Navegar para página de resultados
      setTimeout(() => {
        router.push('/results');
      }, 2000);
      
    } catch (error) {
      console.error('❌ Erro no handleCognitiveComplete:', error);
      setOnboardingState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Erro ao processar dados cognitivos'
      }));
    }
  };

  // ============================================================================
  // NAVEGAÇÃO ENTRE STEPS
  // ============================================================================

  const goToNextStep = () => {
    const steps: OnboardingStep[] = ['personal', 'birth', 'biohacking', 'psychological', 'cognitive', 'complete'];
    const currentIndex = steps.indexOf(onboardingState.currentStep);
    
    if (currentIndex < steps.length - 1) {
      setOnboardingState(prev => ({
        ...prev,
        currentStep: steps[currentIndex + 1]
      }));
    }
  };

  const goToPreviousStep = () => {
    const steps: OnboardingStep[] = ['personal', 'birth', 'biohacking', 'psychological', 'cognitive', 'complete'];
    const currentIndex = steps.indexOf(onboardingState.currentStep);
    
    if (currentIndex > 0) {
      setOnboardingState(prev => ({
        ...prev,
        currentStep: steps[currentIndex - 1]
      }));
    }
  };

  // ============================================================================
  // VERIFICAÇÃO DE AUTENTICAÇÃO
  // ============================================================================

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
      return;
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 text-white animate-spin mx-auto mb-4" />
          <p className="text-white">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }
 
// ============================================================================
// RENDER DO COMPONENTE - STEPS PRINCIPAIS
// ============================================================================
 // src/pages/onboarding.tsx - PARTE 3/4
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header com Progresso */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Jornada de Autoconhecimento
          </h1>
          <p className="text-slate-300 text-lg max-w-2xl mx-auto">
            Um processo revolucionário que integra tradições ancestrais com ciência moderna
          </p>
          
          {/* Indicador de Progresso */}
          <div className="mt-8 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-slate-400">Progresso Geral</span>
              <span className="text-sm text-slate-400">
                {onboardingState.completedSteps.length}/5 completos
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(onboardingState.completedSteps.length / 5) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* STEP: DADOS PESSOAIS */}
        {onboardingState.currentStep === 'personal' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-8 text-center">
              <User className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-4">Dados Pessoais</h2>
              <p className="text-slate-300 mb-8">
                Vamos começar conhecendo você melhor
              </p>
              
              {/* Formulário Pessoal Simplificado */}
              <div className="space-y-6">
                <div>
                  <label className="block text-slate-300 text-sm font-medium mb-2">Nome Completo</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Seu nome completo"
                    onBlur={(e) => {
                      if (e.target.value) {
                        handlePersonalComplete({
                          fullName: e.target.value,
                          email: user?.email || '',
                          });
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP: DADOS DE NASCIMENTO */}
        {onboardingState.currentStep === 'birth' && (
          <BirthDataForm
            onComplete={handleBirthComplete}
            onBack={goToPreviousStep}
            initialData={onboardingState.birthData}
          />
        )}

        {/* STEP: BIOHACKING */}
        {onboardingState.currentStep === 'biohacking' && (
          <BiohackingForm
            onComplete={handleBiohackingComplete}
            onBack={goToPreviousStep}
            initialData={onboardingState.biohackingData}
            onStepChange={(step) => console.log('Biohacking step:', step)}
            onDataUpdate={(data) => console.log('Biohacking data update:', data)}
          />
        )}

        {/* STEP: PSICOLÓGICO */}
        {onboardingState.currentStep === 'psychological' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-8 text-center">
              <Brain className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-4">Perfil Psicológico</h2>
              <p className="text-slate-300 mb-8">
                A avaliação psicológica será implementada em breve. Incluirá questionários detalhados sobre 
                personalidade, comportamento e padrões cognitivos.
              </p>
              <div className="space-y-4">
                <button
                  onClick={goToPreviousStep}
                  className="w-full px-6 py-3 border border-white/20 text-white rounded-xl hover:bg-white/5 transition-colors"
                >
                  Voltar para Biohacking
                </button>
                <button
                  onClick={() => handlePsychologicalComplete({
                    bigFive: { openness: 0, conscientiousness: 0, extraversion: 0, agreeableness: 0, neuroticism: 0 },
                    disc: { dominance: 0, influence: 0, steadiness: 0, compliance: 0 },
                    vark: { visual: 0, auditory: 0, reading: 0, kinesthetic: 0, dominant: 'visual' },
                    yinyang: { yin: 0, yang: 0, balance: 'balanced' },
                    mtc: { wood: 0, fire: 0, earth: 0, metal: 0, water: 0, dominantElement: 'wood' },
                    completionDate: new Date().toISOString(),
                    totalQuestions: 104,
                    completedQuestions: 0,
                    completionPercentage: 0
                  })}
                  className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all"
                >
                  Pular por Enquanto e Continuar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP: COGNITIVO */}
        {onboardingState.currentStep === 'cognitive' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-8 text-center">
              <Zap className="w-16 h-16 text-indigo-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-4">Perfil Cognitivo</h2>
              <p className="text-slate-300 mb-8">
                A avaliação cognitiva será implementada em breve. Incluirá questionários sobre aprendizado, 
                foco, criatividade e estilo cognitivo.
              </p>
              <div className="space-y-4">
                <button
                  onClick={goToPreviousStep}
                  className="w-full px-6 py-3 border border-white/20 text-white rounded-xl hover:bg-white/5 transition-colors"
                >
                  Voltar para Avaliação Psicológica
                </button>
                <button
                  onClick={() => handleCognitiveComplete({})}
                  className="w-full px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl hover:shadow-lg transition-all"
                >
                  Pular por Enquanto e Finalizar
                </button>
              </div>
            </div>
          </div>
        )}
       // src/pages/onboarding.tsx - PARTE 4/4
// ============================================================================
// STEP FINAL E EXPORT
// ============================================================================

        {/* STEP: ONBOARDING COMPLETO */}
        {onboardingState.currentStep === 'complete' && (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 p-12 text-center">
              
              {/* Header de Sucesso */}
              <div className="mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-500/50">
                  <CheckCircle className="w-14 h-14 text-white" />
                </div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-green-400 bg-clip-text text-transparent mb-4">
                  Jornada de Autoconhecimento Completa!
                </h2>
                <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                  Parabéns! Você concluiu a avaliação mais completa e revolucionária do mundo. 
                  Agora você pode acessar suas análises personalizadas e seu plano de desenvolvimento único.
                </p>
              </div>
              
              {/* Cards de Análises Disponíveis */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Star className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Tradições Ancestrais</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Análise astrológica ocidental, chinesa e numerologia para descobrir seu propósito cósmico
                  </p>
                </div>
                
                <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Biohacking Avançado</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Protocolos personalizados de otimização física baseados na medicina funcional
                  </p>
                </div>
                
                <div className="bg-white/5 rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">Perfil Psicológico</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Mapeamento científico completo da personalidade e padrões cognitivos
                  </p>
                </div>
              </div>

              {/* Estatísticas da Jornada */}
              <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-emerald-400 mb-1">100+</div>
                  <div className="text-sm text-slate-400">Questões Respondidas</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-1">3</div>
                  <div className="text-sm text-slate-400">Tradições Integradas</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-1">5</div>
                  <div className="text-sm text-slate-400">Dimensões Avaliadas</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-1">∞</div>
                  <div className="text-sm text-slate-400">Possibilidades</div>
                </div>
              </div>

              {/* Botão Principal */}
              <div className="mt-12">
                <button
                  onClick={() => router.push('/results')}
                  className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 text-white rounded-2xl hover:shadow-2xl hover:shadow-emerald-500/25 transition-all duration-300 text-lg font-semibold group"
                >
                  <span className="mr-3">🚀</span>
                  Ver Meus Resultados
                  <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {/* Mensagens Motivacionais */}
              <div className="mt-12 space-y-4">
                <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl p-6">
                  <p className="text-slate-300 text-lg font-medium">
                    🌟 "O autoconhecimento é o primeiro passo para a transformação"
                  </p>
                  <p className="text-slate-400 text-sm mt-2">
                    Você agora possui insights únicos que 99% das pessoas nunca terão acesso
                  </p>
                </div>
              </div>

              {/* Footer com Agradecimento */}
              <div className="mt-12 pt-8 border-t border-white/10">
                <p className="text-slate-300 text-lg">
                  🙏 Obrigado por ser pioneiro(a) na revolução do autoconhecimento integrado!
                </p>
                <p className="text-slate-400 text-sm mt-2">
                  Você está entre as primeiras pessoas do mundo a experimentar esta metodologia única.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {onboardingState.error && (
          <div className="max-w-2xl mx-auto mt-8">
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
              <p className="text-red-400 font-medium mb-2">Ops! Algo deu errado</p>
              <p className="text-red-300 text-sm">{onboardingState.error}</p>
              <button
                onClick={() => setOnboardingState(prev => ({ ...prev, error: undefined }))}
                className="mt-4 px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-colors"
              >
                Tentar Novamente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// EXPORT DEFAULT
// ============================================================================
import BugHunterComponent from '../components/debug/BugHunterComponent';

export default OnboardingPage;
<BugHunterComponent />
