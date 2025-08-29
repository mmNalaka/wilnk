import { z } from "zod";
import { protectedProcedure, publicProcedure } from "@/server/lib/orpc";
import { pagesRepository } from "./pages.repository";
import {
  createPageInputSchema,
  updatePageInputSchema,
  pagesListResponseSchema,
  pageResponseSchema,
  pageWithThemeResponseSchema,
  deletePageResponseSchema,
} from "./pages.schemas";

export const pagesRouter = {
  // List user's pages
  list: protectedProcedure
    .output(pagesListResponseSchema)
    .handler(async ({ context }) => {
      const userId = context.session.user.id;
      const pages = await pagesRepository.findByUserId(userId);
      return { pages };
    }),

  // Get single page
  get: protectedProcedure
    .input(z.object({ pageId: z.string() }))
    .output(pageResponseSchema)
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;
      const page = await pagesRepository.findByIdAndUserId(input.pageId, userId);
      
      if (!page) {
        throw new Error("Page not found");
      }

      return { page };
    }),

  // Get page by slug (public)
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .output(pageWithThemeResponseSchema)
    .handler(async ({ input }) => {
      const page = await pagesRepository.findPublishedBySlug(input.slug);
      
      if (!page) {
        throw new Error("Page not found");
      }

      return { page };
    }),

  // Create new page
  create: protectedProcedure
    .input(createPageInputSchema)
    .output(pageResponseSchema)
    .handler(async ({ input, context }) => {
      try {
        const userId = context.session.user.id;
        const page = await pagesRepository.create(userId, input);
        return { page };
      } catch (error) {
        console.error(">>>Failed to create page", error);
        throw error;
      }
    }),

  // Update page
  update: protectedProcedure
    .input(
      z.object({
        pageId: z.string(),
        data: updatePageInputSchema,
      })
    )
    .output(pageResponseSchema)
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;
      const page = await pagesRepository.update(input.pageId, userId, input.data);
      return { page };
    }),

  // Delete page
  delete: protectedProcedure
    .input(z.object({ pageId: z.string() }))
    .output(deletePageResponseSchema)
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;
      const success = await pagesRepository.delete(input.pageId, userId);
      return { success };
    }),

  // Duplicate page
  duplicate: protectedProcedure
    .input(z.object({ pageId: z.string() }))
    .output(pageResponseSchema)
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;
      const page = await pagesRepository.duplicate(input.pageId, userId);
      return { page };
    }),
};
