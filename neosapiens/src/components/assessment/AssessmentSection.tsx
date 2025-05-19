import React, { useState } from 'react';

type Question = {
  id: string;
  text: string;
  dimension: 'purpose' | 'body' | 'mind';
};

type Answer = {
  questionId: string;
  value: number;
};

const SAMPLE_QUESTIONS: Question[] = [
  // Propósito
  {
    id: 'purpose-1',
    text: 'Sinto clareza sobre o propósito da minha vida atual.',
    dimension: 'purpose'
  },
  {
    id: 'purpose-2',
    text: 'Minhas ações diárias estão alinhadas com meus valores mais profundos.',
    dimension: 'purpose'
  },
  {
    id: 'purpose-3',
    text: 'Consigo identificar facilmente o que me traz significado genuíno.',
    dimension: 'purpose'
  },
  
  // Corpo
  {
    id: 'body-1',
    text: 'Minha energia se mantém estável ao longo do dia.',
    dimension: 'body'
  },
  {
    id: 'body-2',
    text: 'Estou conectado com os sinais e necessidades do meu corpo.',
    dimension: 'body'
  },
  {
    id: 'body-3',
    text: 'Meus hábitos alimentares e de movimento me dão vitalidade.',
    dimension: 'body'
  },
  
  // Mente
  {
    id: 'mind-1',
    text: 'Consigo manter o foco em tarefas importantes sem distração.',
    dimension: 'mind'
  },
  {
    id: 'mind-2',
    text: 'Experimento regularmente insights criativos e novas perspectivas.',
    dimension: 'mind'
  },
  {
    id: 'mind-3',
    text: 'Minha mente permanece clara mesmo em situações desafiadoras.',
    dimension: 'mind'
  }
];

const AssessmentSection: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [showResults, setShowResults] = useState(false);
  
  const handleAnswer = (value: number) => {
    const question = SAMPLE_QUESTIONS[currentQuestion];
    
    // Salvar resposta
    setAnswers(prev => [
      ...prev.filter(a => a.questionId !== question.id),
      { questionId: question.id, value }
    ]);
    
    // Avançar para próxima pergunta ou mostrar resultados
    if (currentQuestion < SAMPLE_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };
  
  // Calcular resultados por dimensão
  const calculateResults = () => {
    const dimensions: Record<string, { total: number, count: number }> = {
      purpose: { total: 0, count: 0 },
      body: { total: 0, count: 0 },
      mind: { total: 0, count: 0 }
    };
    
    // Somar valores por dimensão
    answers.forEach(answer => {
      const question = SAMPLE_QUESTIONS.find(q => q.id === answer.questionId);
      if (question) {
        dimensions[question.dimension].total += answer.value;
        dimensions[question.dimension].count += 1;
      }
    });
    
    // Calcular médias (em porcentagem)
    return {
      purpose: (dimensions.purpose.total / (dimensions.purpose.count * 5)) * 100,
      body: (dimensions.body.total / (dimensions.body.count * 5)) * 100,
      mind: (dimensions.mind.total / (dimensions.mind.count * 5)) * 100
    };
  };
  
  const resetAssessment = () => {
    setAnswers([]);
    setCurrentQuestion(0);
    setShowResults(false);
  };
  
  return (
    <section id="avaliacao" className="py-20 bg-gradient-to-b from-purple-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">
            Descubra Seu Perfil Tridimensional
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Responda algumas perguntas para visualizar seu perfil nas três dimensões fundamentais
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          {!showResults ? (
            <div className="p-8">
              {/* Progresso */}
              <div className="mb-8">
                <div className="flex justify-between text-sm text-gray-500 mb-1">
                  <span>Questão {currentQuestion + 1} de {SAMPLE_QUESTIONS.length}</span>
                  <span>{Math.round((currentQuestion / SAMPLE_QUESTIONS.length) * 100)}% completo</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(currentQuestion / SAMPLE_QUESTIONS.length) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Pergunta atual */}
              <div className="mb-8">
                <h3 className="text-xl font-medium text-gray-800 mb-6">
                  {SAMPLE_QUESTIONS[currentQuestion].text}
                </h3>
                
                {/* Indicador de dimensão */}
                <div className="flex items-center mb-4">
                  <div className={`w-3 h-3 rounded-full mr-2 ${
                    SAMPLE_QUESTIONS[currentQuestion].dimension === 'purpose' ? 'bg-purple-500' :
                    SAMPLE_QUESTIONS[currentQuestion].dimension === 'body' ? 'bg-green-500' : 'bg-blue-500'
                  }`}></div>
                  <span className="text-sm text-gray-500">
                    Dimensão: {
                      SAMPLE_QUESTIONS[currentQuestion].dimension === 'purpose' ? 'Propósito' :
                      SAMPLE_QUESTIONS[currentQuestion].dimension === 'body' ? 'Corpo' : 'Mente'
                    }
                  </span>
                </div>
              </div>
              
              {/* Escala de resposta */}
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map(value => (
                  <button
                    key={value}
                    onClick={() => handleAnswer(value)}
                    className="py-3 px-4 border border-gray-300 rounded-lg text-center hover:border-indigo-500 hover:bg-indigo-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                  >
                    <div className="font-bold text-lg mb-1">{value}</div>
                    <div className="text-xs text-gray-500">
                      {value === 1 ? 'Discordo totalmente' : 
                       value === 2 ? 'Discordo parcialmente' :
                       value === 3 ? 'Neutro' :
                       value === 4 ? 'Concordo parcialmente' : 'Concordo totalmente'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            // Resultados
            <div className="p-8">
              <h3 className="text-2xl font-bold text-center mb-8">Seu Perfil Tridimensional</h3>
              
              <div className="mb-8">
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-purple-800">Propósito</span>
                  <span>{Math.round(calculateResults().purpose)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-purple-600 h-4 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${calculateResults().purpose}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mb-8">
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-green-800">Corpo</span>
                  <span>{Math.round(calculateResults().body)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-green-500 h-4 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${calculateResults().body}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mb-12">
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-blue-800">Mente</span>
                  <span>{Math.round(calculateResults().mind)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-blue-500 h-4 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${calculateResults().mind}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Gráfico Radar Simples */}
              <div className="flex justify-center mb-8">
                <svg width="200" height="200" viewBox="0 0 200 200">
                  {/* Círculos de fundo */}
                  <circle cx="100" cy="100" r="80" fill="none" stroke="#f3f4f6" strokeWidth="1" />
                  <circle cx="100" cy="100" r="60" fill="none" stroke="#f3f4f6" strokeWidth="1" />
                  <circle cx="100" cy="100" r="40" fill="none" stroke="#f3f4f6" strokeWidth="1" />
                  <circle cx="100" cy="100" r="20" fill="none" stroke="#f3f4f6" strokeWidth="1" />
                  
                  {/* Linhas de eixo */}
                  <line x1="100" y1="20" x2="100" y2="180" stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="20" y1="100" x2="180" y2="100" stroke="#e5e7eb" strokeWidth="1" />
                  <line x1="34" y1="34" x2="166" y2="166" stroke="#e5e7eb" strokeWidth="1" />
                  
                  {/* Rótulos */}
                  <text x="100" y="10" textAnchor="middle" fontSize="12" fill="#9333ea">Propósito</text>
                  <text x="190" y="100" textAnchor="start" fontSize="12" fill="#10b981">Corpo</text>
                  <text x="100" y="195" textAnchor="middle" fontSize="12" fill="#3b82f6">Mente</text>
                  
                  {/* Dados do perfil */}
                  {(() => {
                    const results = calculateResults();
                    const purposeY = 100 - (results.purpose / 100 * 80);
                    const bodyX = 100 + (results.body / 100 * 80);
                    const mindY = 100 + (results.mind / 100 * 80);
                    
                    return (
                      <>
                        <polygon 
                          points={`100,${purposeY} ${bodyX},100 100,${mindY}`} 
                          fill="rgba(99, 102, 241, 0.2)" 
                          stroke="#6366f1" 
                          strokeWidth="2" 
                        />
                        <circle cx="100" cy={purposeY} r="4" fill="#9333ea" />
                        <circle cx={bodyX} cy="100" r="4" fill="#10b981" />
                        <circle cx="100" cy={mindY} r="4" fill="#3b82f6" />
                      </>
                    );
                  })()}
                </svg>
              </div>
              
              <div className="text-center">
                <button
                  onClick={resetAssessment}
                  className="bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                >
                  Refazer Avaliação
                </button>
                
                <div className="mt-8 p-4 bg-purple-50 rounded-lg">
                  <p className="text-gray-700">
                    Esta é uma versão simplificada da avaliação. A versão completa possui 42 questões 
                    e oferece um diagnóstico detalhado com recomendações personalizadas.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default AssessmentSection;