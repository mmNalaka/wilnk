import { z } from "zod";
import { protectedProcedure, publicProcedure } from "@/server/lib/orpc";
import { db } from "@/server/db";
import { pages, themes } from "@/server/db/schema/main.schema";
import { eq, and, desc } from "drizzle-orm";
import { nanoid } from "nanoid";

const createPageSchema = z.object({
  title: z.string().min(1).optional(),
  themeId: z.string().optional(),
});

const updatePageSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  content: z.any().optional(),
  themeId: z.string().optional(),
  status: z.string().optional(),
  isPublic: z.boolean().optional(),
  password: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  favicon: z.string().optional(),
  analyticsEnabled: z.boolean().optional(),
  publishedAt: z.date().optional(),
});

export const pagesRouter = {
  // List user's pages
  list: protectedProcedure
    .output(
      z.object({
        pages: z.array(
          z.object({
            id: z.string(),
            title: z.string(),
            slug: z.string(),
            description: z.string(),
            isPublished: z.boolean(),
            isPublic: z.boolean(),
            viewCount: z.number(),
            clickCount: z.number(),
            createdAt: z.date(),
            updatedAt: z.date(),
            themeId: z.string().nullable(),
            themeName: z.string().nullable(),
          })
        ),
      })
    )
    .handler(async ({ context }) => {
      const userId = context.session.user.id;

      const userPages = await db
        .select({
          id: pages.id,
          title: pages.title,
          slug: pages.slug,
          description: pages.description,
          isPublic: pages.isPublic,
          createdAt: pages.createdAt,
          updatedAt: pages.updatedAt,
          themeId: pages.themeId,
          themeName: themes.name,
          status: pages.status,
          publishedAt: pages.publishedAt,
        })
        .from(pages)
        .leftJoin(themes, eq(pages.themeId, themes.id))
        .where(eq(pages.userId, userId))
        .orderBy(desc(pages.updatedAt));

      // Transform the data to match the output schema
      const transformedPages = userPages.map((page) => ({
        id: page.id,
        title: page.title,
        slug: page.slug,
        description: page.description || "", // Handle null description
        isPublished: page.status === "published" || !!page.publishedAt, // Derive from status/publishedAt
        isPublic: page.isPublic,
        viewCount: 0, // TODO: Calculate from pageViews table
        clickCount: 0, // TODO: Calculate from clickEvents table
        createdAt: page.createdAt,
        updatedAt: page.updatedAt,
        themeId: page.themeId,
        themeName: page.themeName,
      }));

      return { pages: transformedPages };
    }),

  // Get single page
  get: protectedProcedure
    .input(z.object({ pageId: z.string() }))
    .output(
      z.object({
        page: z.object({
          id: z.string(),
          userId: z.string(),
          title: z.string(),
          slug: z.string(),
          description: z.string(),
          puckData: z.any(),
          themeId: z.string().nullable(),
          isPublished: z.boolean(),
          isPublic: z.boolean(),
          hasPassword: z.boolean(),
          password: z.string().nullable(),
          customDomain: z.string().nullable(),
          seoTitle: z.string(),
          seoDescription: z.string(),
          seoImage: z.string().nullable(),
          viewCount: z.number(),
          clickCount: z.number(),
          createdAt: z.date(),
          updatedAt: z.date(),
        }),
      })
    )
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;

      const [page] = await db
        .select({
          id: pages.id,
          userId: pages.userId,
          title: pages.title,
          slug: pages.slug,
          description: pages.description,
          content: pages.content,
          themeId: pages.themeId,
          isPublic: pages.isPublic,
          password: pages.password,
          // customDomain not in DB schema
          metaTitle: pages.metaTitle,
          metaDescription: pages.metaDescription,
          favicon: pages.favicon,
          createdAt: pages.createdAt,
          updatedAt: pages.updatedAt,
          status: pages.status,
          publishedAt: pages.publishedAt,
        })
        .from(pages)
        .where(and(eq(pages.id, input.pageId), eq(pages.userId, userId)))
        .limit(1);

      if (!page) {
        throw new Error("Page not found");
      }

      // Transform to match output schema
      const transformedPage = {
        id: page.id,
        userId: page.userId,
        title: page.title,
        slug: page.slug,
        description: page.description || "",
        puckData: page.content || {},
        themeId: page.themeId,
        isPublished: page.status === "published" || !!page.publishedAt,
        isPublic: page.isPublic,
        hasPassword: !!page.password,
        password: page.password,
        customDomain: null, // Not in DB schema
        seoTitle: page.metaTitle || page.title,
        seoDescription: page.metaDescription || "",
        seoImage: page.favicon,
        viewCount: 0, // TODO: Calculate from analytics
        clickCount: 0, // TODO: Calculate from analytics
        createdAt: page.createdAt,
        updatedAt: page.updatedAt,
      };

      return { page: transformedPage };
    }),

  // Get page by slug (public)
  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .output(
      z.object({
        page: z.object({
          id: z.string(),
          userId: z.string(),
          title: z.string(),
          slug: z.string(),
          description: z.string(),
          puckData: z.any(),
          themeId: z.string().nullable(),
          isPublished: z.boolean(),
          isPublic: z.boolean(),
          hasPassword: z.boolean(),
          customDomain: z.string().nullable(),
          seoTitle: z.string(),
          seoDescription: z.string(),
          seoImage: z.string().nullable(),
          viewCount: z.number(),
          clickCount: z.number(),
          createdAt: z.date(),
          updatedAt: z.date(),
          theme: z
            .object({
              id: z.string(),
              name: z.string(),
              config: z.any(),
            })
            .nullable(),
        }),
      })
    )
    .handler(async ({ input }) => {
      const [page] = await db
        .select({
          id: pages.id,
          userId: pages.userId,
          title: pages.title,
          slug: pages.slug,
          description: pages.description,
          content: pages.content,
          themeId: pages.themeId,
          isPublic: pages.isPublic,
          password: pages.password,
          // customDomain not in DB schema
          metaTitle: pages.metaTitle,
          metaDescription: pages.metaDescription,
          favicon: pages.favicon,
          createdAt: pages.createdAt,
          updatedAt: pages.updatedAt,
          status: pages.status,
          publishedAt: pages.publishedAt,
          theme: {
            id: themes.id,
            name: themes.name,
            config: themes.config,
          },
        })
        .from(pages)
        .leftJoin(themes, eq(pages.themeId, themes.id))
        .where(
          and(
            eq(pages.slug, input.slug),
            eq(pages.status, "published"),
            eq(pages.isPublic, true)
          )
        )
        .limit(1);

      if (!page) {
        throw new Error("Page not found");
      }

      // Transform to match output schema
      const transformedPage = {
        id: page.id,
        userId: page.userId,
        title: page.title,
        slug: page.slug,
        description: page.description || "",
        puckData: page.content || {},
        themeId: page.themeId,
        isPublished: page.status === "published" || !!page.publishedAt,
        isPublic: page.isPublic,
        hasPassword: !!page.password,
        customDomain: null, // Not in DB schema
        seoTitle: page.metaTitle || page.title,
        seoDescription: page.metaDescription || "",
        seoImage: page.favicon,
        viewCount: 0, // TODO: Calculate from analytics
        clickCount: 0, // TODO: Calculate from analytics
        createdAt: page.createdAt,
        updatedAt: page.updatedAt,
        theme: page.theme,
      };

      return { page: transformedPage };
    }),

  // Create new page
  create: protectedProcedure
    .input(createPageSchema)
    .output(
      z.object({
        page: z.object({
          id: z.string(),
          userId: z.string(),
          title: z.string(),
          slug: z.string(),
          description: z.string(),
          puckData: z.any(),
          themeId: z.string().nullable(),
          isPublished: z.boolean(),
          isPublic: z.boolean(),
          hasPassword: z.boolean(),
          password: z.string().nullable(),
          customDomain: z.string().nullable(),
          seoTitle: z.string(),
          seoDescription: z.string(),
          seoImage: z.string().nullable(),
          viewCount: z.number(),
          clickCount: z.number(),
          createdAt: z.date(),
          updatedAt: z.date(),
        }),
      })
    )
    .handler(async ({ input, context }) => {
      try {
        const userId = context.session.user.id;

        // Generate unique slug
        const baseSlug =
          input.title ||
          ""
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

        const slug = input.title
          ? `${baseSlug.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${nanoid(6)}`
          : nanoid(6);

        const newPage = {
          id: nanoid(),
          userId: userId,
          title: input.title || "New Page",
          slug,
          description: "",
          content: {
            content: [],
            root: { props: { title: input.title } },
          },
          themeId: null,
          status: "draft",
          isPublic: true,
          analyticsEnabled: true,
          password: null,
          metaTitle: input.title,
          metaDescription: "",
          favicon: null,
          publishedAt: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        const [createdPage] = await db
          .insert(pages)
          .values(newPage)
          .returning();

        // Transform to match output schema
        const transformedPage = {
          id: createdPage.id,
          userId: createdPage.userId,
          title: createdPage.title,
          slug: createdPage.slug,
          description: createdPage.description || "",
          puckData: createdPage.content || {},
          themeId: createdPage.themeId,
          isPublished:
            createdPage.status === "published" || !!createdPage.publishedAt,
          isPublic: createdPage.isPublic,
          hasPassword: !!createdPage.password,
          password: createdPage.password,
          customDomain: null, // Not in DB schema
          seoTitle: createdPage.metaTitle || createdPage.title,
          seoDescription: createdPage.metaDescription || "",
          seoImage: createdPage.favicon,
          viewCount: 0,
          clickCount: 0,
          createdAt: createdPage.createdAt,
          updatedAt: createdPage.updatedAt,
        };

        return { page: transformedPage };
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
        data: updatePageSchema,
      })
    )
    .output(
      z.object({
        page: z.object({
          id: z.string(),
          userId: z.string(),
          title: z.string(),
          slug: z.string(),
          description: z.string(),
          puckData: z.any(),
          themeId: z.string().nullable(),
          isPublished: z.boolean(),
          isPublic: z.boolean(),
          hasPassword: z.boolean(),
          password: z.string().nullable(),
          customDomain: z.string().nullable(),
          seoTitle: z.string(),
          seoDescription: z.string(),
          seoImage: z.string().nullable(),
          viewCount: z.number(),
          clickCount: z.number(),
          createdAt: z.date(),
          updatedAt: z.date(),
        }),
      })
    )
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;

      // Verify page ownership
      const [existingPage] = await db
        .select()
        .from(pages)
        .where(and(eq(pages.id, input.pageId), eq(pages.userId, userId)))
        .limit(1);

      if (!existingPage) {
        throw new Error("Page not found");
      }

      const [updatedPage] = await db
        .update(pages)
        .set({
          ...input.data,
          updatedAt: new Date(),
        })
        .where(eq(pages.id, input.pageId))
        .returning();

      // Transform to match output schema
      const transformedPage = {
        id: updatedPage.id,
        userId: updatedPage.userId,
        title: updatedPage.title,
        slug: updatedPage.slug,
        description: updatedPage.description || "",
        puckData: updatedPage.content || {},
        themeId: updatedPage.themeId,
        isPublished:
          updatedPage.status === "published" || !!updatedPage.publishedAt,
        isPublic: updatedPage.isPublic,
        hasPassword: !!updatedPage.password,
        password: updatedPage.password,
        customDomain: null, // Not in DB schema
        seoTitle: updatedPage.metaTitle || updatedPage.title,
        seoDescription: updatedPage.metaDescription || "",
        seoImage: updatedPage.favicon,
        viewCount: 0, // TODO: Calculate from analytics
        clickCount: 0, // TODO: Calculate from analytics
        createdAt: updatedPage.createdAt,
        updatedAt: updatedPage.updatedAt,
      };

      return { page: transformedPage };
    }),

  // Delete page
  delete: protectedProcedure
    .input(z.object({ pageId: z.string() }))
    .output(z.object({ success: z.boolean() }))
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;

      // Verify page ownership
      const [existingPage] = await db
        .select()
        .from(pages)
        .where(and(eq(pages.id, input.pageId), eq(pages.userId, userId)))
        .limit(1);

      if (!existingPage) {
        throw new Error("Page not found");
      }

      await db.delete(pages).where(eq(pages.id, input.pageId));

      return { success: true };
    }),

  // Duplicate page
  duplicate: protectedProcedure
    .input(z.object({ pageId: z.string() }))
    .output(
      z.object({
        page: z.object({
          id: z.string(),
          userId: z.string(),
          title: z.string(),
          slug: z.string(),
          description: z.string(),
          puckData: z.any(),
          themeId: z.string().nullable(),
          isPublished: z.boolean(),
          isPublic: z.boolean(),
          hasPassword: z.boolean(),
          password: z.string().nullable(),
          customDomain: z.string().nullable(),
          seoTitle: z.string(),
          seoDescription: z.string(),
          seoImage: z.string().nullable(),
          viewCount: z.number(),
          clickCount: z.number(),
          createdAt: z.date(),
          updatedAt: z.date(),
        }),
      })
    )
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;

      // Get the original page
      const [originalPage] = await db
        .select()
        .from(pages)
        .where(and(eq(pages.id, input.pageId), eq(pages.userId, userId)))
        .limit(1);

      if (!originalPage) {
        throw new Error("Page not found");
      }

      // Generate unique slug for duplicate
      const baseSlug = originalPage.slug.replace(/-[a-zA-Z0-9]{6}$/, "");
      const newSlug = `${baseSlug}-copy-${nanoid(6)}`;

      const duplicatedPage = {
        id: nanoid(),
        userId,
        title: `${originalPage.title} (Copy)`,
        slug: newSlug,
        description: originalPage.description,
        content: originalPage.content,
        themeId: originalPage.themeId,
        status: "draft", // Duplicates start as draft
        isPublic: originalPage.isPublic,
        password: originalPage.password,
        // customDomain not in DB schema
        metaTitle: `${originalPage.metaTitle || originalPage.title} (Copy)`,
        metaDescription: originalPage.metaDescription,
        favicon: originalPage.favicon,
        analyticsEnabled: originalPage.analyticsEnabled,
        publishedAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const [createdPage] = await db
        .insert(pages)
        .values(duplicatedPage)
        .returning();

      // Transform to match output schema
      const transformedPage = {
        id: createdPage.id,
        userId: createdPage.userId,
        title: createdPage.title,
        slug: createdPage.slug,
        description: createdPage.description || "",
        puckData: createdPage.content || {},
        themeId: createdPage.themeId,
        isPublished:
          createdPage.status === "published" || !!createdPage.publishedAt,
        isPublic: createdPage.isPublic,
        hasPassword: !!createdPage.password,
        password: createdPage.password,
        customDomain: null, // Not in DB schema
        seoTitle: createdPage.metaTitle || createdPage.title,
        seoDescription: createdPage.metaDescription || "",
        seoImage: createdPage.favicon,
        viewCount: 0,
        clickCount: 0,
        createdAt: createdPage.createdAt,
        updatedAt: createdPage.updatedAt,
      };

      return { page: transformedPage };
    }),
};
