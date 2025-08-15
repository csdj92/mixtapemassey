# MixtapeMassey Site

A professional MixtapeMassey website built with Next.js, TypeScript, and Supabase. Features a public-facing portfolio for fans and clients, plus an admin panel for content and request management.

## Features

- 🎵 Professional MixtapeMassey with media galleries
- 📅 Event management and booking system
- 🎧 Song request functionality
- 🔐 Admin dashboard for content management
- 📱 Mobile-first responsive design
- ⚡ Fast performance with Next.js and Vercel
- 🎨 Customizable themes and branding

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel
- **Analytics**: Plausible/Umami

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy environment variables:
   ```bash
   cp .env.example .env.local
   ```

4. Update `.env.local` with your Supabase credentials and booking envs:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Booking (spam + email notifications)
   NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_turnstile_site_key
   TURNSTILE_SECRET_KEY=your_turnstile_secret_key
   RESEND_API_KEY=your_resend_api_key
   BOOKING_NOTIFY_EMAIL=you@example.com
   BOOKING_FROM_EMAIL=Bookings <notifications@yourdomain.com>
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Development Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── app/              # Next.js App Router pages
├── components/       # Reusable UI components
├── lib/             # Utilities and configurations
├── types/           # TypeScript type definitions
├── hooks/           # Custom React hooks
└── utils/           # Helper functions
```

## License

This project is private and proprietary.
# mixtapemassey
