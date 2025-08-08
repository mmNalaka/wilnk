import { getCloudflareContext } from "@opennextjs/cloudflare";
import { drizzle } from "drizzle-orm/d1";
import { runMigrationsIfEnabled, getMigrationConfig } from "./migrate";

const { env } = await getCloudflareContext({async: true})

// Initialize database
export const db = drizzle(env.DB);

// Run migrations automatically if enabled via environment variables
const migrationConfig = getMigrationConfig();
if (migrationConfig.enabled) {
  console.log("🔧 Migration configuration:", {
    enabled: migrationConfig.enabled,
    target: migrationConfig.target || "latest",
    environment: migrationConfig.environment
  });
  
  // Run migrations asynchronously to avoid blocking app startup
  runMigrationsIfEnabled(env.DB)
    .then((result) => {
      if (result.success) {
        console.log(`✅ Migrations completed: ${result.migrationsRun} migrations run`);
      } else {
        console.error(`❌ Migration failed: ${result.error}`);
        // In production, you might want to exit the process on migration failure
        if (migrationConfig.environment === "production") {
          console.error("🚨 Exiting due to migration failure in production");
          process.exit(1);
        }
      }
    })
    .catch((error) => {
      console.error("💥 Unexpected migration error:", error);
      if (migrationConfig.environment === "production") {
        process.exit(1);
      }
    });
}
