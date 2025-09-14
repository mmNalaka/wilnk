import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { user } from "./auth.schema";

// Pages table - stores page data structure
export const pages = sqliteTable(
  "pages",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(),
    description: text("description"),
    content: text("content", { mode: "json" }).notNull().default("{}"),
    themeId: text("theme_id").references(() => themes.id, {
      onDelete: "set null",
    }),
    metaTitle: text("meta_title"),
    metaDescription: text("meta_description"),
    favicon: text("favicon"),
    status: text("status").notNull().default("draft"),
    isPublic: integer("is_public", { mode: "boolean" }).notNull().default(true),
    password: text("password"),
    analyticsEnabled: integer("analytics_enabled", { mode: "boolean" })
      .notNull()
      .default(true),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
    publishedAt: integer("published_at", { mode: "timestamp" }),
  },
  (table) => ({
    slugIdx: index("pages_slug_idx").on(table.slug),
    userIdIdx: index("pages_user_id_idx").on(table.userId),
  }),
);

// Themes table - stores theme configurations
export const themes = sqliteTable("themes", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  createdBy: text("created_by").references(() => user.id),
  config: text("config", { mode: "json" }).notNull().default("{}"),
  isSystem: integer("is_system", { mode: "boolean" }).notNull().default(false),
  status: text("status").notNull().default("active"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// Block templates - reusable component definitions
export const blockTemplates = sqliteTable("block_templates", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  createdBy: text("created_by").references(() => user.id),
  type: text("type").notNull(),
  config: text("config", { mode: "json" }).notNull(),
  defaultProps: text("default_props", { mode: "json" }).notNull().default("{}"),
  category: text("category").notNull().default("custom"),
  preview: text("preview"),
  icon: text("icon"),
  isPublic: integer("is_public", { mode: "boolean" }).notNull().default(false),
  isSystem: integer("is_system", { mode: "boolean" }).notNull().default(false),
  status: text("status").notNull().default("draft"),
  usageCount: integer("usage_count").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});

// Page analytics - aggregated daily stats
export const pageAnalytics = sqliteTable(
  "page_analytics",
  {
    id: text("id").primaryKey(),
    pageId: text("page_id")
      .notNull()
      .references(() => pages.id, { onDelete: "cascade" }),
    date: text("date").notNull(),
    views: integer("views").notNull().default(0),
    uniqueViews: integer("unique_views").notNull().default(0),
    totalClicks: integer("total_clicks").notNull().default(0),
    topCountries: text("top_countries", { mode: "json" }).default("[]"),
    topCities: text("top_cities", { mode: "json" }).default("[]"),
    deviceTypes: text("device_types", { mode: "json" }).default("{}"),
    browsers: text("browsers", { mode: "json" }).default("{}"),
    topReferrers: text("top_referrers", { mode: "json" }).default("[]"),
    createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
  },
  (table) => ({
    pageIdDateIdx: index("page_analytics_page_id_date_idx").on(
      table.pageId,
      table.date,
    ),
  }),
);

// Click tracking - individual click events
export const clickEvents = sqliteTable(
  "click_events",
  {
    id: text("id").primaryKey(),
    pageId: text("page_id")
      .notNull()
      .references(() => pages.id, { onDelete: "cascade" }),
    blockId: text("block_id"),
    blockType: text("block_type"),
    url: text("url"),
    label: text("label"),
    visitorId: text("visitor_id"),
    sessionId: text("session_id"),
    country: text("country"),
    city: text("city"),
    // Device/browser data
    userAgent: text("user_agent"),
    deviceType: text("device_type"), // mobile, desktop, tablet
    browser: text("browser"),
    // Referrer
    referrer: text("referrer"),
    // Timestamp
    clickedAt: integer("clicked_at", { mode: "timestamp" }).notNull(),
  },
  (table) => ({
    pageIdIdx: index("click_events_page_id_idx").on(table.pageId),
    clickedAtIdx: index("click_events_clicked_at_idx").on(table.clickedAt),
  }),
);

// Page views - individual view events
export const pageViews = sqliteTable(
  "page_views",
  {
    id: text("id").primaryKey(),
    pageId: text("page_id")
      .notNull()
      .references(() => pages.id, { onDelete: "cascade" }),
    visitorId: text("visitor_id"),
    sessionId: text("session_id"),
    country: text("country"),
    city: text("city"),
    // Device/browser data
    userAgent: text("user_agent"),
    deviceType: text("device_type"),
    browser: text("browser"),
    // Referrer and UTM parameters
    referrer: text("referrer"),
    utmSource: text("utm_source"),
    utmMedium: text("utm_medium"),
    utmCampaign: text("utm_campaign"),
    // Session data
    duration: integer("duration"), // Time spent on page in seconds
    // Timestamp
    viewedAt: integer("viewed_at", { mode: "timestamp" }).notNull(),
  },
  (table) => ({
    pageIdIdx: index("page_views_page_id_idx").on(table.pageId),
    viewedAtIdx: index("page_views_viewed_at_idx").on(table.viewedAt),
  }),
);

// User subscriptions/plans
export const subscriptions = sqliteTable("subscriptions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  plan: text("plan").notNull(),
  status: text("status").notNull(),
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  currentPeriodStart: integer("current_period_start", { mode: "timestamp" }),
  currentPeriodEnd: integer("current_period_end", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
});
