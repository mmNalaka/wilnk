import { relations } from "drizzle-orm";
import {
  users,
  pages,
  themes,
  blockTemplates,
  pageAnalytics,
  clickEvents,
  pageViews,
  subscriptions,
} from "./main.schema";

// Database Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  pages: many(pages),
  themes: many(themes),
  blockTemplates: many(blockTemplates),
  subscription: one(subscriptions, {
    fields: [users.id],
    references: [subscriptions.userId],
  }),
}));

export const pagesRelations = relations(pages, ({ one, many }) => ({
  user: one(users, {
    fields: [pages.userId],
    references: [users.id],
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
  creator: one(users, {
    fields: [themes.createdBy],
    references: [users.id],
  }),
  pages: many(pages),
}));

export const blockTemplatesRelations = relations(blockTemplates, ({ one }) => ({
  creator: one(users, {
    fields: [blockTemplates.createdBy],
    references: [users.id],
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
  user: one(users, {
    fields: [subscriptions.userId],
    references: [users.id],
  }),
}));
