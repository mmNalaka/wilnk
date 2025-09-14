import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";

const { env } = await getCloudflareContext({ async: true });

export const db = drizzle(env.DB);
