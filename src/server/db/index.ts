import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { getMigrationInfo } from "./migrate";

const { env } = await getCloudflareContext({async: true})

// Initialize database
export const db = drizzle(env.DB);

// Migration information
const migrationInfo = getMigrationInfo();
if (migrationInfo.useWranglerMigrations) {
  console.log("📋 Migration Info:", migrationInfo.message);
  console.log("💡 To apply migrations: wrangler d1 migrations apply DB");
  console.log("💡 To check migration status: wrangler d1 migrations list DB");
}
