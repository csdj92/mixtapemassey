'use client';

import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center p-8">
            <div className="max-w-md text-center">
                <h1 className="text-3xl font-bold mb-2">Page not found</h1>
                <p className="text-gray-600 mb-6">The page you are looking for does not exist.</p>
                <Link href="/" className="inline-block rounded-md border px-4 py-2 text-sm hover:bg-gray-50">Go home</Link>
            </div>
        </div>
    );
}


