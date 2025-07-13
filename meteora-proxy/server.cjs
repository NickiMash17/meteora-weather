const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();
const app = express();

app.use(cors());
app.use(express.json());
app.options('*', cors());

app.get('/test', (req, res) => {
  res.json({ message: 'Proxy is working!' });
});

// Secure OpenAI proxy endpoint
app.post('/openai-proxy', async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OpenAI API key not set in server environment.' });
  }
  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(req.body)
    });
    const data = await openaiRes.json();
    res.status(openaiRes.status).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to contact OpenAI', details: err.message });
  }
});

app.listen(3001, () => console.log('Proxy listening on port 3001'));