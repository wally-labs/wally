import { PrismaClient } from "@prisma/client";
import { Pinecone } from "@pinecone-database/pinecone";
import { Redis } from "@upstash/redis";

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
const createRedisClient = () => Redis.fromEnv(); // Upstash auto pulls env vars from process.env

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
  pinecone: ReturnType<typeof createPineconeClient> | undefined;
  redis: ReturnType<typeof createRedisClient> | undefined;
};

// Prisma Client Singleton
export const db = globalForPrisma.prisma ?? createPrismaClient();
if (env.NODE_ENV !== "production") globalForPrisma.prisma = db; // so in dev we reuse same instance across hot reloads, from t3 stack docs

// Pinecone Client Singleton
export const pinecone = globalForPrisma.pinecone ?? createPineconeClient();
if (env.NODE_ENV !== "production") globalForPrisma.pinecone = pinecone;

// Redis Client Singleton
export const redis = globalForPrisma.redis ?? createRedisClient();
if (env.NODE_ENV !== "production") globalForPrisma.redis = redis;
