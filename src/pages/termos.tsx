// src/pages/termos.tsx
// Termos de Uso do NeoSapiens (públicos). Ao mudar o texto, atualize LEGAL_VERSION.

import LegalLayout, { Email, Secao } from '../components/legal/LegalLayout';

export default function Termos() {
  return (
    <LegalLayout
      title="Termos de Uso"
      description="As regras de uso do NeoSapiens: o que a plataforma é, o que não é, e os seus direitos."
      other={{ href: '/privacidade', label: 'Política de Privacidade' }}
    >
      <p className="m-0 text-[15px] leading-relaxed text-gray-700">
        Ao criar uma conta, você concorda com estes termos e com a <a href="/privacidade" className="text-purple-700 font-semibold underline">Política de Privacidade</a>.
      </p>

      <Secao titulo="1. O que é o NeoSapiens">
        <p className="m-0">
          Uma plataforma de autoconhecimento que reúne questionários e testes científicos (corpo, personalidade, mente e propósito) e leituras de tradições
          (astrologia ocidental e chinesa, numerologia e Medicina Tradicional Chinesa). O resultado é <strong>uma bússola para reflexão, não um manual</strong> de
          como ser.
        </p>
      </Secao>

      <Secao titulo="2. Não é serviço de saúde">
        <p className="m-0">
          O NeoSapiens <strong>não faz diagnóstico médico, psicológico ou nutricional</strong> e não substitui consulta, exame ou tratamento. As práticas do
          Plano de Voo e as sessões do Santuário são sugestões simples de estilo de vida e relaxamento. Antes de mudar alimentação, exercício, sono, uso de
          medicamentos ou de suplementos, fale com um profissional de saúde. Sintomas persistentes ou que preocupem pedem avaliação profissional.
        </p>
        <p className="m-0">
          Em sofrimento emocional intenso, procure ajuda: o <strong>CVV</strong> atende pelo telefone <strong>188</strong>, de graça, 24 horas.
        </p>
      </Secao>

      <Secao titulo="3. Ciência e tradições">
        <p className="m-0">
          As medidas científicas usam instrumentos publicados, adaptados e creditados em cada resultado, e têm margens de erro que mostramos. As leituras das
          tradições <strong>não são científicas</strong>: são apresentadas sempre separadas, como forma holística de reflexão. A Ponte, que coloca as duas lado a
          lado, e a Carta ao Navegante são modelos próprios do NeoSapiens, com as regras visíveis, e não resultados científicos.
        </p>
      </Secao>

      <Secao titulo="4. Sua conta">
        <ul className="m-0 pl-5 flex flex-col gap-1.5 list-disc">
          <li>É preciso ter 18 anos ou mais.</li>
          <li>A conta é pessoal: não compartilhe a senha. Você é responsável pelo que for feito com ela.</li>
          <li>Responda com sinceridade: os resultados só fazem sentido se as respostas forem suas.</li>
          <li>
            Você pode encerrar a conta quando quiser, pedindo a exclusão para <Email />.
          </li>
        </ul>
      </Secao>

      <Secao titulo="5. Uso adequado">
        <p className="m-0">
          Não é permitido: usar a plataforma para avaliar outra pessoa sem a autorização dela; tentar acessar dados de outros usuários; automatizar respostas ou
          sobrecarregar o serviço; copiar o conteúdo da plataforma para oferecer serviço concorrente. Podemos suspender contas que façam isso.
        </p>
      </Secao>

      <Secao titulo="6. Propriedade intelectual">
        <p className="m-0">
          Textos, desenhos, gráficos, áudios, regras de integração e código do NeoSapiens pertencem a <strong>Deoclides dos Santos Costa Dias</strong>. Os
          instrumentos de terceiros pertencem aos seus autores e são usados conforme as suas licenças, com crédito em cada resultado (por exemplo: Mini-IPIP, de
          domínio público; IPAQ, licença CC BY 4.0; Escala de Florescimento, uso livre com crédito). Os seus resultados são seus: você pode salvá-los e
          compartilhá-los como quiser.
        </p>
      </Secao>

      <Secao titulo="7. Planos pagos">
        <p className="m-0">
          Hoje o NeoSapiens é gratuito. Quando houver planos pagos, como as rotas Argonauta, preço, forma de pagamento, renovação e cancelamento serão informados
          antes da contratação, e valerá o direito de arrependimento de 7 dias do Código de Defesa do Consumidor (art. 49).
        </p>
      </Secao>

      <Secao titulo="8. Limites de responsabilidade">
        <p className="m-0">
          Fazemos o possível para que a plataforma funcione bem e os cálculos estejam corretos, mas ela pode ter falhas ou ficar fora do ar. As decisões que você
          tomar a partir dos resultados são suas. Nada nestes termos afasta os direitos que o Código de Defesa do Consumidor garante.
        </p>
      </Secao>

      <Secao titulo="9. Mudanças e encerramento">
        <p className="m-0">
          Podemos atualizar estes termos; a versão nova vale a partir da publicação, com aviso no site. Se o NeoSapiens for encerrado, avisaremos com pelo menos
          30 dias para que você salve os seus relatórios.
        </p>
      </Secao>

      <Secao titulo="10. Lei e foro">
        <p className="m-0">Vale a lei brasileira. Fica eleito o foro do domicílio do usuário, como prevê o Código de Defesa do Consumidor.</p>
      </Secao>
    </LegalLayout>
  );
}
