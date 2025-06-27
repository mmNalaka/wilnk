import { auth } from "./lib/auth";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

const app = new Hono().basePath("/api");

app.use(logger());
app.use("/*", cors({ origin: process.env.CORS_ORIGIN || "" }));

app.on(["POST", "GET"], "/auth/**", (c) => auth.handler(c.req.raw));

app.get("/health", (c) => {
  return c.text("OK");
});

export default app;
export type AppType = typeof app;
export type AppRouter = AppType["router"];
