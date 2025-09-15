# Deployment Guide

This project uses a two-environment setup with Cloudflare Workers and D1 databases:

## Environments

### 🟡 Staging Environment
- **Branch**: `staging`
- **Worker**: `wilnk-staging` 
- **Database**: `wilnk-staging`
- **URL**: https://wilnk-staging.nalaka-manathunga.workers.dev
- **Config**: `wrangler.jsonc` (main config)

### 🟢 Production Environment
- **Branch**: `main`
- **Worker**: `wilnk-production`
- **Database**: `wilnk-production` 
- **URL**: https://wilnk-production.nalaka-manathunga.workers.dev
- **Config**: `wrangler.production.jsonc`

## Manual Deployment

### Deploy to Staging
```bash
pnpm run deploy:staging
```

### Deploy to Production
```bash
pnpm run deploy:production
```

## Database Migrations

### Apply migrations to Staging
```bash
pnpm run migration:apply:staging
```

### Apply migrations to Production
```bash
pnpm run migration:apply:production
```

### Local Development
```bash
pnpm run migration:apply:local
```

## CI/CD Pipeline

### Automatic Deployments
- **Staging**: Automatically deploys on push to `staging` branch
- **Production**: Automatically deploys on push to `main` branch (with approval requirement)

### Required GitHub Secrets
Set up the following secret in your GitHub repository settings:

1. Go to repository Settings → Secrets and variables → Actions
2. Add: `CLOUDFLARE_API_TOKEN`
   - Get your token from: https://dash.cloudflare.com/profile/api-tokens
   - Use "Edit Cloudflare Workers" template or custom with:
     - Permissions: `Zone:Read`, `Account:Read`, `User:Read`, `Workers Scripts:Edit`, `D1:Edit`
     - Account Resources: Include your account
     - Zone Resources: Include your zones (if any)

### Production Environment Protection
The production workflow includes an environment protection rule. To set this up:

1. Go to repository Settings → Environments
2. Create "production" environment
3. Add protection rules (require reviewers, etc.)

## Development Workflow

1. **Feature Development**: Work on feature branches, merge to `staging`
2. **Testing**: Test changes on staging environment
3. **Release**: Create PR from `staging` to `main` for production deployment

## Environment Variables

Each environment has its own configuration:

- `NODE_ENV`: staging/production
- `CORS_ORIGIN`: "*" 
- `NEXT_PUBLIC_SERVER_URL`: Environment-specific worker URL
- `BETTER_AUTH_URL`: Environment-specific worker URL
- `NEXT_PUBLIC_DISABLE_SIGNUP`: false for staging, true for production

## Database Setup

Both environments have separate D1 databases:
- Staging: `wilnk-staging` (eef2f4fa-1c20-4c68-83f5-b21943ff0480)
- Production: `wilnk-production` (d304877f-0bd0-40b1-b299-d531406da244)

## Local Development

For local development, use the staging configuration with local database:
```bash
pnpm run db:local
pnpm run dev
```