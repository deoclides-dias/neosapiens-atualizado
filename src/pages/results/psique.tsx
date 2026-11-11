// src/pages/results/psique.tsx
// Mapa da Psique: carrega os dados e entrega para PsiqueView.

import { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { supabase } from '../../lib/supabase';
import PsiqueView from '../../components/psique/PsiqueView';

export default function PsiqueResults() {
  const { user } = useAuth();
  const [row, setRow] = useState<any>(undefined);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from('onboarding_progress')
        .select('birth_data, psychological_data')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })
        .limit(1);
      setRow(data?.[0] ?? null);
    })();
  }, [user]);

  return <PsiqueView row={row} />;
}
