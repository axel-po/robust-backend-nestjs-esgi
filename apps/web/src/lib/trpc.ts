import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../../../trpc-demo/src/server";

// Client tRPC typé — autocomplete sur toutes les routes
export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "http://localhost:3001/trpc",
    }),
  ],
});
