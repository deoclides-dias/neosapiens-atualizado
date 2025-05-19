import React, { useState } from 'react';

type Question = {
  id: string;
  dimension: 'purpose' | 'body' | 'mind';
  text: string;
  icon: string;
};

type QuestionAnswer = {
  questionId: string;
  value: number;
};

type MiniQuestionnaireProps = {
  onSubmit: (data: { purpose: number; body: number; mind: number }) => void;
};

const MINI_QUESTIONS: Question[] = [
  {
    id: 'purpose-1',
    dimension: 'purpose',
    text: 'Em que medida você sente clareza sobre seu propósito na vida atual?',
    icon: '🧭'
  },
  {
    id: 'purpose-2',
    dimension: 'purpose',
    text: 'Com que frequência suas ações diárias estão alinhadas com seus valores mais profundos?',
    icon: '🎯'
  },
  {
    id: 'body-1',
    dimension: 'body',
    text: 'Como você avaliaria seu nível de energia ao longo de um dia típico?',
    icon: '🧬'
  },
  {
    id: 'body-2',
    dimension: 'body',
    text: 'Quão conectado você se sente com os sinais e necessidades do seu corpo?',
    icon: '💪'
  },
  {
    id: 'mind-1',
    dimension: 'mind',
    text: 'Com que facilidade você consegue manter foco em tarefas importantes sem distração?',
    icon: '📚'
  },
  {
    id: 'mind-2',
    dimension: 'mind',
    text: 'Quão frequentemente você experimenta insights criativos ou novas perspectivas?',
    icon: '💡'
  }
];

const MiniQuestionnaire: React.FC<MiniQuestionnaireProps> = ({ onSubmit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuestionAnswer[]>([]);
  const [transitionClass, setTransitionClass] = useState('');
  
  const currentQuestion = MINI_QUESTIONS[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === MINI_QUESTIONS.length - 1;
  const progress = ((currentQuestionIndex + 1) / MINI_QUESTIONS.length) * 100;
  
  const getDimensionColor = (dimension: string) => {
    switch (dimension) {
      case 'purpose':
        return {
          bg: 'bg-purple-100',
          text: 'text-purple-800',
          light: 'bg-purple-100',
          border: 'border-purple-300',
          button: 'bg-purple-600 hover:bg-purple-700',
          progress: 'bg-purple-600'
        };
      case 'body':
        return {
          bg: 'bg-green-100',
          text: 'text-green-800',
          light: 'bg-green-100',
          border: 'border-green-300',
          button: 'bg-green-600 hover:bg-green-700',
          progress: 'bg-green-600'
        };
      case 'mind':
        return {
          bg: 'bg-blue-100',
          text: 'text-blue-800',
          light: 'bg-blue-100',
          border: 'border-blue-300',
          button: 'bg-blue-600 hover:bg-blue-700',
          progress: 'bg-blue-600'
        };
      default:
        return {
          bg: 'bg-indigo-100',
          text: 'text-indigo-800',
          light: 'bg-indigo-100',
          border: 'border-indigo-300',
          button: 'bg-indigo-600 hover:bg-indigo-700',
          progress: 'bg-indigo-600'
        };
    }
  };
  
  const colors = currentQuestion ? getDimensionColor(currentQuestion.dimension) : getDimensionColor('');
  
  const handleAnswer = (value: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = {
      questionId: currentQuestion.id,
      value
    };
    
    setAnswers(newAnswers);
    
    // Animar a transição
    setTransitionClass('animate-fadeOut');
    
    setTimeout(() => {
      if (isLastQuestion) {
        submitAnswers(newAnswers);
      } else {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setTransitionClass('animate-fadeIn');
      }
    }, 300);
  };
  
  const submitAnswers = (finalAnswers: QuestionAnswer[]) => {
    // Calcular média para cada dimensão
    const purposeAnswers = finalAnswers.filter(a => 
      MINI_QUESTIONS.find(q => q.id === a.questionId)?.dimension === 'purpose'
    );
    
    const bodyAnswers = finalAnswers.filter(a => 
      MINI_QUESTIONS.find(q => q.id === a.questionId)?.dimension === 'body'
    );
    
    const mindAnswers = finalAnswers.filter(a => 
      MINI_QUESTIONS.find(q => q.id === a.questionId)?.dimension === 'mind'
    );
    
    const purposeScore = purposeAnswers.reduce((acc, curr) => acc + curr.value, 0) / purposeAnswers.length * 20;
    const bodyScore = bodyAnswers.reduce((acc, curr) => acc + curr.value, 0) / bodyAnswers.length * 20;
    const mindScore = mindAnswers.reduce((acc, curr) => acc + curr.value, 0) / mindAnswers.length * 20;
    
    onSubmit({
      purpose: Math.round(purposeScore),
      body: Math.round(bodyScore),
      mind: Math.round(mindScore)
    });
  };
  
  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setTransitionClass('animate-fadeOut');
      
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
        setTransitionClass('animate-fadeIn');
      }, 300);
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Barra de progresso */}
      <div className="w-full h-2 bg-gray-200">
        <div 
          className={`h-2 transition-all duration-500 ease-out ${colors.progress}`} 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      
      <div className="p-8">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <span className={`w-10 h-10 ${colors.bg} rounded-full flex items-center justify-center text-2xl mr-3`}>
              {currentQuestion.icon}
            </span>
            <span className={`font-medium ${colors.text}`}>
              {currentQuestion.dimension === 'purpose' 
                ? 'Propósito' 
                : currentQuestion.dimension === 'body'
                  ? 'Corpo'
                  : 'Mente'
              }
            </span>
          </div>
          
          <div className="text-sm text-gray-500">
            Pergunta {currentQuestionIndex + 1} de {MINI_QUESTIONS.length}
          </div>
        </div>
        
        {/* Pergunta */}
        <div className={`mb-10 transition-opacity duration-300 ${transitionClass}`}>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            {currentQuestion.text}
          </h3>
          <p className="text-gray-500 text-sm">
            Selecione um valor de 1 (discordo totalmente) a 5 (concordo totalmente)
          </p>
        </div>
        
        {/* Escala de resposta */}
        <div className={`transition-all duration-300 ${transitionClass}`}>
          <div className="flex justify-between mb-2 px-3">
            <span className="text-xs text-gray-500">Discordo totalmente</span>
            <span className="text-xs text-gray-500">Concordo totalmente</span>
          </div>
          
          <div className="flex justify-between">
            {[1, 2, 3, 4, 5].map(value => {
              const isSelected = answers[currentQuestionIndex]?.value === value;
              
              return (
                <button
                  key={value}
                  onClick={() => handleAnswer(value)}
                  className={`
                    w-16 h-16 rounded-full flex items-center justify-center 
                    font-semibold text-lg transition-all duration-200
                    ${isSelected 
                      ? `${colors.button} text-white shadow-md transform scale-105`
                      : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-gray-400'
                    }
                  `}
                  aria-label={`Resposta ${value}`}
                >
                  {value}
                </button>
              );
            })}
          </div>
          
          <div className="flex justify-between px-3 mt-2">
            <div className="w-16 text-center text-xs text-gray-500">1</div>
            <div className="w-16 text-center text-xs text-gray-500">2</div>
            <div className="w-16 text-center text-xs text-gray-500">3</div>
            <div className="w-16 text-center text-xs text-gray-500">4</div>
            <div className="w-16 text-center text-xs text-gray-500">5</div>
          </div>
        </div>
        
        {/* Navegação */}
        <div className="flex justify-between mt-10">
          <button
            onClick={handleBack}
            disabled={currentQuestionIndex === 0}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all
              ${currentQuestionIndex === 0 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-700 hover:bg-gray-100'
              }
            `}
          >
            Voltar
          </button>
          
          {!isLastQuestion && (
            <button
              onClick={() => currentQuestionIndex < MINI_QUESTIONS.length - 1 && setCurrentQuestionIndex(currentQuestionIndex + 1)}
              disabled={!answers[currentQuestionIndex]}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${!answers[currentQuestionIndex]
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : `${colors.button} text-white`
                }
              `}
            >
              Próxima
            </button>
          )}
          
          {isLastQuestion && (
            <button
              onClick={() => handleAnswer(answers[currentQuestionIndex]?.value || 3)}
              disabled={!answers[currentQuestionIndex]}
              className={`
                px-6 py-2 rounded-lg text-sm font-medium transition-all
                ${!answers[currentQuestionIndex]
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700'
                }
              `}
            >
              Ver Resultados
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MiniQuestionnaire;