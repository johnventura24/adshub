#!/usr/bin/env node

/**
 * Migration Script: Admin Data to Supabase
 * 
 * This script migrates existing admin data from JSON files to Supabase.
 * Run this script after setting up your Supabase database and environment variables.
 * 
 * Usage: node migrate-to-supabase.js
 */

const fs = require('fs').promises;
const path = require('path');
const { supabase, TABLES, isSupabaseConfigured } = require('./supabase-config');

async function migrateDataToSupabase() {
  console.log('🚀 Starting migration from admin files to Supabase...');
  
  // Check if Supabase is configured
  if (!isSupabaseConfigured()) {
    console.error('❌ Supabase not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.');
    process.exit(1);
  }

  const dataDir = path.join(__dirname, 'data');
  const dataTypes = ['rocks', 'todos', 'issues', 'scorecard'];
  
  let totalMigrated = 0;
  let totalErrors = 0;

  for (const dataType of dataTypes) {
    try {
      console.log(`\n📂 Migrating ${dataType} data...`);
      
      const filePath = path.join(dataDir, `ninety_${dataType}.json`);
      
      // Check if file exists
      try {
        await fs.access(filePath);
      } catch (error) {
        console.log(`⚠️ File ${filePath} not found, skipping...`);
        continue;
      }

      // Read JSON file
      const fileContent = await fs.readFile(filePath, 'utf8');
      const data = JSON.parse(fileContent);
      
      if (!Array.isArray(data) || data.length === 0) {
        console.log(`📋 No ${dataType} data to migrate`);
        continue;
      }

      console.log(`📊 Found ${data.length} ${dataType} records to migrate`);

      // Transform data for Supabase
      const transformedData = data.map(item => ({
        ...item,
        created_date: item.created_date || new Date().toISOString(),
        updated_date: item.updated_date || new Date().toISOString(),
        created_by: item.created_by || null
      }));

      // Get table name
      const tableName = TABLES[`NINETY_${dataType.toUpperCase()}`];
      if (!tableName) {
        console.error(`❌ Unknown table for data type: ${dataType}`);
        continue;
      }

      // Insert data into Supabase
      const { data: result, error } = await supabase
        .from(tableName)
        .insert(transformedData)
        .select();

      if (error) {
        console.error(`❌ Error migrating ${dataType} data:`, error.message);
        totalErrors += data.length;
        continue;
      }

      console.log(`✅ Successfully migrated ${result.length} ${dataType} records to Supabase`);
      totalMigrated += result.length;

    } catch (error) {
      console.error(`❌ Error processing ${dataType} data:`, error.message);
      totalErrors++;
    }
  }

  // Migrate leadership team data if exists
  try {
    console.log(`\n👥 Migrating leadership team data...`);
    
    // Check if leadership data exists in data service
    const dataService = require('./data-service');
    const leadershipData = await dataService.getLeadershipTeamData();
    
    if (leadershipData && leadershipData.leaders && leadershipData.leaders.length > 0) {
      const transformedLeaders = leadershipData.leaders.map(leader => ({
        ...leader,
        created_at: leader.created_at || new Date().toISOString(),
        updated_at: leader.updated_at || new Date().toISOString(),
        created_by: leader.created_by || null
      }));

      const { data: result, error } = await supabase
        .from(TABLES.LEADERSHIP_TEAM)
        .insert(transformedLeaders)
        .select();

      if (error) {
        console.error(`❌ Error migrating leadership team data:`, error.message);
        totalErrors += leadershipData.leaders.length;
      } else {
        console.log(`✅ Successfully migrated ${result.length} leadership team records to Supabase`);
        totalMigrated += result.length;
      }
    } else {
      console.log(`📋 No leadership team data to migrate`);
    }
  } catch (error) {
    console.error(`❌ Error processing leadership team data:`, error.message);
    totalErrors++;
  }

  // Summary
  console.log(`\n📊 Migration Summary:`);
  console.log(`✅ Total records migrated: ${totalMigrated}`);
  console.log(`❌ Total errors: ${totalErrors}`);
  
  if (totalErrors === 0) {
    console.log(`\n🎉 Migration completed successfully!`);
    console.log(`\n📝 Next steps:`);
    console.log(`1. Update your .env file with Supabase credentials`);
    console.log(`2. Restart your application`);
    console.log(`3. Verify data is loading from Supabase in the admin panel`);
    console.log(`4. Consider backing up and removing old JSON files after verification`);
  } else {
    console.log(`\n⚠️ Migration completed with errors. Please review the errors above.`);
  }
}

// Run migration if this script is executed directly
if (require.main === module) {
  migrateDataToSupabase()
    .then(() => {
      console.log('\n🏁 Migration script finished');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = { migrateDataToSupabase };
