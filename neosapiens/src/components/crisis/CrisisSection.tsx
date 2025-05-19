import { useState } from 'react';
import CrisisQuiz from './CrisisQuiz';

const CrisisSection = () => {
  const [showQuiz, setShowQuiz] = useState(false);

  return (
    <section id="crise" className="py-20 bg-gray-50 animate-on-scroll">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-6">
            Vivemos uma crise invisível
          </h2>
          
          <p className="text-gray-700 text-lg leading-relaxed mb-8">
            O humano moderno sabe muito. Conquistou planetas com telescópios e dobrou o DNA em laboratórios... Mas tropeça no espelho todas as manhãs, sem saber quem é. Freud chamou isso de ferida narcísica. Nós chamamos de oportunidade sagrada.
          </p>
          
          <button
            className="text-purple-600 font-medium border-b-2 border-purple-600 pb-1 hover:text-purple-800 hover:border-purple-800 transition-colors duration-300"
            onClick={() => setShowQuiz(!showQuiz)}
          >
            {showQuiz ? 'Ocultar Quiz Rápido' : 'Faça um Quiz Rápido de 3 Perguntas'}
          </button>
        </div>
        
        {/* SVG da Crise com posicionamento geométrico preciso */}
        <div className="relative max-w-3xl mx-auto mb-12">
          <div className="relative h-80 w-full">
            <svg viewBox="0 0 800 500" className="w-full h-full">
              {/* Fundo */}
              <rect x="0" y="0" width="800" height="500" fill="#f5f5f5" opacity="0.3" rx="20" ry="20" />
              
              {/* Círculo conectivo (um pouco menor para melhor visualização) */}
              <circle cx="400" cy="250" r="150" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="5,5" />
              
              {/* 
                Posicionamento baseado em trigonometria: 
                - Círculo de raio 150
                - Triângulo equilátero inscrito no círculo
                - Vértices em ângulos de 270° (topo), 30° (direita baixo), 150° (esquerda baixo)
              */}
              
              {/* Propósito - Vértice esquerdo do triângulo (150°) */}
              <g className="animate-float-slow">
                <circle 
                  cx={400 + 150 * Math.cos(150 * Math.PI/180)} 
                  cy={250 + 150 * Math.sin(150 * Math.PI/180)} 
                  r="60" 
                  fill="#9333ea" 
                  fillOpacity="0.1" 
                  stroke="#9333ea" 
                  strokeWidth="2" 
                />
                <path 
                  d={`M${400 + 150 * Math.cos(150 * Math.PI/180)},${250 + 150 * Math.sin(150 * Math.PI/180) - 30} 
                      L${400 + 150 * Math.cos(150 * Math.PI/180) - 22.5},${250 + 150 * Math.sin(150 * Math.PI/180) + 15} 
                      L${400 + 150 * Math.cos(150 * Math.PI/180) + 22.5},${250 + 150 * Math.sin(150 * Math.PI/180) + 15} Z`} 
                  fill="none" 
                  stroke="#9333ea" 
                  strokeWidth="3" 
                />
                <circle 
                  cx={400 + 150 * Math.cos(150 * Math.PI/180)} 
                  cy={250 + 150 * Math.sin(150 * Math.PI/180)} 
                  r="7" 
                  fill="#9333ea" 
                />
                <text 
                  x={400 + 150 * Math.cos(150 * Math.PI/180)} 
                  y={250 + 150 * Math.sin(150 * Math.PI/180) + 45} 
                  fill="#9333ea" 
                  fontSize="16" 
                  fontWeight="bold" 
                  textAnchor="middle"
                >
                  Propósito
                </text>
              </g>
              
              {/* Corpo - Vértice superior do triângulo (270°) */}
              <g className="animate-float-medium">
                <circle 
                  cx={400 + 150 * Math.cos(270 * Math.PI/180)} 
                  cy={250 + 150 * Math.sin(270 * Math.PI/180)} 
                  r="60" 
                  fill="#22c55e" 
                  fillOpacity="0.1" 
                  stroke="#22c55e" 
                  strokeWidth="2" 
                />
                <rect 
                  x={400 + 150 * Math.cos(270 * Math.PI/180) - 25} 
                  y={250 + 150 * Math.sin(270 * Math.PI/180) - 25} 
                  width="50" 
                  height="50" 
                  fill="none" 
                  stroke="#22c55e" 
                  strokeWidth="3" 
                />
                <line 
                  x1={400 + 150 * Math.cos(270 * Math.PI/180) - 25} 
                  y1={250 + 150 * Math.sin(270 * Math.PI/180)} 
                  x2={400 + 150 * Math.cos(270 * Math.PI/180) + 25} 
                  y2={250 + 150 * Math.sin(270 * Math.PI/180)} 
                  stroke="#22c55e" 
                  strokeWidth="3" 
                  strokeDasharray="6,3" 
                />
                <circle 
                  cx={400 + 150 * Math.cos(270 * Math.PI/180) - 15} 
                  cy={250 + 150 * Math.sin(270 * Math.PI/180) - 15} 
                  r="5" 
                  fill="#22c55e" 
                />
                <circle 
                  cx={400 + 150 * Math.cos(270 * Math.PI/180) + 15} 
                  cy={250 + 150 * Math.sin(270 * Math.PI/180) + 15} 
                  r="5" 
                  fill="#22c55e" 
                />
                <text 
                  x={400 + 150 * Math.cos(270 * Math.PI/180)} 
                  y={250 + 150 * Math.sin(270 * Math.PI/180) + 45} 
                  fill="#22c55e" 
                  fontSize="16" 
                  fontWeight="bold" 
                  textAnchor="middle"
                >
                  Corpo
                </text>
              </g>
              
              {/* Mente - Vértice direito do triângulo (30°) */}
              <g className="animate-float-fast">
                <circle 
                  cx={400 + 150 * Math.cos(30 * Math.PI/180)} 
                  cy={250 + 150 * Math.sin(30 * Math.PI/180)} 
                  r="60" 
                  fill="#3b82f6" 
                  fillOpacity="0.1" 
                  stroke="#3b82f6" 
                  strokeWidth="2" 
                />
                <circle 
                  cx={400 + 150 * Math.cos(30 * Math.PI/180)} 
                  cy={250 + 150 * Math.sin(30 * Math.PI/180)} 
                  r="30" 
                  fill="none" 
                  stroke="#3b82f6" 
                  strokeWidth="3" 
                />
                <line 
                  x1={400 + 150 * Math.cos(30 * Math.PI/180) - 20} 
                  y1={250 + 150 * Math.sin(30 * Math.PI/180) - 20} 
                  x2={400 + 150 * Math.cos(30 * Math.PI/180) + 20} 
                  y2={250 + 150 * Math.sin(30 * Math.PI/180) + 20} 
                  stroke="#3b82f6" 
                  strokeWidth="3" 
                />
                <line 
                  x1={400 + 150 * Math.cos(30 * Math.PI/180) - 20} 
                  y1={250 + 150 * Math.sin(30 * Math.PI/180) + 20} 
                  x2={400 + 150 * Math.cos(30 * Math.PI/180) + 20} 
                  y2={250 + 150 * Math.sin(30 * Math.PI/180) - 20} 
                  stroke="#3b82f6" 
                  strokeWidth="3" 
                />
                <text 
                  x={400 + 150 * Math.cos(30 * Math.PI/180)} 
                  y={250 + 150 * Math.sin(30 * Math.PI/180) + 45} 
                  fill="#3b82f6" 
                  fontSize="16" 
                  fontWeight="bold" 
                  textAnchor="middle"
                >
                  Mente
                </text>
              </g>
              
              {/* Linhas de conexão entre os vértices do triângulo */}
              <path 
                d={`M${400 + 150 * Math.cos(150 * Math.PI/180) + 30},${250 + 150 * Math.sin(150 * Math.PI/180)} 
                    C${400 + 50 * Math.cos(150 * Math.PI/180)},${250 + 50 * Math.sin(150 * Math.PI/180)} 
                    ${400 + 50 * Math.cos(270 * Math.PI/180)},${250 + 50 * Math.sin(270 * Math.PI/180)} 
                    ${400 + 150 * Math.cos(270 * Math.PI/180)},${250 + 150 * Math.sin(270 * Math.PI/180) + 30}`} 
                fill="none" 
                stroke="#9333ea" 
                strokeWidth="1.5" 
                strokeDasharray="5,5" 
                strokeOpacity="0.6" 
              />
              <path 
                d={`M${400 + 150 * Math.cos(270 * Math.PI/180)},${250 + 150 * Math.sin(270 * Math.PI/180) + 30} 
                    C${400 + 50 * Math.cos(270 * Math.PI/180)},${250 + 50 * Math.sin(270 * Math.PI/180)} 
                    ${400 + 50 * Math.cos(30 * Math.PI/180)},${250 + 50 * Math.sin(30 * Math.PI/180)} 
                    ${400 + 150 * Math.cos(30 * Math.PI/180) - 30},${250 + 150 * Math.sin(30 * Math.PI/180)}`} 
                fill="none" 
                stroke="#22c55e" 
                strokeWidth="1.5" 
                strokeDasharray="5,5" 
                strokeOpacity="0.6" 
              />
              <path 
                d={`M${400 + 150 * Math.cos(30 * Math.PI/180) - 30},${250 + 150 * Math.sin(30 * Math.PI/180)} 
                    C${400 + 50 * Math.cos(30 * Math.PI/180)},${250 + 50 * Math.sin(30 * Math.PI/180)} 
                    ${400 + 50 * Math.cos(150 * Math.PI/180)},${250 + 50 * Math.sin(150 * Math.PI/180)} 
                    ${400 + 150 * Math.cos(150 * Math.PI/180) + 30},${250 + 150 * Math.sin(150 * Math.PI/180)}`} 
                fill="none" 
                stroke="#3b82f6" 
                strokeWidth="1.5" 
                strokeDasharray="5,5" 
                strokeOpacity="0.6" 
              />
              
              {/* Círculo central com texto */}
              <circle cx="400" cy="250" r="45" fill="white" stroke="#e2e8f0" strokeWidth="2" />
              <text x="400" y="245" fill="#4b5563" fontSize="16" fontWeight="bold" textAnchor="middle">CRISE</text>
              <text x="400" y="265" fill="#4b5563" fontSize="14" textAnchor="middle">INVISÍVEL</text>
            </svg>
          </div>
        </div>
        
        {/* Quiz Condicional */}
        {showQuiz && <CrisisQuiz />}
        
        {/* Três sintomas da crise */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <CrisisSymptom 
            icon={
              <svg viewBox="0 0 100 100" className="w-16 h-16">
                <circle cx="50" cy="50" r="40" fill="#9333ea" fillOpacity="0.1" />
                <path d="M50 20L30 70h40L50 20z" fill="none" stroke="#9333ea" strokeWidth="3" />
                <circle cx="50" cy="50" r="5" fill="#9333ea" />
                <line x1="30" y1="70" x2="70" y2="70" stroke="#9333ea" strokeWidth="3" />
                <line x1="35" y1="45" x2="65" y2="45" stroke="#9333ea" strokeWidth="3" strokeDasharray="6,3" />
              </svg>
            }
            title="Desconexão de Propósito"
            description="Sensação de vazio existencial mesmo com conquistas externas e riqueza material."
          />
          
          <CrisisSymptom 
            icon={
              <svg viewBox="0 0 100 100" className="w-16 h-16">
                <circle cx="50" cy="50" r="40" fill="#22c55e" fillOpacity="0.1" />
                <path d="M30 30h40v40H30z" fill="none" stroke="#22c55e" strokeWidth="3" />
                <line x1="30" y1="50" x2="70" y2="50" stroke="#22c55e" strokeWidth="3" strokeDasharray="6,3" />
                <path d="M40 35c0 2.76 2.24 5 5 5s5-2.24 5-5-2.24-5-5-5-5 2.24-5 5z" fill="#22c55e" />
                <path d="M50 65c0 2.76 2.24 5 5 5s5-2.24 5-5-2.24-5-5-5-5 2.24-5 5z" fill="#22c55e" />
              </svg>
            }
            title="Desenraizamento Corporal"
            description="Dissociação da sabedoria natural do corpo e suas necessidades biológicas fundamentais."
          />
          
          <CrisisSymptom 
            icon={
              <svg viewBox="0 0 100 100" className="w-16 h-16">
                <circle cx="50" cy="50" r="40" fill="#3b82f6" fillOpacity="0.1" />
                <circle cx="50" cy="50" r="25" fill="none" stroke="#3b82f6" strokeWidth="3" />
                <line x1="35" y1="35" x2="65" y2="65" stroke="#3b82f6" strokeWidth="3" />
                <line x1="35" y1="65" x2="65" y2="35" stroke="#3b82f6" strokeWidth="3" />
                <path d="M20 50h10M70 50h10M50 20v10M50 70v10" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" />
              </svg>
            }
            title="Sobrecarga Cognitiva"
            description="Mente fragmentada pela constante competição por atenção e excesso de informação."
          />
        </div>
        
        {/* Call to Action */}
        <div className="text-center mt-16">
          <h3 className="text-xl md:text-2xl font-medium text-indigo-800 mb-6 italic">
            "Existe outro caminho..."
          </h3>
          
          <button
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md"
            onClick={() => {
              document.getElementById('pilares')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Descubra a Abordagem NeoSapiens
          </button>
        </div>
      </div>
    </section>
  );
};

// Componente para cada sintoma da crise
const CrisisSymptom = ({ icon, title, description }: { 
  icon: React.ReactNode, 
  title: string, 
  description: string 
}) => (
  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center text-center">
    <div className="mb-4">
      {icon}
    </div>
    
    <h3 className="text-xl font-semibold text-indigo-800 mb-3">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default CrisisSection;