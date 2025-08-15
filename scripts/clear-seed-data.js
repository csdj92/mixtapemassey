#!/usr/bin/env node

/**
 * Remove sample/seed data from Supabase for production readiness.
 * By default, deletes only known dummy rows inserted by seed.sql.
 *
 * Flags:
 *   --all-song-requests    Delete all rows from song_requests
 *   --all-bookings         Delete all rows from booking_requests
 *   --all-events           Delete all rows from events
 *   --all-photos           Delete all rows from media_photos
 *   --all-mixes            Delete all rows from mixes except the provided keep URL
 *   --keep-mix-url "..."    URL to preserve when using --all-mixes
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing env vars: NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const args = process.argv.slice(2);
const has = (flag) => args.includes(flag);
const getArg = (flag) => {
  const i = args.indexOf(flag);
  return i >= 0 ? args[i + 1] : undefined;
};

const keepMixUrl = getArg('--keep-mix-url');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function run() {
  console.log('🧹 Removing dummy seed data...');

  // mixes
  if (has('--all-mixes')) {
    console.log('  - Deleting mixes (all)');
    if (keepMixUrl) {
      await supabase.rpc('delete_mixes_except_url', { keep_url: keepMixUrl }).catch(async () => {
        const { error } = await supabase
          .from('mixes')
          .delete()
          .neq('url', keepMixUrl);
        if (error) throw error;
      });
    } else {
      const { error } = await supabase.from('mixes').delete().neq('id', '');
      if (error) throw error;
    }
  } else {
    console.log('  - Deleting known dummy mixes');
    const dummyMixTitles = [
      'Summer Vibes 2024',
      'Wedding Reception Mix',
      'Corporate Event Highlights',
      'Deep House Sessions',
      'Top 40 Dance Mix',
    ];
    const { error } = await supabase
      .from('mixes')
      .delete()
      .in('title', dummyMixTitles);
    if (error) throw error;
  }

  // events
  if (has('--all-events')) {
    console.log('  - Deleting events (all)');
    const { error } = await supabase.from('events').delete().neq('id', '');
    if (error) throw error;
  } else {
    console.log('  - Deleting known dummy events');
    const dummyEventTitles = [
      'Wedding Reception - Smith & Johnson',
      'Corporate Annual Party',
      'Private Birthday Celebration',
      'Nightclub Performance',
      'Charity Fundraiser Gala',
    ];
    const { error } = await supabase.from('events').delete().in('title', dummyEventTitles);
    if (error) throw error;
  }

  // media_photos
  if (has('--all-photos')) {
    console.log('  - Deleting media photos (all)');
    const { error } = await supabase.from('media_photos').delete().neq('id', '');
    if (error) throw error;
  } else {
    console.log('  - Deleting dummy media photos from example.com');
    const { error } = await supabase.from('media_photos').delete().like('url', 'https://example.com/%');
    if (error) throw error;
  }

  // booking_requests
  if (has('--all-bookings')) {
    console.log('  - Deleting booking requests (all)');
    const { error } = await supabase.from('booking_requests').delete().neq('id', '');
    if (error) throw error;
  } else {
    console.log('  - Deleting known dummy booking requests');
    const dummyEmails = [
      'john.smith@example.com',
      'sarah.j@company.com',
      'mike.wilson@email.com',
    ];
    const { error } = await supabase.from('booking_requests').delete().in('email', dummyEmails);
    if (error) throw error;
  }

  // song_requests
  if (has('--all-song-requests')) {
    console.log('  - Deleting song requests (all)');
    const { error } = await supabase.from('song_requests').delete().neq('id', '');
    if (error) throw error;
  } else {
    console.log('  - Deleting known dummy song requests');
    const dummyArtists = ['Daft Punk', 'Bruno Mars', 'The Weeknd', 'Ed Sheeran'];
    const { error } = await supabase.from('song_requests').delete().in('artist', dummyArtists);
    if (error) throw error;
  }

  console.log('✅ Dummy data removed');
}

run().catch((err) => {
  console.error('❌ Error while clearing seed data:', err?.message || err);
  process.exit(1);
});


