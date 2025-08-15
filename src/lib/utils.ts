// Date formatting utilities
export const formatDate = (dateString: string, options?: Intl.DateTimeFormatOptions): string => {
    const date = new Date(dateString);
    const defaultOptions: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    return date.toLocaleDateString('en-US', options || defaultOptions);
};

export const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
};

export const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
    });
};

export const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = date.getTime() - now.getTime();
    const diffInDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Tomorrow';
    if (diffInDays === -1) return 'Yesterday';
    if (diffInDays > 1 && diffInDays <= 7) return `In ${diffInDays} days`;
    if (diffInDays < -1 && diffInDays >= -7) return `${Math.abs(diffInDays)} days ago`;

    return formatDate(dateString);
};

export const isUpcoming = (dateString: string): boolean => {
    return new Date(dateString) > new Date();
};

export const isPast = (dateString: string): boolean => {
    return new Date(dateString) < new Date();
};

// URL validation and processing utilities
export const isValidUrl = (url: string): boolean => {
    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

export const extractPlatformFromUrl = (url: string): 'soundcloud' | 'mixcloud' | 'youtube' | null => {
    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname.toLowerCase();

        if (hostname.includes('soundcloud.com')) return 'soundcloud';
        if (hostname.includes('mixcloud.com')) return 'mixcloud';
        if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) return 'youtube';

        return null;
    } catch {
        return null;
    }
};

export const getEmbedUrl = (url: string, platform: 'soundcloud' | 'mixcloud' | 'youtube'): string => {
    try {
        const urlObj = new URL(url);

        switch (platform) {
            case 'soundcloud':
                // SoundCloud embed format: https://w.soundcloud.com/player/?url=TRACK_URL
                return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}`;

            case 'mixcloud':
                // Mixcloud embed format: https://www.mixcloud.com/widget/iframe/?hide_cover=1&feed=FEED_PATH
                const mixcloudPath = urlObj.pathname;
                return `https://www.mixcloud.com/widget/iframe/?hide_cover=1&feed=${encodeURIComponent(mixcloudPath)}`;

            case 'youtube':
                // YouTube embed format: https://www.youtube.com/embed/VIDEO_ID
                let videoId = '';
                if (urlObj.hostname.includes('youtu.be')) {
                    videoId = urlObj.pathname.slice(1);
                } else if (urlObj.hostname.includes('youtube.com')) {
                    videoId = urlObj.searchParams.get('v') || '';
                }
                return `https://www.youtube.com/embed/${videoId}`;

            default:
                return url;
        }
    } catch {
        return url;
    }
};

export const sanitizeUrl = (url: string): string => {
    // Remove any potentially dangerous protocols
    const allowedProtocols = ['http:', 'https:'];
    try {
        const urlObj = new URL(url);
        if (!allowedProtocols.includes(urlObj.protocol)) {
            return '';
        }
        return url;
    } catch {
        return '';
    }
};

// Text processing utilities
export const truncateText = (text: string, maxLength: number, suffix: string = '...'): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - suffix.length) + suffix;
};

export const capitalizeWords = (text: string): string => {
    return text.replace(/\b\w/g, (char) => char.toUpperCase());
};

export const slugify = (text: string): string => {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '') // Remove special characters
        .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

export const stripHtml = (html: string): string => {
    return html.replace(/<[^>]*>/g, '');
};

export const extractFirstSentence = (text: string): string => {
    const match = text.match(/^[^.!?]*[.!?]/);
    return match ? match[0].trim() : text;
};

export const wordCount = (text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

export const readingTime = (text: string, wordsPerMinute: number = 200): number => {
    const words = wordCount(text);
    return Math.ceil(words / wordsPerMinute);
};

// Form and validation utilities
export const sanitizeInput = (input: string): string => {
    return input
        .trim()
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .replace(/\s+/g, ' '); // Normalize whitespace
};

export const formatPhoneNumber = (phone: string): string => {
    // Remove all non-digit characters
    const digits = phone.replace(/\D/g, '');

    // Format US phone numbers
    if (digits.length === 10) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }

    // Return original if not a standard format
    return phone;
};

export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Array and object utilities
export const groupBy = <T, K extends keyof any>(
    array: T[],
    key: (item: T) => K
): Record<K, T[]> => {
    return array.reduce((groups, item) => {
        const groupKey = key(item);
        if (!groups[groupKey]) {
            groups[groupKey] = [];
        }
        groups[groupKey].push(item);
        return groups;
    }, {} as Record<K, T[]>);
};

export const sortBy = <T>(
    array: T[],
    key: keyof T,
    direction: 'asc' | 'desc' = 'asc'
): T[] => {
    return [...array].sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];

        if (aVal < bVal) return direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return direction === 'asc' ? 1 : -1;
        return 0;
    });
};

export const uniqueBy = <T, K>(array: T[], key: (item: T) => K): T[] => {
    const seen = new Set<K>();
    return array.filter(item => {
        const keyValue = key(item);
        if (seen.has(keyValue)) {
            return false;
        }
        seen.add(keyValue);
        return true;
    });
};

// Error handling utilities
export const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'An unexpected error occurred';
};

export const isSupabaseError = (error: unknown): boolean => {
    return typeof error === 'object' && error !== null && 'code' in error;
};

// Constants for validation
export const VALIDATION_LIMITS = {
    NAME_MAX_LENGTH: 100,
    EMAIL_MAX_LENGTH: 254,
    PHONE_MAX_LENGTH: 20,
    VENUE_MAX_LENGTH: 200,
    CITY_MAX_LENGTH: 100,
    MESSAGE_MAX_LENGTH: 2000,
    BIO_MAX_LENGTH: 5000,
    TITLE_MAX_LENGTH: 200,
    DEDICATION_MAX_LENGTH: 500,
    ALT_TEXT_MAX_LENGTH: 200,
    MAX_ATTENDEES: 100000,
} as const;