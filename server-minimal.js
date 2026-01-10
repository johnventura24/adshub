// MINIMAL SERVER - Guaranteed to start and open port
console.log('Starting minimal server...');

const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0';

console.log('Port:', PORT);
console.log('Host:', HOST);

// Health check - MUST respond instantly
app.get('/health', (req, res) => {
  res.send('OK');
});

// Serve static files
app.use(express.static(path.join(__dirname, 'build')));

// Serve index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// Start server
app.listen(PORT, HOST, () => {
  console.log(`Server running on ${HOST}:${PORT}`);
  console.log('Ready!');
});
