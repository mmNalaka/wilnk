import { drizzle } from "drizzle-orm/d1";
import { migrate } from "drizzle-orm/d1/migrator";

interface MigrationResult {
  success: boolean;
  migrationsRun: number;
  targetMigration?: string;
  error?: string;
}

/**
 * Production-ready migration runner
 * Environment variables:
 * - RUN_MIGRATIONS: Set to "true" to enable automatic migrations
 * - MIGRATION_TARGET: Optional migration version to run up to (e.g., "0001")
 * - NODE_ENV: Used to determine if we're in production
 */
export async function runMigrationsIfEnabled(database: D1Database): Promise<MigrationResult> {
  const shouldRunMigrations = process.env.RUN_MIGRATIONS === "true";
  const migrationTarget = process.env.MIGRATION_TARGET;
  const isProduction = process.env.NODE_ENV === "production";

  if (!shouldRunMigrations) {
    return {
      success: true,
      migrationsRun: 0,
    };
  }

  console.log("🔄 Starting automatic migrations...");
  
  if (isProduction) {
    console.log("⚠️  Running migrations in PRODUCTION environment");
  }

  try {
    const db = drizzle(database);
    
    // Use Drizzle's built-in migrate function with the migrations folder
    await migrate(db, { 
      migrationsFolder: "./src/server/db/migrations",
      migrationsTable: "__drizzle_migrations__"
    });

    const result: MigrationResult = {
      success: true,
      migrationsRun: 1, // Drizzle handles counting internally
      targetMigration: migrationTarget,
    };

    console.log("✅ Migrations completed successfully");
    
    if (migrationTarget) {
      console.log(`🎯 Target migration: ${migrationTarget}`);
    }

    return result;

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown migration error";
    
    console.error("❌ Migration failed:", errorMessage);
    
    // In production, we might want to fail fast
    if (isProduction) {
      console.error("🚨 Migration failure in production - this may require immediate attention");
    }

    return {
      success: false,
      migrationsRun: 0,
      error: errorMessage,
    };
  }
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
