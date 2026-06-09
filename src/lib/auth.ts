/**
 * Autenticação por sessão.
 * - createSession:  cria a sessão no banco e grava o id num cookie httpOnly
 * - getCurrentUser: lê o cookie e retorna o usuário logado (ou null)
 * - destroySession: logout (apaga a sessão e o cookie)
 */
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "session_id";
const SESSION_DAYS = 7;

// cria a sessão no banco + grava o cookie
export async function createSession(userId: string) {
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  const session = await prisma.session.create({ data: { userId, expiresAt } });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, session.id, {
    httpOnly: true,                                   // JS do navegador não lê
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

// descobre quem está logado (ou null)
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionId) return null;
  
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { user: true },
  });
    
  if (!session || session.expiresAt < new Date()) return null;
  return session.user;
}

// logout: apaga a sessão e o cookie
export async function destroySession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
  if (sessionId) {
    await prisma.session.deleteMany({ where: { id: sessionId } });
    cookieStore.delete(SESSION_COOKIE);
  }
}