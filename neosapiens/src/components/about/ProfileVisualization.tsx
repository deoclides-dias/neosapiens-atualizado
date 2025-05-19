import { useState } from 'react';
import RadarGraph from '../pillars/RadarGraph';

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
  const [showDetails, setShowDetails] = useState(false);
  
  // Determinar dimensão mais forte
  const getStrongestDimension = (): string => {
    const { purpose, body, mind } = data;
    const max = Math.max(purpose, body, mind);
    
    if (max === purpose) return 'purpose';
    if (max === body) return 'body';
    return 'mind';
  };
  
  // Determinar dimensão mais fraca
  const getWeakestDimension = (): string => {
    const { purpose, body, mind } = data;
    const min = Math.min(purpose, body, mind);
    
    if (min === purpose) return 'purpose';
    if (min === body) return 'body';
    return 'mind';
  };
  
  // Calcular diferença média entre dimensões
  const calculateImbalance = (): number => {
    const { purpose, body, mind } = data;
    const avg = (purpose + body + mind) / 3;
    
    const purposeDiff = Math.abs(purpose - avg);
    const bodyDiff = Math.abs(body - avg);
    const mindDiff = Math.abs(mind - avg);
    
    return Math.round((purposeDiff + bodyDiff + mindDiff) / 3);
  };
  
  // Retornar mensagem interpretativa baseada no perfil
  const getProfileInterpretation = (): string => {
    const strongest = getStrongestDimension();
    const weakest = getWeakestDimension();
    const imbalance = calculateImbalance();
    
    // Perfil com baixo desequilíbrio (equilibrado)
    if (imbalance < 10) {
      return "Seu perfil demonstra um equilíbrio notável entre as três dimensões, o que é raro e valioso. Esta harmonia sugere uma boa integração entre propósito, corpo e mente, criando uma base sólida para seu desenvolvimento. Seu Plano de Voo focará em manter este equilíbrio enquanto eleva progressivamente todas as dimensões.";
    }
    
    // Perfil com alto desequilíbrio
    if (imbalance > 25) {
      const strongestName = strongest === 'purpose' ? 'Propósito' : strongest === 'body' ? 'Corpo' : 'Mente';
      const weakestName = weakest === 'purpose' ? 'Propósito' : weakest === 'body' ? 'Corpo' : 'Mente';
      
      return `Seu perfil revela um significativo desequilíbrio entre as dimensões, com ${strongestName} substancialmente mais desenvolvido que ${weakestName}. Este padrão sugere que você pode estar experimentando alguns desafios de integração. Seu Plano de Voo focará em fortalecer sua dimensão ${weakestName} enquanto estabelece pontes com sua dimensão ${strongestName}, ajudando a criar um desenvolvimento mais harmônico.`;
    }
    
    // Perfil com desequilíbrio moderado
    const strongestName = strongest === 'purpose' ? 'Propósito' : strongest === 'body' ? 'Corpo' : 'Mente';
    const weakestName = weakest === 'purpose' ? 'Propósito' : weakest === 'body' ? 'Corpo' : 'Mente';
    
    return `Seu perfil mostra que a dimensão ${strongestName} é seu ponto forte atual, enquanto a dimensão ${weakestName} apresenta oportunidades de desenvolvimento. Este padrão é comum e sugere que seu Plano de Voo inicial poderia focar em fortalecer a dimensão ${weakestName} enquanto aproveita a força da dimensão ${strongestName} como alavanca.`;
  };
  
  // Gerar recomendações iniciais com base no perfil
  const getInitialRecommendations = (): {title: string, description: string}[] => {
    const weakest = getWeakestDimension();
    
    const recommendations = [
      {
        title: "Avaliação Tridimensional Completa",
        description: "Realize o questionário completo com 42 perguntas para um mapeamento detalhado do seu perfil, revelando subcategorias e padrões mais específicos."
      }
    ];
    
    // Adicionar recomendação específica para dimensão mais fraca
    if (weakest === 'purpose') {
      recommendations.push({
        title: "Reflexão de Valores",
        description: "Reserve 15 minutos diários para um exercício estruturado de identificação e priorização de valores pessoais, conectando-os com atividades cotidianas."
      });
    } else if (weakest === 'body') {
      recommendations.push({
        title: "Ritual de Conexão Corporal",
        description: "Implemente um breve ritual matinal de 10 minutos combinando respiração consciente e micromoventos para despertar a inteligência corporal."
      });
    } else {
      recommendations.push({
        title: "Prática de Foco Singular",
        description: "Desenvolva uma prática diária de atenção focada de 12 minutos, alternando entre concentração em objeto único e consciência aberta."
      });
    }
    
    return recommendations;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-indigo-900 mb-3">
          Seu Perfil Tridimensional Inicial
        </h3>
        
        <p className="text-gray-700 max-w-3xl mx-auto">
          Esta visualização representa um primeiro mapeamento do seu equilíbrio atual entre as três dimensões. 
          Lembre-se que este é apenas um perfil inicial baseado em 6 perguntas - a avaliação completa oferece 
          um mapeamento muito mais detalhado com 42 perguntas.
        </p>
      </div>
      
      {/* Visualização do Gráfico Radar */}
      <div className="max-w-md mx-auto mb-8">
        <RadarGraph data={data} />
      </div>
      
      {/* Interpretação do Perfil */}
      <div className="mb-8">
        <h4 className="text-xl font-semibold text-indigo-800 mb-4 text-center">
          Interpretação do Seu Perfil
        </h4>
        
        <div className="bg-indigo-50 p-5 rounded-lg">
          <p className="text-gray-800">
            {getProfileInterpretation()}
          </p>
          
          {!showDetails && (
            <button
              onClick={() => setShowDetails(true)}
              className="text-indigo-600 font-medium mt-4 hover:text-indigo-800 transition-colors duration-200"
            >
              Ver análise detalhada
            </button>
          )}
        </div>
      </div>
      
      {/* Análise Detalhada (condicional) */}
      {showDetails && (
        <div className="mb-8 animate-fade-in">
          <h4 className="text-xl font-semibold text-indigo-800 mb-4 text-center">
            Análise Detalhada
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <DetailCard
              title="Propósito"
              value={data.purpose}
              color="bg-purple-100 text-purple-800"
              description={data.purpose > 70 
                ? "Forte conexão com significado e valores" 
                : data.purpose > 40 
                  ? "Conexão moderada com propósito" 
                  : "Oportunidade para fortalecer propósito"
              }
            />
            
            <DetailCard
              title="Corpo"
              value={data.body}
              color="bg-green-100 text-green-800"
              description={data.body > 70 
                ? "Alta vitalidade e conexão corporal" 
                : data.body > 40 
                  ? "Vitalidade e conexão moderadas" 
                  : "Oportunidade para fortalecer vitalidade"
              }
            />
            
            <DetailCard
              title="Mente"
              value={data.mind}
              color="bg-blue-100 text-blue-800"
              description={data.mind > 70 
                ? "Forte clareza e capacidade cognitiva" 
                : data.mind > 40 
                  ? "Clareza e cognição moderadas" 
                  : "Oportunidade para fortalecer clareza mental"
              }
            />
          </div>
          
          <div className="bg-gray-50 p-5 rounded-lg mb-4">
            <h5 className="font-medium text-gray-800 mb-2">Análise de Equilíbrio</h5>
            <p className="text-gray-700">
              Seu perfil mostra um desequilíbrio de aproximadamente {calculateImbalance()}% entre as dimensões. 
              {calculateImbalance() < 10 
                ? " Este é um nível de equilíbrio excepcional." 
                : calculateImbalance() < 20 
                  ? " Este é um nível de equilíbrio satisfatório." 
                  : " Este desequilíbrio pode ser harmonizado com práticas específicas."
              }
            </p>
          </div>
          
          <div className="bg-gray-50 p-5 rounded-lg">
            <h5 className="font-medium text-gray-800 mb-2">Dimensão Âncora</h5>
            <p className="text-gray-700">
              Sua dimensão mais forte é {getStrongestDimension() === 'purpose' 
                ? "Propósito" 
                : getStrongestDimension() === 'body' 
                  ? "Corpo" 
                  : "Mente"
              }, que pode servir como ponto de apoio para desenvolver as outras dimensões. 
              No NeoSapiens, usamos suas forças para potencializar áreas com mais oportunidade de desenvolvimento.
            </p>
          </div>
        </div>
      )}
      
      {/* Próximos Passos Recomendados */}
      <div className="mb-8">
        <h4 className="text-xl font-semibold text-indigo-800 mb-4 text-center">
          Próximos Passos Recomendados
        </h4>
        
        <div className="space-y-4">
          {getInitialRecommendations().map((recommendation, index) => (
            <div key={index} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
              <h5 className="font-medium text-indigo-800 mb-2">{recommendation.title}</h5>
              <p className="text-gray-700">{recommendation.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Botões de Ação */}
      <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
        <button
          onClick={onRestartQuestionnaire}
          className="px-6 py-3 bg-white border-2 border-indigo-600 text-indigo-600 rounded-full font-medium hover:bg-indigo-50 transition-all duration-300"
        >
          Refazer Questionário
        </button>
        
        <button
          onClick={() => {
            document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md"
        >
          Obter Plano de Voo Completo
        </button>
      </div>
    </div>
  );
};

// Componente para exibir detalhes de cada dimensão
const DetailCard = ({ title, value, color, description }: {
  title: string;
  value: number;
  color: string;
  description: string;
}) => (
  <div className={`p-4 rounded-lg ${color}`}>
    <div className="flex justify-between items-center mb-2">
      <h5 className="font-medium">{title}</h5>
      <span className="text-lg font-bold">{value}%</span>
    </div>
    <div className="w-full bg-white bg-opacity-50 rounded-full h-2.5 mb-2">
      <div 
        className="h-2.5 rounded-full" 
        style={{ 
          width: `${value}%`,
          backgroundColor: color.includes('purple') 
            ? '#9333ea' 
            : color.includes('green') 
              ? '#22c55e' 
              : '#3b82f6'
        }}
      ></div>
    </div>
    <p className="text-sm">{description}</p>
  </div>
);

export default ProfileVisualization;