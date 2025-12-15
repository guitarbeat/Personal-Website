// Notion Context Provider for managing Notion data across the app

import React, { createContext, useContext, useEffect, useState } from 'react';
import NotionService from '../services/notionService.ts';

const NotionContext = createContext(null);

export const useNotion = () => {
  const context = useContext(NotionContext);
  if (!context) {
    throw new Error('useNotion must be used within NotionProvider');
  }
  return context;
};

export const NotionProvider = ({ children }) => {
  const [data, setData] = useState({
    projects: [],
    work: [],
    about: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const notionService = new NotionService();
        const allData = await notionService.getAllData();
        setData(allData);
      } catch (err) {
        console.error('Error fetching Notion data:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const value = {
    db: data,
    loading,
    error,
  };

  return (
    <NotionContext.Provider value={value}>
      {children}
    </NotionContext.Provider>
  );
};
