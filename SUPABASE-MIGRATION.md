# Supabase Migration Guide

This guide will help you migrate your Adsync Media Hub from admin-based data storage to Supabase.

## Overview

The application has been updated to use Supabase as the primary data store instead of the previous admin-based system. This provides:

- **Better scalability**: Cloud-based PostgreSQL database
- **Real-time capabilities**: Built-in real-time subscriptions
- **Better security**: Row-level security and authentication
- **Easier management**: Web-based dashboard for data management
- **Backup and recovery**: Automatic backups and point-in-time recovery

## Prerequisites

1. **Supabase Account**: Sign up at [supabase.com](https://supabase.com)
2. **Node.js**: Version 18 or higher
3. **Existing Data**: Your current admin data in JSON files

## Step 1: Set Up Supabase Project

1. **Create a new project** in your Supabase dashboard
2. **Get your credentials**:
   - Project URL (e.g., `https://your-project.supabase.co`)
   - Anon key (public key)
   - Service role key (for server-side operations)

## Step 2: Configure Environment Variables

Add these variables to your `.env` file:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Optional: Keep existing database configs as fallback
PG_HOST=localhost
PG_PORT=5432
PG_DATABASE=your_db
PG_USER=your_user
PG_PASSWORD=your_password
```

## Step 3: Set Up Database Schema

1. **Open your Supabase project dashboard**
2. **Go to SQL Editor**
3. **Run the schema script**: Copy and paste the contents of `supabase-schema.sql`
4. **Execute the script** to create all necessary tables and indexes

## Step 4: Install Dependencies

```bash
npm install
```

This will install the new `@supabase/supabase-js` dependency.

## Step 5: Migrate Existing Data

Run the migration script to move your existing admin data to Supabase:

```bash
node migrate-to-supabase.js
```

This script will:
- Read all JSON files from the `data/` directory
- Transform the data to match the Supabase schema
- Upload the data to your Supabase database
- Provide a summary of the migration

## Step 6: Test the Migration

1. **Start your application**:
   ```bash
   npm start
   ```

2. **Verify data loading**:
   - Check the admin panel at `http://localhost:3000/admin`
   - Verify that all your data is visible
   - Test uploading new data

3. **Check Supabase dashboard**:
   - Go to your Supabase project
   - Check the "Table Editor" to see your migrated data

## Step 7: Clean Up (Optional)

After verifying everything works correctly:

1. **Backup your JSON files** (just in case)
2. **Remove JSON files** from the `data/` directory
3. **Update your deployment** with the new environment variables

## Data Structure

The migration creates these tables in Supabase:

- `ninety_rocks` - Goals/Rocks data
- `ninety_todos` - Todo items
- `ninety_issues` - Issues tracking
- `ninety_scorecard` - Scorecard metrics
- `leadership_team` - Leadership team members
- `upload_logs` - Upload history and logs

## Features

### Real-time Updates
The application now supports real-time updates through Supabase's real-time capabilities.

### Row-Level Security
All tables have Row-Level Security (RLS) enabled for better data protection.

### Automatic Timestamps
All records automatically get `created_date` and `updated_date` timestamps.

### Metadata Support
Each record can store additional metadata in a JSONB field.

## Troubleshooting

### Common Issues

1. **"Supabase not configured" error**:
   - Check your environment variables
   - Ensure `SUPABASE_URL` and `SUPABASE_ANON_KEY` are set

2. **Migration fails**:
   - Check your Supabase credentials
   - Ensure the database schema is properly set up
   - Check the Supabase logs for detailed error messages

3. **Data not loading**:
   - Verify the migration completed successfully
   - Check the browser console for errors
   - Ensure your Supabase project is active

### Fallback Behavior

The application is designed to gracefully fall back to the previous data storage methods if Supabase is not available:

1. **Supabase** (primary)
2. **Legacy database** (PostgreSQL/MySQL/MongoDB)
3. **JSON files** (final fallback)

## Support

If you encounter issues:

1. **Check the logs** in your application console
2. **Review Supabase logs** in your project dashboard
3. **Verify environment variables** are correctly set
4. **Test with a small dataset** first

## Migration Script Options

The migration script (`migrate-to-supabase.js`) can be customized:

```javascript
// Run specific data types only
const dataTypes = ['rocks', 'todos']; // Only migrate these types

// Skip certain tables
const skipTables = ['leadership_team'];

// Custom transformation
const transformedData = data.map(item => ({
  ...item,
  custom_field: 'custom_value'
}));
```

## Next Steps

After successful migration:

1. **Monitor performance** in Supabase dashboard
2. **Set up monitoring** for your application
3. **Consider enabling additional Supabase features** like:
   - Real-time subscriptions
   - Edge functions
   - Storage for file uploads
   - Authentication (if not already using)

## Rollback Plan

If you need to rollback:

1. **Stop the application**
2. **Restore JSON files** from backup
3. **Remove Supabase environment variables**
4. **Restart the application**

The application will automatically fall back to the previous data storage methods.
