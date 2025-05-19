import React, { useState } from 'react';

// Tipos para o Plano de Voo
type Dimension = 'purpose' | 'body' | 'mind' | 'integration';

type Practice = {
  id: string;
  title: string;
  description: string;
  dimension: Dimension;
  duration: number; // em minutos
  frequency: 'diária' | 'semanal' | 'ocasional';
  icon: React.ReactNode;
};

type Day = {
  dayNumber: number;
  theme?: string;
  practices: Practice[];
};

type FlightPlan = {
  id: string;
  title: string;
  description: string;
  totalDays: number;
  days: Day[];
  focusAreas: {
    dimension: Dimension;
    percentage: number;
  }[];
};

// Ícones para as práticas
const MeditationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

const JournalIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
  </svg>
);

const BreathIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
  </svg>
);

const MoveIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
  </svg>
);

const ValuesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
  </svg>
);

const IntentionIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>
);

// Dados de exemplo - Plano de Voo de 7 dias
const SAMPLE_FLIGHT_PLAN: FlightPlan = {
  id: 'fp-initial-7day',
  title: 'Plano de Voo Inicial',
  description: 'Sete dias para despertar seu potencial tridimensional através de práticas simples e poderosas.',
  totalDays: 7,
  focusAreas: [
    { dimension: 'purpose', percentage: 40 },
    { dimension: 'body', percentage: 30 },
    { dimension: 'mind', percentage: 30 }
  ],
  days: [
    {
      dayNumber: 1,
      theme: 'Despertar',
      practices: [
        {
          id: 'morning-intention',
          title: 'Intenção Matinal',
          description: 'Defina uma intenção clara para o dia logo ao acordar, conectando-a com seu propósito maior.',
          dimension: 'purpose',
          duration: 5,
          frequency: 'diária',
          icon: <IntentionIcon />
        },
        {
          id: 'conscious-breathing',
          title: 'Respiração Consciente',
          description: 'Três ciclos de respiração 4-7-8 (inspire por 4, retenha por 7, expire por 8) para regular o sistema nervoso.',
          dimension: 'body',
          duration: 3,
          frequency: 'diária',
          icon: <BreathIcon />
        }
      ]
    },
    {
      dayNumber: 2,
      theme: 'Observação',
      practices: [
        {
          id: 'body-scan',
          title: 'Escaneamento Corporal',
          description: 'Percorra seu corpo dos pés à cabeça, notando sensações sem julgamento.',
          dimension: 'body',
          duration: 10,
          frequency: 'diária',
          icon: <MoveIcon />
        },
        {
          id: 'values-reflection',
          title: 'Reflexão de Valores',
          description: 'Identifique três valores fundamentais que guiam suas decisões e ações.',
          dimension: 'purpose',
          duration: 15,
          frequency: 'semanal',
          icon: <ValuesIcon />
        }
      ]
    },
    {
      dayNumber: 3,
      theme: 'Clareza',
      practices: [
        {
          id: 'mind-clearing',
          title: 'Esvaziamento Mental',
          description: 'Registre todos os seus pensamentos e preocupações sem filtro para liberar espaço mental.',
          dimension: 'mind',
          duration: 10,
          frequency: 'semanal',
          icon: <JournalIcon />
        },
        {
          id: 'mindful-walk',
          title: 'Caminhada Consciente',
          description: 'Caminhe por 10 minutos prestando atenção plena a cada passo e aos sentidos.',
          dimension: 'integration',
          duration: 10,
          frequency: 'diária',
          icon: <MoveIcon />
        }
      ]
    },
    {
      dayNumber: 4,
      theme: 'Integração',
      practices: [
        {
          id: 'purpose-journal',
          title: 'Diário de Propósito',
          description: 'Responda à pergunta: "Em que momentos me senti mais vivo e alinhado esta semana?"',
          dimension: 'purpose',
          duration: 10,
          frequency: 'semanal',
          icon: <JournalIcon />
        },
        {
          id: 'meditation-basic',
          title: 'Meditação Básica',
          description: 'Sente-se em silêncio, focando na respiração por 5 minutos.',
          dimension: 'mind',
          duration: 5,
          frequency: 'diária',
          icon: <MeditationIcon />
        }
      ]
    },
    {
      dayNumber: 5,
      theme: 'Energia',
      practices: [
        {
          id: 'energy-moves',
          title: 'Movimentos Energéticos',
          description: 'Série de 7 movimentos simples para ativar os principais centros energéticos do corpo.',
          dimension: 'body',
          duration: 7,
          frequency: 'diária',
          icon: <MoveIcon />
        },
        {
          id: 'gratitude-practice',
          title: 'Prática de Gratidão',
          description: 'Identifique três coisas específicas pelas quais você é grato hoje.',
          dimension: 'purpose',
          duration: 5,
          frequency: 'diária',
          icon: <JournalIcon />
        }
      ]
    },
    {
      dayNumber: 6,
      theme: 'Criatividade',
      practices: [
        {
          id: 'intuitive-writing',
          title: 'Escrita Intuitiva',
          description: 'Escreva por 10 minutos sem parar ou editar, começando com "O que eu realmente quero é..."',
          dimension: 'mind',
          duration: 10,
          frequency: 'semanal',
          icon: <JournalIcon />
        },
        {
          id: 'breath-visualization',
          title: 'Respiração com Visualização',
          description: 'Respire profundamente visualizando energia entrando e saindo do corpo.',
          dimension: 'integration',
          duration: 5,
          frequency: 'diária',
          icon: <BreathIcon />
        }
      ]
    },
    {
      dayNumber: 7,
      theme: 'Reflexão',
      practices: [
        {
          id: 'weekly-review',
          title: 'Revisão Semanal',
          description: 'Revise suas experiências da semana, notando padrões, desafios e insights.',
          dimension: 'integration',
          duration: 15,
          frequency: 'semanal',
          icon: <JournalIcon />
        },
        {
          id: 'intention-reset',
          title: 'Redefinição de Intenção',
          description: 'Defina uma intenção consciente para a próxima semana, baseada no que aprendeu.',
          dimension: 'purpose',
          duration: 10,
          frequency: 'semanal',
          icon: <IntentionIcon />
        }
      ]
    }
  ]
};

// Função auxiliar para cor da dimensão
const getDimensionColor = (dimension: Dimension): string => {
  switch (dimension) {
    case 'purpose':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'body':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'mind':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'integration':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

// Função auxiliar para ícone da dimensão
const getDimensionIcon = (dimension: Dimension): string => {
  switch (dimension) {
    case 'purpose':
      return '🧭';
    case 'body':
      return '🧬';
    case 'mind':
      return '📚';
    case 'integration':
      return '⚡';
    default:
      return '✨';
  }
};

const FlightPlanSection: React.FC = () => {
  const flightPlan = SAMPLE_FLIGHT_PLAN;
  const [activeDay, setActiveDay] = useState(1);
  
  return (
    <section id="plano-de-voo" className="py-20 bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            Seu Plano de Voo Personalizado
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Um roteiro de 7 dias com práticas específicas para iniciar sua jornada tridimensional
          </p>
        </div>
        
        {/* Visão geral do plano */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-12">
          <div className="p-6 md:p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">{flightPlan.title}</h3>
            <p className="text-gray-600 mb-8">{flightPlan.description}</p>
            
            {/* Áreas de foco */}
            <div className="mb-8">
              <h4 className="text-lg font-medium text-gray-700 mb-4">Distribuição de Foco</h4>
              <div className="flex flex-wrap gap-4">
                {flightPlan.focusAreas.map(area => (
                  <div key={area.dimension} className="flex-1 min-w-[120px]">
                    <div className="flex items-center mb-2">
                      <span className="mr-2">{getDimensionIcon(area.dimension)}</span>
                      <span className="font-medium capitalize">
                        {area.dimension === 'purpose' ? 'Propósito' : 
                         area.dimension === 'body' ? 'Corpo' : 
                         area.dimension === 'mind' ? 'Mente' : 'Integração'}
                      </span>
                      <span className="ml-auto">{area.percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          area.dimension === 'purpose' ? 'bg-purple-600' : 
                          area.dimension === 'body' ? 'bg-green-500' : 
                          area.dimension === 'mind' ? 'bg-blue-500' : 'bg-indigo-500'
                        }`}
                        style={{ width: `${area.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Seleção de dia */}
            <div className="mb-8">
              <h4 className="text-lg font-medium text-gray-700 mb-4">Selecione um Dia</h4>
              <div className="flex overflow-x-auto pb-2 gap-2">
                {flightPlan.days.map(day => (
                  <button
                    key={day.dayNumber}
                    onClick={() => setActiveDay(day.dayNumber)}
                    className={`min-w-[100px] p-3 rounded-lg border-2 transition-colors focus:outline-none ${
                      activeDay === day.dayNumber
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 hover:border-indigo-200'
                    }`}
                  >
                    <div className="font-bold mb-1">Dia {day.dayNumber}</div>
                    {day.theme && (
                      <div className="text-xs text-gray-600">{day.theme}</div>
                    )}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Práticas do dia selecionado */}
            <div>
              <h4 className="text-lg font-medium text-gray-700 mb-4">Práticas do Dia {activeDay}</h4>
              <div className="space-y-4">
                {flightPlan.days
                  .find(day => day.dayNumber === activeDay)?.practices
                  .map(practice => (
                    <div 
                      key={practice.id} 
                      className={`p-4 rounded-lg border ${getDimensionColor(practice.dimension)}`}
                    >
                      <div className="flex items-start">
                        <div className="p-2 rounded-md bg-white mr-4">
                          {practice.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center mb-1">
                            <h5 className="font-medium">{practice.title}</h5>
                            <div className="ml-auto flex items-center">
                              <span className="text-sm text-gray-600 mr-2">{practice.duration} min</span>
                              <span className="text-xs px-2 py-1 rounded-full bg-white border border-current">
                                {practice.frequency}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm">{practice.description}</p>
                        </div>
                      </div>
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA */}
        <div className="text-center">
          <button className="bg-indigo-600 text-white py-3 px-8 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50">
            Obter Plano de Voo Completo
          </button>
          <p className="mt-4 text-sm text-gray-600">
            O plano de voo completo inclui 30 dias de práticas e orientações específicas para seu perfil.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FlightPlanSection;