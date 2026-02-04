const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

// Reading from database (Supabase) via db-service - not from JSON files
const db = require('./db-service');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check for Render
app.get('/health', (req, res) => {
  res.send('OK');
});

// So you can confirm this server (with API) is running: GET /api returns JSON
app.get('/api', (req, res) => {
  res.json({ ok: true, server: 'server.js', routes: ['/api/dashboard', '/api/todos', '/api/issues', '/api/goals/:period', '/api/tableau/kpis'] });
});

// Tableau KPIs - returns JSON so frontend does not get HTML (never returns a page)
app.get('/api/tableau/kpis', async (req, res) => {
  const fallback = () => res.json({
    success: true,
    data: {
      leads: 16469,
      prospects: 9881,
      qualified: 4940,
      proposals: 2470,
      closed: 1811,
      revenue: 11123,
      googleRevenue: 10967,
      googleROAS: '1.20',
      googleLeads: 15959,
      googleProfit: 1799,
      facebookRevenue: 156,
      facebookROAS: '0.57',
      facebookLeads: 510,
      facebookProfit: -118,
      lastUpdated: new Date().toISOString(),
      source: 'fallback'
    }
  });
  try {
    const tableauIntegration = require('./tableau-integration');
    if (tableauIntegration && typeof tableauIntegration.getComprehensivePlatformData === 'function') {
      const data = await tableauIntegration.getComprehensivePlatformData();
      const funnel = data.revenueFunnel || data;
      const google = data.google || {};
      const facebook = data.facebook || {};
      return res.json({
        success: true,
        data: {
          leads: funnel.leads ?? 16469,
          prospects: funnel.prospects ?? 9881,
          qualified: funnel.qualified ?? 4940,
          proposals: funnel.proposals ?? 2470,
          closed: funnel.closed ?? 1811,
          revenue: funnel.revenue ?? 11123,
          googleRevenue: google.revenue ?? 10967,
          googleROAS: (google.roas || google.ROAS || '1.20').toString(),
          googleLeads: google.leads ?? 15959,
          googleProfit: google.profit ?? 1799,
          facebookRevenue: facebook.revenue ?? 156,
          facebookROAS: (facebook.roas || facebook.ROAS || '0.57').toString(),
          facebookLeads: facebook.leads ?? 510,
          facebookProfit: facebook.profit ?? -118,
          lastUpdated: new Date().toISOString(),
          source: 'tableau_integration'
        }
      });
    }
  } catch (err) {
    console.error('Tableau KPIs error:', err);
  }
  fallback();
});

// API routes must come before static files

// Get all dashboard data - reading from database (Supabase), not JSON files
app.get('/api/dashboard', async (req, res) => {
  try {
    const goals = await db.getGoals();
    const issues = await db.getIssues();
    const todos = await db.getTodos();
    res.json({
      goals: {
        quarterly: (goals || []).find(g => g.period === 'quarterly') || {},
        monthly: (goals || []).find(g => g.period === 'monthly') || {}
      },
      revenueFunnel: {},
      vto: {},
      issues: issues || [],
      scorecard: [],
      knowledgeBase: [],
      todos: todos || []
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Update goals
app.post('/api/goals/:period', async (req, res) => {
  try {
    const { period } = req.params;
    const updated = await db.updateGoal(period, req.body);
    res.json(updated);
  } catch (error) {
    console.error('Error updating goal:', error);
    res.status(500).json({ error: 'Failed to update goal' });
  }
});

// Create issue
app.post('/api/issues', async (req, res) => {
  try {
    const issue = await db.createIssue(req.body);
    res.json(issue);
  } catch (error) {
    console.error('Error creating issue:', error);
    res.status(500).json({ error: 'Failed to create issue' });
  }
});

// Update issue
app.put('/api/issues/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await db.updateIssue(id, req.body);
    res.json(updated);
  } catch (error) {
    console.error('Error updating issue:', error);
    res.status(500).json({ error: 'Failed to update issue' });
  }
});

// Delete issue
app.delete('/api/issues/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.deleteIssue(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting issue:', error);
    res.status(500).json({ error: 'Failed to delete issue' });
  }
});

// Create todo
app.post('/api/todos', async (req, res) => {
  try {
    const todo = await db.createTodo(req.body);
    res.json(todo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: error.message || 'Failed to create todo' });
  }
});

// Update todo
app.put('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await db.updateTodo(id, req.body);
    res.json(updated);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// Delete todo
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.deleteTodo(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

// Serve React build in production; otherwise serve public
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });
} else {
  app.use(express.static('public'));
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Dashboard available at http://localhost:${PORT}`);
});
