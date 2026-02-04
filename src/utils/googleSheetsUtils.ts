// Utility functions for processing data from Google Sheets.

export interface AboutItem {
  category: string;
  description: string;
}

export interface ProjectItem {
  title: string;
  slug: string;
  date: string;
  keyword: string;
  link: string;
  content: string;
  image: string;
}

export interface WorkItem {
  title: string;
  company: string;
  place: string;
  from: string;
  to: string;
  description: string;
  slug: string;
}

// biome-ignore lint/suspicious/noExplicitAny: External data source
export const processAboutData = (data: any[]): AboutItem[] =>
  data.map((row) => ({
    category: row.category,
    description: row.description,
  }));

// biome-ignore lint/suspicious/noExplicitAny: External data source
export const processProjectsData = (data: any[]): ProjectItem[] =>
  data.map((row) => ({
    title: row.title,
    slug: row.slug,
    date: row.date,
    keyword: row.keyword,
    link: row.link,
    content: row.content,
    image: row.image,
  }));

// biome-ignore lint/suspicious/noExplicitAny: External data source
export const processWorkData = (data: any[]): WorkItem[] =>
  data.map((row) => ({
    title: row.title,
    company: row.company,
    place: row.place,
    from: row.from,
    to: row.to,
    description: row.description,
    slug: row.slug,
  }));
