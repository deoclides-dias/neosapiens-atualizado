import React from 'react';

type JourneyStep = {
  id: string;
  title: string;
  icon: React.ReactNode;
  description: string;
  details: string;
};

type JourneyInfographicProps = {
  steps?: JourneyStep[]; // Tornei opcional adicionando o '?'
  activeIndex: number;
  onSelectStep: (index: number) => void;
};

// Ícones SVG inline
const MapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z" />
  </svg>
);

const ChartRadarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
  </svg>
);

const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
  </svg>
);

const UserGroupIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
  </svg>
);

const ArrowPathIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);

// Definição dos passos padrão com os ícones SVG inline
const DEFAULT_STEPS: JourneyStep[] = [
  {
    id: 'mapeamento',
    title: 'Mapeamento',
    icon: <MapIcon />,
    description: 'Questionário Tridimensional e visualização do perfil atual',
    details: 'Descubra como estão suas três dimensões através de uma avaliação personalizada.'
  },
  {
    id: 'plano-de-voo',
    title: 'Plano de Voo',
    icon: <ChartRadarIcon />,
    description: 'Roteiro personalizado com práticas específicas',
    details: 'Receba recomendações adaptadas ao seu perfil único.'
  },
  {
    id: 'pratica',
    title: 'Prática Diária',
    icon: <SparklesIcon />,
    description: 'Implementação guiada com recursos de suporte',
    details: 'Transforme conhecimento em experiência através de práticas consistentes.'
  },
  {
    id: 'comunidade',
    title: 'Comunidade',
    icon: <UserGroupIcon />,
    description: 'Conexão com outros Neo-Navegantes',
    details: 'Compartilhe sua jornada com pessoas que compartilham valores semelhantes.'
  },
  {
    id: 'evolucao',
    title: 'Evolução',
    icon: <ArrowPathIcon />,
    description: 'Reavaliações periódicas e recalibração do plano',
    details: 'Monitore seu progresso ao longo do tempo e ajuste seu plano de voo.'
  }
];

const JourneyInfographic: React.FC<JourneyInfographicProps> = ({ 
  steps = DEFAULT_STEPS, 
  activeIndex,
  onSelectStep
}) => {
  return (
    <div className="relative py-10">
      {/* Linha de conexão principal */}
      <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 transform -translate-y-1/2 z-0"></div>
      
      {/* Linha de progresso que se expande conforme o usuário avança */}
      <div 
        className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-purple-600 to-indigo-600 transform -translate-y-1/2 z-0 transition-all duration-500 ease-out"
        style={{ width: `${(activeIndex / (steps.length - 1)) * 100}%` }}
      ></div>
      
      {/* Etapas */}
      <div className="relative flex justify-between">
        {steps.map((step, index) => (
          <div 
            key={step.id}
            className="relative z-10 transition-transform duration-300"
            style={{
              transform: activeIndex === index ? 'scale(1.05)' : 'scale(1)'
            }}
          >
            {/* Círculo da etapa */}
            <button
              onClick={() => onSelectStep(index)}
              className={`
                w-16 h-16 rounded-full flex items-center justify-center shadow
                transition-all duration-300 ease-out
                ${index <= activeIndex 
                  ? 'bg-gradient-to-br from-purple-600 to-indigo-600' 
                  : 'bg-white border-2 border-gray-300'
                }
              `}
              aria-label={`Selecionar etapa ${index + 1}: ${step.title}`}
            >
              <div className={`${index <= activeIndex ? 'text-white' : 'text-gray-500'}`}>
                {step.icon}
              </div>
            </button>
            
            {/* Número da etapa */}
            <div 
              className={`
                absolute -top-2 -right-2 w-6 h-6 rounded-full 
                flex items-center justify-center text-xs font-bold
                ${index <= activeIndex 
                  ? 'bg-indigo-800 text-white' 
                  : 'bg-gray-200 text-gray-600'
                }
              `}
            >
              {index + 1}
            </div>
            
            {/* Título da etapa */}
            <p 
              className={`
                text-center mt-4 font-medium transition-colors duration-300
                ${index === activeIndex 
                  ? 'text-indigo-800' 
                  : index < activeIndex 
                    ? 'text-indigo-600' 
                    : 'text-gray-500'
                }
              `}
            >
              {step.title}
            </p>
            
            {/* Posicionar descrições alternadamente acima e abaixo para evitar sobreposição */}
            {index === activeIndex && (
              <div 
                className={`
                  absolute w-48 bg-white p-3 rounded-lg shadow-md text-center
                  transition-all duration-300 ease-out
                  ${index % 2 === 0 ? 'bottom-full mb-4' : 'top-full mt-4'}
                  left-1/2 transform -translate-x-1/2
                `}
              >
                <p className="text-sm text-gray-700">{step.description}</p>
                <div 
                  className={`
                    absolute left-1/2 w-3 h-3 bg-white transform rotate-45 -translate-x-1/2
                    ${index % 2 === 0 ? 'bottom-[-6px]' : 'top-[-6px]'}
                  `}
                ></div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default JourneyInfographic;