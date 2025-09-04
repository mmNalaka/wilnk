import { z } from "zod";

// Theme config as simple key-value pairs suitable for CSS variables
export const themeConfigSchema = z.record(z.string(), z.string());

// Base theme db shape
export const themeDbSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  createdBy: z.string().nullable(),
  config: themeConfigSchema, // stored as JSON in DB
  isSystem: z.boolean(),
  status: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const themeSchema = z.object({
  id: z.string(),
  userId: z.string().nullable(),
  name: z.string(),
  description: z.string().nullable(),
  config: themeConfigSchema,
  isSystem: z.boolean().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const themesListResponseSchema = z.object({
  themes: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string().nullable(),
      config: themeConfigSchema,
      isSystem: z.boolean().optional(),
      createdAt: z.date(),
    })
  ),
});

export const themeResponseSchema = z.object({
  theme: themeSchema,
});

export const createThemeInputSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  config: themeConfigSchema, // key-value pairs
});

export const updateThemeInputSchema = createThemeInputSchema.partial();

export const deleteThemeResponseSchema = z.object({ success: z.boolean() });

export type Theme = z.infer<typeof themeSchema>;
export type ThemeConfigKV = z.infer<typeof themeConfigSchema>;
export type CreateThemeInput = z.infer<typeof createThemeInputSchema>;
export type UpdateThemeInput = z.infer<typeof updateThemeInputSchema>;
