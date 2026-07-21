import { PrismaClient } from "@prisma/client";

// Standard singleton pattern to avoid exhausting DB connections in dev
export const prisma = new PrismaClient();
