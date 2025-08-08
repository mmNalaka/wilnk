# Database Migrations with Cloudflare D1

This application uses **Wrangler's built-in D1 migration system** - the industry-standard and recommended approach for Cloudflare D1 with Drizzle ORM.

> **📚 Reference**: [Drizzle ORM Discussion #1388](https://github.com/drizzle-team/drizzle-orm/discussions/1388)  
> **📖 Official Docs**: [Cloudflare D1 Migrations](https://developers.cloudflare.com/d1/reference/migrations/)

## 🏗️ **How It Works**

1. **Generate Migrations**: Use `drizzle-kit generate` to create SQL migration files
2. **Configure Wrangler**: Migration directory is already configured in `wrangler.jsonc`
3. **Apply Migrations**: Use `wrangler d1 migrations apply` to run migrations
4. **Track State**: Wrangler automatically tracks applied migrations in `d1_migrations` table

## 🚀 **Quick Start**

### 1. Generate New Migration
```bash
# After changing your schema files
pnpm run db:generate
```

### 2. Check Migration Status
```bash
# List unapplied migrations (production)
pnpm run db:migrations:list

# List unapplied migrations (local)
pnpm run db:migrations:list:local
```

### 3. Apply Migrations
```bash
# Apply migrations to production database
pnpm run db:migrations:apply

# Apply migrations to local database
pnpm run db:migrations:apply:local
```

## 📋 **Available Commands**

| Command | Description |
|---------|-------------|
| `pnpm run db:generate` | Generate new migration files from schema changes |
| `pnpm run db:migrations:list` | List unapplied migrations (production) |
| `pnpm run db:migrations:apply` | Apply migrations to production database |
| `pnpm run db:migrations:list:local` | List unapplied migrations (local) |
| `pnpm run db:migrations:apply:local` | Apply migrations to local database |

## 🏭 **Production Deployment Workflow**

### Option 1: Manual Migration (Recommended)
```bash
# 1. Deploy your application code first
pnpm run deploy

# 2. Apply migrations separately
pnpm run db:migrations:apply

# 3. Verify migration status
pnpm run db:migrations:list
```

### Option 2: CI/CD Pipeline
```yaml
# Example GitHub Actions workflow
- name: Apply D1 Migrations
  run: |
    npx wrangler d1 migrations apply DB
  env:
    CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
```

## 🔧 **Configuration**

Your `wrangler.jsonc` is already configured:

```json
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "wilnk-dev",
      "database_id": "07d6adc8-67cf-4cfd-8007-eb666a624be6",
      "migrations_dir": "./src/server/db/migrations"
    }
  ]
}
```

## 📁 **Migration Files**

Migrations are stored in `src/server/db/migrations/` with Drizzle's naming convention:
- `0000_violet_kitty_pryde.sql` - Initial schema
- `0001_next_migration.sql` - Next migration
- `meta/_journal.json` - Migration metadata

## ✅ **Best Practices**

### 1. **Always Test First**
```bash
# Test locally before production
pnpm run db:migrations:apply:local
```

### 2. **Check Before Applying**
```bash
# Review what will be applied
pnpm run db:migrations:list
```

### 3. **Backup Production Data**
- Ensure you have database backups before applying migrations
- Consider using D1's export functionality

### 4. **Monitor Application Health**
- Check application logs after migration
- Verify database connectivity
- Test critical application flows

## 🚨 **Troubleshooting**

### Migration Command Fails
```bash
# Check Wrangler authentication
wrangler auth whoami

# Verify database configuration
wrangler d1 list
```

### Migration Already Applied Error
```bash
# Check current migration status
pnpm run db:migrations:list

# View migration history
wrangler d1 execute DB --command "SELECT * FROM d1_migrations"
```

### Schema Mismatch
```bash
# Regenerate migrations after schema changes
pnpm run db:generate

# Check for conflicting migration files
ls -la src/server/db/migrations/
```

## 🔄 **Migration States**

- **Unapplied**: Migration file exists but hasn't been run
- **Applied**: Migration has been executed and recorded in `d1_migrations` table
- **Failed**: Migration execution failed (check logs for details)

## 🎯 **Why This Approach?**

✅ **Industry Standard**: Recommended by Drizzle team and Cloudflare  
✅ **Reliable**: Uses Wrangler's battle-tested migration system  
✅ **Trackable**: Automatic migration state tracking  
✅ **Safe**: No runtime file system dependencies  
✅ **Flexible**: Supports local and production environments  

This approach eliminates the complexity of programmatic migrations in Workers and follows established best practices for D1 database management.
