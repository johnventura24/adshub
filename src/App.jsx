import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Target, TrendingUp, AlertCircle, CheckSquare, BarChart3, Users, X, RefreshCw, ExternalLink, Calendar, Eye } from 'lucide-react';
import './App.css';

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
  const [vto, setVto] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [goals3Year, setGoals3Year] = useState([]);
  const [goals1Year, setGoals1Year] = useState([]);
  const [goals90Day, setGoals90Day] = useState([]);
  const [accountabilityChart, setAccountabilityChart] = useState([]);
  
  // Tableau KPIs state
  const [tableauKPIs, setTableauKPIs] = useState(null);
  const [tableauLoading, setTableauLoading] = useState(false);
  const [tableauError, setTableauError] = useState(null);
  const [lastTableauUpdate, setLastTableauUpdate] = useState(null);

  // Load data from localStorage
  const loadData = (key, defaultValue) => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  // Save data to localStorage
  const saveData = (key, data) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (err) {
      console.error('Failed to save:', err);
    }
  };

  // Fetch Tableau KPIs
  const fetchTableauKPIs = async () => {
    setTableauLoading(true);
    setTableauError(null);
    
    try {
      console.log('📊 Fetching Tableau KPIs...');
      // Use relative URL in production (backend serves everything)
      // Use direct URL in development (React dev server on 3001, backend on 3000)
      const apiUrl = process.env.NODE_ENV === 'production' 
        ? '/api/tableau/kpis' 
        : 'http://localhost:3000/api/tableau/kpis';
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success) {
        setTableauKPIs(result.data);
        setLastTableauUpdate(new Date());
        console.log('✅ Tableau KPIs loaded:', result.data);
      } else {
        throw new Error(result.error || 'Failed to fetch Tableau data');
      }
    } catch (error) {
      console.error('❌ Error fetching Tableau KPIs:', error);
      setTableauError(error.message);
      
      // Set fallback data so the app still works
      setTableauKPIs({
        leads: 16469,
        prospects: 9881,
        qualified: 4940,
        proposals: 2470,
        closed: 1811,
        revenue: 11123,
        googleRevenue: 10967,
        googleROAS: "1.20",
        googleLeads: 15959,
        googleProfit: 1799,
        facebookRevenue: 156,
        facebookROAS: "0.57",
        facebookLeads: 510,
        facebookProfit: -118,
        lastUpdated: new Date().toISOString(),
        source: 'fallback_data'
      });
      setLastTableauUpdate(new Date());
      console.log('ℹ️ Using fallback Tableau data');
    } finally {
      setTableauLoading(false);
    }
  };

  // Load initial data
  useEffect(() => {
    try {
      setGoals(loadData('goals', [
        { id: 1, title: 'Q1 Revenue Target', target: 1000000, current: 750000, quarter: 'Q1 2026' },
        { id: 2, title: 'New Customer Acquisition', target: 50, current: 38, quarter: 'Q1 2026' }
      ]));
      
      setRocks(loadData('rocks', [
        { id: 1, title: 'Launch New Product Line', owner: 'Sarah Chen', dueDate: '2026-03-31', status: 'on-track', progress: 65 },
        { id: 2, title: 'Expand Sales Team', owner: 'Mike Johnson', dueDate: '2026-03-15', status: 'at-risk', progress: 40 }
      ]));
      
      setIssues(loadData('issues', [
        { id: 1, title: 'Server Performance Issues', priority: 'high', owner: 'Tech Team', status: 'open' },
        { id: 2, title: 'Customer Onboarding Delays', priority: 'medium', owner: 'CS Team', status: 'open' }
      ]));
      
      setTodos(loadData('todos', [
        { id: 1, title: 'Review Q4 Financial Reports', assignee: 'Finance', dueDate: '2026-01-15', completed: false },
        { id: 2, title: 'Schedule Team Building Event', assignee: 'HR', dueDate: '2026-01-20', completed: false }
      ]));
      
      setScorecard(loadData('scorecard', [
        { id: 1, metric: 'Customer Satisfaction', target: 90, actual: 92, trend: 'up' },
        { id: 2, metric: 'Monthly Revenue', target: 333000, actual: 280000, trend: 'down' },
        { id: 3, metric: 'Team Productivity', target: 85, actual: 88, trend: 'up' }
      ]));
      
      setGoals3Year(loadData('goals3Year', []));
      setGoals1Year(loadData('goals1Year', []));
      setGoals90Day(loadData('goals90Day', []));
      setAccountabilityChart(loadData('accountabilityChart', []));
      
      setVto(loadData('vto', [
        // Core Values
        { id: 1, category: 'vision', type: 'core-values', title: 'Live with Integrity', description: 'At Adsync we LIVE WITH INTEGRITY. We show up all day, everyday with the best intentions and a strong moral compass. We do what we say we\'re going to do and we do the right thing even when it\'s not easy. We wear our hearts on our sleeve and were someone you can always rely on.', addedBy: 'Adsync Leadership', assignedTo: 'All Team Members' },
        { id: 2, category: 'vision', type: 'core-values', title: 'Be Achievement Hungry', description: 'We ARE ACHIEVEMENT HUNGRY. We have a passion for excellence and strong drive to be the best at what we do. We NEVER give up and were relentlessly on the pursuit of results, smashing goals, and becoming the very best version of ourselves.', addedBy: 'Adsync Leadership', assignedTo: 'All Team Members' },
        { id: 3, category: 'vision', type: 'core-values', title: 'Take Massive Action', description: 'We TAKE MASSIVE ACTION. We are pioneers, we do not follow. We are bold with our actions and always find ways to do "the impossible." We are clever problem solvers; resourceful and innovate with our solutions. Were quick to adapt but with a fanatical attention to detail. We do not leave for tomorrow, what can be done today.', addedBy: 'Adsync Leadership', assignedTo: 'All Team Members' },
        { id: 4, category: 'vision', type: 'core-values', title: 'Take Extreme Ownership', description: 'We TAKE EXTREME OWNERSHIP. We take pride in what we do. We take responsibility for our actions or inactions, and we hold each other accountable to the highest regards.', addedBy: 'Adsync Leadership', assignedTo: 'All Team Members' },
        { id: 5, category: 'vision', type: 'core-values', title: 'Be Compassionate', description: 'AND We ARE COMPASSIONATE. We truly give a damn and are open and understanding of others. We listen to everyones perspective and treat all with respect.', addedBy: 'Adsync Leadership', assignedTo: 'All Team Members' },
        // Core Focus
        { id: 6, category: 'vision', type: 'core-focus', title: 'Purpose/Cause/Passion', description: 'Connect people with life changing solutions', addedBy: 'Adsync Leadership', assignedTo: 'All Team Members' },
        { id: 7, category: 'vision', type: 'core-focus', title: 'Niche', description: 'We acquire high intent customers.', addedBy: 'Adsync Leadership', assignedTo: 'All Team Members' },
        // 10 Year Target
        { id: 8, category: 'vision', type: '10-year-target', title: '10 Year Target™', description: 'By 2033, Be The Top Online Customer Acquisition Company In Our Core Verticals With Over $1 Billion In Combined Revenue.', addedBy: 'Adsync Leadership', assignedTo: 'All Team Members' },
        // Go to Market Strategy
        { id: 9, category: 'vision', type: 'marketing-strategy', title: 'Target Market', description: 'Three Uniques:\n• Consistently below industry standard CPAs\n• All traffic and media is generated in-house and CMS compliant\n• High consistent volume - with preferrencial payment terms', addedBy: 'Adsync Leadership', assignedTo: 'All Team Members' },
        { id: 10, category: 'vision', type: 'marketing-strategy', title: 'Proven Process', description: 'Guarantee: We will lower your CPA by 20% guaranteed.', addedBy: 'Adsync Leadership', assignedTo: 'All Team Members' }
      ]));
      setMeetings(loadData('meetings', []));
      
      // Fetch Tableau KPIs on mount (with slight delay to ensure everything is loaded)
      const timeoutId = setTimeout(() => {
        fetchTableauKPIs().catch(err => {
          console.error('Failed to fetch Tableau KPIs:', err);
        });
      }, 1000);
      
      // Auto-refresh Tableau data every 5 minutes
      const refreshInterval = setInterval(() => {
        console.log('🔄 Auto-refreshing Tableau data...');
        fetchTableauKPIs().catch(err => {
          console.error('Auto-refresh failed:', err);
        });
      }, 5 * 60 * 1000);
      
      return () => {
        clearTimeout(timeoutId);
        clearInterval(refreshInterval);
      };
    } catch (error) {
      console.error('Error in useEffect:', error);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save data whenever it changes
  useEffect(() => { saveData('goals', goals); }, [goals]);
  useEffect(() => { saveData('rocks', rocks); }, [rocks]);
  useEffect(() => { saveData('issues', issues); }, [issues]);
  useEffect(() => { saveData('todos', todos); }, [todos]);
  useEffect(() => { saveData('scorecard', scorecard); }, [scorecard]);
  useEffect(() => { saveData('vto', vto); }, [vto]);
  useEffect(() => { saveData('meetings', meetings); }, [meetings]);
  useEffect(() => { saveData('goals3Year', goals3Year); }, [goals3Year]);
  useEffect(() => { saveData('goals1Year', goals1Year); }, [goals1Year]);
  useEffect(() => { saveData('goals90Day', goals90Day); }, [goals90Day]);
  useEffect(() => { saveData('accountabilityChart', accountabilityChart); }, [accountabilityChart]);

  // CRUD Operations
  const handleAdd = (type, data) => {
    const newItem = { ...data, id: Date.now() };
    switch(type) {
      case 'goal': setGoals([...goals, newItem]); break;
      case 'rock': setRocks([...rocks, newItem]); break;
      case 'issue': setIssues([...issues, newItem]); break;
      case 'todo': setTodos([...todos, newItem]); break;
      case 'scorecard': setScorecard([...scorecard, newItem]); break;
      case 'vto': setVto([...vto, newItem]); break;
      case 'meeting': setMeetings([...meetings, newItem]); break;
      case 'goal3Year': setGoals3Year([...goals3Year, newItem]); break;
      case 'goal1Year': setGoals1Year([...goals1Year, newItem]); break;
      case 'goal90Day': setGoals90Day([...goals90Day, newItem]); break;
      case 'accountability': setAccountabilityChart([...accountabilityChart, newItem]); break;
      default: break;
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
      case 'vto': setVto(vto.map(v => v.id === id ? { ...v, ...data } : v)); break;
      case 'meeting': setMeetings(meetings.map(m => m.id === id ? { ...m, ...data } : m)); break;
      case 'goal3Year': setGoals3Year(goals3Year.map(g => g.id === id ? { ...g, ...data } : g)); break;
      case 'goal1Year': setGoals1Year(goals1Year.map(g => g.id === id ? { ...g, ...data } : g)); break;
      case 'goal90Day': setGoals90Day(goals90Day.map(g => g.id === id ? { ...g, ...data } : g)); break;
      case 'accountability': setAccountabilityChart(accountabilityChart.map(a => a.id === id ? { ...a, ...data } : a)); break;
      default: break;
    }
    setEditingItem(null);
  };

  const handleDelete = (type, id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      switch(type) {
        case 'goal': setGoals(goals.filter(g => g.id !== id)); break;
        case 'rock': setRocks(rocks.filter(r => r.id !== id)); break;
        case 'issue': setIssues(issues.filter(i => i.id !== id)); break;
        case 'todo': setTodos(todos.filter(t => t.id !== id)); break;
        case 'scorecard': setScorecard(scorecard.filter(s => s.id !== id)); break;
        case 'vto': setVto(vto.filter(v => v.id !== id)); break;
        case 'meeting': setMeetings(meetings.filter(m => m.id !== id)); break;
        case 'goal3Year': setGoals3Year(goals3Year.filter(g => g.id !== id)); break;
        case 'goal1Year': setGoals1Year(goals1Year.filter(g => g.id !== id)); break;
        case 'goal90Day': setGoals90Day(goals90Day.filter(g => g.id !== id)); break;
        case 'accountability': setAccountabilityChart(accountabilityChart.filter(a => a.id !== id)); break;
        default: break;
      }
    }
  };

  // Modal Components
  const AddGoalModal = () => {
    const [formData, setFormData] = useState({ title: '', target: 0, current: 0, quarter: 'Q1 2026', addedBy: '', assignedTo: '' });
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Add New Goal</h3>
            <button onClick={() => setShowAddModal(null)} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          <input className="w-full p-2 border rounded mb-3" placeholder="Goal Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
          <input className="w-full p-2 border rounded mb-3" type="number" placeholder="Target" value={formData.target} onChange={(e) => setFormData({...formData, target: parseInt(e.target.value) || 0})} />
          <input className="w-full p-2 border rounded mb-3" type="number" placeholder="Current Progress" value={formData.current} onChange={(e) => setFormData({...formData, current: parseInt(e.target.value) || 0})} />
          <input className="w-full p-2 border rounded mb-3" placeholder="Quarter (e.g., Q1 2026)" value={formData.quarter} onChange={(e) => setFormData({...formData, quarter: e.target.value})} />
          <input className="w-full p-2 border rounded mb-3" placeholder="Added By" value={formData.addedBy} onChange={(e) => setFormData({...formData, addedBy: e.target.value})} />
          <input className="w-full p-2 border rounded mb-4" placeholder="Assigned To" value={formData.assignedTo} onChange={(e) => setFormData({...formData, assignedTo: e.target.value})} />
          <div className="flex gap-2">
            <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700" onClick={() => handleAdd('goal', formData)}>Add Goal</button>
            <button className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400" onClick={() => setShowAddModal(null)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  const EditGoalModal = ({ item }) => {
    const [formData, setFormData] = useState(item.data);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Edit Goal</h3>
            <button onClick={() => setEditingItem(null)} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          <input className="w-full p-2 border rounded mb-3" placeholder="Goal Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
          <input className="w-full p-2 border rounded mb-3" type="number" placeholder="Target" value={formData.target} onChange={(e) => setFormData({...formData, target: parseInt(e.target.value) || 0})} />
          <input className="w-full p-2 border rounded mb-3" type="number" placeholder="Current Progress" value={formData.current} onChange={(e) => setFormData({...formData, current: parseInt(e.target.value) || 0})} />
          <input className="w-full p-2 border rounded mb-3" placeholder="Quarter" value={formData.quarter} onChange={(e) => setFormData({...formData, quarter: e.target.value})} />
          <input className="w-full p-2 border rounded mb-3" placeholder="Added By" value={formData.addedBy || ''} onChange={(e) => setFormData({...formData, addedBy: e.target.value})} />
          <input className="w-full p-2 border rounded mb-4" placeholder="Assigned To" value={formData.assignedTo || ''} onChange={(e) => setFormData({...formData, assignedTo: e.target.value})} />
          <div className="flex gap-2">
            <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700" onClick={() => handleEdit('goal', item.id, formData)}>Save Changes</button>
            <button className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400" onClick={() => setEditingItem(null)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  // 3 Year Goal Modals
  const AddGoal3YearModal = () => {
    const [formData, setFormData] = useState({ title: '', description: '', target: 0, current: 0, addedBy: '', assignedTo: '' });
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Add 3 Year Goal</h3>
            <button onClick={() => setShowAddModal(null)} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          <input className="w-full p-2 border rounded mb-3" placeholder="Goal Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
          <textarea className="w-full p-2 border rounded mb-3" rows="3" placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          <input className="w-full p-2 border rounded mb-3" type="number" placeholder="Target (optional)" value={formData.target} onChange={(e) => setFormData({...formData, target: parseInt(e.target.value) || 0})} />
          <input className="w-full p-2 border rounded mb-3" type="number" placeholder="Current Progress (optional)" value={formData.current} onChange={(e) => setFormData({...formData, current: parseInt(e.target.value) || 0})} />
          <input className="w-full p-2 border rounded mb-3" placeholder="Added By" value={formData.addedBy} onChange={(e) => setFormData({...formData, addedBy: e.target.value})} />
          <input className="w-full p-2 border rounded mb-4" placeholder="Assigned To" value={formData.assignedTo} onChange={(e) => setFormData({...formData, assignedTo: e.target.value})} />
          <div className="flex gap-2">
            <button className="flex-1 bg-purple-600 text-white py-2 rounded hover:bg-purple-700" onClick={() => handleAdd('goal3Year', formData)}>Add Goal</button>
            <button className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400" onClick={() => setShowAddModal(null)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  const EditGoal3YearModal = ({ item }) => {
    const [formData, setFormData] = useState(item.data);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Edit 3 Year Goal</h3>
            <button onClick={() => setEditingItem(null)} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          <input className="w-full p-2 border rounded mb-3" placeholder="Goal Title" value={formData.title || ''} onChange={(e) => setFormData({...formData, title: e.target.value})} />
          <textarea className="w-full p-2 border rounded mb-3" rows="3" placeholder="Description" value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          <input className="w-full p-2 border rounded mb-3" type="number" placeholder="Target (optional)" value={formData.target || 0} onChange={(e) => setFormData({...formData, target: parseInt(e.target.value) || 0})} />
          <input className="w-full p-2 border rounded mb-3" type="number" placeholder="Current Progress (optional)" value={formData.current || 0} onChange={(e) => setFormData({...formData, current: parseInt(e.target.value) || 0})} />
          <input className="w-full p-2 border rounded mb-3" placeholder="Added By" value={formData.addedBy || ''} onChange={(e) => setFormData({...formData, addedBy: e.target.value})} />
          <input className="w-full p-2 border rounded mb-4" placeholder="Assigned To" value={formData.assignedTo || ''} onChange={(e) => setFormData({...formData, assignedTo: e.target.value})} />
          <div className="flex gap-2">
            <button className="flex-1 bg-purple-600 text-white py-2 rounded hover:bg-purple-700" onClick={() => handleEdit('goal3Year', item.id, formData)}>Save Changes</button>
            <button className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400" onClick={() => setEditingItem(null)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  // 1 Year Goal Modals
  const AddGoal1YearModal = () => {
    const [formData, setFormData] = useState({ title: '', description: '', target: 0, current: 0, addedBy: '', assignedTo: '' });
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Add 1 Year Goal</h3>
            <button onClick={() => setShowAddModal(null)} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          <input className="w-full p-2 border rounded mb-3" placeholder="Goal Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
          <textarea className="w-full p-2 border rounded mb-3" rows="3" placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          <input className="w-full p-2 border rounded mb-3" type="number" placeholder="Target (optional)" value={formData.target} onChange={(e) => setFormData({...formData, target: parseInt(e.target.value) || 0})} />
          <input className="w-full p-2 border rounded mb-3" type="number" placeholder="Current Progress (optional)" value={formData.current} onChange={(e) => setFormData({...formData, current: parseInt(e.target.value) || 0})} />
          <input className="w-full p-2 border rounded mb-3" placeholder="Added By" value={formData.addedBy} onChange={(e) => setFormData({...formData, addedBy: e.target.value})} />
          <input className="w-full p-2 border rounded mb-4" placeholder="Assigned To" value={formData.assignedTo} onChange={(e) => setFormData({...formData, assignedTo: e.target.value})} />
          <div className="flex gap-2">
            <button className="flex-1 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700" onClick={() => handleAdd('goal1Year', formData)}>Add Goal</button>
            <button className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400" onClick={() => setShowAddModal(null)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  const EditGoal1YearModal = ({ item }) => {
    const [formData, setFormData] = useState(item.data);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Edit 1 Year Goal</h3>
            <button onClick={() => setEditingItem(null)} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          <input className="w-full p-2 border rounded mb-3" placeholder="Goal Title" value={formData.title || ''} onChange={(e) => setFormData({...formData, title: e.target.value})} />
          <textarea className="w-full p-2 border rounded mb-3" rows="3" placeholder="Description" value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          <input className="w-full p-2 border rounded mb-3" type="number" placeholder="Target (optional)" value={formData.target || 0} onChange={(e) => setFormData({...formData, target: parseInt(e.target.value) || 0})} />
          <input className="w-full p-2 border rounded mb-3" type="number" placeholder="Current Progress (optional)" value={formData.current || 0} onChange={(e) => setFormData({...formData, current: parseInt(e.target.value) || 0})} />
          <input className="w-full p-2 border rounded mb-3" placeholder="Added By" value={formData.addedBy || ''} onChange={(e) => setFormData({...formData, addedBy: e.target.value})} />
          <input className="w-full p-2 border rounded mb-4" placeholder="Assigned To" value={formData.assignedTo || ''} onChange={(e) => setFormData({...formData, assignedTo: e.target.value})} />
          <div className="flex gap-2">
            <button className="flex-1 bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700" onClick={() => handleEdit('goal1Year', item.id, formData)}>Save Changes</button>
            <button className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400" onClick={() => setEditingItem(null)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  // 90 Day Goal Modals
  const AddGoal90DayModal = () => {
    const [formData, setFormData] = useState({ title: '', description: '', target: 0, current: 0, addedBy: '', assignedTo: '' });
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Add 90 Day Goal</h3>
            <button onClick={() => setShowAddModal(null)} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          <input className="w-full p-2 border rounded mb-3" placeholder="Goal Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
          <textarea className="w-full p-2 border rounded mb-3" rows="3" placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          <input className="w-full p-2 border rounded mb-3" type="number" placeholder="Target (optional)" value={formData.target} onChange={(e) => setFormData({...formData, target: parseInt(e.target.value) || 0})} />
          <input className="w-full p-2 border rounded mb-3" type="number" placeholder="Current Progress (optional)" value={formData.current} onChange={(e) => setFormData({...formData, current: parseInt(e.target.value) || 0})} />
          <input className="w-full p-2 border rounded mb-3" placeholder="Added By" value={formData.addedBy} onChange={(e) => setFormData({...formData, addedBy: e.target.value})} />
          <input className="w-full p-2 border rounded mb-4" placeholder="Assigned To" value={formData.assignedTo} onChange={(e) => setFormData({...formData, assignedTo: e.target.value})} />
          <div className="flex gap-2">
            <button className="flex-1 bg-teal-600 text-white py-2 rounded hover:bg-teal-700" onClick={() => handleAdd('goal90Day', formData)}>Add Goal</button>
            <button className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400" onClick={() => setShowAddModal(null)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  const EditGoal90DayModal = ({ item }) => {
    const [formData, setFormData] = useState(item.data);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Edit 90 Day Goal</h3>
            <button onClick={() => setEditingItem(null)} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          <input className="w-full p-2 border rounded mb-3" placeholder="Goal Title" value={formData.title || ''} onChange={(e) => setFormData({...formData, title: e.target.value})} />
          <textarea className="w-full p-2 border rounded mb-3" rows="3" placeholder="Description" value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          <input className="w-full p-2 border rounded mb-3" type="number" placeholder="Target (optional)" value={formData.target || 0} onChange={(e) => setFormData({...formData, target: parseInt(e.target.value) || 0})} />
          <input className="w-full p-2 border rounded mb-3" type="number" placeholder="Current Progress (optional)" value={formData.current || 0} onChange={(e) => setFormData({...formData, current: parseInt(e.target.value) || 0})} />
          <input className="w-full p-2 border rounded mb-3" placeholder="Added By" value={formData.addedBy || ''} onChange={(e) => setFormData({...formData, addedBy: e.target.value})} />
          <input className="w-full p-2 border rounded mb-4" placeholder="Assigned To" value={formData.assignedTo || ''} onChange={(e) => setFormData({...formData, assignedTo: e.target.value})} />
          <div className="flex gap-2">
            <button className="flex-1 bg-teal-600 text-white py-2 rounded hover:bg-teal-700" onClick={() => handleEdit('goal90Day', item.id, formData)}>Save Changes</button>
            <button className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400" onClick={() => setEditingItem(null)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  const AddRockModal = () => {
    const [formData, setFormData] = useState({ title: '', owner: '', dueDate: '', status: 'on-track', progress: 0, addedBy: '', assignedTo: '' });
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Add New Rock</h3>
            <button onClick={() => setShowAddModal(null)} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          <input className="w-full p-2 border rounded mb-3" placeholder="Rock Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
          <input className="w-full p-2 border rounded mb-3" placeholder="Owner" value={formData.owner} onChange={(e) => setFormData({...formData, owner: e.target.value})} />
          <input className="w-full p-2 border rounded mb-3" type="date" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} />
          <select className="w-full p-2 border rounded mb-3" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
            <option value="on-track">On Track</option>
            <option value="at-risk">At Risk</option>
            <option value="off-track">Off Track</option>
          </select>
          <input className="w-full p-2 border rounded mb-3" type="number" placeholder="Progress %" min="0" max="100" value={formData.progress} onChange={(e) => setFormData({...formData, progress: parseInt(e.target.value) || 0})} />
          <input className="w-full p-2 border rounded mb-3" placeholder="Added By" value={formData.addedBy} onChange={(e) => setFormData({...formData, addedBy: e.target.value})} />
          <input className="w-full p-2 border rounded mb-4" placeholder="Assigned To" value={formData.assignedTo} onChange={(e) => setFormData({...formData, assignedTo: e.target.value})} />
          <div className="flex gap-2">
            <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700" onClick={() => handleAdd('rock', formData)}>Add Rock</button>
            <button className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400" onClick={() => setShowAddModal(null)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  const EditRockModal = ({ item }) => {
    const [formData, setFormData] = useState(item.data);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Edit Rock</h3>
            <button onClick={() => setEditingItem(null)} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          <input className="w-full p-2 border rounded mb-3" placeholder="Rock Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
          <input className="w-full p-2 border rounded mb-3" placeholder="Owner" value={formData.owner} onChange={(e) => setFormData({...formData, owner: e.target.value})} />
          <input className="w-full p-2 border rounded mb-3" type="date" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} />
          <select className="w-full p-2 border rounded mb-3" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
            <option value="on-track">On Track</option>
            <option value="at-risk">At Risk</option>
            <option value="off-track">Off Track</option>
          </select>
          <input className="w-full p-2 border rounded mb-3" type="number" placeholder="Progress %" min="0" max="100" value={formData.progress} onChange={(e) => setFormData({...formData, progress: parseInt(e.target.value) || 0})} />
          <input className="w-full p-2 border rounded mb-3" placeholder="Added By" value={formData.addedBy || ''} onChange={(e) => setFormData({...formData, addedBy: e.target.value})} />
          <input className="w-full p-2 border rounded mb-4" placeholder="Assigned To" value={formData.assignedTo || ''} onChange={(e) => setFormData({...formData, assignedTo: e.target.value})} />
          <div className="flex gap-2">
            <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700" onClick={() => handleEdit('rock', item.id, formData)}>Save Changes</button>
            <button className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400" onClick={() => setEditingItem(null)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  const AddIssueModal = () => {
    const [formData, setFormData] = useState({ title: '', priority: 'medium', owner: '', status: 'open', addedBy: '', assignedTo: '' });
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Add New Issue</h3>
            <button onClick={() => setShowAddModal(null)} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          <input className="w-full p-2 border rounded mb-3" placeholder="Issue Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
          <select className="w-full p-2 border rounded mb-3" value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
          <input className="w-full p-2 border rounded mb-3" placeholder="Owner" value={formData.owner} onChange={(e) => setFormData({...formData, owner: e.target.value})} />
          <input className="w-full p-2 border rounded mb-3" placeholder="Added By" value={formData.addedBy} onChange={(e) => setFormData({...formData, addedBy: e.target.value})} />
          <input className="w-full p-2 border rounded mb-3" placeholder="Assigned To" value={formData.assignedTo} onChange={(e) => setFormData({...formData, assignedTo: e.target.value})} />
          <div className="flex gap-2">
            <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700" onClick={() => handleAdd('issue', formData)}>Add Issue</button>
            <button className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400" onClick={() => setShowAddModal(null)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  const EditIssueModal = ({ item }) => {
    const [formData, setFormData] = useState(item.data);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Edit Issue</h3>
            <button onClick={() => setEditingItem(null)} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          <input className="w-full p-2 border rounded mb-3" placeholder="Issue Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
          <select className="w-full p-2 border rounded mb-3" value={formData.priority} onChange={(e) => setFormData({...formData, priority: e.target.value})}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
          <input className="w-full p-2 border rounded mb-3" placeholder="Owner" value={formData.owner} onChange={(e) => setFormData({...formData, owner: e.target.value})} />
          <select className="w-full p-2 border rounded mb-3" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
            <option value="open">Open</option>
            <option value="resolved">Resolved</option>
          </select>
          <input className="w-full p-2 border rounded mb-3" placeholder="Added By" value={formData.addedBy || ''} onChange={(e) => setFormData({...formData, addedBy: e.target.value})} />
          <input className="w-full p-2 border rounded mb-4" placeholder="Assigned To" value={formData.assignedTo || ''} onChange={(e) => setFormData({...formData, assignedTo: e.target.value})} />
          <div className="flex gap-2">
            <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700" onClick={() => handleEdit('issue', item.id, formData)}>Save Changes</button>
            <button className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400" onClick={() => setEditingItem(null)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  const AddTodoModal = () => {
    const [formData, setFormData] = useState({ title: '', assignee: '', dueDate: '', completed: false, addedBy: '', assignedTo: '' });
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Add New To-Do</h3>
            <button onClick={() => setShowAddModal(null)} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          <input className="w-full p-2 border rounded mb-3" placeholder="To-Do Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
          <input className="w-full p-2 border rounded mb-3" placeholder="Assignee" value={formData.assignee} onChange={(e) => setFormData({...formData, assignee: e.target.value})} />
          <input className="w-full p-2 border rounded mb-3" type="date" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} />
          <input className="w-full p-2 border rounded mb-3" placeholder="Added By" value={formData.addedBy} onChange={(e) => setFormData({...formData, addedBy: e.target.value})} />
          <input className="w-full p-2 border rounded mb-4" placeholder="Assigned To" value={formData.assignedTo} onChange={(e) => setFormData({...formData, assignedTo: e.target.value})} />
          <div className="flex gap-2">
            <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700" onClick={() => handleAdd('todo', formData)}>Add To-Do</button>
            <button className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400" onClick={() => setShowAddModal(null)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  const EditTodoModal = ({ item }) => {
    const [formData, setFormData] = useState(item.data);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Edit To-Do</h3>
            <button onClick={() => setEditingItem(null)} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          <input className="w-full p-2 border rounded mb-3" placeholder="To-Do Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
          <input className="w-full p-2 border rounded mb-3" placeholder="Assignee" value={formData.assignee} onChange={(e) => setFormData({...formData, assignee: e.target.value})} />
          <input className="w-full p-2 border rounded mb-3" type="date" value={formData.dueDate} onChange={(e) => setFormData({...formData, dueDate: e.target.value})} />
          <input className="w-full p-2 border rounded mb-3" placeholder="Added By" value={formData.addedBy || ''} onChange={(e) => setFormData({...formData, addedBy: e.target.value})} />
          <input className="w-full p-2 border rounded mb-4" placeholder="Assigned To" value={formData.assignedTo || ''} onChange={(e) => setFormData({...formData, assignedTo: e.target.value})} />
          <div className="flex gap-2">
            <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700" onClick={() => handleEdit('todo', item.id, formData)}>Save Changes</button>
            <button className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400" onClick={() => setEditingItem(null)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  const AddScorecardModal = () => {
    const [formData, setFormData] = useState({ metric: '', target: 0, actual: 0, trend: 'neutral', addedBy: '', assignedTo: '' });
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Add New Scorecard Metric</h3>
            <button onClick={() => setShowAddModal(null)} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          <input className="w-full p-2 border rounded mb-3" placeholder="Metric Name" value={formData.metric} onChange={(e) => setFormData({...formData, metric: e.target.value})} />
          <input className="w-full p-2 border rounded mb-3" type="number" placeholder="Target" value={formData.target} onChange={(e) => setFormData({...formData, target: parseInt(e.target.value) || 0})} />
          <input className="w-full p-2 border rounded mb-3" type="number" placeholder="Actual" value={formData.actual} onChange={(e) => setFormData({...formData, actual: parseInt(e.target.value) || 0})} />
          <select className="w-full p-2 border rounded mb-3" value={formData.trend} onChange={(e) => setFormData({...formData, trend: e.target.value})}>
            <option value="up">Trending Up</option>
            <option value="down">Trending Down</option>
            <option value="neutral">Neutral</option>
          </select>
          <input className="w-full p-2 border rounded mb-3" placeholder="Added By" value={formData.addedBy} onChange={(e) => setFormData({...formData, addedBy: e.target.value})} />
          <input className="w-full p-2 border rounded mb-4" placeholder="Assigned To" value={formData.assignedTo} onChange={(e) => setFormData({...formData, assignedTo: e.target.value})} />
          <div className="flex gap-2">
            <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700" onClick={() => handleAdd('scorecard', formData)}>Add Metric</button>
            <button className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400" onClick={() => setShowAddModal(null)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  const EditScorecardModal = ({ item }) => {
    const [formData, setFormData] = useState(item.data);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Edit Scorecard Metric</h3>
            <button onClick={() => setEditingItem(null)} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          <input className="w-full p-2 border rounded mb-3" placeholder="Metric Name" value={formData.metric} onChange={(e) => setFormData({...formData, metric: e.target.value})} />
          <input className="w-full p-2 border rounded mb-3" type="number" placeholder="Target" value={formData.target} onChange={(e) => setFormData({...formData, target: parseInt(e.target.value) || 0})} />
          <input className="w-full p-2 border rounded mb-3" type="number" placeholder="Actual" value={formData.actual} onChange={(e) => setFormData({...formData, actual: parseInt(e.target.value) || 0})} />
          <select className="w-full p-2 border rounded mb-4" value={formData.trend} onChange={(e) => setFormData({...formData, trend: e.target.value})}>
            <option value="up">Trending Up</option>
            <option value="down">Trending Down</option>
            <option value="neutral">Neutral</option>
          </select>
          <div className="flex gap-2">
            <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700" onClick={() => handleEdit('scorecard', item.id, formData)}>Save Changes</button>
            <button className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400" onClick={() => setEditingItem(null)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  // VTO (Vision/Traction Organizer) Modals
  const AddVTOModal = () => {
    const [formData, setFormData] = useState({ category: 'vision', title: '', description: '', type: 'core-values', addedBy: '', assignedTo: '' });
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Add to Vision/Traction Organizer</h3>
            <button onClick={() => setShowAddModal(null)} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          <select className="w-full p-2 border rounded mb-3" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
            <option value="vision">Vision</option>
            <option value="traction">Traction</option>
          </select>
          <select className="w-full p-2 border rounded mb-3" value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})}>
            {formData.category === 'vision' ? (
              <>
                <option value="core-values">Core Values</option>
                <option value="core-focus">Core Focus</option>
                <option value="10-year-target">10-Year Target</option>
                <option value="marketing-strategy">Marketing Strategy</option>
                <option value="3-year-picture">3-Year Picture</option>
                <option value="1-year-plan">1-Year Plan</option>
                <option value="quarterly-priorities">Quarterly Priorities</option>
              </>
            ) : (
              <>
                <option value="rocks">Rocks (90-Day Priorities)</option>
                <option value="quarterly-goals">Quarterly Goals</option>
                <option value="weekly-meetings">Weekly Meeting Agendas</option>
                <option value="scorecard">Scorecard Metrics</option>
                <option value="accountability">Accountability Chart</option>
              </>
            )}
          </select>
          <input className="w-full p-2 border rounded mb-3" placeholder="Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
          <textarea className="w-full p-2 border rounded mb-3" rows="4" placeholder="Description" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          <input className="w-full p-2 border rounded mb-3" placeholder="Added By" value={formData.addedBy} onChange={(e) => setFormData({...formData, addedBy: e.target.value})} />
          <input className="w-full p-2 border rounded mb-4" placeholder="Assigned To" value={formData.assignedTo} onChange={(e) => setFormData({...formData, assignedTo: e.target.value})} />
          <div className="flex gap-2">
            <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700" onClick={() => handleAdd('vto', formData)}>Add to VTO</button>
            <button className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400" onClick={() => setShowAddModal(null)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  const EditVTOModal = ({ item }) => {
    const [formData, setFormData] = useState(item.data);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Edit Vision/Traction Organizer</h3>
            <button onClick={() => setEditingItem(null)} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          <select className="w-full p-2 border rounded mb-3" value={formData.category || 'vision'} onChange={(e) => setFormData({...formData, category: e.target.value})}>
            <option value="vision">Vision</option>
            <option value="traction">Traction</option>
          </select>
          <select className="w-full p-2 border rounded mb-3" value={formData.type || 'core-values'} onChange={(e) => setFormData({...formData, type: e.target.value})}>
            {formData.category === 'vision' ? (
              <>
                <option value="core-values">Core Values</option>
                <option value="core-focus">Core Focus</option>
                <option value="10-year-target">10-Year Target</option>
                <option value="marketing-strategy">Marketing Strategy</option>
                <option value="3-year-picture">3-Year Picture</option>
                <option value="1-year-plan">1-Year Plan</option>
                <option value="quarterly-priorities">Quarterly Priorities</option>
              </>
            ) : (
              <>
                <option value="rocks">Rocks (90-Day Priorities)</option>
                <option value="quarterly-goals">Quarterly Goals</option>
                <option value="weekly-meetings">Weekly Meeting Agendas</option>
                <option value="scorecard">Scorecard Metrics</option>
                <option value="accountability">Accountability Chart</option>
              </>
            )}
          </select>
          <input className="w-full p-2 border rounded mb-3" placeholder="Title" value={formData.title || ''} onChange={(e) => setFormData({...formData, title: e.target.value})} />
          <textarea className="w-full p-2 border rounded mb-3" rows="4" placeholder="Description" value={formData.description || ''} onChange={(e) => setFormData({...formData, description: e.target.value})} />
          <input className="w-full p-2 border rounded mb-3" placeholder="Added By" value={formData.addedBy || ''} onChange={(e) => setFormData({...formData, addedBy: e.target.value})} />
          <input className="w-full p-2 border rounded mb-4" placeholder="Assigned To" value={formData.assignedTo || ''} onChange={(e) => setFormData({...formData, assignedTo: e.target.value})} />
          <div className="flex gap-2">
            <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700" onClick={() => handleEdit('vto', item.id, formData)}>Save Changes</button>
            <button className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400" onClick={() => setEditingItem(null)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  // Meetings Modals
  const AddMeetingModal = () => {
    const [formData, setFormData] = useState({ title: '', meetingType: 'weekly', date: '', time: '', attendees: '', status: 'scheduled', addedBy: '', assignedTo: '' });
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Add New Meeting</h3>
            <button onClick={() => setShowAddModal(null)} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          <input className="w-full p-2 border rounded mb-3" placeholder="Meeting Title" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
          <select className="w-full p-2 border rounded mb-3" value={formData.meetingType} onChange={(e) => setFormData({...formData, meetingType: e.target.value})}>
            <option value="weekly">Weekly</option>
            <option value="quarterly">Quarterly</option>
            <option value="one-on-one">One-on-One</option>
            <option value="team">Team Meeting</option>
            <option value="all-hands">All Hands</option>
            <option value="other">Other</option>
          </select>
          <input className="w-full p-2 border rounded mb-3" type="date" placeholder="Date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} />
          <input className="w-full p-2 border rounded mb-3" type="time" placeholder="Time" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} />
          <input className="w-full p-2 border rounded mb-3" placeholder="Attendees (comma separated)" value={formData.attendees} onChange={(e) => setFormData({...formData, attendees: e.target.value})} />
          <select className="w-full p-2 border rounded mb-3" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <input className="w-full p-2 border rounded mb-3" placeholder="Added By" value={formData.addedBy} onChange={(e) => setFormData({...formData, addedBy: e.target.value})} />
          <input className="w-full p-2 border rounded mb-4" placeholder="Assigned To" value={formData.assignedTo} onChange={(e) => setFormData({...formData, assignedTo: e.target.value})} />
          <div className="flex gap-2">
            <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700" onClick={() => handleAdd('meeting', formData)}>Add Meeting</button>
            <button className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400" onClick={() => setShowAddModal(null)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  const EditMeetingModal = ({ item }) => {
    const [formData, setFormData] = useState(item.data);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Edit Meeting</h3>
            <button onClick={() => setEditingItem(null)} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          <input className="w-full p-2 border rounded mb-3" placeholder="Meeting Title" value={formData.title || ''} onChange={(e) => setFormData({...formData, title: e.target.value})} />
          <select className="w-full p-2 border rounded mb-3" value={formData.meetingType || 'weekly'} onChange={(e) => setFormData({...formData, meetingType: e.target.value})}>
            <option value="weekly">Weekly</option>
            <option value="quarterly">Quarterly</option>
            <option value="one-on-one">One-on-One</option>
            <option value="team">Team Meeting</option>
            <option value="all-hands">All Hands</option>
            <option value="other">Other</option>
          </select>
          <input className="w-full p-2 border rounded mb-3" type="date" placeholder="Date" value={formData.date || ''} onChange={(e) => setFormData({...formData, date: e.target.value})} />
          <input className="w-full p-2 border rounded mb-3" type="time" placeholder="Time" value={formData.time || ''} onChange={(e) => setFormData({...formData, time: e.target.value})} />
          <input className="w-full p-2 border rounded mb-3" placeholder="Attendees (comma separated)" value={formData.attendees || ''} onChange={(e) => setFormData({...formData, attendees: e.target.value})} />
          <select className="w-full p-2 border rounded mb-3" value={formData.status || 'scheduled'} onChange={(e) => setFormData({...formData, status: e.target.value})}>
            <option value="scheduled">Scheduled</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <input className="w-full p-2 border rounded mb-3" placeholder="Added By" value={formData.addedBy || ''} onChange={(e) => setFormData({...formData, addedBy: e.target.value})} />
          <input className="w-full p-2 border rounded mb-4" placeholder="Assigned To" value={formData.assignedTo || ''} onChange={(e) => setFormData({...formData, assignedTo: e.target.value})} />
          <div className="flex gap-2">
            <button className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700" onClick={() => handleEdit('meeting', item.id, formData)}>Save Changes</button>
            <button className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400" onClick={() => setEditingItem(null)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  // Accountability Chart Modals
  const AddAccountabilityModal = () => {
    const [formData, setFormData] = useState({ roleName: '', personName: '', responsibilities: '', department: '', addedBy: '' });
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Add Role to Accountability Chart</h3>
            <button onClick={() => setShowAddModal(null)} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          <input className="w-full p-2 border rounded mb-3" placeholder="Role Name (e.g., CEO, CTO, Sales Manager)" value={formData.roleName} onChange={(e) => setFormData({...formData, roleName: e.target.value})} />
          <input className="w-full p-2 border rounded mb-3" placeholder="Person Name (optional)" value={formData.personName} onChange={(e) => setFormData({...formData, personName: e.target.value})} />
          <textarea className="w-full p-2 border rounded mb-3" rows="4" placeholder="Key Responsibilities" value={formData.responsibilities} onChange={(e) => setFormData({...formData, responsibilities: e.target.value})} />
          <input className="w-full p-2 border rounded mb-3" placeholder="Department (optional)" value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})} />
          <input className="w-full p-2 border rounded mb-4" placeholder="Added By" value={formData.addedBy} onChange={(e) => setFormData({...formData, addedBy: e.target.value})} />
          <div className="flex gap-2">
            <button className="flex-1 bg-orange-600 text-white py-2 rounded hover:bg-orange-700" onClick={() => handleAdd('accountability', formData)}>Add Role</button>
            <button className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400" onClick={() => setShowAddModal(null)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  const EditAccountabilityModal = ({ item }) => {
    const [formData, setFormData] = useState(item.data);
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Edit Role</h3>
            <button onClick={() => setEditingItem(null)} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </button>
          </div>
          <input className="w-full p-2 border rounded mb-3" placeholder="Role Name" value={formData.roleName || ''} onChange={(e) => setFormData({...formData, roleName: e.target.value})} />
          <input className="w-full p-2 border rounded mb-3" placeholder="Person Name" value={formData.personName || ''} onChange={(e) => setFormData({...formData, personName: e.target.value})} />
          <textarea className="w-full p-2 border rounded mb-3" rows="4" placeholder="Key Responsibilities" value={formData.responsibilities || ''} onChange={(e) => setFormData({...formData, responsibilities: e.target.value})} />
          <input className="w-full p-2 border rounded mb-3" placeholder="Department" value={formData.department || ''} onChange={(e) => setFormData({...formData, department: e.target.value})} />
          <input className="w-full p-2 border rounded mb-4" placeholder="Added By" value={formData.addedBy || ''} onChange={(e) => setFormData({...formData, addedBy: e.target.value})} />
          <div className="flex gap-2">
            <button className="flex-1 bg-orange-600 text-white py-2 rounded hover:bg-orange-700" onClick={() => handleEdit('accountability', item.id, formData)}>Save Changes</button>
            <button className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400" onClick={() => setEditingItem(null)}>Cancel</button>
          </div>
        </div>
      </div>
    );
  };

  // Dashboard Component with Tableau KPIs
  const Dashboard = () => (
    <div className="space-y-6">
      {/* Tableau Real-Time KPIs Banner */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="w-6 h-6" />
              <h2 className="text-2xl font-bold">Live Team KPIs from Tableau</h2>
            </div>
            <p className="text-indigo-100 text-sm">Real-time data from your funnel analysis dashboard</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchTableauKPIs}
              disabled={tableauLoading}
              className="flex items-center gap-2 bg-white text-indigo-600 px-4 py-2 rounded hover:bg-indigo-50 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${tableauLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <a
              href="https://public.tableau.com/app/profile/niksa.derek/viz/FunnelAnalysis_17472437058310/TableView"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white text-indigo-600 px-4 py-2 rounded hover:bg-indigo-50"
            >
              <ExternalLink className="w-4 h-4" />
              View Full Dashboard
            </a>
          </div>
        </div>
        
        {tableauLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <span className="ml-3">Loading Tableau data...</span>
          </div>
        )}
        
        {tableauError && (
          <div className="bg-red-500 bg-opacity-20 border border-red-300 rounded p-4">
            <p className="font-semibold">Error loading Tableau data:</p>
            <p className="text-sm mt-1">{tableauError}</p>
            <p className="text-xs mt-2 opacity-75">Make sure the backend server is running on port 3000</p>
          </div>
        )}
        
        {tableauKPIs && !tableauLoading && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
                <p className="text-indigo-100 text-sm">Total Leads</p>
                <p className="text-3xl font-bold mt-1">{(tableauKPIs.leads || 0).toLocaleString()}</p>
                <p className="text-xs text-indigo-200 mt-1">From all channels</p>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
                <p className="text-indigo-100 text-sm">Prospects</p>
                <p className="text-3xl font-bold mt-1">{(tableauKPIs.prospects || 0).toLocaleString()}</p>
                <p className="text-xs text-indigo-200 mt-1">Qualified leads</p>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
                <p className="text-indigo-100 text-sm">Proposals</p>
                <p className="text-3xl font-bold mt-1">{(tableauKPIs.proposals || 0).toLocaleString()}</p>
                <p className="text-xs text-indigo-200 mt-1">Sent to clients</p>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
                <p className="text-indigo-100 text-sm">Closed Deals</p>
                <p className="text-3xl font-bold mt-1">{(tableauKPIs.closed || 0).toLocaleString()}</p>
                <p className="text-xs text-indigo-200 mt-1">Successfully won</p>
              </div>
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
                <p className="text-indigo-100 text-sm">Total Revenue</p>
                <p className="text-3xl font-bold mt-1">${(tableauKPIs.revenue || 0).toLocaleString()}</p>
                <p className="text-xs text-indigo-200 mt-1">Generated</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-white font-semibold mb-3 flex items-center gap-2">
                  <span className="bg-green-500 rounded-full w-2 h-2"></span>
                  Google Ads Performance
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-indigo-200">Revenue</p>
                    <p className="text-white font-bold">${(tableauKPIs.googleRevenue || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-indigo-200">ROAS</p>
                    <p className="text-white font-bold">{tableauKPIs.googleROAS || '0.00'}</p>
                  </div>
                  <div>
                    <p className="text-indigo-200">Leads</p>
                    <p className="text-white font-bold">{(tableauKPIs.googleLeads || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-indigo-200">Profit</p>
                    <p className={`font-bold ${(tableauKPIs.googleProfit || 0) >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                      ${(tableauKPIs.googleProfit || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-4">
                <p className="text-white font-semibold mb-3 flex items-center gap-2">
                  <span className="bg-blue-500 rounded-full w-2 h-2"></span>
                  Facebook Ads Performance
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-indigo-200">Revenue</p>
                    <p className="text-white font-bold">${(tableauKPIs.facebookRevenue || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-indigo-200">ROAS</p>
                    <p className="text-white font-bold">{tableauKPIs.facebookROAS || '0.00'}</p>
                  </div>
                  <div>
                    <p className="text-indigo-200">Leads</p>
                    <p className="text-white font-bold">{(tableauKPIs.facebookLeads || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-indigo-200">Profit</p>
                    <p className={`font-bold ${(tableauKPIs.facebookProfit || 0) >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                      ${(tableauKPIs.facebookProfit || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {lastTableauUpdate && (
              <p className="text-indigo-100 text-xs mt-4 text-center">
                Last updated: {lastTableauUpdate.toLocaleTimeString()} • Auto-refreshes every 5 minutes
              </p>
            )}
          </div>
        )}
      </div>
      
      {/* Original Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Goals on Track</p>
              <p className="text-3xl font-bold mt-1">{goals.filter(g => (g.current/g.target) >= 0.7).length}/{goals.length}</p>
            </div>
            <Target className="w-10 h-10 opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Rocks Progress</p>
              <p className="text-3xl font-bold mt-1">{rocks.filter(r => r.progress === 100).length}/{rocks.length}</p>
            </div>
            <TrendingUp className="w-10 h-10 opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Open Issues</p>
              <p className="text-3xl font-bold mt-1">{issues.filter(i => i.status === 'open').length}</p>
            </div>
            <AlertCircle className="w-10 h-10 opacity-80" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">To-Dos Pending</p>
              <p className="text-3xl font-bold mt-1">{todos.filter(t => !t.completed).length}</p>
            </div>
            <CheckSquare className="w-10 h-10 opacity-80" />
          </div>
        </div>
      </div>

      {/* Rest of dashboard sections... */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Goals
            </h3>
            <button onClick={() => setShowAddModal('goal')} className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-sm">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          {goals.slice(0, 3).map(goal => (
            <div key={goal.id} className="mb-3 p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-sm">{goal.title}</span>
                <div className="flex gap-1">
                  <button onClick={() => setEditingItem({ type: 'goal', id: goal.id, data: goal })} className="text-blue-600 hover:text-blue-700">
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <span className="text-xs text-gray-500">{goal.quarter}</span>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }} />
              </div>
              <div className="text-xs text-gray-600 mt-1">{goal.current.toLocaleString()} / {goal.target.toLocaleString()} ({Math.round((goal.current / goal.target) * 100)}%)</div>
            </div>
          ))}
          {goals.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-2">No goals yet</p>
              <button onClick={() => setShowAddModal('goal')} className="text-blue-600 hover:text-blue-700 text-sm">+ Add your first goal</button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Rocks
            </h3>
            <button onClick={() => setShowAddModal('rock')} className="text-green-600 hover:text-green-700 flex items-center gap-1 text-sm">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          {rocks.slice(0, 3).map(rock => (
            <div key={rock.id} className="mb-3 p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <span className="font-medium text-sm">{rock.title}</span>
                <div className="flex gap-2 items-center">
                  <button onClick={() => setEditingItem({ type: 'rock', id: rock.id, data: rock })} className="text-blue-600 hover:text-blue-700">
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <span className={`text-xs px-2 py-1 rounded ${rock.status === 'on-track' ? 'bg-green-100 text-green-700' : rock.status === 'at-risk' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                    {rock.status}
                  </span>
                </div>
              </div>
              <div className="text-xs text-gray-600 mb-2">Owner: {rock.owner} • Due: {rock.dueDate}</div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: `${rock.progress}%` }} />
              </div>
            </div>
          ))}
          {rocks.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-2">No rocks yet</p>
              <button onClick={() => setShowAddModal('rock')} className="text-green-600 hover:text-green-700 text-sm">+ Add your first rock</button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              Issues
            </h3>
            <button onClick={() => setShowAddModal('issue')} className="text-orange-600 hover:text-orange-700 flex items-center gap-1 text-sm">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          {issues.slice(0, 3).map(issue => (
            <div key={issue.id} className="mb-3 p-3 bg-gray-50 rounded hover:bg-gray-100 transition-colors flex items-center justify-between">
              <div className="flex-1">
                <span className="font-medium text-sm block">{issue.title}</span>
                <span className="text-xs text-gray-600">{issue.owner}</span>
              </div>
              <div className="flex gap-2 items-center">
                <button onClick={() => setEditingItem({ type: 'issue', id: issue.id, data: issue })} className="text-blue-600 hover:text-blue-700">
                  <Edit2 className="w-3 h-3" />
                </button>
                <span className={`text-xs px-2 py-1 rounded ${issue.priority === 'critical' ? 'bg-red-100 text-red-700' : issue.priority === 'high' ? 'bg-orange-100 text-orange-700' : issue.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                  {issue.priority}
                </span>
              </div>
            </div>
          ))}
          {issues.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-2">No issues</p>
              <button onClick={() => setShowAddModal('issue')} className="text-orange-600 hover:text-orange-700 text-sm">+ Add an issue</button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-purple-600" />
              To-Dos
            </h3>
            <button onClick={() => setShowAddModal('todo')} className="text-purple-600 hover:text-purple-700 flex items-center gap-1 text-sm">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          {todos.slice(0, 5).map(todo => (
            <div key={todo.id} className="mb-2 p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors flex items-center justify-between">
              <div className="flex items-center gap-2 flex-1">
                <input 
                  type="checkbox" 
                  checked={todo.completed} 
                  onChange={() => handleEdit('todo', todo.id, { completed: !todo.completed })} 
                  className="w-4 h-4 cursor-pointer" 
                />
                <span className={`text-sm ${todo.completed ? 'line-through text-gray-400' : ''}`}>{todo.title}</span>
              </div>
              <div className="flex gap-2 items-center">
                <button onClick={() => setEditingItem({ type: 'todo', id: todo.id, data: todo })} className="text-blue-600 hover:text-blue-700">
                  <Edit2 className="w-3 h-3" />
                </button>
                <span className="text-xs text-gray-500">{todo.dueDate}</span>
              </div>
            </div>
          ))}
          {todos.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-2">No to-dos</p>
              <button onClick={() => setShowAddModal('todo')} className="text-purple-600 hover:text-purple-700 text-sm">+ Add a to-do</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Goals Component
  const Goals = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-2xl font-bold">Goals</h2>
        <button onClick={() => setShowAddModal('goal')} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Goal
        </button>
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
                <button onClick={() => setEditingItem({ type: 'goal', id: goal.id, data: goal })} className="text-blue-600 hover:text-blue-700">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete('goal', goal.id)} className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </button>
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
        {goals.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No goals yet. Click "Add Goal" to create your first goal.
          </div>
        )}
      </div>
    </div>
  );

  // 3 Year Goals Component
  const Goals3Year = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-2xl font-bold">3 Year Goals</h2>
        <button onClick={() => setShowAddModal('goal3Year')} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add 3 Year Goal
        </button>
      </div>
      <div className="p-6 space-y-4">
        {goals3Year.map(goal => (
          <div key={goal.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-lg">{goal.title}</h3>
                {goal.description && <p className="text-sm text-gray-600 mt-1">{goal.description}</p>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditingItem({ type: 'goal3Year', id: goal.id, data: goal })} className="text-blue-600 hover:text-blue-700">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete('goal3Year', goal.id)} className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            {goal.target && goal.current !== undefined && (
              <>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div className="bg-purple-600 h-3 rounded-full transition-all" style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }} />
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{goal.current.toLocaleString()} / {goal.target.toLocaleString()}</span>
                  <span className="font-bold">{Math.round((goal.current / goal.target) * 100)}%</span>
                </div>
              </>
            )}
            {(goal.addedBy || goal.assignedTo) && (
              <div className="text-xs text-gray-500 mt-2">
                {goal.addedBy && <span>Added by: {goal.addedBy}</span>}
                {goal.assignedTo && <span className="ml-3">Assigned to: {goal.assignedTo}</span>}
              </div>
            )}
          </div>
        ))}
        {goals3Year.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No 3-year goals yet. Click "Add 3 Year Goal" to create your first goal.
          </div>
        )}
      </div>
    </div>
  );

  // 1 Year Goals Component
  const Goals1Year = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-2xl font-bold">1 Year Goals</h2>
        <button onClick={() => setShowAddModal('goal1Year')} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add 1 Year Goal
        </button>
      </div>
      <div className="p-6 space-y-4">
        {goals1Year.map(goal => (
          <div key={goal.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-lg">{goal.title}</h3>
                {goal.description && <p className="text-sm text-gray-600 mt-1">{goal.description}</p>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditingItem({ type: 'goal1Year', id: goal.id, data: goal })} className="text-blue-600 hover:text-blue-700">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete('goal1Year', goal.id)} className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            {goal.target && goal.current !== undefined && (
              <>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div className="bg-indigo-600 h-3 rounded-full transition-all" style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }} />
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{goal.current.toLocaleString()} / {goal.target.toLocaleString()}</span>
                  <span className="font-bold">{Math.round((goal.current / goal.target) * 100)}%</span>
                </div>
              </>
            )}
            {(goal.addedBy || goal.assignedTo) && (
              <div className="text-xs text-gray-500 mt-2">
                {goal.addedBy && <span>Added by: {goal.addedBy}</span>}
                {goal.assignedTo && <span className="ml-3">Assigned to: {goal.assignedTo}</span>}
              </div>
            )}
          </div>
        ))}
        {goals1Year.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No 1-year goals yet. Click "Add 1 Year Goal" to create your first goal.
          </div>
        )}
      </div>
    </div>
  );

  // 90 Day Goals Component
  const Goals90Day = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-2xl font-bold">90 Day Goals</h2>
        <button onClick={() => setShowAddModal('goal90Day')} className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add 90 Day Goal
        </button>
      </div>
      <div className="p-6 space-y-4">
        {goals90Day.map(goal => (
          <div key={goal.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-lg">{goal.title}</h3>
                {goal.description && <p className="text-sm text-gray-600 mt-1">{goal.description}</p>}
              </div>
              <div className="flex gap-2">
                <button onClick={() => setEditingItem({ type: 'goal90Day', id: goal.id, data: goal })} className="text-blue-600 hover:text-blue-700">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete('goal90Day', goal.id)} className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            {goal.target && goal.current !== undefined && (
              <>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div className="bg-teal-600 h-3 rounded-full transition-all" style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }} />
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>{goal.current.toLocaleString()} / {goal.target.toLocaleString()}</span>
                  <span className="font-bold">{Math.round((goal.current / goal.target) * 100)}%</span>
                </div>
              </>
            )}
            {(goal.addedBy || goal.assignedTo) && (
              <div className="text-xs text-gray-500 mt-2">
                {goal.addedBy && <span>Added by: {goal.addedBy}</span>}
                {goal.assignedTo && <span className="ml-3">Assigned to: {goal.assignedTo}</span>}
              </div>
            )}
          </div>
        ))}
        {goals90Day.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No 90-day goals yet. Click "Add 90 Day Goal" to create your first goal.
          </div>
        )}
      </div>
    </div>
  );

  // Rocks Component
  const Rocks = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-2xl font-bold">Rocks (90-Day Priorities)</h2>
        <button onClick={() => setShowAddModal('rock')} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Rock
        </button>
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
                <span className={`text-xs px-2 py-1 rounded ${rock.status === 'on-track' ? 'bg-green-100 text-green-700' : rock.status === 'at-risk' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                  {rock.status}
                </span>
                <button onClick={() => setEditingItem({ type: 'rock', id: rock.id, data: rock })} className="text-blue-600 hover:text-blue-700">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete('rock', rock.id)} className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div className={`h-3 rounded-full transition-all ${rock.status === 'on-track' ? 'bg-green-600' : rock.status === 'at-risk' ? 'bg-yellow-500' : 'bg-red-600'}`} style={{ width: `${rock.progress}%` }} />
            </div>
            <div className="text-sm text-gray-600 text-right">{rock.progress}% Complete</div>
          </div>
        ))}
        {rocks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No rocks yet. Click "Add Rock" to create your first 90-day priority.
          </div>
        )}
      </div>
    </div>
  );

  // Issues Component
  const Issues = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-2xl font-bold">Issues</h2>
        <button onClick={() => setShowAddModal('issue')} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Issue
        </button>
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
              <span className={`text-xs px-3 py-1 rounded font-medium ${issue.priority === 'critical' ? 'bg-red-100 text-red-700' : issue.priority === 'high' ? 'bg-orange-100 text-orange-700' : issue.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'}`}>
                {issue.priority}
              </span>
              <button onClick={() => setEditingItem({ type: 'issue', id: issue.id, data: issue })} className="text-blue-600 hover:text-blue-700">
                <Edit2 className="w-4 h-4" />
              </button>
              <button 
                onClick={() => handleEdit('issue', issue.id, { status: issue.status === 'open' ? 'resolved' : 'open' })} 
                className={`px-3 py-1 rounded text-sm ${issue.status === 'open' ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-300 hover:bg-gray-400'}`}
              >
                {issue.status === 'open' ? 'Resolve' : 'Reopen'}
              </button>
              <button onClick={() => handleDelete('issue', issue.id)} className="text-red-600 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {issues.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No issues yet. Click "Add Issue" to track your first issue.
          </div>
        )}
      </div>
    </div>
  );

  // Todos Component
  const Todos = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-2xl font-bold">To-Dos</h2>
        <button onClick={() => setShowAddModal('todo')} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add To-Do
        </button>
      </div>
      <div className="p-6 space-y-2">
        {todos.map(todo => (
          <div key={todo.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <input 
                type="checkbox" 
                checked={todo.completed} 
                onChange={() => handleEdit('todo', todo.id, { completed: !todo.completed })} 
                className="w-5 h-5 cursor-pointer" 
              />
              <div>
                <h3 className={`font-medium ${todo.completed ? 'line-through text-gray-400' : ''}`}>{todo.title}</h3>
                <div className="flex gap-4 text-sm text-gray-600 mt-1">
                  <span>Assignee: {todo.assignee}</span>
                  <span>Due: {todo.dueDate}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditingItem({ type: 'todo', id: todo.id, data: todo })} className="text-blue-600 hover:text-blue-700">
                <Edit2 className="w-4 h-4" />
              </button>
              <button onClick={() => handleDelete('todo', todo.id)} className="text-red-600 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {todos.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No to-dos yet. Click "Add To-Do" to create your first task.
          </div>
        )}
      </div>
    </div>
  );

  // Scorecard Component
  const Scorecard = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-2xl font-bold">Scorecard</h2>
        <button onClick={() => setShowAddModal('scorecard')} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Metric
        </button>
      </div>
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Metric</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Target</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actual</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Trend</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {scorecard.map((item, index) => (
                <tr key={item.id} className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-4 py-3 text-sm font-medium">{item.metric}</td>
                  <td className="px-4 py-3 text-sm text-center">{item.target.toLocaleString()}</td>
                  <td className={`px-4 py-3 text-sm text-center font-bold ${item.actual >= item.target ? 'text-green-600' : 'text-red-600'}`}>
                    {item.actual.toLocaleString()}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2 py-1 rounded text-xs ${item.trend === 'up' ? 'bg-green-100 text-green-700' : item.trend === 'down' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'}`}>
                      {item.trend === 'up' ? '↑ Up' : item.trend === 'down' ? '↓ Down' : '→ Neutral'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex gap-2 justify-center">
                      <button onClick={() => setEditingItem({ type: 'scorecard', id: item.id, data: item })} className="text-blue-600 hover:text-blue-700">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete('scorecard', item.id)} className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {scorecard.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No metrics yet. Click "Add Metric" to track your first scorecard metric.
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // VTO (Vision/Traction Organizer) Component
  const VTO = () => {
    const visionItems = vto.filter(item => item.category === 'vision');
    const tractionItems = vto.filter(item => item.category === 'traction');
    
    return (
      <div className="space-y-6">
        {/* Vision Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Vision</h2>
              <p className="text-sm text-gray-600 mt-1">Long-term direction and values</p>
            </div>
            <button onClick={() => setShowAddModal('vto')} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Vision Item
            </button>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {visionItems.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded mb-2">
                        {item.type ? item.type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Vision'}
                      </span>
                      <h3 className="font-semibold text-lg">{item.title || 'Untitled'}</h3>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => setEditingItem({ type: 'vto', id: item.id, data: item })} className="text-blue-600 hover:text-blue-700">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete('vto', item.id)} className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{item.description || 'No description'}</p>
                  <div className="text-xs text-gray-500">
                    <span>Added by: {item.addedBy || 'N/A'}</span>
                    {item.assignedTo && <span className="ml-3">Assigned to: {item.assignedTo}</span>}
                  </div>
                </div>
              ))}
            </div>
            {visionItems.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No vision items yet. Click "Add Vision Item" to define your company's vision.
              </div>
            )}
          </div>
        </div>

        {/* 3-Year Goals Section - Vision */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">3-Year Picture</h2>
              <p className="text-sm text-gray-600 mt-1">Long-term strategic goals</p>
            </div>
            <button onClick={() => setShowAddModal('goal3Year')} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add 3 Year Goal
            </button>
          </div>
          <div className="p-6 space-y-4">
            {goals3Year.map(goal => (
              <div key={goal.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg">{goal.title}</h3>
                    {goal.description && <p className="text-sm text-gray-600 mt-1">{goal.description}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingItem({ type: 'goal3Year', id: goal.id, data: goal })} className="text-blue-600 hover:text-blue-700">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete('goal3Year', goal.id)} className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {goal.target && goal.current !== undefined && (
                  <>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                      <div className="bg-purple-600 h-3 rounded-full transition-all" style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }} />
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{goal.current.toLocaleString()} / {goal.target.toLocaleString()}</span>
                      <span className="font-bold">{Math.round((goal.current / goal.target) * 100)}%</span>
                    </div>
                  </>
                )}
                {(goal.addedBy || goal.assignedTo) && (
                  <div className="text-xs text-gray-500 mt-2">
                    {goal.addedBy && <span>Added by: {goal.addedBy}</span>}
                    {goal.assignedTo && <span className="ml-3">Assigned to: {goal.assignedTo}</span>}
                  </div>
                )}
              </div>
            ))}
            {goals3Year.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No 3-year goals yet. Click "Add 3 Year Goal" to create your first goal.
              </div>
            )}
          </div>
        </div>

        {/* 1-Year Goals Section - Vision */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">1-Year Plan</h2>
              <p className="text-sm text-gray-600 mt-1">Annual strategic objectives</p>
            </div>
            <button onClick={() => setShowAddModal('goal1Year')} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add 1 Year Goal
            </button>
          </div>
          <div className="p-6 space-y-4">
            {goals1Year.map(goal => (
              <div key={goal.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg">{goal.title}</h3>
                    {goal.description && <p className="text-sm text-gray-600 mt-1">{goal.description}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingItem({ type: 'goal1Year', id: goal.id, data: goal })} className="text-blue-600 hover:text-blue-700">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete('goal1Year', goal.id)} className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {goal.target && goal.current !== undefined && (
                  <>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                      <div className="bg-indigo-600 h-3 rounded-full transition-all" style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }} />
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{goal.current.toLocaleString()} / {goal.target.toLocaleString()}</span>
                      <span className="font-bold">{Math.round((goal.current / goal.target) * 100)}%</span>
                    </div>
                  </>
                )}
                {(goal.addedBy || goal.assignedTo) && (
                  <div className="text-xs text-gray-500 mt-2">
                    {goal.addedBy && <span>Added by: {goal.addedBy}</span>}
                    {goal.assignedTo && <span className="ml-3">Assigned to: {goal.assignedTo}</span>}
                  </div>
                )}
              </div>
            ))}
            {goals1Year.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No 1-year goals yet. Click "Add 1 Year Goal" to create your first goal.
              </div>
            )}
          </div>
        </div>

        {/* 90-Day Goals Section - Vision */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">90-Day Goals</h2>
              <p className="text-sm text-gray-600 mt-1">Quarterly priorities and targets</p>
            </div>
            <button onClick={() => setShowAddModal('goal90Day')} className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add 90 Day Goal
            </button>
          </div>
          <div className="p-6 space-y-4">
            {goals90Day.map(goal => (
              <div key={goal.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg">{goal.title}</h3>
                    {goal.description && <p className="text-sm text-gray-600 mt-1">{goal.description}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingItem({ type: 'goal90Day', id: goal.id, data: goal })} className="text-blue-600 hover:text-blue-700">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete('goal90Day', goal.id)} className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {goal.target && goal.current !== undefined && (
                  <>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                      <div className="bg-teal-600 h-3 rounded-full transition-all" style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }} />
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{goal.current.toLocaleString()} / {goal.target.toLocaleString()}</span>
                      <span className="font-bold">{Math.round((goal.current / goal.target) * 100)}%</span>
                    </div>
                  </>
                )}
                {(goal.addedBy || goal.assignedTo) && (
                  <div className="text-xs text-gray-500 mt-2">
                    {goal.addedBy && <span>Added by: {goal.addedBy}</span>}
                    {goal.assignedTo && <span className="ml-3">Assigned to: {goal.assignedTo}</span>}
                  </div>
                )}
              </div>
            ))}
            {goals90Day.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No 90-day goals yet. Click "Add 90 Day Goal" to create your first goal.
              </div>
            )}
          </div>
        </div>

        {/* Traction Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Traction</h2>
              <p className="text-sm text-gray-600 mt-1">Quarterly goals and execution</p>
            </div>
            <button onClick={() => setShowAddModal('vto')} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Traction Item
            </button>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {tractionItems.map((item) => (
                <div key={item.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-700 text-xs rounded mb-2">
                        {item.type ? item.type.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Traction'}
                      </span>
                      <h3 className="font-semibold text-lg">{item.title || 'Untitled'}</h3>
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => setEditingItem({ type: 'vto', id: item.id, data: item })} className="text-blue-600 hover:text-blue-700">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete('vto', item.id)} className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{item.description || 'No description'}</p>
                  <div className="text-xs text-gray-500">
                    <span>Added by: {item.addedBy || 'N/A'}</span>
                    {item.assignedTo && <span className="ml-3">Assigned to: {item.assignedTo}</span>}
                  </div>
                </div>
              ))}
            </div>
            {tractionItems.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No traction items yet. Click "Add Traction Item" to set your quarterly priorities.
              </div>
            )}
          </div>
        </div>

        {/* 3-Year Goals Section - Traction */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">3-Year Picture</h2>
              <p className="text-sm text-gray-600 mt-1">Long-term strategic goals</p>
            </div>
            <button onClick={() => setShowAddModal('goal3Year')} className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add 3 Year Goal
            </button>
          </div>
          <div className="p-6 space-y-4">
            {goals3Year.map(goal => (
              <div key={goal.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg">{goal.title}</h3>
                    {goal.description && <p className="text-sm text-gray-600 mt-1">{goal.description}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingItem({ type: 'goal3Year', id: goal.id, data: goal })} className="text-blue-600 hover:text-blue-700">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete('goal3Year', goal.id)} className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {goal.target && goal.current !== undefined && (
                  <>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                      <div className="bg-purple-600 h-3 rounded-full transition-all" style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }} />
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{goal.current.toLocaleString()} / {goal.target.toLocaleString()}</span>
                      <span className="font-bold">{Math.round((goal.current / goal.target) * 100)}%</span>
                    </div>
                  </>
                )}
                {(goal.addedBy || goal.assignedTo) && (
                  <div className="text-xs text-gray-500 mt-2">
                    {goal.addedBy && <span>Added by: {goal.addedBy}</span>}
                    {goal.assignedTo && <span className="ml-3">Assigned to: {goal.assignedTo}</span>}
                  </div>
                )}
              </div>
            ))}
            {goals3Year.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No 3-year goals yet. Click "Add 3 Year Goal" to create your first goal.
              </div>
            )}
          </div>
        </div>

        {/* 1-Year Goals Section - Traction */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">1-Year Plan</h2>
              <p className="text-sm text-gray-600 mt-1">Annual strategic objectives</p>
            </div>
            <button onClick={() => setShowAddModal('goal1Year')} className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add 1 Year Goal
            </button>
          </div>
          <div className="p-6 space-y-4">
            {goals1Year.map(goal => (
              <div key={goal.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg">{goal.title}</h3>
                    {goal.description && <p className="text-sm text-gray-600 mt-1">{goal.description}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingItem({ type: 'goal1Year', id: goal.id, data: goal })} className="text-blue-600 hover:text-blue-700">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete('goal1Year', goal.id)} className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {goal.target && goal.current !== undefined && (
                  <>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                      <div className="bg-indigo-600 h-3 rounded-full transition-all" style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }} />
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{goal.current.toLocaleString()} / {goal.target.toLocaleString()}</span>
                      <span className="font-bold">{Math.round((goal.current / goal.target) * 100)}%</span>
                    </div>
                  </>
                )}
                {(goal.addedBy || goal.assignedTo) && (
                  <div className="text-xs text-gray-500 mt-2">
                    {goal.addedBy && <span>Added by: {goal.addedBy}</span>}
                    {goal.assignedTo && <span className="ml-3">Assigned to: {goal.assignedTo}</span>}
                  </div>
                )}
              </div>
            ))}
            {goals1Year.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No 1-year goals yet. Click "Add 1 Year Goal" to create your first goal.
              </div>
            )}
          </div>
        </div>

        {/* 90-Day Goals Section - Traction */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">90-Day Goals</h2>
              <p className="text-sm text-gray-600 mt-1">Quarterly priorities and targets</p>
            </div>
            <button onClick={() => setShowAddModal('goal90Day')} className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add 90 Day Goal
            </button>
          </div>
          <div className="p-6 space-y-4">
            {goals90Day.map(goal => (
              <div key={goal.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-lg">{goal.title}</h3>
                    {goal.description && <p className="text-sm text-gray-600 mt-1">{goal.description}</p>}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditingItem({ type: 'goal90Day', id: goal.id, data: goal })} className="text-blue-600 hover:text-blue-700">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete('goal90Day', goal.id)} className="text-red-600 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                {goal.target && goal.current !== undefined && (
                  <>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                      <div className="bg-teal-600 h-3 rounded-full transition-all" style={{ width: `${Math.min((goal.current / goal.target) * 100, 100)}%` }} />
                    </div>
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>{goal.current.toLocaleString()} / {goal.target.toLocaleString()}</span>
                      <span className="font-bold">{Math.round((goal.current / goal.target) * 100)}%</span>
                    </div>
                  </>
                )}
                {(goal.addedBy || goal.assignedTo) && (
                  <div className="text-xs text-gray-500 mt-2">
                    {goal.addedBy && <span>Added by: {goal.addedBy}</span>}
                    {goal.assignedTo && <span className="ml-3">Assigned to: {goal.assignedTo}</span>}
                  </div>
                )}
              </div>
            ))}
            {goals90Day.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No 90-day goals yet. Click "Add 90 Day Goal" to create your first goal.
              </div>
            )}
          </div>
        </div>

        {/* Accountability Chart Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Accountability Chart</h2>
              <p className="text-sm text-gray-600 mt-1">Organizational structure and roles</p>
            </div>
            <button onClick={() => setShowAddModal('accountability')} className="bg-orange-600 text-white px-4 py-2 rounded hover:bg-orange-700 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Role
            </button>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {accountabilityChart.map((role) => (
                <div key={role.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg mb-1">{role.roleName || 'Untitled Role'}</h3>
                      {role.personName && (
                        <p className="text-sm text-gray-700 font-medium">{role.personName}</p>
                      )}
                    </div>
                    <div className="flex gap-1">
                      <button onClick={() => setEditingItem({ type: 'accountability', id: role.id, data: role })} className="text-blue-600 hover:text-blue-700">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete('accountability', role.id)} className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {role.responsibilities && (
                    <div className="mt-3">
                      <p className="text-xs font-semibold text-gray-600 mb-1">Key Responsibilities:</p>
                      <p className="text-sm text-gray-600">{role.responsibilities}</p>
                    </div>
                  )}
                  {(role.addedBy || role.department) && (
                    <div className="text-xs text-gray-500 mt-3">
                      {role.addedBy && <span>Added by: {role.addedBy}</span>}
                      {role.department && <span className="ml-3">Department: {role.department}</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {accountabilityChart.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No roles defined yet. Click "Add Role" to create your accountability chart.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Meetings Component
  const Meetings = () => (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b flex justify-between items-center">
        <h2 className="text-2xl font-bold">Meetings</h2>
        <button onClick={() => setShowAddModal('meeting')} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Meeting
        </button>
      </div>
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Title</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Time</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Attendees</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Added By</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {meetings.map((item, index) => (
                <tr key={item.id} className={`border-b hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-4 py-3 text-sm font-medium">{item.title || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm">{item.meetingType || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm">{item.date ? new Date(item.date).toLocaleDateString() : 'N/A'}</td>
                  <td className="px-4 py-3 text-sm">{item.time || 'N/A'}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.attendees || 'N/A'}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2 py-1 rounded text-xs ${
                      item.status === 'scheduled' ? 'bg-blue-100 text-blue-700' : 
                      item.status === 'completed' ? 'bg-green-100 text-green-700' : 
                      item.status === 'cancelled' ? 'bg-red-100 text-red-700' : 
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : 'N/A'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">{item.addedBy || 'N/A'}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex gap-2 justify-center">
                      <button onClick={() => setEditingItem({ type: 'meeting', id: item.id, data: item })} className="text-blue-600 hover:text-blue-700">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete('meeting', item.id)} className="text-red-600 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {meetings.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              No meetings scheduled yet. Click "Add Meeting" to create your first meeting.
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-white shadow-lg fixed h-full overflow-y-auto">
        <div className="p-4 border-b">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Adsync Media Hub</h1>
              <p className="text-xs text-gray-600">90-Day Operating System</p>
            </div>
          </div>
        </div>
        <nav className="p-4">
          <div className="space-y-1">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'goals', label: 'Goals', icon: Target },
              { id: 'rocks', label: 'Rocks', icon: TrendingUp },
              { id: 'issues', label: 'Issues', icon: AlertCircle },
              { id: 'todos', label: 'To-Dos', icon: CheckSquare },
              { id: 'scorecard', label: 'Scorecard', icon: BarChart3 },
              { id: 'vto', label: 'VTO', icon: Eye },
              { id: 'meetings', label: 'Meetings', icon: Calendar }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {activeTab === 'dashboard' && 'Dashboard'}
                  {activeTab === 'goals' && 'Goals'}
                  {activeTab === 'rocks' && 'Rocks'}
                  {activeTab === 'issues' && 'Issues'}
                  {activeTab === 'todos' && 'To-Dos'}
                  {activeTab === 'scorecard' && 'Scorecard'}
                  {activeTab === 'vto' && 'Vision/Traction Organizer'}
                  {activeTab === 'meetings' && 'Meetings'}
                </h2>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4" />
                <span>Team Dashboard</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-6">
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'goals' && <Goals />}
          {activeTab === 'rocks' && <Rocks />}
          {activeTab === 'issues' && <Issues />}
          {activeTab === 'todos' && <Todos />}
          {activeTab === 'scorecard' && <Scorecard />}
          {activeTab === 'vto' && <VTO />}
          {activeTab === 'meetings' && <Meetings />}
        </main>
      </div>

      {/* Modals */}
      {showAddModal === 'goal' && <AddGoalModal />}
      {showAddModal === 'goal3Year' && <AddGoal3YearModal />}
      {showAddModal === 'goal1Year' && <AddGoal1YearModal />}
      {showAddModal === 'goal90Day' && <AddGoal90DayModal />}
      {showAddModal === 'rock' && <AddRockModal />}
      {showAddModal === 'issue' && <AddIssueModal />}
      {showAddModal === 'todo' && <AddTodoModal />}
      {showAddModal === 'scorecard' && <AddScorecardModal />}
      {showAddModal === 'vto' && <AddVTOModal />}
      {showAddModal === 'meeting' && <AddMeetingModal />}
      {showAddModal === 'accountability' && <AddAccountabilityModal />}

      {editingItem && editingItem.type === 'goal' && <EditGoalModal item={editingItem} />}
      {editingItem && editingItem.type === 'goal3Year' && <EditGoal3YearModal item={editingItem} />}
      {editingItem && editingItem.type === 'goal1Year' && <EditGoal1YearModal item={editingItem} />}
      {editingItem && editingItem.type === 'goal90Day' && <EditGoal90DayModal item={editingItem} />}
      {editingItem && editingItem.type === 'rock' && <EditRockModal item={editingItem} />}
      {editingItem && editingItem.type === 'issue' && <EditIssueModal item={editingItem} />}
      {editingItem && editingItem.type === 'todo' && <EditTodoModal item={editingItem} />}
      {editingItem && editingItem.type === 'scorecard' && <EditScorecardModal item={editingItem} />}
      {editingItem && editingItem.type === 'vto' && <EditVTOModal item={editingItem} />}
      {editingItem && editingItem.type === 'meeting' && <EditMeetingModal item={editingItem} />}
      {editingItem && editingItem.type === 'accountability' && <EditAccountabilityModal item={editingItem} />}
    </div>
  );
};

export default NinetyHub;
