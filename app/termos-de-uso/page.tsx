'use client';
import { useState } from 'react';
import Header from '@/components/Header';
import CategoryNav from '@/components/CategoryNav';
import Sidebar from '@/components/Sidebar';
import { contactInfo } from '@/lib/products';

export default function TermosDeUsoPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-orange-50">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <Header showBackButton={true} onMenuClick={() => setIsSidebarOpen(true)} />
      <CategoryNav currentCategory="" />

      <main id="main-content" className="container mx-auto px-4 py-12">
        <article className="bg-white rounded-2xl shadow-lg p-8 md:p-12 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Termos de Uso e Condições Gerais
          </h1>
          
          <p className="text-sm text-gray-500 mb-8">
            Última atualização: {new Date().toLocaleDateString('pt-BR')}
          </p>

          <section className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">1. Aceitação dos Termos</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Ao acessar e utilizar o site <strong>Vintage Drum Shop</strong>, você concorda em cumprir 
              estes Termos de Uso e todas as leis e regulamentos aplicáveis. 
              Se você não concordar com algum destes termos, não utilize nosso site.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">2. Uso do Site</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Este site é destinado à venda de instrumentos musicais, especialmente baterias, pratos e acessórios. 
              Você concorda em utilizar o site apenas para fins legais e de acordo com estes Termos.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              É proibido:
            </p>
            <ul className="list-disc pl-6 mb-6 text-gray-700 space-y-2">
              <li>Utilizar o site de forma que viole leis locais, estaduais ou federais</li>
              <li>Realizar atividades fraudulentas ou tentativas de acesso não autorizado</li>
              <li>Enviar vírus, malware ou qualquer código malicioso</li>
              <li>Reproduzir, duplicar ou copiar qualquer conteúdo sem autorização prévia</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">3. Cadastro e Conta de Usuário</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Para realizar compras, você pode precisar criar uma conta fornecendo informações verdadeiras e completas. 
              Você é responsável por manter a confidencialidade de sua senha e por todas as atividades realizadas em sua conta.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">4. Preços e Disponibilidade</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Todos os preços exibidos no site estão em <strong>Reais (BRL)</strong> e podem estar sujeitos a alterações sem aviso prévio. 
              Fazemos o possível para garantir a precisão das informações de preço e disponibilidade, 
              mas reservamo-nos o direito de corrigir erros evidentes.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Em caso de indisponibilidade de produto após a confirmação do pedido, 
              entraremos em contato para oferecer alternativas ou reembolso total.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">5. Pedidos e Pagamento</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Ao realizar um pedido, você se compromete a fornecer informações de pagamento válidas e autorizadas. 
              Os pedidos estão sujeitos à aprovação de pagamento e disponibilidade de estoque.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Reservamo-nos o direito de recusar ou cancelar pedidos que apresentem suspeita de fraude, 
              informações incorretas ou por qualquer outro motivo legítimo.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">6. Entrega</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Os prazos de entrega são estimados e podem variar conforme a localidade e disponibilidade da transportadora. 
              Não nos responsabilizamos por atrasos causados por transportadoras terceirizadas, 
              mas faremos o possível para auxiliar no rastreamento e solução de problemas.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">7. Garantia e Devoluções</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Os produtos comercializados possuem garantia conforme especificação do fabricante. 
              Para mais detalhes sobre trocas e devoluções, consulte nossa{' '}
              <a href="/trocas-e-devolucoes" className="text-accent font-semibold hover:underline">
                Política de Trocas e Devoluções
              </a>.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">8. Propriedade Intelectual</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Todo o conteúdo do site, incluindo textos, imagens, logotipos, marcas e design, 
              é de propriedade da <strong>Vintage Drum Shop</strong> ou de seus licenciadores 
              e está protegido pelas leis de direitos autorais e propriedade intelectual.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              É proibida a reprodução, distribuição ou uso comercial de qualquer conteúdo sem autorização expressa.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">9. Limitação de Responsabilidade</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              A <strong>Vintage Drum Shop</strong> não se responsabiliza por danos indiretos, incidentais ou consequentes 
              decorrentes do uso ou impossibilidade de uso do site ou produtos adquiridos, 
              exceto nos casos previstos pelo Código de Defesa do Consumidor.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">10. Privacidade</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Sua privacidade é importante para nós. Consulte nossa{' '}
              <a href="/politica-de-privacidade" className="text-accent font-semibold hover:underline">
                Política de Privacidade
              </a>{' '}
              para entender como coletamos, usamos e protegemos seus dados pessoais.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">11. Alterações nos Termos</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Reservamo-nos o direito de modificar estes Termos de Uso a qualquer momento. 
              Alterações entrarão em vigor imediatamente após a publicação no site. 
              Recomendamos a revisão periódica desta página.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">12. Lei Aplicável e Foro</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Estes Termos de Uso são regidos pelas leis da República Federativa do Brasil. 
              Eventuais disputas serão resolvidas no foro da comarca de <strong>São Paulo - SP</strong>, 
              com renúncia expressa a qualquer outro, por mais privilegiado que seja.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">13. Contato</h2>
            <address className="not-italic text-gray-700 leading-relaxed mb-6">
              <p className="mb-4">
                Para dúvidas, sugestões ou solicitações relacionadas a estes Termos de Uso:
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
            </address>
          </section>
        </article>
      </main>
    </div>
  );
}
