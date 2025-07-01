const cors = require('cors');

// Handle fetch - use global fetch if available (Node 18+), otherwise use node-fetch
let fetch;
if (typeof globalThis.fetch === 'function') {
  fetch = globalThis.fetch;
} else {
  fetch = require('node-fetch');
}

const API_KEY = process.env.VITE_WEATHER_API_KEY || 'f39a4aeb2b4b135b05092a20b3660076';

// CORS middleware
const corsMiddleware = cors({
  origin: true,
  credentials: true
});

export default async function handler(req, res) {
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

  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }
  
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(q)}&appid=${API_KEY}&units=metric`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.status(response.status).json(data);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy error', details: err.message });
  }
} 