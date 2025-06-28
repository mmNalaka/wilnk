import { healthRouter } from "./modules/health/health.router";

export const appRouter = {
  health: healthRouter,
};

export type AppRouter = typeof appRouter;