import { useEffect, useRef } from 'react';

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);

  // Efeito de paralaxe suave ao scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      
      const scrollPosition = window.scrollY;
      const opacity = Math.max(1 - scrollPosition / 700, 0);
      const translateY = scrollPosition * 0.3;
      
      heroRef.current.style.opacity = opacity.toString();
      heroRef.current.style.transform = `translateY(${translateY}px)`;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background com gradiente */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-900 z-0">
        {/* Padrão de partículas sutil */}
        <div className="absolute inset-0 opacity-20">
          <div className="h-full w-full" style={{ 
            backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
            backgroundSize: '30px 30px' 
          }}></div>
        </div>
      </div>
      
      {/* Conteúdo principal */}
      <div ref={heroRef} className="container mx-auto px-4 z-10 pt-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Textos e CTAs */}
          <div className="text-white" data-aos="fade-right">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Há uma nova espécie surgindo
            </h1>
            
            <h2 className="text-xl md:text-2xl text-purple-300 font-light mb-8 italic">
              Não nasce de mutações genéticas, mas do desejo profundo de sentido.
            </h2>
            
            <p className="text-gray-300 text-lg mb-10 max-w-xl">
              O NeoSapiens é quem se recusa a viver no piloto automático, quem busca integrar propósito, corpo e mente em uma existência plena.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
              <button 
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg transform hover:scale-105"
                onClick={() => {
                  document.getElementById('questionario')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Inicie sua Jornada
              </button>
              
              <button 
                className="px-8 py-3 bg-transparent border-2 border-purple-400 text-white rounded-full font-medium hover:bg-purple-900 hover:border-purple-300 transition-all duration-300"
                onClick={() => {
                  document.getElementById('pilares')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Conheça Nossa Abordagem
              </button>
            </div>
          </div>
          
          {/* Ilustração/SVG */}
          <div className="relative" data-aos="fade-left">
            <div className="relative h-96 md:h-[28rem] flex items-center justify-center">
              {/* Container da ilustração - com triângulo equilátero */}
              <div className="relative w-80 h-80 md:w-96 md:h-96">
                
                {/* Linhas conectando os vértices do triângulo */}
                <svg className="absolute inset-0" viewBox="0 0 200 200">
                  {/* Triângulo equilátero perfeito */}
                  
                  {/* Linha Propósito - Corpo (topo para baixo esquerda) */}
                  <line x1="100" y1="10" x2="26" y2="160" stroke="#9333EA" strokeWidth="1.5" strokeDasharray="5,3" />
                  
                  {/* Linha Corpo - Mente (baixo esquerda para baixo direita) */}
                  <line x1="26" y1="160" x2="174" y2="160" stroke="#22C55E" strokeWidth="1.5" strokeDasharray="5,3" />
                  
                  {/* Linha Mente - Propósito (baixo direita para topo) */}
                  <line x1="174" y1="160" x2="100" y2="10" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="5,3" />
                </svg>
                
                {/* Bússola central com NeoSapiens - APENAS SILHUETA */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 md:w-40 md:h-40">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* Apenas a silhueta da bússola */}
                    <circle cx="50" cy="50" r="40" fill="#6366F1" fillOpacity="0.1" />
                    
                    {/* Texto no centro - MELHOR CENTRALIZADO */}
                    <text x="15" y="54" fontSize="14" fill="#FFFFFF" fontWeight="bold">NeoSapiens</text>
                  </svg>
                </div>
                
                {/* Ícones nos vértices do triângulo equilátero - POSIÇÕES REAJUSTADAS */}
                
                {/* Propósito (topo) - PERFEITAMENTE ALINHADO */}
                <div className="absolute" style={{ top: '0', left: '50%', transform: 'translateX(-50%)' }}>
                  <div className="bg-purple-100 p-4 rounded-full shadow-lg flex items-center justify-center animate-float-slow">
                    <svg viewBox="0 0 24 24" className="w-8 h-8 text-purple-600" fill="currentColor">
                      <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3l.71-.71z" />
                    </svg>
                  </div>
                  <div className="mt-2 text-center">
                    <span className="bg-purple-900 bg-opacity-80 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Propósito
                    </span>
                  </div>
                </div>
                
                {/* Corpo (esquerda inferior) */}
                <div className="absolute" style={{ bottom: '0', left: '6.5%' }}>
                  <div className="bg-green-100 p-4 rounded-full shadow-lg flex items-center justify-center animate-float-medium">
                    <svg viewBox="0 0 24 24" className="w-8 h-8 text-green-600" fill="currentColor">
                      <path d="M4 2h16v2H4zM4 20h16v2H4zM9 6l2 3-2 3h2l2-3-2-3H9M13 6l2 3-2 3h2l2-3-2-3h-2z" />
                    </svg>
                  </div>
                  <div className="mt-2 text-center">
                    <span className="bg-green-800 bg-opacity-80 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Corpo
                    </span>
                  </div>
                </div>
                
                {/* Mente (direita inferior) */}
                <div className="absolute" style={{ bottom: '0', right: '6.5%' }}>
                  <div className="bg-blue-100 p-4 rounded-full shadow-lg flex items-center justify-center animate-float-fast">
                    <svg viewBox="0 0 24 24" className="w-8 h-8 text-blue-600" fill="currentColor">
                      <path d="M13 3c3.9 0 7 3.1 7 7 0 2.8-1.6 5.2-4 6.3V21H9v-4.7c-2.4-1.1-4-3.5-4-6.3 0-3.9 3.1-7 7-7h1m-1 2c-2.8 0-5 2.2-5 5 0 2.2 1.4 4.1 3.5 4.7l.5.1V19h3v-4.2l.5-.1c2.1-.7 3.5-2.5 3.5-4.7 0-2.8-2.2-5-5-5h-1z" />
                    </svg>
                  </div>
                  <div className="mt-2 text-center">
                    <span className="bg-blue-800 bg-opacity-80 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Mente
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Indicador de scroll */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center animate-bounce-slow">
          <span className="text-white text-sm mb-2">Explore</span>
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;