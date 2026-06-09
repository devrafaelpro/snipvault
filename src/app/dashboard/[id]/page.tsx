import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import CodeBlock from "../CodeBlock";
import CopyButton from "../CopyButton";
import ThemeToggle from "@/components/ThemeToggle";

const dateFmt = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export default async function SnippetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;
  const s = await prisma.snippet.findFirst({
    where: { id, authorId: user.id },
    include: { tags: true },
  });
  if (!s) notFound();

  async function remove() {
    "use server";
    const u = await getCurrentUser();
    if (!u) redirect("/login");
    await prisma.snippet.deleteMany({ where: { id, authorId: u.id } });
    revalidatePath("/dashboard");
    redirect("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-1 flex-col bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between p-4">
          <Link href="/dashboard" className="font-mono text-lg font-bold">
            <span className="text-accent">&lt;/&gt;</span> SnipVault
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <main className="mx-auto w-full min-w-0 max-w-3xl flex-1 p-4 sm:p-6">
        <Link href="/dashboard" className="text-sm text-muted hover:text-accent">
          ← Voltar
        </Link>

        <div className="mt-4 mb-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold">{s.title}</h1>
            {s.description && <p className="mt-1 text-muted">{s.description}</p>}
            <p className="mt-2 font-mono text-xs text-muted">
              {s.language} · criado em {dateFmt.format(s.createdAt)}
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-border px-3 py-1 font-mono text-xs text-muted">
            {s.language}
          </span>
        </div>

        {s.tags.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1.5">
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

        {/* Código completo (mostra tudo, copiar na barra de cima) */}
        <div className="overflow-hidden rounded-xl border border-border">
          <div className="flex items-center justify-between border-b border-border bg-card px-3 py-2">
            <span className="font-mono text-xs text-muted">{s.language}</span>
            <CopyButton text={s.code} />
          </div>
          <div className="overflow-auto">
            <CodeBlock code={s.code} language={s.language} />
          </div>
        </div>

        {/* Ações */}
        <div className="mt-5 flex items-center gap-3">
          <Link
            href={`/dashboard/${s.id}/edit`}
            className="rounded-lg bg-accent px-4 py-2 font-medium text-accent-foreground transition-colors hover:bg-accent-hover"
          >
            Editar
          </Link>
          <form action={remove}>
            <button className="rounded-lg border border-red-500/40 px-4 py-2 text-red-500 transition-colors hover:bg-red-500/10">
              Excluir
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
