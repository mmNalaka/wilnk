import { db } from "@/server/db";
import { pages, themes } from "@/server/db/schema/main.schema";
import { eq, and, desc } from "drizzle-orm";
import { nanoid } from "nanoid";
import type { CreatePageInput, UpdatePageInput, Page, PageListItem, PageWithTheme } from "./pages.schemas";
import type { DbPage, DbPageWithTheme } from "./pages.service";
import { transformDbPageToApi, transformDbPageWithThemeToApi } from "./pages.service";

export class PagesRepository {
  /**
   * Get all pages for a user with theme information
   */
  async findByUserId(userId: string): Promise<PageListItem[]> {
    const userPages = await db
      .select({
        id: pages.id,
        title: pages.title,
        slug: pages.slug,
        description: pages.description,
        status: pages.status,
        isPublic: pages.isPublic,
        createdAt: pages.createdAt,
        updatedAt: pages.updatedAt,
        publishedAt: pages.publishedAt,
        themeId: pages.themeId,
        themeName: themes.name,
      })
      .from(pages)
      .leftJoin(themes, eq(pages.themeId, themes.id))
      .where(eq(pages.userId, userId))
      .orderBy(desc(pages.updatedAt));

    // Transform to include computed fields
    return userPages.map((page) => ({
      ...page,
      isPublished: page.status === "published" || !!page.publishedAt,
      viewCount: 0, // TODO: Calculate from analytics
      clickCount: 0, // TODO: Calculate from analytics
    }));
  }

  /**
   * Get a single page by ID and user ID
   */
  async findByIdAndUserId(pageId: string, userId: string): Promise<Page | null> {
    const [page] = await db
      .select()
      .from(pages)
      .where(and(eq(pages.id, pageId), eq(pages.userId, userId)))
      .limit(1);

    return page ? transformDbPageToApi(page as DbPage) : null;
  }

  /**
   * Get a published public page by slug with theme information
   */
  async findPublishedBySlug(slug: string): Promise<PageWithTheme | null> {
    const [result] = await db
      .select({
        id: pages.id,
        userId: pages.userId,
        title: pages.title,
        slug: pages.slug,
        description: pages.description,
        content: pages.content,
        themeId: pages.themeId,
        metaTitle: pages.metaTitle,
        metaDescription: pages.metaDescription,
        favicon: pages.favicon,
        status: pages.status,
        isPublic: pages.isPublic,
        password: pages.password,
        analyticsEnabled: pages.analyticsEnabled,
        createdAt: pages.createdAt,
        updatedAt: pages.updatedAt,
        publishedAt: pages.publishedAt,
        theme: {
          id: themes.id,
          name: themes.name,
          description: themes.description,
          createdBy: themes.createdBy,
          config: themes.config,
          preview: themes.preview,
          isPublic: themes.isPublic,
          isSystem: themes.isSystem,
          status: themes.status,
          createdAt: themes.createdAt,
          updatedAt: themes.updatedAt,
        },
      })
      .from(pages)
      .leftJoin(themes, eq(pages.themeId, themes.id))
      .where(
        and(
          eq(pages.slug, slug),
          eq(pages.status, "published"),
          eq(pages.isPublic, true)
        )
      )
      .limit(1);

    if (!result) return null;

    const dbPageWithTheme: DbPageWithTheme = {
      ...result,
      theme: result.theme?.id ? result.theme : null,
    };

    return transformDbPageWithThemeToApi(dbPageWithTheme);
  }

  /**
   * Create a new page
   */
  async create(userId: string, input: CreatePageInput): Promise<Page> {
    // Generate unique slug
    const baseSlug = input.title
      ? input.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")
      : "";

    const slug = input.title
      ? `${baseSlug}-${nanoid(6)}`
      : nanoid(6);

    const newPage = {
      id: nanoid(),
      userId,
      title: input.title || "New Page",
      slug,
      description: null,
      content: {
        content: [],
        root: { props: { title: input.title } },
      },
      themeId: input.themeId || null,
      status: "draft",
      isPublic: true,
      analyticsEnabled: true,
      password: null,
      metaTitle: input.title || null,
      metaDescription: null,
      favicon: null,
      publishedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const [createdPage] = await db
      .insert(pages)
      .values(newPage)
      .returning();

    return transformDbPageToApi(createdPage as DbPage);
  }

  /**
   * Update an existing page
   */
  async update(pageId: string, userId: string, data: UpdatePageInput): Promise<Page> {
    // Verify page ownership first
    const [existingPage] = await db
      .select()
      .from(pages)
      .where(and(eq(pages.id, pageId), eq(pages.userId, userId)))
      .limit(1);

    if (!existingPage) {
      throw new Error("Page not found");
    }

    // Transform content field if provided
    const updateData = { ...data };
    if ('content' in updateData) {
      // Handle content field transformation if needed
    }

    const [updatedPage] = await db
      .update(pages)
      .set({
        ...updateData,
        updatedAt: new Date(),
      })
      .where(eq(pages.id, pageId))
      .returning();

    return transformDbPageToApi(updatedPage as DbPage);
  }

  /**
   * Delete a page
   */
  async delete(pageId: string, userId: string): Promise<boolean> {
    // Verify page ownership
    const [existingPage] = await db
      .select()
      .from(pages)
      .where(and(eq(pages.id, pageId), eq(pages.userId, userId)))
      .limit(1);

    if (!existingPage) {
      throw new Error("Page not found");
    }

    await db.delete(pages).where(eq(pages.id, pageId));
    return true;
  }

  /**
   * Duplicate a page
   */
  async duplicate(pageId: string, userId: string): Promise<Page> {
    // Get the original page from database directly
    const [originalPage] = await db
      .select()
      .from(pages)
      .where(and(eq(pages.id, pageId), eq(pages.userId, userId)))
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
      metaTitle: originalPage.metaTitle ? `${originalPage.metaTitle} (Copy)` : null,
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

    return transformDbPageToApi(createdPage as DbPage);
  }

  /**
   * Check if a slug is available
   */
  async isSlugAvailable(slug: string, excludePageId?: string): Promise<boolean> {
    const conditions = excludePageId 
      ? and(eq(pages.slug, slug), eq(pages.id, excludePageId))
      : eq(pages.slug, slug);

    const [existingPage] = await db
      .select({ id: pages.id })
      .from(pages)
      .where(conditions)
      .limit(1);

    return !existingPage;
  }
}

// Export singleton instance
export const pagesRepository = new PagesRepository();
