import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "./generated/prisma/client";

// Environment variable validation
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error("❌ DATABASE_URL is not set in environment variables.");
}

// Singleton with proper typing
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  pool: Pool | undefined;
};

// Configure pool with production-ready settings and reuse across HMR
const pool =
  globalForPrisma.pool ??
  new Pool({
    connectionString: DATABASE_URL,
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
    allowExitOnIdle: true,
  });

// Handle pool errors to prevent crashes
pool.on("error", (err) => {
  console.error("Unexpected pool error:", err);
});

// Create adapter
const adapter = new PrismaPg(pool);

// Initialize Prisma Client with singleton pattern
const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["warn", "error"]
        : ["error"],
  });

// Preserve singletons in development (hot reload)
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.pool = pool;
}

export default prisma;
