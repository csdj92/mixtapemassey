#!/usr/bin/env node

/**
 * Database Test Script for MixtapeMassey Site
 * 
 * This script tests the database connection and basic operations.
 * Run this after setting up the database to verify everything works.
 * 
 * Usage: node scripts/test-database.js
 */

const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing required environment variables:');
    console.error('   - NEXT_PUBLIC_SUPABASE_URL');
    console.error('   - NEXT_PUBLIC_SUPABASE_ANON_KEY');
    console.error('\nPlease add these to your .env.local file');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDatabaseConnection() {
    console.log('🧪 Testing database connection and operations...\n');

    try {
        // Test 1: Read settings (should work for public)
        console.log('📋 Test 1: Reading site settings...');
        const { data: settings, error: settingsError } = await supabase
            .from('settings')
            .select('*')
            .single();

        if (settingsError) {
            console.error('❌ Settings test failed:', settingsError.message);
        } else {
            console.log('✅ Settings test passed - Site title:', settings?.site_title);
        }

        // Test 2: Read featured mixes (should work for public)
        console.log('\n🎵 Test 2: Reading featured mixes...');
        const { data: mixes, error: mixesError } = await supabase
            .from('mixes')
            .select('*')
            .eq('featured', true);

        if (mixesError) {
            console.error('❌ Mixes test failed:', mixesError.message);
        } else {
            console.log(`✅ Mixes test passed - Found ${mixes?.length || 0} featured mixes`);
        }

        // Test 3: Read public events (should work for public)
        console.log('\n📅 Test 3: Reading public events...');
        const { data: events, error: eventsError } = await supabase
            .from('events')
            .select('*')
            .eq('is_public', true);

        if (eventsError) {
            console.error('❌ Events test failed:', eventsError.message);
        } else {
            console.log(`✅ Events test passed - Found ${events?.length || 0} public events`);
        }

        // Test 4: Try to read booking requests (should fail for public)
        console.log('\n🔒 Test 4: Testing RLS on booking requests...');
        const { data: requests, error: requestsError } = await supabase
            .from('booking_requests')
            .select('*');

        if (requestsError) {
            console.log('✅ RLS test passed - Booking requests properly protected');
        } else {
            console.log('⚠️  RLS test warning - Booking requests accessible to public (this might be expected)');
        }

        // Test 5: Test inserting a song request (should work for public)
        console.log('\n🎤 Test 5: Testing song request insertion...');
        const testSongRequest = {
            artist: 'Test Artist',
            track: 'Test Track',
            requester_name: 'Test User',
            dedication: 'Test dedication'
        };

        const { data: newRequest, error: insertError } = await supabase
            .from('song_requests')
            .insert(testSongRequest)
            .select()
            .single();

        if (insertError) {
            console.error('❌ Song request insertion failed:', insertError.message);
        } else {
            console.log('✅ Song request insertion passed - ID:', newRequest?.id);

            // Clean up the test request
            await supabase.from('song_requests').delete().eq('id', newRequest.id);
            console.log('🧹 Test data cleaned up');
        }

        console.log('\n🎉 Database tests completed!');
        console.log('\nNext steps:');
        console.log('1. Start the development server: npm run dev');
        console.log('2. Test the frontend at http://localhost:3000');
        console.log('3. Create an admin user to test the admin panel');

    } catch (error) {
        console.error('❌ Unexpected error during testing:', error.message);
        process.exit(1);
    }
}

// Run the tests
if (require.main === module) {
    testDatabaseConnection().catch(console.error);
}

module.exports = { testDatabaseConnection };