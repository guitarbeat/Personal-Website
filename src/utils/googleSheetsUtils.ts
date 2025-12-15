// Utility functions for processing data from Google Sheets.

export const processAboutData = (data) =>
  data.map((row) => ({
    category: row.category,
    description: row.description,
  }));

export const processProjectsData = (data) =>
  data.map((row) => ({
    title: row.title,
    slug: row.slug,
    date: row.date,
    keyword: row.keyword,
    link: row.link,
    content: row.content,
    image: row.image,
  }));

export const processWorkData = (data) =>
  data.map((row) => ({
    title: row.title,
    company: row.company,
    place: row.place,
    from: row.from,
    to: row.to,
    description: row.description,
    slug: row.slug,
  }));
