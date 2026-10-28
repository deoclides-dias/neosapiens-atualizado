// src/components/onboarding/psychological-steps/ScaleSystem.tsx
// ============================================================================
// SISTEMA DE ESCALAS INTUITIVAS - PSYCHOLOGICAL FORM
// ============================================================================

import React from 'react';
import { CheckCircle } from 'lucide-react';

// ============================================================================
// TIPOS DE ESCALAS
// ============================================================================

export interface ScaleOption {
  value: number;
  label: string;
  shortLabel: string;
  description: string;
  color: string;
  gradientFrom: string;
  gradientTo: string;
}

export interface ScaleConfig {
  type: 'agreement' | 'frequency' | 'intensity' | 'preference';
  title: string;
  options: ScaleOption[];
}

// ============================================================================
// ESCALAS DEFINIDAS
// ============================================================================

export const PSYCHOLOGICAL_SCALES: Record<string, ScaleConfig> = {
  // Escala Principal (Big Five, MTC)
  agreement: {
    type: 'agreement',
    title: 'Nível de Concordância',
    options: [
      {
        value: 1,
        label: 'Discordo Totalmente',
        shortLabel: 'Discordo Totalmente',
        description: 'Não se aplica nada a mim',
        color: 'red-500',
        gradientFrom: 'red-500',
        gradientTo: 'red-600'
      },
      {
        value: 2,
        label: 'Discordo Parcialmente',
        shortLabel: 'Discordo',
        description: 'Se aplica pouco a mim',
        color: 'orange-500',
        gradientFrom: 'orange-500',
        gradientTo: 'orange-600'
      },
      {
        value: 3,
        label: 'Neutro',
        shortLabel: 'Neutro',
        description: 'Nem concordo nem discordo',
        color: 'yellow-500',
        gradientFrom: 'yellow-500',
        gradientTo: 'yellow-600'
      },
      {
        value: 4,
        label: 'Concordo Parcialmente',
        shortLabel: 'Concordo',
        description: 'Se aplica bem a mim',
        color: 'blue-500',
        gradientFrom: 'blue-500',
        gradientTo: 'blue-600'
      },
      {
        value: 5,
        label: 'Concordo Totalmente',
        shortLabel: 'Concordo Totalmente',
        description: 'Se aplica perfeitamente a mim',
        color: 'green-500',
        gradientFrom: 'green-500',
        gradientTo: 'green-600'
      }
    ]
  },

  // Escala para DISC (situações comportamentais)
  frequency: {
    type: 'frequency',
    title: 'Frequência de Comportamento',
    options: [
      {
        value: 1,
        label: 'Nunca',
        shortLabel: 'Nunca',
        description: 'Nunca me comporto assim',
        color: 'red-500',
        gradientFrom: 'red-500',
        gradientTo: 'red-600'
      },
      {
        value: 2,
        label: 'Raramente',
        shortLabel: 'Raramente',
        description: 'Raramente me comporto assim',
        color: 'orange-500',
        gradientFrom: 'orange-500',
        gradientTo: 'orange-600'
      },
      {
        value: 3,
        label: 'Às Vezes',
        shortLabel: 'Às Vezes',
        description: 'Às vezes me comporto assim',
        color: 'yellow-500',
        gradientFrom: 'yellow-500',
        gradientTo: 'yellow-600'
      },
      {
        value: 4,
        label: 'Frequentemente',
        shortLabel: 'Frequentemente',
        description: 'Frequentemente me comporto assim',
        color: 'blue-500',
        gradientFrom: 'blue-500',
        gradientTo: 'blue-600'
      },
      {
        value: 5,
        label: 'Sempre',
        shortLabel: 'Sempre',
        description: 'Sempre me comporto assim',
        color: 'green-500',
        gradientFrom: 'green-500',
        gradientTo: 'green-600'
      }
    ]
  },

  // Escala para VARK (preferências)
  preference: {
    type: 'preference',
    title: 'Nível de Preferência',
    options: [
      {
        value: 1,
        label: 'Detesto Totalmente',
        shortLabel: 'Detesto',
        description: 'Definitivamente não é meu estilo',
        color: 'red-500',
        gradientFrom: 'red-500',
        gradientTo: 'red-600'
      },
      {
        value: 2,
        label: 'Não Gosto',
        shortLabel: 'Não Gosto',
        description: 'Prefiro evitar',
        color: 'orange-500',
        gradientFrom: 'orange-500',
        gradientTo: 'orange-600'
      },
      {
        value: 3,
        label: 'Indiferente',
        shortLabel: 'Indiferente',
        description: 'Tanto faz para mim',
        color: 'yellow-500',
        gradientFrom: 'yellow-500',
        gradientTo: 'yellow-600'
      },
      {
        value: 4,
        label: 'Gosto',
        shortLabel: 'Gosto',
        description: 'É um estilo que me agrada',
        color: 'blue-500',
        gradientFrom: 'blue-500',
        gradientTo: 'blue-600'
      },
      {
        value: 5,
        label: 'Amo Totalmente',
        shortLabel: 'Amo',
        description: 'É exatamente meu estilo',
        color: 'green-500',
        gradientFrom: 'green-500',
        gradientTo: 'green-600'
      }
    ]
  }
};

// ============================================================================
// COMPONENTE: Scale Selector
// ============================================================================

interface ScaleSelectorProps {
  scaleType: keyof typeof PSYCHOLOGICAL_SCALES;
  selectedValue: number;
  onValueChange: (value: number) => void;
  questionNumber?: number;
  compact?: boolean;
}

export const ScaleSelector: React.FC<ScaleSelectorProps> = ({
  scaleType,
  selectedValue,
  onValueChange,
  questionNumber,
  compact = false
}) => {
  const scale = PSYCHOLOGICAL_SCALES[scaleType];

  return (
    <div className="space-y-4">
      {/* Título da Escala */}
      {!compact && (
        <div className="text-center">
          <h4 className="text-gray-700 text-sm font-medium">
            {scale.title}
          </h4>
        </div>
      )}

      {/* Opções da Escala */}
      <div className={`grid gap-3 ${compact ? 'grid-cols-5' : 'grid-cols-1 sm:grid-cols-5'}`}>
        {scale.options.map((option) => (
          <button
            key={option.value}
            onClick={() => onValueChange(option.value)}
            className={`
              relative p-4 rounded-xl border-2 transition-all duration-300 text-center group
              ${selectedValue === option.value
                ? `border-${option.color} bg-gradient-to-br from-${option.gradientFrom} to-${option.gradientTo} text-white shadow-lg scale-105`
                : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-gray-100'
              }
            `}
          >
            {/* Círculo de seleção */}
            <div className={`
              absolute -top-2 -right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center
              ${selectedValue === option.value
                ? 'border-white bg-white'
                : 'border-gray-300 bg-gray-200'
              }
            `}>
              {selectedValue === option.value && (
                <CheckCircle className="w-4 h-4 text-green-600" />
              )}
            </div>

            {/* Valor numérico (pequeno, discreto) */}
            <div className={`
              text-xs font-bold mb-2
              ${selectedValue === option.value ? 'text-gray-700' : 'text-gray-500'}
            `}>
              {option.value}
            </div>

            {/* Label principal */}
            <div className={`
              font-semibold mb-1 text-sm
              ${compact ? 'text-xs' : 'text-sm'}
            `}>
              {compact ? option.shortLabel : option.label}
            </div>

            {/* Descrição (só se não compacto) */}
            {!compact && (
              <div className={`
                text-xs opacity-80
                ${selectedValue === option.value ? 'text-gray-600' : 'text-gray-600'}
              `}>
                {option.description}
              </div>
            )}

            {/* Hover effect */}
            <div className={`
              absolute inset-0 rounded-xl bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity duration-300
              from-${option.gradientFrom} to-${option.gradientTo}
            `} />
          </button>
        ))}
      </div>

      {/* Indicador visual de progresso */}
      {selectedValue > 0 && (
        <div className="flex items-center justify-center space-x-2 mt-4">
          <div className="text-gray-600 text-xs">Sua escolha:</div>
          <div className={`
            px-3 py-1 rounded-full text-xs font-medium
            bg-gradient-to-r from-${scale.options[selectedValue - 1].gradientFrom} to-${scale.options[selectedValue - 1].gradientTo}
            text-white
          `}>
            {scale.options[selectedValue - 1].label}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// COMPONENTE: Question Card com Escala
// ============================================================================

interface QuestionCardWithScaleProps {
  questionNumber: number;
  questionText: string;
  category?: string;
  scaleType: keyof typeof PSYCHOLOGICAL_SCALES;
  selectedValue: number;
  onValueChange: (value: number) => void;
  hint?: string;
}

export const QuestionCardWithScale: React.FC<QuestionCardWithScaleProps> = ({
  questionNumber,
  questionText,
  category,
  scaleType,
  selectedValue,
  onValueChange,
  hint
}) => {
  return (
    <div className="bg-gray-50 backdrop-blur-sm border border-gray-200 rounded-2xl p-6 hover:bg-gray-100 transition-all duration-300">
      {/* Header da questão */}
      <div className="flex items-start gap-4 mb-6">
        <div className="bg-purple-500/20 rounded-lg p-2 flex-shrink-0">
          <span className="text-purple-700 font-bold text-sm">{questionNumber}</span>
        </div>
        <div className="flex-grow">
          <h3 className="text-gray-900 text-lg font-medium leading-relaxed mb-2">
            {questionText}
          </h3>
          {category && (
            <div className="text-gray-600 text-sm">
              📊 {category}
            </div>
          )}
          {hint && (
            <div className="text-gray-500 text-xs mt-2 italic">
              💡 {hint}
            </div>
          )}
        </div>
      </div>

      {/* Escala de resposta */}
      <ScaleSelector
        scaleType={scaleType}
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        questionNumber={questionNumber}
        compact={false}
      />
    </div>
  );
};

export default ScaleSelector;