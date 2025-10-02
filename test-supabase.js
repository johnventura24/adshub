#!/usr/bin/env node

/**
 * Supabase Connection Test
 * 
 * This script tests the Supabase connection and basic operations.
 * Run this to verify your Supabase setup before migrating data.
 * 
 * Usage: node test-supabase.js
 */

const { supabase, TABLES, isSupabaseConfigured } = require('./supabase-config');

async function testSupabaseConnection() {
  console.log('🧪 Testing Supabase connection...');
  
  // Check if Supabase is configured
  if (!isSupabaseConfigured()) {
    console.error('❌ Supabase not configured. Please set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.');
    process.exit(1);
  }

  try {
    // Test 1: Basic connection
    console.log('\n1️⃣ Testing basic connection...');
    const { data, error } = await supabase.from(TABLES.NINETY_ROCKS).select('count').limit(1);
    
    if (error) {
      console.error('❌ Connection test failed:', error.message);
      return false;
    }
    
    console.log('✅ Basic connection successful');

    // Test 2: Table existence check
    console.log('\n2️⃣ Testing table existence...');
    const tables = Object.values(TABLES);
    
    for (const tableName of tables) {
      try {
        const { error: tableError } = await supabase.from(tableName).select('*').limit(1);
        if (tableError) {
          console.error(`❌ Table ${tableName} not accessible:`, tableError.message);
          return false;
        }
        console.log(`✅ Table ${tableName} accessible`);
      } catch (err) {
        console.error(`❌ Error checking table ${tableName}:`, err.message);
        return false;
      }
    }

    // Test 3: Insert test data
    console.log('\n3️⃣ Testing data insertion...');
    const testData = {
      title: 'Test Rock',
      description: 'This is a test rock for connection testing',
      department: 'test',
      assigned_user: 'test-user',
      priority: 'low',
      status: 'active'
    };

    const { data: insertData, error: insertError } = await supabase
      .from(TABLES.NINETY_ROCKS)
      .insert([testData])
      .select();

    if (insertError) {
      console.error('❌ Insert test failed:', insertError.message);
      return false;
    }

    console.log('✅ Data insertion successful');
    console.log('📊 Inserted record ID:', insertData[0].id);

    // Test 4: Clean up test data
    console.log('\n4️⃣ Cleaning up test data...');
    const { error: deleteError } = await supabase
      .from(TABLES.NINETY_ROCKS)
      .delete()
      .eq('id', insertData[0].id);

    if (deleteError) {
      console.error('❌ Cleanup failed:', deleteError.message);
      return false;
    }

    console.log('✅ Test data cleaned up successfully');

    // Test 5: Check RLS policies
    console.log('\n5️⃣ Testing Row Level Security...');
    const { data: rlsData, error: rlsError } = await supabase
      .from(TABLES.NINETY_ROCKS)
      .select('*')
      .limit(1);

    if (rlsError) {
      console.error('❌ RLS test failed:', rlsError.message);
      return false;
    }

    console.log('✅ RLS policies working correctly');

    console.log('\n🎉 All tests passed! Your Supabase setup is working correctly.');
    console.log('\n📝 Next steps:');
    console.log('1. Run: node migrate-to-supabase.js');
    console.log('2. Start your application: npm start');
    console.log('3. Verify data in the admin panel');

    return true;

  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
    return false;
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  testSupabaseConnection()
    .then((success) => {
      if (success) {
        console.log('\n🏁 All tests completed successfully');
        process.exit(0);
      } else {
        console.log('\n💥 Tests failed');
        process.exit(1);
      }
    })
    .catch((error) => {
      console.error('\n💥 Test script failed:', error);
      process.exit(1);
    });
}

module.exports = { testSupabaseConnection };
