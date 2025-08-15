# Database Setup Guide

This guide will help you set up the database schema and authentication for the MixtapeMassey site.

## Prerequisites

- A Supabase project (already configured with URL and anon key)
- Access to the Supabase dashboard

## Step 1: Get Your Service Role Key

1. Go to your Supabase project dashboard
2. Navigate to **Settings** > **API**
3. Copy the **service_role** key (not the anon key)
4. Add it to your `.env.local` file:

```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 2: Set Up Database Schema

You have two options to set up the database:

### Option A: Automated Setup (Recommended)

Once you have the service role key configured:

```bash
npm run db:setup
```

This will automatically:
- Create all database tables
- Set up Row Level Security policies
- Insert seed data for testing

### Option B: Manual Setup

If the automated setup doesn't work, you can manually run the SQL files:

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Run each file in this order:
   - `supabase/schema.sql` - Creates tables and indexes
   - `supabase/policies.sql` - Sets up security policies
   - `supabase/seed.sql` - Adds sample data

## Step 3: Create Admin User

1. Go to **Authentication** > **Users** in your Supabase dashboard
2. Click **Add user**
3. Enter your email address
4. Choose **Auto Confirm User** to skip email verification
5. Set a password or use email magic link
6. This user will have admin access to the `/admin` panel

## Step 4: Test the Setup

Run the database test to verify everything is working:

```bash
npm run db:test
```

This will test:
- Database connection
- Public data access (settings, mixes, events)
- Row Level Security policies
- Form submission capabilities

## Step 5: Start Development

```bash
npm run dev
```

Visit:
- `http://localhost:3000` - Public site
- `http://localhost:3000/admin` - Admin panel (requires login)

## Database Schema Overview

### Tables Created

- **settings** - Site configuration and content
- **mixes** - Featured music mixes and media
- **media_photos** - Photo gallery and press images  
- **events** - Calendar events and gigs
- **booking_requests** - Client booking inquiries
- **song_requests** - Song requests from event attendees

### Security Model

- **Public users** can read public content and submit requests
- **Authenticated users** (admins) have full access to manage content
- All sensitive data is protected by Row Level Security

## Troubleshooting

### "Could not find table" errors
- Make sure you've run the schema setup first
- Check that the SQL executed without errors in the Supabase dashboard

### Permission denied errors
- Verify your service role key is correct
- Ensure RLS policies are properly applied

### Connection errors
- Check your Supabase URL and keys in `.env.local`
- Verify your Supabase project is active and not paused

## Next Steps

After successful setup:

1. Customize the seed data in `supabase/seed.sql`
2. Update site settings through the admin panel
3. Add your own mixes, events, and media
4. Configure email notifications for booking requests
5. Set up analytics and monitoring

## File Structure

```
supabase/
├── schema.sql      # Database tables and indexes
├── policies.sql    # Row Level Security policies  
├── seed.sql        # Sample data for development
└── README.md       # Detailed database documentation

scripts/
├── setup-database.js  # Automated setup script
└── test-database.js   # Database testing script
```