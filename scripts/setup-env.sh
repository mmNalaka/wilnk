#!/bin/bash

# Setup script for staging and production environments

echo "🚀 Setting up Wilnk environments..."

# Check if we have migrations directory
if [ ! -d "./src/server/db/migrations" ]; then
    echo "❌ Migrations directory not found at ./src/server/db/migrations"
    exit 1
fi

# Setup staging environment
echo "📦 Setting up staging database..."
npx wrangler d1 migrations apply wilnk-staging --remote --config wrangler.jsonc

if [ $? -eq 0 ]; then
    echo "✅ Staging database setup complete!"
else
    echo "❌ Staging database setup failed!"
    exit 1
fi

# Setup production environment
echo "📦 Setting up production database..."
npx wrangler d1 migrations apply wilnk-production --remote --config wrangler.production.jsonc

if [ $? -eq 0 ]; then
    echo "✅ Production database setup complete!"
else
    echo "❌ Production database setup failed!"
    exit 1
fi

echo ""
echo "🎉 Environment setup complete!"
echo ""
echo "Next steps:"
echo "1. Set up git integration in Cloudflare Workers dashboard"
echo "2. Configure staging worker to deploy from 'staging' branch"
echo "3. Configure production worker to deploy from 'main' branch"
echo ""
echo "For detailed instructions, see DEPLOYMENT.md"