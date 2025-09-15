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

## Git-Based Deployment

Both environments use Cloudflare's git-based deployment system:

### Deploy to Staging
```bash
# Push to staging branch to trigger staging deployment
git push origin staging
```

### Deploy to Production
```bash
# Push to main branch to trigger production deployment
git push origin main
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

## CI/CD Setup in Cloudflare

### Automatic Deployments
- **Staging**: Automatically deploys on push to `staging` branch via Cloudflare git integration
- **Production**: Automatically deploys on push to `main` branch via Cloudflare git integration

### Setting up Git Integration

1. **For Staging Worker (`wilnk-staging`)**:
   - Go to Cloudflare Dashboard → Workers & Pages
   - Select or create `wilnk-staging` worker
   - Go to Settings → Deployments
   - Connect to GitHub repository
   - Set branch to `staging`
   - Set build configuration:
     - Build command: `npm run build` (or equivalent)
     - Output directory: `.open-next`

2. **For Production Worker (`wilnk-production`)**:
   - Go to Cloudflare Dashboard → Workers & Pages  
   - Select or create `wilnk-production` worker
   - Go to Settings → Deployments
   - Connect to GitHub repository
   - Set branch to `main`
   - Set build configuration:
     - Build command: `npm run build` (or equivalent)
     - Output directory: `.open-next`

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