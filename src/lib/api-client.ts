import { createORPCClient } from "@orpc/client";
import type { AppRouter } from "@/server/routes";

// Create the oRPC client
export const api = createORPCClient<AppRouter>({
  baseURL: "/rpc",
});
