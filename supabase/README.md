# Database Setup for MixtapeMassey Site

This directory contains the database schema, policies, and seed data for the MixtapeMassey site.

## Files

- `schema.sql` - Complete database schema with tables and indexes
- `policies.sql` - Row Level Security policies for data access control
- `seed.sql` - Initial seed data for development and testing

## Setup Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be fully provisioned
3. Copy your project URL and anon key from the API settings

### 2. Configure Environment Variables

Update your `.env.local` file with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 3. Run Database Setup

You can set up the database in two ways:

#### Option A: Using the Setup Script (Recommended)

```bash
node scripts/setup-database.js
```

#### Option B: Manual Setup via Supabase Dashboard

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run each SQL file in order:
   - First: `schema.sql`
   - Second: `policies.sql`
   - Third: `seed.sql`

### 4. Create Admin User

1. Go to Authentication > Users in your Supabase dashboard
2. Click "Add user"
3. Enter an email address for the admin user
4. Set a temporary password or use email confirmation
5. The user will be able to access the admin panel at `/admin`

## Database Schema Overview

### Tables

- **settings** - Site configuration and content
- **mixes** - Featured music mixes and media
- **media_photos** - Photo gallery and press images
- **events** - Calendar events and gigs
- **booking_requests** - Client booking inquiries
- **song_requests** - Song requests from event attendees

### Security

All tables use Row Level Security (RLS) with the following access patterns:

- **Public users** can:
  - Read site settings and public content
  - Submit booking and song requests
  - View public events and featured mixes

- **Authenticated admin users** can:
  - Full CRUD access to all data
  - Manage requests and content
  - Access analytics and dashboard data

## Development Notes

- The seed data includes sample content for testing
- All timestamps are stored in UTC
- Foreign key relationships maintain data integrity
- Indexes are optimized for common query patterns

## Troubleshooting

### Common Issues

1. **Permission Denied Errors**
   - Ensure you're using the service role key for setup
   - Check that RLS policies are correctly applied

2. **Connection Errors**
   - Verify your Supabase URL and keys are correct
   - Ensure your project is fully provisioned

3. **SQL Execution Errors**
   - Check for syntax errors in the SQL files
   - Ensure you're running files in the correct order

### Getting Help

- Check the Supabase documentation: https://supabase.com/docs
- Review the project's GitHub issues
- Contact the development team