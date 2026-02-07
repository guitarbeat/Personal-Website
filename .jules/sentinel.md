## 2024-05-23 - Serverless Security Headers & Error Leakage
**Vulnerability:** Missing security headers (`X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`) and potential information leakage in error responses within Vercel serverless functions (`api/notion.js`, `api/health.js`).
**Learning:** Serverless functions act as independent HTTP endpoints and do not inherit security configurations from the main application or a central server middleware unless explicitly configured. They manage their own headers and response lifecycle.
**Prevention:** Always explicitly set standard security headers in serverless function handlers and ensure `catch` blocks return generic user-facing messages while logging details internally.
