import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    // Map CRA-style process.env to import.meta.env for compatibility
    "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV || "development"),
    "process.env.REACT_APP_NOTION_TOKEN": JSON.stringify(""),
    "process.env.REACT_APP_API_BASE": JSON.stringify(process.env.REACT_APP_API_BASE || ""),
    "process.env.REACT_APP_ENABLE_VERCEL_ANALYTICS": JSON.stringify(process.env.REACT_APP_ENABLE_VERCEL_ANALYTICS || ""),
    "process.env.REACT_APP_GOOGLE_SHEETS_API_KEY": JSON.stringify(process.env.REACT_APP_GOOGLE_SHEETS_API_KEY || ""),
    "process.env.REACT_APP_GOOGLE_SHEETS_DOC_ID": JSON.stringify(process.env.REACT_APP_GOOGLE_SHEETS_DOC_ID || ""),
    "process.env.REACT_APP_PRINTFUL_API_KEY": JSON.stringify(process.env.REACT_APP_PRINTFUL_API_KEY || ""),
    "process.env.REACT_APP_PRINTFUL_STORE_ID": JSON.stringify(process.env.REACT_APP_PRINTFUL_STORE_ID || ""),
    "process.env.REACT_APP_GIT_COMMIT_HASH": JSON.stringify(""),
    "process.env.REACT_APP_BUILD_DATE": JSON.stringify(new Date().toISOString()),
    "process.env.REACT_APP_VERSION": JSON.stringify("1.0.0"),
  },
  css: {
    preprocessorOptions: {
      scss: {
        loadPaths: [path.resolve(__dirname, "src/sass")],
      },
    },
  },
  server: {
    port: 8080,
    host: "::",
  },
  publicDir: "public",
}));
