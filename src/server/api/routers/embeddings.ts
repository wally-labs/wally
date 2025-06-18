import { TRPCError } from "@trpc/server";
import { z } from "zod";
import openAi from "~/server/ai/config";
import { embedVector } from "~/server/ai/embed";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { Gender, Relationship, Race, Country, Language } from "@prisma/client";

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

export const embeddingsRouter = createTRPCRouter({
  // TODO: redundant streamChat function, delete function once incorporate gender pronounns into main file
  streamChat: protectedProcedure
    .input(
      z.object({
        emotion: z.string(),
        message: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const profile = await ctx.db.chat.findUnique({
          where: { id: ctx.session.userId },
        });

        const gender =
          profile?.gender === "MALE"
            ? pronouns.male
            : profile?.gender === "FEMALE"
              ? pronouns.female
              : pronouns.nonBinary;

        const response = await openAi.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "developer",
              content: [
                {
                  type: "text",
                  text: `You are a helpful, professional, personal relationship wellness assistant. For context, the user is communicating 
                  with ${gender?.adjective} ${profile?.relationship} and ${gender?.adjective} name is ${profile?.name}. The 
                  user is ${profile?.heartLevel} close to ${gender?.adjective} ${profile?.relationship}. ${profile?.name} is 
                  born on ${profile?.birthDate?.toString()}, is from ${profile?.country} and ${gender?.adjective} native language is 
                  ${profile?.language}.`,
                },
              ],
            },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: `${input.message}. The user feels that the emotion conved in the messsage is ${input.emotion}.`,
                },
              ],
            },
          ],
        });

        return response.choices[0]?.message;
      } catch (error) {
        console.error("Error sending message to OpenAI API: ", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to send message",
        });
      }
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
      const index = ctx.pinecone
        .index("wally", "https://wally-fld29to.svc.aped-4627-b74a.pinecone.io")
        .namespace(`${ctx.session.userId}`);

      const embedding = await embedVector(text);

      const upsertResponse = await index.upsert([
        {
          id: `${chatId}-${messageId}`,
          values: embedding.data[0]?.embedding,
        },
      ]);

      return upsertResponse;
    }),

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
      const index = ctx.pinecone
        .index("wally", "https://wally-fld29to.svc.aped-4627-b74a.pinecone.io")
        .namespace(`${ctx.session.userId}`);

      const context = `The user is currently trying to speak to ${name}. I want you to use the information provided to tailor 
        your responses to be more personalized and culturally resonant. This is what I know about ${name}: Gender: ${gender}, Birth Date:
        ${birthDate}, Relationship between user and ${name}: ${relationship}, Heart Level: ${heartLevel},  Race: ${race}, 
        Country: ${country}, Language: ${language}.`;

      const embedding = await embedVector(context);

      const upsertResponse = await index.upsert([
        {
          id: `${chatId}-context`,
          values: embedding.data[0]?.embedding,
        },
      ]);

      return upsertResponse;
    }),
});
