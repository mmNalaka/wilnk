/**
 * DEPRECATED: Programmatic migrations in Workers are not recommended
 * 
 * For Cloudflare D1 with Drizzle ORM, use Wrangler's built-in migration system:
 * 
 * 1. Configure migrations_dir in wrangler.toml/wrangler.jsonc
 * 2. Use `wrangler d1 migrations apply <binding>` to apply migrations
 * 3. Use `wrangler d1 migrations list <binding>` to check status
 * 
 * See: https://github.com/drizzle-team/drizzle-orm/discussions/1388
 * Docs: https://developers.cloudflare.com/d1/reference/migrations/
 */

interface MigrationInfo {
  useWranglerMigrations: boolean;
  message: string;
}

/**
 * Returns information about the recommended migration approach
 */
export function getMigrationInfo(): MigrationInfo {
  return {
    useWranglerMigrations: true,
    message: "Use 'wrangler d1 migrations apply DB' to run migrations. See MIGRATIONS.md for details."
  };
}

/**
 * Check if migrations should run based on environment variables
 */
export function shouldRunMigrations(): boolean {
  return process.env.RUN_MIGRATIONS === "true";
}

/**
 * Get migration configuration from environment variables
 */
export function getMigrationConfig() {
  return {
    enabled: process.env.RUN_MIGRATIONS === "true",
    target: process.env.MIGRATION_TARGET,
    environment: process.env.NODE_ENV || "development",
  };
}
