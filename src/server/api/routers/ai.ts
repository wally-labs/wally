// TODO: redundant file, delete this file once incorporate gender pronounns into main file

import { TRPCError } from "@trpc/server";
import { z } from "zod";
import openAi from "~/server/ai/config";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

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

export const aiRouter = createTRPCRouter({
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
});
