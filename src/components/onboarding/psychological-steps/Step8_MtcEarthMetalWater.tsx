// src/components/onboarding/psychological-steps/Step8_MtcEarthMetalWater.tsx
// ============================================================================
// STEP 8: MTC TERRA, METAL & ÁGUA (Medicina Tradicional Chinesa)
// ============================================================================

import React, { useState, useCallback } from 'react';
import { ChevronRight, ChevronLeft, Mountain, Coins, Waves, Leaf, Circle, Droplets, Shield, Star, Globe } from 'lucide-react';
import { QuestionCardWithScale } from './ScaleSystem';

// ============================================================================
// INTERFACES
// ============================================================================

interface StepProps {
  data: number[];
  onDataChange: (data: number[]) => Promise<void>;
  onNext: () => Promise<void>;
  onPrevious: () => void;
  onStepComplete?: () => void;
}

interface MtcQuestion {
  id: number;
  text: string;
  hint?: string;
  element: 'EARTH' | 'METAL' | 'WATER';
  aspect: string;
}

// ============================================================================
// QUESTÕES MTC - TERRA, METAL & ÁGUA (16 questões total)
// ============================================================================

const MTC_EARTH_METAL_WATER_QUESTIONS: MtcQuestion[] = [
  // === ELEMENTO TERRA (5 questões) ===
  {
    id: 1,
    text: "Eu valorizo estabilidade e me sinto confortável com rotinas bem estabelecidas.",
    hint: "A Terra representa estabilidade, nutrição e centralização.",
    element: 'EARTH',
    aspect: 'Estabilidade'
  },
  {
    id: 2,
    text: "Eu gosto de cuidar e nutrir outras pessoas, oferecendo apoio e segurança.",
    hint: "Reflita sobre sua tendência natural para cuidar e proteger outros.",
    element: 'EARTH',
    aspect: 'Nutrição'
  },
  {
    id: 3,
    text: "Eu me sinto bem quando posso mediar conflitos e trazer harmonia aos grupos.",
    hint: "Considere sua capacidade de equilibrar e harmonizar situações tensas.",
    element: 'EARTH',
    aspect: 'Mediação'
  },
  {
    id: 4,
    text: "Eu prefiro tomar decisões após considerar cuidadosamente todas as perspectivas.",
    hint: "Pense no seu processo de tomada de decisão: reflexivo versus impulsivo.",
    element: 'EARTH',
    aspect: 'Reflexão'
  },
  {
    id: 5,
    text: "Eu me sinto motivado quando posso criar um ambiente seguro e acolhedor para outros.",
    hint: "Avalie sua motivação para criar espaços de segurança e conforto.",
    element: 'EARTH',
    aspect: 'Acolhimento'
  },

  // === ELEMENTO METAL (5 questões) ===
  {
    id: 6,
    text: "Eu valorizo muito a qualidade, precisão e excelência em tudo que faço.",
    hint: "O Metal representa precisão, qualidade e refinamento.",
    element: 'METAL',
    aspect: 'Qualidade'
  },
  {
    id: 7,
    text: "Eu tenho facilidade para organizar sistemas e criar estruturas eficientes.",
    hint: "Reflita sobre sua capacidade de organização e sistematização.",
    element: 'METAL',
    aspect: 'Organização'
  },
  {
    id: 8,
    text: "Eu me sinto bem quando posso refinar e aperfeiçoar processos ou projetos.",
    hint: "Considere sua motivação para melhorar e otimizar continuamente.",
    element: 'METAL',
    aspect: 'Refinamento'
  },
  {
    id: 9,
    text: "Eu valorizo tradições, padrões estabelecidos e métodos comprovados.",
    hint: "Pense na sua relação com tradições versus inovação radical.",
    element: 'METAL',
    aspect: 'Tradição'
  },
  {
    id: 10,
    text: "Eu tenho facilidade para identificar o que é essencial e eliminar o supérfluo.",
    hint: "Avalie sua capacidade de discernir entre o importante e o desnecessário.",
    element: 'METAL',
    aspect: 'Discernimento'
  },

  // === ELEMENTO ÁGUA (6 questões) ===
  {
    id: 11,
    text: "Eu me adapto facilmente a mudanças e fluo com as circunstâncias.",
    hint: "A Água representa adaptabilidade, fluidez e profundidade.",
    element: 'WATER',
    aspect: 'Adaptabilidade'
  },
  {
    id: 12,
    text: "Eu tenho uma forte intuição e confio em minha sabedoria interior.",
    hint: "Reflita sobre sua conexão com a intuição e conhecimento interno.",
    element: 'WATER',
    aspect: 'Intuição'
  },
  {
    id: 13,
    text: "Eu sou naturalmente introspectivo e gosto de momentos de reflexão profunda.",
    hint: "Considere sua tendência para contemplação e autoconhecimento.",
    element: 'WATER',
    aspect: 'Introspecção'
  },
  {
    id: 14,
    text: "Eu tenho facilidade para compreender aspectos ocultos ou sutis das situações.",
    hint: "Pense na sua capacidade de perceber camadas mais profundas da realidade.",
    element: 'WATER',
    aspect: 'Percepção'
  },
  {
    id: 15,
    text: "Eu valorizo a sabedoria que vem da experiência e do tempo.",
    hint: "Avalie sua apreciação pela sabedoria acumulada e conhecimento profundo.",
    element: 'WATER',
    aspect: 'Sabedoria'
  },
  {
    id: 16,
    text: "Eu me sinto energizado quando posso explorar mistérios e descobrir verdades ocultas.",
    hint: "Reflita sobre sua motivação para buscar conhecimento profundo e misterioso.",
    element: 'WATER',
    aspect: 'Mistério'
  }
];

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const Step8_MtcEarthMetalWater: React.FC<StepProps> = ({
  data,
  onDataChange,
  onNext,
  onPrevious,
  onStepComplete
}) => {
  // Estados locais
  const [answers, setAnswers] = useState<number[]>(data || new Array(16).fill(0));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentElement, setCurrentElement] = useState<'EARTH' | 'METAL' | 'WATER'>('EARTH');

  // ============================================================================
  // FUNÇÕES DE NAVEGAÇÃO
  // ============================================================================

  const handleAnswerChange = useCallback(async (questionIndex: number, value: number) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = value;
    setAnswers(newAnswers);
    
    // Salvar automaticamente
    await onDataChange(newAnswers);
    
    // Auto-avançar para próxima questão (se não for a última)
    if (questionIndex < MTC_EARTH_METAL_WATER_QUESTIONS.length - 1 && value > 0) {
      setTimeout(() => {
        const nextIndex = questionIndex + 1;
        setCurrentQuestion(nextIndex);
        
        // Mudar elemento automaticamente quando necessário
        if (nextIndex >= 5 && nextIndex < 10 && currentElement !== 'METAL') {
          setCurrentElement('METAL');
        } else if (nextIndex >= 10 && currentElement !== 'WATER') {
          setCurrentElement('WATER');
        }
      }, 800);
    }
    
    // Verificar se step está completo
    if (newAnswers.every(answer => answer > 0) && onStepComplete) {
      onStepComplete();
    }
  }, [answers, onDataChange, onStepComplete, currentElement]);

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < MTC_EARTH_METAL_WATER_QUESTIONS.length) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuestion(index);
        setIsAnimating(false);
        
        // Atualizar elemento baseado na questão
        if (index < 5) {
          setCurrentElement('EARTH');
        } else if (index < 10) {
          setCurrentElement('METAL');
        } else {
          setCurrentElement('WATER');
        }
      }, 150);
    }
  };

  const handleNext = async () => {
    const allAnswered = answers.every(answer => answer > 0);
    if (allAnswered) {
      await onNext();
    }
  };

  // ============================================================================
  // CÁLCULOS E VALIDAÇÕES
  // ============================================================================

  const progress = (answers.filter(answer => answer > 0).length / MTC_EARTH_METAL_WATER_QUESTIONS.length) * 100;
  const isComplete = answers.every(answer => answer > 0);
  const canProceed = isComplete;

  // Calcular scores dos elementos
  const calculateElementScores = () => {
    if (!isComplete) return { EARTH: 0, METAL: 0, WATER: 0 };
    
    const earthScore = answers.slice(0, 5).reduce((sum, answer) => sum + answer, 0);
    const metalScore = answers.slice(5, 10).reduce((sum, answer) => sum + answer, 0);
    const waterScore = answers.slice(10, 16).reduce((sum, answer) => sum + answer, 0);
    
    return {
      EARTH: Math.round((earthScore / 25) * 100),
      METAL: Math.round((metalScore / 25) * 100),
      WATER: Math.round((waterScore / 30) * 100)
    };
  };

  // Interpretações dos elementos
  const interpretElementProfile = (scores: { EARTH: number; METAL: number; WATER: number }) => {
    const sortedElements = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const dominant = sortedElements[0][0] as 'EARTH' | 'METAL' | 'WATER';
    const secondary = sortedElements[1][0] as 'EARTH' | 'METAL' | 'WATER';
    
    // Verificar se há equilíbrio
    const maxDifference = Math.max(...Object.values(scores)) - Math.min(...Object.values(scores));
    
    if (maxDifference <= 15) {
      return {
        type: "TERRA-METAL-ÁGUA EQUILIBRADO",
        description: "Você possui uma harmonia única entre estabilidade, precisão e adaptabilidade.",
        characteristics: ["Equilibrio natural", "Sabedoria prática", "Adaptabilidade organizada", "Profundidade estável"],
        element: "BALANCED",
        advice: "Continue cultivando este equilíbrio raro entre os três elementos fundamentais."
      };
    }

    // Combinações duais dominantes
    if (scores[dominant] - scores[secondary] <= 10) {
      if ((dominant === 'EARTH' && secondary === 'METAL') || (dominant === 'METAL' && secondary === 'EARTH')) {
        return {
          type: "TERRA-METAL",
          description: "Você combina estabilidade com precisão, criando estruturas sólidas e refinadas.",
          characteristics: ["Organização estável", "Qualidade consistente", "Tradição confiável", "Refinamento prático"],
          element: "EARTH_METAL",
          advice: "Desenvolva mais fluidez para complementar sua base sólida e organizada."
        };
      } else if ((dominant === 'EARTH' && secondary === 'WATER') || (dominant === 'WATER' && secondary === 'EARTH')) {
        return {
          type: "TERRA-ÁGUA",
          description: "Você equilibra estabilidade com adaptabilidade, oferecendo suporte flexível.",
          characteristics: ["Sabedoria nutritiva", "Estabilidade adaptável", "Intuição prática", "Cuidado profundo"],
          element: "EARTH_WATER",
          advice: "Incorpore mais precisão e estrutura para potencializar sua base intuitiva."
        };
      } else if ((dominant === 'METAL' && secondary === 'WATER') || (dominant === 'WATER' && secondary === 'METAL')) {
        return {
          type: "METAL-ÁGUA",
          description: "Você combina precisão com profundidade, refinando através da sabedoria.",
          characteristics: ["Precisão intuitiva", "Qualidade profunda", "Refinamento sábio", "Discernimento fluido"],
          element: "METAL_WATER",
          advice: "Cultive mais estabilidade para ancorar sua combinação refinada e fluida."
        };
      }
    }

    // Elementos individuais dominantes
    switch (dominant) {
      case 'EARTH':
        return {
          type: "TERRA DOMINANTE",
          description: "Você é o centro estabilizador, oferecendo nutrição, cuidado e harmonia.",
          characteristics: ["Nutritivo", "Estável", "Mediador", "Acolhedor"],
          element: "EARTH",
          advice: "Desenvolva mais precisão (Metal) e adaptabilidade (Água) para expandir sua influência."
        };
      case 'METAL':
        return {
          type: "METAL DOMINANTE", 
          description: "Você é orientado à excelência, precisão e refinamento contínuo.",
          characteristics: ["Preciso", "Organizado", "Qualitativo", "Sistemático"],
          element: "METAL",
          advice: "Cultive mais estabilidade (Terra) e fluidez (Água) para suavizar sua abordagem."
        };
      case 'WATER':
        return {
          type: "ÁGUA DOMINANTE",
          description: "Você é profundo, adaptável e conectado com a sabedoria interior.",
          characteristics: ["Intuitivo", "Adaptável", "Profundo", "Sábio"],
          element: "WATER",
          advice: "Desenvolva mais estabilidade (Terra) e estrutura (Metal) para manifestar sua sabedoria."
        };
      default:
        return {
          type: "PERFIL EQUILIBRADO",
          description: "Você apresenta características balanceadas entre os elementos.",
          characteristics: ["Versátil", "Equilibrado", "Adaptável", "Completo"],
          element: "BALANCED",
          advice: "Continue desenvolvendo todos os aspectos de forma harmoniosa."
        };
    }
  };

  const scores = calculateElementScores();
  const interpretation = interpretElementProfile(scores);

  // ============================================================================
  // HELPERS PARA ELEMENTOS
  // ============================================================================

  const getElementIcon = (element: 'EARTH' | 'METAL' | 'WATER') => {
    switch (element) {
      case 'EARTH': return <Mountain className="w-6 h-6" />;
      case 'METAL': return <Coins className="w-6 h-6" />;
      case 'WATER': return <Waves className="w-6 h-6" />;
      default: return <Circle className="w-6 h-6" />;
    }
  };

  const getElementProgress = (element: 'EARTH' | 'METAL' | 'WATER') => {
    let startIndex, endIndex, total;
    switch (element) {
      case 'EARTH': startIndex = 0; endIndex = 5; total = 5; break;
      case 'METAL': startIndex = 5; endIndex = 10; total = 5; break;
      case 'WATER': startIndex = 10; endIndex = 16; total = 6; break;
      default: return 0;
    }
    const elementAnswers = answers.slice(startIndex, endIndex);
    return (elementAnswers.filter(answer => answer > 0).length / total) * 100;
  };

  const getElementColor = (element: 'EARTH' | 'METAL' | 'WATER') => {
    switch (element) {
      case 'EARTH': return 'amber';
      case 'METAL': return 'slate';
      case 'WATER': return 'blue';
      default: return 'gray';
    }
  };

  const getElementName = (element: 'EARTH' | 'METAL' | 'WATER') => {
    switch (element) {
      case 'EARTH': return 'Terra';
      case 'METAL': return 'Metal';
      case 'WATER': return 'Água';
      default: return '';
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3">
          <div className={`bg-${getElementColor(currentElement)}-500/20 p-3 rounded-xl`}>
            {getElementIcon(currentElement)}
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Elemento {getElementName(currentElement)}
          </h2>
        </div>
        <p className="text-gray-700 text-lg max-w-2xl mx-auto">
          {currentElement === 'EARTH' 
            ? 'Explore sua conexão com estabilidade, nutrição, mediação e acolhimento.'
            : currentElement === 'METAL'
            ? 'Descubra sua afinidade com qualidade, organização, refinamento e tradição.'
            : 'Investigue sua ligação com adaptabilidade, intuição, profundidade e sabedoria.'
          }
        </p>

        {/* Progress Bar */}
        <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className={`bg-gradient-to-r ${
              currentElement === 'EARTH' 
                ? 'from-amber-500 to-yellow-500'
                : currentElement === 'METAL'
                ? 'from-slate-500 to-gray-500'
                : 'from-blue-500 to-cyan-500'
            } h-full transition-all duration-700 ease-out`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-gray-600 text-sm">
          {answers.filter(answer => answer > 0).length} de {MTC_EARTH_METAL_WATER_QUESTIONS.length} questões respondidas
        </p>
      </div>

      {/* Elemento Switcher */}
      <div className="flex justify-center space-x-3">
        <button
          onClick={() => {
            setCurrentElement('EARTH');
            if (currentQuestion >= 5) goToQuestion(0);
          }}
          className={`
            flex items-center px-4 py-3 rounded-xl transition-all font-medium text-sm
            ${currentElement === 'EARTH'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          <Mountain className="w-4 h-4 mr-2" />
          Terra ({Math.round(getElementProgress('EARTH'))}%)
        </button>
        <button
          onClick={() => {
            setCurrentElement('METAL');
            if (currentQuestion < 5 || currentQuestion >= 10) goToQuestion(5);
          }}
          className={`
            flex items-center px-4 py-3 rounded-xl transition-all font-medium text-sm
            ${currentElement === 'METAL'
              ? 'bg-gradient-to-r from-slate-500 to-gray-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          <Coins className="w-4 h-4 mr-2" />
          Metal ({Math.round(getElementProgress('METAL'))}%)
        </button>
        <button
          onClick={() => {
            setCurrentElement('WATER');
            if (currentQuestion < 10) goToQuestion(10);
          }}
          className={`
            flex items-center px-4 py-3 rounded-xl transition-all font-medium text-sm
            ${currentElement === 'WATER'
              ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          <Waves className="w-4 h-4 mr-2" />
          Água ({Math.round(getElementProgress('WATER'))}%)
        </button>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center space-x-2">
        {MTC_EARTH_METAL_WATER_QUESTIONS.map((_, index) => {
          let isCurrentElement = false;
          let displayNumber = 0;
          
          if (currentElement === 'EARTH' && index < 5) {
            isCurrentElement = true;
            displayNumber = index + 1;
          } else if (currentElement === 'METAL' && index >= 5 && index < 10) {
            isCurrentElement = true;
            displayNumber = index - 4;
          } else if (currentElement === 'WATER' && index >= 10) {
            isCurrentElement = true;
            displayNumber = index - 9;
          }
          
          if (!isCurrentElement) return null;
          
          return (
            <button
              key={index}
              onClick={() => goToQuestion(index)}
              className={`
                w-8 h-8 rounded-full transition-all duration-300 text-sm font-medium
                ${currentQuestion === index
                  ? `bg-${getElementColor(currentElement)}-500 text-white scale-110`
                  : answers[index] > 0
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }
              `}
            >
              {displayNumber}
            </button>
          );
        })}
      </div>

      {/* Questão Atual */}
      <div className={`transition-opacity duration-150 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
        <QuestionCardWithScale
          questionNumber={currentQuestion + 1}
          questionText={MTC_EARTH_METAL_WATER_QUESTIONS[currentQuestion].text}
          category={`${getElementName(MTC_EARTH_METAL_WATER_QUESTIONS[currentQuestion].element)} - ${MTC_EARTH_METAL_WATER_QUESTIONS[currentQuestion].aspect}`}
          scaleType="agreement"
          selectedValue={answers[currentQuestion]}
          onValueChange={(value) => handleAnswerChange(currentQuestion, value)}
          hint={MTC_EARTH_METAL_WATER_QUESTIONS[currentQuestion].hint}
        />
      </div>

      {/* Perfil dos elementos identificado (se completo) */}
      {isComplete && (
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-gray-900 font-medium mb-4 flex items-center">
            <Globe className="w-5 h-5 text-purple-600 mr-2" />
            Perfil Elemental Final Identificado
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Interpretação principal */}
            <div>
              <h4 className={`text-${
                interpretation.element === 'EARTH' ? 'amber' :
                interpretation.element === 'METAL' ? 'slate' :
                interpretation.element === 'WATER' ? 'blue' :
                'purple'
              }-400 font-medium mb-2`}>
                {interpretation.type}
              </h4>
              <p className="text-gray-700 text-sm mb-4">{interpretation.description}</p>
              
              {/* Scores dos elementos */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-amber-600 text-xl font-bold flex items-center justify-center">
                    <Mountain className="w-5 h-5 mr-1" />
                    {scores.EARTH}%
                  </div>
                  <div className="text-gray-600 text-xs">Terra</div>
                </div>
                <div className="text-center">
                  <div className="text-gray-600 text-xl font-bold flex items-center justify-center">
                    <Coins className="w-5 h-5 mr-1" />
                    {scores.METAL}%
                  </div>
                  <div className="text-gray-600 text-xs">Metal</div>
                </div>
                <div className="text-center">
                  <div className="text-blue-600 text-xl font-bold flex items-center justify-center">
                    <Waves className="w-5 h-5 mr-1" />
                    {scores.WATER}%
                  </div>
                  <div className="text-gray-600 text-xs">Água</div>
                </div>
              </div>
            </div>

            {/* Características */}
            <div>
              <h5 className="text-gray-900 font-medium mb-3">Características Identificadas:</h5>
              <div className="space-y-2 mb-4">
                {interpretation.characteristics.map((char, idx) => (
                  <div key={idx} className="flex items-center text-green-600">
                    <Star className="w-4 h-4 mr-2" />
                    <span className="text-sm">{char}</span>
                  </div>
                ))}
              </div>

              {/* Dica de desenvolvimento */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <h6 className="text-amber-600 font-medium text-sm mb-2">💡 Dica de Desenvolvimento:</h6>
                <p className="text-gray-700 text-xs">
                  {interpretation.advice}
                </p>
              </div>
            </div>
          </div>

          {/* Resumo completo dos 5 elementos */}
          <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-500/20">
            <h4 className="text-purple-600 font-medium mb-3 flex items-center">
              <Shield className="w-5 h-5 mr-2" />
              🎉 Parabéns! Avaliação Psicológica Completa
            </h4>
            <p className="text-gray-700 text-sm">
              Você concluiu todos os 8 steps da avaliação psicológica mais avançada disponível! 
              Seu perfil inclui Big Five, DISC, VARK e os 5 Elementos da MTC. 
              Agora você possui um mapeamento completo de sua personalidade, comportamento, 
              estilo de aprendizagem e energia elemental.
            </p>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-8">
        <button
          onClick={onPrevious}
          className="flex items-center px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-2" />
          Anterior
        </button>

        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={`
            flex items-center px-6 py-3 rounded-xl transition-all font-medium
            ${canProceed
              ? 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white'
              : 'bg-gray-100 text-gray-600 cursor-not-allowed'
            }
          `}
        >
          {canProceed ? 'Finalizar Avaliação' : 'Complete todas as questões'}
          <ChevronRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default Step8_MtcEarthMetalWater;