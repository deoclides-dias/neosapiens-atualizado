import React, { useState, useEffect, useCallback } from 'react';
import JourneyInfographic from './JourneyInfographic';

// Removi a importação inválida

const JourneySection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isAutoplaying, setIsAutoplaying] = useState(true);
  const [isInView, setIsInView] = useState(false);
  
  // Total de etapas na jornada
  const totalSteps = 5;

  // Função para avançar para a próxima etapa
  const goToNextStep = useCallback(() => {
    setActiveStep((prev) => (prev === totalSteps - 1 ? 0 : prev + 1));
  }, [totalSteps]);

  // Observador de interseção para detectar quando a seção fica visível
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Se o componente está visível na tela
        if (entries[0].isIntersecting) {
          setIsInView(true);
        } else {
          setIsInView(false);
        }
      },
      { threshold: 0.3 } // Ativa quando pelo menos 30% do elemento está visível
    );
    
    // Elemento a ser observado
    const section = document.getElementById('jornada');
    if (section) {
      observer.observe(section);
    }
    
    return () => {
      if (section) {
        observer.unobserve(section);
      }
    };
  }, []);

  // Efeito para autoplay
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    
    // Só ative o autoplay se estiver no modo autoplay E o componente estiver visível
    if (isAutoplaying && isInView) {
      interval = setInterval(() => {
        goToNextStep();
      }, 3500); // Muda a cada 3.5 segundos
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isAutoplaying, isInView, goToNextStep]);

  // Manipulador de clique em etapa
  const handleStepClick = (index: number) => {
    setActiveStep(index);
    setIsAutoplaying(false); // Desativa autoplay quando o usuário interage
  };

  // Reiniciar autoplay
  const handleRestartAutoplay = () => {
    setActiveStep(0);
    setIsAutoplaying(true);
  };
  
  return (
    <section id="jornada" className="py-20 bg-gradient-to-b from-indigo-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 animate-on-scroll">
            A Jornada NeoSapiens
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-on-scroll">
            Um caminho estruturado para despertar seu potencial nas três dimensões fundamentais
          </p>
        </div>
        
        {/* Indicador de auto-play */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center bg-white rounded-full px-4 py-2 shadow-sm">
            <span className="text-sm text-gray-600 mr-3">
              {isAutoplaying ? "Apresentação automática" : "Exploração manual"}
            </span>
            <button 
              onClick={() => setIsAutoplaying(!isAutoplaying)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${isAutoplaying ? 'bg-indigo-600' : 'bg-gray-300'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isAutoplaying ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
            {!isAutoplaying && (
              <button 
                onClick={handleRestartAutoplay}
                className="ml-4 text-xs text-indigo-600 hover:text-indigo-800 underline"
              >
                Reiniciar
              </button>
            )}
          </div>
        </div>
        
        {/* Barra de progresso */}
        {isAutoplaying && (
          <div className="max-w-3xl mx-auto mb-8 bg-gray-200 h-1 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-600 transition-all duration-300"
              style={{ 
                width: `${(activeStep / (totalSteps - 1)) * 100}%`,
                transition: 'width 3.5s linear' 
              }}
            />
          </div>
        )}
        
        <JourneyInfographic 
          activeIndex={activeStep}
          onSelectStep={handleStepClick}
        />
        
        {/* Navegação manual */}
        <div className="flex justify-center mt-12 space-x-2">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <button
              key={index}
              onClick={() => handleStepClick(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                activeStep === index 
                  ? 'bg-indigo-600 w-5' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Ver etapa ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default JourneySection;