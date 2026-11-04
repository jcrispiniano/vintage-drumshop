'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import CustomerForm from '../../_components/CustomerForm'
import type { Customer } from '@/lib/customers'
import type { Quote } from '@/lib/quote'

export default function EditarClientePage() {
  const { id } = useParams<{ id: string }>()
  const [data, setData] = useState<(Customer & { quotes: Quote[] }) | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/admin/customers/${id}`)
      .then(async res => {
        if (!res.ok) throw new Error()
        setData(await res.json())
      })
      .catch(() => setError('Cliente não encontrado.'))
  }, [id])

  if (error) return <p className="p-10 text-center text-red-600">{error}</p>
  if (!data) return <p className="p-10 text-center text-gray-400">Carregando cliente...</p>
  return <CustomerForm mode="edit" customer={data} quotes={data.quotes} />
}
