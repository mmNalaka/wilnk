import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import type { AppRouter } from "@/server/routes";

// Create the oRPC client using an RPCLink (browser fetch)
const BASE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  (typeof window !== "undefined" ? window.location.origin : "");

export const link = new RPCLink({
  url: `${BASE_URL}/rpc`,
  fetch(url, options) {
    return fetch(url, {
      ...options,
      credentials: "include",
    });
  },
});

export type AppClient = RouterClient<AppRouter>;
export const api: AppClient = createORPCClient(link);
