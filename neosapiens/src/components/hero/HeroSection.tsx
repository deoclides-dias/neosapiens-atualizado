import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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

  const handleStartJourney = () => {
    router.push('/auth/signup');
  };

  const handleLearnMore = () => {
    document.getElementById('pilares')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background com gradiente */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-900 z-0">
        {/* Padrão de partículas sutil */}
        <div className="absolute inset-0 opacity-20">
          <div className="h-full w-full" style={{
            backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}>
          </div>
        </div>
      </div>

      <div ref={heroRef} className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Conteúdo */}
          <div className="text-center lg:text-left" data-aos="fade-up">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Desperte o{' '}
              <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
                NeoSapiens
              </span>{' '}
              em Você
            </h1>
            <p className="text-gray-300 text-lg mb-10 max-w-xl">
              O NeoSapiens é quem se recusa a viver no piloto automático, quem busca integrar propósito, corpo e mente em uma existência plena.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
              <button
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-lg transform hover:scale-105"
                onClick={handleStartJourney}
              >
                🚀 Inicie sua Jornada NeoSapiens
              </button>
              <button
                className="px-8 py-3 bg-transparent border-2 border-purple-400 text-white rounded-full font-medium hover:bg-purple-900 hover:border-purple-300 transition-all duration-300"
                onClick={handleLearnMore}
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
                <svg 
                  viewBox="0 0 400 400" 
                  className="absolute inset-0 w-full h-full"
                >
                  {/* Triângulo principal */}
                  <path
                    d="M200 50 L350 300 L50 300 Z"
                    fill="none"
                    stroke="rgba(139, 92, 246, 0.5)"
                    strokeWidth="2"
                    className="animate-pulse"
                  />
                  
                  {/* Linhas internas conectando centro */}
                  <g stroke="rgba(99, 102, 241, 0.3)" strokeWidth="1">
                    <line x1="200" y1="200" x2="200" y2="50" />
                    <line x1="200" y1="200" x2="350" y2="300" />
                    <line x1="200" y1="200" x2="50" y2="300" />
                  </g>
                </svg>

                {/* Vértices do triângulo com labels */}
                {/* Propósito (topo) */}
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mb-2 shadow-lg">
                    <span className="text-white text-2xl">🧭</span>
                  </div>
                  <span className="text-purple-300 text-sm font-medium">Propósito</span>
                </div>

                {/* Corpo (inferior esquerdo) */}
                <div className="absolute bottom-8 left-4 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-2 shadow-lg">
                    <span className="text-white text-2xl">🧬</span>
                  </div>
                  <span className="text-green-300 text-sm font-medium">Corpo</span>
                </div>

                {/* Mente (inferior direito) */}
                <div className="absolute bottom-8 right-4 text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-2 shadow-lg">
                    <span className="text-white text-2xl">📚</span>
                  </div>
                  <span className="text-blue-300 text-sm font-medium">Mente</span>
                </div>

                {/* Centro - Integração */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <span className="text-white text-xl">⚡</span>
                  </div>
                  <span className="text-yellow-300 text-xs font-medium mt-1 block">Integração</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
