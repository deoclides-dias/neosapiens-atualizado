// Primeira parte do MethodologySection.tsx
import { useState } from 'react';
import IntegrationVisual from './IntegrationVisual';

const MethodologySection = () => {
  // Estado para controlar a etapa da metodologia que está sendo visualizada
  const [activeStep, setActiveStep] = useState(0); // 0, 1, 2 para os três passos
  
  // Textos explicativos para cada etapa
  const stepDescriptions = [
    {
      title: "Mapeamento",
      description: "Nesta primeira etapa, criamos consciência sobre o estado atual de cada dimensão e suas interrelações. Através do Questionário Tridimensional e ferramentas avançadas de visualização, revelamos seu perfil único, identificando sua 'Dimensão Âncora', pontos de tensão e oportunidades de desenvolvimento sinérgico.",
      details: [
        "Perfil detalhado nas três dimensões",
        "Identificação da Dimensão Âncora",
        "Revelação de pontos de tensão interdimensional",
        "Mapeamento de oportunidades de desenvolvimento"
      ],
      color: "purple"
    },
    {
      title: "Harmonização",
      description: "Na segunda etapa, estabelecemos fluxo coerente entre as dimensões através de práticas específicas. Este processo envolve conectar aspectos diferentes do seu ser que antes operavam de forma independente, resolver conflitos interdimensionais e calibrar os ritmos naturais de cada dimensão.",
      details: [
        "Práticas-ponte que conectam diferentes dimensões",
        "Resolução de conflitos interdimensionais",
        "Calibração dos ritmos naturais",
        "Rituais de integração personalizados"
      ],
      color: "green"
    },
    {
      title: "Potencialização",
      description: "Finalmente, amplificamos cada dimensão através da energia das outras. Esta etapa ativa ciclos virtuosos onde o desenvolvimento em uma área catalisa avanços nas demais, criando um efeito sinérgico que expande simultaneamente todas as dimensões do seu ser.",
      details: [
        "Ativação de ciclos virtuosos entre dimensões",
        "Desenvolvimento de habilidades de transferência energética",
        "Criação de estados de fluxo tridimensional",
        "Expansão simultânea das três dimensões"
      ],
      color: "blue"
    }
  ];
  // Segunda parte do MethodologySection.tsx
  return (
    <section id="metodologia" className="py-20 bg-indigo-50 animate-on-scroll">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-6">
            Integração é o segredo
          </h2>
          
          <p className="text-gray-700 text-lg leading-relaxed">
            O diferencial do NeoSapiens está em sua metodologia de integração das três dimensões, criando um efeito sinérgico onde o desenvolvimento de uma dimensão potencializa as outras.
          </p>
        </div>
        
        {/* Visualização do Processo de Integração */}
        <div className="max-w-4xl mx-auto mb-20">
          <IntegrationVisual />
        </div>
        
        {/* Título de Seção dos Passos Metodológicos */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h3 className="text-2xl md:text-3xl font-bold text-indigo-800">
            Os Três Movimentos do Processo
          </h3>
          <p className="text-gray-700 mt-2">
            A metodologia NeoSapiens ocorre em três movimentos principais, cada um com propósito específico
          </p>
        </div>
        
        {/* Passos da Metodologia - Navegação por Tabs */}
        <div className="max-w-4xl mx-auto mb-16">
          {/* Tabs de Navegação */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex bg-white rounded-full p-1 shadow">
              {stepDescriptions.map((step, index) => (
                <button
                  key={index}
                  onClick={() => setActiveStep(index)}
                  className={`relative px-6 py-3 text-sm font-medium rounded-full transition-all duration-300 ${
                    activeStep === index
                      ? `bg-gradient-to-r ${
                          step.color === "purple" 
                            ? "from-purple-600 to-purple-700" 
                            : step.color === "green" 
                            ? "from-green-600 to-green-700" 
                            : "from-blue-600 to-blue-700"
                        } text-white shadow-sm`
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <span className="mr-2">{String(index + 1).padStart(2, '0')}</span>
                  {step.title}
                  
                  {/* Linha conectora entre etapas */}
                  {index < stepDescriptions.length - 1 && (
                    <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-0.5 bg-gray-200 z-0"></div>
                  )}
                </button>
              ))}
            </div>
          </div>
                    
          {/* Conteúdo da etapa ativa */}
          <div 
            className="bg-white rounded-xl shadow-lg p-8 transition-all duration-500"
            style={{ 
              background: activeStep === 0 
                ? 'linear-gradient(to right bottom, #f5f3ff, #ffffff)' 
                : activeStep === 1 
                ? 'linear-gradient(to right bottom, #ecfdf5, #ffffff)' 
                : 'linear-gradient(to right bottom, #eff6ff, #ffffff)' 
            }}
          >
            <div className="flex flex-col md:flex-row md:items-start mb-8">
              <div className="md:w-1/4 mb-6 md:mb-0 flex justify-center">
                <div 
                  className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg transform transition-transform duration-500 ${
                    activeStep === 0 
                      ? 'bg-purple-100 text-purple-700' 
                      : activeStep === 1 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {activeStep === 0 && (
                    <svg viewBox="0 0 24 24" className="w-12 h-12" fill="currentColor">
                      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z" />
                    </svg>
                  )}
                  
                  {activeStep === 1 && (
                    <svg viewBox="0 0 24 24" className="w-12 h-12" fill="currentColor">
                      <path d="M12 2c-5.33 4-8 8.6-8 12 0 4.42 3.58 8 8 8s8-3.58 8-8c0-3.4-2.67-8-8-12zm0 18c-3.31 0-6-2.69-6-6 0-1 0-3 6-9 6 6 6 8 6 9 0 3.31-2.69 6-6 6z" />
                    </svg>
                  )}
                  
                  {activeStep === 2 && (
                    <svg viewBox="0 0 24 24" className="w-12 h-12" fill="currentColor">
                      <path d="M11 21V6.83l-1.59 1.58L8 7l4-4 4 4-1.41 1.41L13 6.83V9c0 4.97 4.03 9 9 9v2c-6.07 0-11-4.93-11-11z" />
                    </svg>
                  )}
                </div>
              </div>
              
              <div className="md:w-3/4 md:pl-8">
                <h3 
                  className={`text-2xl font-bold mb-4 ${
                    activeStep === 0 
                      ? 'text-purple-800' 
                      : activeStep === 1 
                      ? 'text-green-800' 
                      : 'text-blue-800'
                  }`}
                >
                  {String(activeStep + 1).padStart(2, '0')}. {stepDescriptions[activeStep].title}
                </h3>
                
                <p className="text-gray-700 mb-6">{stepDescriptions[activeStep].description}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {stepDescriptions[activeStep].details.map((detail, index) => (
                    <div 
                      key={index} 
                      className="flex items-start space-x-2"
                    >
                      <div 
                        className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5 text-white text-xs ${
                          activeStep === 0 
                            ? 'bg-purple-600' 
                            : activeStep === 1 
                            ? 'bg-green-600' 
                            : 'bg-blue-600'
                        }`}
                      >
                        {index + 1}
                      </div>
                      <p className="text-sm text-gray-700 font-medium">{detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
                        
            {/* Ilustrações Animadas de cada fase */}
            <div className="border-t border-gray-200 pt-8">
              <div className="relative h-52 md:h-64 overflow-hidden rounded-lg">
                {/* Mapeamento */}
                {activeStep === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-50 to-white p-4">
                    <div className="grid grid-cols-3 gap-3 w-full max-w-md animate-fadeIn">
                      <div className="h-40 md:h-48 bg-white rounded-lg flex flex-col items-center justify-center p-2 shadow-md animate-float-slow border border-purple-200">
                        <span className="text-2xl mb-1">🧭</span>
                        <span className="text-purple-800 font-medium text-sm">Propósito</span>
                        <span className="text-xs text-purple-600 mt-1">70%</span>
                        <div className="w-full h-2 bg-purple-100 rounded-full mt-2 overflow-hidden">
                          <div className="h-2 bg-purple-600 rounded-full animate-widthGrow" style={{ width: '70%' }}></div>
                        </div>
                      </div>
                      
                      <div className="h-40 md:h-48 bg-white rounded-lg flex flex-col items-center justify-center p-2 shadow-md animate-float-medium border border-green-200">
                        <span className="text-2xl mb-1">🧬</span>
                        <span className="text-green-800 font-medium text-sm">Corpo</span>
                        <span className="text-xs text-green-600 mt-1">45%</span>
                        <div className="w-full h-2 bg-green-100 rounded-full mt-2 overflow-hidden">
                          <div className="h-2 bg-green-600 rounded-full animate-widthGrow" style={{ width: '45%' }}></div>
                        </div>
                      </div>
                      
                      <div className="h-40 md:h-48 bg-white rounded-lg flex flex-col items-center justify-center p-2 shadow-md animate-float-fast border border-blue-200">
                        <span className="text-2xl mb-1">📚</span>
                        <span className="text-blue-800 font-medium text-sm">Mente</span>
                        <span className="text-xs text-blue-600 mt-1">80%</span>
                        <div className="w-full h-2 bg-blue-100 rounded-full mt-2 overflow-hidden">
                          <div className="h-2 bg-blue-600 rounded-full animate-widthGrow" style={{ width: '80%' }}></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Radar chart ilustrativo */}
                    <div className="absolute bottom-2 right-2 bg-white bg-opacity-70 rounded-lg p-1 shadow-sm border border-purple-100">
                      <svg width="60" height="60" viewBox="0 0 100 100" className="opacity-70">
                        <polygon points="50,10 90,50 50,90 10,50" fill="none" stroke="#9333ea" strokeWidth="1" />
                        <polygon points="50,20 80,50 50,80 20,50" fill="none" stroke="#9333ea" strokeWidth="1" strokeDasharray="3,2" />
                        <polygon points="50,35 65,50 50,65 35,50" fill="#9333ea" fillOpacity="0.2" stroke="#9333ea" strokeWidth="1" />
                        <circle cx="50" cy="50" r="2" fill="#9333ea" />
                      </svg>
                    </div>
                  </div>
                )}
                              
{/* Harmonização - VERSÃO MINIMALISTA E ELEGANTE */}
{activeStep === 1 && (
  <div className="relative w-full h-64 bg-gradient-to-br from-green-50 to-white rounded-lg p-4 flex items-center justify-center">
    {/* Container principal centralizado e com tamanho fixo */}
    <div className="relative w-56 h-56">
      
      {/* SVG minimalista com apenas o essencial */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" fill="none">
        {/* Círculo tracejado de fundo */}
        <circle cx="50" cy="50" r="48" stroke="#d1fae5" strokeWidth="1" strokeDasharray="3,2" fill="none" />
        
        {/* Triângulo equilátero */}
        <path 
          d="M50,5 L5,77 L95,77 Z" 
          stroke="#e5e7eb" 
          strokeWidth="1" 
          fill="none"
          strokeDasharray="3,2" 
        />
        
        {/* Apenas texto "Harmonia" no centro - sem círculo */}
        <text x="50" y="53" textAnchor="middle" fontSize="10" fill="#8b5cf6" fontWeight="500">Harmonia</text>
      </svg>
      
      {/* APENAS OS ÍCONES NOS VÉRTICES - SEM TEXTOS EXTRAS */}
      {/* Propósito - Topo */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/4">
        <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center border-2 border-purple-300 animate-float-slow">
          <span className="text-xl">🧭</span>
        </div>
      </div>
      
      {/* Mente - Esquerda inferior */}
      <div className="absolute bottom-0 left-0 transform -translate-x-1/4 translate-y-1/4">
        <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center border-2 border-blue-300 animate-float-medium">
          <span className="text-xl">📚</span>
        </div>
      </div>
      
      {/* Corpo - Direita inferior */}
      <div className="absolute bottom-0 right-0 transform translate-x-1/4 translate-y-1/4">
        <div className="w-14 h-14 rounded-full bg-white shadow-md flex items-center justify-center border-2 border-green-300 animate-float-fast">
          <span className="text-xl">🧬</span>
        </div>
      </div>
    </div>
  </div>
)}

                           
                {/* Potencialização */}
                {activeStep === 2 && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4">
                    <div className="relative w-full max-w-md h-full flex items-center justify-center animate-fadeIn">
                      {/* Círculo de energia central */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-r from-purple-400 via-green-400 to-blue-400 rounded-full animate-pulse-subtle shadow-lg opacity-80 flex items-center justify-center z-20">
                        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                          <span className="text-2xl">⚡</span>
                        </div>
                      </div>
                      
                      {/* Círculos concêntricos pulsantes */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="w-36 h-36 rounded-full border-2 border-white opacity-30 animate-growAndFade"></div>
                        <div className="w-60 h-60 rounded-full border-2 border-white opacity-20 animate-growAndFade" style={{ animationDelay: '0.5s' }}></div>
                        <div className="w-80 h-80 rounded-full border-2 border-white opacity-10 animate-growAndFade" style={{ animationDelay: '1s' }}></div>
                      </div>
                      
                      {/* Dimensões fortalecidas */}
                      <svg viewBox="0 0 100 100" className="w-full h-full absolute inset-0 z-10">
                        {/* Raios emanando do centro */}
                        <line x1="50" y1="50" x2="50" y2="10" stroke="#9333ea" strokeWidth="2" className="animate-heightGrow origin-bottom" style={{ strokeDasharray: '2,1' }} />
                        <line x1="50" y1="50" x2="15" y2="65" stroke="#22c55e" strokeWidth="2" className="animate-widthGrow origin-right" style={{ strokeDasharray: '2,1', animationDelay: '0.3s' }} />
                        <line x1="50" y1="50" x2="85" y2="65" stroke="#3b82f6" strokeWidth="2" className="animate-widthGrow origin-left" style={{ strokeDasharray: '2,1', animationDelay: '0.6s' }} />
                        
                        {/* Elementos nos pontos finais */}
                        <g className="animate-float-slow">
                          <circle cx="50" cy="10" r="8" fill="#f5f3ff" stroke="#9333ea" strokeWidth="1" />
                          <text x="50" y="13" textAnchor="middle" fontSize="8" fill="#9333ea" fontWeight="bold">🧭</text>
                        </g>
                        
                        <g className="animate-float-medium">
                          <circle cx="15" cy="65" r="8" fill="#ecfdf5" stroke="#22c55e" strokeWidth="1" />
                          <text x="15" y="68" textAnchor="middle" fontSize="8" fill="#22c55e" fontWeight="bold">🧬</text>
                        </g>
                        
                        <g className="animate-float-fast">
                          <circle cx="85" cy="65" r="8" fill="#eff6ff" stroke="#3b82f6" strokeWidth="1" />
                          <text x="85" y="68" textAnchor="middle" fontSize="8" fill="#3b82f6" fontWeight="bold">📚</text>
                        </g>
                      </svg>
                      
                      {/* Texto descritivo */}
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-3 py-1 shadow-sm border border-blue-200 text-xs text-blue-800 font-medium">
                        Potencialização Tridimensional
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
               
        {/* Diferenciais da metodologia */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          <MethodologyFeature
            title="Personalização Verdadeira"
            description="Não oferecemos soluções genéricas. Cada recomendação é baseada no seu perfil tridimensional único e atual momento de vida."
            icon={
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-indigo-600" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0-6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm0 7c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4zm6 5H6v-.99c.2-.72 3.3-2.01 6-2.01s5.8 1.29 6 2v1z" />
              </svg>
            }
          />
          
          <MethodologyFeature
            title="Baseada em Evidências"
            description="Combinamos sabedoria ancestral com os mais recentes avanços científicos em neurociência, psicologia positiva e bioquímica."
            icon={
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-indigo-600" fill="currentColor">
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM19 18H6c-2.21 0-4-1.79-4-4s1.79-4 4-4h.71C7.37 7.69 9.48 6 12 6c3.04 0 5.5 2.46 5.5 5.5v.5H19c1.66 0 3 1.34 3 3s-1.34 3-3 3z" />
                <path d="M10 16l5-5-1.41-1.41L10 13.17l-2.59-2.58L6 12l4 4z" />
              </svg>
            }
          />
          
          <MethodologyFeature
            title="Resultados Mensuráveis"
            description="Acompanhamos métricas objetivas e subjetivas do seu desenvolvimento, permitindo ajustes precisos no seu Plano de Voo."
            icon={
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-indigo-600" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
              </svg>
            }
          />
          
          <MethodologyFeature
            title="Abordagem Integrativa"
            description="Superamos a fragmentação típica de outras metodologias, criando pontes entre diferentes aspectos do seu ser."
            icon={
              <svg viewBox="0 0 24 24" className="w-8 h-8 text-indigo-600" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
              </svg>
            }
          />
        </div>
              
        {/* Citação do Manifesto */}
        <div className="max-w-3xl mx-auto text-center">
          <blockquote className="italic text-xl text-indigo-900 mb-4">
            "Nossa proposta não é cura — é potência. Não é te dar um novo destino, é te devolver o mapa. É acender contigo a fogueira que ilumina o caminho, e não o holofote que cega."
          </blockquote>
          
          <p className="text-gray-600">— Trecho do Manifesto NeoSapiens</p>
          
          {/* Call to Action */}
          <div className="mt-10">
            <button
              onClick={() => {
                document.getElementById('jornada')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md"
            >
              Conheça a Jornada NeoSapiens
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Componente para cada diferencial da metodologia
const MethodologyFeature = ({ title, description, icon }: {
  title: string,
  description: string,
  icon: React.ReactNode
}) => (
  <div className="flex space-x-4">
    <div className="flex-shrink-0">
      <div className="w-12 h-12 bg-indigo-100 rounded-lg p-2 flex items-center justify-center">
        {icon}
      </div>
    </div>
    
    <div>
      <h3 className="text-lg font-semibold text-indigo-800 mb-2">{title}</h3>
      <p className="text-gray-700">{description}</p>
    </div>
  </div>
);

export default MethodologySection;