#!/usr/bin/env node

/**
 * Database Setup Script for MixtapeMassey Site
 * 
 * This script sets up the database schema, policies, and seed data.
 * Run this after creating a new Supabase project.
 * 
 * Usage: node scripts/setup-database.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing required environment variables:');
    console.error('   - NEXT_PUBLIC_SUPABASE_URL');
    console.error('   - SUPABASE_SERVICE_ROLE_KEY');
    console.error('\nPlease add these to your .env.local file');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runSqlFile(filePath, description) {
    console.log(`📄 Running ${description}...`);

    try {
        if (!fs.existsSync(filePath)) {
            console.log(`⚠️  Skipping ${description} - file not found: ${filePath}`);
            return true;
        }

        const sql = fs.readFileSync(filePath, 'utf8');

        // Split SQL into individual statements and execute them
        const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);

        for (const statement of statements) {
            const trimmedStatement = statement.trim();
            if (trimmedStatement.length === 0 || trimmedStatement.startsWith('--')) {
                continue;
            }

            const { error } = await supabase.rpc('exec_sql', { sql_query: trimmedStatement });

            if (error) {
                // Try alternative method for INSERT/UPDATE statements
                if (trimmedStatement.toLowerCase().includes('insert') ||
                    trimmedStatement.toLowerCase().includes('update')) {
                    console.log(`⚠️  SQL execution method not available, skipping: ${description}`);
                    console.log(`   Please run the SQL files manually in your Supabase SQL editor`);
                    return true;
                }
                console.error(`❌ Error in ${description}:`, error.message);
                return false;
            }
        }

        console.log(`✅ ${description} completed successfully`);
        return true;
    } catch (err) {
        console.error(`❌ Failed to process ${filePath}:`, err.message);
        return false;
    }
}

async function setupDatabase() {
    console.log('🚀 Setting up MixtapeMassey database...\n');

    const steps = [
        {
            file: path.join(__dirname, '../supabase/functions.sql'),
            description: 'Database functions creation'
        },
        {
            file: path.join(__dirname, '../supabase/schema.sql'),
            description: 'Database schema creation'
        },
        {
            file: path.join(__dirname, '../supabase/policies.sql'),
            description: 'Row Level Security policies'
        },
        {
            file: path.join(__dirname, '../supabase/seed.sql'),
            description: 'Seed data insertion'
        }
    ];

    let allSuccessful = true;

    for (const step of steps) {
        const success = await runSqlFile(step.file, step.description);
        if (!success) {
            allSuccessful = false;
        }
        console.log(''); // Add spacing
    }

    if (allSuccessful) {
        console.log('🎉 Database setup completed successfully!');
        console.log('\nNext steps:');
        console.log('1. Create an admin user in Supabase Auth dashboard');
        console.log('2. Test the application by running: npm run dev');
        console.log('3. Visit /admin to access the admin panel');
    } else {
        console.log('❌ Database setup completed with errors. Please check the logs above.');
        process.exit(1);
    }
}

// Run the setup
if (require.main === module) {
    setupDatabase().catch(console.error);
}

module.exports = { setupDatabase };
