// src/pages/results/integrated.tsx - PARTE 1/2
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Target, Star, Activity, Brain, Zap, TrendingUp, AlertCircle, CheckCircle, Lightbulb } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import useAnalysisProgress from '../../hooks/useAnalysisProgress';


interface IntegratedInsight {
  type: 'strength' | 'challenge' | 'opportunity' | 'pattern';
  title: string;
  description: string;
  sources: string[];
  actionable: string;
}

interface DimensionScore {
  name: string;
  score: number;
  description: string;
  color: string;
}

const IntegratedAnalysis = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { progress, loading } = useAnalysisProgress();
  const [insights, setInsights] = useState<IntegratedInsight[]>([]);
  const [dimensionScores, setDimensionScores] = useState<DimensionScore[]>([]);

  useEffect(() => {
    if (progress && !loading) {
      generateIntegratedAnalysis();
    }
  }, [progress, loading]);

  const generateIntegratedAnalysis = () => {
    // Simular análise integrada baseada no progresso atual
    const completedAnalyses = [
      progress.birth.completed && 'birth',
      progress.biohacking.completed && 'biohacking', 
      progress.psychological.completed && 'psychological',
      progress.cognitive.completed && 'cognitive'
    ].filter(Boolean);

    // Gerar insights baseados nas análises completas
    const generatedInsights: IntegratedInsight[] = [];

    if (progress.birth.completed) {
      generatedInsights.push({
        type: 'strength',
        title: 'Essência Astrológica Definida',
        description: 'Seu mapa astral revela uma personalidade com características marcantes que se alinham com seu potencial natural.',
        sources: ['Astrologia Ocidental', 'Numerologia'],
        actionable: 'Use essas características como base para tomadas de decisão importantes.'
      });
    }

    if (progress.biohacking.completed) {
      generatedInsights.push({
        type: 'opportunity',
        title: 'Otimização Biológica',
        description: 'Seus padrões de sono e energia podem ser otimizados para aumentar significativamente sua performance.',
        sources: ['Análise Biológica'],
        actionable: 'Implemente as recomendações de sono e nutrição nos próximos 30 dias.'
      });
    }

    if (progress.psychological.completed && progress.birth.completed) {
      generatedInsights.push({
        type: 'pattern',
        title: 'Alinhamento Astro-Psicológico',
        description: 'Existe uma forte correlação entre seu perfil astrológico e traços psicológicos identificados.',
        sources: ['Astrologia', 'Big Five'],
        actionable: 'Explore práticas que integrem sua natureza astrológica com desenvolvimento psicológico.'
      });
    }

    if (completedAnalyses.length >= 3) {
      generatedInsights.push({
        type: 'challenge',
        title: 'Área de Integração',
        description: 'Identificamos uma oportunidade de melhor alinhamento entre suas dimensões Corpo, Mente e Propósito.',
        sources: completedAnalyses,
        actionable: 'Foque em práticas que envolvam simultaneamente múltiplas dimensões.'
      });
    }

    setInsights(generatedInsights);

    // Gerar scores dimensionais
    const scores: DimensionScore[] = [
      {
        name: 'Propósito',
        score: progress.birth.completed ? 85 : 0,
        description: 'Clareza sobre valores e direção de vida',
        color: 'indigo'
      },
      {
        name: 'Corpo',
        score: progress.biohacking.completed ? 72 : 0,
        description: 'Otimização e consciência corporal',
        color: 'green'
      },
      {
        name: 'Mente',
        score: (progress.psychological.completed ? 40 : 0) + (progress.cognitive.completed ? 40 : 0),
        description: 'Desenvolvimento psicológico e cognitivo',
        color: 'purple'
      }
    ];

    setDimensionScores(scores);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'strength': return CheckCircle;
      case 'challenge': return AlertCircle;
      case 'opportunity': return TrendingUp;
      case 'pattern': return Lightbulb;
      default: return Target;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'strength': return 'green';
      case 'challenge': return 'orange';
      case 'opportunity': return 'blue';
      case 'pattern': return 'purple';
      default: return 'gray';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Processando sua análise integrada...</p>
        </div>
      </div>
    );
  };

  const completedCount = [progress.birth.completed, progress.biohacking.completed, progress.psychological.completed, progress.cognitive.completed].filter(Boolean).length;

  if (completedCount === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
        <div className="max-w-2xl mx-auto">
          <button 
            onClick={() => router.push('/results')} 
            className="flex items-center text-indigo-600 hover:text-indigo-800 mb-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Voltar aos Resultados
          </button>
          
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Análise Integrada Indisponível</h2>
            <p className="text-gray-600 mb-6">
              Complete pelo menos uma análise para acessar insights integrados personalizados.
            </p>
            <button 
              onClick={() => router.push('/analysis')} 
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Iniciar Análises
            </button>
          </div>
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
            onClick={() => router.push('/results')} 
            className="flex items-center text-indigo-600 hover:text-indigo-800 mr-6"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Hub de Resultados
          </button>
          
          <div>
            <h1 className="text-4xl font-bold text-gray-900">🎯 Análise Integrada</h1>
            <p className="text-xl text-gray-600">Sua jornada completa de autodescoberta sintetizada</p>
          </div>
        </div>

        {/* Progresso das Dimensões */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {dimensionScores.map((dimension, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">{dimension.name}</h3>
                <span className={`text-2xl font-bold text-${dimension.color}-600`}>
                  {dimension.score}%
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
                <div 
                  className={`bg-${dimension.color}-500 h-3 rounded-full transition-all duration-500`}
                  style={{ width: `${dimension.score}%` }}
                ></div>
              </div>
              
              <p className="text-gray-600 text-sm">{dimension.description}</p>
            </div>
          ))}
        </div>

        {/* Insights Principais */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">💡 Insights Integrados</h2>
          
          <div className="space-y-6">
            {insights.map((insight, index) => {
              const IconComponent = getInsightIcon(insight.type);
              const color = getInsightColor(insight.type);
              
              return (
                <div key={index} className={`border-l-4 border-${color}-500 pl-6 py-4`}>
                  <div className="flex items-start space-x-3">
                    <IconComponent className={`w-6 h-6 text-${color}-600 flex-shrink-0 mt-1`} />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {insight.title}
                      </h3>
                      <p className="text-gray-700 mb-3">{insight.description}</p>
                      
                      <div className="mb-3">
                        <span className="text-sm font-medium text-gray-600">Baseado em: </span>
                        <span className="text-sm text-gray-500">
                          {insight.sources.join(', ')}
                        </span>
                      </div>
                      
                      <div className={`bg-${color}-50 p-3 rounded-lg`}>
                        <span className="text-sm font-medium text-gray-700">💡 Ação recomendada: </span>
                        <span className="text-sm text-gray-600">{insight.actionable}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Status das Análises */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Status das Análises</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className={`p-4 rounded-lg border-2 ${progress.birth.completed ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
              <Star className={`w-8 h-8 mb-2 ${progress.birth.completed ? 'text-green-600' : 'text-gray-400'}`} />
              <h3 className="font-semibold text-gray-900">Nascimento</h3>
              <p className="text-sm text-gray-600">
                {progress.birth.completed ? '✅ Completo' : '⏳ Pendente'}
              </p>
            </div>
            
            <div className={`p-4 rounded-lg border-2 ${progress.biohacking.completed ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
              <Activity className={`w-8 h-8 mb-2 ${progress.biohacking.completed ? 'text-green-600' : 'text-gray-400'}`} />
              <h3 className="font-semibold text-gray-900">Biohacking</h3>
              <p className="text-sm text-gray-600">
                {progress.biohacking.completed ? '✅ Completo' : '⏳ Pendente'}
              </p>
            </div>
            
            <div className={`p-4 rounded-lg border-2 ${progress.psychological.completed ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
              <Brain className={`w-8 h-8 mb-2 ${progress.psychological.completed ? 'text-green-600' : 'text-gray-400'}`} />
              <h3 className="font-semibold text-gray-900">Psicológico</h3>
              <p className="text-sm text-gray-600">
                {progress.psychological.completed ? '✅ Completo' : '⏳ Pendente'}
              </p>
            </div>
            
            <div className={`p-4 rounded-lg border-2 ${progress.cognitive.completed ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
              <Zap className={`w-8 h-8 mb-2 ${progress.cognitive.completed ? 'text-green-600' : 'text-gray-400'}`} />
              <h3 className="font-semibold text-gray-900">Cognitivo</h3>
              <p className="text-sm text-gray-600">
                {progress.cognitive.completed ? '✅ Completo' : '⏳ Pendente'}
              </p>
            </div>
          </div>
        </div>

        {/* Próximos Passos */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-6">🚀 Próximos Passos</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Para Aprofundar:</h3>
              <ul className="space-y-2 text-indigo-100">
                {!progress.birth.completed && <li>• Complete a análise de nascimento</li>}
                {!progress.biohacking.completed && <li>• Faça a avaliação biológica</li>}
                {!progress.psychological.completed && <li>• Responda ao questionário psicológico</li>}
                {!progress.cognitive.completed && <li>• Realize a análise cognitiva</li>}
                {completedCount === 4 && <li>• Explore módulos avançados de desenvolvimento</li>}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">Ações Imediatas:</h3>
              <ul className="space-y-2 text-indigo-100">
                <li>• Implemente uma recomendação por semana</li>
                <li>• Acompanhe seu progresso diariamente</li>
                <li>• Conecte-se com outros Neo-Navegantes</li>
                <li>• Agende uma revisão em 30 dias</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-center space-x-4">
          <button 
            onClick={() => router.push('/results')} 
            className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            ← Ver Resultados Individuais
          </button>
          
          <button 
            onClick={() => router.push('/analysis')} 
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Continuar Análises →
          </button>
        </div>
      </div>
    </div>
  );
};

export default IntegratedAnalysis;
