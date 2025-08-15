'use client'

import React from 'react'
import Link from 'next/link'
import { Instagram, Twitter, Facebook, Youtube, Mail, Phone, Music } from 'lucide-react'

// Custom TikTok icon component
const TikTokIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
);

// Social media icon mapping
const socialIcons = {
    instagram: Instagram,
    twitter: Twitter,
    facebook: Facebook,
    youtube: Youtube,
    tiktok: TikTokIcon,
    soundcloud: Music,
    email: Mail,
    phone: Phone,
}

interface FooterProps {
    socials?: Record<string, string>
    contactEmail?: string | undefined
    contactPhone?: string | undefined
}

export function Footer({ socials = {}, contactEmail, contactPhone }: FooterProps) {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="bg-muted/50 border-t border-border/40">
            <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
                <div className="flex flex-col space-y-4 md:order-2">
                    {/* Social Media Links */}
                    {Object.keys(socials).length > 0 && (
                        <div className="flex justify-center space-x-6 md:justify-end">
                            {Object.entries(socials).map(([platform, url]) => {
                                const IconComponent = socialIcons[platform as keyof typeof socialIcons]
                                if (!IconComponent || !url) return null

                                return (
                                    <a
                                        key={platform}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-muted-foreground hover:text-primary transition-colors"
                                        aria-label={`Follow on ${platform}`}
                                    >
                                        <IconComponent className="h-6 w-6" />
                                    </a>
                                )
                            })}
                        </div>
                    )}

                    {/* Contact Information */}
                    <div className="flex flex-col space-y-2 text-center md:text-right">
                        {contactEmail && (
                            <a
                                href={`mailto:${contactEmail}`}
                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                {contactEmail}
                            </a>
                        )}
                        {contactPhone && (
                            <a
                                href={`tel:${contactPhone}`}
                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                {contactPhone}
                            </a>
                        )}
                    </div>
                </div>

                <div className="mt-8 md:order-1 md:mt-0">
                    <div className="flex flex-col space-y-4">
                        {/* Navigation Links */}
                        <div className="flex justify-center space-x-6 md:justify-start">
                            <Link
                                href="/about"
                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                About
                            </Link>
                            <Link
                                href="/media"
                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                Media
                            </Link>
                            <Link
                                href="/book"
                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                Book
                            </Link>
                            <Link
                                href="/request"
                                className="text-sm text-muted-foreground hover:text-primary transition-colors"
                            >
                                Request
                            </Link>
                        </div>

                        {/* Copyright */}
                        <p className="text-center text-xs text-muted-foreground md:text-left">
                            &copy; {currentYear} MixtapeMassey. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}