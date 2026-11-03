// src/pages/analysis/psychological.tsx
// Duas passadas pelas mesmas 20 frases do Mini-IPIP:
// 1) como você é hoje; 2) como gostaria de ser (opcional, pode ser feita depois).
// A primeira é salva antes de oferecer a segunda, para nada se perder.
// Acesso direto à segunda: /analysis/psychological?etapa=desejado

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Brain, Sparkles } from 'lucide-react';
import AnalysisLayout from '../../components/ui/AnalysisLayout';
import FormCard from '../../components/ui/FormCard';
import useAnalysisProgress from '../../hooks/useAnalysisProgress';
import SensitiveDataConsent, { ConsentRecord } from '../../components/consent/SensitiveDataConsent';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import MiniIpipQuestionnaire from '../../components/psych/MiniIpipQuestionnaire';
import { Answers, PsychologicalResult, Timings, buildIdeal, buildResult, resultFromSaved } from '../../lib/psych/miniIpip';

type Stage = 'carregando' | 'real' | 'ponte' | 'ideal' | 'salvando';
type Saved = PsychologicalResult & { _consentimento?: ConsentRecord };

const PsychologicalAnalysisPage = () => {
  const router = useRouter();
  const { user } = useAuth();
  const { markAnalysisComplete } = useAnalysisProgress();
  const [stage, setStage] = useState<Stage>('carregando');
  const [saved, setSaved] = useState<Saved | null>(null);

  const wantsIdeal = router.query.etapa === 'desejado';

  // Carrega o que já existe (para a etapa "desejado" feita depois)
  useEffect(() => {
    if (!user || !router.isReady) return;
    (async () => {
      let current: Saved | null = null;
      try {
        const { data } = await supabase
          .from('onboarding_progress')
          .select('psychological_data')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(1);
        const raw = data?.[0]?.psychological_data;
        const parsed = resultFromSaved(raw);
        current = parsed ? { ...parsed, _consentimento: raw?._consentimento } : null;
      } catch (err) {
        console.error('Erro ao carregar perfil psicológico:', err);
      }
      setSaved(current);
      setStage(wantsIdeal && current?._consentimento ? 'ideal' : 'real');
    })();
  }, [user, router.isReady, wantsIdeal]);

  const save = async (data: Saved): Promise<boolean> => {
    const ok = await markAnalysisComplete('psychological', data);
    if (!ok) alert('Erro ao salvar suas respostas. Tente novamente.');
    return ok;
  };

  const completeReal = async (answers: Answers, timings: Timings, consent: ConsentRecord) => {
    setStage('salvando');
    // Refazer o "hoje" começa um retrato novo: o "desejado" antigo não vale mais
    const data: Saved = { ...buildResult(answers, timings), _consentimento: consent };
    if (await save(data)) {
      setSaved(data);
      setStage('ponte');
    } else {
      setStage('real');
    }
  };

  const completeIdeal = async (answers: Answers, timings: Timings) => {
    if (!saved) return;
    setStage('salvando');
    const data: Saved = { ...saved, ideal: buildIdeal(answers, timings) };
    if (await save(data)) router.push('/results/psychological');
    else setStage('ideal');
  };

  if (!user) return null; // RequireAuth cuida do redirecionamento

  return (
    <AnalysisLayout
      title="Avaliação Psicológica"
      subtitle="Cinco Grandes Fatores · Mini-IPIP"
      icon={<Brain className="w-5 h-5" />}
      rightSlot={<span className="hidden md:inline">{user.email}</span>}
    >
      <FormCard>
        {(stage === 'carregando' || stage === 'salvando') && (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">{stage === 'salvando' ? 'Salvando suas respostas...' : 'Carregando...'}</p>
            </div>
          </div>
        )}

        {stage === 'real' && (
          <SensitiveDataConsent
            dataLabel="respostas psicológicas"
            scope="psychological"
            items={[
              'respostas a 20 frases sobre o seu jeito de ser (Cinco Grandes Fatores da personalidade), pensando em como você é hoje e em como gostaria de ser',
              'o tempo que você levou em cada frase, usado só para conferir a qualidade das respostas'
            ]}
          >
            {(consent) => (
              <MiniIpipQuestionnaire draftKey={`neo-psych-draft-${user.id}`} onComplete={(a, t) => completeReal(a, t, consent)} />
            )}
          </SensitiveDataConsent>
        )}

        {stage === 'ponte' && (
          <div className="flex flex-col gap-5 max-w-2xl mx-auto">
            <div className="flex items-start gap-3">
              <Sparkles className="w-7 h-7 text-purple-600 shrink-0 mt-0.5" aria-hidden="true" />
              <div className="flex flex-col gap-2">
                <h2 className="m-0 text-2xl font-bold text-gray-900">Pronto, seu retrato de hoje está salvo</h2>
                <p className="m-0 text-[15px] leading-relaxed text-gray-700">
                  Agora vem a parte mais reveladora: responder <strong>as mesmas frases pensando em como você gostaria de ser</strong>. A distância entre os
                  dois retratos mostra para onde você quer ir, e é dela que nasce o seu Plano de Voo. Leva uns 3 minutos.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setStage('ideal')}
                className="min-h-[48px] px-6 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700"
              >
                Continuar: como gostaria de ser
              </button>
              <button
                type="button"
                onClick={() => router.push('/results/psychological')}
                className="min-h-[48px] px-6 rounded-lg border border-gray-300 text-gray-800 font-semibold hover:bg-gray-50"
              >
                Ver meu resultado agora
              </button>
            </div>
          </div>
        )}

        {stage === 'ideal' && (
          <MiniIpipQuestionnaire draftKey={`neo-psych-ideal-draft-${user.id}`} mode="ideal" onComplete={completeIdeal} />
        )}
      </FormCard>
    </AnalysisLayout>
  );
};

export default PsychologicalAnalysisPage;
