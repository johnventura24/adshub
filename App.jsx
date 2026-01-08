import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Target, TrendingUp, AlertCircle, CheckSquare, BarChart3, Users } from 'lucide-react';

const NinetyHub = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingItem, setEditingItem] = useState(null);
  const [showAddModal, setShowAddModal] = useState(null);

  // State management
  const [goals, setGoals] = useState([]);
  const [rocks, setRocks] = useState([]);
  const [issues, setIssues] = useState([]);
  const [todos, setTodos] = useState([]);
  const [scorecard, setScorecard] = useState([]);

  // Load data from storage
  const loadData = async (key, defaultValue) => {
    try {
      const result = await window.storage.get(key);
      return result ? JSON.parse(result.value) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  // Save data to storage
  const saveData = async (key, data) => {
    try {
      await window.storage.set(key, JSON.stringify(data));
    } catch (err) {
      console.error('Failed to save:', err);
    }
  };

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      setGoals(await loadData('goals', [
        { id: 1, title: 'Q1 Revenue Target', target: 1000000, current: 750000, quarter: 'Q1 2026' },
        { id: 2, title: 'New Customer Acquisition', target: 50, current: 38, quarter: 'Q1 2026' }
      ]));
      
      setRocks(await loadData('rocks', [
        { id: 1, title: 'Launch New Product Line', owner: 'Sarah Chen', dueDate: '2026-03-31', status: 'on-track', progress: 65 },
        { id: 2, title: 'Expand Sales Team', owner: 'Mike Johnson', dueDate: '2026-03-15', status: 'at-risk', progress: 40 }
      ]));
      
      setIssues(await loadData('issues', [
        { id: 1, title: 'Server Performance Issues', priority: 'high', owner: 'Tech Team', status: 'open' },
        { id: 2, title: 'Customer Onboarding Delays', priority: 'medium', owner: 'CS Team', status: 'open' }
      ]));
      
      setTodos(await loadData('todos', [
        { id: 1, title: 'Review Q4 Financial Reports', assignee: 'Finance', dueDate: '2026-01-15', completed: false },
        { id: 2, title: 'Schedule Team Building Event', assignee: 'HR', dueDate: '2026-01-20', completed: false }
      ]));
      
      setScorecard(await loadData('scorecard', [
        { id: 1, metric: 'Customer Satisfaction', target: 90, actual: 92, trend: 'up' },
        { id: 2, metric: 'Monthly Revenue', target: 333000, actual: 280000, trend: 'down' },
        { id: 3, metric: 'Team Productivity', target: 85, actual: 88, trend: 'up' }
      ]));
    };
    loadInitialData();
  }, []);

  // Save data whenever it changes
  useEffect(() => { saveData('goals', goals); }, [goals]);
  useEffect(() => { saveData('rocks', rocks); }, [rocks]);
  useEffect(() => { saveData('issues', issues); }, [issues]);
  useEffect(() => { saveData('todos', todos); }, [todos]);
  useEffect(() => { saveData('scorecard', scorecard); }, [scorecard]);

  // CRUD Operations
  const handleAdd = (type, data) => {
    const newItem = { ...data, id: Date.now() };
    switch(type) {
      case 'goal': setGoals([...goals, newItem]); break;
      case 'rock': setRocks([...rocks, newItem]); break;
      case 'issue': setIssues([...issues, newItem]); break;
      case 'todo': setTodos([...todos, newItem]); break;
      case 'scorecard': setScorecard([...scorecard, newItem]); break;
    }
    setShowAddModal(null);
  };

  const handleEdit = (type, id, data) => {
    switch(type) {
      case 'goal': setGoals(goals.map(g => g.id === id ? { ...g, ...data } : g)); break;
      case 'rock': setRocks(rocks.map(r => r.id === id ? { ...r, ...data } : r)); break;
      case 'issue': setIssues(issues.map(i => i.id === id ? { ...i, ...data } : i)); break;
      case 'todo': setTodos(todos.map(t => t.id === id ? { ...t, ...data } : t)); break;
      case 'scorecard': setScorecard(scorecard.map(s => s.id === id ? { ...s, ...data } : s)); break;
    }
    setEditingItem(null);
  };

  const handleDelete = (type, id) => {
    switch(type) {
      case 'goal': setGoals(goals.filter(g => g.id !== id)); break;
      case 'rock': setRocks(rocks.filter(r => r.id !== id)); break;
      case 'issue': setIssues(issues.filter(i => i.id !== id)); break;
      case 'todo': setTodos(todos.filter(t => t.id !== id)); break;
      case 'scorecard': setScorecard(scorecard.filter(s => s.id !== id)); break;
    }
  };

  // Modal Components
  const AddGoalModal = () => {
    const [formData, setFormData] = useState({ title: '', target: 0, current: 0, quarter: 'Q1 2026' });
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96">
          <h3 className="text-xl font-bold mb-4">Add New Goal</h3>
          <input className="w-full p-2 border rounded mb-3" placeholder="Goal Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
          <input className="w-full p-2 border rounded mb-3" type="number" placeholder="Target" value={formData.target} onChange={(e) => setFormData({...formData, target: parseInt(e.target.value)})} />
          <input className="w-full p-2 border rounded mb-3" type="number" placeholder="Current Progress" value={formData.current} onChange={(e) => setFormData({...formData, current: parseInt(e.target.value)})} />
          <input className="w-full p-2 border rounded mb-4" placeholder="Quarter" value={formData.quarter} onChange={(e) => setFormData({...formData, quarter: e.target.value})} />
          <div className="flex gap-2">
            <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700" onClick={() => handleAdd('goal', formData)}>Add Goal</button>
            <button className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400" onClick={() => setShowAddModal(null)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  const AddRockModal = () => {
    const [formData, setFormData] = useState({ title: '', owner: '', dueDate: '', status: 'on-track', progress: 0 });
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96">
          <h3 className="text-xl font-bold mb-4">Add New Rock</h3>
          <input className="w-full p-2 border rounded mb-3" placeholder="Rock Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
          <input className="w-full p-2 border rounded mb-3" placeholder="Owner" value={formData.owner} onChange={(e) => setFormData({...formData, owner: e.target.value})} />
          <input className="w-full p-2 border rounded mb-3" type="date" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} />
          <select className="w-full p-2 border rounded mb-3" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
            <option value="on-track">On Track</option>
            <option value="at-risk">At Risk</option>
            <option value="off-track">Off Track</option>
          </select>
          <input className="w-full p-2 border rounded mb-4" type="number" placeholder="Progress %" min="0" max="100" value={formData.progress} onChange={(e) => setFormData({...formData, progress: parseInt(e.target.value)})} />
          <div className="flex gap-2">
            <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700" onClick={() => handleAdd('rock', formData)}>Add Rock</button>
            <button className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400" onClick={() => setShowAddModal(null)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  const AddIssueModal = () => {
    const [formData, setFormData] = useState({ title: '', priority: 'medium', owner: '', status: 'open' });
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96">
          <h3 className="text-xl font-bold mb-4">Add New Issue</h3>
          <input className="w-full p-2 border rounded mb-3" placeholder="Issue Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
          <select className="w-full p-2 border rounded mb-3" value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
          <input className="w-full p-2 border rounded mb-3" placeholder="Owner" value={formData.owner} onChange={(e) => setFormData({...formData, owner: e.target.value})} />
          <div className="flex gap-2">
            <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700" onClick={() => handleAdd('issue', formData)}>Add Issue</button>
            <button className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400" onClick={() => setShowAddModal(null)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  const AddTodoModal = () => {
    const [formData, setFormData] = useState({ title: '', assignee: '', dueDate: '', completed: false });
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96">
          <h3 className="text-xl font-bold mb-4">Add New To-Do</h3>
          <input className="w-full p-2 border rounded mb-3" placeholder="To-Do Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
          <input className="w-full p-2 border rounded mb-3" placeholder="Assignee" value={formData.assignee} onChange={(e) => setFormData({...formData, assignee: e.target.value})} />
          <input className="w-full p-2 border rounded mb-4" type="date" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} />
          <div className="flex gap-2">
            <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700" onClick={() => handleAdd('todo', formData)}>Add To-Do</button>
            <button className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400" onClick={() => setShowAddModal(null)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  const AddScorecardModal = () => {
    const [formData, setFormData] = useState({ metric: '', target: 0, actual: 0, trend: 'neutral' });
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96">
          <h3 className="text-xl font-bold mb-4">Add New Scorecard Metric</h3>
          <input className="w-full p-2 border rounded mb-3" placeholder="Metric Name" value={formData.metric} onChange={(e) => setFormData({...formData, metric: e.target.value})} />
          <input className="w-full p-2 border rounded mb-3" type="number" placeholder="Target" value={formData.target} onChange={(e) => setFormData({...formData, target: parseInt(e.target.value)})} />
          <input className="w-full p-2 border rounded mb-3" type="number" placeholder="Actual" value={formData.actual} onChange={(e) => setFormData({...formData, actual: parseInt(e.target.value)})} />
          <select className="w-full p-2 border rounded mb-4" value={formData.trend} onChange={(e) => setFormData({...formData, trend: e.target.value})}>
            <option value="up">Trending Up</option>
            <option value="down">Trending Down</option>
            <option value="neutral">Neutral</option>
          </select>
          <div className="flex gap-2">
            <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700" onClick={() => handleAdd('scorecard', formData)}>Add Metric</button>
            <button className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400" onClick={() => setShowAddModal(null)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  // Dashboard Component
  const Dashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Goals on Track</p>
              <p className="text-3xl font-bold mt-1">{goals.filter(g => (g.current/g.target) >= 0.7).length}/{goals.length}</p>
            </div>
            <Target className="w-10 h-10 opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Rocks Progress</p>
              <p className="text-3xl font-bold mt-1">{rocks.filter(r => r.progress === 100).length}/{rocks.length}</p>
            </div>
            <TrendingUp className="w-10 h-10 opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Open Issues</p>
              <p className="text-3xl font-bold mt-1">{issues.filter(i => i.status === 'open').length}</p>
            </div>
            <AlertCircle className="w-10 h-10 opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">To-Dos Pending</p>
              <p className="text-3xl font-bold mt-1">{todos.filter(t => !t.completed).length}</p>
            </div>
            <CheckSquare className="w-10 h-10 opacity-80" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><Target className="w-5 h-5 text-blue-600" />Goals</h3>
          {goals.slice(0, 3).map(goal => (
            <div key={goal.id} className="mb-3 p-3 bg-gray-50 rounded">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-sm">{goal.title}</span>
                <span className="text-xs text-gray-500">{goal.quarter}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(goal.current / goal.target) * 100}%` }} />
              </div>
              <div className="text-xs text-gray-600 mt-1">{goal.current.toLocaleString()} / {goal.target.toLocaleString()} ({Math.round((goal.current / goal.target) * 100)}%)</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-green-600" />Rocks</h3>
          {rocks.slice(0, 3).map(rock => (
            <div key={rock.id} className="mb-3 p-3 bg-gray-50 rounded">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-sm">{rock.title}</span>
                <span className={`text-xs px-2 py-1 rounded ${rock.status === 'on-track' ? 'bg-green-100 text-green-700' : rock.status === 'at-risk' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{rock.status}</span>
              </div>
              <div className="text-xs text-gray-600 mb-2">Owner: {rock.owner} • Due: {rock.dueDate}</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: `${rock.progress}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><AlertCircle className="w-5 h-5 text-orange-600" />Issues</h3>
          {issues.slice(0, 3).map(issue => (
            <div key={issue.id} className="mb-3 p-3 bg-gray-50 rounded flex items-center justify-between">
              <div>
                <span className="font-medium text-sm block">{issue.title}</span>
                <span className="text-xs text-gray-600">{issue.owner}</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${issue.priority === 'critical' ? 'bg-red-100 text-red-700' : issue.priority === 'high' ? 'bg-orange-100 text-orange-700' : issue.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>{issue.priority}</span>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2"><CheckSquare className="w-5 h-5 text-purple-600" />To-Dos</h3>
          {todos.slice(0, 5).map(todo => (
            <div key={todo.id} className="mb-2 p-2 bg-gray-50 rounded flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input type="checkbox" checked={todo.completed} onChange={() => handleEdit('todo', todo.id, { completed: !todo.completed })} className="w-4 h-4" />
                <span className={`text-sm ${todo.completed ? 'line-through text-gray-400' : ''}`}>{todo.title}</span>
              </div>
              <span className="text-xs text-gray-500">{todo.dueDate}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Goals Component
  const Goals = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-2xl font-bold">Goals</h2>
        <button onClick={() => setShowAddModal('goal')} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"><Plus className="w-4 h-4" /> Add Goal</button>
      </div>
      <div className="p-6 space-y-4">
        {goals.map(goal => (
          <div key={goal.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-lg">{goal.title}</h3>
                <span className="text-sm text-gray-600">{goal.quarter}</span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditingItem({ type: 'goal', id: goal.id, data: goal })} className="text-blue-600 hover:text-blue-700"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete('goal', goal.id)} className="text-red-600 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div className="bg-blue-600 h-3 rounded-full transition-all" style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }} />
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>{goal.current.toLocaleString()} / {goal.target.toLocaleString()}</span>
              <span className="font-bold">{Math.round((goal.current / goal.target) * 100)}%</span>
            </div>
          </div>
        ))}
        {goals.length === 0 && <div className="text-center py-12 text-gray-500">No goals yet. Click "Add Goal" to create your first goal.</div>}
      </div>
    </div>
  );

  // Rocks Component
  const Rocks = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-2xl font-bold">Rocks (90-Day Priorities)</h2>
        <button onClick={() => setShowAddModal('rock')} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"><Plus className="w-4 h-4" /> Add Rock</button>
      </div>
      <div className="p-6 space-y-4">
        {rocks.map(rock => (
          <div key={rock.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-lg">{rock.title}</h3>
                <div className="flex gap-4 text-sm text-gray-600 mt-1">
                  <span>Owner: {rock.owner}</span>
                  <span>Due: {rock.dueDate}</span>
                </div>
              </div>
              <div className="flex gap-2 items-center">
                <span className={`text-xs px-2 py-1 rounded ${rock.status === 'on-track' ? 'bg-green-100 text-green-700' : rock.status === 'at-risk' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{rock.status}</span>
                <button onClick={() => setEditingItem({ type: 'rock', id: rock.id, data: rock })} className="text-blue-600 hover:text-blue-700"><Edit2 className="w-4 h-4" /></button>
                <button onClick={() => handleDelete('rock', rock.id)} className="text-red-600 hover:text-red-700"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div className={`h-3 rounded-full transition-all ${rock.status === 'on-track' ? 'bg-green-600' : rock.status === 'at-risk' ? 'bg-yellow-500' : 'bg-red-600'}`} style={{ width: `${rock.progress}%` }} />
            </div>
            <div className="text-sm text-gray-600 text-right">{rock.progress}% Complete</div>
          </div>
        ))}
        {rocks.length === 0 && <div className="text-center py-12 text-gray-500">No rocks yet. Click "Add Rock" to create your first 90-day priority.</div>}
      </div>
    </div>
  );

  // Issues Component
  const Issues = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-2xl font-bold">Issues</h2>
        <button onClick={() => setShowAddModal('issue')} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2"><Plus className="w-4 h-4" /> Add Issue</button>
      </div>
      <div className="p-6 space-y-3">
        {issues.map(issue => (
          <div key={issue.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-bold">{issue.title}</h3>
              <div className="flex gap-4 text-sm text-gray-600 mt-1">
                <span>Owner: {issue.owner}</span>
                <span>Status: {issue.status}</span>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <span className={`text-xs px-3 py-1 rounded font-medium ${issue.priority === 'critical' ? 'bg-red-100 text-red-700' : issue.priority === 'high' ? 'bg-orange-100 text-orange-700' : issue.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>{issue.priority}</span>
              <button onClick={() => handleEdit('issue', issue.id, { status: issue.status === 'open' ? 'resolved' : 'open' })} className={`px-3 py-1 rounded text-sm ${issue.status === 'open' ?
