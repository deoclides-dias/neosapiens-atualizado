import { useState, useEffect } from 'react';
import Image from 'next/image';
import RadarGraph from './RadarGraph';
import PillarCard from './PillarCard';

// Dados dos pilares
const pillarsData = [
  {
    id: 'purpose',
    title: 'Propósito 🧭',
    subtitle: 'Clareza, alinhamento, significado e contribuição',
    description: 'Sua conexão com significado, valores e contribuição única para o mundo. É a bússola existencial que orienta suas escolhas e ações em direção ao que realmente importa.',
    icon: '/images/purpose-icon.svg',
    color: 'from-purple-500 to-purple-700',
    hoverColor: 'from-purple-600 to-purple-800',
    components: [
      'Valores Fundamentais - Os princípios não-negociáveis que servem de filtro para decisões',
      'Talentos Naturais - Suas capacidades inatas e desenvolvidas onde encontra facilidade e excelência',
      'Paixões Autênticas - O que desperta seu entusiasmo genuíno e energia sustentada',
      'Contribuição Significativa - Como seus dons podem servir a outros e ao mundo'
    ],
    quote: '"Quem tem um porquê para viver pode suportar quase qualquer como." - Friedrich Nietzsche'
  },
  {
    id: 'body',
    title: 'Corpo 🧬',
    subtitle: 'Vitalidade, nutrição, sono e movimento',
    description: 'Sua existência física e energética, o veículo primordial da experiência humana. Não apenas suporte para a mente, mas sistema inteligente com sabedoria própria.',
    icon: '/images/body-icon.svg',
    color: 'from-green-500 to-green-700',
    hoverColor: 'from-green-600 to-green-800',
    components: [
      'Vitalidade Energética - Capacidade de gerar, conservar e distribuir energia vital',
      'Bioquímica Otimizada - Equilíbrio hormonal e metabólico personalizado',
      'Restauração Profunda - Qualidade de sono e recuperação celular',
      'Movimento Integrado - Atividade física alinhada com tipo corporal e objetivos'
    ],
    stat: '78% das pessoas relatam melhoria significativa na energia e vitalidade após implementar as práticas corporais do NeoSapiens por 30 dias.'
  },
  {
    id: 'mind',
    title: 'Mente 📚',
    subtitle: 'Aprendizado, foco, criatividade e sabedoria',
    description: 'Seu instrumento de percepção, processamento e criação de significado. Um sistema dinâmico capaz de aprendizado, adaptação e transcendência.',
    icon: '/images/mind-icon.svg',
    color: 'from-blue-500 to-blue-700',
    hoverColor: 'from-blue-600 to-blue-800',
    components: [
      'Clareza Cognitiva - Capacidade de processamento claro e discernimento',
      'Flexibilidade Adaptativa - Habilidade de mudar perspectivas e abordagens',
      'Criatividade Aplicada - Geração e implementação de ideias originais',
      'Sabedoria Integrativa - Síntese de conhecimento em compreensão profunda'
    ],
    practice: 'Experimente agora: Feche os olhos por 30 segundos e observe sua respiração sem tentar controlá-la. Apenas note as sensações e pensamentos que surgem.'
  }
];

const PillarsSection = () => {
  const [activePillar, setActivePillar] = useState<string | null>(null);
  const [highlightedDimension, setHighlightedDimension] = useState<string | null>(null);
  const [sampleProfile, setSampleProfile] = useState({
    purpose: 60,
    body: 40,
    mind: 75
  });
  const [displayProfile, setDisplayProfile] = useState({
    purpose: 60,
    body: 40,
    mind: 75
  });
  
  // Alternar pillar ativo
  const togglePillar = (pillarId: string) => {
    // Se já está ativo, desativa
    if (activePillar === pillarId) {
      setActivePillar(null);
      setHighlightedDimension(null);
      setDisplayProfile(sampleProfile);
    } else {
      // Se está ativando outro, destaca esse no radar
      setActivePillar(pillarId);
      setHighlightedDimension(pillarId);
      
      // Cria um efeito visual destacando a dimensão selecionada
      const enhancedProfile = { ...sampleProfile };
      
      // Aumenta temporariamente o valor da dimensão selecionada
      if (pillarId === 'purpose') {
        enhancedProfile.purpose = Math.min(enhancedProfile.purpose + 10, 100);
      } else if (pillarId === 'body') {
        enhancedProfile.body = Math.min(enhancedProfile.body + 10, 100);
      } else if (pillarId === 'mind') {
        enhancedProfile.mind = Math.min(enhancedProfile.mind + 10, 100);
      }
      
      setDisplayProfile(enhancedProfile);
      
      // Após 1.5 segundos, volta ao valor original
      setTimeout(() => {
        setDisplayProfile(sampleProfile);
      }, 1500);
    }
  };
  
  // Gerar perfil de exemplo aleatório
  const generateRandomProfile = () => {
    const newProfile = {
      purpose: Math.floor(Math.random() * 60) + 20,
      body: Math.floor(Math.random() * 60) + 20,
      mind: Math.floor(Math.random() * 60) + 20
    };
    
    setSampleProfile(newProfile);
    setDisplayProfile(newProfile);
    
    // Se tiver um pillar ativo, mantenha o efeito de destaque
    if (activePillar) {
      setTimeout(() => {
        const enhancedProfile = { ...newProfile };
        
        if (activePillar === 'purpose') {
          enhancedProfile.purpose = Math.min(enhancedProfile.purpose + 10, 100);
        } else if (activePillar === 'body') {
          enhancedProfile.body = Math.min(enhancedProfile.body + 10, 100);
        } else if (activePillar === 'mind') {
          enhancedProfile.mind = Math.min(enhancedProfile.mind + 10, 100);
        }
        
        setDisplayProfile(enhancedProfile);
        
        setTimeout(() => {
          setDisplayProfile(newProfile);
        }, 1500);
      }, 100);
    }
  };

  return (
    <section id="pilares" className="py-20 animate-on-scroll">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-6">
            O Caminho NeoSapiens
          </h2>
          
          <p className="text-gray-700 text-lg leading-relaxed">
            Nossa abordagem reconhece que o ser humano pleno emerge da integração harmoniosa de três dimensões fundamentais. Quando estas dimensões se alinham e se potencializam mutuamente, nasce o que chamamos de "Integração NeoSapiens".
          </p>
        </div>
        
        {/* Visualização do Gráfico Radar */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-16">
          <div className="w-full md:w-1/2 max-w-md">
            <RadarGraph 
              data={displayProfile}
              highlightDimension={highlightedDimension}
              withTooltip={true}
            />
            
            <div className="text-center mt-4">
              <button
                onClick={generateRandomProfile}
                className="text-purple-600 font-medium hover:text-purple-800 transition-colors duration-200 text-sm"
              >
                Gerar outro exemplo de perfil
              </button>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 max-w-lg">
            <h3 className="text-2xl font-semibold text-indigo-800 mb-4">
              O Gráfico Radar Tridimensional
            </h3>
            
            <p className="text-gray-700 mb-4">
              Esta visualização representa o equilíbrio entre as três dimensões essenciais do ser. Um perfil ideal tende à expansão equilibrada em todas as direções, criando um campo de coerência interna.
            </p>
            
            <p className="text-gray-700">
              Ao completar o questionário NeoSapiens, você receberá seu próprio Gráfico Radar personalizado, revelando seu perfil único e oportunidades de desenvolvimento integrado.
            </p>
            
            <div className="flex flex-wrap gap-4 mt-8">
              {pillarsData.map(pillar => (
                <button
                  key={`quick-${pillar.id}`}
                  onClick={() => togglePillar(pillar.id)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                    ${activePillar === pillar.id 
                      ? `bg-gradient-to-r ${pillar.hoverColor} text-white shadow-md` 
                      : `bg-gray-100 text-gray-700 hover:bg-gray-200`
                    }
                  `}
                >
                  {pillar.title.split(' ')[0]}
                </button>
              ))}
            </div>
            
            <div className="mt-8">
              <button
                onClick={() => {
                  document.getElementById('questionario')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md"
              >
                Descubra seu perfil atual
              </button>
            </div>
          </div>
        </div>
        
        {/* Cards dos Pilares */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {pillarsData.map(pillar => (
            <PillarCard
              key={pillar.id}
              pillar={pillar}
              isActive={activePillar === pillar.id}
              toggleActive={() => togglePillar(pillar.id)}
            />
          ))}
        </div>
        
        {/* Integração dos Pilares */}
        <div className="mt-20 bg-gradient-to-r from-indigo-50 to-purple-50 p-8 rounded-xl shadow-sm max-w-4xl mx-auto">
          <h3 className="text-2xl font-semibold text-indigo-800 mb-4 text-center">
            A Magia Está na Integração
          </h3>
          
          <p className="text-gray-700 mb-6 text-center">
            Quando as três dimensões trabalham em harmonia, você experimenta um estado de coerência interna que chamamos de "Integração NeoSapiens" – caracterizado por:
          </p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                  <span className="text-purple-600 text-lg">🧭</span>
                </div>
                <h4 className="font-medium text-indigo-800">Clareza Direcional</h4>
              </div>
              <p className="text-gray-600 text-sm">
                Decisões alinhadas com propósito profundo e valores autênticos.
              </p>
            </div>
            
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                  <span className="text-green-600 text-lg">🧬</span>
                </div>
                <h4 className="font-medium text-green-800">Vitalidade Sustentável</h4>
              </div>
              <p className="text-gray-600 text-sm">
                Energia consistente e renovação natural em ciclos harmoniosos.
              </p>
            </div>
            
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <span className="text-blue-600 text-lg">📚</span>
                </div>
                <h4 className="font-medium text-blue-800">Sabedoria Aplicada</h4>
              </div>
              <p className="text-gray-600 text-sm">
                Conhecimento traduzido em ações concretas e resultados tangíveis.
              </p>
            </div>
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="text-center mt-16">
          <button
            onClick={() => {
              document.getElementById('metodologia')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-full font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 shadow-md"
          >
            Conheça a Metodologia de Integração
          </button>
        </div>
      </div>
    </section>
  );
};

export default PillarsSection;