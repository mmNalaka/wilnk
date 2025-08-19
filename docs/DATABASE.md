# Link-in-Bio Database Schema

This document describes the database schema design for the Link-in-Bio service, compatible with Puck editor and including comprehensive analytics.

## Core Entities

### 1. Users (`users`)
- **Purpose**: Store user account information
- **Key Features**:
  - Email-based authentication
  - Optional username and display name
  - Plan-based access control (free, pro, enterprise)
  - Avatar support

### 2. Pages (`pages`)
- **Purpose**: Store Link-in-Bio pages with Puck editor data
- **Key Features**:
  - **Puck Compatibility**: `puckData` field stores complete Puck JSON structure
  - SEO optimization (meta title, description, favicon)
  - Privacy controls (public/private, password protection)
  - Theme integration
  - Analytics toggle
  - Status management (draft, published, archived)

### 3. Themes (`themes`)
- **Purpose**: Reusable design templates
- **Key Features**:
  - System themes (built-in) and user-created themes
  - JSON configuration for colors, fonts, spacing
  - Public/private sharing
  - Preview images

### 4. Block Templates (`blockTemplates`)
- **Purpose**: Reusable component definitions for Puck editor
- **Key Features**:
  - System blocks and user-created blocks
  - Puck-compatible configuration
  - Category organization
  - Usage tracking
  - Public/private sharing

## Analytics System

### 5. Page Analytics (`pageAnalytics`)
- **Purpose**: Aggregated daily statistics per page
- **Metrics**:
  - Views and unique views
  - Total clicks
  - Geographic data (countries, cities)
  - Device and browser statistics
  - Top referrers

### 6. Click Events (`clickEvents`)
- **Purpose**: Individual click tracking
- **Features**:
  - Block-level click tracking
  - Anonymized visitor identification
  - Geographic and device data
  - Referrer tracking

### 7. Page Views (`pageViews`)
- **Purpose**: Individual page view tracking
- **Features**:
  - Session tracking
  - UTM parameter capture
  - Time on page measurement
  - Geographic and device data

### 8. Subscriptions (`subscriptions`)
- **Purpose**: User plan management
- **Features**:
  - Stripe integration ready
  - Billing period tracking
  - Status management

## Puck Editor Compatibility

The schema is designed to be fully compatible with Puck editor:

1. **Page Data Storage**: The `puckData` field in the `pages` table stores the complete Puck JSON structure:
   ```json
   {
     "content": [
       {
         "type": "HeadingBlock",
         "props": {
           "id": "HeadingBlock-1234",
           "title": "Hello, world"
         }
       }
     ],
     "root": {},
     "zones": {}
   }
   ```

2. **Block Templates**: The `blockTemplates` table stores Puck component configurations:
   ```json
   {
     "fields": {
       "title": { "type": "text" },
       "url": { "type": "url" }
     },
     "defaultProps": {
       "title": "Click me"
     }
   }
   ```

## Scalability Features

1. **Indexes**: Strategic indexes on frequently queried fields
2. **JSON Storage**: Flexible JSON fields for configuration data
3. **Cascading Deletes**: Proper foreign key relationships
4. **Analytics Aggregation**: Daily aggregation reduces query load
5. **Anonymized Tracking**: Privacy-compliant analytics

## Extensibility

1. **Custom Blocks**: Users can create and share custom block templates
2. **Custom Themes**: Full theme customization and sharing
3. **Flexible Configuration**: JSON fields allow for future feature additions
4. **Plan-based Features**: Easy to add premium features based on user plans

## Privacy & Security

1. **Anonymized Analytics**: Visitor tracking uses anonymous IDs
2. **Password Protection**: Pages can be password-protected
3. **Public/Private Controls**: Granular visibility controls
4. **Data Ownership**: Users own their data completely

## Usage Examples

### Creating a Page with Puck Data
```typescript
const pageData = {
  id: "page-123",
  userId: "user-456",
  title: "My Link Page",
  slug: "my-links",
  puckData: {
    content: [
      {
        type: "LinkBlock",
        props: {
          id: "link-1",
          title: "My Website",
          url: "https://example.com",
          style: "button"
        }
      }
    ],
    root: {
      title: "Welcome to my page"
    }
  },
  status: "published",
  analyticsEnabled: true
};
```

### Tracking Analytics
```typescript
// Page view
await db.insert(pageViews).values({
  pageId: "page-123",
  visitorId: "visitor-789",
  country: "US",
  deviceType: "mobile",
  viewedAt: new Date()
});

// Click event
await db.insert(clickEvents).values({
  pageId: "page-123",
  blockId: "link-1",
  blockType: "LinkBlock",
  url: "https://example.com",
  visitorId: "visitor-789",
  clickedAt: new Date()
});
```
