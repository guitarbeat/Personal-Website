// Notion Service - handles fetching data from Notion databases via Vercel serverless functions

// In production (Vercel), use relative paths which resolve to /api/*
// In development, can use local proxy server or Vercel dev server
const API_BASE = process.env.REACT_APP_API_BASE || "";

// Fetch data from a Notion database via Vercel serverless function
const fetchNotionDatabase = async (databaseType: string): Promise<any[]> => {
  try {
    const response = await fetch(
      `${API_BASE}/api/notion?database=${databaseType}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          page_size: 100,
        }),
      },
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(
        `Notion API error: ${error.message || response.statusText}`,
      );
    }

    const data = await response.json();
    // Serverless function returns already-transformed data as an array
    return Array.isArray(data) ? data : [];
  } catch (error: any) {
    console.error(`Error fetching ${databaseType} from Notion:`, error);
    return [];
  }
};

// Data is already transformed by serverless function, just pass through
const transformProjectsData = (data: any[]): any[] => {
  return data;
};

// Data is already transformed by serverless function, just pass through
const transformWorkData = (data: any[]): any[] => {
  return data;
};

// Data is already transformed by serverless function, just pass through
const transformAboutData = (data: any[]): any[] => {
  return data;
};

// Main Notion Service class
class NotionService {
  async getProjects() {
    const pages = await fetchNotionDatabase("projects");
    return transformProjectsData(pages);
  }

  async getWork() {
    const pages = await fetchNotionDatabase("work");
    return transformWorkData(pages);
  }

  async getAbout() {
    const pages = await fetchNotionDatabase("about");
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
