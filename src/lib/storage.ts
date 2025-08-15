import { supabase } from './supabase';

export type UploadResult = {
    filePath: string;
    publicUrl: string;
};

function sanitizeFileName(originalName: string): string {
    const dotIndex = originalName.lastIndexOf('.');
    const name = dotIndex !== -1 ? originalName.slice(0, dotIndex) : originalName;
    const ext = dotIndex !== -1 ? originalName.slice(dotIndex).toLowerCase() : '';
    const safeName = name
        .toLowerCase()
        .replace(/[^a-z0-9-_]+/g, '-')
        .replace(/-{2,}/g, '-')
        .replace(/^-+|-+$/g, '');
    return `${safeName}${ext}`;
}

async function uploadToBucket(bucket: string, file: File, directory: string): Promise<UploadResult> {
    const safeName = sanitizeFileName(file.name);
    const timestamp = Date.now();
    const filePath = `${directory}/${timestamp}-${safeName}`;

    const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, { upsert: false, cacheControl: '3600', contentType: file.type });

    if (uploadError) {
        throw uploadError;
    }

    const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
    return { filePath, publicUrl: data.publicUrl };
}

export async function uploadPressPhoto(file: File): Promise<UploadResult> {
    return uploadToBucket('media', file, 'press');
}

export async function uploadPerformancePhoto(file: File): Promise<UploadResult> {
    return uploadToBucket('media', file, 'performance');
}

export async function uploadLogo(file: File): Promise<UploadResult> {
    return uploadToBucket('assets', file, 'logos');
}

export async function uploadTechRider(file: File): Promise<UploadResult> {
    return uploadToBucket('assets', file, 'riders');
}


