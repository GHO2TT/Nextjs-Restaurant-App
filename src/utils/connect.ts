import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// // utils/connect.ts
// import { PrismaClient } from "@prisma/client";

// export const prisma = new PrismaClient();
console.log("Initializing Prisma client...");
