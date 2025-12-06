# Design Specification: Notion Database Migration

## Document Information

- **Project**: Personal Portfolio Website
- **Feature**: Migrate from Google Sheets to Notion as Database
- **Version**: 1.0
- **Date**: 2025-01-XX
- **Status**: Draft

## 1. Architecture Overview

### 1.1 System Architecture

```
┌─────────────────┐
│   React App     │
│   (Frontend)    │
└────────┬────────┘
         │ HTTP Requests
         │ (GET /api/notion/*)
         ▼
┌─────────────────┐
│  Serverless API │
│   (Backend)     │
│  (Vercel/Netlify│
└────────┬────────┘
         │ Notion API
         │ (Authenticated)
         ▼
┌─────────────────┐
│  Notion API     │
│  (External)     │
└─────────────────┘
```

### 1.2 Data Flow

```
Notion Database
    │
    │ (Query via API)
    ▼
Serverless Function
    │
    │ (Transform & Cache)
    ▼
API Response (JSON)
    │
    │ (HTTP GET)
    ▼
React Component
    │
    │ (Render)
    ▼
User Interface
```

## 2. Component Design

### 2.1 Backend Architecture

#### 2.1.1 Serverless Function Structure

**Directory Structure:**
```
api/
├── notion/
│   ├── about.js       # About data endpoint
│   ├── projects.js    # Projects data endpoint
│   ├── work.js        # Work data endpoint
│   └── health.js      # Health check endpoint
└── utils/
    ├── notionClient.js    # Notion API client wrapper
    ├── transformers.js    # Data transformation functions
    └── cache.js           # Caching utilities
```

#### 2.1.2 Notion API Client

**File: `api/utils/notionClient.js`**

```javascript
/**
 * * Notion API client wrapper
 * * Handles authentication and provides query methods
 */
class NotionClient {
  constructor(apiKey) {
    this.client = new Client({ auth: apiKey });
  }

  /**
   * * Queries a Notion database
   * @param {string} databaseId - Notion database ID
   * @param {object} options - Query options (filter, sort, etc.)
   * @returns {Promise<object>} Notion API response
   */
  async queryDatabase(databaseId, options = {}) {
    // Implementation
  }
}
```

**Responsibilities:**
- Initialize Notion SDK client
- Provide database query methods
- Handle authentication
- Error handling and retry logic

#### 2.1.3 Data Transformers

**File: `api/utils/transformers.js`**

```javascript
/**
 * * Transforms Notion API response to application format
 */
export const transformAboutData = (notionResponse) => {
  // Transform logic
};

export const transformProjectsData = (notionResponse) => {
  // Transform logic
};

export const transformWorkData = (notionResponse) => {
  // Transform logic
};
```

**Transformation Logic:**
- Extract properties from Notion page objects
- Convert rich text arrays to plain text
- Extract file URLs from file properties
- Format dates appropriately
- Handle select/multi-select values
- Map Notion property names to application field names

#### 2.1.4 Caching Layer

**File: `api/utils/cache.js`**

```javascript
/**
 * * In-memory cache for Notion API responses
 * * Prevents rate limit violations
 */
class Cache {
  constructor(ttl = 15 * 60 * 1000) {
    this.cache = new Map();
    this.ttl = ttl;
  }

  get(key) { /* ... */ }
  set(key, value) { /* ... */ }
  clear() { /* ... */ }
}
```

**Caching Strategy:**
- In-memory cache (Map) for serverless functions
- TTL: 15 minutes (configurable)
- Key: endpoint name + optional query params
- Cache invalidation on errors

#### 2.1.5 API Endpoints

**File: `api/notion/about.js`**

```javascript
/**
 * * GET /api/notion/about
 * * Returns about section data from Notion
 */
export default async function handler(req, res) {
  // 1. Check cache
  // 2. Query Notion API
  // 3. Transform data
  // 4. Cache response
  // 5. Return JSON
}
```

**Endpoint Pattern:**
- All endpoints follow same pattern
- GET method only
- JSON responses
- Error handling with appropriate status codes
- CORS headers for frontend access

### 2.2 Frontend Architecture

#### 2.2.1 Data Fetching Hook

**File: `src/hooks/useNotionData.js`**

```javascript
/**
 * * Custom hook for fetching Notion data
 * * Provides loading, error, and data states
 * * Implements client-side caching
 */
export const useNotionData = (endpoint) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch logic with caching
  // Return { data, loading, error, refetch }
};
```

**Hook Features:**
- Loading state management
- Error state management
- Client-side caching (localStorage)
- Refetch capability
- Automatic cache expiration

#### 2.2.2 Data Transformation Utilities

**File: `src/utils/notionUtils.js`**

```javascript
/**
 * * Client-side data transformation utilities
 * * Transforms API responses to component format
 */
export const transformAboutData = (apiData) => {
  // Transform logic
};

export const transformProjectsData = (apiData) => {
  // Transform logic
};

export const transformWorkData = (apiData) => {
  // Transform logic
};
```

**Transformation Functions:**
- Match backend transformation logic
- Ensure consistent data format
- Handle edge cases
- Type conversion where needed

#### 2.2.3 Configuration

**File: `src/components/Core/constants.js`**

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

#### 2.2.4 Component Updates

**Component Pattern:**
```javascript
// Before (Google Sheets)
export default withGoogleSheets("projects")(Projects);

// After (Notion)
const Projects = () => {
  const { data, loading, error } = useNotionData('projects');
  const processedData = useMemo(() => 
    transformProjectsData(data), [data]
  );
  
  // Render logic
};
```

## 3. Data Models

### 3.1 Notion Database Schemas

#### 3.1.1 About Database Schema

| Property Name | Notion Type | Description | Required |
|--------------|-------------|-------------|----------|
| Category | Title | Category name | Yes |
| Description | Rich Text | Category description | Yes |

#### 3.1.2 Projects Database Schema

| Property Name | Notion Type | Description | Required |
|--------------|-------------|-------------|----------|
| Title | Title | Project title | Yes |
| Slug | Text | URL slug | Yes |
| Date | Date | Project date | Yes |
| Keyword | Select/Multi-select | Project tags | No |
| Link | URL | Project link | No |
| Content | Rich Text | Project description | Yes |
| Image | Files & Media | Project image | No |

#### 3.1.3 Work Database Schema

| Property Name | Notion Type | Description | Required |
|--------------|-------------|-------------|----------|
| Title | Title | Job title | Yes |
| Company | Text | Company name | Yes |
| Place | Text | Location | No |
| From | Date | Start date | Yes |
| To | Date | End date | No |
| Description | Rich Text | Job description | Yes |
| Slug | Text | URL slug | Yes |

### 3.2 Application Data Models

#### 3.2.1 About Data Model

```javascript
{
  category: string,
  description: string
}[]
```

#### 3.2.2 Projects Data Model

```javascript
{
  title: string,
  slug: string,
  date: string,
  keyword: string | string[],
  link: string | null,
  content: string,
  image: string | null
}[]
```

#### 3.2.3 Work Data Model

```javascript
{
  title: string,
  company: string,
  place: string | null,
  from: string,
  to: string | null,
  description: string,
  slug: string
}[]
```

## 4. API Design

### 4.1 Endpoint Specifications

#### GET /api/notion/about

**Request:**
- Method: GET
- Headers: None required
- Query Parameters: None

**Response:**
```json
{
  "data": [
    {
      "category": "string",
      "description": "string"
    }
  ],
  "cached": boolean,
  "timestamp": "ISO 8601 string"
}
```

**Status Codes:**
- 200: Success
- 500: Server error
- 503: Service unavailable (Notion API error)

#### GET /api/notion/projects

**Request:**
- Method: GET
- Headers: None required
- Query Parameters: None

**Response:**
```json
{
  "data": [
    {
      "title": "string",
      "slug": "string",
      "date": "YYYY-MM-DD",
      "keyword": "string | string[]",
      "link": "string | null",
      "content": "string",
      "image": "string | null"
    }
  ],
  "cached": boolean,
  "timestamp": "ISO 8601 string"
}
```

**Status Codes:**
- 200: Success
- 500: Server error
- 503: Service unavailable

#### GET /api/notion/work

**Request:**
- Method: GET
- Headers: None required
- Query Parameters: None

**Response:**
```json
{
  "data": [
    {
      "title": "string",
      "company": "string",
      "place": "string | null",
      "from": "YYYY-MM-DD",
      "to": "YYYY-MM-DD | null",
      "description": "string",
      "slug": "string"
    }
  ],
  "cached": boolean,
  "timestamp": "ISO 8601 string"
}
```

**Status Codes:**
- 200: Success
- 500: Server error
- 503: Service unavailable

#### GET /api/notion/health

**Request:**
- Method: GET
- Headers: None required
- Query Parameters: None

**Response:**
```json
{
  "status": "healthy | unhealthy",
  "notion": "connected | disconnected",
  "timestamp": "ISO 8601 string"
}
```

**Status Codes:**
- 200: Healthy
- 503: Unhealthy

### 4.2 Error Response Format

```json
{
  "error": {
    "message": "string",
    "code": "string",
    "timestamp": "ISO 8601 string"
  }
}
```

## 5. Data Transformation Design

### 5.1 Notion API Response Format

```javascript
{
  results: [
    {
      id: "page-id",
      properties: {
        "Property Name": {
          type: "property_type",
          // Property-specific structure
        }
      }
    }
  ]
}
```

### 5.2 Transformation Rules

#### 5.2.1 Title Property
```javascript
// Notion: { title: [{ plain_text: "Text" }] }
// Transform: Extract plain_text from first element
property.title[0]?.plain_text || ""
```

#### 5.2.2 Rich Text Property
```javascript
// Notion: { rich_text: [{ plain_text: "Text" }] }
// Transform: Join all plain_text values
property.rich_text.map(t => t.plain_text).join("")
```

#### 5.2.3 Date Property
```javascript
// Notion: { date: { start: "2024-01-01", end: null } }
// Transform: Use start date, format as needed
property.date?.start || null
```

#### 5.2.4 File Property
```javascript
// Notion: { files: [{ file: { url: "https://..." } }] }
// Transform: Extract URL from first file
property.files[0]?.file?.url || null
```

#### 5.2.5 Select Property
```javascript
// Notion: { select: { name: "Option" } }
// Transform: Extract name
property.select?.name || null
```

#### 5.2.6 Multi-select Property
```javascript
// Notion: { multi_select: [{ name: "Option1" }, { name: "Option2" }] }
// Transform: Extract array of names
property.multi_select.map(s => s.name)
```

## 6. Caching Strategy

### 6.1 Server-Side Caching

**Implementation:**
- In-memory Map-based cache
- TTL: 15 minutes (configurable)
- Key: endpoint name
- Cache invalidation: On error or manual clear

**Cache Key Format:**
```
notion:about
notion:projects
notion:work
```

### 6.2 Client-Side Caching

**Implementation:**
- localStorage-based cache
- TTL: 15 minutes
- Key: endpoint name + API base URL
- Cache invalidation: On error, manual refetch, or expiration

**Cache Entry Format:**
```javascript
{
  data: [...],
  timestamp: 1234567890,
  expiresAt: 1234567890 + (15 * 60 * 1000)
}
```

### 6.3 Cache Invalidation

**Triggers:**
- TTL expiration
- Manual refetch call
- Error response (invalidate stale cache)
- Cache size limit exceeded (LRU eviction)

## 7. Error Handling Design

### 7.1 Error Types

#### Notion API Errors
- Rate limit exceeded → 503, retry after delay
- Authentication failed → 500, log error
- Database not found → 500, log error
- Network error → 503, retry with backoff

#### Application Errors
- Invalid response format → 500, log error
- Transformation error → 500, log error
- Cache error → Continue without cache

### 7.2 Error Handling Flow

```
API Request
    │
    ├─► Check cache
    │   ├─► Hit: Return cached data
    │   └─► Miss: Continue
    │
    ├─► Query Notion API
    │   ├─► Success: Transform & cache
    │   └─► Error: Check cache for stale data
    │       ├─► Stale data available: Return with warning
    │       └─► No stale data: Return error
    │
    └─► Return response
```

### 7.3 Retry Logic

**Strategy:** Exponential backoff
- Initial delay: 1 second
- Max delay: 30 seconds
- Max retries: 3
- Only retry on transient errors (503, network errors)

## 8. Security Design

### 8.1 API Key Management

**Storage:**
- Server-side environment variables only
- Never exposed to client
- Not logged or included in error messages

**Access:**
- Serverless function environment variables
- Vercel/Netlify environment variable configuration
- Local development via `.env` file (gitignored)

### 8.2 CORS Configuration

**Allowed Origins:**
- Production domain
- Localhost (development)
- Preview deployments (if applicable)

**Headers:**
- Content-Type: application/json
- No custom headers required

### 8.3 Input Validation

**Validation Points:**
- Endpoint parameters (if any)
- Query string parameters
- Request headers

**Sanitization:**
- No user input in this phase (read-only)
- Future: Sanitize any user inputs

## 9. Performance Design

### 9.1 Optimization Strategies

1. **Caching**: Reduce Notion API calls
2. **Parallel Requests**: Fetch all endpoints simultaneously (if needed)
3. **Lazy Loading**: Load data only when component mounts
4. **Memoization**: Memoize transformed data in components

### 9.2 Performance Targets

- API response time: < 2 seconds (95th percentile)
- Cache hit rate: > 80%
- Notion API calls: < 1 per endpoint per 15 minutes
- Client-side render: No regression from current implementation

## 10. Deployment Design

### 10.1 Serverless Function Deployment

**Platform:** Vercel (recommended) or Netlify

**Structure:**
```
project-root/
├── api/
│   └── notion/
│       ├── about.js
│       ├── projects.js
│       ├── work.js
│       └── health.js
└── src/
    └── ...
```

**Configuration:**
- Runtime: Node.js 18+
- Environment variables configured in platform dashboard
- Automatic deployment on git push

### 10.2 Environment Variables

**Backend (Serverless):**
```
NOTION_API_KEY=secret_xxx
NOTION_ABOUT_DB_ID=xxx
NOTION_PROJECTS_DB_ID=xxx
NOTION_WORK_DB_ID=xxx
```

**Frontend:**
```
REACT_APP_API_BASE_URL=https://your-domain.com/api
```

## 11. Testing Strategy

### 11.1 Unit Tests

- Notion client wrapper
- Data transformation functions
- Cache utilities
- React hook (useNotionData)

### 11.2 Integration Tests

- API endpoints (mock Notion API)
- End-to-end data flow
- Error scenarios
- Caching behavior

### 11.3 Component Tests

- Component rendering with Notion data
- Loading states
- Error states
- Data transformation in components

## 12. Migration Strategy

### 12.1 Feature Flag Approach

**Implementation:**
```javascript
const USE_NOTION = process.env.REACT_APP_USE_NOTION === 'true';
```

**Benefits:**
- Gradual rollout
- Easy rollback
- A/B testing capability
- Zero downtime migration

### 12.2 Rollback Plan

1. Set `REACT_APP_USE_NOTION=false`
2. Re-enable Google Sheets code
3. Verify functionality
4. Investigate issues
5. Fix and retry migration

## 13. Monitoring & Observability

### 13.1 Metrics to Track

- API response times
- Cache hit rates
- Error rates
- Notion API rate limit usage
- Endpoint usage frequency

### 13.2 Logging

**Server-side:**
- API requests (endpoint, timestamp)
- Errors (with stack traces)
- Cache hits/misses
- Notion API responses (sanitized)

**Client-side:**
- Data fetch attempts
- Errors (user-friendly messages)
- Cache usage

### 13.3 Alerts

- API errors > threshold
- Response time > 2 seconds
- Rate limit warnings
- Health check failures
