"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup, type AuthState } from "./actions";
import ThemeToggle from "@/components/ThemeToggle";

const initialState: AuthState = {};

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signup, initialState);

  return (
    <main className="flex min-h-screen flex-1 flex-col bg-background">
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between p-5">
        <Link href="/" className="font-mono text-lg font-bold">
          <span className="text-accent">&lt;/&gt;</span> SnipVault
        </Link>
        <ThemeToggle />
      </header>

      <div className="flex flex-1 items-center justify-center p-4">
        <form
          action={formAction}
          className="w-full max-w-sm space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm"
        >
          <div>
            <h1 className="text-2xl font-bold">Criar conta</h1>
            <p className="mt-1 text-sm text-muted">Monte seu cofre de snippets em segundos.</p>
          </div>

          {state.error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-500">
              {state.error}
            </p>
          )}

          <input
            name="name"
            type="text"
            placeholder="Nome (opcional)"
            className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
          />
          <input
            name="password"
            type="password"
            placeholder="Senha (mín. 6)"
            required
            className="w-full rounded-lg border border-border bg-background px-3 py-2 outline-none focus:border-accent"
          />

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-accent px-3 py-2 font-medium text-accent-foreground transition-colors hover:bg-accent-hover disabled:opacity-50"
          >
            {pending ? "Criando..." : "Criar conta"}
          </button>

          <p className="text-center text-sm text-muted">
            Já tem conta?{" "}
            <Link href="/login" className="font-medium text-accent hover:underline">
              Entrar
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}
