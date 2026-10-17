'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import QuoteForm, { QuoteFormData } from '../../_components/QuoteForm'
import type { Quote } from '@/lib/quote'

export default function EditarOrcamentoPage() {
  const { id } = useParams<{ id: string }>()
  const [data, setData] = useState<QuoteFormData | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/admin/quotes/${id}`)
      .then(async res => {
        if (!res.ok) throw new Error()
        const quote: Quote = await res.json()
        setData({
          clientName: quote.client_name,
          clientContact: quote.client_contact ?? '',
          quoteDate: quote.quote_date,
          items: quote.items,
          notes: quote.notes ?? '',
        })
      })
      .catch(() => setError('Orçamento não encontrado.'))
  }, [id])

  if (error) return <p className="p-10 text-center text-red-600">{error}</p>
  if (!data) return <p className="p-10 text-center text-gray-400">Carregando orçamento...</p>
  return <QuoteForm mode="edit" id={Number(id)} initialData={data} />
}
