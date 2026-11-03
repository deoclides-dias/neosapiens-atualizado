// src/pages/analysis/biohacking.tsx
// Módulo Corpo: 7 blocos curtos (medidas, sono, movimento, alimentação,
// digestão, hábitos, bem-estar), salvos a cada bloco concluído.

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Activity } from 'lucide-react';
import AnalysisLayout from '../../components/ui/AnalysisLayout';
import FormCard from '../../components/ui/FormCard';
import useAnalysisProgress from '../../hooks/useAnalysisProgress';
import SensitiveDataConsent, { ConsentRecord } from '../../components/consent/SensitiveDataConsent';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import BodyQuestionnaire from '../../components/body/BodyQuestionnaire';
import { BodyData, bodyFromSaved } from '../../lib/body/scoring';
import { BodyAnswers } from '../../lib/body/questions';
import { parseLocalDate } from '../../utils/dates';

type Saved = BodyData & { _consentimento?: ConsentRecord };

const ageFrom = (birthDate?: string): number | undefined => {
  if (!birthDate) return undefined;
  const d = parseLocalDate(birthDate);
  if (!d || Number.isNaN(d.getTime())) return undefined;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  if (now.getMonth() < d.getMonth() || (now.getMonth() === d.getMonth() && now.getDate() < d.getDate())) age--;
  return age > 0 && age < 120 ? age : undefined;
};

export default function BiohackingAnalysisPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { markAnalysisComplete } = useAnalysisProgress();
  const [loaded, setLoaded] = useState(false);
  const [saved, setSaved] = useState<Saved | null>(null);
  const [defaults, setDefaults] = useState<BodyAnswers>({});

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { data } = await supabase
          .from('onboarding_progress')
          .select('biohacking_data, birth_data')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(1);
        const row = data?.[0];
        const body = bodyFromSaved(row?.biohacking_data);
        setSaved(body ? { ...body, _consentimento: row?.biohacking_data?._consentimento } : null);
        const age = ageFrom(row?.birth_data?.birthDate);
        if (age) setDefaults({ idade: age });
      } catch (err) {
        console.error('Erro ao carregar dados do corpo:', err);
      } finally {
        setLoaded(true);
      }
    })();
  }, [user]);

  if (!user) return null; // RequireAuth cuida do redirecionamento

  const questionnaire = (consent: ConsentRecord) => (
    <BodyQuestionnaire
      initial={saved}
      defaults={defaults}
      onSave={async (data, complete) => {
        const ok = await markAnalysisComplete('biohacking', { ...data, _consentimento: consent }, complete);
        if (!ok) alert('Erro ao salvar suas respostas. Tente novamente.');
        return ok;
      }}
      onFinished={() => router.push('/results/biohacking')}
    />
  );

  return (
    <AnalysisLayout
      title="Perfil do Corpo"
      subtitle="Sono · Movimento · Alimentação · Digestão · Bem-estar"
      icon={<Activity className="w-5 h-5" />}
      rightSlot={<span className="hidden md:inline">{user.email}</span>}
    >
      <FormCard>
        {!loaded ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600" />
          </div>
        ) : saved?._consentimento ? (
          questionnaire(saved._consentimento)
        ) : (
          <SensitiveDataConsent
            dataLabel="informações de saúde"
            scope="biohacking"
            items={[
              'medidas do corpo (altura, peso, cintura) e idade',
              'sono, atividade física, alimentação, digestão e intestino',
              'consumo de álcool, cafeína e tabaco, e sinais do corpo que você perceber',
              'bem-estar nas últimas duas semanas',
              'o tempo de resposta de cada bloco, usado só para conferir a qualidade'
            ]}
          >
            {questionnaire}
          </SensitiveDataConsent>
        )}
      </FormCard>
    </AnalysisLayout>
  );
}
