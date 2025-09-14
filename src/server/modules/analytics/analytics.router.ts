import { z } from "zod";
import { protectedProcedure, publicProcedure } from "@/server/lib/orpc";
import { db } from "@/server/db";
import { pageViews, clickEvents, pages } from "@/server/db/schema/main.schema";
import { eq, and, gte, sql, desc, count } from "drizzle-orm";

const timeRangeSchema = z.enum(["7d", "30d", "90d", "1y"]);

const trackPageViewSchema = z.object({
  pageId: z.string(),
  visitorId: z.string(),
  sessionId: z.string(),
  country: z.string().optional(),
  city: z.string().optional(),
  userAgent: z.string().optional(),
  deviceType: z.string().optional(),
  browser: z.string().optional(),
  referrer: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
});

const trackClickEventSchema = z.object({
  pageId: z.string(),
  blockId: z.string(),
  blockType: z.string(),
  url: z.string(),
  label: z.string().optional(),
  visitorId: z.string(),
  sessionId: z.string(),
  country: z.string().optional(),
  city: z.string().optional(),
  userAgent: z.string().optional(),
  deviceType: z.string().optional(),
  browser: z.string().optional(),
  referrer: z.string().optional(),
});

export const analyticsRouter = {
  // Get analytics overview
  overview: protectedProcedure
    .input(z.object({ timeRange: timeRangeSchema.optional() }))
    .output(z.object({
      totalViews: z.number(),
      totalClicks: z.number(),
      uniqueVisitors: z.number(),
      clickThroughRate: z.number(),
      topPages: z.array(z.object({
        id: z.string(),
        title: z.string(),
        slug: z.string(),
        views: z.number(),
        clicks: z.number(),
        ctr: z.number(),
      })),
      topCountries: z.array(z.object({
        country: z.string(),
        views: z.number(),
        percentage: z.number(),
      })),
      dailyStats: z.array(z.object({
        date: z.string(),
        views: z.number(),
        clicks: z.number(),
        visitors: z.number(),
      })),
      topReferrers: z.array(z.object({
        referrer: z.string(),
        views: z.number(),
        percentage: z.number(),
      })),
    }))
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;
      const timeRange = input.timeRange || "7d";

      // Calculate date range
      const now = new Date();
      let startDate: Date;
      
      switch (timeRange) {
        case "7d":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "30d":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        case "90d":
          startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          break;
        case "1y":
          startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
          break;
      }

      // Get user's pages
      const userPages = await db
        .select({ id: pages.id })
        .from(pages)
        .where(eq(pages.userId, userId));

      const pageIds = userPages.map(p => p.id);

      if (pageIds.length === 0) {
        return {
          totalViews: 0,
          totalClicks: 0,
          uniqueVisitors: 0,
          clickThroughRate: 0,
          topPages: [],
          topCountries: [],
          dailyStats: [],
          topReferrers: [],
        };
      }

      // Total views
      const [totalViewsResult] = await db
        .select({ count: count() })
        .from(pageViews)
        .where(
          and(
            sql`${pageViews.pageId} IN ${pageIds}`,
            gte(pageViews.viewedAt, startDate)
          )
        );

      // Total clicks
      const [totalClicksResult] = await db
        .select({ count: count() })
        .from(clickEvents)
        .where(
          and(
            sql`${clickEvents.pageId} IN ${pageIds}`,
            gte(clickEvents.clickedAt, startDate)
          )
        );

      // Unique visitors
      const [uniqueVisitorsResult] = await db
        .select({ count: sql`COUNT(DISTINCT ${pageViews.visitorId})` })
        .from(pageViews)
        .where(
          and(
            sql`${pageViews.pageId} IN ${pageIds}`,
            gte(pageViews.viewedAt, startDate)
          )
        );

      const toNumber = (v: unknown) => {
        if (typeof v === 'number') return v;
        if (typeof v === 'bigint') return Number(v);
        return Number(v as string);
      };

      const totalViews = toNumber(totalViewsResult.count);
      const totalClicks = toNumber(totalClicksResult.count);
      const uniqueVisitors = toNumber(uniqueVisitorsResult.count);
      const clickThroughRate = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0;

      // Top pages
      const topPages = await db
        .select({
          id: pages.id,
          title: pages.title,
          slug: pages.slug,
          views: count(pageViews.id),
        })
        .from(pages)
        .leftJoin(pageViews, 
          and(
            eq(pages.id, pageViews.pageId),
            gte(pageViews.viewedAt, startDate)
          )
        )
        .where(eq(pages.userId, userId))
        .groupBy(pages.id, pages.title, pages.slug)
        .orderBy(desc(count(pageViews.id)))
        .limit(5);

      // Clicks per page for top pages
      const topPageIds = topPages.map(p => p.id);
      let clicksByPage: Record<string, number> = {};
      if (topPageIds.length > 0) {
        const clicksRows = await db
          .select({ pageId: clickEvents.pageId, clicks: count() })
          .from(clickEvents)
          .where(
            and(
              sql`${clickEvents.pageId} IN ${topPageIds}`,
              gte(clickEvents.clickedAt, startDate)
            )
          )
          .groupBy(clickEvents.pageId);
        clicksByPage = Object.fromEntries(clicksRows.map(r => [r.pageId, toNumber(r.clicks)]));
      }

      // Top countries
      const topCountries = await db
        .select({
          country: pageViews.country,
          views: count(),
        })
        .from(pageViews)
        .where(
          and(
            sql`${pageViews.pageId} IN ${pageIds}`,
            gte(pageViews.viewedAt, startDate)
          )
        )
        .groupBy(pageViews.country)
        .orderBy(desc(count()))
        .limit(5);

      // Daily stats
      const dailyViews = await db
        .select({
          date: sql`DATE(${pageViews.viewedAt})`.as('date'),
          views: count(pageViews.id),
        })
        .from(pageViews)
        .where(
          and(
            sql`${pageViews.pageId} IN ${pageIds}`,
            gte(pageViews.viewedAt, startDate)
          )
        )
        .groupBy(sql`DATE(${pageViews.viewedAt})`)
        .orderBy(sql`DATE(${pageViews.viewedAt})`);

      const dailyVisitors = await db
        .select({
          date: sql`DATE(${pageViews.viewedAt})`.as('date'),
          visitors: sql`COUNT(DISTINCT ${pageViews.visitorId})`,
        })
        .from(pageViews)
        .where(
          and(
            sql`${pageViews.pageId} IN ${pageIds}`,
            gte(pageViews.viewedAt, startDate)
          )
        )
        .groupBy(sql`DATE(${pageViews.viewedAt})`)
        .orderBy(sql`DATE(${pageViews.viewedAt})`);

      const dailyClicks = await db
        .select({
          date: sql`DATE(${clickEvents.clickedAt})`.as('date'),
          clicks: count(),
        })
        .from(clickEvents)
        .where(
          and(
            sql`${clickEvents.pageId} IN ${pageIds}`,
            gte(clickEvents.clickedAt, startDate)
          )
        )
        .groupBy(sql`DATE(${clickEvents.clickedAt})`)
        .orderBy(sql`DATE(${clickEvents.clickedAt})`);

      // Top referrers
      const topReferrers = await db
        .select({
          referrer: pageViews.referrer,
          views: count(),
        })
        .from(pageViews)
        .where(
          and(
            sql`${pageViews.pageId} IN ${pageIds}`,
            gte(pageViews.viewedAt, startDate)
          )
        )
        .groupBy(pageViews.referrer)
        .orderBy(desc(count()))
        .limit(5);

      // Calculate percentages for countries and referrers
      const topCountriesWithPercentage = topCountries.map(country => ({
        country: country.country || "Unknown",
        views: toNumber(country.views),
        percentage: totalViews > 0 ? (toNumber(country.views) / totalViews) * 100 : 0,
      }));

      const topReferrersWithPercentage = topReferrers.map(referrer => ({
        referrer: referrer.referrer || "Direct",
        views: toNumber(referrer.views),
        percentage: totalViews > 0 ? (toNumber(referrer.views) / totalViews) * 100 : 0,
      }));

      return {
        totalViews: toNumber(totalViews),
        totalClicks: toNumber(totalClicks),
        uniqueVisitors: toNumber(uniqueVisitors),
        clickThroughRate: Math.round(clickThroughRate * 10) / 10,
        topPages: topPages.map(page => {
          const viewsNum = toNumber(page.views);
          const clicksNum = toNumber(clicksByPage[page.id] ?? 0);
          const ctr = viewsNum > 0 ? (clicksNum / viewsNum) * 100 : 0;
          return {
            id: page.id,
            title: page.title,
            slug: page.slug,
            views: viewsNum,
            clicks: clicksNum,
            ctr: Math.round(ctr * 10) / 10,
          };
        }),
        topCountries: topCountriesWithPercentage,
        dailyStats: (() => {
          const clicksByDate = Object.fromEntries(dailyClicks.map(dc => [String(dc.date), toNumber(dc.clicks)]));
          const visitorsByDate = Object.fromEntries(dailyVisitors.map(dv => [String(dv.date), toNumber(dv.visitors)]));
          return dailyViews.map(dv => ({
            date: String(dv.date),
            views: toNumber(dv.views),
            clicks: clicksByDate[String(dv.date)] ?? 0,
            visitors: visitorsByDate[String(dv.date)] ?? 0,
          }));
        })(),
        topReferrers: topReferrersWithPercentage,
      };
    }),

  // Track page view (public endpoint)
  trackPageView: publicProcedure
    .input(trackPageViewSchema)
    .output(z.object({ success: z.boolean() }))
    .handler(async ({ input }) => {
      const pageViewData = {
        id: crypto.randomUUID(),
        pageId: input.pageId,
        visitorId: input.visitorId,
        sessionId: input.sessionId,
        country: input.country || null,
        city: input.city || null,
        userAgent: input.userAgent || null,
        deviceType: input.deviceType || null,
        browser: input.browser || null,
        referrer: input.referrer || null,
        utmSource: input.utmSource || null,
        utmMedium: input.utmMedium || null,
        utmCampaign: input.utmCampaign || null,
        viewedAt: new Date(),
      };

      await db.insert(pageViews).values(pageViewData);

      return { success: true };
    }),

  // Track click event (public endpoint)
  trackClick: publicProcedure
    .input(trackClickEventSchema)
    .output(z.object({ success: z.boolean() }))
    .handler(async ({ input }) => {
      const clickEventData = {
        id: crypto.randomUUID(),
        pageId: input.pageId,
        blockId: input.blockId,
        blockType: input.blockType,
        url: input.url,
        label: input.label || null,
        visitorId: input.visitorId,
        sessionId: input.sessionId,
        country: input.country || null,
        city: input.city || null,
        userAgent: input.userAgent || null,
        deviceType: input.deviceType || null,
        browser: input.browser || null,
        referrer: input.referrer || null,
        clickedAt: new Date(),
      };

      await db.insert(clickEvents).values(clickEventData);

      return { success: true };
    }),
};
