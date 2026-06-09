"use server";
  
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { createSession } from "@/lib/auth";
  
export type AuthState = { error?: string };
  
export async function login(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
    
  if (!email || !password) return { error: "Preencha email e senha." };
    
  const user = await prisma.user.findUnique({ where: { email } });
  // mesma mensagem pros dois casos: não vaza se o email existe ou não
  if (!user) return { error: "Email ou senha inválidos." };
    
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return { error: "Email ou senha inválidos." };

  await createSession(user.id);
  redirect("/dashboard");
}