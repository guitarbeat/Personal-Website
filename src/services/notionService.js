// Notion Service - handles fetching data from Notion databases via Vercel serverless functions

// In production (Vercel), use relative paths which resolve to /api/*
// In development, can use local proxy server or Vercel dev server
const API_BASE = process.env.REACT_APP_API_BASE || '';

// Fetch data from a Notion database via Vercel serverless function
const fetchNotionDatabase = async (databaseType) => {
  try {
    const response = await fetch(`${API_BASE}/api/notion?database=${databaseType}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page_size: 100,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Notion API error: ${error.message || response.statusText}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error(`Error fetching ${databaseType} from Notion:`, error);
    return [];
  }
};

// Extract plain text from Notion rich text array
const getPlainText = (richTextArray) => {
  if (!Array.isArray(richTextArray)) return '';
  return richTextArray.map(item => item.plain_text || '').join('');
};

// Transform Projects data from Notion format to app format
const transformProjectsData = (pages) => {
  return pages.map(page => {
    const props = page.properties || {};
    return {
      title: getPlainText(props.title?.title || props.Name?.title || []),
      content: getPlainText(props.content?.rich_text || props.Description?.rich_text || []),
      date: props.date?.number || props.Date?.number || new Date().getFullYear(),
      link: props.link?.url || props.Link?.url || null,
      slug: getPlainText(props.slug?.rich_text || props.Slug?.rich_text || []),
      image: getPlainText(props.image?.rich_text || props.Image?.rich_text || []),
      keyword: props.Keyword?.multi_select?.[0]?.name || 'General',
      id: page.id,
    };
  });
};

// Convert Notion date (YYYY-MM-DD) to MM-YYYY format
const convertToMMYYYY = (dateStr) => {
  if (!dateStr) return '';
  const [year, month] = dateStr.split('-');
  return `${month}-${year}`;
};

// Transform Work data from Notion format to app format
const transformWorkData = (pages) => {
  return pages.map(page => {
    const props = page.properties || {};
    
    // Extract dates from Notion date properties (YYYY-MM-DD format)
    const fromDate = props.From?.date?.start || '';
    const toDate = props.To?.date?.start || '';
    
    const transformed = {
      title: getPlainText(props.title?.title || props.Title?.title || []),
      company: getPlainText(props.Company?.rich_text || []),
      description: getPlainText(props.Description?.rich_text || []),
      place: getPlainText(props.Place?.rich_text || []),
      from: convertToMMYYYY(fromDate),
      to: convertToMMYYYY(toDate),
      slug: getPlainText(props.slug?.rich_text || props.Slug?.rich_text || []) || page.id,
      id: page.id,
    };
    
    console.log('Work item transformation:', {
      title: transformed.title,
      fromDate,
      toDate,
      fromConverted: transformed.from,
      toConverted: transformed.to
    });
    
    return transformed;
  });
};

// Transform About data from Notion format to app format
const transformAboutData = (pages) => {
  return pages.map(page => {
    const props = page.properties || {};
    return {
      category: getPlainText(props.Category?.title || props.category?.title || []),
      description: getPlainText(props.Description?.rich_text || props.Text?.rich_text || props.Content?.rich_text || []),
      id: page.id,
    };
  });
};

// Main Notion Service class
class NotionService {
  async getProjects() {
    const pages = await fetchNotionDatabase('projects');
    return transformProjectsData(pages);
  }

  async getWork() {
    const pages = await fetchNotionDatabase('work');
    return transformWorkData(pages);
  }

  async getAbout() {
    const pages = await fetchNotionDatabase('about');
    return transformAboutData(pages);
  }

  async getAllData() {
    const [projects, work, about] = await Promise.all([
      this.getProjects(),
      this.getWork(),
      this.getAbout(),
    ]);

    return {
      projects,
      work,
      about,
    };
  }
}

export default NotionService;
