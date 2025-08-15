'use client'

import React from 'react'
import { Footer } from './footer'
import { useSettings } from '@/hooks/use-settings'

export function SettingsFooter() {
    const { settings } = useSettings()

    return (
        <Footer
            socials={settings?.socials || {}}
            contactEmail={settings?.socials?.email}
            contactPhone={settings?.socials?.phone}
        />
    )
}