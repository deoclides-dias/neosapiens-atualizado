// src/pages/results/index.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Star, Activity, Brain, Zap, Target, ChevronRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';

interface AnalysisProgress {
  birth_complete: boolean;
  biohacking_complete: boolean;
  psychological_complete: boolean;
  cognitive_complete: boolean;
  overall_progress: number;
}

interface ResultCard {
  id: string;
  title: string;
  subtitle: string;
  icon: any;
  color: string;
  href: string;
  status: 'available' | 'locked';
  description: string;
  requiredAnalysis: string[];
}

const ResultsHub = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [progress, setProgress] = useState<AnalysisProgress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadUserProgress();
    }
  }, [user]);

  const loadUserProgress = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('onboarding_progress')
        .select('birth_data_complete, biohacking_data_complete, psychological_data_complete, cognitive_data_complete')
        .eq('user_id', user?.id)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      const completedCount = [
        data?.birth_data_complete,
        data?.biohacking_data_complete,
        data?.psychological_data_complete,
        data?.cognitive_data_complete
      ].filter(Boolean).length;
      
      // Mapear dados para estrutura esperada
      const progressData = {
        birth_complete: data?.birth_data_complete || false,
        biohacking_complete: data?.biohacking_data_complete || false,
        psychological_complete: data?.psychological_data_complete || false,
        cognitive_complete: data?.cognitive_data_complete || false,
        overall_progress: Math.round((completedCount / 4) * 100)
      };
      
      setProgress(progressData);
    } catch (err) {
      console.error('Erro ao carregar progresso:', err);
    } finally {
      setLoading(false);
    }
  };

  const resultCards: ResultCard[] = [
    {
      id: 'astrology',
      title: 'Análise Astrológica',
      subtitle: 'Tradições Ancestrais',
      icon: Star,
      color: 'indigo',
      href: '/results/astrology',
      status: progress?.birth_complete ? 'available' : 'locked',
      description: 'Descubra sua essência através da astrologia ocidental, chinesa e numerologia.',
      requiredAnalysis: ['birth']
    },
    {
      id: 'biohacking',
      title: 'Relatório Biológico',
      subtitle: 'Otimização Corporal',
      icon: Activity,
      color: 'green',
      href: '/results/biohacking',
      status: progress?.biohacking_complete ? 'available' : 'locked',
      description: 'Recomendações personalizadas para sono, nutrição, exercícios e energia.',
      requiredAnalysis: ['biohacking']
    },
    {
      id: 'psychological',
      title: 'Perfil Psicológico',
      subtitle: 'Big Five & Padrões',
      icon: Brain,
      color: 'purple',
      href: '/results/psychological',
      status: progress?.psychological_complete ? 'available' : 'locked',
      description: 'Análise científica da sua personalidade e padrões comportamentais únicos.',
      requiredAnalysis: ['psychological']
    },
    {
      id: 'cognitive',
      title: 'Análise Cognitiva',
      subtitle: 'Aprendizado & Criatividade',
      icon: Zap,
      color: 'yellow',
      href: '/results/cognitive',
      status: progress?.cognitive_complete ? 'available' : 'locked',
      description: 'Como sua mente processa informações e estratégias de otimização cognitiva.',
      requiredAnalysis: ['cognitive']
    }
  ];

  const integrationAvailable = resultCards.every(card => card.status === 'available');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando seus resultados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center mb-8">
          <button 
            onClick={() => router.push('/analysis')} 
            className="flex items-center text-indigo-600 hover:text-indigo-800 mr-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Central de Análises
          </button>
          
          <div>
            <h1 className="text-4xl font-bold text-gray-900">📊 Hub de Resultados</h1>
            <p className="text-xl text-gray-600">Explore suas análises completas e insights personalizados</p>
          </div>
        </div>

        {/* Progresso Geral */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">🎯 Progresso Geral</h2>
            <span className="text-lg font-semibold text-indigo-600">
              {progress?.overall_progress.toFixed(0)}% Completo
            </span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress?.overall_progress || 0}%` }}
            ></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className={`p-3 rounded-lg ${progress?.birth_complete ? 'bg-green-100' : 'bg-gray-100'}`}>
              <div className={`text-sm font-medium ${progress?.birth_complete ? 'text-green-800' : 'text-gray-600'}`}>
                🌟 Nascimento
              </div>
              <div className={`text-xs ${progress?.birth_complete ? 'text-green-600' : 'text-gray-500'}`}>
                {progress?.birth_complete ? 'Completo' : 'Pendente'}
              </div>
            </div>
            
            <div className={`p-3 rounded-lg ${progress?.biohacking_complete ? 'bg-green-100' : 'bg-gray-100'}`}>
              <div className={`text-sm font-medium ${progress?.biohacking_complete ? 'text-green-800' : 'text-gray-600'}`}>
                💪 Biohacking
              </div>
              <div className={`text-xs ${progress?.biohacking_complete ? 'text-green-600' : 'text-gray-500'}`}>
                {progress?.biohacking_complete ? 'Completo' : 'Pendente'}
              </div>
            </div>
            
            <div className={`p-3 rounded-lg ${progress?.psychological_complete ? 'bg-green-100' : 'bg-gray-100'}`}>
              <div className={`text-sm font-medium ${progress?.psychological_complete ? 'text-green-800' : 'text-gray-600'}`}>
                🧠 Psicológico
              </div>
              <div className={`text-xs ${progress?.psychological_complete ? 'text-green-600' : 'text-gray-500'}`}>
                {progress?.psychological_complete ? 'Completo' : 'Pendente'}
              </div>
            </div>
            
            <div className={`p-3 rounded-lg ${progress?.cognitive_complete ? 'bg-green-100' : 'bg-gray-100'}`}>
              <div className={`text-sm font-medium ${progress?.cognitive_complete ? 'text-green-800' : 'text-gray-600'}`}>
                ⚡ Cognitivo
              </div>
              <div className={`text-xs ${progress?.cognitive_complete ? 'text-green-600' : 'text-gray-500'}`}>
                {progress?.cognitive_complete ? 'Completo' : 'Pendente'}
              </div>
            </div>
          </div>
        </div>

        {/* Cards de Resultados */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {resultCards.map((card) => {
            const IconComponent = card.icon;
            const isAvailable = card.status === 'available';
            
            return (
              <div
                key={card.id}
                className={`
                  group relative bg-white rounded-2xl shadow-lg transition-all duration-300 transform
                  ${isAvailable 
                    ? 'hover:shadow-xl hover:scale-105 cursor-pointer' 
                    : 'opacity-60 cursor-not-allowed'
                  }
                `}
                onClick={() => isAvailable && router.push(card.href)}
              >
                {/* Status Badge */}
                <div className={`
                  absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium
                  ${isAvailable 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-600'
                  }
                `}>
                  {isAvailable ? '✅ Disponível' : '🔒 Bloqueado'}
                </div>

                <div className="p-8">
                  {/* Header */}
                  <div className="flex items-center mb-4">
                    <div className={`
                      w-12 h-12 rounded-xl flex items-center justify-center mr-4
                      ${isAvailable 
                        ? `bg-${card.color}-100` 
                        : 'bg-gray-100'
                      }
                    `}>
                      <IconComponent className={`
                        w-6 h-6 
                        ${isAvailable 
                          ? `text-${card.color}-600` 
                          : 'text-gray-400'
                        }
                      `} />
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{card.title}</h3>
                      <p className="text-sm text-gray-500">{card.subtitle}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-6">{card.description}</p>

                  {/* Action */}
                  <div className="flex items-center justify-between">
                    {isAvailable ? (
                      <span className={`text-${card.color}-600 font-medium flex items-center`}>
                        Ver Análise
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </span>
                    ) : (
                      <div>
                        <span className="text-gray-400 font-medium">Complete primeiro:</span>
                        <div className="text-xs text-gray-500 mt-1">
                          {card.requiredAnalysis.map(req => {
                            const names = {
                              birth: '🌟 Nascimento',
                              biohacking: '💪 Biohacking', 
                              psychological: '🧠 Psicológico',
                              cognitive: '⚡ Cognitivo'
                            };
                            return names[req];
                          }).join(', ')}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Análise Integrada */}
        <div className={`
          bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-8 text-white
          ${integrationAvailable ? 'cursor-pointer hover:shadow-2xl transform hover:scale-105' : 'opacity-60'}
          transition-all duration-300
        `}
        onClick={() => integrationAvailable && router.push('/results/integrated')}
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center mb-4">
                <Target className="w-8 h-8 mr-3" />
                <div>
                  <h2 className="text-2xl font-bold">🎯 Análise Integrada Final</h2>
                  <p className="text-indigo-100">Sua jornada completa de autodescoberta</p>
                </div>
              </div>
              
              <p className="text-indigo-100 mb-6 max-w-2xl">
                Descubra como todas as suas dimensões se conectam. A síntese final que revela 
                padrões únicos, bloqueios ocultos e seu potencial máximo de desenvolvimento.
              </p>
              
              {integrationAvailable ? (
                <div className="flex items-center text-white font-medium">
                  <span>Acessar Análise Completa</span>
                  <ChevronRight className="w-5 h-5 ml-2" />
                </div>
              ) : (
                <div className="text-indigo-200">
                  <span className="font-medium">🔒 Complete todas as análises para desbloquear</span>
                  <div className="text-sm mt-1">
                    {4 - resultCards.filter(card => card.status === 'available').length} análises restantes
                  </div>
                </div>
              )}
            </div>
            
            <div className="hidden md:block">
              <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <Target className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        {!integrationAvailable && (
          <div className="mt-8 text-center">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                📈 Continue Sua Jornada de Autodescoberta
              </h3>
              <p className="text-gray-600 mb-6">
                Complete suas análises pendentes para ter acesso a insights mais profundos e personalizados.
              </p>
              <button 
                onClick={() => router.push('/analysis')} 
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
              >
                Continuar Análises
              </button>
            </div>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-8 flex justify-center space-x-4">
          <button 
            onClick={() => router.push('/analysis')} 
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Central de Análises
          </button>
          
          {integrationAvailable && (
            <button 
              onClick={() => router.push('/results/integrated')} 
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors font-medium"
            >
              🎯 Ver Análise Integrada
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsHub;