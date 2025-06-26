import { QueryCache, QueryClient } from "@tanstack/react-query";
import { hc } from "hono/client";
import { toast } from "sonner";

import type { AppType } from "@/server/index";

const API_URL = `${process.env.NEXT_PUBLIC_SERVER_URL}`;

export const client = hc<AppType>(API_URL);

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error) => {
      toast.error(`Error: ${error.message}`, {
        action: {
          label: "retry",
          onClick: () => {
            queryClient.invalidateQueries();
          },
        },
      });
    },
  }),
});
