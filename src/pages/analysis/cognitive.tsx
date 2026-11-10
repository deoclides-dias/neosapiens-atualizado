// src/pages/analysis/cognitive.tsx
// Módulo Mente: autoavaliação e cinco testes curtos no navegador,
// salvos a cada etapa concluída.

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Zap } from 'lucide-react';
import AnalysisLayout from '../../components/ui/AnalysisLayout';
import FormCard from '../../components/ui/FormCard';
import useAnalysisProgress from '../../hooks/useAnalysisProgress';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import MindFlow from '../../components/mind/MindFlow';
import { MindData, mindFromSaved } from '../../lib/mind/mind';
import SensitiveDataConsent, { ConsentRecord } from '../../components/consent/SensitiveDataConsent';

export default function CognitivePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { markAnalysisComplete } = useAnalysisProgress();
  const [loaded, setLoaded] = useState(false);
  const [saved, setSaved] = useState<MindData | null>(null);
  const [consent, setConsent] = useState<ConsentRecord | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { data } = await supabase
          .from('onboarding_progress')
          .select('cognitive_data')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(1);
        setSaved(mindFromSaved(data?.[0]?.cognitive_data));
        setConsent(data?.[0]?.cognitive_data?._consentimento ?? null);
      } catch (err) {
        console.error('Erro ao carregar dados da mente:', err);
      } finally {
        setLoaded(true);
      }
    })();
  }, [user]);

  if (!user) return null; // RequireAuth cuida do redirecionamento

  const flow = (c: ConsentRecord) => (
    <MindFlow
      initial={saved}
      onSave={async (data, complete) => {
        const ok = await markAnalysisComplete('cognitive', { ...data, _consentimento: c }, complete);
        if (!ok) alert('Erro ao salvar. Tente novamente.');
        return ok;
      }}
      onFinished={() => router.push('/results/cognitive')}
    />
  );

  return (
    <AnalysisLayout
      title="Perfil da Mente"
      subtitle="Atenção · Memória · Foco · Flexibilidade · Criatividade"
      icon={<Zap className="w-5 h-5" />}
      rightSlot={<span className="hidden md:inline">{user.email}</span>}
    >
      <FormCard>
        {!loaded ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
          </div>
        ) : consent ? (
          flow(consent)
        ) : (
          <SensitiveDataConsent
            dataLabel="respostas e resultados dos testes da mente"
            scope="cognitive"
            items={[
              'como você avalia a sua própria atenção, memória e criatividade',
              'tempos de reação, acertos e erros nos testes de memória, foco e flexibilidade',
              'as ideias que você escrever no teste de criatividade'
            ]}
          >
            {flow}
          </SensitiveDataConsent>
        )}
      </FormCard>
    </AnalysisLayout>
  );
}
