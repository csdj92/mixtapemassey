import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase: SupabaseClient<Database> = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
    },
});

// Utility function to handle Supabase errors
export const handleSupabaseError = (error: any): never => {
    console.error('Supabase error:', error);

    if (error?.code === 'PGRST116') {
        throw new Error('No data found');
    }

    if (error?.code === '23505') {
        throw new Error('This record already exists');
    }

    if (error?.code === '23503') {
        throw new Error('Referenced record does not exist');
    }

    if (error?.code === 'PGRST301') {
        throw new Error('Unauthorized access');
    }

    throw new Error(error?.message || 'Database operation failed');
};

// Generic database operation wrapper with error handling
export const withErrorHandling = async <T>(
    operation: () => Promise<{ data: T | null; error: any }>
): Promise<T> => {
    const { data, error } = await operation();

    if (error) {
        handleSupabaseError(error);
    }

    if (data === null) {
        throw new Error('No data returned from operation');
    }

    return data;
};

// Batch operation utility
export const batchOperation = async <T>(
    operations: Array<() => Promise<{ data: T | null; error: any }>>,
    options: { failFast?: boolean } = {}
): Promise<(T | Error)[]> => {
    const results = await Promise.allSettled(
        operations.map(async (op) => {
            try {
                return await withErrorHandling(op);
            } catch (error) {
                if (options.failFast) {
                    throw error;
                }
                return error as Error;
            }
        })
    );

    return results.map(result =>
        result.status === 'fulfilled' ? result.value : result.reason
    );
};

// Connection health check
export const checkConnection = async (): Promise<boolean> => {
    try {
        const { error } = await supabase.from('settings').select('id').limit(1);
        return !error;
    } catch {
        return false;
    }
};
