import { db } from "@/server/db";
import { pageViews, clickEvents } from "@/server/db/schema/main.schema";
import { eq, count, and, gte, inArray } from "drizzle-orm";

export class PagesAnalytics {
  /**
   * Get view count for a page
   */
  async getViewCount(pageId: string, days?: number): Promise<number> {
    const conditions = [eq(pageViews.pageId, pageId)];

    if (days) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      conditions.push(gte(pageViews.viewedAt, startDate));
    }

    const [result] = await db
      .select({ count: count() })
      .from(pageViews)
      .where(and(...conditions));

    return result?.count || 0;
  }

  /**
   * Get click count for a page
   */
  async getClickCount(pageId: string, days?: number): Promise<number> {
    const conditions = [eq(clickEvents.pageId, pageId)];

    if (days) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      conditions.push(gte(clickEvents.clickedAt, startDate));
    }

    const [result] = await db
      .select({ count: count() })
      .from(clickEvents)
      .where(and(...conditions));

    return result?.count || 0;
  }

  /**
   * Get analytics for multiple pages
   */
  async getAnalyticsForPages(
    pageIds: string[],
  ): Promise<Map<string, { viewCount: number; clickCount: number }>> {
    if (pageIds.length === 0) {
      return new Map();
    }

    // Get view counts
    const viewCounts = await db
      .select({
        pageId: pageViews.pageId,
        count: count(),
      })
      .from(pageViews)
      .where(inArray(pageViews.pageId, pageIds))
      .groupBy(pageViews.pageId);

    // Get click counts
    const clickCounts = await db
      .select({
        pageId: clickEvents.pageId,
        count: count(),
      })
      .from(clickEvents)
      .where(inArray(clickEvents.pageId, pageIds))
      .groupBy(clickEvents.pageId);

    // Combine results
    const analytics = new Map<
      string,
      { viewCount: number; clickCount: number }
    >();

    // Initialize all pages with zero counts
    pageIds.forEach((id) => {
      analytics.set(id, { viewCount: 0, clickCount: 0 });
    });

    // Update with actual view counts
    viewCounts.forEach(({ pageId, count }) => {
      const existing = analytics.get(pageId);
      if (existing) {
        existing.viewCount = count;
      }
    });

    // Update with actual click counts
    clickCounts.forEach(({ pageId, count }) => {
      const existing = analytics.get(pageId);
      if (existing) {
        existing.clickCount = count;
      }
    });

    return analytics;
  }

  /**
   * Record a page view
   */
  async recordPageView(
    pageId: string,
    visitorData: {
      visitorId?: string;
      sessionId?: string;
      country?: string;
      city?: string;
      userAgent?: string;
      deviceType?: string;
      browser?: string;
      referrer?: string;
      utmSource?: string;
      utmMedium?: string;
      utmCampaign?: string;
    } = {},
  ): Promise<void> {
    await db.insert(pageViews).values({
      id: crypto.randomUUID(),
      pageId,
      viewedAt: new Date(),
      ...visitorData,
    });
  }

  /**
   * Record a click event
   */
  async recordClickEvent(
    pageId: string,
    clickData: {
      blockId?: string;
      blockType?: string;
      url?: string;
      label?: string;
      visitorId?: string;
      sessionId?: string;
      country?: string;
      city?: string;
      userAgent?: string;
      deviceType?: string;
      browser?: string;
      referrer?: string;
    } = {},
  ): Promise<void> {
    await db.insert(clickEvents).values({
      id: crypto.randomUUID(),
      pageId,
      clickedAt: new Date(),
      ...clickData,
    });
  }
}

// Export singleton instance
export const pagesAnalytics = new PagesAnalytics();
