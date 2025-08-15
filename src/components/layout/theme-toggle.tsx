'use client'

import React, { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/contexts/theme-context'

export function ThemeToggle() {
    const [mounted, setMounted] = useState(false)
    const { theme, toggleTheme } = useTheme()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <button className="rounded-md p-2 text-foreground hover:text-primary transition-colors">
                <div className="h-5 w-5" />
            </button>
        )
    }

    const handleToggle = () => {
        console.log('Current theme:', theme)
        toggleTheme()
        console.log('Toggling theme...')
    }

    return (
        <button
            onClick={handleToggle}
            className="rounded-md p-2 text-foreground hover:text-primary transition-colors"
            aria-label="Toggle theme"
        >
            {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
            ) : (
                <Moon className="h-5 w-5" />
            )}
        </button>
    )
}

export function MobileThemeToggle() {
    const [mounted, setMounted] = useState(false)
    const { theme, toggleTheme } = useTheme()

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return (
            <button className="-mx-3 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-muted">
                <div className="h-5 w-5" />
                Theme
            </button>
        )
    }

    return (
        <button
            onClick={toggleTheme}
            className="-mx-3 flex w-full items-center gap-3 rounded-lg px-3 py-2 text-base font-semibold leading-7 text-foreground hover:bg-muted"
        >
            {theme === 'dark' ? (
                <>
                    <Sun className="h-5 w-5" />
                    Light mode
                </>
            ) : (
                <>
                    <Moon className="h-5 w-5" />
                    Dark mode
                </>
            )}
        </button>
    )
}