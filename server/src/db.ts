import { PrismaClient } from '@prisma/client';

/** PrismaClient singleton — avoids exhausting connections on dev hot-reload. */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/** The single seeded workspace this prototype serves. */
export const WORKSPACE_ID = process.env.WORKSPACE_ID ?? 'ws-erynd';
