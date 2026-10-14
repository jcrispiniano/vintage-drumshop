import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { SESSION_COOKIE, SESSION_MAX_AGE, createSessionToken, safeEqual } from '@/lib/adminSession'

// Limite de tentativas por IP. Em memória: vale por instância da função (melhor esforço),
// suficiente para frear tentativa de senha por força bruta sem depender de outro serviço.
const MAX_ATTEMPTS = 5
const LOCK_MS = 15 * 60 * 1000
const failures = new Map<string, { count: number; until: number }>()

function clientIp(req: NextRequest) {
  return req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown'
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req)
  const entry = failures.get(ip)
  if (entry && entry.count >= MAX_ATTEMPTS && entry.until > Date.now()) {
    return NextResponse.json(
      { error: 'Muitas tentativas. Tente novamente em alguns minutos.' },
      { status: 429 }
    )
  }

  const adminPassword = process.env.ADMIN_PASSWORD
  if (!adminPassword) {
    return NextResponse.json({ error: 'ADMIN_PASSWORD não configurada no servidor' }, { status: 503 })
  }

  const { password } = await req.json().catch(() => ({ password: '' }))

  if (typeof password !== 'string' || !safeEqual(password, adminPassword)) {
    const expired = !entry || entry.until <= Date.now()
    failures.set(ip, { count: expired ? 1 : entry.count + 1, until: Date.now() + LOCK_MS })
    await new Promise(r => setTimeout(r, 1000))
    return NextResponse.json({ error: 'Senha incorreta' }, { status: 401 })
  }

  failures.delete(ip)

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })

  return NextResponse.json({ ok: true })
}

export async function DELETE() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
  return NextResponse.json({ ok: true })
}
