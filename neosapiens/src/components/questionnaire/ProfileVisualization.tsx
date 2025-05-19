import React, { useState, useEffect } from 'react';
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from 'recharts';

type ProfileVisualizationProps = {
  data: {
    purpose: number;
    body: number;
    mind: number;
  };
  onRestartQuestionnaire: () => void;
};

const ProfileVisualization: React.FC<ProfileVisualizationProps> = ({ 
  data, 
  onRestartQuestionnaire 
}) => {
  const [animatedData, setAnimatedData] = useState({
    purpose: 0,
    body: 0,
    mind: 0,
  });

  // Animação do gráfico
  useEffect(() => {
    const steps = 20;
    const duration = 1500;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      if (step <= steps) {
        const progress = step / steps;
        setAnimatedData({
          purpose: Math.round(data.purpose * progress),
          body: Math.round(data.body * progress),
          mind: Math.round(data.mind * progress),
        });
      } else {
        clearInterval(timer);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [data]);

  // Preparar dados para o gráfico
  const chartData = [
    { subject: 'Propósito', A: animatedData.purpose, fullMark: 100 },
    { subject: 'Corpo', A: animatedData.body, fullMark: 100 },
    { subject: 'Mente', A: animatedData.mind, fullMark: 100 },
  ];

  // Determinar a dimensão mais forte
  const strongestDimension = Object.entries(data)
    .sort(([, a], [, b]) => b - a)[0][0];

  // Determinar a dimensão mais fraca
  const weakestDimension = Object.entries(data)
    .sort(([, a], [, b]) => a - b)[0][0];

  // Calcular a média das três dimensões
  const average = Math.round((data.purpose + data.body + data.mind) / 3);

  // Determinar o desequilíbrio entre a dimensão mais forte e a mais fraca
  const imbalance = Object.entries(data)
    .sort(([, a], [, b]) => b - a)[0][1] - 
    Object.entries(data).sort(([, a], [, b]) => a - b)[0][1];

  // Função para obter o texto da dimensão
  const getDimensionText = (dimension: string) => {
    switch (dimension) {
      case 'purpose':
        return 'Propósito';
      case 'body':
        return 'Corpo';
      case 'mind':
        return 'Mente';
      default:
        return dimension;
    }
  };

  // Função para obter a cor da dimensão
  const getDimensionColor = (dimension: string) => {
    switch (dimension) {
      case 'purpose':
        return 'text-purple-700';
      case 'body':
        return 'text-green-700';
      case 'mind':
        return 'text-blue-700';
      default:
        return 'text-indigo-700';
    }
  };

  // Gerar a análise personalizada
  const generateAnalysis = () => {
    let analysis = '';

    // Análise baseada na média
    if (average >= 80) {
      analysis = 'Seu perfil demonstra um alto nível de desenvolvimento nas três dimensões. Você já possui uma base sólida para a Integração NeoSapiens.';
    } else if (average >= 60) {
      analysis = 'Seu perfil apresenta um bom equilíbrio dimensional, com oportunidades específicas para aprofundamento.';
    } else if (average >= 40) {
      analysis = 'Seu perfil revela um potencial substancial para desenvolvimento em múltiplas dimensões.';
    } else {
      analysis = 'Seu perfil indica que você está começando uma jornada transformadora com amplo espaço para crescimento.';
    }

    // Análise baseada no desequilíbrio
    if (imbalance > 30) {
      analysis += ` Há um desequilíbrio significativo entre suas dimensões, com a dimensão ${getDimensionText(strongestDimension)} bem mais desenvolvida que a dimensão ${getDimensionText(weakestDimension)}.`;
    } else if (imbalance > 15) {
      analysis += ` Existe um moderado desequilíbrio entre suas dimensões, com oportunidades para harmonização.`;
    } else {
      analysis += ` Você demonstra um equilíbrio harmonioso entre as três dimensões, o que facilita o processo de integração.`;
    }

    return analysis;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 animate-fadeIn">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-indigo-900 mb-2">
          Seu Perfil Tridimensional
        </h3>
        
        <p className="text-gray-700">
          Esta visualização representa um mapeamento inicial do seu equilíbrio nas três dimensões.
        </p>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Gráfico Radar */}
        <div className="w-full md:w-1/2">
          <div className="h-72 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                <PolarGrid strokeDasharray="3 3" stroke="#cccccc" />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: '#4b5563', fontSize: 14, fontWeight: 500 }}
                />
                <PolarRadiusAxis
                  angle={30}
                  domain={[0, 100]}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                  tickCount={5}
                />
                <Radar
                  name="Perfil Atual"
                  dataKey="A"
                  stroke="#4f46e5"
                  fill="#4f46e5"
                  fillOpacity={0.5}
                  animationDuration={1000}
                  animationEasing="ease-out"
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Legenda */}
          <div className="flex justify-center space-x-6 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-purple-600 mr-2"></div>
              <span className="text-sm text-gray-700">Propósito: {animatedData.purpose}%</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-600 mr-2"></div>
              <span className="text-sm text-gray-700">Corpo: {animatedData.body}%</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-600 mr-2"></div>
              <span className="text-sm text-gray-700">Mente: {animatedData.mind}%</span>
            </div>
          </div>
        </div>
        
        {/* Análise */}
        <div className="w-full md:w-1/2">
          <div className="bg-indigo-50 p-6 rounded-lg mb-6">
            <h4 className="font-semibold text-indigo-900 mb-3">Análise do Perfil</h4>
            <p className="text-gray-700 mb-4">{generateAnalysis()}</p>
            
            <div className="flex items-center text-sm text-gray-600">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
              <span>Pontuação média: <strong>{average}%</strong></span>
            </div>
          </div>
          
          <div className="space-y-4">
            {/* Dimensão mais forte */}
            <div className="bg-gradient-to-r from-indigo-50 to-white p-4 rounded-lg border-l-4 border-indigo-500">
              <h5 className="font-medium flex items-center">
                <span className="mr-2">💪</span>
                <span>Dimensão mais forte:</span>
                <span className={`ml-2 font-bold ${getDimensionColor(strongestDimension)}`}>
                  {getDimensionText(strongestDimension)}
                </span>
              </h5>
              <p className="text-sm text-gray-600 mt-1">
                {strongestDimension === 'purpose' && 'Você demonstra uma conexão sólida com seu propósito e valores.'}
                {strongestDimension === 'body' && 'Você demonstra boa consciência e cuidado com seu corpo físico.'}
                {strongestDimension === 'mind' && 'Você demonstra clareza mental e capacidade cognitiva bem desenvolvida.'}
              </p>
            </div>
            
            {/* Oportunidade de crescimento */}
            <div className="bg-gradient-to-r from-indigo-50 to-white p-4 rounded-lg border-l-4 border-amber-500">
              <h5 className="font-medium flex items-center">
                <span className="mr-2">🚀</span>
                <span>Oportunidade de crescimento:</span>
                <span className={`ml-2 font-bold ${getDimensionColor(weakestDimension)}`}>
                  {getDimensionText(weakestDimension)}
                </span>
              </h5>
              <p className="text-sm text-gray-600 mt-1">
                {weakestDimension === 'purpose' && 'Desenvolver maior clareza de propósito potencializará as demais dimensões.'}
                {weakestDimension === 'body' && 'Maior conexão com seu corpo criará uma base sólida para as demais dimensões.'}
                {weakestDimension === 'mind' && 'Refinar suas capacidades mentais ampliará o impacto das demais dimensões.'}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Call-to-action */}
      <div className="mt-10 text-center">
        <div className="mb-6">
          <p className="text-gray-700 mb-2">Para obter uma análise mais aprofundada e um plano personalizado:</p>
          <button
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md"
          >
            Realizar Avaliação Completa
          </button>
        </div>
        
        <button
          onClick={onRestartQuestionnaire}
          className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
        >
          Refazer Questionário Simplificado
        </button>
      </div>
    </div>
  );
};

export default ProfileVisualization;