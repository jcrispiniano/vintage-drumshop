// Sessão do admin assinada com HMAC-SHA256 (Web Crypto — funciona no proxy/edge e no Node).
// O cookie guarda "<expiração>.<assinatura>", então não pode ser forjado sem o segredo.

export const SESSION_COOKIE = 'admin_session'
export const SESSION_MAX_AGE = 60 * 60 * 8 // 8 horas

function getSecret(): string | null {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || null
}

async function hmac(data: string, secret: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data))
  return Array.from(new Uint8Array(sig), b => b.toString(16).padStart(2, '0')).join('')
}

export function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

export async function createSessionToken(): Promise<string> {
  const secret = getSecret()
  if (!secret) throw new Error('ADMIN_PASSWORD não configurada')
  const expires = String(Date.now() + SESSION_MAX_AGE * 1000)
  return `${expires}.${await hmac(expires, secret)}`
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  const secret = getSecret()
  if (!secret || !token) return false
  const [expires, sig] = token.split('.')
  if (!expires || !sig || Number(expires) < Date.now()) return false
  return safeEqual(sig, await hmac(expires, secret))
}
