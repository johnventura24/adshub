const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('⚠️ Supabase configuration missing. Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.');
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Database table names
const TABLES = {
  NINETY_ROCKS: 'ninety_rocks',
  NINETY_TODOS: 'ninety_todos', 
  NINETY_ISSUES: 'ninety_issues',
  NINETY_SCORECARD: 'ninety_scorecard',
  LEADERSHIP_TEAM: 'leadership_team',
  UPLOAD_LOGS: 'upload_logs'
};

// Helper function to handle Supabase errors
function handleSupabaseError(error, operation) {
  console.error(`❌ Supabase ${operation} error:`, error.message);
  throw new Error(`Database ${operation} failed: ${error.message}`);
}

// Helper function to check if Supabase is configured
function isSupabaseConfigured() {
  return !!(supabaseUrl && supabaseKey);
}

module.exports = {
  supabase,
  TABLES,
  handleSupabaseError,
  isSupabaseConfigured
};
