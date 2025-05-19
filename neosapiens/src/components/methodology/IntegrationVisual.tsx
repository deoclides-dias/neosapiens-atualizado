import { useState, useEffect } from 'react';

const IntegrationVisual = () => {
  const [animationStep, setAnimationStep] = useState(0);
  
  // Animação automática que cicla entre os passos
  useEffect(() => {
    // Animação em loop com 5 passos
    const interval = setInterval(() => {
      setAnimationStep((prev) => (prev + 1) % 5);
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Constantes para o posicionamento trigonométrico
  const centerX = 100;
  const centerY = 100;
  const radius = 80;
  
  // Coordenadas calculadas precisamente para um triângulo equilátero
  // Usando ângulos de 270° (topo), 30° (direita baixo) e 150° (esquerda baixo)
  const purposes = {
    x: centerX + radius * Math.cos((150 * Math.PI) / 180),
    y: centerY + radius * Math.sin((150 * Math.PI) / 180)
  };
  
  const body = {
    x: centerX + radius * Math.cos((270 * Math.PI) / 180),
    y: centerY + radius * Math.sin((270 * Math.PI) / 180)
  };
  
  const mind = {
    x: centerX + radius * Math.cos((30 * Math.PI) / 180),
    y: centerY + radius * Math.sin((30 * Math.PI) / 180)
  };
  
  // Determinar opacidade das conexões baseado no passo da animação
  const getConnectionOpacity = (connection: string) => {
    // Passo 0: Estado inicial - todas as conexões com baixa opacidade
    if (animationStep === 0) return 0.2;
    
    // Passo 4: Estado final - todas as conexões com alta opacidade
    if (animationStep === 4) return 1;
    
    // Passos intermediários - ativar conexões específicas
    if (animationStep === 1 && connection === 'purpose-body') return 1;
    if (animationStep === 2 && connection === 'body-mind') return 1;
    if (animationStep === 3 && connection === 'mind-purpose') return 1;
    
    // Conexões não ativas no passo atual
    return 0.2;
  };
  
  // Determinar se um nó deve ser destacado no passo atual
  const isNodeHighlighted = (node: string) => {
    if (animationStep === 0) return false;
    if (animationStep === 4) return true;
    
    if (animationStep === 1 && (node === 'purpose' || node === 'body')) return true;
    if (animationStep === 2 && (node === 'body' || node === 'mind')) return true;
    if (animationStep === 3 && (node === 'mind' || node === 'purpose')) return true;
    
    return false;
  };
  
  // Obter classe de destaque para nós
  const getNodeClass = (node: string) => {
    return isNodeHighlighted(node) 
      ? 'shadow-lg border-2 transform scale-110 transition-all duration-300' 
      : 'shadow border transition-all duration-300';
  };
  
  return (
    <div className="w-full max-w-xl mx-auto">
      {/* SVG principal com as dimensões e animações */}
      <div className="relative h-64 md:h-72">
        <svg 
          viewBox="0 0 200 200" 
          className="absolute inset-0 w-full h-full"
        >
        {/* Fundo sutilmente visível */}
        <circle cx={centerX} cy={centerY} r={radius + 10} fill="#f5f5fb" stroke="#e2e8f0" strokeWidth="1" strokeDasharray="2,2" />
        
        {/* Linhas de conexão animadas */}
        {/* Propósito para Corpo */}
        <path
          d={`M${purposes.x},${purposes.y} C${(purposes.x + body.x) / 2 - 10},${(purposes.y + body.y) / 2} ${(purposes.x + body.x) / 2 + 10},${(purposes.y + body.y) / 2} ${body.x},${body.y}`}
          stroke="#9333ea"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="5,5"
          style={{ opacity: getConnectionOpacity('purpose-body') }}
          className="transition-opacity duration-500"
          fill="none"
        />
        
        {/* Corpo para Mente */}
        <path
          d={`M${body.x},${body.y} C${(body.x + mind.x) / 2 - 10},${(body.y + mind.y) / 2} ${(body.x + mind.x) / 2 + 10},${(body.y + mind.y) / 2} ${mind.x},${mind.y}`}
          stroke="#22c55e"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="5,5"
          style={{ opacity: getConnectionOpacity('body-mind') }}
          className="transition-opacity duration-500"
          fill="none"
        />
        
        {/* Mente para Propósito */}
        <path
          d={`M${mind.x},${mind.y} C${(mind.x + purposes.x) / 2 + 10},${(mind.y + purposes.y) / 2} ${(mind.x + purposes.x) / 2 - 10},${(mind.y + purposes.y) / 2} ${purposes.x},${purposes.y}`}
          stroke="#3b82f6"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray="5,5"
          style={{ opacity: getConnectionOpacity('mind-purpose') }}
          className="transition-opacity duration-500"
          fill="none"
        />
        
        {/* Nós das dimensões */}
        {/* Propósito */}
        <g className={isNodeHighlighted('purpose') ? 'animate-pulse-subtle' : ''}>
          <circle 
            cx={purposes.x} 
            cy={purposes.y} 
            r="24" 
            fill="#9333ea" 
            fillOpacity="0.1"
            stroke={isNodeHighlighted('purpose') ? "#9333ea" : "#9333ea80"}
            strokeWidth={isNodeHighlighted('purpose') ? "3" : "1.5"}
            className="transition-all duration-300"
          />
          <text
            x={purposes.x}
            y={purposes.y + 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="10"
            fontWeight="bold"
            fill="#9333ea"
          >
            🧭
          </text>
          <text
            x={purposes.x}
            y={purposes.y + 18}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="9"
            fontWeight="bold"
            fill="#9333ea"
          >
            PROPÓSITO
          </text>
        </g>
        
        {/* Corpo */}
        <g className={isNodeHighlighted('body') ? 'animate-pulse-subtle' : ''}>
          <circle 
            cx={body.x} 
            cy={body.y} 
            r="24" 
            fill="#22c55e" 
            fillOpacity="0.1"
            stroke={isNodeHighlighted('body') ? "#22c55e" : "#22c55e80"}
            strokeWidth={isNodeHighlighted('body') ? "3" : "1.5"}
            className="transition-all duration-300"
          />
          <text
            x={body.x}
            y={body.y + 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="10"
            fontWeight="bold"
            fill="#22c55e"
          >
            🧬
          </text>
          <text
            x={body.x}
            y={body.y + 18}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="9"
            fontWeight="bold"
            fill="#22c55e"
          >
            CORPO
          </text>
        </g>
        
        {/* Mente */}
        <g className={isNodeHighlighted('mind') ? 'animate-pulse-subtle' : ''}>
          <circle 
            cx={mind.x} 
            cy={mind.y} 
            r="24" 
            fill="#3b82f6" 
            fillOpacity="0.1"
            stroke={isNodeHighlighted('mind') ? "#3b82f6" : "#3b82f680"}
            strokeWidth={isNodeHighlighted('mind') ? "3" : "1.5"}
            className="transition-all duration-300"
          />
          <text
            x={mind.x}
            y={mind.y + 2}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="10"
            fontWeight="bold"
            fill="#3b82f6"
          >
            📚
          </text>
          <text
            x={mind.x}
            y={mind.y + 18}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="9"
            fontWeight="bold"
            fill="#3b82f6"
          >
            MENTE
          </text>
        </g>
        
        {/* Círculo de integração central */}
        <circle 
          cx={centerX} 
          cy={centerY} 
          r="32" 
          fill="url(#integrationGradient)" 
          stroke="white"
          strokeWidth="2"
          className={animationStep === 4 ? 'animate-pulse' : ''}
          filter="drop-shadow(0 4px 3px rgb(0 0 0 / 0.07)) drop-shadow(0 2px 2px rgb(0 0 0 / 0.06))"
        />
        
        {/* Gradiente para o círculo central */}
        <defs>
          <radialGradient id="integrationGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="white" />
            <stop offset="60%" stopColor="#f5f3ff" />
            <stop offset="100%" stopColor="#e0e7ff" />
          </radialGradient>
        </defs>
        
        {/* Texto de integração */}
        <text
          x={centerX}
          y={centerY}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="10"
          fontWeight="bold"
          fill="#4f46e5"
        >
          ⚡
        </text>
        <text
          x={centerX}
          y={centerY + 16}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="9"
          fontWeight="bold"
          fill="#4f46e5"
        >
          INTEGRAÇÃO
        </text>
      </svg>
      </div>
      
      {/* Legenda de etapas separada do SVG - agora colocada abaixo */}
      <div className="flex justify-center mt-2 mb-2">
        <div className="bg-white rounded-full px-3 py-1 shadow-sm flex items-center space-x-4 text-xs">
          <div className={`flex items-center ${animationStep === 0 ? 'text-indigo-700 font-medium' : 'text-gray-500'}`}>
            <span className={`w-2 h-2 rounded-full ${animationStep === 0 ? 'bg-indigo-600' : 'bg-gray-300'} mr-1`}></span>
            <span>Desconexão</span>
          </div>
          
          <div className={`flex items-center ${animationStep === 1 ? 'text-purple-700 font-medium' : 'text-gray-500'}`}>
            <span className={`w-2 h-2 rounded-full ${animationStep === 1 ? 'bg-purple-600' : 'bg-gray-300'} mr-1`}></span>
            <span>Fase 1</span>
          </div>
          
          <div className={`flex items-center ${animationStep === 2 ? 'text-green-700 font-medium' : 'text-gray-500'}`}>
            <span className={`w-2 h-2 rounded-full ${animationStep === 2 ? 'bg-green-600' : 'bg-gray-300'} mr-1`}></span>
            <span>Fase 2</span>
          </div>
          
          <div className={`flex items-center ${animationStep === 3 ? 'text-blue-700 font-medium' : 'text-gray-500'}`}>
            <span className={`w-2 h-2 rounded-full ${animationStep === 3 ? 'bg-blue-600' : 'bg-gray-300'} mr-1`}></span>
            <span>Fase 3</span>
          </div>
        </div>
      </div>
      
      {/* Texto descritivo da etapa atual */}
      <div className="bg-white rounded-lg shadow-sm p-2 text-center text-xs text-gray-700">
        {animationStep === 0 && (
          <p>Estado inicial: dimensões desconectadas</p>
        )}
        {animationStep === 1 && (
          <p><span className="text-purple-700 font-medium">Propósito</span> e <span className="text-green-700 font-medium">Corpo</span> começam a se integrar</p>
        )}
        {animationStep === 2 && (
          <p><span className="text-green-700 font-medium">Corpo</span> e <span className="text-blue-700 font-medium">Mente</span> amplificam a conexão</p>
        )}
        {animationStep === 3 && (
          <p><span className="text-blue-700 font-medium">Mente</span> e <span className="text-purple-700 font-medium">Propósito</span> completam o ciclo</p>
        )}
        {animationStep === 4 && (
          <p>Integração <span className="font-medium">NeoSapiens</span> atingida: as três dimensões em harmonia</p>
        )}
      </div>
    </div>
  );
};

export default IntegrationVisual;