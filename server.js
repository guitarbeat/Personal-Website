// Simple Express server to proxy Notion API requests
// This avoids CORS issues when calling Notion API from the browser

const express = require("express");
const cors = require("cors");

// Ensure fetch is available (Node 18+)
if (typeof fetch === "undefined") {
  global.fetch = require("node-fetch");
}
const app = express();
const PORT = 3001;

// Notion API configuration
const NOTION_API_BASE = "https://api.notion.com/v1";
const NOTION_VERSION = "2022-06-28";
const NOTION_TOKEN = process.env.REACT_APP_NOTION_TOKEN;

// Database IDs
const DATABASE_IDS = {
  PROJECTS: "29dda682bcf6806eaa2efe20631dab6c",
  WORK: "b589d1ef5ef64b35abcc88558bf5574f",
  ABOUT: "aab0a96e279d48b6833f6727e6301266",
};

// Enable CORS for local development
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Proxy endpoint for querying Notion databases
app.post("/api/notion/database/:databaseType/query", async (req, res) => {
  try {
    const { databaseType } = req.params;
    const databaseId = DATABASE_IDS[databaseType.toUpperCase()];

    if (!databaseId) {
      return res.status(400).json({ error: "Invalid database type" });
    }

    if (!NOTION_TOKEN) {
      return res.status(500).json({ error: "Notion token not configured" });
    }

    const response = await fetch(
      `${NOTION_API_BASE}/databases/${databaseId}/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${NOTION_TOKEN}`,
          "Notion-Version": NOTION_VERSION,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Notion API error:", data);
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Notion proxy server running on http://localhost:${PORT}`);
  console.log(`Notion token configured: ${!!NOTION_TOKEN}`);
});
