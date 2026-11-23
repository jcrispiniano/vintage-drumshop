'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LogOut, Package, FileText, Users, ListOrdered } from 'lucide-react'

const TABS = [
  { href: '/admin/dashboard', label: 'Produtos', icon: Package },
  { href: '/admin/dashboard/ordem', label: 'Ordem na loja', icon: ListOrdered },
  { href: '/admin/dashboard/orcamentos', label: 'Orçamentos', icon: FileText },
  { href: '/admin/dashboard/clientes', label: 'Clientes', icon: Users },
]

export default function AdminHeader() {
  const pathname = usePathname() ?? ''
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin')
  }

  // Orçamentos e Clientes têm prefixo próprio; o resto do /admin/dashboard é a aba de produtos
  const activeHref = TABS.slice(1).find(tab => pathname.startsWith(tab.href))?.href ?? TABS[0].href

  return (
    <header className="bg-ink text-white print:hidden">
      <div className="px-6 py-4 flex items-center justify-between gap-4">
        <div>
          <p className="font-display text-xl font-semibold uppercase leading-none">Vintage Drum Shop</p>
          <p className="text-on-dark-soft text-xs">Painel da loja</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" target="_blank" className="flex min-h-11 items-center text-on-dark-soft hover:text-white text-sm transition">
            Ver site →
          </Link>
          <button onClick={handleLogout} className="flex min-h-11 items-center gap-2 text-on-dark-soft hover:text-white text-sm transition">
            <LogOut size={16} />
            Sair
          </button>
        </div>
      </div>
      <nav className="px-4 flex gap-1" aria-label="Seções do painel">
        {TABS.map(tab => {
          const active = tab.href === activeHref
          const Icon = tab.icon
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? 'page' : undefined}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-t-lg transition ${
                active ? 'bg-paper text-ink' : 'text-on-dark-soft hover:text-white'
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
