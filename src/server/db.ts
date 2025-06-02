import { PrismaClient } from "@prisma/client";
import { Pinecone } from "@pinecone-database/pinecone";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

import { env } from "~/env-server";

// Function to create Prisma Client
const createPrismaClient = () =>
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

// Function to create a Pinecone Client
const createPineconeClient = () =>
  new Pinecone({
    apiKey: env.PINECONE_API_KEY,
  });

// Function to create a Redis Client
const createRateLimiter = () => {
  const redis = Redis.fromEnv(); // Upstash auto pulls env vars from process.env

  return new Ratelimit({
    redis: redis,
    limiter: Ratelimit.fixedWindow(25, "1 d"),
    prefix: "@upstash/ratelimit/wally",
  });
};

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
  pinecone: ReturnType<typeof createPineconeClient> | undefined;
  ratelimit: ReturnType<typeof createRateLimiter> | undefined;
};

// Prisma Client Singleton
export const db = globalForPrisma.prisma ?? createPrismaClient();
if (env.NODE_ENV !== "production") globalForPrisma.prisma = db; // so in dev we reuse same instance across hot reloads, from t3 stack docs

// Pinecone Client Singleton
export const pinecone = globalForPrisma.pinecone ?? createPineconeClient();
if (env.NODE_ENV !== "production") globalForPrisma.pinecone = pinecone;

// Redis Client Singleton
export const ratelimit = globalForPrisma.ratelimit ?? createRateLimiter();
if (env.NODE_ENV !== "production") globalForPrisma.ratelimit = ratelimit;
