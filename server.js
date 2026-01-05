const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const TableauFetcher = require('./tableau-fetcher');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Initialize Tableau fetcher
const tableauUrl = process.env.TABLEAU_URL;
const tableauFetcher = new TableauFetcher(tableauUrl);

// In-memory storage for user data
let dashboardData = {
  goals: {
    quarterly: { target: 0, current: 0, percentage: 0 },
    monthly: { target: 0, current: 0, percentage: 0 }
  },
  tableau: null,
  issues: [],
  todos: [],
  scorecard: {},
  vto: { available: 0, used: 0, pending: 0, remaining: 0 }
};

// API Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/dashboard', (req, res) => {
  res.json({
    ...dashboardData,
    tableau: tableauFetcher.getLastData()
  });
});

app.post('/api/upload-data', (req, res) => {
  try {
    const { type, data } = req.body;
    
    switch(type) {
      case 'goals':
        dashboardData.goals = data;
        break;
      case 'issues':
        dashboardData.issues = data;
        break;
      case 'todos':
        dashboardData.todos = data;
        break;
      case 'scorecard':
        dashboardData.scorecard = data;
        break;
      case 'vto':
        dashboardData.vto = data;
        break;
      default:
        return res.status(400).json({ error: 'Invalid data type' });
    }
    
    // Broadcast update to all connected clients
    io.emit('dataUpdate', {
      type,
      data: dashboardData
    });
    
    res.json({ 
      success: true, 
      message: 'Data uploaded successfully',
      data: dashboardData
    });
    
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload data' });
  }
});

app.post('/api/update/:section', (req, res) => {
  const section = req.params.section;
  const data = req.body;
  
  if (dashboardData.hasOwnProperty(section)) {
    dashboardData[section] = data;
    io.emit('dataUpdate', { section, data: dashboardData });
    res.json({ success: true });
  } else {
    res.status(400).json({ error: 'Invalid section' });
  }
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  // Send initial data
  socket.emit('initialData', {
    ...dashboardData,
    tableau: tableauFetcher.getLastData()
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Fetch Tableau data periodically
const updateInterval = parseInt(process.env.UPDATE_INTERVAL) || 30000;

async function updateTableauData() {
  try {
    const data = await tableauFetcher.fetchTableauData();
    io.emit('tableauUpdate', data);
    console.log('Tableau data updated and broadcast');
  } catch (error) {
    console.error('Error updating Tableau data:', error);
  }
}

// Initial fetch
updateTableauData();

// Set up periodic updates
setInterval(updateTableauData, updateInterval);

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`
  ======================================
  🚀 AdsHub Server Running
  ======================================
  Port: ${PORT}
  Environment: ${process.env.NODE_ENV}
  Tableau URL: ${tableauUrl}
  Update Interval: ${updateInterval}ms (${updateInterval/1000}s)
  
  📊 Dashboard: http://localhost:${PORT}
  🔌 WebSocket: Ready
  ======================================
  `);
});
