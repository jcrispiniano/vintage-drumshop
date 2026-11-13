import type { Metadata } from 'next'
import HomePage from './HomePage'
import GoogleReviews from '@/components/GoogleReviews'

export const metadata: Metadata = {
  title: 'Vintage Drum Shop | Pratos Istanbul Agop, baquetas Wincent e baterias',
  description: 'Loja de bateria em São Paulo: pratos Istanbul Agop (chimbal/hi-hat, crash, ride), baquetas Wincent e Dynabeat, caixas e baterias. 10% no Pix ou 10x sem juros, envio para todo o Brasil.',
  alternates: { canonical: '/' },
}

export default function Page() {
  return (
    <>
      <HomePage />
      {/* Servidor: a chave do Google nunca vai para o navegador */}
      <GoogleReviews />
    </>
  )
}
