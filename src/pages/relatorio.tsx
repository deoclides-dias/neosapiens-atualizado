// src/pages/relatorio.tsx
// Relatório NeoSapiens: a própria pessoa gera e decide com quem compartilhar.

import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import ReportDocument from '../components/report/ReportDocument';

export default function Relatorio() {
  const { user } = useAuth();
  const [row, setRow] = useState<any>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { data, error: dbError } = await supabase
          .from('onboarding_progress')
          .select('birth_data, biohacking_data, psychological_data, cognitive_data, purpose_data, flight_data')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false })
          .limit(1);
        if (dbError) throw dbError;
        setRow(data?.[0] ?? null);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        setError('Não foi possível carregar seus dados.');
        setRow(null);
      }
    })();
  }, [user]);

  return <ReportDocument row={row} email={user?.email} error={error} />;
}
