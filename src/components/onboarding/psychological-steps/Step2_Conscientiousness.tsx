// src/components/onboarding/psychological-steps/Step2_Conscientiousness.tsx
// ============================================================================
// STEP 2: CONSCIENCIOSIDADE (Big Five)
// ============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { ChevronRight, ChevronLeft, Target, CheckSquare, Clock, Zap } from 'lucide-react';
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

interface ConscientiousnessQuestion {
  id: number;
  text: string;
  hint?: string;
  reversed?: boolean;
}

// ============================================================================
// QUESTÕES DO BIG FIVE - CONSCIENCIOSIDADE
// ============================================================================

const CONSCIENTIOUSNESS_QUESTIONS: ConscientiousnessQuestion[] = [
  {
    id: 1,
    text: "Eu sempre cumpro meus prazos e compromissos.",
    hint: "Reflita sobre sua pontualidade e confiabilidade em entregas e encontros."
  },
  {
    id: 2,
    text: "Eu gosto de planejar minhas atividades com antecedência.",
    hint: "Pense se você prefere ter uma agenda organizada ou ser mais espontâneo."
  },
  {
    id: 3,
    text: "Eu frequentemente deixo tarefas importantes para a última hora.",
    hint: "Considere sua tendência à procrastinação em responsabilidades importantes.",
    reversed: true
  },
  {
    id: 4,
    text: "Eu sou uma pessoa muito organizada e metódica.",
    hint: "Avalie como você mantém seus espaços, arquivos e processos de trabalho."
  },
  {
    id: 5,
    text: "Eu persisto em meus objetivos mesmo quando encontro obstáculos.",
    hint: "Reflita sobre sua determinação diante de dificuldades e desafios."
  },
  {
    id: 6,
    text: "Eu tenho dificuldade para me concentrar em uma tarefa por muito tempo.",
    hint: "Pense na sua capacidade de manter foco sustentado em atividades.",
    reversed: true
  },
  {
    id: 7,
    text: "Eu me esforço para fazer tudo da melhor forma possível.",
    hint: "Considere seu nível de perfeccionismo e busca pela excelência."
  },
  {
    id: 8,
    text: "Eu tenho autodisciplina para resistir a tentações e distrações.",
    hint: "Avalie sua capacidade de autocontrole em situações desafiadoras."
  }
];

// ============================================================================
// COMPONENTE PRINCIPAL
// ============================================================================

const Step2_Conscientiousness: React.FC<StepProps> = ({
  data,
  onDataChange,
  onNext,
  onPrevious,
  onStepComplete
}) => {
  // Estados locais
  const [answers, setAnswers] = useState<number[]>(data || new Array(8).fill(0));
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

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
    if (questionIndex < CONSCIENTIOUSNESS_QUESTIONS.length - 1 && value > 0) {
      setTimeout(() => {
        setCurrentQuestion(questionIndex + 1);
      }, 800);
    }
    
    // Verificar se step está completo
    if (newAnswers.every(answer => answer > 0) && onStepComplete) {
      onStepComplete();
    }
  }, [answers, onDataChange, onStepComplete]);

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < CONSCIENTIOUSNESS_QUESTIONS.length) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuestion(index);
        setIsAnimating(false);
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

  const progress = (answers.filter(answer => answer > 0).length / CONSCIENTIOUSNESS_QUESTIONS.length) * 100;
  const isComplete = answers.every(answer => answer > 0);
  const canProceed = isComplete;

  // Calcular score de conscienciosidade (com questões reversas)
  const calculateConscientiousnessScore = () => {
    if (!isComplete) return 0;
    
    let totalScore = 0;
    answers.forEach((answer, index) => {
      const question = CONSCIENTIOUSNESS_QUESTIONS[index];
      const score = question.reversed ? (6 - answer) : answer;
      totalScore += score;
    });
    
    // Converter para escala 0-100
    return Math.round((totalScore / 40) * 100);
  };

  const conscientiousnessScore = calculateConscientiousnessScore();

  // Interpretação do score
  const getScoreInterpretation = (score: number) => {
    if (score >= 80) return { level: "Muito Alto", desc: "Extremamente organizado e disciplinado", color: "emerald" };
    if (score >= 65) return { level: "Alto", desc: "Bem organizado e confiável", color: "green" };
    if (score >= 50) return { level: "Médio", desc: "Equilibrio entre ordem e flexibilidade", color: "blue" };
    if (score >= 35) return { level: "Baixo", desc: "Mais espontâneo e flexível", color: "orange" };
    return { level: "Muito Baixo", desc: "Muito flexível e improvisador", color: "red" };
  };

  const interpretation = getScoreInterpretation(conscientiousnessScore);

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="space-y-6">
      {/* Header do Step */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full p-3">
            <Target className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          Conscienciosidade
        </h2>
        <p className="text-gray-700 text-lg max-w-2xl mx-auto">
          Como você se organiza e se disciplina para alcançar seus objetivos?
        </p>
        
        {/* Barra de Progresso */}
        <div className="mt-6 max-w-md mx-auto">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600 text-sm">Progresso do Step</span>
            <span className="text-gray-600 text-sm">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Score atual (se completo) */}
        {isComplete && (
          <div className="mt-4 p-4 bg-gradient-to-r from-blue-500/20 to-indigo-600/20 rounded-xl border border-blue-500/30">
            <div className="flex items-center justify-center space-x-3 mb-2">
              <CheckSquare className="w-5 h-5 text-blue-600" />
              <span className="text-gray-900 font-medium">
                Seu Score de Conscienciosidade: <span className="text-2xl font-bold text-blue-700">{conscientiousnessScore}</span>/100
              </span>
              <Target className="w-5 h-5 text-indigo-600" />
            </div>
            <div className={`text-${interpretation.color}-400 text-sm font-medium`}>
              {interpretation.level}: {interpretation.desc}
            </div>
          </div>
        )}
      </div>

      {/* Navegação entre questões */}
      <div className="flex items-center justify-center space-x-2 mb-6">
        {CONSCIENTIOUSNESS_QUESTIONS.map((_, index) => (
          <button
            key={index}
            onClick={() => goToQuestion(index)}
            className={`
              w-8 h-8 rounded-full text-sm font-medium transition-all duration-300
              ${index === currentQuestion
                ? 'bg-blue-500 text-white scale-110'
                : answers[index] > 0
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
          >
            {index + 1}
          </button>
        ))}
      </div>

      {/* Questão Atual */}
      <div className={`transition-opacity duration-150 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}>
        <QuestionCardWithScale
          questionNumber={currentQuestion + 1}
          questionText={CONSCIENTIOUSNESS_QUESTIONS[currentQuestion].text}
          category="Conscienciosidade"
          scaleType="agreement"
          selectedValue={answers[currentQuestion]}
          onValueChange={(value) => handleAnswerChange(currentQuestion, value)}
          hint={CONSCIENTIOUSNESS_QUESTIONS[currentQuestion].hint}
        />
      </div>

      {/* Indicadores de características (se completo) */}
      {isComplete && (
        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
          <h3 className="text-gray-900 font-medium mb-4 flex items-center">
            <Zap className="w-5 h-5 text-blue-600 mr-2" />
            Características Identificadas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {conscientiousnessScore >= 65 && (
              <>
                <div className="flex items-center text-green-600">
                  <CheckSquare className="w-4 h-4 mr-2" />
                  <span className="text-sm">Organização natural</span>
                </div>
                <div className="flex items-center text-green-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm">Pontualidade consistente</span>
                </div>
              </>
            )}
            {conscientiousnessScore >= 50 && conscientiousnessScore < 65 && (
              <>
                <div className="flex items-center text-blue-600">
                  <Target className="w-4 h-4 mr-2" />
                  <span className="text-sm">Equilibrio ordem/flexibilidade</span>
                </div>
                <div className="flex items-center text-blue-600">
                  <CheckSquare className="w-4 h-4 mr-2" />
                  <span className="text-sm">Organização situacional</span>
                </div>
              </>
            )}
            {conscientiousnessScore < 50 && (
              <>
                <div className="flex items-center text-orange-600">
                  <Zap className="w-4 h-4 mr-2" />
                  <span className="text-sm">Espontaneidade natural</span>
                </div>
                <div className="flex items-center text-orange-600">
                  <Target className="w-4 h-4 mr-2" />
                  <span className="text-sm">Adaptabilidade alta</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Navegação entre questões */}
      <div className="flex items-center justify-between pt-6">
        <button
          onClick={() => goToQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
          className={`
            flex items-center px-4 py-2 rounded-lg transition-colors
            ${currentQuestion === 0
              ? 'text-gray-500 cursor-not-allowed'
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
            }
          `}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Questão Anterior
        </button>

        <div className="text-gray-600 text-sm">
          Questão {currentQuestion + 1} de {CONSCIENTIOUSNESS_QUESTIONS.length}
        </div>

        <button
          onClick={() => goToQuestion(Math.min(CONSCIENTIOUSNESS_QUESTIONS.length - 1, currentQuestion + 1))}
          disabled={currentQuestion === CONSCIENTIOUSNESS_QUESTIONS.length - 1}
          className={`
            flex items-center px-4 py-2 rounded-lg transition-colors
            ${currentQuestion === CONSCIENTIOUSNESS_QUESTIONS.length - 1
              ? 'text-gray-500 cursor-not-allowed'
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
            }
          `}
        >
          Próxima Questão
          <ChevronRight className="w-4 h-4 ml-2" />
        </button>
      </div>

      {/* Botões de navegação do step */}
      <div className="flex items-center justify-between pt-8 border-t border-gray-200">
        <button
          onClick={onPrevious}
          className="flex items-center px-6 py-3 text-gray-700 hover:text-gray-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Step Anterior
        </button>

        <div className="text-center">
          <div className="text-gray-600 text-sm mb-1">
            {answers.filter(a => a > 0).length} de {CONSCIENTIOUSNESS_QUESTIONS.length} questões respondidas
          </div>
          {!canProceed && (
            <div className="text-amber-600 text-xs">
              ⚠️ Responda todas as questões para continuar
            </div>
          )}
        </div>

        <button
          onClick={handleNext}
          disabled={!canProceed}
          className={`
            flex items-center px-6 py-3 rounded-lg font-medium transition-all
            ${canProceed
              ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg hover:scale-105'
              : 'bg-gray-100 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          Próximo Step
          <ChevronRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default Step2_Conscientiousness;