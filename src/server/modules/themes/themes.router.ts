import { z } from "zod";
import { protectedProcedure } from "@/server/lib/orpc";
import { themesRepository } from "./themes.repository";
import {
  createThemeInputSchema,
  updateThemeInputSchema,
  themesListResponseSchema,
  themeResponseSchema,
  deleteThemeResponseSchema,
} from "./themes.schemas";

export const themesRouter = {
  // List themes (system + user's)
  list: protectedProcedure
    .input(z.object({ userId: z.string().optional() }))
    .output(themesListResponseSchema)
    .handler(async ({ input, context }) => {
      const userId = input.userId ?? context.session.user.id;
      const themes = await themesRepository.list(userId);
      return { themes };
    }),

  // Get single theme
  get: protectedProcedure
    .input(z.object({ themeId: z.string() }))
    .output(themeResponseSchema)
    .handler(async ({ input }) => {
      const theme = await themesRepository.getById(input.themeId);
      if (!theme) throw new Error("Theme not found");
      return { theme };
    }),

  // Create theme
  create: protectedProcedure
    .input(createThemeInputSchema)
    .output(themeResponseSchema)
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;
      const theme = await themesRepository.create(userId, input);
      return { theme };
    }),

  // Update theme
  update: protectedProcedure
    .input(
      z.object({
        themeId: z.string(),
        data: updateThemeInputSchema,
      }),
    )
    .output(themeResponseSchema)
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;
      const theme = await themesRepository.update(
        input.themeId,
        userId,
        input.data,
      );
      return { theme };
    }),

  // Delete theme
  delete: protectedProcedure
    .input(z.object({ themeId: z.string() }))
    .output(deleteThemeResponseSchema)
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;
      const success = await themesRepository.delete(input.themeId, userId);
      return { success };
    }),
};
