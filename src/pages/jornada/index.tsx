// src/pages/jornada/index.tsx
// Hub da Primeira Jornada: três cards, cada um só se abre depois do anterior.

import Link from 'next/link';
import { useRouter } from 'next/router';
import { BookOpen, CheckCircle2, Compass, Lock, PenLine } from 'lucide-react';
import JornadaShell from '../../components/jornada/JornadaShell';
import useJornada from '../../hooks/useJornada';

export default function JornadaHub() {
  const router = useRouter();
  const { jornada: j } = useJornada();
  const q = new URLSearchParams();
  if (typeof router.query.rumo === 'string') q.set('rumo', router.query.rumo);
  if (typeof router.query.area === 'string') q.set('area', router.query.area);
  const qs = q.toString() ? `?${q.toString()}` : '';

  const cards = j && [
    {
      n: 1,
      icon: BookOpen,
      title: 'O que você precisa saber antes de começar',
      text: 'O que é a Primeira Jornada, de onde vêm as técnicas e o que ela não é.',
      href: `/jornada/saber${qs}`,
      done: Boolean(j.saber),
      open: true,
      lockedWhy: ''
    },
    {
      n: 2,
      icon: PenLine,
      title: 'O compromisso',
      text: 'O termo da sua Primeira Jornada, assinado por você.',
      href: `/jornada/compromisso${qs}`,
      done: Boolean(j.compromisso),
      open: Boolean(j.saber),
      lockedWhy: 'Abre depois de "O que você precisa saber".'
    },
    {
      n: 3,
      icon: Compass,
      title: 'A Primeira Jornada',
      text: 'O rumo escolhido na Carta, as missões de cada dia e o seu Diário de Bordo.',
      href: `/voo${qs}`,
      done: false,
      open: Boolean(j.saber && j.compromisso),
      lockedWhy: 'Abre depois do compromisso.'
    }
  ];

  return (
    <JornadaShell
      back="/carta"
      backLabel="Voltar à Carta ao Navegante"
      eyebrow="NeoSapiens · sete dias"
      title="A Primeira Jornada"
      intro="Sete dias para praticar um rumo da sua Carta e aprender a relaxar fundo, a chegar ao seu Santuário e a começar o seu Palácio Mental. Um passo de cada vez: cada card se abre depois do anterior."
    >
      {!cards ? (
        <p className="text-purple-100">Carregando...</p>
      ) : (
        <div className="flex flex-col gap-4">
          {cards.map((c) => {
            const Icon = c.icon;
            const body = (
              <>
                <span className={`w-12 h-12 rounded-xl grid place-items-center shrink-0 ${c.open ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-400'}`}>
                  {c.open ? <Icon className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
                </span>
                <span className="flex flex-col gap-1 flex-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-purple-700">Passo {c.n}</span>
                  <span className="text-lg font-bold text-gray-900">{c.title}</span>
                  <span className="text-sm text-gray-600">{c.open ? c.text : c.lockedWhy}</span>
                </span>
                {c.done && (
                  <span className="self-start inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-full px-2.5 py-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> feito
                  </span>
                )}
              </>
            );
            return c.open ? (
              <Link key={c.n} href={c.href} className="flex items-start gap-4 bg-white rounded-2xl shadow-xl shadow-black/25 p-5 sm:p-6 no-underline hover:ring-2 hover:ring-purple-300 transition">
                {body}
              </Link>
            ) : (
              <div key={c.n} className="flex items-start gap-4 bg-white/90 rounded-2xl p-5 sm:p-6 opacity-70 cursor-not-allowed" aria-disabled="true">
                {body}
              </div>
            );
          })}
        </div>
      )}
    </JornadaShell>
  );
}
