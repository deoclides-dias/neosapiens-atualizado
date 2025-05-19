import React, { useState, useEffect } from 'react';
import MiniQuestionnaire from './MiniQuestionnaire';
import ProfileVisualization from './ProfileVisualization';

const QuestionnaireSection = () => {
  const [profileData, setProfileData] = useState<null | {
    purpose: number;
    body: number;
    mind: number;
  }>(null);
  
  const [showingResults, setShowingResults] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handleQuestionnaireSubmit = (data: { purpose: number; body: number; mind: number }) => {
    setProfileData(data);
    setIsAnimating(true);
    
    // Pequena pausa para permitir animação
    setTimeout(() => {
      setShowingResults(true);
      setIsAnimating(false);
      
      // Rolar para visualização dos resultados
      setTimeout(() => {
        document.getElementById('profile-results')?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 100);
    }, 500);
  };
  
  const handleRestartQuestionnaire = () => {
    setIsAnimating(true);
    
    // Pequena pausa para permitir animação
    setTimeout(() => {
      setShowingResults(false);
      setProfileData(null);
      setIsAnimating(false);
      
      // Rolar de volta para o início do questionário
      document.getElementById('questionario')?.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }, 300);
  };

  return (
    <section id="questionario" className="py-20 bg-gradient-to-b from-white to-indigo-50">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-indigo-900">
            Descubra seu Perfil Tridimensional
          </h2>
          
          <p className="text-lg text-gray-700 mb-6">
            Responda ao mini-questionário abaixo para obter uma visualização inicial do seu equilíbrio nas três dimensões fundamentais.
          </p>
          
          <div className="flex justify-center space-x-6 mb-8">
            <div className="flex items-center">
              <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-xl mr-2">
                🧭
              </span>
              <span className="text-purple-800 font-medium">Propósito</span>
            </div>
            
            <div className="flex items-center">
              <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-xl mr-2">
                🧬
              </span>
              <span className="text-green-800 font-medium">Corpo</span>
            </div>
            
            <div className="flex items-center">
              <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-xl mr-2">
                📚
              </span>
              <span className="text-blue-800 font-medium">Mente</span>
            </div>
          </div>
        </div>
        
        <div className={`transition-opacity duration-500 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
          {!showingResults ? (
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
                <div className="flex items-start mb-4">
                  <div className="bg-indigo-100 p-2 rounded-full mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800 mb-1">Sobre o Questionário</h3>
                    <p className="text-gray-600 text-sm">
                      Este é um questionário simplificado com 6 perguntas (2 por dimensão). 
                      Para cada pergunta, selecione um valor de 1 a 5 que melhor representa 
                      como você se sente em relação a cada afirmação.
                    </p>
                  </div>
                </div>
              </div>
              
              <MiniQuestionnaire onSubmit={handleQuestionnaireSubmit} />
              
              <div className="mt-8 text-center text-sm text-gray-500">
                <p>Suas respostas são confidenciais e são usadas apenas para gerar seu perfil.</p>
              </div>
            </div>
          ) : (
            <div id="profile-results" className="max-w-5xl mx-auto scroll-mt-20">
              {profileData && (
                <ProfileVisualization 
                  data={profileData} 
                  onRestartQuestionnaire={handleRestartQuestionnaire} 
                />
              )}
              
              <div className="mt-16 max-w-3xl mx-auto">
                <div className="bg-white rounded-xl p-8 shadow-lg">
                  <h3 className="text-xl font-bold text-indigo-900 mb-4">
                    O que vem a seguir?
                  </h3>
                  
                  <p className="text-gray-700 mb-6">
                    Esta é apenas uma prévia do potencial da abordagem NeoSapiens. Para uma jornada completa e personalizada:
                  </p>
                  
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="bg-indigo-100 rounded-full p-2 mr-4 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">Questionário Tridimensional Completo</h4>
                        <p className="text-gray-600 text-sm">
                          Realize a avaliação completa com 42 questões para um mapeamento detalhado das suas três dimensões e suas subdimensões.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-indigo-100 rounded-full p-2 mr-4 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">Plano de Voo Personalizado</h4>
                        <p className="text-gray-600 text-sm">
                          Receba um roteiro personalizado com práticas específicas para equilibrar e potencializar suas três dimensões.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="bg-indigo-100 rounded-full p-2 mr-4 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800 mb-1">Comunidade NeoSapiens</h4>
                        <p className="text-gray-600 text-sm">
                          Conecte-se com outros Neo-Navegantes que compartilham valores e aspirações semelhantes, ampliando seu desenvolvimento.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 text-center">
                    <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md">
                      Iniciar minha Jornada Completa
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default QuestionnaireSection;