'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import CategoryNav from '@/components/CategoryNav';
import Sidebar from '@/components/Sidebar';
import { contactInfo } from '@/lib/products';

export default function PoliticaPrivacidadePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-orange-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <Header showBackButton={true} onMenuClick={() => setIsSidebarOpen(true)} />
      <CategoryNav currentCategory="" />

      <main id="main-content" className="container mx-auto px-4 py-12">
        <article className="bg-white rounded-2xl shadow-lg p-8 md:p-12 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Política de Privacidade
          </h1>
          
          <p className="text-sm text-gray-500 mb-8">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>

          <section className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Introdução</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              A <strong>Vintage Drum Shop</strong> está comprometida em proteger a privacidade e os dados pessoais de seus clientes, 
              em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei 13.709/2018). 
              Esta política descreve como coletamos, usamos, armazenamos e protegemos suas informações pessoais.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Dados Coletados</h2>
            <p className="text-gray-700 leading-relaxed mb-4">Coletamos os seguintes tipos de dados:</p>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li><strong>Dados de identificação:</strong> nome, CPF, telefone, e-mail</li>
              <li><strong>Dados de endereço:</strong> endereço de entrega e cobrança, CEP</li>
              <li><strong>Dados de navegação:</strong> cookies, endereço IP, páginas visitadas</li>
              <li><strong>Dados de pagamento:</strong> informações processadas por gateways de pagamento terceirizados (não armazenamos dados de cartão)</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Finalidade do Tratamento de Dados</h2>
            <p className="text-gray-700 leading-relaxed mb-4">Seus dados são utilizados para:</p>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>Processar e entregar pedidos</li>
              <li>Comunicar sobre o status do pedido</li>
              <li>Enviar ofertas e promoções (com seu consentimento)</li>
              <li>Melhorar a experiência de navegação no site</li>
              <li>Cumprir obrigações legais e fiscais</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Base Legal</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              O tratamento de seus dados pessoais é fundamentado nas seguintes bases legais da LGPD:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li><strong>Execução de contrato:</strong> processamento de pedidos</li>
              <li><strong>Consentimento:</strong> envio de comunicações de marketing</li>
              <li><strong>Legítimo interesse:</strong> análise de comportamento para melhoria do serviço</li>
              <li><strong>Obrigação legal:</strong> emissão de notas fiscais e cumprimento de obrigações tributárias</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Compartilhamento de Dados</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Seus dados podem ser compartilhados com:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li><strong>Transportadoras:</strong> para entrega de produtos</li>
              <li><strong>Gateways de pagamento:</strong> para processamento de transações</li>
              <li><strong>Autoridades competentes:</strong> quando exigido por lei</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-6">
              Não vendemos, alugamos ou compartilhamos seus dados com terceiros para fins de marketing sem seu consentimento explícito.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Seus Direitos (LGPD)</h2>
            <p className="text-gray-700 leading-relaxed mb-4">Você tem direito a:</p>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>Confirmação da existência de tratamento de dados</li>
              <li>Acesso aos seus dados pessoais</li>
              <li>Correção de dados incompletos, inexatos ou desatualizados</li>
              <li>Anonimização, bloqueio ou eliminação de dados desnecessários</li>
              <li>Portabilidade dos dados a outro fornecedor</li>
              <li>Revogação do consentimento</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mb-6">
              Para exercer seus direitos, entre em contato através do e-mail:{' '}
              <a href={`mailto:${contactInfo.email}`} className="text-accent font-semibold hover:underline">
                {contactInfo.email}
              </a>
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Segurança dos Dados</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Adotamos medidas técnicas e organizacionais para proteger seus dados contra acesso não autorizado, perda, 
              destruição ou alteração indevida. Utilizamos criptografia SSL/TLS em todas as transações e armazenamento seguro de dados.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Retenção de Dados</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Seus dados pessoais serão mantidos pelo período necessário para cumprir as finalidades descritas nesta política, 
              exceto quando a lei exigir um período de retenção mais longo (por exemplo, obrigações fiscais por 5 anos).
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Cookies</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Utilizamos cookies para melhorar sua experiência de navegação, lembrar preferências e analisar o tráfego do site. 
              Você pode gerenciar suas preferências de cookies nas configurações do navegador.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Alterações nesta Política</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Reservamo-nos o direito de atualizar esta política periodicamente. 
              Alterações serão comunicadas através do site e, quando relevantes, por e-mail.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. Contato</h2>
            <address className="not-italic text-gray-700 leading-relaxed mb-6">
              <p className="mb-2"><strong>Vintage Drum Shop</strong></p>
              <p className="mb-2">
                E-mail:{' '}
                <a href={`mailto:${contactInfo.email}`} className="text-accent font-semibold hover:underline">
                  {contactInfo.email}
                </a>
              </p>
              <p className="mb-2">
                Telefone:{' '}
                <a href={`tel:${contactInfo.phone}`} className="text-accent font-semibold hover:underline">
                  {contactInfo.phoneFormatted}
                </a>
              </p>
              <p className="mb-2">WhatsApp: {contactInfo.phoneFormatted}</p>
              <p className="mb-2">{contactInfo.address}</p>
            </address>
          </section>
        </article>
      </main>
    </div>
  );
}
