# Notion Database Migration Plan

## Overview

This document outlines the plan to migrate the personal portfolio website from Google Sheets to Notion as the primary data source. Notion provides a robust API that can serve as a headless CMS/database, offering better content management capabilities, richer data types, and a more intuitive interface for content updates.

## Current State Analysis

### Current Implementation
- **Data Source**: Google Sheets via `react-db-google-sheets` library
- **Data Sections**: 
  - About (category, description)
  - Projects (title, slug, date, keyword, link, content, image)
  - Work (title, company, place, from, to, description, slug)
- **Configuration**: Environment variables for API key and spreadsheet ID
- **Components Using Data**: `About.js`, `Projects.js`, `Work.js`

### Current Dependencies
- `react-db-google-sheets` (^3.0.0)
- Google Sheets API integration

## Notion API Capabilities

### ✅ Yes, Notion Can Be Used as a Database

Notion provides a comprehensive REST API that allows:
- **Database Queries**: Query databases with filtering, sorting, and pagination
- **Rich Content Types**: Support for text, numbers, dates, select, multi-select, files, relations, and more
- **Real-time Updates**: Can be polled or integrated with webhooks (via Notion's integration)
- **Structured Data**: Better than spreadsheets for complex, relational data
- **Content Management**: Non-technical users can update content through Notion's UI

### Limitations to Consider
- **Rate Limits**: Notion API has rate limits (3 requests per second by default)
- **Authentication**: Requires OAuth or integration tokens
- **Client-side vs Server-side**: API keys should not be exposed in client-side code (security risk)
- **Caching**: Need to implement caching strategy to avoid hitting rate limits

## Migration Strategy

### Phase 1: Notion Workspace Setup

#### 1.1 Create Notion Integration
- [ ] Create a new integration at https://www.notion.so/my-integrations
- [ ] Generate an internal integration token (for server-side use)
- [ ] Note the integration ID for later use

#### 1.2 Create Notion Databases
- [ ] Create **About Database** with properties:
  - `Category` (Title/Text)
  - `Description` (Text/Rich Text)
- [ ] Create **Projects Database** with properties:
  - `Title` (Title)
  - `Slug` (Text)
  - `Date` (Date)
  - `Keyword` (Select or Multi-select)
  - `Link` (URL)
  - `Content` (Text/Rich Text)
  - `Image` (Files & media)
- [ ] Create **Work Database** with properties:
  - `Title` (Title)
  - `Company` (Text)
  - `Place` (Text)
  - `From` (Date)
  - `To` (Date)
  - `Description` (Text/Rich Text)
  - `Slug` (Text)

#### 1.3 Share Databases with Integration
- [ ] For each database, click "..." → "Connections" → Add the integration
- [ ] Grant the integration access to read the databases
- [ ] Copy the Database IDs (found in the database URL: `notion.so/{workspace}/{database-id}`)

#### 1.4 Migrate Existing Data
- [ ] Export current Google Sheets data
- [ ] Import data into corresponding Notion databases
- [ ] Verify data integrity and formatting

### Phase 2: Backend API Setup (Required for Security)

**⚠️ Critical**: Notion API keys must NOT be exposed in client-side code. We need a backend proxy.

#### 2.1 Choose Backend Solution

**Option A: Serverless Functions (Recommended)**
- Use Vercel/Netlify serverless functions
- Pros: No server management, scales automatically, free tier available
- Cons: Cold starts, vendor lock-in

**Option B: Node.js Express Server**
- Standalone Node.js server
- Pros: Full control, can add caching layer
- Cons: Requires hosting infrastructure

**Option C: Next.js API Routes**
- If migrating to Next.js
- Pros: Integrated with React, good DX
- Cons: Requires full framework migration

#### 2.2 Implement Backend API Endpoints

Create endpoints:
- `GET /api/notion/about` - Fetch about data
- `GET /api/notion/projects` - Fetch projects data
- `GET /api/notion/work` - Fetch work data
- `GET /api/notion/health` - Health check endpoint

Each endpoint should:
- Authenticate with Notion API using server-side token
- Query the appropriate Notion database
- Transform Notion data format to match current component expectations
- Implement caching (e.g., 5-15 minutes) to reduce API calls
- Handle errors gracefully
- Return data in the same format as current Google Sheets implementation

#### 2.3 Environment Variables Setup

**Backend (.env)**
```
NOTION_API_KEY=secret_xxxxxxxxxxxxx
NOTION_ABOUT_DB_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
NOTION_PROJECTS_DB_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
NOTION_WORK_DB_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

**Frontend (.env)**
```
REACT_APP_API_BASE_URL=https://your-api-domain.com/api
# Remove Google Sheets variables:
# REACT_APP_GOOGLE_SHEETS_API_KEY
# REACT_APP_GOOGLE_SHEETS_DOC_ID
```

### Phase 3: Frontend Implementation

#### 3.1 Install Dependencies

**Remove:**
```bash
npm uninstall react-db-google-sheets
```

**Add (if using Notion SDK on backend):**
```bash
# Backend only
npm install @notionhq/client
```

**Frontend (no new dependencies needed):**
- Use existing `axios` for API calls
- Or use native `fetch` API

#### 3.2 Create Notion Utilities

**File: `src/utils/notionUtils.js`**
- [ ] Create `fetchNotionData(endpoint)` function
- [ ] Create data transformation functions:
  - `transformAboutData(notionData)`
  - `transformProjectsData(notionData)`
  - `transformWorkData(notionData)`
- [ ] Handle Notion's rich text format (convert to plain text or HTML)
- [ ] Handle Notion's file format (extract URLs)
- [ ] Handle date formatting
- [ ] Implement error handling and retry logic

#### 3.3 Create Notion Data Provider/Hook

**File: `src/hooks/useNotionData.js`**
- [ ] Create custom hook `useNotionData(endpoint)`
- [ ] Implement loading state
- [ ] Implement error state
- [ ] Implement caching (localStorage or React state)
- [ ] Implement data fetching with axios/fetch
- [ ] Return `{ data, loading, error, refetch }`

**Alternative: Create Context Provider**
**File: `src/components/Core/NotionProvider.js`**
- [ ] Create `NotionProvider` component
- [ ] Fetch all data on mount
- [ ] Provide data via React Context
- [ ] Implement loading and error states

#### 3.4 Update Components

**File: `src/components/content/About/About.js`**
- [ ] Remove `withGoogleSheets` HOC
- [ ] Replace with `useNotionData('about')` hook
- [ ] Update data processing to use `transformAboutData`
- [ ] Test component rendering

**File: `src/components/content/Projects/Projects.js`**
- [ ] Remove `withGoogleSheets` HOC
- [ ] Replace with `useNotionData('projects')` hook
- [ ] Update data processing to use `transformProjectsData`
- [ ] Handle image URLs from Notion
- [ ] Test component rendering

**File: `src/components/content/Work/Work.js`**
- [ ] Remove `withGoogleSheets` HOC
- [ ] Replace with `useNotionData('work')` hook
- [ ] Update data processing to use `transformWorkData`
- [ ] Test component rendering

#### 3.5 Update App.js

**File: `src/App.js`**
- [ ] Remove `GoogleSheetsProvider` import and usage
- [ ] Add `NotionProvider` if using Context approach
- [ ] Or ensure components can access API endpoints
- [ ] Update error boundaries if needed

#### 3.6 Update Configuration

**File: `src/components/Core/constants.js`**
- [ ] Remove `GOOGLE_SHEETS_CONFIG`
- [ ] Add `NOTION_CONFIG`:
  ```javascript
  export const NOTION_CONFIG = {
    apiBaseUrl: process.env.REACT_APP_API_BASE_URL || '/api',
    endpoints: {
      about: '/notion/about',
      projects: '/notion/projects',
      work: '/notion/work',
    },
    cacheDuration: 15 * 60 * 1000, // 15 minutes
  };
  ```

### Phase 4: Data Transformation Details

#### 4.1 Notion API Response Format

Notion returns data in a specific format:
```javascript
{
  results: [
    {
      id: "page-id",
      properties: {
        "Title": { title: [{ plain_text: "Example" }] },
        "Description": { rich_text: [{ plain_text: "Text" }] },
        "Date": { date: { start: "2024-01-01" } },
        "Image": { files: [{ file: { url: "https://..." } }] }
      }
    }
  ]
}
```

#### 4.2 Transformation Functions

Each transformation function needs to:
- Map Notion property names to current data structure
- Extract text from rich text arrays
- Convert dates to required format
- Extract file URLs
- Handle select/multi-select values
- Handle empty/null values

### Phase 5: Testing & Validation

#### 5.1 Unit Tests
- [ ] Test `notionUtils.js` transformation functions
- [ ] Test `useNotionData` hook
- [ ] Update component tests to mock Notion API calls
- [ ] Test error handling

#### 5.2 Integration Tests
- [ ] Test backend API endpoints
- [ ] Test end-to-end data flow
- [ ] Test caching behavior
- [ ] Test error scenarios

#### 5.3 Manual Testing
- [ ] Verify all three sections render correctly
- [ ] Verify data matches Notion databases
- [ ] Test loading states
- [ ] Test error states
- [ ] Test on different devices/browsers
- [ ] Verify performance (no unnecessary re-renders)

### Phase 6: Performance Optimization

#### 6.1 Caching Strategy
- [ ] Implement client-side caching (localStorage or memory)
- [ ] Implement server-side caching (Redis or in-memory)
- [ ] Set appropriate cache TTL (15 minutes recommended)
- [ ] Implement cache invalidation strategy

#### 6.2 Request Optimization
- [ ] Batch requests if possible
- [ ] Implement request debouncing
- [ ] Add loading skeletons instead of blank screens
- [ ] Implement pagination if datasets grow large

#### 6.3 Error Handling
- [ ] Graceful degradation (show cached data if API fails)
- [ ] User-friendly error messages
- [ ] Retry logic with exponential backoff
- [ ] Logging for debugging

### Phase 7: Documentation & Deployment

#### 7.1 Update Documentation
- [ ] Update README.md with Notion setup instructions
- [ ] Document environment variables
- [ ] Document Notion database structure
- [ ] Create migration guide for future reference
- [ ] Update `.env.example` file

#### 7.2 Deployment Checklist
- [ ] Set up backend API (Vercel/Netlify functions or server)
- [ ] Configure environment variables in hosting platform
- [ ] Test API endpoints in production
- [ ] Update frontend environment variables
- [ ] Deploy frontend
- [ ] Verify production deployment
- [ ] Monitor API usage and rate limits

## Implementation Recommendations

### Recommended Approach: Serverless Functions

For this React app, I recommend using **Vercel Serverless Functions** (or Netlify Functions):

1. **Create `api/` directory** in project root (or separate repo)
2. **Create API routes**:
   - `api/notion/about.js`
   - `api/notion/projects.js`
   - `api/notion/work.js`
3. **Deploy to Vercel** alongside frontend
4. **Use environment variables** for Notion credentials

### Alternative: Keep It Simple (Development Only)

If this is a personal project and security is less critical during development:
- Could use a public Notion page with public API (not recommended for production)
- Or use a proxy service like Pipedream/Zapier (adds complexity)

## Migration Timeline Estimate

- **Phase 1** (Notion Setup): 1-2 hours
- **Phase 2** (Backend API): 4-6 hours
- **Phase 3** (Frontend Implementation): 4-6 hours
- **Phase 4** (Data Transformation): 2-3 hours
- **Phase 5** (Testing): 2-3 hours
- **Phase 6** (Optimization): 2-3 hours
- **Phase 7** (Documentation): 1-2 hours

**Total Estimate**: 16-25 hours

## Risks & Mitigation

### Risk 1: Notion API Rate Limits
- **Mitigation**: Implement aggressive caching, batch requests

### Risk 2: Data Format Mismatches
- **Mitigation**: Comprehensive transformation functions, thorough testing

### Risk 3: Backend Complexity
- **Mitigation**: Use serverless functions to minimize infrastructure

### Risk 4: Breaking Changes
- **Mitigation**: Implement feature flag to toggle between Google Sheets and Notion during migration

## Rollback Plan

1. Keep Google Sheets integration code commented/feature-flagged
2. Maintain environment variable support for both systems
3. Can quickly revert by switching environment variables
4. Keep Google Sheets data synchronized during transition period

## Next Steps

1. Review and approve this migration plan
2. Set up Notion workspace and databases
3. Choose backend solution (recommend Vercel serverless functions)
4. Begin Phase 2 implementation
5. Test thoroughly before removing Google Sheets integration

## Resources

- [Notion API Documentation](https://developers.notion.com/)
- [Notion API Reference](https://developers.notion.com/reference)
- [Notion SDK for JavaScript](https://github.com/makenotion/notion-sdk-js)
- [Vercel Serverless Functions](https://vercel.com/docs/functions)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
