import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  // create user data and push to db
  createUser: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
        emailVerified: z.date().optional(),
        image: z.string().url().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.create({
        data: {
          id: input.id,
          email: input.email,
          emailVerified: input.emailVerified,
          name: input.name,
          image: input.image,
        },
      });

      return user;
    }),

  // update any data associated with the user in db (not completed yet!)
  // updateUser: publicProcedure.input(z.object({}))

  // delete user data and all data associated with the user from db
  deleteUser: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const deleted = await ctx.db.user.delete({
          where: {
            id: input.id,
          },
        });

        return deleted;
      } catch (error) {
        console.error("User not found, Error deleting: ", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User not found, Failed to delete",
        });
      }
    }),
});
