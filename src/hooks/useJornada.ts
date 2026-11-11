// src/hooks/useJornada.ts
import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { supabase } from '../lib/supabase';
import { JornadaMeta, jornadaFrom } from '../lib/jornada';

export default function useJornada() {
  const { user } = useAuth();
  const [j, setJ] = useState<JornadaMeta | null>(null);

  useEffect(() => {
    if (user) setJ(jornadaFrom(user.user_metadata));
  }, [user]);

  const update = async (patch: Partial<JornadaMeta>) => {
    const next = { ...(j ?? {}), ...patch };
    const { error } = await supabase.auth.updateUser({ data: { jornada: next } });
    if (error) return false;
    setJ(next);
    return true;
  };

  return { user, jornada: j, update };
}
