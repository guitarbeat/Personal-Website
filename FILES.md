# File Listing: Notion Database Migration

## Document Information

- **Project**: Personal Portfolio Website
- **Feature**: Migrate from Google Sheets to Notion as Database
- **Version**: 1.0
- **Date**: 2025-01-XX

## File Categories

Files are organized by category: New Files, Modified Files, Configuration Files, Test Files, and Documentation Files.

---

## 1. New Files (To Be Created)

### 1.1 Backend API Files

#### Serverless Functions
- **Path**: `/workspace/api/notion/about.js`
- **Description**: GET endpoint for About section data
- **Status**: To be created

- **Path**: `/workspace/api/notion/projects.js`
- **Description**: GET endpoint for Projects section data
- **Status**: To be created

- **Path**: `/workspace/api/notion/work.js`
- **Description**: GET endpoint for Work section data
- **Status**: To be created

- **Path**: `/workspace/api/notion/health.js`
- **Description**: Health check endpoint for API monitoring
- **Status**: To be created

#### Backend Utilities
- **Path**: `/workspace/api/utils/notionClient.js`
- **Description**: Notion API client wrapper with authentication and query methods
- **Status**: To be created

- **Path**: `/workspace/api/utils/transformers.js`
- **Description**: Data transformation functions (transformAboutData, transformProjectsData, transformWorkData)
- **Status**: To be created

- **Path**: `/workspace/api/utils/cache.js`
- **Description**: Server-side caching utility with TTL support
- **Status**: To be created

### 1.2 Frontend Files

#### React Hooks
- **Path**: `/workspace/src/hooks/useNotionData.js`
- **Description**: Custom React hook for fetching Notion data with caching and error handling
- **Status**: To be created

#### Frontend Utilities
- **Path**: `/workspace/src/utils/notionUtils.js`
- **Description**: Client-side data transformation utilities matching backend transformers
- **Status**: To be created

---

## 2. Modified Files (Existing Files to Update)

### 2.1 Core Application Files

- **Path**: `/workspace/src/App.js`
- **Current State**: Uses `GoogleSheetsProvider`
- **Changes Required**: 
  - Remove `GoogleSheetsProvider` import and wrapper
  - Remove `GOOGLE_SHEETS_CONFIG` import
  - Update imports if needed
- **Status**: Existing file, needs modification

- **Path**: `/workspace/src/components/Core/constants.js`
- **Current State**: Contains `GOOGLE_SHEETS_CONFIG`
- **Changes Required**:
  - Remove `GOOGLE_SHEETS_CONFIG`
  - Add `NOTION_CONFIG` object with API endpoints and cache duration
- **Status**: Existing file, needs modification

### 2.2 Content Components

- **Path**: `/workspace/src/components/content/About/About.js`
- **Current State**: Uses `withGoogleSheets` HOC and `processAboutData`
- **Changes Required**:
  - Remove `withGoogleSheets` HOC import and usage
  - Remove `processAboutData` import
  - Add `useNotionData` hook import
  - Replace data source with `useNotionData('about')`
  - Update data processing to use `transformAboutData` from `notionUtils`
  - Add loading and error state handling
- **Status**: Existing file, needs modification

- **Path**: `/workspace/src/components/content/Projects/Projects.js`
- **Current State**: Uses `withGoogleSheets` HOC and `processProjectsData`
- **Changes Required**:
  - Remove `withGoogleSheets` HOC import and usage
  - Remove `processProjectsData` import
  - Add `useNotionData` hook import
  - Replace data source with `useNotionData('projects')`
  - Update data processing to use `transformProjectsData` from `notionUtils`
  - Verify image URL handling
  - Add loading and error state handling
- **Status**: Existing file, needs modification

- **Path**: `/workspace/src/components/content/Work/Work.js`
- **Current State**: Uses `withGoogleSheets` HOC and `processWorkData`
- **Changes Required**:
  - Remove `withGoogleSheets` HOC import and usage
  - Remove `processWorkData` import
  - Add `useNotionData` hook import
  - Replace data source with `useNotionData('work')`
  - Update data processing to use `transformWorkData` from `notionUtils`
  - Verify date formatting
  - Add loading and error state handling
- **Status**: Existing file, needs modification

### 2.3 Utility Files

- **Path**: `/workspace/src/utils/googleSheetsUtils.js`
- **Current State**: Contains `processAboutData`, `processProjectsData`, `processWorkData`
- **Changes Required**:
  - File can be deprecated/removed after migration
  - Or kept for reference during transition period
- **Status**: Existing file, can be removed after migration

---

## 3. Configuration Files

### 3.1 Environment Variables

- **Path**: `/workspace/.env`
- **Current State**: Contains Google Sheets configuration
- **Changes Required**:
  - Remove: `REACT_APP_GOOGLE_SHEETS_API_KEY`
  - Remove: `REACT_APP_GOOGLE_SHEETS_DOC_ID`
  - Add: `REACT_APP_API_BASE_URL` (frontend)
  - Note: Backend environment variables configured in hosting platform (Vercel/Netlify)
- **Status**: Existing file, needs modification

- **Path**: `/workspace/.env.example`
- **Current State**: Contains example Google Sheets variables
- **Changes Required**:
  - Remove Google Sheets example variables
  - Add Notion API example variables with placeholders
  - Document new variables
- **Status**: Existing file, needs modification

### 3.2 Package Configuration

- **Path**: `/workspace/package.json`
- **Current State**: Contains `react-db-google-sheets` dependency
- **Changes Required**:
  - Remove `react-db-google-sheets` from dependencies
  - Add `@notionhq/client` to dependencies (backend only, but can be in devDependencies for local testing)
- **Status**: Existing file, needs modification

### 3.3 Deployment Configuration

- **Path**: `/workspace/vercel.json` (if exists) or create new
- **Description**: Vercel configuration for serverless functions
- **Changes Required**: Configure API routes if not auto-detected
- **Status**: May need to be created or modified

- **Path**: `/workspace/netlify.toml` (if exists) or create new
- **Description**: Netlify configuration for serverless functions (if using Netlify)
- **Changes Required**: Configure API routes
- **Status**: May need to be created or modified

---

## 4. Test Files

### 4.1 Backend Tests (To Be Created)

- **Path**: `/workspace/api/utils/__tests__/transformers.test.js`
- **Description**: Unit tests for data transformation functions
- **Status**: To be created

- **Path**: `/workspace/api/utils/__tests__/notionClient.test.js`
- **Description**: Unit tests for Notion API client
- **Status**: To be created

- **Path**: `/workspace/api/utils/__tests__/cache.test.js`
- **Description**: Unit tests for caching utility
- **Status**: To be created

- **Path**: `/workspace/api/notion/__tests__/about.test.js`
- **Description**: Integration tests for About endpoint
- **Status**: To be created

- **Path**: `/workspace/api/notion/__tests__/projects.test.js`
- **Description**: Integration tests for Projects endpoint
- **Status**: To be created

- **Path**: `/workspace/api/notion/__tests__/work.test.js`
- **Description**: Integration tests for Work endpoint
- **Status**: To be created

### 4.2 Frontend Tests (To Be Modified)

- **Path**: `/workspace/src/hooks/__tests__/useNotionData.test.js`
- **Description**: Unit tests for useNotionData hook
- **Status**: To be created

- **Path**: `/workspace/src/utils/__tests__/notionUtils.test.js`
- **Description**: Unit tests for Notion utility functions
- **Status**: To be created

- **Path**: `/workspace/src/components/content/About/About.test.js`
- **Current State**: Tests with Google Sheets mocks
- **Changes Required**: Update to mock Notion API calls
- **Status**: Existing file, needs modification

- **Path**: `/workspace/src/components/content/Projects/Projects.test.js`
- **Current State**: Tests with Google Sheets mocks
- **Changes Required**: Update to mock Notion API calls
- **Status**: Existing file, needs modification

- **Path**: `/workspace/src/components/content/Work/Work.test.js`
- **Current State**: Tests with Google Sheets mocks
- **Changes Required**: Update to mock Notion API calls
- **Status**: Existing file, needs modification

---

## 5. Documentation Files

### 5.1 Specification Documents (Created)

- **Path**: `/workspace/REQUIREMENTS.md`
- **Description**: Requirements specification document
- **Status**: ✅ Created

- **Path**: `/workspace/DESIGN.md`
- **Description**: Design specification document
- **Status**: ✅ Created

- **Path**: `/workspace/TASKS.md`
- **Description**: Task breakdown document
- **Status**: ✅ Created

- **Path**: `/workspace/FILES.md`
- **Description**: File listing document (this file)
- **Status**: ✅ Created

### 5.2 Migration Plan (Created)

- **Path**: `/workspace/NOTION_DATABASE_MIGRATION_PLAN.md`
- **Description**: Original migration plan document
- **Status**: ✅ Created (can be archived after spec documents are finalized)

### 5.3 Project Documentation (To Be Updated)

- **Path**: `/workspace/README.md`
- **Current State**: Documents Google Sheets integration
- **Changes Required**:
  - Update data source information
  - Add Notion setup instructions
  - Update environment variable documentation
  - Add API endpoint documentation
  - Update development setup instructions
- **Status**: Existing file, needs modification

### 5.4 Additional Documentation (To Be Created)

- **Path**: `/workspace/docs/NOTION_SETUP.md` (optional)
- **Description**: Detailed Notion database setup guide
- **Status**: Optional, can be created

- **Path**: `/workspace/docs/API_DOCUMENTATION.md` (optional)
- **Description**: API endpoint documentation
- **Status**: Optional, can be created

---

## 6. Directory Structure Summary

### New Directories to Create

```
/workspace/
├── api/                          # NEW: Backend API directory
│   ├── notion/                  # NEW: Notion API endpoints
│   │   ├── about.js
│   │   ├── projects.js
│   │   ├── work.js
│   │   └── health.js
│   └── utils/                   # NEW: Backend utilities
│       ├── notionClient.js
│       ├── transformers.js
│       └── cache.js
```

### Modified Directories

```
/workspace/src/
├── components/
│   ├── Core/
│   │   └── constants.js         # MODIFY
│   └── content/
│       ├── About/
│       │   └── About.js         # MODIFY
│       ├── Projects/
│       │   └── Projects.js      # MODIFY
│       └── Work/
│           └── Work.js          # MODIFY
├── hooks/
│   └── useNotionData.js         # NEW
└── utils/
    ├── googleSheetsUtils.js     # DEPRECATE/REMOVE
    └── notionUtils.js           # NEW
```

---

## 7. File Modification Summary

### Files to Create: 10
- Backend API: 7 files
- Frontend: 2 files
- Tests: 1 file (plus test updates)

### Files to Modify: 8
- Core: 2 files
- Components: 3 files
- Configuration: 3 files

### Files to Remove: 1
- `src/utils/googleSheetsUtils.js` (after migration complete)

### Files to Update: 5
- Documentation: 1 file (README.md)
- Tests: 4 files (3 component tests + 1 new hook test)

---

## 8. File Dependencies

### Backend Dependencies
```
api/notion/about.js
  ├── api/utils/notionClient.js
  ├── api/utils/transformers.js
  └── api/utils/cache.js

api/notion/projects.js
  ├── api/utils/notionClient.js
  ├── api/utils/transformers.js
  └── api/utils/cache.js

api/notion/work.js
  ├── api/utils/notionClient.js
  ├── api/utils/transformers.js
  └── api/utils/cache.js
```

### Frontend Dependencies
```
src/components/content/About/About.js
  ├── src/hooks/useNotionData.js
  └── src/utils/notionUtils.js

src/components/content/Projects/Projects.js
  ├── src/hooks/useNotionData.js
  └── src/utils/notionUtils.js

src/components/content/Work/Work.js
  ├── src/hooks/useNotionData.js
  └── src/utils/notionUtils.js

src/hooks/useNotionData.js
  └── src/components/Core/constants.js

src/utils/notionUtils.js
  └── (standalone utility)
```

---

## 9. Environment Variables Reference

### Backend Environment Variables (Serverless Functions)
**Location**: Configured in Vercel/Netlify dashboard (not in repository)

- `NOTION_API_KEY` - Notion integration token (secret_xxx)
- `NOTION_ABOUT_DB_ID` - About database ID (UUID format)
- `NOTION_PROJECTS_DB_ID` - Projects database ID (UUID format)
- `NOTION_WORK_DB_ID` - Work database ID (UUID format)

### Frontend Environment Variables
**Location**: `/workspace/.env` and `/workspace/.env.example`

- `REACT_APP_API_BASE_URL` - Base URL for API endpoints (e.g., `https://your-domain.com/api`)

### Removed Environment Variables
- `REACT_APP_GOOGLE_SHEETS_API_KEY` - Remove after migration
- `REACT_APP_GOOGLE_SHEETS_DOC_ID` - Remove after migration

---

## 10. Quick Reference: File Paths

### New Backend Files
```
api/notion/about.js
api/notion/projects.js
api/notion/work.js
api/notion/health.js
api/utils/notionClient.js
api/utils/transformers.js
api/utils/cache.js
```

### New Frontend Files
```
src/hooks/useNotionData.js
src/utils/notionUtils.js
```

### Modified Files
```
src/App.js
src/components/Core/constants.js
src/components/content/About/About.js
src/components/content/Projects/Projects.js
src/components/content/Work/Work.js
.env
.env.example
package.json
README.md
```

### Test Files (New)
```
api/utils/__tests__/transformers.test.js
api/utils/__tests__/notionClient.test.js
api/utils/__tests__/cache.test.js
src/hooks/__tests__/useNotionData.test.js
src/utils/__tests__/notionUtils.test.js
```

### Test Files (Modified)
```
src/components/content/About/About.test.js
src/components/content/Projects/Projects.test.js
src/components/content/Work/Work.test.js
```

---

## Notes

- All paths are relative to `/workspace/` directory
- Backend API files follow serverless function conventions (Vercel/Netlify)
- Test files should be created alongside source files
- Environment variables for backend are configured in hosting platform, not in repository
- `.env` file should be in `.gitignore` (already should be)
- Documentation files can be organized in a `docs/` directory if preferred
