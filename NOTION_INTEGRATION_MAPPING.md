# Notion Integration Mapping

## Database Schemas

### Projects Database
- **Data Source ID**: `collection://29dda682-bcf6-81cf-8338-000baea13c7e`
- **Database URL**: `https://www.notion.so/29dda682bcf6806eaa2efe20631dab6c`

**Schema Mapping**:
| Notion Field | Type | Google Sheets Equivalent |
|--------------|------|-------------------------|
| title | title | title |
| slug | text | slug |
| date | number | date |
| Keyword | multi_select | keyword |
| link | url | link |
| content | text | content |
| image | text | image |

### Work Database
- **Data Source ID**: `collection://c4ef3711-c4fa-417d-9c15-2f07a6a8fa35`
- **Database URL**: `https://www.notion.so/b589d1ef5ef64b35abcc88558bf5574f`

**Schema Mapping**:
| Notion Field | Type | Google Sheets Equivalent |
|--------------|------|-------------------------|
| Title | title | title |
| Company | text | company |
| Place | text | place |
| From | date | from |
| To | date | to |
| Description | text | description |
| Slug | text | slug |

### About Database
- **Data Source ID**: `collection://a5bcd19a-9d63-4c58-9850-218e56edc8fc`
- **Database URL**: `https://www.notion.so/aab0a96e279d48b6833f6727e6301266`

**Schema Mapping**:
| Notion Field | Type | Google Sheets Equivalent |
|--------------|------|-------------------------|
| Category | title | category |
| Description | text | description |

## Implementation Plan

1. Create Notion API service to fetch data from databases
2. Replace Google Sheets utilities with Notion utilities
3. Update components to use Notion data provider
4. Remove Google Sheets dependencies
5. Update environment variables
