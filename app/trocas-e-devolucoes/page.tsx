import Header from '@/components/Header';
import CategoryNav from '@/components/CategoryNav';
import { contactInfo } from '@/lib/products';

export default function TrocasDevolucoes() {

  return (
    <div className="min-h-screen bg-paper">
      <Header />
      <CategoryNav currentCategory="" />

      <main id="main-content" className="container mx-auto px-4 py-12">
        <article className="mx-auto max-w-[72ch] rounded-xl bg-white p-6 ring-1 ring-line md:p-10">
          <h1 className="mb-4 text-3xl font-semibold uppercase leading-tight text-ink md:text-4xl">
            Política de Trocas e Devoluções
          </h1>
          
          <p className="text-sm text-ink-soft mb-8">
            Última atualização: 13/11/2026
          </p>

          <section>
            <h2 className="mb-3 mt-10 text-xl font-semibold uppercase text-ink">1. Direito de Arrependimento (CDC Art. 49)</h2>
            <p className="text-ink leading-relaxed mb-6">
              Conforme o <strong>Código de Defesa do Consumidor (Lei 8.078/90, Art. 49)</strong>, 
              você tem o direito de desistir da compra no prazo de <strong>7 (sete) dias corridos</strong>{' '}
              a partir da data de recebimento do produto, sem necessidade de justificativa.
            </p>
            <p className="text-ink leading-relaxed mb-6">
              Para exercer o direito de arrependimento, o produto deve estar em perfeitas condições, 
              sem sinais de uso, com embalagem original, acessórios, manuais e nota fiscal.
            </p>

            <h2 className="mb-3 mt-10 text-xl font-semibold uppercase text-ink">2. Como Solicitar a Devolução</h2>
            <ol className="list-decimal pl-6 mb-6 text-ink space-y-4">
              <li>
                <strong>Entre em contato conosco</strong> através de um dos canais:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>
                    E-mail:{' '}
                    <a href={`mailto:${contactInfo.sacEmail}`} className="text-accent font-semibold hover:underline">
                      {contactInfo.sacEmail}
                    </a>
                  </li>
                  <li>
                    Telefone/WhatsApp:{' '}
                    <a href={`tel:${contactInfo.phone}`} className="text-accent font-semibold hover:underline">
                      {contactInfo.phoneFormatted}
                    </a>
                  </li>
                </ul>
              </li>
              <li>
                <strong>Informe os dados do pedido:</strong> o código do pedido (começa com VDS e vai na mensagem que você enviou pelo WhatsApp) ou seu nome e a data da compra, e o motivo da devolução (opcional para direito de arrependimento)
              </li>
              <li>
                <strong>Aguarde instruções:</strong> nossa equipe enviará as orientações para postagem do produto
              </li>
              <li>
                <strong>Envie o produto:</strong> embale adequadamente e envie para o endereço fornecido
              </li>
            </ol>

            <h2 className="mb-3 mt-10 text-xl font-semibold uppercase text-ink">3. Reembolso</h2>
            <p className="text-ink leading-relaxed mb-6">
              Após recebermos e verificarmos o produto, o reembolso será processado em até <strong>10 dias úteis</strong>{' '}
              através da mesma forma de pagamento utilizada na compra:
            </p>
            <ul className="list-disc pl-6 mb-6 text-ink space-y-2">
              <li><strong>PIX/Transferência:</strong> estorno em até 2 dias úteis</li>
              <li><strong>Cartão de crédito:</strong> o estorno aparecerá na próxima fatura (prazo varia conforme operadora)</li>
              <li><strong>Boleto:</strong> reembolso via transferência bancária em até 10 dias úteis</li>
            </ul>

            <h2 className="mb-3 mt-10 text-xl font-semibold uppercase text-ink">4. Custo de Frete para Devolução</h2>
            <ul className="list-disc pl-6 mb-6 text-ink space-y-2">
              <li>
                <strong>Direito de arrependimento (7 dias):</strong> o custo do frete de devolução é de responsabilidade do cliente
              </li>
              <li>
                <strong>Defeito de fabricação ou produto errado:</strong> o frete é por nossa conta — entraremos em contato para agendar a coleta
              </li>
            </ul>

            <h2 className="mb-3 mt-10 text-xl font-semibold uppercase text-ink">5. Trocas por Defeito de Fabricação</h2>
            <p className="text-ink leading-relaxed mb-6">
              Produtos com defeito de fabricação podem ser trocados dentro do período de <strong>garantia do fabricante</strong>{' '}
              (conforme especificado no manual do produto). Siga o procedimento de devolução descrito acima e informe o defeito apresentado.
            </p>
            <p className="text-ink leading-relaxed mb-6">
              <strong>Importante:</strong> Defeitos causados por uso inadequado, queda, impacto ou mau uso não são cobertos pela garantia.
            </p>

            <h2 className="mb-3 mt-10 text-xl font-semibold uppercase text-ink">6. Troca por Outro Produto</h2>
            <p className="text-ink leading-relaxed mb-6">
              Caso deseje trocar por outro produto, realize a devolução e faça um novo pedido. 
              O reembolso será processado conforme descrito no item 3.
            </p>

            <h2 className="mb-3 mt-10 text-xl font-semibold uppercase text-ink">7. Produtos Não Elegíveis para Devolução</h2>
            <p className="text-ink leading-relaxed mb-6">
              Produtos com sinais de uso, danos causados pelo cliente, embalagem violada ou sem nota fiscal não poderão ser devolvidos, 
              exceto em caso de defeito de fabricação comprovado.
            </p>

            <h2 className="mb-3 mt-10 text-xl font-semibold uppercase text-ink">8. Contato</h2>
            <address className="not-italic text-ink leading-relaxed mb-6">
              <p className="mb-4">
                Para dúvidas ou solicitações de troca/devolução, entre em contato:
              </p>
              <p className="mb-2"><strong>Vintage Drum Shop</strong></p>
              <p className="mb-2">
                E-mail:{' '}
                <a href={`mailto:${contactInfo.sacEmail}`} className="text-accent font-semibold hover:underline">
                  {contactInfo.sacEmail}
                </a>
              </p>
              <p className="mb-2">
                Telefone/WhatsApp:{' '}
                <a href={`tel:${contactInfo.phone}`} className="text-accent font-semibold hover:underline">
                  {contactInfo.phoneFormatted}
                </a>
              </p>
              <p className="mb-2">{contactInfo.address}</p>
              <p className="mb-2">Horário de atendimento: {contactInfo.hours}</p>
            </address>

            <div className="bg-cream p-6 rounded-xl mt-8">
              <p className="text-ink font-semibold mb-2">Atendimento rápido via WhatsApp</p>
              <p className="text-ink-soft mb-4">
                Para um atendimento mais ágil, envie sua solicitação diretamente pelo WhatsApp.
              </p>
              <a 
                href={contactInfo.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center rounded-md bg-[#167a42] px-6 text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-[#11643a]"
              >
                Falar no WhatsApp
              </a>
            </div>
          </section>
        </article>
      </main>
    </div>
  );
}
