// src/pages/analysis/psique.tsx
// Mapa da Psique: as duas passadas novas do Mini-IPIP.
// 1) "como acho que deveria ser" (a régua do dever, Higgins 1987);
// 2) o olhar dos outros: respondido com alguém próximo ou pela metapercepção.
// Tudo fica dentro de psychological_data (dever, outro), sem tabela nova.

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Check, Eye, Scale, Users } from 'lucide-react';
import AnalysisLayout from '../../components/ui/AnalysisLayout';
import FormCard from '../../components/ui/FormCard';
import useAnalysisProgress from '../../hooks/useAnalysisProgress';
import SensitiveDataConsent, { ConsentRecord } from '../../components/consent/SensitiveDataConsent';
import MiniIpipQuestionnaire from '../../components/psych/MiniIpipQuestionnaire';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import { Answers, PsychologicalResult, Timings, buildIdeal, resultFromSaved } from '../../lib/psych/miniIpip';

type Saved = PsychologicalResult & { _consentimento?: ConsentRecord; _consentimentoPsique?: ConsentRecord };
type Stage = 'carregando' | 'sem-base' | 'menu' | 'dever' | 'escolha' | 'outro' | 'meta' | 'salvando';

export default function PsiqueAnalysis() {
  const router = useRouter();
  const { user } = useAuth();
  const { markAnalysisComplete } = useAnalysisProgress();
  const [stage, setStage] = useState<Stage>('carregando');
  const [saved, setSaved] = useState<Saved | null>(null);
  const [relation, setRelation] = useState('');

  useEffect(() => {
    if (!user) return;
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
        current = parsed ? { ...parsed, _consentimento: raw?._consentimento, _consentimentoPsique: raw?._consentimentoPsique } : null;
      } catch (err) {
        console.error('Erro ao carregar o perfil:', err);
      }
      setSaved(current);
      setStage(current ? 'menu' : 'sem-base');
    })();
  }, [user]);

  const save = async (next: Saved, back: Stage) => {
    setStage('salvando');
    const ok = await markAnalysisComplete('psychological', next);
    if (!ok) {
      alert('Erro ao salvar. Tente novamente.');
      setStage(back);
      return;
    }
    setSaved(next);
    setStage('menu');
  };

  if (!user) return null;

  const done = { dever: Boolean(saved?.dever), outro: Boolean(saved?.outro) };

  const menu = () => (
    <div className="flex flex-col gap-5 max-w-2xl mx-auto">
      <p className="m-0 text-[15px] leading-relaxed text-gray-700">
        O seu retrato de hoje já está pronto. Para o Mapa da Psique faltam dois olhares sobre as mesmas 20 frases. Cada um leva uns 4 minutos e pode ser feito em
        dias diferentes.
      </p>
      {[
        {
          key: 'dever' as const,
          icon: <Scale className="w-6 h-6 text-purple-600" />,
          title: 'Como você acha que deveria ser',
          text: 'As regras que você tomou para si: o que aprendeu que "deveria" ser. É a medida da pergunta "Como a cultura pesa em você".',
          go: () => setStage('dever')
        },
        {
          key: 'outro' as const,
          icon: <Users className="w-6 h-6 text-purple-600" />,
          title: 'Como os outros veem você',
          text: 'Responda junto com alguém próximo, ou sozinho(a), como acha que os outros veem você. É a medida da Janela de Johari.',
          go: () => setStage('escolha')
        }
      ].map((t) => (
        <button
          key={t.key}
          type="button"
          onClick={t.go}
          className="flex items-start gap-4 text-left rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50 p-4"
        >
          <span className="shrink-0 mt-0.5">{t.icon}</span>
          <span className="flex flex-col gap-1">
            <span className="font-semibold text-gray-900 flex items-center gap-2">
              {t.title}
              {done[t.key] && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-full px-2 py-0.5">
                  <Check className="w-3 h-3" /> feito · refazer
                </span>
              )}
            </span>
            <span className="text-sm text-gray-600">{t.text}</span>
          </span>
        </button>
      ))}
      <Link href="/results/psique" className="inline-flex items-center justify-center min-h-[48px] px-6 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 w-fit">
        Ver meu Mapa da Psique
      </Link>
    </div>
  );

  const inner = (consent: ConsentRecord) => (
              <>
      {stage === 'menu' && menu()}

      {stage === 'dever' && (
        <MiniIpipQuestionnaire
          draftKey={`neo-psych-dever-draft-${user.id}`}
          mode="dever"
          onComplete={(a: Answers, t: Timings) => save(withConsent({ ...saved, dever: buildIdeal(a, t, 'dever') }, consent), 'dever')}
        />
      )}

      {stage === 'escolha' && (
        <div className="flex flex-col gap-5 max-w-2xl mx-auto">
          <h2 className="m-0 text-2xl font-bold text-gray-900">Como os outros veem você</h2>
          <p className="m-0 text-[15px] leading-relaxed text-gray-700">
            O jeito mais rico é responder <strong>junto com alguém que conhece você bem</strong>: você lê cada frase em voz alta e marca o que a pessoa disser.
            Se preferir, responda sozinho(a), como acha que os outros veem você. São duas medidas diferentes, e o resultado mostra qual foi usada.
          </p>
          <label className="flex flex-col gap-1.5 text-sm text-gray-700">
            Quem vai responder com você? (opcional, só um apelido: &quot;minha irmã&quot;, &quot;um amigo&quot;)
            <input
              value={relation}
              onChange={(e) => setRelation(e.target.value.slice(0, 40))}
              className="px-4 py-3 rounded-lg border border-gray-300 text-gray-900"
              placeholder="minha irmã"
            />
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <button type="button" onClick={() => setStage('outro')} className="min-h-[48px] px-6 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700">
              Responder com alguém próximo
            </button>
            <button type="button" onClick={() => setStage('meta')} className="min-h-[48px] px-6 rounded-lg border border-gray-300 text-gray-800 font-semibold hover:bg-gray-50">
              Responder sozinho(a)
            </button>
          </div>
          <button type="button" onClick={() => setStage('menu')} className="text-sm text-purple-700 font-semibold w-fit">
            Voltar
          </button>
        </div>
      )}

      {(stage === 'outro' || stage === 'meta') && (
        <MiniIpipQuestionnaire
          draftKey={`neo-psych-${stage}-draft-${user.id}`}
          mode={stage}
          onComplete={(a: Answers, t: Timings) =>
            save(
              withConsent(
                {
                  ...saved,
                  outro: {
                    ...buildIdeal(a, t, stage),
                    modo: stage === 'outro' ? 'com_alguem' : 'sozinho',
                    ...(stage === 'outro' && relation.trim() ? { relacao: relation.trim() } : {})
                  }
                },
                consent
              ),
              stage
            )
          }
        />
      )}
    </>
  );

  const withConsent = (next: Omit<Saved, '_consentimentoPsique'>, consent: ConsentRecord): Saved => ({ ...next, _consentimentoPsique: consent });

  return (
    <AnalysisLayout title="Mapa da Psique" subtitle="Como você se vê, como os outros veem você e como a cultura pesa em você" icon={<Eye className="w-5 h-5" />}>
      <FormCard>
        {(stage === 'carregando' || stage === 'salvando') && (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" aria-label="Carregando" />
          </div>
        )}

        {stage === 'sem-base' && (
          <div className="flex flex-col gap-4 max-w-xl">
            <h2 className="m-0 text-2xl font-bold text-gray-900">Primeiro, o seu retrato de hoje</h2>
            <p className="m-0 text-[15px] text-gray-700">O Mapa da Psique parte da avaliação de personalidade (Mini-IPIP). Responda primeiro como você é hoje.</p>
            <Link href="/analysis/psychological" className="inline-flex items-center justify-center min-h-[48px] px-6 rounded-lg bg-purple-600 text-white font-semibold w-fit">
              Fazer a avaliação de personalidade
            </Link>
          </div>
        )}

        {saved && !['carregando', 'sem-base', 'salvando'].includes(stage) && saved._consentimentoPsique && inner(saved._consentimentoPsique)}

        {saved && !['carregando', 'sem-base', 'salvando'].includes(stage) && !saved._consentimentoPsique && (
          <SensitiveDataConsent
            dataLabel="respostas sobre como você acha que deveria ser e sobre como os outros veem você"
            scope="psique"
            items={[
              'as mesmas 20 frases da avaliação de personalidade, respondidas pensando em como você acha que deveria ser',
              'as mesmas frases respondidas por você junto com alguém próximo, ou como você acha que os outros veem você; não guardamos o nome nem dados de quem ajudou',
              'o tempo de cada resposta, usado só para conferir a qualidade'
            ]}
          >
            {(consent) => inner(consent)}
          </SensitiveDataConsent>
        )}
      </FormCard>
      <p className="mt-4 text-center text-xs text-gray-500">
        Leitura de autoconhecimento, não avaliação psicológica. <button type="button" onClick={() => router.push('/results')} className="underline">Voltar aos resultados</button>
      </p>
    </AnalysisLayout>
  );
}
