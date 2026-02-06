## 2024-05-22 - Serverless Error Leakage
**Vulnerability:** The Vercel serverless function `api/notion.js` was catching errors and returning `error.message` and `error.stack` (implicitly or explicitly) to the client in the 500 response.
**Learning:** In "proxy" style serverless functions, it's easy to just pass the error object back to the client for debugging, but this persists into production and leaks internal implementation details.
**Prevention:** Always sanitize error responses in API handlers. Log the full error to `console.error` (which goes to server logs) but return a generic `{ error: "Internal server error" }` to the client.
