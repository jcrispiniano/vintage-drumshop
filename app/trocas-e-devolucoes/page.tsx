'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import CategoryNav from '@/components/CategoryNav';
import { contactInfo } from '@/lib/products';

export default function TrocasDevolucoes() {

  return (
    <div className="min-h-screen bg-orange-50">
      <Header showBackButton={true} />
      <CategoryNav currentCategory="" />

      <main id="main-content" className="container mx-auto px-4 py-12">
        <article className="bg-white rounded-2xl shadow-lg p-8 md:p-12 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Política de Trocas e Devoluções
          </h1>
          
          <p className="text-sm text-gray-500 mb-8">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>

          <section className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Direito de Arrependimento (CDC Art. 49)</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Conforme o <strong>Código de Defesa do Consumidor (Lei 8.078/90, Art. 49)</strong>, 
              você tem o direito de desistir da compra no prazo de <strong>7 (sete) dias corridos</strong> 
              a partir da data de recebimento do produto, sem necessidade de justificativa.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Para exercer o direito de arrependimento, o produto deve estar em perfeitas condições, 
              sem sinais de uso, com embalagem original, acessórios, manuais e nota fiscal.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Como Solicitar a Devolução</h2>
            <ol className="list-decimal pl-6 mb-6 text-gray-700 space-y-4">
              <li>
                <strong>Entre em contato conosco</strong> através de um dos canais:
                <ul className="list-disc pl-6 mt-2 space-y-1">
                  <li>
                    E-mail:{' '}
                    <a href={`mailto:${contactInfo.email}`} className="text-accent font-semibold hover:underline">
                      {contactInfo.email}
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
                <strong>Informe os dados do pedido:</strong> número do pedido, data de compra e motivo da devolução (opcional para direito de arrependimento)
              </li>
              <li>
                <strong>Aguarde instruções:</strong> nossa equipe enviará as orientações para postagem do produto
              </li>
              <li>
                <strong>Envie o produto:</strong> embale adequadamente e envie para o endereço fornecido
              </li>
            </ol>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Reembolso</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Após recebermos e verificarmos o produto, o reembolso será processado em até <strong>10 dias úteis</strong> 
              através da mesma forma de pagamento utilizada na compra:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li><strong>PIX/Transferência:</strong> estorno em até 2 dias úteis</li>
              <li><strong>Cartão de crédito:</strong> o estorno aparecerá na próxima fatura (prazo varia conforme operadora)</li>
              <li><strong>Boleto:</strong> reembolso via transferência bancária em até 10 dias úteis</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Custo de Frete para Devolução</h2>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>
                <strong>Direito de arrependimento (7 dias):</strong> o custo do frete de devolução é de responsabilidade do cliente
              </li>
              <li>
                <strong>Defeito de fabricação ou produto errado:</strong> o frete é por nossa conta — entraremos em contato para agendar a coleta
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Trocas por Defeito de Fabricação</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Produtos com defeito de fabricação podem ser trocados dentro do período de <strong>garantia do fabricante</strong> 
              (conforme especificado no manual do produto). Siga o procedimento de devolução descrito acima e informe o defeito apresentado.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              <strong>Importante:</strong> Defeitos causados por uso inadequado, queda, impacto ou mau uso não são cobertos pela garantia.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Troca por Outro Produto</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Caso deseje trocar por outro produto, realize a devolução e faça um novo pedido. 
              O reembolso será processado conforme descrito no item 3.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Produtos Não Elegíveis para Devolução</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Produtos com sinais de uso, danos causados pelo cliente, embalagem violada ou sem nota fiscal não poderão ser devolvidos, 
              exceto em caso de defeito de fabricação comprovado.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Contato</h2>
            <address className="not-italic text-gray-700 leading-relaxed mb-6">
              <p className="mb-4">
                Para dúvidas ou solicitações de troca/devolução, entre em contato:
              </p>
              <p className="mb-2"><strong>Vintage Drum Shop</strong></p>
              <p className="mb-2">
                E-mail:{' '}
                <a href={`mailto:${contactInfo.email}`} className="text-accent font-semibold hover:underline">
                  {contactInfo.email}
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

            <div className="bg-orange-50 border-l-4 border-accent p-6 rounded-lg mt-8">
              <p className="text-gray-700 font-semibold mb-2">📞 Atendimento rápido via WhatsApp</p>
              <p className="text-gray-600 mb-4">
                Para um atendimento mais ágil, envie sua solicitação diretamente pelo WhatsApp.
              </p>
              <a 
                href={contactInfo.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-600 transition"
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
