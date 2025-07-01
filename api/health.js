const cors = require('cors');

// CORS middleware
const corsMiddleware = cors({
  origin: true,
  credentials: true
});

module.exports = async (req, res) => {
  // Apply CORS
  await new Promise((resolve) => corsMiddleware(req, res, resolve));

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
}; 