// src/pages/privacidade.tsx
// Política de Privacidade do NeoSapiens (pública; exigida pela LGPD e pelo
// Google para o login OAuth). Ao mudar o texto, atualize LEGAL_VERSION.

import LegalLayout, { Email, Secao, Tabela } from '../components/legal/LegalLayout';

const Sim = ({ why }: { why: string }) => (
  <>
    <strong>Sim</strong> ({why})
  </>
);

export default function Privacidade() {
  return (
    <LegalLayout
      title="Política de Privacidade"
      description="Quais dados o NeoSapiens coleta, por que, com quem compartilha e como você controla tudo isso."
      other={{ href: '/termos', label: 'Termos de Uso' }}
    >
      <p className="m-0 text-[15px] leading-relaxed text-gray-700">
        Esta política explica, em linguagem simples, quais dados o NeoSapiens coleta, por que, com quem compartilha e como você controla tudo isso, nos
        termos da Lei Geral de Proteção de Dados (Lei nº 13.709/2018, LGPD).
      </p>

      <Secao titulo="1. Quem é o responsável">
        <p className="m-0">
          O controlador dos dados é <strong>Deoclides dos Santos Costa Dias</strong>, pessoa física, com sede em São Luís (MA), responsável pelo NeoSapiens. Ele
          também atua como encarregado pelo tratamento de dados (DPO). Contato para qualquer assunto sobre dados: <Email />.
        </p>
      </Secao>

      <Secao titulo="2. Quais dados coletamos">
        <Tabela
          head={['Módulo', 'Dados', 'Sensível pela LGPD?']}
          rows={[
            ['Conta', 'e-mail e senha (guardada criptografada); com login Google, nome, e-mail e foto do perfil', 'Não'],
            ['Nascimento (Tradições)', 'nome completo, data, hora e cidade de nascimento, coordenadas e fuso horário', 'Não'],
            [
              'Corpo',
              'sono e horários de despertar, atividade física, alimentação, digestão e evacuação, cor da urina, sinais do corpo, álcool (AUDIT-C), tabaco, bem-estar (OMS-5)',
              <Sim key="s" why="saúde" />
            ],
            ['Personalidade', 'respostas ao Mini-IPIP: como você é, como gostaria de ser, como acha que deveria ser e como os outros veem você (respondido com alguém próximo, sem guardar nome nem dados dessa pessoa, ou por você mesmo)', <Sim key="s" why="psicológico" />],
            ['Mente', 'resultados dos testes de reação, memória, foco, flexibilidade e criatividade, e autoavaliação', <Sim key="s" why="cognitivo" />],
            ['Propósito', 'valores, sentido de vida, áreas da vida, florescimento, Cinco Espíritos', <Sim key="s" why="pode incluir espiritualidade e vida afetiva" />],
            ['Plano de Voo', 'rumo escolhido, plano WOOP, práticas, diário de bordo e revisão', 'Pode conter, conforme o que você escrever'],
            ['Santuário e Carta', 'notas de relaxamento antes e depois das sessões; sua resposta à Carta ao Navegante', 'Pode conter, conforme o que você escrever'],
            ['Uso técnico', 'tempos de resposta e verificações de qualidade das respostas', 'Não']
          ]}
        />
        <p className="m-0">Não pedimos documentos, dados bancários nem localização em tempo real.</p>
      </Secao>

      <Secao titulo="3. Para que usamos e com que base legal">
        <Tabela
          head={['Finalidade', 'Base legal (LGPD)']}
          rows={[
            ['Criar e manter a sua conta, guardar o seu progresso', 'Execução do serviço que você pediu (art. 7º, V)'],
            [
              'Calcular os mapas e gerar os seus resultados, a Carta e o Plano de Voo',
              'Dados comuns: execução do serviço (art. 7º, V). Dados sensíveis: seu consentimento específico e destacado (art. 11, I)'
            ],
            [
              <>
                Melhorar a plataforma e pesquisar padrões, sempre com dados <strong>anonimizados e agregados</strong>
              </>,
              'Legítimo interesse (art. 7º, IX) para dados comuns; dados sensíveis só com a sua autorização opcional para pesquisa e depois de anonimizados'
            ],
            ['Responder seus pedidos e mensagens', 'Execução do serviço (art. 7º, V)'],
            ['Cumprir obrigações legais e se defender em processos', 'Obrigação legal e exercício de direitos (art. 7º, II e VI)']
          ]}
        />
        <p className="m-0">
          O que <strong>não</strong> fazemos: vender dados, usar para publicidade, criar perfis para terceiros ou tomar decisões automáticas que afetem os seus
          direitos. Ninguém da equipe abre as suas respostas individuais para ler: o relatório em PDF só chega a alguém se você mesmo enviar.
        </p>
      </Secao>

      <Secao titulo="4. Dados sensíveis e pesquisa">
        <p className="m-0">
          Antes de cada módulo com dados sensíveis (Corpo, Personalidade, Mente e Propósito), pedimos o seu consentimento numa tela própria, que explica o que
          será coletado. Guardamos a data e a versão desta política junto com o aceite. Você pode retirar o consentimento a qualquer momento escrevendo para{' '}
          <Email />; nesse caso apagamos os dados daquele módulo e ele deixa de aparecer nas análises integradas.
        </p>
        <p className="m-0">
          No fim do Mapa NeoSapiens há uma autorização <strong>opcional</strong>, desmarcada, para usar as suas respostas de forma anonimizada e junto com as de
          outras pessoas em pesquisas que melhorem o NeoSapiens. Sem ela, as suas respostas servem só para os seus resultados. Você pode mudar essa escolha
          quando quiser.
        </p>
      </Secao>

      <Secao titulo="5. Com quem compartilhamos">
        <p className="m-0">Só com os serviços que fazem a plataforma funcionar (operadores), que tratam os dados em nosso nome:</p>
        <Tabela
          head={['Serviço', 'Para quê', 'Onde']}
          rows={[
            ['Supabase', 'banco de dados e login', 'Estados Unidos'],
            ['Vercel', 'hospedagem do site', 'Estados Unidos e rede global'],
            ['Google', 'login com Google (opcional); sugestão de cidades e fuso horário, que recebem só o texto digitado no campo de cidade', 'Estados Unidos'],
            ['Google Fonts', 'fontes do site, que recebem o endereço IP do navegador', 'Estados Unidos'],
            ['Zoho', 'e-mail do NeoSapiens, quando você nos escreve', 'Estados Unidos e Índia']
          ]}
        />
        <p className="m-0">
          Como esses servidores ficam fora do Brasil, há transferência internacional de dados (art. 33), apoiada nas cláusulas contratuais desses fornecedores e
          no seu consentimento. Fora isso, só entregamos dados a autoridades por ordem legal.
        </p>
      </Secao>

      <Secao titulo="6. Segurança">
        <p className="m-0">
          A conexão é sempre criptografada (HTTPS). As senhas são guardadas criptografadas pelo Supabase. Cada pessoa só consegue ler os próprios dados, por
          regras de acesso no banco. Se houver um incidente que possa trazer risco, avisaremos você e a ANPD.
        </p>
      </Secao>

      <Secao titulo="7. Por quanto tempo guardamos">
        <p className="m-0">
          Enquanto a sua conta existir. Ao pedir a exclusão, apagamos a conta e todas as respostas em até <strong>15 dias</strong>. Dados já anonimizados para
          pesquisa não identificam ninguém e podem ser mantidos. Contas sem acesso por <strong>2 anos</strong> serão avisadas por e-mail e depois excluídas.
        </p>
      </Secao>

      <Secao titulo="8. Seus direitos">
        <p className="m-0">Pela LGPD (art. 18), você pode, a qualquer momento e sem custo:</p>
        <ul className="m-0 pl-5 flex flex-col gap-1.5 list-disc">
          <li>confirmar se tratamos os seus dados e ter acesso a eles (o relatório em PDF já reúne tudo);</li>
          <li>corrigir dados incompletos ou desatualizados (refazendo o módulo);</li>
          <li>pedir anonimização, bloqueio ou exclusão;</li>
          <li>pedir a portabilidade dos dados;</li>
          <li>saber com quem compartilhamos;</li>
          <li>retirar o consentimento;</li>
          <li>reclamar à Autoridade Nacional de Proteção de Dados (ANPD).</li>
        </ul>
        <p className="m-0">
          Para exercer qualquer um deles, escreva para <Email />. Respondemos em até 15 dias.
        </p>
      </Secao>

      <Secao titulo="9. Menores de idade">
        <p className="m-0">O NeoSapiens é só para pessoas com 18 anos ou mais. Se soubermos que uma conta é de menor, ela será excluída.</p>
      </Secao>

      <Secao titulo="10. Cookies e armazenamento no navegador">
        <p className="m-0">
          Usamos apenas o necessário para o site funcionar: a sessão do login e o armazenamento local do navegador, que guarda respostas em andamento para você
          não perder o que já respondeu. Não usamos cookies de publicidade nem de rastreamento.
        </p>
      </Secao>

      <Secao titulo="11. Mudanças nesta política">
        <p className="m-0">
          Quando a política mudar, a data da versão muda e avisamos no site, pedindo o seu aceite da versão nova. Se a mudança afetar o uso de dados sensíveis,
          pediremos o seu consentimento de novo.
        </p>
      </Secao>
    </LegalLayout>
  );
}
