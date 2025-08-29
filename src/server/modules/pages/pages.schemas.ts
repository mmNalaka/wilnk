import { z } from "zod";

// Base page schema matching database structure
export const pageDbSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  content: z.any(), // JSON field for Puck data
  themeId: z.string().nullable(),
  metaTitle: z.string().nullable(),
  metaDescription: z.string().nullable(),
  favicon: z.string().nullable(),
  status: z.string(),
  isPublic: z.boolean(),
  password: z.string().nullable(),
  analyticsEnabled: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  publishedAt: z.date().nullable(),
});

// API response page schema with frontend-expected fields
export const pageSchema = z.object({
  id: z.string(),
  userId: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  puckData: z.any(), // Renamed from content for frontend compatibility
  themeId: z.string().nullable(),
  metaTitle: z.string().nullable(),
  metaDescription: z.string().nullable(),
  favicon: z.string().nullable(),
  status: z.string(),
  isPublic: z.boolean(),
  password: z.string().nullable(),
  analyticsEnabled: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  publishedAt: z.date().nullable(),
});

// Theme schema
export const themeSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  createdBy: z.string().nullable(),
  config: z.any(),
  preview: z.string().nullable(),
  isPublic: z.boolean(),
  isSystem: z.boolean(),
  status: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Page with theme joined
export const pageWithThemeSchema = pageSchema.extend({
  theme: themeSchema.nullable(),
});

// Input schemas for operations
export const createPageInputSchema = z.object({
  title: z.string().min(1).optional(),
  themeId: z.string().optional(),
});

export const updatePageInputSchema = z.object({
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

// List response schema with computed fields for frontend compatibility
export const pageListItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  status: z.string(),
  isPublic: z.boolean(),
  isPublished: z.boolean(), // Computed from status/publishedAt
  viewCount: z.number(), // TODO: Calculate from analytics
  clickCount: z.number(), // TODO: Calculate from analytics
  createdAt: z.date(),
  updatedAt: z.date(),
  publishedAt: z.date().nullable(),
  themeId: z.string().nullable(),
  themeName: z.string().nullable(),
});

// Response schemas
export const pagesListResponseSchema = z.object({
  pages: z.array(pageListItemSchema),
});

export const pageResponseSchema = z.object({
  page: pageSchema,
});

export const pageWithThemeResponseSchema = z.object({
  page: pageWithThemeSchema,
});

export const deletePageResponseSchema = z.object({
  success: z.boolean(),
});

// Type exports
export type Page = z.infer<typeof pageSchema>;
export type Theme = z.infer<typeof themeSchema>;
export type PageWithTheme = z.infer<typeof pageWithThemeSchema>;
export type CreatePageInput = z.infer<typeof createPageInputSchema>;
export type UpdatePageInput = z.infer<typeof updatePageInputSchema>;
export type PageListItem = z.infer<typeof pageListItemSchema>;
