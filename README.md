# 🗝️ SnipVault

> Seu cofre pessoal de snippets de código — salve, organize com tags, busque e copie seus trechos favoritos.

SnipVault é um app full-stack para guardar e organizar trechos de código, com login, syntax highlighting e busca. Feito com **Next.js + Prisma + PostgreSQL**.

🔗 **Demo:** _(adicione aqui o link do Vercel depois do deploy)_

<!-- Dica: coloque um print do app aqui -->
<!-- ![SnipVault](./docs/screenshot.png) -->

---

## ✨ Funcionalidades

- 🔐 **Autenticação** própria (senha com hash + sessão em cookie httpOnly)
- 📝 **CRUD de snippets** (criar, ver, editar, excluir) com checagem de dono
- 🏷️ **Tags** (relação muitos-para-muitos) e **tags clicáveis** que filtram
- 🔍 **Busca** por título, descrição, linguagem ou tag + **ordenação**
- 🎨 **Syntax highlighting** (Shiki para exibir, CodeMirror para editar)
- 📎 **Copiar** o código com um clique
- 🌗 **Tema claro/escuro**

## 🧱 Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router, Server Actions) |
| Linguagem | TypeScript |
| Estilo | Tailwind CSS v4 |
| Banco | PostgreSQL |
| ORM | Prisma 7 (com `@prisma/adapter-pg`) |
| Highlight | Shiki + CodeMirror |

---

## 🚀 Rodando localmente

### Pré-requisitos
- [Node.js](https://nodejs.org) 20+
- [pnpm](https://pnpm.io) (`npm i -g pnpm`)
- [Docker](https://www.docker.com) (para o banco)

### Passo a passo

```bash
# 1. Clone o repositório
git clone https://github.com/devrafaelpro/snipvault.git
cd snipvault

# 2. Instale as dependências
pnpm install

# 3. Suba o banco PostgreSQL (via Docker)
docker compose up -d

# 4. Configure as variáveis de ambiente
cp .env.example .env

# 5. Crie as tabelas no banco
pnpm prisma migrate deploy

# 6. Gere o cliente do Prisma
pnpm prisma generate

# 7. Rode o projeto
pnpm dev
```

Acesse **http://localhost:3000** 🎉

> Ao mexer no `schema.prisma`, rode de novo `pnpm prisma migrate dev` + `pnpm prisma generate` e reinicie o `pnpm dev`.

## 🔑 Variáveis de ambiente

| Variável | Descrição |
|---|---|
| `DATABASE_URL` | String de conexão do PostgreSQL (veja `.env.example`) |

## 📁 Estrutura (resumo)

```
src/
├── app/
│   ├── page.tsx              # landing page
│   ├── login/ · signup/      # autenticação
│   └── dashboard/            # área logada (lista, detalhe, edição)
├── components/               # ThemeToggle, CodeEditor
└── lib/
    ├── prisma.ts             # conexão com o banco
    └── auth.ts               # sessões e usuário logado
prisma/schema.prisma          # modelos do banco
```

## 📄 Licença

MIT — use, modifique e distribua à vontade.

---

Feito com 💙 como projeto de estudo e portfólio por [**@devrafaelpro**](https://github.com/devrafaelpro) ([LinkedIn](https://linkedin.com/in/devrafaelpro)).
