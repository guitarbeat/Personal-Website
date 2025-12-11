// Vercel Serverless Function for Notion API proxy
// This replaces the Express server and runs on Vercel's edge network

const NOTION_API_BASE = 'https://api.notion.com/v1';
const NOTION_VERSION = '2022-06-28';

// Database IDs
const DATABASE_IDS = {
  projects: '29dda682bcf6806eaa2efe20631dab6c',
  work: 'b589d1ef5ef64b35abcc88558bf5574f',
  about: 'aab0a96e279d48b6833f6727e6301266',
};

// Helper function to extract rich text
function extractRichText(richTextArray) {
  if (!richTextArray || !Array.isArray(richTextArray)) return '';
  return richTextArray.map(item => item.plain_text || '').join('');
}

// Helper function to convert YYYY-MM-DD to MM-YYYY
function convertToMMYYYY(dateString) {
  if (!dateString) return null;
  const parts = dateString.split('-');
  if (parts.length !== 3) return null;
  return `${parts[1]}-${parts[0]}`;
}

// Transform Projects data
function transformProjectsData(results) {
  return results.map(page => {
    const props = page.properties;
    return {
      title: props.title?.title?.[0]?.plain_text || props.Name?.title?.[0]?.plain_text || '',
      content: extractRichText(props.content?.rich_text || props.Description?.rich_text || []),
      date: props.date?.number || props.Date?.number || null,
      link: props.link?.url || props.Link?.url || null,
      slug: extractRichText(props.slug?.rich_text || props.Slug?.rich_text || []) || page.id,
      image: extractRichText(props.image?.rich_text || props.Image?.rich_text || []),
      keyword: props.Keyword?.multi_select?.[0]?.name || props.keyword?.multi_select?.[0]?.name || '',
    };
  });
}

// Transform Work data
function transformWorkData(results) {
  return results.map(page => {
    const props = page.properties;
    const fromDate = props.From?.date?.start || '';
    const toDate = props.To?.date?.start || '';
    
    return {
      title: props.title?.title?.[0]?.plain_text || props.Title?.title?.[0]?.plain_text || '',
      company: extractRichText(props.Company?.rich_text || []),
      description: extractRichText(props.Description?.rich_text || []),
      from: convertToMMYYYY(fromDate),
      to: convertToMMYYYY(toDate),
      place: extractRichText(props.Place?.rich_text || []),
      slug: extractRichText(props.slug?.rich_text || props.Slug?.rich_text || []) || page.id,
    };
  });
}

// Transform About data
function transformAboutData(results) {
  return results.map(page => {
    const props = page.properties;
    return {
      category: props.Category?.title?.[0]?.plain_text || props.category?.title?.[0]?.plain_text || '',
      description: extractRichText(props.Description?.rich_text || props.Text?.rich_text || props.Content?.rich_text || []),
    };
  });
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Extract database type from query parameter
    const { database } = req.query;
    
    if (!database) {
      return res.status(400).json({ error: 'Database type is required' });
    }

    const databaseId = DATABASE_IDS[database.toLowerCase()];
    
    if (!databaseId) {
      return res.status(400).json({ 
        error: 'Invalid database type',
        validTypes: Object.keys(DATABASE_IDS)
      });
    }

    // Get Notion token from environment variable
    const notionToken = process.env.REACT_APP_NOTION_TOKEN;
    
    if (!notionToken) {
      return res.status(500).json({ error: 'Notion token not configured' });
    }

    // Query Notion database
    const response = await fetch(
      `${NOTION_API_BASE}/databases/${databaseId}/query`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${notionToken}`,
          'Notion-Version': NOTION_VERSION,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body || { page_size: 100 }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Notion API error:', data);
      return res.status(response.status).json(data);
    }

    // Transform the data based on database type
    let transformedData;
    const results = data.results || [];
    
    switch (database.toLowerCase()) {
      case 'projects':
        transformedData = transformProjectsData(results);
        break;
      case 'work':
        transformedData = transformWorkData(results);
        break;
      case 'about':
        transformedData = transformAboutData(results);
        break;
      default:
        transformedData = results;
    }

    return res.status(200).json(transformedData);
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
