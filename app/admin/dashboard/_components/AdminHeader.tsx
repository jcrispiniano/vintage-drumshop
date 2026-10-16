'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LogOut, Package, FileText } from 'lucide-react'

const TABS = [
  { href: '/admin/dashboard', label: 'Produtos', icon: Package },
  { href: '/admin/dashboard/orcamentos', label: 'Orçamentos', icon: FileText },
]

export default function AdminHeader() {
  const pathname = usePathname() ?? ''
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    router.push('/admin')
  }

  // Orçamentos tem prefixo próprio; o resto do /admin/dashboard é a aba de produtos
  const activeHref = pathname.startsWith('/admin/dashboard/orcamentos') ? TABS[1].href : TABS[0].href

  return (
    <header className="bg-gray-900 text-white shadow-lg print:hidden">
      <div className="px-6 py-4 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-bold text-lg leading-none">Vintage Drum Shop</h1>
          <p className="text-gray-400 text-xs">Painel Admin</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" target="_blank" className="text-gray-400 hover:text-white text-sm transition hidden sm:block">
            Ver site →
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition">
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
                active ? 'bg-gray-50 text-gray-900' : 'text-gray-400 hover:text-white'
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
