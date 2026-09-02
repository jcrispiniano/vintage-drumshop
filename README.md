# 🥁 Vintage Drum Shop

Site profissional Next.js com TypeScript e Tailwind CSS para loja de baterias e acessórios musicais.

## ✨ Tecnologias

- **Next.js 15** - Framework React com SSR e SSG
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Utility-first CSS
- **Lucide React** - Ícones modernos
- **Framer Motion** - Animações (preparado)
- **Zustand** - State management (preparado)

## 🎯 Funcionalidades

- ✅ Design moderno e responsivo
- ✅ Sistema de carrinho React
- ✅ Sistema de favoritos
- ✅ Busca de produtos
- ✅ Integração com WhatsApp
- ✅ Otimizado para GitHub Pages
- ✅ TypeScript para type safety
- ✅ Tailwind para styling rápido
- ✅ Componentes reutilizáveis

## 📁 Estrutura

```
vintage-drum-shop/
├── app/
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Homepage
│   └── globals.css         # Estilos globais
├── components/             # Componentes reutilizáveis (preparado)
├── lib/
│   └── products.ts         # Base de dados de produtos
├── public/                 # Assets estáticos
└── next.config.js          # Config Next.js + GitHub Pages
```

## 🚀 Desenvolvimento

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build para produção
npm run build

# Export estático para GitHub Pages
npm run build
```

## 🗄️ Banco de dados (Supabase)

O schema fica em `supabase/schema.sql` e pode ser rodado quantas vezes for
preciso no **SQL Editor** do projeto Supabase.

**Se o painel `/admin` mostrar um erro como**
`Could not find the 'sold_out' column of 'products' in the schema cache`,
a base está sem uma coluna que o código já usa. Rode
`supabase/migrations/001_add_sold_out.sql` (ou o `schema.sql` inteiro) no SQL
Editor — ele adiciona as colunas faltantes e recarrega o cache de schema da API.

Enquanto a migração não é aplicada, a API do admin salva o produto sem a coluna
ausente em vez de falhar, e registra um aviso no log do servidor.

## 📦 Deploy GitHub Pages

O site está configurado para deploy automático no GitHub Pages:

1. Push para main
2. GitHub Actions faz build automaticamente
3. Site fica disponível em: https://jcrispiniano.github.io/vintage-drumshop/

## 🎨 Customização

- **Cores**: Edite `tailwind.config.ts`
- **Produtos**: Edite `lib/products.ts`
- **Componentes**: Adicione em `components/`

## 📱 Contato

- WhatsApp: (11) 96440-5519
- E-mail: contato@vintagedrumshop.com
- São Paulo - SP

## 🏆 Marcas Oficiais

- **Wincent** - Revenda Autorizada
- **Istanbul Cymbals** - Distribuidor Oficial

---

Desenvolvido com ❤️ para Vintage Drum Shop