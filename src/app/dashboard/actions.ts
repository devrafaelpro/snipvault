"use server";

// Server Actions dos snippets (rodam no servidor).
// Cada uma confere o usuário logado antes de mexer no banco.
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// "react, hook, ts" -> ["react", "hook", "ts"] (sem repetir, sem vazio)
function parseTags(formData: FormData): string[] {
  const raw = String(formData.get("tags") ?? "");
  return [
    ...new Set(raw.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean)),
  ];
}

export async function createSnippet(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Não autorizado");

  const title = String(formData.get("title") ?? "").trim();
  const code = String(formData.get("code") ?? "");
  const description = String(formData.get("description") ?? "").trim();
  const language = String(formData.get("language") ?? "text").trim() || "text";
  const tagNames = parseTags(formData);

  if (!title || !code) return;

  await prisma.snippet.create({
    data: {
      title,
      code,
      description: description || null,
      language,
      authorId: user.id,
      tags: {
        connectOrCreate: tagNames.map((name) => ({ where: { name }, create: { name } })),
      },
    },
  });

  revalidatePath("/dashboard");
}

export async function updateSnippet(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Não autorizado");

  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const code = String(formData.get("code") ?? "");
  const description = String(formData.get("description") ?? "").trim();
  const language = String(formData.get("language") ?? "text").trim() || "text";
  const tagNames = parseTags(formData);

  if (!id || !title || !code) return;

  // trava de segurança: só edita se o snippet for do usuário
  const existing = await prisma.snippet.findFirst({ where: { id, authorId: user.id } });
  if (!existing) throw new Error("Snippet não encontrado");

  await prisma.snippet.update({
    where: { id },
    data: {
      title,
      code,
      description: description || null,
      language,
      tags: {
        set: [], // remove as ligações antigas...
        connectOrCreate: tagNames.map((name) => ({ where: { name }, create: { name } })), // ...e religa as atuais
      },
    },
  });

  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function deleteSnippet(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Não autorizado");

  const id = String(formData.get("id") ?? "");
  // o authorId no where garante que você só apaga snippet SEU
  await prisma.snippet.deleteMany({ where: { id, authorId: user.id } });

  revalidatePath("/dashboard");
}
