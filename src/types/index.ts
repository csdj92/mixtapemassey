// Database types for MixtapeMassey Site

export interface Settings {
    id: string;
    site_title: string | null;
    hero_heading: string | null;
    hero_sub: string | null;
    logo_url: string | null;
    theme: 'dark' | 'light';
    socials: Record<string, string>;
    rider_file_url: string | null;
    bio: string | null;
    genres: string[];
    client_logos: Array<{ name: string; url: string; alt?: string }>;
    created_at: string;
    updated_at: string;
}

export interface Mix {
    id: string;
    title: string;
    platform: 'soundcloud' | 'mixcloud' | 'youtube';
    url: string;
    featured: boolean;
    display_order: number;
    created_at: string;
    updated_at: string;
}

export interface MediaPhoto {
    id: string;
    url: string;
    alt_text: string | null;
    is_press: boolean;
    display_order: number;
    created_at: string;
    updated_at: string;
}

export interface Event {
    id: string;
    title: string;
    start_at: string;
    end_at: string | null;
    venue: string | null;
    city: string | null;
    is_public: boolean;
    status: 'scheduled' | 'completed' | 'cancelled';
    created_at: string;
    updated_at: string;
}

export interface BookingRequest {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    event_date: string | null;
    venue: string | null;
    attendees: number | null;
    budget_range: string | null;
    message: string | null;
    status: 'new' | 'approved' | 'declined';
    internal_notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface SongRequest {
    id: string;
    event_id: string | null;
    requester_name: string | null;
    artist: string;
    track: string;
    dedication: string | null;
    approved: boolean;
    created_at: string;
    updated_at: string;
}

// Form types for client-side validation
export interface BookingFormData {
    name: string;
    email: string;
    phone?: string;
    event_date?: string;
    venue?: string;
    attendees?: number;
    budget_range?: string;
    message?: string;
}

export interface SongRequestFormData {
    requester_name?: string;
    artist: string;
    track: string;
    dedication?: string;
    event_id?: string;
}

// Database table names for type safety
export type DatabaseTable =
    | 'settings'
    | 'mixes'
    | 'media_photos'
    | 'events'
    | 'booking_requests'
    | 'song_requests';

// Re-export database types
export type { Database } from './database';
