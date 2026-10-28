// src/pages/api/keepalive.ts
// Chamado diariamente pelo Cron da Vercel (ver vercel.json).
// No plano gratuito, o Supabase pausa o projeto após ~7 dias sem atividade.
// Uma consulta leve por dia mantém o banco ativo.

import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Se CRON_SECRET estiver configurado na Vercel, só o Cron consegue chamar
  const secret = process.env.CRON_SECRET;
  if (secret && req.headers.authorization !== `Bearer ${secret}`) {
    return res.status(401).json({ ok: false, error: 'unauthorized' });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return res.status(500).json({ ok: false, error: 'Supabase não configurado' });
  }

  const supabase = createClient(url, anonKey, { auth: { persistSession: false } });

  // HEAD + count: não traz dados (e o RLS não expõe nada sem sessão),
  // mas a requisição chega ao Postgres e conta como atividade.
  const { error } = await supabase
    .from('onboarding_progress')
    .select('id', { count: 'exact', head: true });

  if (error) {
    return res.status(502).json({ ok: false, error: error.message });
  }

  return res.status(200).json({ ok: true, at: new Date().toISOString() });
}
