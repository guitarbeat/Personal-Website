// Health check endpoint for Vercel serverless function

export default function handler(_req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");

  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    environment: "vercel-serverless",
  });
}
