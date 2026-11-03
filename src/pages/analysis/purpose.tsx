// src/pages/analysis/purpose.tsx
// Módulo Propósito: valores, sentido de vida, vida valorizada,
// florescimento, Cinco Espíritos e a visão de futuro, salvos por bloco.

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Compass } from 'lucide-react';
import AnalysisLayout from '../../components/ui/AnalysisLayout';
import FormCard from '../../components/ui/FormCard';
import useAnalysisProgress from '../../hooks/useAnalysisProgress';
import SensitiveDataConsent, { ConsentRecord } from '../../components/consent/SensitiveDataConsent';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import PurposeFlow from '../../components/purpose/PurposeFlow';
import { PurposeData, purposeFromSaved } from '../../lib/purpose/purpose';

type Saved = PurposeData & { _consentimento?: ConsentRecord };

export default function PurposePage() {
  const router = useRouter();
  const { user } = useAuth();
  const { markAnalysisComplete } = useAnalysisProgress();
  const [loaded, setLoaded] = useState(false);
  const [saved, setSaved] = useState<Saved | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { data } = await supabase
          .from('onboarding_progress')
          .select('purpose_data')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(1);
        const raw = data?.[0]?.purpose_data;
        const p = purposeFromSaved(raw);
        setSaved(p ? { ...p, _consentimento: raw?._consentimento } : null);
      } catch (err) {
        console.error('Erro ao carregar propósito:', err);
      } finally {
        setLoaded(true);
      }
    })();
  }, [user]);

  if (!user) return null; // RequireAuth cuida do redirecionamento

  const flow = (consent: ConsentRecord) => (
    <PurposeFlow
      initial={saved}
      onSave={async (data, complete) => {
        const ok = await markAnalysisComplete('purpose', { ...data, _consentimento: consent }, complete);
        if (!ok) alert('Erro ao salvar. Tente novamente.');
        return ok;
      }}
      onFinished={() => router.push('/results/purpose')}
    />
  );

  return (
    <AnalysisLayout
      title="Perfil do Propósito"
      subtitle="Valores · Sentido · Vida valorizada · Visão"
      icon={<Compass className="w-5 h-5" />}
      rightSlot={<span className="hidden md:inline">{user.email}</span>}
    >
      <FormCard>
        {!loaded ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
          </div>
        ) : saved?._consentimento ? (
          flow(saved._consentimento)
        ) : (
          <SensitiveDataConsent
            dataLabel="respostas sobre valores, fé e sentido de vida"
            scope="purpose"
            items={[
              'o quanto você valoriza 18 princípios de vida, inclusive fé e espiritualidade',
              'sentido de vida, florescimento e o quanto você vive de acordo com o que valoriza',
              'textos livres sobre o futuro que você imagina'
            ]}
          >
            {flow}
          </SensitiveDataConsent>
        )}
      </FormCard>
    </AnalysisLayout>
  );
}
