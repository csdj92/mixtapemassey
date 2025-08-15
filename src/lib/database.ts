import { supabase, withErrorHandling } from './supabase';
import {
    bookingRequestSchema,
    songRequestSchema,
    settingsSchema,
    mixSchema,
    eventSchema
} from './validations';
import type {
    Settings,
    Mix,
    MediaPhoto,
    Event,
    BookingRequest,
    SongRequest,
    BookingFormData,
    SongRequestFormData
} from '@/types';

// Settings operations
export const getSettings = async (): Promise<Settings> => {
    return withErrorHandling(async () =>
        supabase.from('settings').select('*').single()
    );
};

export const updateSettings = async (settings: Partial<Settings>): Promise<Settings> => {
    // Validate settings data
    const validatedSettings = settingsSchema.partial().parse(settings);

    return withErrorHandling(async () =>
        supabase
            .from('settings')
            .update({ ...validatedSettings, updated_at: new Date().toISOString() })
            .select()
            .single()
    );
};

// Mix operations
export const getFeaturedMixes = async () => {
    const { data, error } = await supabase
        .from('mixes')
        .select('*')
        .eq('featured', true)
        .order('display_order', { ascending: true });

    if (error) throw error;
    return data as Mix[];
};

export const getAllMixes = async () => {
    const { data, error } = await supabase
        .from('mixes')
        .select('*')
        .order('display_order', { ascending: true });

    if (error) throw error;
    return data as Mix[];
};

export const createMix = async (mix: Omit<Mix, 'id' | 'created_at' | 'updated_at'>): Promise<Mix> => {
    // Validate mix data
    const validatedMix = mixSchema.parse(mix);

    return withErrorHandling(async () =>
        supabase
            .from('mixes')
            .insert(validatedMix)
            .select()
            .single()
    );
};

export const updateMix = async (id: string, mix: Partial<Mix>) => {
    const { data, error } = await supabase
        .from('mixes')
        .update(mix)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data as Mix;
};

export const deleteMix = async (id: string) => {
    const { error } = await supabase
        .from('mixes')
        .delete()
        .eq('id', id);

    if (error) throw error;
};

// Media photo operations
export const getMediaPhotos = async () => {
    const { data, error } = await supabase
        .from('media_photos')
        .select('*')
        .order('display_order', { ascending: true });

    if (error) throw error;
    return data as MediaPhoto[];
};

export const getPressPhotos = async () => {
    const { data, error } = await supabase
        .from('media_photos')
        .select('*')
        .eq('is_press', true)
        .order('display_order', { ascending: true });

    if (error) throw error;
    return data as MediaPhoto[];
};

export const createMediaPhoto = async (
    photo: Omit<MediaPhoto, 'id' | 'created_at' | 'updated_at'>
): Promise<MediaPhoto> => {
    return withErrorHandling<MediaPhoto>(async () =>
        supabase
            .from('media_photos')
            .insert(photo as any)
            .select()
            .single()
    );
};

export const deleteMediaPhoto = async (id: string) => {
    const { error } = await supabase
        .from('media_photos')
        .delete()
        .eq('id', id);
    if (error) throw error;
};

export const updateMediaPhoto = async (id: string, updates: Partial<MediaPhoto>) => {
    const { data, error } = await supabase
        .from('media_photos')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
    if (error) throw error;
    return data as MediaPhoto;
};

// Event operations
export const getPublicEvents = async () => {
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_public', true)
        .gte('start_at', new Date().toISOString())
        .order('start_at', { ascending: true });

    if (error) throw error;
    return data as Event[];
};

export const getUpcomingEvents = async (limit: number = 3) => {
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('is_public', true)
        .gte('start_at', new Date().toISOString())
        .order('start_at', { ascending: true })
        .limit(limit);

    if (error) throw error;
    return data as Event[];
};

export const getAllEvents = async () => {
    const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_at', { ascending: false });

    if (error) throw error;
    return data as Event[];
};

export const createEvent = async (event: Omit<Event, 'id' | 'created_at' | 'updated_at'>): Promise<Event> => {
    // Validate event data
    const validatedEvent = eventSchema.parse(event);

    return withErrorHandling(async () =>
        supabase
            .from('events')
            .insert(validatedEvent)
            .select()
            .single()
    );
};

export const updateEvent = async (id: string, event: Partial<Event>) => {
    const { data, error } = await supabase
        .from('events')
        .update(event)
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data as Event;
};

export const deleteEvent = async (id: string) => {
    const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

    if (error) throw error;
};

// Booking request operations
export const createBookingRequest = async (request: BookingFormData): Promise<BookingRequest> => {
    // Validate booking request data
    const validatedRequest = bookingRequestSchema.parse(request);

    return withErrorHandling(async () =>
        supabase
            .from('booking_requests')
            .insert(validatedRequest)
            .select()
            .single()
    );
};

export const getBookingRequests = async () => {
    const { data, error } = await supabase
        .from('booking_requests')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data as BookingRequest[];
};

export const updateBookingRequestStatus = async (
    id: string,
    status: BookingRequest['status'],
    internal_notes?: string
) => {
    const { data, error } = await supabase
        .from('booking_requests')
        .update({ status, internal_notes })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data as BookingRequest;
};

// Song request operations
export const createSongRequest = async (request: SongRequestFormData): Promise<SongRequest> => {
    // Validate song request data
    const validatedRequest = songRequestSchema.parse(request);

    return withErrorHandling(async () =>
        supabase
            .from('song_requests')
            .insert(validatedRequest)
            .select()
            .single()
    );
};

export const getSongRequests = async () => {
    const { data, error } = await supabase
        .from('song_requests')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) throw error;
    return data as SongRequest[];
};

export const updateSongRequestApproval = async (id: string, approved: boolean) => {
    const { data, error } = await supabase
        .from('song_requests')
        .update({ approved })
        .eq('id', id)
        .select()
        .single();

    if (error) throw error;
    return data as SongRequest;
};

// Analytics and dashboard data
export const getDashboardStats = async () => {
    const [bookingRequests, songRequests, upcomingEvents] = await Promise.all([
        supabase.from('booking_requests').select('status').eq('status', 'new'),
        supabase.from('song_requests').select('approved').eq('approved', false),
        supabase.from('events').select('*').eq('is_public', true).gte('start_at', new Date().toISOString()).limit(5)
    ]);

    return {
        newBookingRequests: bookingRequests.data?.length || 0,
        pendingSongRequests: songRequests.data?.length || 0,
        upcomingEvents: upcomingEvents.data?.length || 0
    };
};

// Additional utility functions
export const searchEvents = async (query: string): Promise<Event[]> => {
    return withErrorHandling(async () =>
        supabase
            .from('events')
            .select('*')
            .or(`title.ilike.%${query}%,venue.ilike.%${query}%,city.ilike.%${query}%`)
            .order('start_at', { ascending: false })
    );
};

export const getEventsByDateRange = async (startDate: string, endDate: string): Promise<Event[]> => {
    return withErrorHandling(async () =>
        supabase
            .from('events')
            .select('*')
            .gte('start_at', startDate)
            .lte('start_at', endDate)
            .order('start_at', { ascending: true })
    );
};

export const getRequestsByStatus = async (status: BookingRequest['status']): Promise<BookingRequest[]> => {
    return withErrorHandling(async () =>
        supabase
            .from('booking_requests')
            .select('*')
            .eq('status', status)
            .order('created_at', { ascending: false })
    );
};

export const getSongRequestsByEvent = async (eventId: string): Promise<SongRequest[]> => {
    return withErrorHandling(async () =>
        supabase
            .from('song_requests')
            .select('*')
            .eq('event_id', eventId)
            .order('created_at', { ascending: false })
    );
};

export const bulkUpdateMixOrder = async (mixUpdates: Array<{ id: string; display_order: number }>): Promise<void> => {
    const updates = mixUpdates.map(({ id, display_order }) =>
        supabase
            .from('mixes')
            .update({ display_order })
            .eq('id', id)
    );

    await Promise.all(updates);
};

export const getRecentActivity = async (limit: number = 10) => {
    const [recentBookings, recentSongs] = await Promise.all([
        supabase
            .from('booking_requests')
            .select('id, name, created_at, status')
            .order('created_at', { ascending: false })
            .limit(limit),
        supabase
            .from('song_requests')
            .select('id, artist, track, created_at, approved')
            .order('created_at', { ascending: false })
            .limit(limit)
    ]);

    const activities = [
        ...(recentBookings.data || []).map(booking => ({
            id: booking.id,
            type: 'booking' as const,
            description: `New booking request from ${booking.name}`,
            status: booking.status,
            created_at: booking.created_at
        })),
        ...(recentSongs.data || []).map(song => ({
            id: song.id,
            type: 'song' as const,
            description: `Song request: ${song.artist} - ${song.track}`,
            status: song.approved ? 'approved' : 'pending',
            created_at: song.created_at
        }))
    ];

    return activities
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, limit);
};