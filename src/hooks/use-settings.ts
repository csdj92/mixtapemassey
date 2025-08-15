'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Database } from '@/types/database'

type Settings = Database['public']['Tables']['settings']['Row']

export function useSettings() {
    const [settings, setSettings] = useState<Settings | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchSettings = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const { data, error } = await supabase
                .from('settings')
                .select('*')
                .single()

            if (error) {
                console.error('Error fetching settings:', error)
                setError(error.message)
            } else {
                setSettings(data)
            }
        } catch (err) {
            console.error('Error fetching settings:', err)
            setError('Failed to fetch settings')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchSettings()
    }, [fetchSettings])

    return { settings, loading, error, refetch: fetchSettings }
}