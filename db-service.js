const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Goals functions
async function getGoals() {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

async function updateGoal(period, updates) {
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

// Revenue Funnel functions
async function getRevenueFunnel() {
  const { data, error } = await supabase
    .from('revenue_funnel')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  
  if (error) throw error;
  return data;
}

async function updateRevenueFunnel(updates) {
  const { data, error } = await supabase
    .from('revenue_funnel')
    .insert([{
      ...updates,
      created_at: new Date().toISOString()
    }])
    .select();
  
  if (error) throw error;
  return data[0];
}

// VTO functions
async function getVTO() {
  const { data, error } = await supabase
    .from('vto')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  
  if (error) throw error;
  return data;
}

async function updateVTO(updates) {
  const { data, error } = await supabase
    .from('vto')
    .insert([{
      ...updates,
      created_at: new Date().toISOString()
    }])
    .select();
  
  if (error) throw error;
  return data[0];
}

// Issues functions
async function getIssues() {
  const { data, error } = await supabase
    .from('issues')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

async function createIssue(issueData) {
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
  const { error } = await supabase
    .from('issues')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
}

// Scorecard functions
async function getScorecard() {
  const { data, error } = await supabase
    .from('scorecard')
    .select('*')
    .order('metric_name');
  
  if (error) throw error;
  return data;
}

async function updateScorecard(metricName, value) {
  const { data, error } = await supabase
    .from('scorecard')
    .update({
      metric_value: value,
      updated_at: new Date().toISOString()
    })
    .eq('metric_name', metricName)
    .select();
  
  if (error) throw error;
  return data[0];
}

// Todos functions
async function getTodos() {
  const { data, error } = await supabase
    .from('todos')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
}

async function createTodo(todoData) {
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
  const { error } = await supabase
    .from('todos')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
}

// Knowledge Base functions
async function getKnowledgeBase() {
  const { data, error } = await supabase
    .from('knowledge_base')
    .select('*')
    .order('category', { ascending: true });
  
  if (error) throw error;
  return data;
}

async function createKnowledgeItem(itemData) {
  const { data, error } = await supabase
    .from('knowledge_base')
    .insert([{
      ...itemData,
      created_at: new Date().toISOString()
    }])
    .select();
  
  if (error) throw error;
  return data[0];
}

module.exports = {
  supabase,
  getGoals,
  updateGoal,
  getRevenueFunnel,
  updateRevenueFunnel,
  getVTO,
  updateVTO,
  getIssues,
  createIssue,
  updateIssue,
  deleteIssue,
  getScorecard,
  updateScorecard,
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  getKnowledgeBase,
  createKnowledgeItem
};
