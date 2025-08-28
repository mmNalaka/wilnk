import { healthRouter } from "./modules/health/health.router";
import { pagesRouter } from "./modules/pages/pages.router";
import { themesRouter } from "./modules/themes/themes.router";
import { analyticsRouter } from "./modules/analytics/analytics.router";
// import { settingsRouter } from "./modules/settings/settings.router";

export const appRouter = {
  health: healthRouter,
  pages: pagesRouter,
  themes: themesRouter,
  analytics: analyticsRouter,
  // settings: settingsRouter,
};

export type AppRouter = typeof appRouter;