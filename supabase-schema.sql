-- ===========================================
-- SUPABASE DATABASE SCHEMA FOR ADSYNC MEDIA HUB
-- ===========================================
-- Run these commands in your Supabase SQL editor to set up the database tables

-- ===========================================
-- NINETY.IO DATA TABLES
-- ===========================================

-- Ninety.io Rocks (Goals) Table
CREATE TABLE IF NOT EXISTS ninety_rocks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    department TEXT,
    assigned_user TEXT,
    priority TEXT DEFAULT 'medium',
    status TEXT DEFAULT 'active',
    due_date TIMESTAMP WITH TIME ZONE,
    progress_percentage INTEGER DEFAULT 0,
    quarterly_target DECIMAL,
    current_progress DECIMAL,
    days_remaining INTEGER,
    daily_average DECIMAL,
    trend TEXT DEFAULT 'up',
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Ninety.io Todos Table
CREATE TABLE IF NOT EXISTS ninety_todos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    department TEXT,
    assigned_user TEXT,
    priority TEXT DEFAULT 'medium',
    status TEXT DEFAULT 'pending',
    due_date TIMESTAMP WITH TIME ZONE,
    completed_date TIMESTAMP WITH TIME ZONE,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Ninety.io Issues Table
CREATE TABLE IF NOT EXISTS ninety_issues (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    department TEXT,
    assigned_user TEXT,
    priority TEXT DEFAULT 'medium',
    status TEXT DEFAULT 'open',
    severity TEXT DEFAULT 'medium',
    resolution_notes TEXT,
    resolved_date TIMESTAMP WITH TIME ZONE,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Ninety.io Scorecard Table
CREATE TABLE IF NOT EXISTS ninety_scorecard (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    department TEXT,
    customer_satisfaction DECIMAL,
    team_efficiency DECIMAL,
    goal_completion DECIMAL,
    quality_score DECIMAL,
    period_start DATE,
    period_end DATE,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- ===========================================
-- LEADERSHIP TEAM TABLE
-- ===========================================

CREATE TABLE IF NOT EXISTS leadership_team (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    department TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    goals TEXT,
    metrics TEXT,
    status TEXT DEFAULT 'active',
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- ===========================================
-- UPLOAD LOGS TABLE
-- ===========================================

CREATE TABLE IF NOT EXISTS upload_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    file_name TEXT NOT NULL,
    file_type TEXT NOT NULL,
    data_type TEXT NOT NULL,
    records_processed INTEGER DEFAULT 0,
    records_saved INTEGER DEFAULT 0,
    department TEXT,
    uploaded_by UUID,
    upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'completed',
    error_message TEXT,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- ===========================================
-- INDEXES FOR PERFORMANCE
-- ===========================================

-- Indexes for ninety_rocks
CREATE INDEX IF NOT EXISTS idx_ninety_rocks_department ON ninety_rocks(department);
CREATE INDEX IF NOT EXISTS idx_ninety_rocks_assigned_user ON ninety_rocks(assigned_user);
CREATE INDEX IF NOT EXISTS idx_ninety_rocks_status ON ninety_rocks(status);
CREATE INDEX IF NOT EXISTS idx_ninety_rocks_created_date ON ninety_rocks(created_date);

-- Indexes for ninety_todos
CREATE INDEX IF NOT EXISTS idx_ninety_todos_department ON ninety_todos(department);
CREATE INDEX IF NOT EXISTS idx_ninety_todos_assigned_user ON ninety_todos(assigned_user);
CREATE INDEX IF NOT EXISTS idx_ninety_todos_status ON ninety_todos(status);
CREATE INDEX IF NOT EXISTS idx_ninety_todos_created_date ON ninety_todos(created_date);

-- Indexes for ninety_issues
CREATE INDEX IF NOT EXISTS idx_ninety_issues_department ON ninety_issues(department);
CREATE INDEX IF NOT EXISTS idx_ninety_issues_assigned_user ON ninety_issues(assigned_user);
CREATE INDEX IF NOT EXISTS idx_ninety_issues_status ON ninety_issues(status);
CREATE INDEX IF NOT EXISTS idx_ninety_issues_priority ON ninety_issues(priority);
CREATE INDEX IF NOT EXISTS idx_ninety_issues_created_date ON ninety_issues(created_date);

-- Indexes for ninety_scorecard
CREATE INDEX IF NOT EXISTS idx_ninety_scorecard_department ON ninety_scorecard(department);
CREATE INDEX IF NOT EXISTS idx_ninety_scorecard_period ON ninety_scorecard(period_start, period_end);
CREATE INDEX IF NOT EXISTS idx_ninety_scorecard_created_date ON ninety_scorecard(created_date);

-- Indexes for leadership_team
CREATE INDEX IF NOT EXISTS idx_leadership_team_department ON leadership_team(department);
CREATE INDEX IF NOT EXISTS idx_leadership_team_status ON leadership_team(status);
CREATE INDEX IF NOT EXISTS idx_leadership_team_created_at ON leadership_team(created_at);

-- Indexes for upload_logs
CREATE INDEX IF NOT EXISTS idx_upload_logs_data_type ON upload_logs(data_type);
CREATE INDEX IF NOT EXISTS idx_upload_logs_uploaded_by ON upload_logs(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_upload_logs_upload_date ON upload_logs(upload_date);

-- ===========================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ===========================================

-- Enable RLS on all tables
ALTER TABLE ninety_rocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ninety_todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ninety_issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE ninety_scorecard ENABLE ROW LEVEL SECURITY;
ALTER TABLE leadership_team ENABLE ROW LEVEL SECURITY;
ALTER TABLE upload_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (you can customize these based on your auth system)
-- For now, allowing all authenticated users to read/write all data
-- You should modify these policies based on your specific requirements

-- Ninety Rocks policies
CREATE POLICY "Allow all operations for authenticated users" ON ninety_rocks
    FOR ALL USING (auth.role() = 'authenticated');

-- Ninety Todos policies  
CREATE POLICY "Allow all operations for authenticated users" ON ninety_todos
    FOR ALL USING (auth.role() = 'authenticated');

-- Ninety Issues policies
CREATE POLICY "Allow all operations for authenticated users" ON ninety_issues
    FOR ALL USING (auth.role() = 'authenticated');

-- Ninety Scorecard policies
CREATE POLICY "Allow all operations for authenticated users" ON ninety_scorecard
    FOR ALL USING (auth.role() = 'authenticated');

-- Leadership Team policies
CREATE POLICY "Allow all operations for authenticated users" ON leadership_team
    FOR ALL USING (auth.role() = 'authenticated');

-- Upload Logs policies
CREATE POLICY "Allow all operations for authenticated users" ON upload_logs
    FOR ALL USING (auth.role() = 'authenticated');

-- ===========================================
-- FUNCTIONS AND TRIGGERS
-- ===========================================

-- Function to update updated_date timestamp
CREATE OR REPLACE FUNCTION update_updated_date_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_date = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers to automatically update updated_date
CREATE TRIGGER update_ninety_rocks_updated_date BEFORE UPDATE ON ninety_rocks
    FOR EACH ROW EXECUTE FUNCTION update_updated_date_column();

CREATE TRIGGER update_ninety_todos_updated_date BEFORE UPDATE ON ninety_todos
    FOR EACH ROW EXECUTE FUNCTION update_updated_date_column();

CREATE TRIGGER update_ninety_issues_updated_date BEFORE UPDATE ON ninety_issues
    FOR EACH ROW EXECUTE FUNCTION update_updated_date_column();

CREATE TRIGGER update_ninety_scorecard_updated_date BEFORE UPDATE ON ninety_scorecard
    FOR EACH ROW EXECUTE FUNCTION update_updated_date_column();

CREATE TRIGGER update_leadership_team_updated_at BEFORE UPDATE ON leadership_team
    FOR EACH ROW EXECUTE FUNCTION update_updated_date_column();
