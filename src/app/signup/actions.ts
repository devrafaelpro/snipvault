"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export type AuthState = { error?: string};

export async function signup(_prev: AuthState, formData: FormData): Promise<AuthState> {
    const email = String(formData.get("email") ?? "").trim().toLowerCase();
    const name = String(formData.get("name") ?? "").trim();
    const password = String(formData.get("password") ?? "")

    if (!email || !password) return { error: "Preencha email e senha." };
    if (password.length < 6) return { error: "A senha deve conter no mínimo 6 caracteres." };

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return { error: "Este email já está cadastrado." };

    const passwordHash = await bcrypt.hash(password, 10);
    await prisma.user.create({ data: { email, name: name || null, passwordHash } });

    redirect("/login"); // deu certo, redireciona para login
}