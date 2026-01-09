// Log startup to help debug Render deployment
console.log('🔄 Starting server...');
console.log('📍 Current directory:', __dirname);
console.log('🌍 Environment:', process.env.NODE_ENV);
console.log('🔌 Port:', process.env.PORT || 3001);

const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');

// Wrap tableau-integration require in try-catch
let tableauIntegration;
try {
  tableauIntegration = require('./tableau-integration');
  console.log('✅ Tableau integration loaded');
} catch (error) {
  console.error('⚠️ Failed to load tableau-integration:', error.message);
  console.log('ℹ️ Server will continue without Tableau integration');
  // Provide fallback
  tableauIntegration = {
    getComprehensivePlatformData: async () => ({
      revenueFunnel: { leads: 0, revenue: 0 }
    })
  };
}

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

// Serve static files from React build in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
}

// Store data in memory (use database in production)
let data = {
  goals: [],
  rocks: [],
  issues: [],
  todos: [],
  scorecard: []
};

// Cache for Tableau data
let tableauCache = {
  data: null,
  lastFetch: null,
  refreshInterval: 5 * 60 * 1000 // 5 minutes
};

// API endpoints
app.get('/api/data', (req, res) => {
  res.json(data);
});

app.post('/api/data/:type', (req, res) => {
  const { type } = req.params;
  if (data[type]) {
    data[type] = req.body;
    io.emit('data-update', { type, data: req.body });
    res.json({ success: true });
  } else {
    res.status(400).json({ error: 'Invalid type' });
  }
});

// Tableau Real-Time KPI Endpoint
app.get('/api/tableau/kpis', async (req, res) => {
  try {
    console.log('📊 Fetching Tableau KPIs...');
    
    // Check if we have recent cached data
    const now = Date.now();
    if (tableauCache.data && tableauCache.lastFetch && 
        (now - tableauCache.lastFetch < tableauCache.refreshInterval)) {
      console.log('✅ Returning cached Tableau data');
      return res.json({
        success: true,
        data: tableauCache.data,
        cached: true,
        lastUpdated: new Date(tableauCache.lastFetch).toISOString()
      });
    }

    // Fetch fresh data from Tableau
    console.log('🔄 Fetching fresh data from Tableau...');
    const comprehensiveData = await tableauIntegration.getComprehensivePlatformData();
    
    // Extract KPIs for dashboard
    const kpis = {
      // Revenue Funnel Metrics
      leads: comprehensiveData.revenueFunnel?.leads || 0,
      prospects: comprehensiveData.revenueFunnel?.prospects || 0,
      qualified: comprehensiveData.revenueFunnel?.qualified || 0,
      proposals: comprehensiveData.revenueFunnel?.proposals || 0,
      closed: comprehensiveData.revenueFunnel?.closed || 0,
      revenue: comprehensiveData.revenueFunnel?.revenue || 0,
      
      // Platform Performance
      googleRevenue: comprehensiveData.google?.daily?.revenue || 0,
      googleROAS: comprehensiveData.google?.daily?.roas || 0,
      googleLeads: comprehensiveData.google?.daily?.leads || 0,
      googleProfit: comprehensiveData.google?.daily?.grossProfit || 0,
      
      facebookRevenue: comprehensiveData.facebook?.daily?.revenue || 0,
      facebookROAS: comprehensiveData.facebook?.daily?.roas || 0,
      facebookLeads: comprehensiveData.facebook?.daily?.leads || 0,
      facebookProfit: comprehensiveData.facebook?.daily?.grossProfit || 0,
      
      // Overall Performance
      totalImpressions: (comprehensiveData.google?.daily?.impressions || 0) + 
                       (comprehensiveData.facebook?.daily?.impressions || 0),
      totalClicks: (comprehensiveData.google?.daily?.clicks || 0) + 
                  (comprehensiveData.facebook?.daily?.clicks || 0),
      totalAdSpend: (comprehensiveData.google?.daily?.adSpend || 0) + 
                   (comprehensiveData.facebook?.daily?.adSpend || 0),
      totalProfit: (comprehensiveData.google?.daily?.grossProfit || 0) + 
                  (comprehensiveData.facebook?.daily?.grossProfit || 0),
      
      // Conversion Rates
      conversionRates: comprehensiveData.revenueFunnel?.conversionRates || {},
      
      // Platform Comparison
      winningPlatform: comprehensiveData.platformComparison?.winner || 'Google Ads',
      recommendation: comprehensiveData.google?.labels?.recommendation || 'Monitor Performance',
      
      // Scorecard Metrics
      customerSatisfaction: comprehensiveData.scorecard?.customerSatisfaction || 90,
      teamEfficiency: comprehensiveData.scorecard?.teamEfficiency || 85,
      goalCompletion: comprehensiveData.scorecard?.goalCompletion || 75,
      qualityScore: comprehensiveData.scorecard?.qualityScore || 90,
      
      // Metadata
      lastUpdated: comprehensiveData.lastUpdated || new Date().toISOString(),
      extractionDate: comprehensiveData.extractionDate || new Date().toISOString().split('T')[0],
      source: 'tableau_public',
      dashboardUrl: 'https://public.tableau.com/app/profile/niksa.derek/viz/FunnelAnalysis_17472437058310/TableView'
    };
    
    // Update cache
    tableauCache.data = kpis;
    tableauCache.lastFetch = now;
    
    console.log('✅ Tableau KPIs fetched successfully');
    console.log(`📊 Revenue: $${kpis.revenue}, Leads: ${kpis.leads}, Closed: ${kpis.closed}`);
    
    // Broadcast to connected clients
    io.emit('tableau-update', kpis);
    
    res.json({
      success: true,
      data: kpis,
      cached: false,
      lastUpdated: new Date(now).toISOString()
    });
    
  } catch (error) {
    console.error('❌ Error fetching Tableau KPIs:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch Tableau data',
      message: error.message
    });
  }
});

// Funnel Data Endpoint (for detailed funnel view)
app.get('/api/tableau/funnel', async (req, res) => {
  try {
    console.log('📊 Fetching Tableau funnel data...');
    const funnelData = await tableauIntegration.getFunnelData();
    
    res.json({
      success: true,
      data: funnelData,
      lastUpdated: funnelData.lastUpdated || new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Error fetching funnel data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch funnel data',
      message: error.message
    });
  }
});

// Force refresh Tableau data
app.post('/api/tableau/refresh', async (req, res) => {
  try {
    console.log('🔄 Force refreshing Tableau data...');
    tableauCache.data = null;
    tableauCache.lastFetch = null;
    
    const comprehensiveData = await tableauIntegration.getComprehensivePlatformData();
    const now = Date.now();
    
    const kpis = {
      leads: comprehensiveData.revenueFunnel?.leads || 0,
      prospects: comprehensiveData.revenueFunnel?.prospects || 0,
      qualified: comprehensiveData.revenueFunnel?.qualified || 0,
      proposals: comprehensiveData.revenueFunnel?.proposals || 0,
      closed: comprehensiveData.revenueFunnel?.closed || 0,
      revenue: comprehensiveData.revenueFunnel?.revenue || 0,
      googleRevenue: comprehensiveData.google?.daily?.revenue || 0,
      googleROAS: comprehensiveData.google?.daily?.roas || 0,
      facebookRevenue: comprehensiveData.facebook?.daily?.revenue || 0,
      facebookROAS: comprehensiveData.facebook?.daily?.roas || 0,
      lastUpdated: new Date(now).toISOString(),
      source: 'tableau_public'
    };
    
    tableauCache.data = kpis;
    tableauCache.lastFetch = now;
    
    io.emit('tableau-update', kpis);
    
    res.json({
      success: true,
      message: 'Tableau data refreshed',
      data: kpis
    });
  } catch (error) {
    console.error('❌ Error refreshing Tableau data:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to refresh Tableau data'
    });
  }
});

// Health check (critical for Render) - MUST respond instantly
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Detailed health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    tableauIntegration: tableauIntegration ? 'available' : 'disabled'
  });
});

// Serve React app in production (must be after API routes)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, 'build', 'index.html');
    res.sendFile(indexPath, (err) => {
      if (err) {
        console.error('Error serving index.html:', err);
        res.status(500).send('Error loading application. Please ensure build folder exists.');
      }
    });
  });
}

// Global error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Socket.io for real-time updates
io.on('connection', (socket) => {
  console.log('📱 Client connected');
  socket.emit('initial-data', data);
  
  // Send cached Tableau data if available
  if (tableauCache.data) {
    socket.emit('tableau-update', tableauCache.data);
  }
  
  socket.on('disconnect', () => {
    console.log('📱 Client disconnected');
  });
  
  socket.on('request-tableau-update', async () => {
    try {
      console.log('🔄 Client requested Tableau update');
      const response = await fetch('http://localhost:3001/api/tableau/kpis');
      const data = await response.json();
      if (data.success) {
        socket.emit('tableau-update', data.data);
      }
    } catch (error) {
      console.error('❌ Error handling Tableau update request:', error);
    }
  });
});

const PORT = process.env.PORT || 3001;
const HOST = '0.0.0.0'; // Required for Render and other cloud platforms

console.log(`🔧 Attempting to bind to ${HOST}:${PORT}...`);

server.listen(PORT, HOST, () => {
  console.log(`🚀 Server running on ${HOST}:${PORT}`);
  console.log(`📊 Tableau Integration: ${tableauIntegration ? 'Active (lazy load)' : 'Disabled'}`);
  console.log(`✅ Server is ready to accept connections`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🎯 Health check: http://${HOST}:${PORT}/health`);
  
  // Do NOT fetch Tableau data on startup - only fetch when API is called
  // This ensures the server starts INSTANTLY for Render's health check
  console.log('ℹ️ Tableau data will be fetched on first API request (lazy loading)');
});

// Handle server errors
server.on('error', (error) => {
  console.error('❌ Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use`);
  } else if (error.code === 'EACCES') {
    console.error(`❌ Permission denied to bind to port ${PORT}`);
  }
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('📴 SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
