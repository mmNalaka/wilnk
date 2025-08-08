# Automatic Database Migrations

This application supports automatic database migrations using environment variables, following industry best practices for production deployments.

## Environment Variables

### Required Variables
- `RUN_MIGRATIONS`: Set to `"true"` to enable automatic migrations on app startup
- `NODE_ENV`: Environment identifier (`development`, `staging`, `production`)

### Optional Variables
- `MIGRATION_TARGET`: Specific migration version to run up to (e.g., `"0001"`, `"0002"`)

## Usage Examples

### Development Environment
```bash
# Run all migrations automatically
RUN_MIGRATIONS=true
NODE_ENV=development
```

### Production Environment
```bash
# Run all migrations automatically in production
RUN_MIGRATIONS=true
NODE_ENV=production

# Run migrations up to a specific version
RUN_MIGRATIONS=true
MIGRATION_TARGET=0001
NODE_ENV=production
```

### Staging Environment
```bash
# Test migrations in staging
RUN_MIGRATIONS=true
NODE_ENV=staging
MIGRATION_TARGET=0002
```

## How It Works

1. **Startup Check**: When the application starts, it checks for the `RUN_MIGRATIONS` environment variable
2. **Migration Execution**: If enabled, migrations run automatically using Drizzle's built-in migration system
3. **Production Safety**: In production, migration failures will cause the application to exit (fail-fast principle)
4. **Logging**: Comprehensive logging provides visibility into migration status and results

## Migration Files

Migrations are stored in `src/server/db/migrations/` and follow Drizzle's naming convention:
- `0000_violet_kitty_pryde.sql`
- `0001_next_migration.sql`
- etc.

## Production Deployment Workflow

### Option 1: Deploy with Migrations
```bash
# Set environment variables in your deployment platform
RUN_MIGRATIONS=true
NODE_ENV=production

# Deploy the application
# Migrations will run automatically on first startup
```

### Option 2: Targeted Migration Deployment
```bash
# Run migrations up to a specific version
RUN_MIGRATIONS=true
MIGRATION_TARGET=0003
NODE_ENV=production

# Deploy and verify
# Then deploy again without migration flags for normal operation
```

## Safety Features

- **Environment Awareness**: Different behavior for development vs production
- **Fail-Fast**: Production deployments exit on migration failure
- **Async Execution**: Migrations don't block application startup
- **Comprehensive Logging**: Clear visibility into migration status
- **Target Control**: Ability to run migrations up to specific versions

## Best Practices

1. **Test First**: Always test migrations in development/staging before production
2. **Backup**: Ensure database backups before running production migrations
3. **Monitoring**: Monitor application logs during deployment for migration status
4. **Rollback Plan**: Have a rollback strategy for failed migrations
5. **Gradual Rollout**: Consider using `MIGRATION_TARGET` for gradual rollouts

## Troubleshooting

### Migration Fails in Production
- Check application logs for specific error messages
- Verify migration files are included in deployment
- Ensure database permissions are correct
- Consider manual migration rollback if needed

### Migration Doesn't Run
- Verify `RUN_MIGRATIONS=true` is set
- Check that migration files exist in `src/server/db/migrations/`
- Ensure Drizzle configuration is correct

### Partial Migration Completion
- Use `MIGRATION_TARGET` to run specific migrations
- Check migration table `__drizzle_migrations__` for current state
- Review migration logs for partial completion details
