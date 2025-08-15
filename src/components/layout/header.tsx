'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { ThemeToggle, MobileThemeToggle } from './theme-toggle'
import { createPortal } from 'react-dom'

const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Media', href: '/media' },
    { name: 'Book', href: '/book' },
    { name: 'Request', href: '/request' },
]

export function Header() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted) return
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [mobileMenuOpen, mounted])

    return (
        <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:sticky lg:top-0 z-50 w-full border-b border-border/40">
            <nav className="mx-auto flex max-w-7xl items-center justify-between p-4 lg:px-8 lg:py-6" aria-label="Global">
                <div className="flex lg:flex-1">
                    <Link href="/" className="-m-1.5 p-1.5">
                        <span className="sr-only">MixtapeMassey</span>
                        <div className="h-8 w-auto text-2xl font-bold text-primary">
                            MixtapeMassey
                        </div>
                    </Link>
                </div>

                <div className="flex lg:hidden">
                    <button
                        type="button"
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-3 text-foreground"
                        onClick={() => setMobileMenuOpen(true)}
                    >
                        <span className="sr-only">Open main menu</span>
                        <Menu className="h-7 w-7" aria-hidden="true" />
                    </button>
                </div>

                <div className="hidden lg:flex lg:gap-x-12">
                    {navigation.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="text-sm font-semibold leading-6 text-foreground hover:text-primary transition-colors"
                            style={{ display: item.name === 'About' || item.name === 'Request' ? 'none' : undefined }}
                        >
                            {item.name}
                        </Link>
                    ))}
                </div>

                <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:items-center lg:gap-4">
                    <ThemeToggle />
                </div>
            </nav>

            {/* Mobile menu (portal to body to escape any stacking/containing contexts) */}
            {mounted && mobileMenuOpen && createPortal(
                <>
                    <div
                        className="fixed inset-0 z-[100] bg-black/50 lg:hidden"
                        onClick={() => setMobileMenuOpen(false)}
                    />
                    <div className="fixed inset-0 z-[110] w-full bg-background lg:hidden">
                        <div className="flex h-full flex-col overflow-y-auto px-6 py-6">
                            <div className="flex items-center justify-between">
                                <Link href="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
                                    <span className="sr-only">MixtapeMassey</span>
                                    <div className="h-8 w-auto text-2xl font-bold text-primary">
                                        MixtapeMassey
                                    </div>
                                </Link>
                                <button
                                    type="button"
                                    className="-m-2.5 rounded-md p-3 text-foreground"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <span className="sr-only">Close menu</span>
                                    <X className="h-7 w-7" aria-hidden="true" />
                                </button>
                            </div>

                            <div className="mt-6 flow-root">
                                <div className="-my-6 divide-y divide-border/10">
                                    <div className="space-y-2 py-6">
                                        {navigation.map((item) => (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className="-mx-3 block rounded-lg px-3 py-3 text-lg font-semibold leading-7 text-foreground hover:bg-muted"
                                                onClick={() => setMobileMenuOpen(false)}
                                                style={{ display: item.name === 'About' || item.name === 'Request' ? 'none' : undefined }}
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>

                                    <div className="py-6">
                                        <MobileThemeToggle />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>,
                document.body
            )}
        </header>
    )
}