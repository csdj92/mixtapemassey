#!/usr/bin/env node

/**
 * Update Settings Script for MixtapeMassey Site
 * 
 * This script updates the settings with real social media links.
 * 
 * Usage: node scripts/update-settings.js
 */

const { createClient } = require('@supabase/supabase-js');

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

async function updateSettings() {
    console.log('🚀 Updating MixtapeMassey settings...\n');

    try {
        // First, check if settings exist
        const { data: existingSettings, error: fetchError } = await supabase
            .from('settings')
            .select('*')
            .limit(1);

        if (fetchError) {
            console.error('❌ Error fetching existing settings:', fetchError.message);
            return;
        }

        const settingsData = {
            site_title: 'Mixtape Massey',
            hero_heading: 'Professional DJ Services',
            hero_sub: 'Creating unforgettable experiences through music',
            theme: 'dark',
            bio: 'Professional DJ with over 10 years of experience in creating memorable events. Specializing in weddings, corporate events, and nightclub performances. Known for reading the crowd and creating the perfect atmosphere for any occasion.',
            socials: {
                soundcloud: 'https://soundcloud.com/mixtapemassey',
                tiktok: 'https://www.tiktok.com/@mixtapemassey',
                instagram: 'https://www.instagram.com/mixtapemassey_/?hl=en'
            },
            updated_at: new Date().toISOString()
        };

        let result;
        if (existingSettings && existingSettings.length > 0) {
            // Update existing settings
            result = await supabase
                .from('settings')
                .update(settingsData)
                .eq('id', existingSettings[0].id)
                .select();
        } else {
            // Insert new settings
            result = await supabase
                .from('settings')
                .insert(settingsData)
                .select();
        }

        if (result.error) {
            console.error('❌ Error updating settings:', result.error.message);
            return;
        }

        console.log('✅ Settings updated successfully!');
        console.log('📱 Social media links updated:');
        console.log('   - SoundCloud: https://soundcloud.com/mixtapemassey');
        console.log('   - TikTok: https://www.tiktok.com/@mixtapemassey');
        console.log('   - Instagram: https://www.instagram.com/mixtapemassey_/?hl=en');
        console.log('\n🎉 Your homepage will now display the correct social media links!');

    } catch (err) {
        console.error('❌ Unexpected error:', err.message);
    }
}

// Run the update
if (require.main === module) {
    updateSettings().catch(console.error);
}

module.exports = { updateSettings };