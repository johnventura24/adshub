const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

// Store data in memory (use database in production)
let data = {
  goals: [],
  rocks: [],
  issues: [],
  todos: [],
  scorecard: []
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

// Socket.io for real-time updates
io.on('connection', (socket) => {
  console.log('Client connected');
  socket.emit('initial-data', data);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
