// Generated database types for Supabase
export interface Database {
    public: {
        Tables: {
            settings: {
                Row: {
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
                };
                Insert: {
                    id?: string;
                    site_title?: string | null;
                    hero_heading?: string | null;
                    hero_sub?: string | null;
                    logo_url?: string | null;
                    theme?: 'dark' | 'light';
                    socials?: Record<string, string>;
                    rider_file_url?: string | null;
                    bio?: string | null;
                    genres?: string[];
                    client_logos?: Array<{ name: string; url: string; alt?: string }>;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    site_title?: string | null;
                    hero_heading?: string | null;
                    hero_sub?: string | null;
                    logo_url?: string | null;
                    theme?: 'dark' | 'light';
                    socials?: Record<string, string>;
                    rider_file_url?: string | null;
                    bio?: string | null;
                    genres?: string[];
                    client_logos?: Array<{ name: string; url: string; alt?: string }>;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            mixes: {
                Row: {
                    id: string;
                    title: string;
                    platform: 'soundcloud' | 'mixcloud' | 'youtube';
                    url: string;
                    featured: boolean;
                    display_order: number;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    title: string;
                    platform: 'soundcloud' | 'mixcloud' | 'youtube';
                    url: string;
                    featured?: boolean;
                    display_order?: number;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    title?: string;
                    platform?: 'soundcloud' | 'mixcloud' | 'youtube';
                    url?: string;
                    featured?: boolean;
                    display_order?: number;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            media_photos: {
                Row: {
                    id: string;
                    url: string;
                    alt_text: string | null;
                    is_press: boolean;
                    display_order: number;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    url: string;
                    alt_text?: string | null;
                    is_press?: boolean;
                    display_order?: number;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    url?: string;
                    alt_text?: string | null;
                    is_press?: boolean;
                    display_order?: number;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            events: {
                Row: {
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
                };
                Insert: {
                    id?: string;
                    title: string;
                    start_at: string;
                    end_at?: string | null;
                    venue?: string | null;
                    city?: string | null;
                    is_public?: boolean;
                    status?: 'scheduled' | 'completed' | 'cancelled';
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    title?: string;
                    start_at?: string;
                    end_at?: string | null;
                    venue?: string | null;
                    city?: string | null;
                    is_public?: boolean;
                    status?: 'scheduled' | 'completed' | 'cancelled';
                    created_at?: string;
                    updated_at?: string;
                };
            };
            booking_requests: {
                Row: {
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
                };
                Insert: {
                    id?: string;
                    name: string;
                    email: string;
                    phone?: string | null;
                    event_date?: string | null;
                    venue?: string | null;
                    attendees?: number | null;
                    budget_range?: string | null;
                    message?: string | null;
                    status?: 'new' | 'approved' | 'declined';
                    internal_notes?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    name?: string;
                    email?: string;
                    phone?: string | null;
                    event_date?: string | null;
                    venue?: string | null;
                    attendees?: number | null;
                    budget_range?: string | null;
                    message?: string | null;
                    status?: 'new' | 'approved' | 'declined';
                    internal_notes?: string | null;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            song_requests: {
                Row: {
                    id: string;
                    event_id: string | null;
                    requester_name: string | null;
                    artist: string;
                    track: string;
                    dedication: string | null;
                    approved: boolean;
                    created_at: string;
                    updated_at: string;
                };
                Insert: {
                    id?: string;
                    event_id?: string | null;
                    requester_name?: string | null;
                    artist: string;
                    track: string;
                    dedication?: string | null;
                    approved?: boolean;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    event_id?: string | null;
                    requester_name?: string | null;
                    artist?: string;
                    track?: string;
                    dedication?: string | null;
                    approved?: boolean;
                    created_at?: string;
                    updated_at?: string;
                };
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            [_ in never]: never;
        };
    };
}