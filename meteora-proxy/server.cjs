const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.options('*', cors());

app.get('/test', (req, res) => {
  res.json({ message: 'Proxy is working!' });
});

app.listen(3001, () => console.log('Proxy listening on port 3001'));