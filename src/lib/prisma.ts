/**
 * Conexão única com o banco (Prisma 7 usa um "driver adapter").
 * Use em qualquer lugar que precise falar com o banco:
 *   import { prisma } from "@/lib/prisma";
 */
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
  
// Reaproveita a mesma conexão no hot reload do dev (evita estourar conexões)
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };
  
// O adapter do Postgres — a novidade do Prisma 7
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  
export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });
  
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// O @/ é um atalho para pasta src/. Então @/lib/prisma é o mesmo que src/lib/prisma.