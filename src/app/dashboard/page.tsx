import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser, destroySession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createSnippet } from "./actions";
import CodeBlock from "./CodeBlock";
import CopyButton from "./CopyButton";
import ThemeToggle from "@/components/ThemeToggle";
import CodeEditor from "@/components/CodeEditor";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent";

const dateFmt = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sort?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { q, sort = "recent" } = await searchParams;
  const query = (q ?? "").trim();

  const orderBy =
    sort === "oldest"
      ? { createdAt: "asc" as const }
      : sort === "name"
        ? { title: "asc" as const }
        : sort === "lang"
          ? { language: "asc" as const }
          : { createdAt: "desc" as const };

  const snippets = await prisma.snippet.findMany({
    where: {
      authorId: user.id,
      ...(query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
              { language: { contains: query, mode: "insensitive" } },
              { tags: { some: { name: { contains: query, mode: "insensitive" } } } },
            ],
          }
        : {}),
    },
    orderBy,
    include: { tags: true },
  });

  async function logout() {
    "use server";
    await destroySession();
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-background">
      {/* Navbar */}
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
          <span className="font-mono text-lg font-bold">
            <span className="text-accent">&lt;/&gt;</span> SnipVault
          </span>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted sm:inline">{user.name ?? user.email}</span>
            <ThemeToggle />
            <form action={logout}>
              <button className="rounded-lg border border-border px-3 py-1.5 text-sm transition-colors hover:border-accent hover:text-accent">
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full min-w-0 max-w-5xl flex-1 p-4 sm:p-6">
        {/* Novo snippet */}
        <details className="group mb-8 rounded-2xl border border-border bg-card shadow-sm">
          <summary className="flex cursor-pointer items-center gap-2 p-4 font-mono text-sm font-semibold text-muted select-none">
            <span className="text-accent">+</span> novo snippet
            <span className="ml-auto text-xs group-open:hidden">abrir</span>
            <span className="ml-auto hidden text-xs group-open:inline">fechar</span>
          </summary>
          <form action={createSnippet} className="space-y-3 border-t border-border p-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input name="title" placeholder="Título" required className={`flex-1 ${inputClass}`} />
              <input
                name="language"
                placeholder="Linguagem (ex: ts, py)"
                defaultValue="text"
                className={`sm:w-48 ${inputClass}`}
              />
            </div>
            <input name="description" placeholder="Descrição (opcional)" className={inputClass} />
            <input
              name="tags"
              placeholder="Tags separadas por vírgula (ex: react, hook)"
              className={inputClass}
            />
            <CodeEditor name="code" placeholder="// Cole seu código aqui..." />
            <button className="rounded-lg bg-accent px-4 py-2 font-medium text-accent-foreground transition-colors hover:bg-accent-hover">
              Salvar snippet
            </button>
          </form>
        </details>

        {/* Busca + ordenação */}
        <form method="get" className="mb-6 flex flex-col gap-2 sm:flex-row">
          <input
            name="q"
            defaultValue={query}
            placeholder="Buscar por título, descrição, linguagem ou tag..."
            className={`flex-1 ${inputClass}`}
          />
          <select name="sort" defaultValue={sort} className={`sm:w-44 ${inputClass}`}>
            <option value="recent">Mais recentes</option>
            <option value="oldest">Mais antigos</option>
            <option value="name">Nome (A–Z)</option>
            <option value="lang">Linguagem</option>
          </select>
          <button className="rounded-lg bg-accent px-4 py-2 font-medium text-accent-foreground transition-colors hover:bg-accent-hover">
            Aplicar
          </button>
          {query && (
            <Link
              href="/dashboard"
              className="flex items-center justify-center rounded-lg border border-border px-4 py-2 transition-colors hover:border-accent hover:text-accent"
            >
              Limpar
            </Link>
          )}
        </form>

        <h2 className="mb-4 font-mono text-xs text-muted">
          {query ? `resultados para "${query}"` : "seus snippets"} ({snippets.length})
        </h2>

        {snippets.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-border bg-card p-10 text-center text-muted">
            {query
              ? "Nenhum snippet encontrado para essa busca."
              : "Nenhum snippet ainda. Crie o primeiro acima! 👆"}
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {snippets.map((s) => (
              <article
                key={s.id}
                className="flex min-w-0 flex-col rounded-2xl border border-border bg-card p-4 shadow-sm transition-colors hover:border-accent/50"
              >
                <div className="mb-2 flex items-start justify-between gap-2">
                  <Link
                    href={`/dashboard/${s.id}`}
                    className="font-semibold leading-tight hover:text-accent"
                  >
                    {s.title}
                  </Link>
                  <span className="shrink-0 rounded-full border border-border px-2 py-0.5 font-mono text-xs text-muted">
                    {s.language}
                  </span>
                </div>

                {s.description && (
                  <p className="mb-2 line-clamp-1 text-sm text-muted">{s.description}</p>
                )}

                {/* Preview do código (cortado com fade) */}
                <Link
                  href={`/dashboard/${s.id}`}
                  className="relative block max-h-40 overflow-hidden rounded-lg"
                >
                  <CodeBlock code={s.code} language={s.language} />
                  <span className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#24292e] to-transparent" />
                </Link>

                {s.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {s.tags.map((t) => (
                      <Link
                        key={t.id}
                        href={`/dashboard?q=${encodeURIComponent(t.name)}`}
                        className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 font-mono text-xs text-accent transition-colors hover:bg-accent/20"
                      >
                        #{t.name}
                      </Link>
                    ))}
                  </div>
                )}

                <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-xs text-muted">
                  <span>{dateFmt.format(s.createdAt)}</span>
                  <div className="flex items-center gap-3">
                    <CopyButton text={s.code} />
                    <Link href={`/dashboard/${s.id}`} className="hover:text-accent">
                      Abrir →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
