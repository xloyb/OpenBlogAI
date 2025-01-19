
import { PrismaClient } from "@prisma/client";
import { env } from 'envValidator';

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const prisma = globalForPrisma.prisma || new PrismaClient();

export default prisma;

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;