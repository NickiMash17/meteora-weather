const express = require('express');
const cors = require('cors');

// Handle fetch - use global fetch if available (Node 18+), otherwise use node-fetch
let fetch;
if (typeof globalThis.fetch === 'function') {
  fetch = globalThis.fetch;
} else {
  fetch = require('node-fetch');
}

const app = express();
const API_KEY = 'f39a4aeb2b4b135b05092a20b3660076';

// Configure CORS properly for Express 5
app.use(cors({
  origin: true,
  credentials: true
}));

app.get('/api/weather', async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }
  
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(q)}&appid=${API_KEY}&units=metric`;
  try {
    const response = await fetch(url);
    const text = await response.text();
    console.log('Weather API response status:', response.status);
    res.status(response.status).send(text);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy error', details: err.message });
  }
});

app.get('/api/forecast', async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: 'Query parameter "q" is required' });
  }
  
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(q)}&appid=${API_KEY}&units=metric`;
  try {
    const response = await fetch(url);
    const text = await response.text();
    console.log('Forecast API response status:', response.status);
    res.status(response.status).send(text);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy error', details: err.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(3001, () => console.log('Weather API proxy listening on port 3001'));