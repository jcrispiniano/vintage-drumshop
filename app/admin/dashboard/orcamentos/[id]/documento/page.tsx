'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Edit, MessageCircle, Printer } from 'lucide-react'
import { Quote, formatQuoteDate, itemTotal, quoteCompany, quoteNumber, quoteTotal } from '@/lib/quote'
import { formatPrice } from '@/lib/products'

// Cores do modelo do Canva
const MAROON = '#6B2511'
const PAPER = '#EDE2D1'

/** Texto curto do orçamento para mandar no WhatsApp junto com o PDF. */
function whatsappText(quote: Quote) {
  const lines = quote.items.map(i => `• ${i.qty}x ${i.description}: ${i.gift ? 'BRINDE' : formatPrice(itemTotal(i))}`)
  return [
    `*Cotação Vintage Drum Shop ${quoteNumber(quote.id)}*`,
    `Cliente: ${quote.client_name}`,
    '',
    ...lines,
    '',
    `*Total: ${formatPrice(quoteTotal(quote.items))}*`,
    quote.notes ? `\n${quote.notes}` : '',
  ].join('\n')
}

function whatsappHref(quote: Quote) {
  const digits = (quote.client_contact ?? '').replace(/\D/g, '')
  // Só usa o contato como número se parecer um telefone brasileiro
  const phone = digits.length >= 10 && digits.length <= 13 ? (digits.startsWith('55') ? digits : `55${digits}`) : ''
  return `https://wa.me/${phone}?text=${encodeURIComponent(whatsappText(quote))}`
}

export default function DocumentoOrcamentoPage() {
  const { id } = useParams<{ id: string }>()
  const [quote, setQuote] = useState<Quote | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/admin/quotes/${id}`)
      .then(async res => {
        if (!res.ok) throw new Error()
        setQuote(await res.json())
      })
      .catch(() => setError('Orçamento não encontrado.'))
  }, [id])

  // O nome do PDF salvo vem do título da página
  useEffect(() => {
    if (quote) document.title = `Cotação ${quoteNumber(quote.id)} - ${quote.client_name}`
  }, [quote])

  if (error) return <p className="p-10 text-center text-red-600">{error}</p>
  if (!quote) return <p className="p-10 text-center text-gray-400">Carregando documento...</p>

  const total = quoteTotal(quote.items)
  const cell = 'border border-[#2B1D14] px-3 py-3 text-center align-middle'

  return (
    <div className="min-h-screen bg-gray-200 py-6 print:min-h-0 print:bg-transparent print:py-0">
      {/* Impressão: a folha ocupa exatamente a área da página (100vh). Se o navegador forçar margens
          (o Safari costuma fazer isso), ela encolhe junto em vez de empurrar o rodapé para a página 2. */}
      <style>{`
        @page { size: A4; margin: 0; }
        @media print {
          html, body { margin: 0 !important; padding: 0 !important; background: ${PAPER} !important; }
          .quote-sheet { width: 100% !important; max-width: none !important; min-height: 0 !important; height: 100vh !important; overflow: hidden; break-after: avoid; break-inside: avoid; }
        }
        .quote-sheet { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      `}</style>

      {/* Barra de ações (não sai na impressão) */}
      <div className="mx-auto mb-6 flex max-w-[210mm] flex-wrap items-center justify-between gap-3 px-4 print:hidden">
        <Link href="/admin/dashboard/orcamentos" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900">
          <ArrowLeft size={16} /> Orçamentos
        </Link>
        <div className="flex flex-wrap gap-2">
          <Link href={`/admin/dashboard/orcamentos/${quote.id}`} className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm hover:bg-gray-50">
            <Edit size={16} /> Editar
          </Link>
          <a href={whatsappHref(quote)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-[#167a42] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#11643a]">
            <MessageCircle size={16} /> Enviar resumo no WhatsApp
          </a>
          <button type="button" onClick={() => window.print()} className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-bold text-white shadow-sm hover:bg-orange-600">
            <Printer size={16} /> Baixar PDF / Imprimir
          </button>
        </div>
        <p className="w-full text-xs text-gray-500">
          Para salvar em PDF, escolha <strong>Salvar como PDF</strong> no destino da impressão e ative <strong>Gráficos de fundo</strong>.
        </p>
      </div>

      {/* Folha A4 */}
      <article
        className="quote-sheet relative mx-auto flex min-h-[297mm] w-[210mm] max-w-full flex-col overflow-hidden px-[16mm] pb-[12mm] pt-[16mm] font-sans text-[#2B1D14] shadow-xl print:shadow-none"
        style={{ backgroundColor: PAPER }}
      >
        {/* Marca d'água: a logo já vem clareada no arquivo (sem opacity no CSS, que escurecia no PDF) */}
        {/* eslint-disable-next-line @next/next/no-img-element -- img comum imprime com fidelidade */}
        <img src="/logo-marca-dagua.png" alt="" aria-hidden className="pointer-events-none absolute left-1/2 top-[92mm] w-[160mm] -translate-x-1/2" />

        <header className="relative flex items-start justify-between gap-8">
          <div className="min-w-0 flex-1 pt-2">
            <h1 className="font-sans text-[64px] font-extrabold leading-none tracking-[-0.03em]" style={{ color: MAROON }}>
              Cotação
            </h1>
            <p className="mt-5 text-[19px] leading-snug" style={{ color: MAROON }}>
              Cliente: {quote.client_name}
            </p>
            {quote.client_contact && <p className="mt-1 text-[13px] opacity-80" style={{ color: MAROON }}>{quote.client_contact}</p>}
            <p className="mt-8 text-[24px] font-bold" style={{ color: MAROON }}>{formatQuoteDate(quote.quote_date)}</p>
            <p className="mt-1 text-[12px] font-semibold tracking-wide opacity-70" style={{ color: MAROON }}>{quoteNumber(quote.id)}</p>
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element -- img comum imprime com fidelidade */}
          <img src="/logo-vintage.png" alt="Vintage Drum Shop" className="-mt-2 w-[60mm] flex-shrink-0" />
        </header>

        <table className="relative mt-[12mm] w-full border-collapse text-[12.5px] leading-snug">
          <thead>
            <tr style={{ backgroundColor: MAROON }} className="text-white">
              <th className={`${cell} w-[34%] text-[14px] font-bold`}>Item</th>
              <th className={`${cell} text-[14px] font-bold`}>Preço</th>
              <th className={`${cell} text-[14px] font-bold`}>Condição de Pagamento</th>
              <th className={`${cell} w-[9%] text-[14px] font-bold`}>Qt.</th>
              <th className={`${cell} text-[14px] font-bold`}>Total - Preço Final</th>
            </tr>
          </thead>
          <tbody>
            {quote.items.map((item, i) => (
              <tr key={i} className="break-inside-avoid">
                <td className={`${cell} whitespace-pre-line`}>{item.description}</td>
                <td className={`${cell} whitespace-nowrap tabular-nums`}>{item.gift ? 'BRINDE' : formatPrice(item.price)}</td>
                <td className={cell}>{item.gift ? '-//-' : item.payment}</td>
                <td className={`${cell} tabular-nums`}>{item.gift ? '-//-' : item.qty}</td>
                <td className={`${cell} whitespace-nowrap tabular-nums`}>{formatPrice(itemTotal(item))}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={3} className="border-0" />
              <td colSpan={2} className={`${cell} whitespace-nowrap py-4 text-[19px] font-bold tabular-nums`} style={{ color: MAROON }}>
                Total: {formatPrice(total)}
              </td>
            </tr>
          </tbody>
        </table>

        {quote.notes && (
          <section className="relative mt-[12mm] max-w-[85mm] break-inside-avoid italic" style={{ color: MAROON }}>
            <h2 className="font-sans text-[15px] font-bold not-italic tracking-normal">
              <em>Observação Importante:</em>
            </h2>
            <p className="mt-2 whitespace-pre-line text-[13.5px] leading-snug">{quote.notes}</p>
          </section>
        )}

        <footer className="relative mt-auto pt-[12mm] break-inside-avoid">
          <div className="h-[3px] w-full" style={{ backgroundColor: MAROON }} />
          <div className="mt-[6mm] flex items-center gap-[8mm]">
            {/* eslint-disable-next-line @next/next/no-img-element -- img comum imprime com fidelidade */}
            <img src="/logo-v.png" alt="" className="h-[22mm] w-[22mm] flex-shrink-0 object-contain" />
            <div className="h-[18mm] w-[2px] flex-shrink-0 bg-[#2B1D14]" />
            <p className="whitespace-nowrap text-[22px] font-bold tracking-[-0.01em]" style={{ color: MAROON }}>{quoteCompany.instagram}</p>
            <div className="ml-auto whitespace-nowrap text-[15px] leading-tight" style={{ color: MAROON }}>
              <p>{quoteCompany.phone}</p>
              <p>CNPJ: {quoteCompany.cnpj}</p>
            </div>
          </div>
        </footer>
      </article>
    </div>
  )
}
