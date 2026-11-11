// src/pages/jornada/saber.tsx
// Passo 1 da Primeira Jornada: o que é, de onde vêm as técnicas e o que ela não é.

import { ReactNode, useState } from 'react';
import { useRouter } from 'next/router';
import JornadaShell from '../../components/jornada/JornadaShell';
import useJornada from '../../hooks/useJornada';
import { JORNADA_VERSION } from '../../lib/jornada';

const HIPNOSE = 'https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2023.1330238/full';
const PNL = 'https://pt.wikipedia.org/wiki/Programa%C3%A7%C3%A3o_neurolingu%C3%ADstica';
const NEUROPSI = 'https://en.wikipedia.org/wiki/Neuropsychoanalysis';

const Ext = ({ href, children }: { href: string; children: ReactNode }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="text-purple-700 font-semibold underline">
    {children}
  </a>
);

const DAYS = [
  ['Dias 1 a 3', 'Relaxamento profundo, cada dia um pouco mais fundo. No terceiro, você cria a sua âncora: um gesto ou uma palavra que leva de volta a esse estado.'],
  ['Dia 4', 'Você cria o seu Santuário, um lugar seguro dentro de você.'],
  ['Dia 5', 'Você aprende a chegar mais rápido ao relaxamento e ao Santuário.'],
  ['Dia 6', 'Alguém se anuncia no seu Santuário e marca um encontro para o dia seguinte.'],
  ['Dia 7', 'Juntos, vocês começam o seu Palácio Mental.']
];

export default function Saber() {
  const router = useRouter();
  const { jornada, update } = useJornada();
  const [ok, setOk] = useState(false);
  const [saving, setSaving] = useState(false);
  const qs = router.asPath.includes('?') ? router.asPath.slice(router.asPath.indexOf('?')) : '';
  const done = Boolean(jornada?.saber);

  const confirm = async () => {
    setSaving(true);
    const s = await update({ saber: { em: new Date().toISOString(), version: JORNADA_VERSION } });
    setSaving(false);
    if (!s) return alert('Não foi possível salvar agora. Tente de novo.');
    router.push(`/jornada${qs}`);
  };

  return (
    <JornadaShell back={`/jornada${qs}`} backLabel="Voltar à Primeira Jornada" eyebrow="Primeira Jornada · passo 1" title="O que você precisa saber antes de começar">
      <section className="bg-white rounded-2xl shadow-xl shadow-black/25 p-6 sm:p-8 flex flex-col gap-6 text-gray-800 text-[16px] leading-relaxed">
        <div className="flex flex-col gap-3">
          <h2 className="m-0 text-2xl font-bold text-gray-900">O que é a Primeira Jornada</h2>
          <p className="m-0">
            São sete dias. De dia, você pratica <strong>um único rumo</strong>, escolhido na sua Carta ao Navegante: dormir melhor, mexer mais o corpo, focar, o que a
            Carta tiver apontado. À noite, você ouve <strong>uma sessão guiada</strong>, de 12 a 20 minutos, e anota no seu Diário de Bordo como foi.
          </p>
          <ul className="m-0 pl-5 list-disc flex flex-col gap-1.5">
            {DAYS.map(([d, t]) => (
              <li key={d}>
                <strong>{d}:</strong> {t}
              </li>
            ))}
          </ul>
          <p className="m-0">Cada sessão se abre no dia seguinte ao da anterior. A pressa não ajuda: o relaxamento se aprofunda com o treino de cada dia.</p>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="m-0 text-2xl font-bold text-gray-900">De onde vêm as técnicas</h2>
          <p className="m-0">
            A Primeira Jornada foi pensada a partir da <Ext href={HIPNOSE}>Hipnoterapia Clínica</Ext>, com <Ext href={PNL}>técnicas de PNL</Ext> e à luz da{' '}
            <Ext href={NEUROPSI}>Neuropsicanálise</Ext>.
          </p>
          <p className="m-0 text-sm text-gray-600">
            Sobre a hipnose: uma revisão de 49 meta-análises (Rosendahl, Alldredge e Haddenhorst, 2024) concluiu que ela pode melhorar resultados de saúde mental e física,
            com a evidência mais forte para dor e para pessoas passando por procedimentos médicos.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <h2 className="m-0 text-2xl font-bold text-gray-900">O que ela não é</h2>
          <ul className="m-0 pl-5 list-disc flex flex-col gap-1.5">
            <li>
              <strong>Não é tratamento.</strong> É uma forma de autoconhecimento e de relaxamento. Não substitui psicoterapia, acompanhamento médico nem remédio.
            </li>
            <li>Não ouça as sessões dirigindo, operando máquinas ou em qualquer situação que peça atenção.</li>
            <li>Se algo pesar demais, pare. Você pode pausar a qualquer momento e procurar alguém de confiança ou o CVV (188, ligação gratuita).</li>
          </ul>
        </div>

        {done ? (
          <p className="m-0 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-emerald-800 font-semibold">Você já confirmou este passo.</p>
        ) : (
          <div className="flex flex-col gap-4 border-t border-gray-100 pt-5">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={ok} onChange={(e) => setOk(e.target.checked)} className="mt-1 w-5 h-5 accent-purple-600" />
              <span>Entendi o que é a Primeira Jornada, de onde vêm as suas técnicas e que ela não é um tratamento. Concordo em seguir assim.</span>
            </label>
            <button
              type="button"
              disabled={!ok || saving}
              onClick={confirm}
              className="min-h-[48px] px-6 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-700 disabled:opacity-40 w-full sm:w-fit"
            >
              {saving ? 'Salvando…' : 'Entendi e concordo'}
            </button>
          </div>
        )}
      </section>
    </JornadaShell>
  );
}
