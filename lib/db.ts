import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "./generated/prisma/client";

// Environment variable validation
const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  throw new Error("❌ DATABASE_URL is not set in environment variables.");
}

// Configure pool with production-ready settings
const pool = new Pool({
  connectionString: DATABASE_URL,
  max: 20, // Increased for better concurrency
  min: 5, // Maintain minimum connections for faster response
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 10000, // Timeout for acquiring connection
  allowExitOnIdle: true, // Allow process to exit when idle
});

// Handle pool errors to prevent crashes
pool.on("error", (err) => {
  console.error("Unexpected pool error:", err);
});

// Create adapter
const adapter = new PrismaPg(pool);

// Singleton with proper typing
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Initialize Prisma Client with singleton pattern
const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "warn", "error"]
        : ["error"],
  });

// Preserve singleton in development (hot reload)
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Graceful shutdown handling
const shutdown = async () => {
  await prisma.$disconnect();
  await pool.end();
  process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

export default prisma;
