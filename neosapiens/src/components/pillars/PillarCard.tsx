import { useState } from 'react';
import Image from 'next/image';

// Tipo para os dados de cada pilar
type PillarData = {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  hoverColor: string;
  components: string[];
  quote?: string;
  stat?: string;
  practice?: string;
};

type PillarCardProps = {
  pillar: PillarData;
  isActive: boolean;
  toggleActive: () => void;
};

const PillarCard: React.FC<PillarCardProps> = ({ pillar, isActive, toggleActive }) => {
  const { id, title, subtitle, description, icon, color, hoverColor, components, quote, stat, practice } = pillar;
  
  return (
    <div 
      className={`
        rounded-xl overflow-hidden transition-all duration-500 shadow hover:shadow-lg
        ${isActive ? 'bg-white' : 'bg-white cursor-pointer'}
      `}
      onClick={() => !isActive && toggleActive()}
    >
      {/* Cabeçalho do card */}
      <div 
        className={`
          p-6 text-white transition-all duration-300
          bg-gradient-to-r ${isActive ? hoverColor : color}
        `}
      >
        <div className="flex items-center space-x-4">
          <div className="relative h-12 w-12 bg-white bg-opacity-20 rounded-full p-2">
            <Image
              src={icon}
              alt={title}
              fill
              className="object-contain p-1"
            />
          </div>
          
          <div>
            <h3 className="text-xl font-bold">{title}</h3>
            <p className="text-sm text-white text-opacity-90">{subtitle}</p>
          </div>
        </div>
      </div>
      
      {/* Corpo do card - versão compacta (quando não está ativo) */}
      {!isActive && (
        <div className="p-6">
          <p className="text-gray-700">{description}</p>
          
          <button
            onClick={toggleActive}
            className="mt-4 text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
          >
            Saiba mais
          </button>
        </div>
      )}
      
      {/* Corpo do card - versão expandida (quando está ativo) */}
      {isActive && (
        <div className="p-6">
          <p className="text-gray-700 mb-6">{description}</p>
          
          <h4 className="font-medium text-indigo-800 mb-3">Componentes Principais:</h4>
          <ul className="space-y-2 mb-6">
            {components.map((component, index) => (
              <li key={index} className="flex items-start">
                <span className="text-indigo-500 mr-2">•</span>
                <span className="text-gray-700">{component}</span>
              </li>
            ))}
          </ul>
          
          {/* Conteúdo específico por tipo de pilar */}
          {quote && (
            <div className="italic text-gray-600 border-l-4 border-purple-300 pl-4 py-2 mb-6">
              {quote}
            </div>
          )}
          
          {stat && (
            <div className="bg-green-50 p-4 rounded-lg mb-6">
              <p className="text-green-800 text-sm font-medium">{stat}</p>
            </div>
          )}
          
          {practice && (
            <div className="bg-blue-50 p-4 rounded-lg mb-6">
              <p className="text-blue-800 text-sm font-medium">{practice}</p>
            </div>
          )}
          
          {/* Ações do card */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={toggleActive}
              className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors duration-200"
            >
              Recolher
            </button>
            
            <button
              className={`
                px-4 py-2 rounded-full text-sm font-medium text-white transition-all duration-300
                bg-gradient-to-r ${color} hover:${hoverColor}
              `}
              onClick={(e) => {
                e.stopPropagation();
                document.getElementById('questionario')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Avaliar meu {id === 'purpose' ? 'propósito' : id === 'body' ? 'corpo' : 'mente'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PillarCard;