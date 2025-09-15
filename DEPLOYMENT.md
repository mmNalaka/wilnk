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

### Automated Release Pull Requests

GitHub Actions will automatically:
- **Create Release PRs**: When you push to `staging`, a PR from `staging` → `main` is created/updated
- **Run CI Checks**: Lint, type check, and format validation on all PRs
- **Deployment Notifications**: Comments on merged release PRs with deployment status

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

### 🔄 Automated Release Process
1. **Feature Development**: Work on feature branches
2. **Stage Changes**: Merge features to `staging` branch
   - Triggers automatic staging deployment via Cloudflare
   - Creates/updates release PR (`staging` → `main`)
3. **Testing**: Test changes on staging environment
4. **Release**: Review and merge the auto-created release PR
   - Triggers production deployment
   - Adds deployment notification to the PR

### 🛠️ Manual Commands
- **Push to Staging**: `git push origin staging`
- **Create Release PR**: Automatic (no manual action needed)
- **Deploy to Production**: Merge the release PR

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

## CI/CD Workflows

### ✅ CI Checks (`.github/workflows/ci.yml`)
Runs on all pull requests and pushes:
- **Lint**: `pnpm run lint`
- **Type Check**: `pnpm run check-types`
- **Format Check**: `pnpm run format:check`

### 🔄 Release PR Creation (`.github/workflows/release-pr.yml`)
- Triggers on push to `staging` branch
- Creates or updates PR from `staging` to `main`
- Includes helpful checklist and environment links
- Auto-assigns the PR to you

### 📢 Deployment Notifications (`.github/workflows/deployment-status.yml`)
- Triggers when release PR is merged to `main`
- Adds deployment status comment to the merged PR
- Creates GitHub deployment record
