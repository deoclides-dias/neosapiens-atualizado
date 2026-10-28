// src/components/onboarding/psychological-steps/Step7_MtcWoodFire.tsx
// ============================================================================
// STEP 7: MTC MADEIRA & FOGO (Medicina Tradicional Chinesa)
// ============================================================================

import React, { useState, useCallback } from 'react';
import { ChevronRight, ChevronLeft, TreePine, Flame, Sprout, Zap, Heart, Sun, Target, Users } from 'lucide-react';
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
  element: 'WOOD' | 'FIRE';
  aspect: string;
}

// ============================================================================
// QUESTÕES MTC - MADEIRA & FOGO (16 questões total)
// ============================================================================

const MTC_WOOD_FIRE_QUESTIONS: MtcQuestion[] = [
  // === ELEMENTO MADEIRA (8 questões) ===
  {
    id: 1,
    text: "Eu tenho facilidade para visualizar e planejar projetos de longo prazo.",
    hint: "A Madeira representa crescimento, visão e planejamento estratégico.",
    element: 'WOOD',
    aspect: 'Visão e Planejamento'
  },
  {
    id: 2,
    text: "Eu me sinto energizado quando estou iniciando novos projetos ou desafios.",
    hint: "Reflita sobre sua energia ao começar algo novo e desafiador.",
    element: 'WOOD',
    aspect: 'Crescimento'
  },
  {
    id: 3,
    text: "Eu tenho facilidade para me adaptar e encontrar soluções criativas para problemas.",
    hint: "A Madeira simboliza flexibilidade e capacidade de adaptação.",
    element: 'WOOD',
    aspect: 'Flexibilidade'
  },
  {
    id: 4,
    text: "Eu me irrito facilmente quando me sinto limitado ou controlado.",
    hint: "Pense na sua reação quando sua liberdade de ação é restringida.",
    element: 'WOOD',
    aspect: 'Liberdade'
  },
  {
    id: 5,
    text: "Eu gosto de liderar e tomar iniciativas em grupos ou projetos.",
    hint: "Avalie sua tendência natural para assumir liderança e direção.",
    element: 'WOOD',
    aspect: 'Liderança'
  },
  {
    id: 6,
    text: "Eu tendo a ser assertivo e direto ao expressar minhas opiniões.",
    hint: "Considere seu estilo de comunicação: direto versus diplomático.",
    element: 'WOOD',
    aspect: 'Assertividade'
  },
  {
    id: 7,
    text: "Eu me sinto motivado por competições e desafios que testam minhas habilidades.",
    hint: "Reflita sobre como competições e desafios afetam sua motivação.",
    element: 'WOOD',
    aspect: 'Competitividade'
  },
  {
    id: 8,
    text: "Eu tenho uma forte necessidade de crescimento pessoal e desenvolvimento contínuo.",
    hint: "Pense na importância do crescimento e evolução em sua vida.",
    element: 'WOOD',
    aspect: 'Desenvolvimento'
  },

  // === ELEMENTO FOGO (8 questões) ===
  {
    id: 9,
    text: "Eu me sinto genuinamente feliz quando estou conectado com outras pessoas.",
    hint: "O Fogo representa conexão, alegria e relacionamentos calorosos.",
    element: 'FIRE',
    aspect: 'Conexão Social'
  },
  {
    id: 10,
    text: "Eu consigo facilmente expressar entusiasmo e inspirar outras pessoas.",
    hint: "Avalie sua capacidade de transmitir energia positiva e motivação.",
    element: 'FIRE',
    aspect: 'Entusiasmo'
  },
  {
    id: 11,
    text: "Eu tenho facilidade para comunicar ideias de forma clara e envolvente.",
    hint: "Considere sua habilidade natural para comunicação expressiva.",
    element: 'FIRE',
    aspect: 'Comunicação'
  },
  {
    id: 12,
    text: "Eu me sinto energizado em ambientes sociais e celebrações.",
    hint: "Reflita sobre como eventos sociais e festividades afetam sua energia.",
    element: 'FIRE',
    aspect: 'Sociabilidade'
  },
  {
    id: 13,
    text: "Eu tendo a ser espontâneo e me guiar pela intuição e emoções.",
    hint: "Pense na sua tendência a agir por impulso versus planejamento detalhado.",
    element: 'FIRE',
    aspect: 'Espontaneidade'
  },
  {
    id: 14,
    text: "Eu valorizo relacionamentos calorosos e demonstro afeto facilmente.",
    hint: "Avalie sua facilidade para expressar carinho e criar vínculos.",
    element: 'FIRE',
    aspect: 'Afetividade'
  },
  {
    id: 15,
    text: "Eu tenho facilidade para ver o lado positivo das situações e das pessoas.",
    hint: "Considere sua tendência natural para otimismo e positividade.",
    element: 'FIRE',
    aspect: 'Otimismo'
  },
  {
    id: 16,
    text: "Eu me sinto motivado quando posso contribuir para a felicidade dos outros.",
    hint: "Reflita sobre como o bem-estar alheio influencia sua própria motivação.",
    element: 'FIRE',
    aspect: 'Altruísmo'
  }
];

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const Step7_MtcWoodFire: React.FC<StepProps> = ({
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
  const [currentElement, setCurrentElement] = useState<'WOOD' | 'FIRE'>('WOOD');

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
    if (questionIndex < MTC_WOOD_FIRE_QUESTIONS.length - 1 && value > 0) {
      setTimeout(() => {
        const nextIndex = questionIndex + 1;
        setCurrentQuestion(nextIndex);
        
        // Mudar elemento automaticamente quando necessário
        if (nextIndex >= 8 && currentElement === 'WOOD') {
          setCurrentElement('FIRE');
        }
      }, 800);
    }
    
    // Verificar se step está completo
    if (newAnswers.every(answer => answer > 0) && onStepComplete) {
      onStepComplete();
    }
  }, [answers, onDataChange, onStepComplete, currentElement]);

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < MTC_WOOD_FIRE_QUESTIONS.length) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuestion(index);
        setIsAnimating(false);
        
        // Atualizar elemento baseado na questão
        if (index < 8) {
          setCurrentElement('WOOD');
        } else {
          setCurrentElement('FIRE');
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

  const progress = (answers.filter(answer => answer > 0).length / MTC_WOOD_FIRE_QUESTIONS.length) * 100;
  const isComplete = answers.every(answer => answer > 0);
  const canProceed = isComplete;

  // Calcular scores dos elementos
  const calculateElementScores = () => {
    if (!isComplete) return { WOOD: 0, FIRE: 0 };
    
    const woodScore = answers.slice(0, 8).reduce((sum, answer) => sum + answer, 0);
    const fireScore = answers.slice(8, 16).reduce((sum, answer) => sum + answer, 0);
    
    return {
      WOOD: Math.round((woodScore / 40) * 100),
      FIRE: Math.round((fireScore / 40) * 100)
    };
  };

  // Interpretações dos elementos
  const interpretElementProfile = (scores: { WOOD: number; FIRE: number }) => {
    const dominant = scores.WOOD > scores.FIRE ? 'WOOD' : 'FIRE';
    const balance = Math.abs(scores.WOOD - scores.FIRE);
    
    if (balance <= 10) {
      return {
        type: "MADEIRA-FOGO EQUILIBRADO",
        description: "Você possui um equilíbrio harmonioso entre crescimento e conexão, planejamento e espontaneidade.",
        characteristics: ["Visionário comunicativo", "Líder inspirador", "Crescimento social", "Energia direcionada"],
        element: "BALANCED"
      };
    } else if (dominant === 'WOOD') {
      return {
        type: "MADEIRA DOMINANTE",
        description: "Você é orientado ao crescimento, planejamento e desenvolvimento, com forte capacidade de liderança.",
        characteristics: ["Visionário estratégico", "Líder natural", "Orientado ao crescimento", "Assertivo"],
        element: "WOOD"
      };
    } else {
      return {
        type: "FOGO DOMINANTE",
        description: "Você é orientado à conexão, comunicação e relacionamentos, com grande capacidade de inspirar.",
        characteristics: ["Comunicador nato", "Inspirador", "Conectivo social", "Entusiasmado"],
        element: "FIRE"
      };
    }
  };

  const scores = calculateElementScores();
  const interpretation = interpretElementProfile(scores);

  // ============================================================================
  // HELPERS PARA ELEMENTOS
  // ============================================================================

  const getElementIcon = (element: 'WOOD' | 'FIRE') => {
    if (element === 'WOOD') {
      return <TreePine className="w-6 h-6" />;
    } else {
      return <Flame className="w-6 h-6" />;
    }
  };

  const getElementProgress = (element: 'WOOD' | 'FIRE') => {
    const startIndex = element === 'WOOD' ? 0 : 8;
    const endIndex = element === 'WOOD' ? 8 : 16;
    const elementAnswers = answers.slice(startIndex, endIndex);
    return (elementAnswers.filter(answer => answer > 0).length / 8) * 100;
  };

  const getElementColor = (element: 'WOOD' | 'FIRE') => {
    return element === 'WOOD' ? 'emerald' : 'red';
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
            {currentElement === 'WOOD' ? (
              <TreePine className={`w-8 h-8 text-${getElementColor(currentElement)}-400`} />
            ) : (
              <Flame className={`w-8 h-8 text-${getElementColor(currentElement)}-400`} />
            )}
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Elemento {currentElement === 'WOOD' ? 'Madeira' : 'Fogo'}
          </h2>
        </div>
        <p className="text-gray-700 text-lg max-w-2xl mx-auto">
          {currentElement === 'WOOD' 
            ? 'Explore sua conexão com crescimento, visão, liderança e desenvolvimento pessoal.'
            : 'Descubra sua afinidade com comunicação, relacionamentos, alegria e conexões sociais.'
          }
        </p>

        {/* Progress Bar */}
        <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
          <div 
            className={`bg-gradient-to-r ${currentElement === 'WOOD' 
              ? 'from-emerald-500 to-green-500' 
              : 'from-red-500 to-orange-500'
            } h-full transition-all duration-700 ease-out`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-gray-600 text-sm">
          {answers.filter(answer => answer > 0).length} de {MTC_WOOD_FIRE_QUESTIONS.length} questões respondidas
        </p>
      </div>

      {/* Elemento Switcher */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => {
            setCurrentElement('WOOD');
            if (currentQuestion >= 8) goToQuestion(0);
          }}
          className={`
            flex items-center px-6 py-3 rounded-xl transition-all font-medium
            ${currentElement === 'WOOD'
              ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          <TreePine className="w-5 h-5 mr-2" />
          Madeira ({Math.round(getElementProgress('WOOD'))}%)
        </button>
        <button
          onClick={() => {
            setCurrentElement('FIRE');
            if (currentQuestion < 8) goToQuestion(8);
          }}
          className={`
            flex items-center px-6 py-3 rounded-xl transition-all font-medium
            ${currentElement === 'FIRE'
              ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }
          `}
        >
          <Flame className="w-5 h-5 mr-2" />
          Fogo ({Math.round(getElementProgress('FIRE'))}%)
        </button>
      </div>

      {/* Navigation Dots */}
      <div className="flex justify-center space-x-2">
        {MTC_WOOD_FIRE_QUESTIONS.map((_, index) => {
          const isCurrentElement = currentElement === 'WOOD' ? index < 8 : index >= 8;
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
              {(index % 8) + 1}
            </button>
          );
        })}
      </div>

      {/* Questão Atual */}
      <div className={`transition-opacity duration-150 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
        <QuestionCardWithScale
          questionNumber={currentQuestion + 1}
          questionText={MTC_WOOD_FIRE_QUESTIONS[currentQuestion].text}
          category={`${MTC_WOOD_FIRE_QUESTIONS[currentQuestion].element === 'WOOD' ? 'Madeira' : 'Fogo'} - ${MTC_WOOD_FIRE_QUESTIONS[currentQuestion].aspect}`}
          scaleType="agreement"
          selectedValue={answers[currentQuestion]}
          onValueChange={(value) => handleAnswerChange(currentQuestion, value)}
          hint={MTC_WOOD_FIRE_QUESTIONS[currentQuestion].hint}
        />
      </div>

      {/* Perfil dos elementos identificado (se completo) */}
      {isComplete && (
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-gray-900 font-medium mb-4 flex items-center">
            <Sun className="w-5 h-5 text-amber-600 mr-2" />
            Perfil Elemental Identificado
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Interpretação principal */}
            <div>
              <h4 className={`text-${interpretation.element === 'WOOD' ? 'emerald' : interpretation.element === 'FIRE' ? 'red' : 'yellow'}-400 font-medium mb-2`}>
                {interpretation.type}
              </h4>
              <p className="text-gray-700 text-sm mb-4">{interpretation.description}</p>
              
              {/* Scores dos elementos */}
              <div className="flex space-x-4 mb-4">
                <div className="text-center">
                  <div className="text-emerald-600 text-2xl font-bold flex items-center justify-center">
                    <TreePine className="w-6 h-6 mr-1" />
                    {scores.WOOD}%
                  </div>
                  <div className="text-gray-600 text-sm">Madeira</div>
                </div>
                <div className="text-center">
                  <div className="text-red-600 text-2xl font-bold flex items-center justify-center">
                    <Flame className="w-6 h-6 mr-1" />
                    {scores.FIRE}%
                  </div>
                  <div className="text-gray-600 text-sm">Fogo</div>
                </div>
              </div>
            </div>

            {/* Características */}
            <div>
              <h5 className="text-gray-900 font-medium mb-3">Características Identificadas:</h5>
              <div className="space-y-2">
                {interpretation.characteristics.map((char, idx) => (
                  <div key={idx} className="flex items-center text-green-600">
                    {interpretation.element === 'WOOD' ? (
                      <Sprout className="w-4 h-4 mr-2" />
                    ) : interpretation.element === 'FIRE' ? (
                      <Zap className="w-4 h-4 mr-2" />
                    ) : (
                      <Target className="w-4 h-4 mr-2" />
                    )}
                    <span className="text-sm">{char}</span>
                  </div>
                ))}
              </div>

              {/* Dicas de desenvolvimento */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <h6 className="text-amber-600 font-medium text-sm mb-2">💡 Dica de Desenvolvimento:</h6>
                <p className="text-gray-700 text-xs">
                  {interpretation.element === 'WOOD' 
                    ? "Desenvolva mais sua capacidade de conexão emocional e comunicação calorosa para equilibrar sua energia de crescimento."
                    : interpretation.element === 'FIRE'
                    ? "Cultive mais planejamento estratégico e visão de longo prazo para canalizar melhor sua energia social."
                    : "Continue desenvolvendo ambos os aspectos - sua energia de crescimento e sua capacidade de conexão trabalham em harmonia."
                  }
                </p>
              </div>
            </div>
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
              ? `bg-gradient-to-r from-${getElementColor(currentElement)}-500 to-${currentElement === 'WOOD' ? 'green' : 'orange'}-500 hover:from-${getElementColor(currentElement)}-600 hover:to-${currentElement === 'WOOD' ? 'green' : 'orange'}-600 text-white`
              : 'bg-gray-100 text-gray-600 cursor-not-allowed'
            }
          `}
        >
          Próximo
          <ChevronRight className="w-5 h-5 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default Step7_MtcWoodFire;