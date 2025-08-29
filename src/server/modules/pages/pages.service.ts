import type { Page, PageWithTheme } from "./pages.schemas";

// Database page type (matches actual DB schema)
export interface DbPage {
  id: string;
  userId: string;
  title: string;
  slug: string;
  description: string | null;
  content: any; // JSON field for Puck data
  themeId: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  favicon: string | null;
  status: string;
  isPublic: boolean;
  password: string | null;
  analyticsEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
}

// Database page with theme type
export interface DbPageWithTheme extends DbPage {
  theme: {
    id: string;
    name: string;
    description: string | null;
    createdBy: string | null;
    config: any;
    preview: string | null;
    isPublic: boolean;
    isSystem: boolean;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  } | null;
}

/**
 * Transform database page to API response format
 */
export function transformDbPageToApi(dbPage: DbPage): Page {
  return {
    id: dbPage.id,
    userId: dbPage.userId,
    title: dbPage.title,
    slug: dbPage.slug,
    description: dbPage.description,
    puckData: dbPage.content || {}, // Transform content to puckData
    themeId: dbPage.themeId,
    metaTitle: dbPage.metaTitle,
    metaDescription: dbPage.metaDescription,
    favicon: dbPage.favicon,
    status: dbPage.status,
    isPublic: dbPage.isPublic,
    password: dbPage.password,
    analyticsEnabled: dbPage.analyticsEnabled,
    createdAt: dbPage.createdAt,
    updatedAt: dbPage.updatedAt,
    publishedAt: dbPage.publishedAt,
  };
}

/**
 * Transform database page with theme to API response format
 */
export function transformDbPageWithThemeToApi(dbPage: DbPageWithTheme): PageWithTheme {
  return {
    id: dbPage.id,
    userId: dbPage.userId,
    title: dbPage.title,
    slug: dbPage.slug,
    description: dbPage.description,
    puckData: dbPage.content || {}, // Transform content to puckData
    themeId: dbPage.themeId,
    metaTitle: dbPage.metaTitle,
    metaDescription: dbPage.metaDescription,
    favicon: dbPage.favicon,
    status: dbPage.status,
    isPublic: dbPage.isPublic,
    password: dbPage.password,
    analyticsEnabled: dbPage.analyticsEnabled,
    createdAt: dbPage.createdAt,
    updatedAt: dbPage.updatedAt,
    publishedAt: dbPage.publishedAt,
    theme: dbPage.theme,
  };
}
