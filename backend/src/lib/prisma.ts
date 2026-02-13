/**
 * Prisma Client (Prisma v6)
 * - Usa DATABASE_URL desde .env (schema.prisma)
 */
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();
