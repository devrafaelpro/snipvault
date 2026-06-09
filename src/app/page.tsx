import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import ThemeToggle from "@/components/ThemeToggle";
import CodeBlock from "@/app/dashboard/CodeBlock";

// ⚠️ Troque pela URL do seu repositório depois de subir no GitHub
const GITHUB_URL = "https://github.com/devrafaelpro/snipvault";

const SAMPLE = `// guarde seus melhores trechos
export function useDebounce<T>(value: T, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}`;

const INSTALL = `git clone ${GITHUB_URL}.git
cd snipvault
pnpm install
docker compose up -d          # sobe o PostgreSQL
cp .env.example .env          # configure a DATABASE_URL
pnpm prisma migrate deploy    # cria as tabelas
pnpm prisma generate          # gera o cliente
pnpm dev                      # http://localhost:3000`;

const FEATURES = [
  { icon: "🔐", title: "Login seguro", desc: "Senhas com hash e sessões em cookie httpOnly." },
  { icon: "🏷️", title: "Tags & busca", desc: "Organize por tags e encontre tudo em segundos." },
  { icon: "🎨", title: "Syntax highlight", desc: "Código colorido para ver e editar." },
  { icon: "📎", title: "Copiar num clique", desc: "Pegue seu snippet sem selecionar nada." },
];

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.36-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.4 9.4 0 0 1 12 6.84c.85 0 1.71.12 2.51.34 1.91-1.32 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2z" />
    </svg>
  );
}

export default async function Home() {
  const user = await getCurrentUser();
  if (user) redirect("/dashboard");

  return (
    <div className="flex min-h-screen flex-1 flex-col">
      {/* Navbar */}
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between p-5">
        <span className="font-mono text-lg font-bold">
          <span className="text-accent">&lt;/&gt;</span> SnipVault
        </span>
        <div className="flex items-center gap-3">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card transition-colors hover:border-accent hover:text-accent"
          >
            <GitHubIcon />
          </a>
          <ThemeToggle />
          <Link
            href="/login"
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
          >
            Entrar
          </Link>
        </div>
      </header>

      {/* Hero */}
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center gap-16 px-5 py-16">
        <section className="flex flex-col items-center gap-12">
          <div className="flex flex-col items-center text-center">
            <span className="mb-4 rounded-full border border-border bg-card px-3 py-1 font-mono text-xs text-muted">
              open-source · self-host ou use o demo
            </span>
            <h1 className="max-w-2xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
              Nunca mais perca um <span className="text-accent">snippet</span> de código.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted">
              Salve, organize com tags, busque e copie seus trechos favoritos —
              tudo num cofre pessoal, privado e bonito.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/signup"
                className="rounded-lg bg-accent px-6 py-3 font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
              >
                Testar o demo grátis
              </Link>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-border px-6 py-3 font-medium transition-colors hover:border-accent hover:text-accent"
              >
                <GitHubIcon /> Ver no GitHub
              </a>
            </div>
          </div>

          {/* Code window mockup */}
          <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
              <span className="ml-3 font-mono text-xs text-muted">useDebounce.ts</span>
            </div>
            <CodeBlock code={SAMPLE} language="ts" />
          </div>
        </section>

        {/* Features */}
        <section className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-accent"
            >
              <div className="text-2xl">{f.icon}</div>
              <h3 className="mt-3 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted">{f.desc}</p>
            </div>
          ))}
        </section>

        {/* Como rodar localmente */}
        <section className="w-full max-w-2xl">
          <h2 className="text-center text-2xl font-bold">Prefere rodar na sua máquina?</h2>
          <p className="mt-2 text-center text-muted">
            É open-source. Clone, suba o banco com Docker e pronto:
          </p>
          <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="flex items-center gap-2 border-b border-border px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-red-400" />
              <span className="h-3 w-3 rounded-full bg-yellow-400" />
              <span className="h-3 w-3 rounded-full bg-green-400" />
              <span className="ml-3 font-mono text-xs text-muted">terminal</span>
            </div>
            <CodeBlock code={INSTALL} language="bash" />
          </div>
          <p className="mt-3 text-center text-sm text-muted">
            Instruções completas no{" "}
            <a href={GITHUB_URL} className="text-accent hover:underline">
              repositório
            </a>
            .
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="mx-auto w-full max-w-5xl border-t border-border px-5 py-6 text-center font-mono text-xs text-muted">
        <p>feito com Next.js · Prisma · PostgreSQL · Tailwind 💙</p>
        <p className="mt-2">
          por{" "}
          <a href="https://github.com/devrafaelpro" className="text-accent hover:underline">
            @devrafaelpro
          </a>
          {" · "}
          <a href="https://linkedin.com/in/devrafaelpro" className="text-accent hover:underline">
            LinkedIn
          </a>
        </p>
      </footer>
    </div>
  );
}
