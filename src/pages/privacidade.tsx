// src/pages/privacidade.tsx
// Política de Privacidade do NeoSapiens (página pública, exigida pelo Google
// para publicar o login OAuth e pela LGPD). Rascunho: revisar antes de abrir
// o site ao público.

import Head from 'next/head';
import Link from 'next/link';
import { ReactNode } from 'react';

const ATUALIZADA_EM = '28 de outubro de 2026';
const CONTATO = 'deoclides@gmail.com';

function Secao({ titulo, children }: { titulo: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="m-0 text-2xl font-bold text-indigo-950" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>{titulo}</h2>
      <div className="flex flex-col gap-3 text-[15px] leading-relaxed text-gray-700">{children}</div>
    </section>
  );
}

export default function Privacidade() {
  return (
    <>
      <Head>
        <title>Política de Privacidade — NeoSapiens</title>
        <meta name="description" content="Como o NeoSapiens coleta, usa e protege os seus dados." />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Inter:wght@400;600;700&display=swap" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 px-4 py-10" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
        <article className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl shadow-black/25 p-6 sm:p-10 flex flex-col gap-8">
          <header className="flex flex-col gap-2">
            <p className="m-0 text-xs font-semibold uppercase tracking-wider text-purple-700">NeoSapiens</p>
            <h1 className="m-0 text-4xl font-bold text-indigo-950" style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}>Política de Privacidade</h1>
            <p className="m-0 text-sm text-gray-600">Última atualização: {ATUALIZADA_EM}</p>
          </header>

          <p className="m-0 text-[15px] leading-relaxed text-gray-700">
            O NeoSapiens é uma plataforma de autoconhecimento que combina tradições ancestrais (astrologia ocidental e chinesa, numerologia),
            hábitos de saúde e avaliações psicológicas e cognitivas. Esta política explica, em linguagem simples, quais dados coletamos, para quê,
            com quem eles ficam e como você pode controlá-los, nos termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018, LGPD).
          </p>

          <Secao titulo="1. Quem é o responsável">
            <p className="m-0">
              O controlador dos dados é Deoclides dos Santos Costa Dias, responsável pelo NeoSapiens. Para qualquer assunto sobre os seus dados,
              escreva para <a href={`mailto:${CONTATO}`} className="text-purple-700 font-semibold underline">{CONTATO}</a>.
            </p>
          </Secao>

          <Secao titulo="2. Quais dados coletamos">
            <ul className="m-0 pl-5 flex flex-col gap-2 list-disc">
              <li><strong>Conta:</strong> e-mail e senha (guardada criptografada) ou, se você entrar com o Google, nome, e-mail e foto do perfil fornecidos pelo Google.</li>
              <li><strong>Dados de nascimento:</strong> nome completo, data, hora e cidade de nascimento, com as coordenadas e o fuso horário da cidade.</li>
              <li><strong>Avaliação de corpo e energia (biohacking):</strong> medidas corporais, sono, alimentação, atividade física e informações de saúde, como condições crônicas, histórico familiar, medicamentos, suplementos, alergias, sintomas e níveis de estresse e ansiedade.</li>
              <li><strong>Avaliações psicológica e cognitiva:</strong> as suas respostas aos questionários (personalidade, estilos de aprendizagem e processamento, Cinco Elementos).</li>
            </ul>
            <p className="m-0">
              As informações de saúde e as respostas psicológicas são <strong>dados pessoais sensíveis</strong> pela LGPD (art. 5º, II) e recebem
              cuidado reforçado. Você só as informa se quiser, preenchendo a avaliação correspondente.
            </p>
          </Secao>

          <Secao titulo="3. Para que usamos">
            <ul className="m-0 pl-5 flex flex-col gap-2 list-disc">
              <li>Gerar os seus resultados: mapa natal, astrologia chinesa, numerologia e os perfis das avaliações.</li>
              <li>Guardar o seu progresso entre as análises.</li>
              <li>Manter a sua conta e permitir o login.</li>
            </ul>
            <p className="m-0">
              Não vendemos os seus dados, não os usamos para publicidade e não os compartilhamos com terceiros para fins comerciais. Os resultados
              são leituras simbólicas e de autoconhecimento: <strong>não são diagnóstico médico ou psicológico</strong> e não substituem
              profissionais de saúde.
            </p>
          </Secao>

          <Secao titulo="4. Base legal">
            <p className="m-0">
              Tratamos os seus dados com base no seu consentimento (LGPD, art. 7º, I) e, no caso dos dados sensíveis, no consentimento específico
              e destacado para essa finalidade (art. 11, I). Você pode retirar o consentimento a qualquer momento, pedindo a exclusão dos dados.
            </p>
          </Secao>

          <Secao titulo="5. Com quem os dados ficam">
            <p className="m-0">Usamos serviços de terceiros apenas para operar a plataforma:</p>
            <ul className="m-0 pl-5 flex flex-col gap-2 list-disc">
              <li><strong>Supabase:</strong> banco de dados e autenticação. Os dados ficam armazenados em servidores nos Estados Unidos.</li>
              <li><strong>Vercel:</strong> hospedagem do site.</li>
              <li><strong>Google:</strong> login com conta Google (se você escolher) e sugestão de cidades no formulário de nascimento, que envia ao Google o texto digitado no campo de cidade.</li>
            </ul>
            <p className="m-0">
              Por usarmos esses serviços, há transferência internacional de dados (LGPD, art. 33). Esses fornecedores adotam medidas de segurança
              e contratos próprios de proteção de dados.
            </p>
          </Secao>

          <Secao titulo="6. Como protegemos">
            <p className="m-0">
              A comunicação com o site é criptografada (HTTPS). No banco de dados, regras de acesso garantem que cada pessoa só consiga ler e
              alterar os próprios registros. Os cálculos das tradições são feitos no seu navegador a partir dos dados que você salvou.
            </p>
          </Secao>

          <Secao titulo="7. Por quanto tempo guardamos">
            <p className="m-0">
              Os dados ficam guardados enquanto a sua conta existir. Se você pedir a exclusão, apagamos a conta e os dados associados, exceto o que
              a lei obrigar a manter.
            </p>
          </Secao>

          <Secao titulo="8. Seus direitos">
            <p className="m-0">Pela LGPD (art. 18), você pode, a qualquer momento:</p>
            <ul className="m-0 pl-5 flex flex-col gap-2 list-disc">
              <li>confirmar se tratamos os seus dados e ter acesso a eles;</li>
              <li>corrigir dados incompletos ou desatualizados;</li>
              <li>pedir a exclusão dos dados e da conta;</li>
              <li>pedir a portabilidade dos dados;</li>
              <li>retirar o consentimento.</li>
            </ul>
            <p className="m-0">
              Para exercer qualquer desses direitos, escreva para <a href={`mailto:${CONTATO}`} className="text-purple-700 font-semibold underline">{CONTATO}</a>.
              Você também pode recorrer à Autoridade Nacional de Proteção de Dados (ANPD).
            </p>
          </Secao>

          <Secao titulo="9. Menores de idade">
            <p className="m-0">O NeoSapiens é destinado a pessoas com 18 anos ou mais.</p>
          </Secao>

          <Secao titulo="10. Mudanças nesta política">
            <p className="m-0">
              Se esta política mudar, atualizaremos a data no topo da página. Mudanças importantes serão avisadas no próprio site.
            </p>
          </Secao>

          <footer className="pt-4 border-t border-gray-100">
            <Link href="/" className="inline-flex items-center min-h-[44px] text-purple-700 font-semibold hover:text-purple-900">← Voltar ao NeoSapiens</Link>
          </footer>
        </article>
      </div>
    </>
  );
}
