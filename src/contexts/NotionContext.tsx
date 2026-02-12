// Notion Context Provider for managing Notion data across the app

import { createContext, useContext, useEffect, useState } from "react";
import NotionService from "../services/notionService";

interface NotionData {
  projects: any[];
  work: any[];
  about: any[];
}

interface NotionContextType {
  db: NotionData;
  loading: boolean;
  error: string | null;
}

const NotionContext = createContext<NotionContextType | null>(null);

export const useNotion = () => {
  const context = useContext(NotionContext);
  if (!context) {
    throw new Error("useNotion must be used within NotionProvider");
  }
  return context;
};

export const NotionProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<NotionData>({
    projects: [],
    work: [],
    about: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const notionService = new NotionService();
        const allData = await notionService.getAllData();
        setData(allData);
      } catch (err: any) {
        console.error("Error fetching Notion data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const value: NotionContextType = {
    db: data,
    loading,
    error,
  };

  return (
    <NotionContext.Provider value={value}>{children}</NotionContext.Provider>
  );
};
