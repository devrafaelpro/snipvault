import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateSnippet } from "../../actions";
import ThemeToggle from "@/components/ThemeToggle";
import CodeEditor from "@/components/CodeEditor";

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent";

export default async function EditSnippetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;

  const snippet = await prisma.snippet.findFirst({
    where: { id, authorId: user.id },
    include: { tags: true },
  });
  if (!snippet) notFound();

  const tagsValue = snippet.tags.map((t) => t.name).join(", ");

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

      <main className="mx-auto w-full max-w-3xl flex-1 p-4 sm:p-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold">Editar snippet</h1>
          <Link href="/dashboard" className="text-sm text-muted hover:text-accent">
            ← Voltar
          </Link>
        </div>

        <form
          action={updateSnippet}
          className="space-y-3 rounded-2xl border border-border bg-card p-5 shadow-sm"
        >
          <input type="hidden" name="id" value={snippet.id} />

          <div className="flex flex-col gap-3 sm:flex-row">
            <input name="title" defaultValue={snippet.title} required className={`flex-1 ${inputClass}`} />
            <input name="language" defaultValue={snippet.language} className={`sm:w-48 ${inputClass}`} />
          </div>
          <input
            name="description"
            defaultValue={snippet.description ?? ""}
            placeholder="Descrição (opcional)"
            className={inputClass}
          />
          <input
            name="tags"
            defaultValue={tagsValue}
            placeholder="Tags separadas por vírgula"
            className={inputClass}
          />
          <CodeEditor name="code" defaultValue={snippet.code} />

          <div className="flex gap-3">
            <button className="rounded-lg bg-accent px-4 py-2 font-medium text-accent-foreground transition-colors hover:bg-accent-hover">
              Salvar alterações
            </button>
            <Link
              href="/dashboard"
              className="rounded-lg border border-border px-4 py-2 transition-colors hover:border-accent hover:text-accent"
            >
              Cancelar
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
