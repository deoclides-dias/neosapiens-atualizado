// src/pages/analysis/index.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowRight, Calendar, Activity, Brain, Zap, Clock, CheckCircle, Lock, TrendingUp } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import useAnalysisProgress from '../../hooks/useAnalysisProgress';

interface AnalysisModule {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: any;
  color: string;
  estimatedTime: string;
  href: string;
  status: 'available' | 'completed' | 'locked';
  requiredFor?: string[];
}

const AnalysisHub = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { progress, loading, error, isAnalysisAvailable } = useAnalysisProgress();

  const analysisModules: AnalysisModule[] = [
    {
      id: 'birth',
      title: 'Dados de Nascimento',
      subtitle: 'Astrologia & Numerologia',
      description: 'Descubra sua essência através das tradições ancestrais. Análise astrológica ocidental, chinesa e numerológica baseada em seus dados de nascimento.',
      icon: Calendar,
      color: 'indigo',
      estimatedTime: '8-12 min',
      href: '/analysis/birth',
      status: progress.birth.completed ? 'completed' : 'available',
      requiredFor: ['Biohacking', 'Tradições Ancestrais']
    },
    {
      id: 'biohacking',
      title: 'Perfil Biológico',
      subtitle: 'Corpo & Energia',
      description: 'Otimize sua biologia através de dados científicos sobre sono, alimentação, exercícios e padrões energéticos para máxima performance.',
      icon: Activity,
      color: 'green',
      estimatedTime: '10-15 min',
      href: '/analysis/biohacking',
      status: progress.biohacking.completed ? 'completed' : 
              isAnalysisAvailable('biohacking') ? 'available' : 'locked',
      requiredFor: ['Análise Integrada']
    },
    {
      id: 'psychological',
      title: 'Perfil Psicológico',
      subtitle: 'Cinco Grandes Fatores',
      description: 'Vinte frases curtas de um questionário científico de personalidade (Mini-IPIP), com verificação da qualidade das respostas.',
      icon: Brain,
      color: 'purple',
      estimatedTime: '4-5 min',
      href: '/analysis/psychological',
      status: progress.psychological.completed ? 'completed' : 
              isAnalysisAvailable('psychological') ? 'available' : 'locked',
      requiredFor: ['Desenvolvimento Mental']
    },
    {
      id: 'cognitive',
      title: 'Perfil Cognitivo',
      subtitle: 'Aprendizado & Processamento',
      description: 'Entenda como sua mente processa informações e otimize suas estratégias de aprendizado, criatividade e resolução de problemas.',
      icon: Zap,
      color: 'yellow',
      estimatedTime: '12-18 min',
      href: '/analysis/cognitive',
      status: progress.cognitive.completed ? 'completed' : 
              isAnalysisAvailable('cognitive') ? 'available' : 'locked',
      requiredFor: ['Otimização Cognitiva']
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando sua central de análises...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">⚠️ Erro ao Carregar</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

  const completedCount = analysisModules.filter(module => module.status === 'completed').length;
  const canAccessResults = completedCount > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            📊 Central de Análises NeoSapiens
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Descubra suas três dimensões através de análises científicas e tradições ancestrais. 
            Complete no seu ritmo e desbloqueie insights personalizados.
          </p>
        </div>

        {/* Progresso Geral */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">🎯 Seu Progresso</h2>
            <div className="text-right">
              <div className="text-3xl font-bold text-indigo-600">{progress.overallProgress.toFixed(0)}%</div>
              <div className="text-sm text-gray-500">{completedCount} de 4 completas</div>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-600 h-4 rounded-full transition-all duration-500"
              style={{ width: `${progress.overallProgress}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-sm text-gray-600">
            <span>Iniciante</span>
            <span>Explorador</span>
            <span>Neo-Navegante</span>
          </div>
        </div>

        {/* Módulos de Análise */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {analysisModules.map((module) => {
            const IconComponent = module.icon;
            const isAvailable = module.status === 'available';
            const isCompleted = module.status === 'completed';
            const isLocked = module.status === 'locked';
            
            return (
              <div
                key={module.id}
                className={`
                  group relative bg-white rounded-2xl shadow-lg transition-all duration-300 
                  ${isAvailable || isCompleted ? 'hover:shadow-xl hover:scale-105 cursor-pointer' : 'opacity-60'}
                  ${isCompleted ? 'ring-2 ring-green-200' : ''}
                `}
                onClick={() => (isAvailable || isCompleted) && router.push(module.href)}
              >
                {/* Status Badge */}
                <div className={`
                  absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1
                  ${isCompleted ? 'bg-green-100 text-green-800' : 
                    isAvailable ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}
                `}>
                  {isCompleted && <CheckCircle className="w-3 h-3" />}
                  {isLocked && <Lock className="w-3 h-3" />}
                  <span>
                    {isCompleted ? 'Completo' : isAvailable ? 'Disponível' : 'Bloqueado'}
                  </span>
                </div>

                <div className="p-8">
                  {/* Icon & Title */}
                  <div className="flex items-center mb-6">
                    <div className={`
                      w-14 h-14 rounded-xl flex items-center justify-center mr-4
                      ${isCompleted ? 'bg-green-100' : 
                        isAvailable ? `bg-${module.color}-100` : 'bg-gray-100'}
                    `}>
                      <IconComponent className={`
                        w-7 h-7 
                        ${isCompleted ? 'text-green-600' : 
                          isAvailable ? `text-${module.color}-600` : 'text-gray-400'}
                      `} />
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{module.title}</h3>
                      <p className="text-sm text-gray-500">{module.subtitle}</p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-6 leading-relaxed">{module.description}</p>

                  {/* Time & Requirements */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      <span className="text-sm">{module.estimatedTime}</span>
                    </div>
                    
                    {module.requiredFor && (
                      <div className="text-xs text-gray-400">
                        Necessário para: {module.requiredFor.join(', ')}
                      </div>
                    )}
                  </div>

                  {/* Action Button */}
                  <div className="flex items-center justify-between">
                    {isCompleted ? (
                      <span className="text-green-600 font-medium flex items-center">
                        ✅ Revisar Análise
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </span>
                    ) : isAvailable ? (
                      <span className={`text-${module.color}-600 font-medium flex items-center`}>
                        Começar Agora
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </span>
                    ) : (
                      <span className="text-gray-400 font-medium flex items-center">
                        <Lock className="w-4 h-4 mr-2" />
                        Complete análises anteriores
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Acesso aos Resultados */}
        <div className={`
          bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-8 text-white
          ${canAccessResults ? 'cursor-pointer hover:shadow-2xl transform hover:scale-105' : 'opacity-60'}
          transition-all duration-300
        `}
        onClick={() => canAccessResults && router.push('/results')}
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">📈 Hub de Resultados</h2>
              <p className="text-indigo-100 mb-4">
                {canAccessResults 
                  ? 'Acesse suas análises completas e insights personalizados'
                  : 'Complete pelo menos uma análise para desbloquear'
                }
              </p>
              
              {canAccessResults ? (
                <div className="flex items-center text-white font-medium">
                  <span>Ver Meus Resultados</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </div>
              ) : (
                <div className="text-indigo-200">
                  <span>🔒 {4 - completedCount} análises restantes</span>
                </div>
              )}
            </div>
            
            <div className="hidden md:block">
              <TrendingUp className="w-16 h-16 text-white opacity-80" />
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-8 text-center">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">
              🌟 Por que fazer todas as análises?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div>
                <strong>🎯 Análise Integrada:</strong> Correlações únicas entre suas dimensões
              </div>
              <div>
                <strong>📊 Insights Personalizados:</strong> Recomendações baseadas em múltiplas fontes
              </div>
              <div>
                <strong>🚀 Plano Completo:</strong> Desenvolvimento direcionado e científico
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisHub;