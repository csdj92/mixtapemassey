#!/usr/bin/env node

/**
 * Upsert a mix row with a provided SoundCloud URL.
 * Usage: node scripts/update-mix.js "<Title>" "<soundcloud|mixcloud|youtube>" "<URL>" [display_order]
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing env: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function upsertMix({ title, platform, url, display_order }) {
    // Find existing by exact URL
    const { data: existing, error: fetchError } = await supabase
        .from('mixes')
        .select('*')
        .eq('url', url)
        .limit(1);

    if (fetchError) throw fetchError;

    const payload = {
        title,
        platform,
        url,
        featured: true,
        display_order: Number(display_order ?? 1),
        updated_at: new Date().toISOString(),
    };

    let result;
    if (existing && existing.length > 0) {
        result = await supabase
            .from('mixes')
            .update(payload)
            .eq('id', existing[0].id)
            .select();
    } else {
        result = await supabase
            .from('mixes')
            .insert({ ...payload, created_at: new Date().toISOString() })
            .select();
    }

    if (result.error) throw result.error;
    return result.data?.[0];
}

async function main() {
    const title = process.argv[2] || 'High Fashion 2';
    const platform = process.argv[3] || 'soundcloud';
    const url = process.argv[4] || 'https://soundcloud.com/mixtapemassey/high-fashion-2';
    const display_order = process.argv[5] || 1;

    if (!/^https?:\/\//.test(url)) {
        console.error('❌ Please provide a valid URL');
        process.exit(1);
    }

    if (!['soundcloud', 'mixcloud', 'youtube'].includes(platform)) {
        console.error('❌ Platform must be one of: soundcloud | mixcloud | youtube');
        process.exit(1);
    }

    console.log('🚀 Upserting mix...');
    const row = await upsertMix({ title, platform, url, display_order });
    console.log('✅ Mix saved:', { id: row.id, title: row.title, platform: row.platform, url: row.url });
}

if (require.main === module) {
    main().catch((err) => {
        console.error('❌ Failed:', err?.message || err);
        process.exit(1);
    });
}

module.exports = { upsertMix };


