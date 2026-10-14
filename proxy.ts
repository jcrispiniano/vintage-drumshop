import { NextRequest, NextResponse } from 'next/server'
import { SESSION_COOKIE, verifySessionToken } from '@/lib/adminSession'

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isAdminDashboard = pathname.startsWith('/admin/dashboard')
  // /api/admin/auth é a rota de login — não deve ser protegida
  const isAdminApi =
    pathname.startsWith('/api/admin/') && !pathname.startsWith('/api/admin/auth')

  if (isAdminDashboard || isAdminApi) {
    const authenticated = await verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value)
    if (!authenticated) {
      if (isAdminApi) {
        return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/admin', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/dashboard/:path*', '/api/admin/:path*'],
}
