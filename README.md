# Al Majd Perfumaria — README

Site de e-commerce de perfumaria árabe de luxo, construído em React + Vite com Tailwind CSS.

---

## Sumário

1. [Visão Geral](#visão-geral)
2. [Tecnologias Utilizadas](#tecnologias-utilizadas)
3. [Estrutura de Pastas](#estrutura-de-pastas)
4. [Workflow de Desenvolvimento (Vercel CLI)](#workflow-de-desenvolvimento-vercel-cli)
5. [CI/CD (Deploy Automático)](#cicd-deploy-automático)
4. [Pré-requisitos](#pré-requisitos)
5. [Instalação e Execução](#instalação-e-execução)
6. [Páginas e Funcionalidades](#páginas-e-funcionalidades)
7. [Como Adicionar Produtos](#como-adicionar-produtos)
8. [Como Trocar Imagens](#como-trocar-imagens)
9. [Como Alterar o Número do WhatsApp](#como-alterar-o-número-do-whatsapp)
10. [Como Personalizar Cores e Fontes](#como-personalizar-cores-e-fontes)
11. [Como Gerar a Build de Produção](#como-gerar-a-build-de-produção)

---

## Visão Geral

O site da **Al Majd Perfumaria** é uma landing page de e-commerce com:

- Catálogo de perfumes exclusivos com filtro por gênero
- Carrinho de compras com gaveta lateral
- Página de checkout (cartão, PIX e boleto)
- Sistema de favoritos com página dedicada
- Popup promocional de 10% de desconto
- Seção Missão, Visão e Valores
- Formulário de cadastro de clientes
- Botão flutuante do WhatsApp
- Design totalmente responsivo

---

## Tecnologias Utilizadas

| Tecnologia | Uso |
|---|---|
| React 18 | Interface de usuário |
| TypeScript | Tipagem estática |
| Vite | Bundler e servidor de desenvolvimento |
| Tailwind CSS | Estilização |
| Framer Motion | Animações |
| Wouter | Roteamento de páginas |
| Lucide React | Ícones |
| shadcn/ui | Componentes base (botões, inputs, etc.) |
| Vitest | Framework de testes unitários |

---

## Estrutura de Pastas

```
artifacts/perfumes-arabes/
├── public/
│   └── images/              # Imagens dos produtos e hero
│       ├── hero.png
│       ├── oud-al-majd.png
│       ├── sultan-al-layl.png
│       └── ...
├── src/data/products.ts     # Definição e lista de produtos (Coleções)
├── src/
│   ├── components/
│   │   ├── CartDrawer.tsx   # Gaveta lateral do carrinho
│   │   └── ui/              # Componentes shadcn/ui
│   ├── context/
│   │   ├── CartContext.tsx  # Estado global do carrinho
│   │   └── FavoritesContext.tsx  # Estado global dos favoritos
│   ├── pages/
│   │   ├── Home.tsx         # Página principal (catálogo, seções, etc.)
│   │   ├── Checkout.tsx     # Página de checkout
│   │   ├── Favorites.tsx    # Página de favoritos
│   │   └── not-found.tsx    # Página 404
│   ├── lib/
│   │   └── utils.ts         # Utilitários (cn, etc.)
│   ├── App.tsx              # Roteador e providers globais
│   ├── main.tsx             # Ponto de entrada
│   └── index.css            # Estilos globais e tema de cores
├── index.html
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── vite.config.ts
```

---

## Workflow de Desenvolvimento (Vercel CLI)

Para sincronizar variáveis de ambiente e manter o ambiente local idêntico à produção:

1. **Instale a Vercel CLI:** `npm install -g vercel`
2. **Autentique-se:** `vercel login`
3. **Vincule o projeto:** `vercel link`
4. **Puxe as variáveis:**
   ```bash
   vercel env pull .env.local
   ```

Isso criará um arquivo `.env.local` que o Vite utiliza automaticamente. **Nunca faça commit deste arquivo.**

---

## CI/CD (Deploy Automático)

Este projeto utiliza **GitHub Actions** para automação:

- **Branch `main`**: Deploys automáticos para o ambiente de produção.
- **Branch `develop`**: Deploys automáticos para o ambiente de preview/teste.
- **Pipeline de Qualidade**: O deploy só é realizado se todos os testes unitários (`vitest`) passarem com sucesso.

---

## Pré-requisitos

Antes de começar, você precisa ter instalado na sua máquina:

- **Node.js** versão 18 ou superior → [nodejs.org](https://nodejs.org)
- **pnpm** versão 8 ou superior

Para instalar o pnpm:
```bash
npm install -g pnpm
```

---

## Instalação e Execução

### Passo 1 — Clone ou extraia o projeto

Se baixou o arquivo `.tar.gz`, extraia:
```bash
tar -xzf almajd-perfumaria.tar.gz
cd artifacts/perfumes-arabes
```

### Passo 2 — Instale as dependências

```bash
pnpm install
```

> Aguarde o download de todas as bibliotecas. Pode levar alguns minutos na primeira vez.

### Passo 3 — Inicie o servidor de desenvolvimento

```bash
pnpm dev
```

### Passo 3.5 — Executar Testes

```bash
pnpm test
```

O terminal exibirá algo como:

```
  VITE v6.x.x  ready in 500ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.x.x:5173/
```

### Passo 4 — Acesse no navegador

Abra o navegador e entre em:
```
http://localhost:5173
```

O site estará rodando localmente.

---

## Páginas e Funcionalidades

### Página Principal (`/`)

Localizada em `src/pages/Home.tsx`. Contém todas as seções:

| Seção | ID da âncora | Descrição |
|---|---|---|
| Hero | — | Banner principal com chamadas para ação |
| Herança | `#heranca` | Texto sobre a origem da marca |
| Coleção | `#colecao` | Grade de produtos com filtros |
| Artesania | `#artesania` | Citação sobre o processo de criação |
| A Empresa | `#missao` | Missão, Visão e Valores |
| Cadastro | `#cadastro` | Formulário de registro de cliente |
| Contato | `#contato` | Formulário de contato e solicitação |
| Footer | — | Rodapé com copyright |

### Página de Checkout (`/checkout`)

Localizada em `src/pages/Checkout.tsx`. Exibe os itens do carrinho e permite escolher entre:
- Cartão de crédito (parcelamento em até 12x)
- PIX (QR Code + cópia e cola)
- Boleto bancário

### Página de Favoritos (`/favoritos`)

Localizada em `src/pages/Favorites.tsx`. Lista todos os perfumes marcados com o coração. Permite adicionar todos ao carrinho de uma vez.

---

## Como Adicionar Produtos

Abra o arquivo `src/data/products.ts` e localize o array `collections`.

Cada produto segue este formato:

```ts
{
  id: "nome-unico-do-produto",       // identificador único (sem espaços)
  name: "Nome do Perfume",           // nome exibido no site
  description: "Descrição curta.",   // texto do card
  price: "R$ 399",                   // preço formatado (exibição)
  priceNum: 399,                     // preço numérico (cálculo do carrinho)
  image: "/images/nome-da-imagem.png", // caminho da imagem em public/images/
  gender: "masculino" as Gender,     // "masculino" ou "feminino"
  notes: "Nota1 · Nota2 · Nota3"    // notas olfativas (3 sugeridas)
},
```

**Exemplo — adicionando um novo perfume:**

```ts
{
  id: "al-hajar",
  name: "Al Hajar",
  description: "A pedra preciosa do deserto. Âmbar negro, mirra e couro envelhecido.",
  price: "R$ 419",
  priceNum: 419,
  image: "/images/al-hajar.png",
  gender: "masculino" as Gender,
  notes: "Âmbar · Mirra · Couro"
},
```

Salve o arquivo e o site atualizará automaticamente.

---

## Como Trocar Imagens

1. Coloque a nova imagem (formato `.png` ou `.jpg`) dentro da pasta:
   ```
   public/images/
   ```

2. No produto correspondente em `Home.tsx`, atualize o campo `image`:
   ```ts
   image: "/images/seu-novo-arquivo.png",
   ```

> As imagens dos produtos devem ter fundo transparente ou escuro para combinar com o tema do site. Tamanho recomendado: **600×800 px**.

---

## Como Alterar o Número do WhatsApp

No arquivo `src/pages/Home.tsx`, localize o botão flutuante (busque por `wa.me`):

```tsx
href="https://wa.me/5511999999999?text=Olá!%20Tenho%20interesse..."
```

Substitua `5511999999999` pelo número real no formato internacional:
- `55` = código do Brasil
- `11` = DDD
- `999999999` = número (com 9 dígitos)

**Exemplo com DDD 21, número 98765-4321:**
```
https://wa.me/5521987654321?text=Olá!%20Tenho%20interesse%20nos%20perfumes%20Al%20Majd.
```

---

## Como Personalizar Cores e Fontes

O tema de cores está definido em `src/index.css`. As principais variáveis são:

```css
--primary: /* cor dourada principal (botões, títulos, destaques) */
--background: /* cor de fundo geral */
--card: /* cor de fundo dos cards */
--foreground: /* cor do texto principal */
--muted-foreground: /* cor do texto secundário */
```

Para mudar a fonte do site, edite o `index.html` alterando o link do Google Fonts e atualize a classe `font-serif` nos componentes desejados.

---

## Como Gerar a Build de Produção

Quando o site estiver pronto para publicar, gere os arquivos otimizados:

```bash
pnpm build
```

Os arquivos finais serão gerados na pasta `dist/`. Você pode hospedar essa pasta em qualquer serviço de hospedagem estática como:

- **Vercel** — `vercel deploy`
- **Netlify** — arraste a pasta `dist` no painel
- **GitHub Pages** — publique a branch com o conteúdo de `dist`

---

## Dúvidas

Para qualquer ajuste no site, os principais arquivos a editar são:

| O que mudar | Arquivo |
|---|---|
| Produtos do catálogo | `src/data/products.ts` |
| Textos e seções | `src/pages/Home.tsx` |
| Carrinho | `src/context/CartContext.tsx` |
| Checkout | `src/pages/Checkout.tsx` |
| Favoritos | `src/pages/Favorites.tsx` |
| Cores e tema | `src/index.css` |
| Imagens | `public/images/` |
