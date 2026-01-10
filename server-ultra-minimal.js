// Simple server to serve React app with API endpoints
const express = require('express');
const path = require('path');
const cors = require('cors');

const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0';

console.log('===================================');
console.log('🚀 SERVER STARTING');
console.log('Port:', PORT);
console.log('Host:', HOST);
console.log('===================================');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data storage
let data = {
  goals: [],
  rocks: [],
  issues: [],
  todos: [],
  scorecard: []
};

// Mock Tableau data (replace with real integration later)
const mockTableauData = {
  leads: 16469,
  revenue: 11123,
  lastUpdated: new Date().toISOString()
};

// API Routes - MUST be before static files
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/health', (req, res) => {
  res.send('OK');
});

// Get all data
app.get('/api/data', (req, res) => {
  res.json(data);
});

// Get data by type
app.get('/api/data/:type', (req, res) => {
  const { type } = req.params;
  res.json(data[type] || []);
});

// Create/Update data
app.post('/api/data/:type', (req, res) => {
  const { type } = req.params;
  if (data[type]) {
    data[type] = req.body;
    res.json({ success: true, data: data[type] });
  } else {
    res.status(404).json({ error: 'Type not found' });
  }
});

// Tableau KPI endpoint
app.get('/api/tableau/kpis', (req, res) => {
  console.log('📊 Tableau KPIs requested');
  res.json(mockTableauData);
});

// Serve static files from React build
app.use(express.static(path.join(__dirname, 'build')));

// Serve index.html for all other routes (MUST be last)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, HOST, () => {
  console.log('===================================');
  console.log('✅ SERVER IS LIVE!');
  console.log(`🌐 URL: http://${HOST}:${PORT}`);
  console.log('📊 API endpoints ready');
  console.log('===================================');
});
