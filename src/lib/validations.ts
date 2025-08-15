import { z } from 'zod';

// Booking request validation schema
export const bookingRequestSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
    email: z.string().email('Please enter a valid email address'),
    phone: z.string().optional().refine((val) => {
        if (!val) return true;
        // Basic phone validation - allows various formats
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(val.replace(/[\s\-\(\)]/g, ''));
    }, 'Please enter a valid phone number'),
    event_date: z.string().optional().refine((val) => {
        if (!val) return true;
        const date = new Date(val);
        return date > new Date();
    }, 'Event date must be in the future'),
    venue: z.string().optional().refine((val) => {
        if (!val) return true;
        return val.length <= 200;
    }, 'Venue name must be less than 200 characters'),
    attendees: z.number().optional().refine((val) => {
        if (val === undefined) return true;
        return val > 0 && val <= 100000;
    }, 'Number of attendees must be between 1 and 100,000'),
    budget_range: z.string().optional(),
    message: z.string().optional().refine((val) => {
        if (!val) return true;
        return val.length <= 2000;
    }, 'Message must be less than 2000 characters'),
});

// Song request validation schema
export const songRequestSchema = z.object({
    requester_name: z.string().optional().refine((val) => {
        if (!val) return true;
        return val.length <= 100;
    }, 'Name must be less than 100 characters'),
    artist: z.string().min(1, 'Artist name is required').max(200, 'Artist name must be less than 200 characters'),
    track: z.string().min(1, 'Track name is required').max(200, 'Track name must be less than 200 characters'),
    dedication: z.string().optional().refine((val) => {
        if (!val) return true;
        return val.length <= 500;
    }, 'Dedication must be less than 500 characters'),
    event_id: z.string().uuid().optional(),
});

// Settings validation schema
export const settingsSchema = z.object({
    site_title: z.string().optional().refine((val) => {
        if (!val) return true;
        return val.length <= 100;
    }, 'Site title must be less than 100 characters'),
    hero_heading: z.string().optional().refine((val) => {
        if (!val) return true;
        return val.length <= 200;
    }, 'Hero heading must be less than 200 characters'),
    hero_sub: z.string().optional().refine((val) => {
        if (!val) return true;
        return val.length <= 500;
    }, 'Hero subtitle must be less than 500 characters'),
    logo_url: z.string().url().optional().or(z.literal('')),
    theme: z.enum(['dark', 'light']),
    socials: z.record(z.string(), z.string().url()),
    rider_file_url: z.string().url().optional().or(z.literal('')),
    bio: z.string().optional().refine((val) => {
        if (!val) return true;
        return val.length <= 5000;
    }, 'Bio must be less than 5000 characters'),
});

// Mix validation schema
export const mixSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
    platform: z.enum(['soundcloud', 'mixcloud', 'youtube']),
    url: z.string().url('Please enter a valid URL'),
    featured: z.boolean().default(false),
    display_order: z.number().int().min(0).default(0),
});

// Event validation schema
export const eventSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
    start_at: z.string().datetime('Please enter a valid date and time'),
    end_at: z.string().datetime('Please enter a valid date and time').optional(),
    venue: z.string().optional().refine((val) => {
        if (!val) return true;
        return val.length <= 200;
    }, 'Venue name must be less than 200 characters'),
    city: z.string().optional().refine((val) => {
        if (!val) return true;
        return val.length <= 100;
    }, 'City name must be less than 100 characters'),
    is_public: z.boolean().default(true),
    status: z.enum(['scheduled', 'completed', 'cancelled']).default('scheduled'),
}).refine((data) => {
    if (data.end_at && data.start_at) {
        return new Date(data.end_at) > new Date(data.start_at);
    }
    return true;
}, {
    message: 'End time must be after start time',
    path: ['end_at'],
});

// Media photo validation schema
export const mediaPhotoSchema = z.object({
    url: z.string().url('Please enter a valid URL'),
    alt_text: z.string().optional().refine((val) => {
        if (!val) return true;
        return val.length <= 200;
    }, 'Alt text must be less than 200 characters'),
    is_press: z.boolean().default(false),
    display_order: z.number().int().min(0).default(0),
});

// Type exports for form data
export type BookingRequestFormData = z.infer<typeof bookingRequestSchema>;
export type SongRequestFormData = z.infer<typeof songRequestSchema>;
export type SettingsFormData = z.infer<typeof settingsSchema>;
export type MixFormData = z.infer<typeof mixSchema>;
export type EventFormData = z.infer<typeof eventSchema>;
export type MediaPhotoFormData = z.infer<typeof mediaPhotoSchema>;