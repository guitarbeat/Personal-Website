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

    return res.status(200).json(data);
  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}
