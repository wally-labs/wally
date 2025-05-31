import "server-only";

import { AppRouterHighlight } from "@highlight-run/next/server";
import { env } from "~/env-client";

export const withAppRouterHighlight = AppRouterHighlight({
  projectID: env.NEXT_PUBLIC_HIGHLIGHT_PROJECT_ID,
});
