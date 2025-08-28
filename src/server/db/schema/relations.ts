import { relations } from "drizzle-orm";
import {
  pages,
  themes,
  blockTemplates,
  pageAnalytics,
  clickEvents,
  pageViews,
  subscriptions,
} from "./main.schema";
import { user } from "./auth.schema";

// Database Relations
export const usersRelations = relations(user, ({ many, one }) => ({
  pages: many(pages),
  themes: many(themes),
  blockTemplates: many(blockTemplates),
  subscription: one(subscriptions, {
    fields: [user.id],
    references: [subscriptions.userId],
  }),
}));

export const pagesRelations = relations(pages, ({ one, many }) => ({
  user: one(user, {
    fields: [pages.userId],
    references: [user.id],
  }),
  theme: one(themes, {
    fields: [pages.themeId],
    references: [themes.id],
  }),
  analytics: many(pageAnalytics),
  clickEvents: many(clickEvents),
  pageViews: many(pageViews),
}));

export const themesRelations = relations(themes, ({ one, many }) => ({
  creator: one(user, {
    fields: [themes.createdBy],
    references: [user.id],
  }),
  pages: many(pages),
}));

export const blockTemplatesRelations = relations(blockTemplates, ({ one }) => ({
  creator: one(user, {
    fields: [blockTemplates.createdBy],
    references: [user.id],
  }),
}));

export const pageAnalyticsRelations = relations(pageAnalytics, ({ one }) => ({
  page: one(pages, {
    fields: [pageAnalytics.pageId],
    references: [pages.id],
  }),
}));

export const clickEventsRelations = relations(clickEvents, ({ one }) => ({
  page: one(pages, {
    fields: [clickEvents.pageId],
    references: [pages.id],
  }),
}));

export const pageViewsRelations = relations(pageViews, ({ one }) => ({
  page: one(pages, {
    fields: [pageViews.pageId],
    references: [pages.id],
  }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  user: one(user, {
    fields: [subscriptions.userId],
    references: [user.id],
  }),
}));
