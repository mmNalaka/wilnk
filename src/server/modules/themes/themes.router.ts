import { z } from "zod";
import { protectedProcedure, publicProcedure } from "@/server/lib/orpc";
import { db } from "@/server/db";
import { themes } from "@/server/db/schema/main.schema";
import { eq, or, and } from "drizzle-orm";
import { nanoid } from "nanoid";

const createThemeSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  config: z.any(),
  previewImage: z.string().optional(),
  isPublic: z.boolean().optional(),
  category: z.string().optional(),
});

export const themesRouter = {
  // List available themes
  list: publicProcedure
    .input(z.object({ userId: z.string().optional() }))
    .output(z.object({
      themes: z.array(z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        config: z.any(),
        previewImage: z.string().nullable(),
        isPublic: z.boolean(),
        category: z.string(),
        createdAt: z.date(),
      }))
    }))
    .handler(async ({ input }) => {
      // Get public themes and user's private themes
      const whereCondition = input.userId 
        ? or(
            eq(themes.isPublic, true),
            and(eq(themes.createdBy, input.userId), eq(themes.isPublic, false))
          )
        : eq(themes.isPublic, true);

      const availableThemes = await db
        .select({
          id: themes.id,
          name: themes.name,
          description: themes.description,
          config: themes.config,
          preview: themes.preview,
          isPublic: themes.isPublic,
          createdAt: themes.createdAt,
        })
        .from(themes)
        .where(whereCondition)
        .orderBy(themes.createdAt);

      // Transform to match output schema
      const transformedThemes = availableThemes.map(theme => ({
        id: theme.id,
        name: theme.name,
        description: theme.description || "",
        config: theme.config,
        previewImage: theme.preview,
        isPublic: theme.isPublic,
        category: "custom", // Default category since DB doesn't have this field
        createdAt: theme.createdAt,
      }));

      return { themes: transformedThemes };
    }),

  // Get single theme
  get: publicProcedure
    .input(z.object({ themeId: z.string() }))
    .output(z.object({
      theme: z.object({
        id: z.string(),
        userId: z.string(),
        name: z.string(),
        description: z.string(),
        config: z.any(),
        previewImage: z.string().nullable(),
        isPublic: z.boolean(),
        category: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
      })
    }))
    .handler(async ({ input }) => {
      const [theme] = await db
        .select({
          id: themes.id,
          createdBy: themes.createdBy,
          name: themes.name,
          description: themes.description,
          config: themes.config,
          preview: themes.preview,
          isPublic: themes.isPublic,
          createdAt: themes.createdAt,
          updatedAt: themes.updatedAt,
        })
        .from(themes)
        .where(eq(themes.id, input.themeId))
        .limit(1);

      if (!theme) {
        throw new Error("Theme not found");
      }

      // Transform to match output schema
      const transformedTheme = {
        id: theme.id,
        userId: theme.createdBy || "",
        name: theme.name,
        description: theme.description || "",
        config: theme.config,
        previewImage: theme.preview,
        isPublic: theme.isPublic,
        category: "custom", // Default category since DB doesn't have this field
        createdAt: theme.createdAt,
        updatedAt: theme.updatedAt,
      };

      return { theme: transformedTheme };
    }),

  // Create new theme
  create: protectedProcedure
    .input(createThemeSchema)
    .output(z.object({
      theme: z.object({
        id: z.string(),
        userId: z.string(),
        name: z.string(),
        description: z.string(),
        config: z.any(),
        previewImage: z.string().nullable(),
        isPublic: z.boolean(),
        category: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
      })
    }))
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;

      const newTheme = {
        id: nanoid(),
        createdBy: userId,
        name: input.name,
        description: input.description || "",
        config: input.config,
        preview: input.previewImage || null,
        isPublic: input.isPublic || false,
        isSystem: false,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const [createdTheme] = await db.insert(themes).values(newTheme).returning();

      // Transform to match output schema
      const transformedTheme = {
        id: createdTheme.id,
        userId: createdTheme.createdBy || "",
        name: createdTheme.name,
        description: createdTheme.description || "",
        config: createdTheme.config,
        previewImage: createdTheme.preview,
        isPublic: createdTheme.isPublic,
        category: "custom", // Default category since DB doesn't have this field
        createdAt: createdTheme.createdAt,
        updatedAt: createdTheme.updatedAt,
      };

      return { theme: transformedTheme };
    }),

  // Update theme
  update: protectedProcedure
    .input(z.object({
      themeId: z.string(),
      data: createThemeSchema.partial(),
    }))
    .output(z.object({
      theme: z.object({
        id: z.string(),
        userId: z.string(),
        name: z.string(),
        description: z.string(),
        config: z.any(),
        previewImage: z.string().nullable(),
        isPublic: z.boolean(),
        category: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
      })
    }))
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;

      // Verify theme ownership
      const [existingTheme] = await db
        .select()
        .from(themes)
        .where(and(eq(themes.id, input.themeId), eq(themes.createdBy, userId)))
        .limit(1);

      if (!existingTheme) {
        throw new Error("Theme not found");
      }

      // Map input data to database fields
      const updateData: any = {
        updatedAt: new Date(),
      };
      if (input.data.name) updateData.name = input.data.name;
      if (input.data.description !== undefined) updateData.description = input.data.description;
      if (input.data.config) updateData.config = input.data.config;
      if (input.data.previewImage !== undefined) updateData.preview = input.data.previewImage;
      if (input.data.isPublic !== undefined) updateData.isPublic = input.data.isPublic;

      const [updatedTheme] = await db
        .update(themes)
        .set(updateData)
        .where(eq(themes.id, input.themeId))
        .returning();

      // Transform to match output schema
      const transformedTheme = {
        id: updatedTheme.id,
        userId: updatedTheme.createdBy || "",
        name: updatedTheme.name,
        description: updatedTheme.description || "",
        config: updatedTheme.config,
        previewImage: updatedTheme.preview,
        isPublic: updatedTheme.isPublic,
        category: "custom", // Default category since DB doesn't have this field
        createdAt: updatedTheme.createdAt,
        updatedAt: updatedTheme.updatedAt,
      };

      return { theme: transformedTheme };
    }),

  // Delete theme
  delete: protectedProcedure
    .input(z.object({ themeId: z.string() }))
    .output(z.object({ success: z.boolean() }))
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;

      // Verify theme ownership
      const [existingTheme] = await db
        .select()
        .from(themes)
        .where(and(eq(themes.id, input.themeId), eq(themes.userId, userId)))
        .limit(1);

      if (!existingTheme) {
        throw new Error("Theme not found");
      }

      await db.delete(themes).where(eq(themes.id, input.themeId));

      return { success: true };
    }),
};
