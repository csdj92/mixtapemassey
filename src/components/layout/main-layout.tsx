'use client'

import React from 'react'
import { Header } from './header'
import { SettingsFooter } from './settings-footer'

interface MainLayoutProps {
    children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <Header />
            <main className="flex-1">
                {children}
            </main>
            <SettingsFooter />
        </div>
    )
}