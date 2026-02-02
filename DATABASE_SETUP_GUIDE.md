# AdsHub → Supabase Connection Checklist

## Current Status: ❌ NOT CONNECTED

Your app at https://adshub.onrender.com/ currently stores data in JSON files, which means:
- Data is lost on every deploy
- Changes don't persist
- Multiple users can't share data

## Step-by-Step Connection Guide

### ✅ Step 1: Create Supabase Account (5 mins)
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub or Google
4. You'll be taken to your dashboard

### ✅ Step 2: Create New Project (2 mins)
1. Click "New Project"
2. Choose settings:
   - **Name**: adshub-database
   - **Database Password**: Create a strong password (SAVE THIS!)
   - **Region**: Choose closest to your users (e.g., Southeast Asia for Philippines)
   - **Pricing Plan**: Free (no credit card needed)
3. Click "Create new project"
4. Wait 2-3 minutes for setup to complete

### ✅ Step 3: Set Up Database Tables (5 mins)
1. In your Supabase dashboard, click **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Copy and paste this SQL (includes all tables required by `db-service.js` and `server.js`):

```sql
-- Create todos table
CREATE TABLE todos (
  id BIGSERIAL PRIMARY KEY,
  task VARCHAR(255) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  priority VARCHAR(20) DEFAULT 'medium',
  due_date DATE,
  assigned_to VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create issues table
CREATE TABLE issues (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  priority VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'open',
  assigned_to VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);

-- Create goals table
CREATE TABLE goals (
  id BIGSERIAL PRIMARY KEY,
  period VARCHAR(20) NOT NULL,
  target DECIMAL(12,2) NOT NULL,
  current DECIMAL(12,2) DEFAULT 0,
  percentage INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create revenue_funnel table
CREATE TABLE revenue_funnel (
  id BIGSERIAL PRIMARY KEY,
  leads INTEGER DEFAULT 0,
  prospects INTEGER DEFAULT 0,
  qualified INTEGER DEFAULT 0,
  proposals INTEGER DEFAULT 0,
  closed INTEGER DEFAULT 0,
  revenue DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create vto table (required by /api/dashboard)
CREATE TABLE vto (
  id BIGSERIAL PRIMARY KEY,
  data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create scorecard table (required by /api/dashboard)
CREATE TABLE scorecard (
  id BIGSERIAL PRIMARY KEY,
  metric_name VARCHAR(255) NOT NULL UNIQUE,
  metric_value DECIMAL(12,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create knowledge_base table (required by /api/dashboard)
CREATE TABLE knowledge_base (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255),
  content TEXT,
  category VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE issues ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE revenue_funnel ENABLE ROW LEVEL SECURITY;
ALTER TABLE vto ENABLE ROW LEVEL SECURITY;
ALTER TABLE scorecard ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all operations for now)
CREATE POLICY "Enable all access for todos" ON todos FOR ALL USING (true);
CREATE POLICY "Enable all access for issues" ON issues FOR ALL USING (true);
CREATE POLICY "Enable all access for goals" ON goals FOR ALL USING (true);
CREATE POLICY "Enable all access for revenue_funnel" ON revenue_funnel FOR ALL USING (true);
CREATE POLICY "Enable all access for vto" ON vto FOR ALL USING (true);
CREATE POLICY "Enable all access for scorecard" ON scorecard FOR ALL USING (true);
CREATE POLICY "Enable all access for knowledge_base" ON knowledge_base FOR ALL USING (true);

-- Insert sample data
INSERT INTO goals (period, target, current, percentage) VALUES
  ('quarterly', 1000000, 750000, 75),
  ('monthly', 333333, 280000, 84);

INSERT INTO revenue_funnel (leads, prospects, qualified, proposals, closed, revenue) VALUES
  (1250, 875, 425, 180, 85, 750000);

-- One row for vto (getVTO uses .limit(1).single())
INSERT INTO vto (data) VALUES ('{}');

-- Sample scorecard rows (updateScorecard uses metric_name)
INSERT INTO scorecard (metric_name, metric_value) VALUES
  ('Customer Satisfaction', 92),
  ('Monthly Revenue', 280000),
  ('Team Productivity', 88);
```

4. Click **"Run"** (or press F5)
5. You should see "Success. No rows returned" (or success messages)

### ✅ Step 4: Get Your API Credentials (2 mins)
1. In Supabase dashboard, click **Settings** (gear icon at bottom)
2. Click **API** in the left menu
3. You'll see two important values:

**Copy these values:**
- **Project URL**: `https://xxxxxxxxxxxxx.supabase.co`
- **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (long string)

### ✅ Step 5: Update Your GitHub Repository (10 mins)

#### 5.1 Add Supabase Package
- Your `package.json` should include `"@supabase/supabase-js"` in dependencies. If not, add it and run `npm install`.

#### 5.2 db-service.js
- The project root already has `db-service.js` that uses Supabase for goals, revenue_funnel, vto, issues, scorecard, todos, and knowledge_base.

#### 5.3 server.js
- `server.js` already uses `require('./db-service')` and exposes `/api/dashboard`, `/api/goals/:period`, and CRUD for issues and todos.

#### 5.4 Environment variables locally
- Create or edit `.env` in the project root with:
  - `SUPABASE_URL` = your Project URL
  - `SUPABASE_ANON_KEY` = your anon public key
  - `PORT=3000` (optional)

### ✅ Step 6: Configure Render Environment Variables (3 mins)
1. Go to https://dashboard.render.com
2. Click on your **adshub** service
3. Click **Environment** in the left menu
4. Click **"Add Environment Variable"**
5. Add these variables:

**Variable 1:**
- Key: `SUPABASE_URL`
- Value: Your Supabase Project URL (from Step 4)

**Variable 2:**
- Key: `SUPABASE_ANON_KEY`
- Value: Your anon public key (from Step 4)

**Variable 3:**
- Key: `NODE_ENV`
- Value: `production`

6. Click **"Save Changes"**

### ✅ Step 7: Deploy and Test (5 mins)
1. Render will automatically redeploy your app
2. Wait for deployment to complete (3-5 minutes)
3. Visit https://adshub.onrender.com/
4. Try adding a todo or issue (if your frontend calls the new API)
5. Check your Supabase dashboard → Table Editor
6. You should see the data there!

## 🎉 Success! How to Verify It's Working:

1. **Add data** on https://adshub.onrender.com/
2. **Check Supabase**:
   - Go to Supabase dashboard
   - Click "Table Editor"
   - Click on the table (e.g., "todos")
   - You should see your data!
3. **Refresh the page** - data should still be there
4. **Close browser and come back** - data persists!

## 📊 Viewing Your Data in Supabase:

1. Go to your Supabase dashboard
2. Click **"Table Editor"** in the left sidebar
3. Click on any table to see the data:
   - `todos` - All todo items
   - `issues` - All issues tracked
   - `goals` - Quarterly and monthly goals
   - `revenue_funnel` - Sales pipeline data
   - `vto` - Vision/Traction Organizer data
   - `scorecard` - Scorecard metrics
   - `knowledge_base` - Knowledge articles

## 🔧 Troubleshooting:

### Problem: "Cannot connect to database"
**Solution**:
- Check environment variables in Render are correct
- Make sure you copied the full API key (it's very long)
- Verify your Supabase project is active

### Problem: "403 Forbidden" errors
**Solution**:
- Check Row Level Security policies in Supabase
- Make sure policies say `FOR ALL USING (true)` for the tables you use

### Problem: Data not showing up
**Solution**:
- Check browser console for errors (F12)
- Verify API endpoints are being called (e.g. GET `/api/dashboard`)
- Check Network tab in browser dev tools

### Problem: Render deployment fails
**Solution**:
- Make sure `@supabase/supabase-js` is in package.json dependencies
- Check Render logs for specific errors
- Verify all files are committed to GitHub

### Problem: /api/dashboard returns error (e.g. relation "vto" does not exist)
**Solution**:
- Run the full SQL in Step 3 including `vto`, `scorecard`, and `knowledge_base` tables and the one `INSERT INTO vto (data) VALUES ('{}');` so `getVTO()` has a row to return.

## 📝 Quick Reference:

**Supabase Dashboard**: https://supabase.com/dashboard  
**Render Dashboard**: https://dashboard.render.com  
**Your Live App**: https://adshub.onrender.com/

## 🚀 After Setup:

Once connected, your app will:
- ✅ Store all data permanently in Supabase
- ✅ Sync data across all users
- ✅ Keep data even after deployments
- ✅ Allow you to view/edit data in Supabase dashboard
- ✅ Scale to handle thousands of users

## Need Help?

1. Check Supabase docs: https://supabase.com/docs
2. Check the files in this repo: `db-service.js`, `server.js`, `.env.example`
3. Ensure `.env` (or Render env vars) has `SUPABASE_URL` and `SUPABASE_ANON_KEY`
