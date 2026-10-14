# 🥁 Vintage Drum Shop

Loja online da Vintage Drum Shop (baterias, pratos e acessórios), feita em Next.js e publicada na Vercel em https://vintagedrumshop.com.br.

## ✨ Tecnologias

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS 4**
- **Supabase**: banco de produtos, editados pelo painel `/admin`
- **Vercel Blob**: upload de imagens dos produtos
- **Zustand**: carrinho e favoritos (persistidos no navegador)
- **Framer Motion**, **Lucide React**
- **Vercel Analytics** e **Speed Insights**

O checkout é feito pelo WhatsApp: o carrinho monta a mensagem do pedido.

## 📁 Estrutura

```
app/
├── (categorias)/page.tsx   # /baterias, /pratos, /caixas, ...
├── produto/[id]/           # Página de produto (ISR, revalida a cada 60s)
├── admin/                  # Login e painel de produtos
├── api/products            # Lista pública de produtos
├── api/admin/*             # CRUD de produtos e upload (protegido)
├── sitemap.ts, robots.ts   # SEO
components/                 # Header, ProductCard, CategoryNav, ...
lib/
├── products.ts             # Produtos estáticos (fallback sem Supabase) + contatos
├── db.ts                   # Leitura de produtos (Supabase → fallback estático)
├── adminSession.ts         # Sessão do admin assinada (HMAC)
proxy.ts                    # Protege /admin/dashboard e /api/admin
supabase/schema.sql         # Schema e RLS da tabela products
```

## 🔑 Variáveis de ambiente

| Variável | Uso |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave pública (leitura) |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave de serviço (escrita pelo painel) |
| `ADMIN_PASSWORD` | Senha do `/admin`. **Obrigatória**: sem ela o login fica desativado |
| `ADMIN_SESSION_SECRET` | Opcional. Segredo que assina o cookie de sessão (padrão: `ADMIN_PASSWORD`) |
| `BLOB_READ_WRITE_TOKEN` | Criada pela Vercel ao conectar o Blob Store |

Sem as variáveis do Supabase o site funciona com os produtos de `lib/products.ts`.

## 🚀 Desenvolvimento

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build
```

## 📱 Contato

- WhatsApp: (11) 94739-7347
- E-mail: drumshopvintage@gmail.com
- Instagram: [@vintage.drumshop](https://www.instagram.com/vintage.drumshop)
