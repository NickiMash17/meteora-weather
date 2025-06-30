const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
const API_KEY = 'f39a4aeb2b4b135b05092a20b3660076';

app.use(cors()); // This must be before any routes!

app.get('/api/weather', async (req, res) => {
  const { q } = req.query;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(q)}&appid=${API_KEY}&units=metric`;
  try {
    const response = await fetch(url);
    const text = await response.text();
    console.log('Weather API response:', text);
    res.status(response.status).send(text);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy error', details: err.message });
  }
});

app.get('/api/forecast', async (req, res) => {
  const { q } = req.query;
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(q)}&appid=${API_KEY}&units=metric`;
  try {
    const response = await fetch(url);
    const text = await response.text();
    console.log('Forecast API response:', text);
    res.status(response.status).send(text);
  } catch (err) {
    console.error('Proxy error:', err);
    res.status(500).json({ error: 'Proxy error', details: err.message });
  }
});

app.listen(3001, () => console.log('Proxy listening on port 3001'));