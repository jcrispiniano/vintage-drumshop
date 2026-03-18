'use client';

import { products, formatPrice, contactInfo } from '@/lib/products';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import InstagramFeed from '@/components/InstagramFeed';
import OrganizationSchema from '@/components/schemas/OrganizationSchema';
import CategoryNav from '@/components/CategoryNav';
import Header from '@/components/Header';
import ProductCard from '@/components/ProductCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const bannerSlides = [
  {
    image: '/banner/slide-1.jpg',
    alt: 'Baquetas Wincent profissionais - Linha completa de modelos 5A, 5B, 7A e mallets'
  },
  {
    image: '/banner/slide-2.jpg',
    alt: 'Pratos Istanbul Agop Traditional - Crafted in Turkey, sonoridade autêntica'
  },
  {
    image: '/banner/slide-3.jpg',
    alt: 'Coleção completa de baquetas Wincent - Precision, Jazz e modelos especiais'
  },
  {
    image: '/banner/slide-4.jpg',
    alt: 'Pratos Istanbul Agop Xist - Modernidade e versatilidade para todos os estilos'
  },
  {
    image: '/banner/slide-5.jpg',
    alt: 'Vassourinhas e Rods Wincent - Pro Brushes para jazz e estilos dinâmicos'
  },
  {
    image: '/banner/slide-6.jpg',
    alt: 'Setup completo com pratos Istanbul Agop - Crash, Ride e Hi-Hat profissionais'
  },
  {
    image: '/banner/slide-7.jpg',
    alt: 'Baquetas Dynabeat - Qualidade e custo-benefício para percussionistas'
  },
  {
    image: '/banner/slide-8.jpg',
    alt: 'Mallets Wincent - Dual Soft e Swoosh para percussão sinfônica'
  },
  {
    image: '/banner/slide-9.jpg',
    alt: 'Linha Signature Istanbul Agop - Joey Waronker, Mel Lewis e Special Jazz Edition'
  },
];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir < 0 ? '100%' : '-100%', opacity: 0 }),
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5 } },
};

export default function Home() {
  const featuredProducts = products.filter(p => p.featured);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  const benefitsRef = useRef(null);
  const brandsRef = useRef(null);
  const ofertasRef = useRef(null);
  const productsRef = useRef(null);

  const benefitsInView = useInView(benefitsRef, { once: true, margin: '-80px 0px' });
  const brandsInView = useInView(brandsRef, { once: true, margin: '-80px 0px' });
  const ofertasInView = useInView(ofertasRef, { once: true, margin: '-80px 0px' });
  const productsInView = useInView(productsRef, { once: true, margin: '-80px 0px' });

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentSlide(prev => (prev - 1 + bannerSlides.length) % bannerSlides.length);
  };

  const nextSlide = () => {
    setDirection(1);
    setCurrentSlide(prev => (prev + 1) % bannerSlides.length);
  };

  return (
    <div className="min-h-screen bg-white">
      <OrganizationSchema />

      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-accent focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:font-bold focus:shadow-lg"
      >
        Ir para o conteúdo principal
      </a>

      <Header />

      {/* Category Navigation - Mobile Only */}
      <div className="md:hidden">
        <CategoryNav stickyBelowHeader={true} />
      </div>

      <main id="main-content">
        {/* Hero Banner */}
        <section
          className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden"
          role="region"
          aria-label="Destaques e promoções"
        >
          <div className="container mx-auto px-4 py-16 md:py-24">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="space-y-6">
                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                  Baterias & Acessórios
                  <span className="block text-accent mt-2">Profissionais</span>
                </h1>
                <p className="text-xl text-gray-300">
                  Revenda Oficial Wincent e Istanbul Agop em São Paulo
                </p>
                <div className="flex flex-wrap gap-4">
                  <motion.a
                    href="#produtos"
                    className="bg-accent px-8 py-4 rounded-lg font-bold text-lg shadow-lg"
                    whileHover={{ backgroundColor: '#D2691E' }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Ver Catálogo
                  </motion.a>
                  <motion.a
                    href={contactInfo.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 px-8 py-4 rounded-lg font-bold text-lg shadow-lg"
                    whileHover={{ backgroundColor: '#16a34a' }}
                    whileTap={{ scale: 0.97 }}
                  >
                    Fale Conosco
                  </motion.a>
                </div>
              </div>

              {/* Animated banner carousel - desktop */}
              <div className="relative h-64 md:h-96 hidden md:block overflow-hidden rounded-3xl shadow-2xl">
                <AnimatePresence initial={false} custom={direction}>
                  <motion.img
                    key={currentSlide}
                    src={bannerSlides[currentSlide].image}
                    alt={bannerSlides[currentSlide].alt}
                    custom={direction}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>

                {/* Arrow controls */}
                <motion.button
                  onClick={prevSlide}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-black/40 text-white p-2 rounded-full"
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,107,53,0.9)' }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Slide anterior"
                >
                  <ChevronLeft size={20} />
                </motion.button>
                <motion.button
                  onClick={nextSlide}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-black/40 text-white p-2 rounded-full"
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,107,53,0.9)' }}
                  whileTap={{ scale: 0.9 }}
                  aria-label="Próximo slide"
                >
                  <ChevronRight size={20} />
                </motion.button>

                {/* Dot indicators with layoutId for smooth transitions */}
                <div
                  className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10"
                  role="group"
                  aria-label="Controles do carrossel"
                >
                  {bannerSlides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      aria-label={`Ir para slide ${index + 1}`}
                      aria-current={index === currentSlide ? 'true' : 'false'}
                      className="relative w-2 h-2 rounded-full bg-white/50"
                    >
                      {index === currentSlide && (
                        <motion.span
                          layoutId="activeDot"
                          className="absolute inset-0 rounded-full bg-white"
                          transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                        />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Bar */}
        <motion.section
          ref={benefitsRef}
          className="bg-white border-t border-b border-gray-200 py-6"
          initial={{ opacity: 0, y: 30 }}
          animate={benefitsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: (
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ), bg: 'bg-green-100', title: 'Frete Grátis', sub: 'Acima de R$ 199' },
                { icon: (
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                ), bg: 'bg-blue-100', title: 'Até 3x Sem Juros', sub: 'No cartão de crédito' },
                { icon: (
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ), bg: 'bg-purple-100', title: '5% de Desconto', sub: 'No PIX ou Boleto' },
                { icon: (
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                ), bg: 'bg-orange-100', title: 'SAC Especializado', sub: 'WhatsApp e Telefone' },
              ].map((benefit, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3"
                  initial={{ opacity: 0, scale: 0, rotate: -10 }}
                  animate={benefitsInView ? { opacity: 1, scale: 1, rotate: 0 } : {}}
                  transition={{ type: 'spring', stiffness: 500, delay: i * 0.1 }}
                >
                  <div className={`${benefit.bg} p-3 rounded-full flex-shrink-0`}>
                    {benefit.icon}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{benefit.title}</p>
                    <p className="text-xs text-gray-600">{benefit.sub}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Marcas Oficiais */}
        <motion.section
          ref={brandsRef}
          className="py-20 bg-primary"
          initial={{ opacity: 0, y: 40 }}
          animate={brandsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-accent font-bold text-sm tracking-wider uppercase">Marcas Oficiais</span>
              <h2 className="text-4xl md:text-5xl font-bold text-white mt-2 mb-4">
                Revendedor Autorizado
              </h2>
              <p className="text-lightBg text-lg max-w-2xl mx-auto">
                Trabalhamos apenas com marcas reconhecidas mundialmente pela qualidade e tradição
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {[
                {
                  logo: '/wincent-logo.png', alt: 'Wincent', label: 'Revenda Autorizada',
                  desc: 'Baquetas profissionais suecas com madeira de primeira qualidade. Durabilidade e equilíbrio perfeito para todos os estilos musicais.',
                  href: '/wincent', cta: 'Ver Baquetas Wincent →'
                },
                {
                  logo: '/istanbul-logo.png', alt: 'Istanbul Agop', label: 'Distribuidor Oficial',
                  desc: 'Pratos artesanais turcos feitos à mão há gerações. Som único, rico em harmônicos e usado pelos maiores bateristas do mundo.',
                  href: '/pratos', cta: 'Ver Pratos Istanbul →'
                },
              ].map((brand, i) => (
                <motion.div
                  key={i}
                  className="bg-lightBg p-12 rounded-2xl shadow-xl border-2 border-gray-100 hover:border-accent transition relative"
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  initial={{ opacity: 0, y: 30 }}
                  animate={brandsInView ? { opacity: 1, y: 0 } : {}}
                  style={{ transitionDelay: `${i * 0.1}s` }}
                >
                  <span className="absolute top-4 right-4 bg-accent text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                    OFICIAL
                  </span>
                  <div className="text-center flex flex-col h-full">
                    <div className="h-64 flex items-center justify-center mx-auto mb-6">
                      <motion.img
                        src={brand.logo}
                        alt={brand.alt}
                        className="max-h-full w-auto object-contain"
                        whileHover={{ scale: 1.08, rotate: -1 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      />
                    </div>
                    <p className="text-accent font-bold text-sm tracking-wide uppercase mb-3">{brand.label}</p>
                    <p className="text-gray-600 mb-6 leading-relaxed">{brand.desc}</p>
                    <Link href={brand.href} className="bg-accent text-white px-8 py-3 rounded-lg font-bold hover:bg-secondary transition w-full block text-center mt-auto">
                      {brand.cta}
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Ofertas Especiais */}
        <motion.section
          ref={ofertasRef}
          className="py-12 bg-white"
          initial={{ opacity: 0, y: 40 }}
          animate={ofertasInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">OFERTAS</h2>
              <div className="w-16 h-1 bg-accent mx-auto"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 max-w-6xl mx-auto">
              {products.filter(p => p.oldPrice).slice(0, 4).map((product, i) => {
                const discount = Math.round(((product.oldPrice! - product.price) / product.oldPrice!) * 100);
                return (
                  <motion.div
                    key={product.id}
                    className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200 group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={ofertasInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    whileHover={{ y: -3, boxShadow: '0 12px 24px rgba(139,69,19,0.12)' }}
                  >
                    <div className="relative">
                      <div className="absolute top-2 left-2 bg-gray-900 text-white px-2 py-1 rounded text-xs font-bold shadow-md z-10">
                        {discount}% OFF
                      </div>
                      <Link href={`/produto/${product.id}`} className="block relative h-44 md:h-56 bg-white overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain p-3 md:p-6 group-hover:scale-110 transition-transform duration-500 mix-blend-multiply"
                        />
                      </Link>
                    </div>
                    <div className="p-3">
                      <h3 className="font-bold text-sm mb-2 line-clamp-2 text-gray-900 leading-tight">
                        {product.name}
                      </h3>
                      <div className="mb-2 flex flex-col gap-0.5">
                        <data value={product.oldPrice} className="text-xs text-gray-400 line-through">
                          {formatPrice(product.oldPrice!)}
                        </data>
                        <div className="flex items-baseline gap-1">
                          <data value={product.price * 0.95} className="text-lg md:text-2xl font-bold text-accent">
                            {formatPrice(product.price * 0.95)}
                          </data>
                          <span className="text-xs text-green-600 font-bold">NO PIX</span>
                        </div>
                        <p className="text-xs text-gray-500">
                          ou {formatPrice(product.price)} em até <strong>5x</strong>
                        </p>
                      </div>
                      <Link
                        href={`/produto/${product.id}`}
                        className="block w-full bg-accent text-white py-1.5 md:py-2 rounded-lg font-bold text-xs md:text-sm text-center hover:bg-secondary transition shadow-sm"
                      >
                        COMPRAR
                      </Link>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* Produtos em Destaque */}
        <section id="produtos" className="py-12 bg-orange-50" ref={productsRef}>
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-12">
              <div>
                <span className="text-accent font-bold text-sm tracking-wider uppercase">Catálogo</span>
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mt-1">
                  Produtos em Destaque
                </h2>
              </div>
              <a href="#" className="hidden md:block text-accent font-bold hover:text-secondary transition">
                Ver Todos os Produtos →
              </a>
            </div>
            <motion.div
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4"
              variants={containerVariants}
              initial="hidden"
              animate={productsInView ? 'visible' : 'hidden'}
            >
              {featuredProducts.map(product => (
                <motion.article
                  key={product.id}
                  variants={itemVariants}
                  aria-label={`Produto: ${product.name}`}
                >
                  <ProductCard product={product} showInstallments={true} />
                </motion.article>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Instagram */}
        <section className="py-16 bg-gradient-to-br from-purple-50 to-pink-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-primary mb-4">
                Siga no Instagram
              </h2>
              <a
                href={contactInfo.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xl text-secondary hover:text-accent transition"
              >
                {contactInfo.instagramHandle}
              </a>
            </div>
            <InstagramFeed />
            <div className="text-center mt-8">
              <a
                href={contactInfo.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-full font-semibold hover:from-purple-600 hover:to-pink-600 transition"
              >
                Ver mais no Instagram →
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-darkBg text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <img
                src="/logo-small.png"
                alt="Vintage Drum Shop — Percussão Profissional"
                className="h-20 w-auto mb-4"
              />
              <p className="text-sm text-gray-300">
                Revenda oficial Wincent e Istanbul Agop. Qualidade e tradição em instrumentos musicais.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-accent">Categorias</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/baterias" className="hover:text-accent transition">Baterias</Link></li>
                <li><Link href="/pratos" className="hover:text-accent transition">Pratos</Link></li>
                <li><Link href="/caixas" className="hover:text-accent transition">Caixas</Link></li>
                <li><Link href="/baquetas" className="hover:text-accent transition">Baquetas</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-accent">Atendimento</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href={contactInfo.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:text-accent transition">
                    Fale Conosco
                  </a>
                </li>
                <li><Link href="/trocas-e-devolucoes" className="hover:text-accent transition">Trocas e Devoluções</Link></li>
                <li><Link href="/politica-de-privacidade" className="hover:text-accent transition">Política de Privacidade</Link></li>
                <li><Link href="/termos-de-uso" className="hover:text-accent transition">Termos de Uso</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 text-accent">Contato</h4>
              <address className="not-italic text-sm space-y-2">
                <p className="block">
                  <a href={`tel:${contactInfo.phone}`} className="hover:text-accent transition" aria-label={`Ligar para ${contactInfo.phoneFormatted}`}>
                    {contactInfo.phoneFormatted}
                  </a>
                </p>
                <p className="block">
                  <a href={`mailto:${contactInfo.email}`} className="hover:text-accent transition" aria-label={`Enviar e-mail para ${contactInfo.email}`}>
                    {contactInfo.email}
                  </a>
                </p>
                <p className="block">
                  <a href={contactInfo.instagram} target="_blank" rel="noopener noreferrer me" className="hover:text-accent transition" aria-label={`Seguir ${contactInfo.instagramHandle} no Instagram`}>
                    {contactInfo.instagramHandle}
                  </a>
                </p>
                <p className="block">{contactInfo.address}</p>
                <p className="block">{contactInfo.hours} (Horário de Brasília - GMT-3)</p>
              </address>
              <div className="flex gap-2 mt-4">
                <a
                  href={contactInfo.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Falar conosco pelo WhatsApp"
                  className="flex-1 bg-green-500 px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-600 transition text-center"
                >
                  WhatsApp
                </a>
                <a
                  href={contactInfo.instagram}
                  target="_blank"
                  rel="noopener noreferrer me"
                  aria-label="Seguir Vintage Drum Shop no Instagram"
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 rounded-full text-sm font-semibold hover:from-purple-600 hover:to-pink-600 transition text-center"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2026 Vintage Drum Shop - Todos os direitos reservados</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
