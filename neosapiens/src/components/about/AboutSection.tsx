import React from 'react';

const AboutSection = () => {
  return (
    <section id="sobre" className="py-20 bg-indigo-50 animate-on-scroll">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-6">
            Liderando a exploração
          </h2>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12">
            {/* Avatar ilustrativo do Dr. Deoclides */}
            <div className="w-full md:w-1/3 flex-shrink-0">
              <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden mx-auto border-4 border-white shadow-xl bg-gradient-to-br from-indigo-500 to-purple-600">
                {/* SVG Avatar estilizado */}
                <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
                  {/* Fundo do avatar */}
                  <defs>
                    <linearGradient id="avatarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#9333ea" />
                    </linearGradient>
                  </defs>
                  
                  {/* Cabeça */}
                  <circle cx="100" cy="85" r="60" fill="#f8fafc" />
                  
                  {/* Cabelo estilizado */}
                  <path 
                    d="M100,25 C60,25 45,60 45,85 C45,70 60,60 80,55 C70,60 65,70 65,85 C65,70 75,60 95,55 C85,60 80,70 80,85 C80,70 90,55 100,50 C110,55 120,70 120,85 C120,70 115,60 105,55 C125,60 135,70 135,85 C135,70 130,60 120,55 C140,60 155,70 155,85 C155,60 140,25 100,25Z" 
                    fill="#1e293b" 
                  />
                  
                  {/* Rosto */}
                  <ellipse cx="80" cy="85" rx="5" ry="7" fill="#1e293b" /> {/* Olho esquerdo */}
                  <ellipse cx="120" cy="85" rx="5" ry="7" fill="#1e293b" /> {/* Olho direito */}
                  
                  {/* Óculos */}
                  <circle cx="80" cy="85" r="12" fill="none" stroke="#475569" strokeWidth="2" />
                  <circle cx="120" cy="85" r="12" fill="none" stroke="#475569" strokeWidth="2" />
                  <line x1="92" y1="85" x2="108" y2="85" stroke="#475569" strokeWidth="2" />
                  <line x1="68" y1="85" x2="60" y2="80" stroke="#475569" strokeWidth="2" />
                  <line x1="132" y1="85" x2="140" y2="80" stroke="#475569" strokeWidth="2" />
                  
                  {/* Sorriso */}
                  <path d="M85,105 Q100,120 115,105" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
                  
                  {/* Barba estilizada */}
                  <path 
                    d="M70,105 C85,140 115,140 130,105" 
                    fill="none" 
                    stroke="#64748b" 
                    strokeWidth="5" 
                    strokeLinecap="round"
                    strokeDasharray="1,3"
                  />
                  
                  {/* Pescoço */}
                  <rect x="90" y="140" width="20" height="20" fill="#f8fafc" />
                  
                  {/* Corpo/camisa */}
                  <path 
                    d="M60,160 L90,145 H110 L140,160 V200 H60 Z" 
                    fill="#3b82f6" 
                  />
                  
                  {/* Detalhes da camisa */}
                  <rect x="95" y="145" width="10" height="20" fill="#2563eb" />
                </svg>
              </div>
              
              {/* Credenciais */}
              <div className="flex justify-center space-x-3 mt-6">
                <div className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 text-indigo-500" fill="currentColor">
                    <path d="M13 3c3.9 0 7 3.1 7 7 0 2.8-1.6 5.2-4 6.3V21H9v-4.7c-2.4-1.1-4-3.5-4-6.3 0-3.9 3.1-7 7-7h1m-1 2c-2.8 0-5 2.2-5 5 0 2.2 1.4 4.1 3.5 4.7l.5.1V19h3v-4.2l.5-.1c2.1-.7 3.5-2.5 3.5-4.7 0-2.8-2.2-5-5-5h-1z" />
                  </svg>
                </div>
                
                <div className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 text-indigo-500" fill="currentColor">
                    <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
                  </svg>
                </div>
                
                <div className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 text-indigo-500" fill="currentColor">
                    <path d="M20 11H4c-.55 0-1 .45-1 1s.45 1 1 1h16c.55 0 1-.45 1-1s-.45-1-1-1zM4 18h10c.55 0 1-.45 1-1s-.45-1-1-1H4c-.55 0-1 .45-1 1s.45 1 1 1zM20 6H4c-.55 0-1 .45-1 1v.01c0 .55.45 1 1 1h16c.55 0 1-.45 1-1V7c0-.55-.45-1-1-1z" />
                  </svg>
                </div>
                
                <div className="w-12 h-12 bg-white rounded-full shadow flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 text-indigo-500" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-14v7h2V6h-2z" />
                    <circle cx="12" cy="16" r="1" />
                  </svg>
                </div>
              </div>
            </div>
            
            {/* Bio e informações */}
            <div className="w-full md:w-2/3">
              <h3 className="text-2xl font-bold text-indigo-900 mb-2 text-center md:text-left">
                Dr. Deoclides Dias
              </h3>
              
              <p className="text-indigo-700 font-medium mb-6 text-center md:text-left">
                Fundador do NeoSapiens
              </p>
              
              <div className="space-y-4 text-gray-700">
                <p>
                  O Dr. Deoclides Dias dedicou mais de 20 anos ao estudo da integração entre ciência moderna e sabedoria ancestral. Com formação em Neurociência pela Universidade de São Paulo e doutorado em Filosofia da Mente pela Universidade de Cambridge, ele construiu uma ponte única entre o conhecimento acadêmico e aplicações práticas para o desenvolvimento humano.
                </p>
                
                <p>
                  Antes de fundar o NeoSapiens, trabalhou como pesquisador no Centro de Estudos da Consciência em Berkeley e conduziu estudos inovadores sobre estados integrativos de alta performance em atletas olímpicos e meditadores avançados.
                </p>
                
                <p>
                  Sua busca pessoal por integração o levou a estudar com mestres de tradições contemplativas na Índia, Tibet e Japão, bem como a desenvolver métodos proprietários de biohacking e otimização cognitiva.
                </p>
                
                <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-purple-500 mt-6">
                  <p className="italic">
                    "O NeoSapiens nasceu da minha própria busca por integração. Durante anos, vi pessoas brilhantes com corpos negligenciados, atletas extraordinários sem propósito claro, e buscadores espirituais desconectados do mundo prático. A verdadeira revolução humana não está em escolher um caminho exclusivo, mas em integrar todas as dimensões do nosso ser em uma dança harmoniosa."
                  </p>
                </div>
              </div>
              
              <div className="mt-8 flex justify-center md:justify-start">
                <button
                  onClick={() => {
                    document.getElementById('questionario')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md"
                >
                  Inicie Sua Jornada com o Dr. Deoclides
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;