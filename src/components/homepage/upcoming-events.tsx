'use client';

import { useState, useEffect } from 'react';
import { getUpcomingEvents } from '@/lib/database';
import type { Event } from '@/types';

interface UpcomingEventsProps {
    events?: Event[] | undefined;
    limit?: number;
}

export function UpcomingEvents({ events, limit = 3 }: UpcomingEventsProps) {
    const [isLoading, setIsLoading] = useState(!events);
    const [upcomingEvents, setUpcomingEvents] = useState<Event[]>(events || []);

    useEffect(() => {
        if (!events) {
            const fetchEvents = async () => {
                try {
                    const data = await getUpcomingEvents(limit);
                    setUpcomingEvents(data);
                } catch (error) {
                    console.error('Failed to fetch upcoming events:', error);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchEvents();
        }
    }, [events, limit]);

    const formatEventDate = (dateString: string) => {
        const date = new Date(dateString);
        return {
            day: date.getDate(),
            month: date.toLocaleDateString('en-US', { month: 'short' }),
            weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
            time: date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true
            })
        };
    };

    if (isLoading) {
        return (
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <div className="h-8 bg-muted rounded w-64 mx-auto mb-4"></div>
                        <div className="h-4 bg-muted rounded w-96 mx-auto"></div>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="bg-card rounded-lg p-6 shadow-md animate-pulse">
                                <div className="h-6 bg-muted rounded mb-4"></div>
                                <div className="h-4 bg-muted rounded mb-2"></div>
                                <div className="h-4 bg-muted rounded w-3/4"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    if (upcomingEvents.length === 0) {
        return (
            <section className="py-16 bg-muted/30">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Upcoming Events</h2>
                    <p className="text-muted-foreground text-lg mb-8">
                        No upcoming events scheduled at the moment.
                    </p>
                    <p className="text-muted-foreground">
                        Check back soon for new show announcements!
                    </p>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Upcoming Events</h2>
                    <p className="text-muted-foreground text-lg">
                        Don&apos;t miss these upcoming performances
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {upcomingEvents.map((event) => {
                        const eventDate = formatEventDate(event.start_at);

                        return (
                            <div
                                key={event.id}
                                className="bg-card rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow duration-200 border border-border"
                            >
                                {/* Date Badge */}
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="bg-primary text-primary-foreground rounded-lg p-3 text-center min-w-[60px]">
                                        <div className="text-xs font-medium uppercase">
                                            {eventDate.month}
                                        </div>
                                        <div className="text-xl font-bold">
                                            {eventDate.day}
                                        </div>
                                        <div className="text-xs">
                                            {eventDate.weekday}
                                        </div>
                                    </div>

                                    <div className="flex-1">
                                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                                            {event.title}
                                        </h3>

                                        {event.venue && (
                                            <p className="text-muted-foreground text-sm mb-1 flex items-center gap-1">
                                                <span>📍</span>
                                                {event.venue}
                                                {event.city && `, ${event.city}`}
                                            </p>
                                        )}

                                        <p className="text-muted-foreground text-sm flex items-center gap-1">
                                            <span>🕒</span>
                                            {eventDate.time}
                                        </p>
                                    </div>
                                </div>

                                {/* Event Status */}
                                <div className="flex justify-between items-center">
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${event.status === 'scheduled'
                                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                        : event.status === 'completed'
                                            ? 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                        }`}>
                                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* View All Events Link */}
                <div className="text-center mt-12">
                    <a
                        href="/events"
                        className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors duration-200"
                    >
                        View All Events
                        <span>→</span>
                    </a>
                </div>
            </div>
        </section>
    );
}