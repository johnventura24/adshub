const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
);

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  return process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY;
};

// Todos
async function getTodos() {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, using fallback');
    return [];
  }
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching todos:', error);
    return [];
  }
  return data;
}

async function createTodo(todoData) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured');
  }
  const { data, error } = await supabase
    .from('todos')
    .insert([{
      ...todoData,
      created_at: new Date().toISOString()
    }])
    .select();
  
  if (error) throw error;
  return data[0];
}

async function updateTodo(id, updates) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured');
  }
  const { data, error } = await supabase
    .from('todos')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0];
}

async function deleteTodo(id) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured');
  }
  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
}

// Issues
async function getIssues() {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, using fallback');
    return [];
  }
  const { data, error } = await supabase
    .from('issues')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching issues:', error);
    return [];
  }
  return data;
}

async function createIssue(issueData) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured');
  }
  const { data, error } = await supabase
    .from('issues')
    .insert([{
      ...issueData,
      created_at: new Date().toISOString()
    }])
    .select();
  
  if (error) throw error;
  return data[0];
}

async function updateIssue(id, updates) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured');
  }
  const { data, error } = await supabase
    .from('issues')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0];
}

async function deleteIssue(id) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured');
  }
  const { error } = await supabase
    .from('issues')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
}

// Goals
async function getGoals() {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, using fallback');
    return [];
  }
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching goals:', error);
    return [];
  }
  return data;
}

async function updateGoal(period, updates) {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured');
  }
  const { data, error } = await supabase
    .from('goals')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('period', period)
    .select();
  
  if (error) throw error;
  return data[0];
}

module.exports = {
  supabase,
  isSupabaseConfigured,
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  getIssues,
  createIssue,
  updateIssue,
  deleteIssue,
  getGoals,
  updateGoal
};
