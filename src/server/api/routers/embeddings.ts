import { string, z } from "zod";
import { embedVector } from "~/server/ai/embed";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { Gender, Relationship, Race, Country, Language } from "@prisma/client";
import type { Index, RecordMetadata } from "@pinecone-database/pinecone";

type Pronouns = {
  subject: string; // he, she, they
  object: string; // him, her, them
  adjective: string; // his, her, their
  pronoun: string; // his, hers, theirs
  reflexive: string; // himself, herself, themself/themselves
};

const pronouns: Record<string, Pronouns> = {
  male: {
    subject: "he",
    object: "him",
    adjective: "his",
    pronoun: "his",
    reflexive: "himself",
  },
  female: {
    subject: "she",
    object: "her",
    adjective: "her",
    pronoun: "hers",
    reflexive: "herself",
  },
  nonBinary: {
    subject: "they",
    object: "them",
    adjective: "their",
    pronoun: "theirs",
    reflexive: "themself",
  },
};

export async function upsertMessage(
  message: string,
  index: Index<RecordMetadata>,
  chatId: string,
  messageId = "context",
) {
  const embedding = await embedVector(message);

  // use id/metadata filtering for messages by chat
  const upsertResponse = await index.upsert([
    {
      id: `${chatId}-${messageId}`,
      values: embedding.data[0]?.embedding,
      metadata: { chatId: `${chatId}`, messageId: messageId },
    },
  ]);

  return upsertResponse;
}

function enumToLabel(str: string) {
  return str
    .split("_")
    .map((chunk) => chunk[0] + chunk.slice(1).toLowerCase())
    .join(" ");
}

export const embeddingsRouter = createTRPCRouter({
  embedProfileVector: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        gender: z.nativeEnum(Gender),
        birthDate: z.string().date().optional(),
        relationship: z.nativeEnum(Relationship),
        heartLevel: z.number().int(),
        race: z.nativeEnum(Race).optional(),
        country: z.nativeEnum(Country).optional(),
        language: z.nativeEnum(Language),
        chatId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      Object.entries(input).map(([key, value]) => [
        key,
        typeof value === "string" ? enumToLabel(value) : value,
      ]);

      const {
        name,
        gender,
        birthDate,
        relationship,
        heartLevel,
        race,
        country,
        language,
        chatId,
      } = input;

      const context = `The user is currently trying to speak to ${name}. I want you to use the information provided to tailor 
        your responses to be more personalized and culturally resonant. This is what I know about ${name}: Gender: ${gender}, Birth Date:
        ${birthDate}, Relationship between user and ${name}: ${relationship}, Heart Level: ${heartLevel},  Race: ${race}, 
        Country: ${country}, Language: ${language}.`;

      // index separated by user
      const index = ctx.pinecone
        .index("wally", "https://wally-fld29to.svc.aped-4627-b74a.pinecone.io")
        .namespace(`${ctx.session.userId}`);

      return upsertMessage(context, index, chatId);
    }),

  embedMessageVector: protectedProcedure
    .input(
      z.object({
        text: z.string(),
        messageId: z.string(),
        chatId: z.string(),
        // metadata: z.string().array(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { text, messageId, chatId } = input;

      // index separated by user
      const index = ctx.pinecone
        .index("wally", "https://wally-fld29to.svc.aped-4627-b74a.pinecone.io")
        .namespace(`${ctx.session.userId}`);

      return upsertMessage(text, index, chatId, messageId);
    }),
});
