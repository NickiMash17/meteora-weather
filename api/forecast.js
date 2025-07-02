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

  // First, get lat/lon for the city
  const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(q)}&limit=1&appid=${API_KEY}`;
  try {
    const geoRes = await fetch(geoUrl);
    const geoData = await geoRes.json();
    if (!geoData[0]) {
      return res.status(404).json({ error: 'Location not found' });
    }
    const { lat, lon } = geoData[0];

    // Now get the One Call forecast (7 days)
    const oneCallUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts,current&units=metric&appid=${API_KEY}`;
    const oneCallRes = await fetch(oneCallUrl);
    const oneCallData = await oneCallRes.json();

    res.status(200).json(oneCallData);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy error', details: err.message });
  }
} 