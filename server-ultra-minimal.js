// Simple server to serve React app
const express = require('express');
const path = require('path');

const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0';

console.log('===================================');
console.log('🚀 SERVER STARTING');
console.log('Port:', PORT);
console.log('Host:', HOST);
console.log('===================================');

const app = express();

// Health check
app.get('/health', (req, res) => {
  res.send('OK');
});

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'build')));

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log('===================================');
  console.log('✅ SERVER IS LIVE!');
  console.log(`🌐 URL: http://${HOST}:${PORT}`);
  console.log('===================================');
});
