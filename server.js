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
const tableauUrl = process.env.TABLEAU_URL || 'https://public.tableau.com/app/profile/niksa.derek/viz/FunnelAnalysis_17472437058310/TableView?publish=yes';
const tableauFetcher = new TableauFetcher(tableauUrl);

// In-memory storage for Ninety.io-style data
let dashboardData = {
  scorecard: {
    revenue: 0,
    customerSatisfaction: 0,
    newLeads: 0,
    conversionRate: 0,
    teamEfficiency: 0,
    projectsOnTime: 0
  },
  rocks: [],
  todos: [],
  issues: [],
  tableau: null
};

// Routes
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
    
    console.log(`📤 Uploading ${type} data:`, data);
    
    switch(type) {
      case 'scorecard':
        dashboardData.scorecard = { ...dashboardData.scorecard, ...data };
        break;
      case 'rocks':
        dashboardData.rocks = data.rocks || data;
        break;
      case 'todos':
        dashboardData.todos = Array.isArray(data) ? data : (data.todos || []);
        break;
      case 'issues':
        dashboardData.issues = Array.isArray(data) ? data : (data.issues || []);
        break;
      default:
        return res.status(400).json({ error: 'Invalid data type' });
    }
    
    // Broadcast update to all connected clients
    io.emit('dataUpdate', {
      type,
      data: dashboardData
    });
    
    console.log(`✅ ${type} data uploaded and broadcast to clients`);
    
    res.json({ 
      success: true, 
      message: `${type} data uploaded successfully`,
      data: dashboardData
    });
    
  } catch (error) {
    console.error('❌ Upload error:', error);
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

// Toggle rock completion
app.post('/api/rocks/:id/toggle', (req, res) => {
  const rockId = parseInt(req.params.id);
  const rock = dashboardData.rocks.find(r => r.id === rockId);
  
  if (rock) {
    rock.completed = !rock.completed;
    io.emit('dataUpdate', { type: 'rocks', data: dashboardData });
    res.json({ success: true, rock });
  } else {
    res.status(404).json({ error: 'Rock not found' });
  }
});

// Toggle todo completion
app.post('/api/todos/:id/toggle', (req, res) => {
  const todoId = parseInt(req.params.id);
  const todo = dashboardData.todos.find(t => t.id === todoId);
  
  if (todo) {
    todo.completed = !todo.completed;
    io.emit('dataUpdate', { type: 'todos', data: dashboardData });
    res.json({ success: true, todo });
  } else {
    res.status(404).json({ error: 'Todo not found' });
  }
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);
  
  // Send initial data
  socket.emit('initialData', {
    ...dashboardData,
    tableau: tableauFetcher.getLastData()
  });
  
  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

// Fetch Tableau data periodically
const updateInterval = parseInt(process.env.UPDATE_INTERVAL) || 30000;

async function updateTableauData() {
  try {
    const data = await tableauFetcher.fetchTableauData();
    io.emit('tableauUpdate', data);
    console.log('📊 Tableau data updated and broadcast to', io.engine.clientsCount, 'clients');
  } catch (error) {
    console.error('❌ Error updating Tableau data:', error.message);
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
╔════════════════════════════════════════════╗
║                                            ║
║      🚀 AdsHub Ninety.io Dashboard        ║
║                                            ║
╚════════════════════════════════════════════╝

📊 Dashboard URL:      http://localhost:${PORT}
🔌 WebSocket:          Ready
📈 Tableau URL:        ${tableauUrl ? 'Connected' : 'Not configured'}
⏱️  Update Interval:    ${updateInterval/1000}s
👥 Active Clients:     0

Environment:           ${process.env.NODE_ENV || 'development'}
Node Version:          ${process.version}

Ready to accept connections...
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Closing server gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});
