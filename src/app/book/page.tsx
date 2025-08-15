import Script from 'next/script'
import React from 'react'
import { BookingForm } from '@/components/booking/booking-form'
import { MainLayout } from '@/components/layout'

export default function BookPage() {
	const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ''

	return (
		<MainLayout>
			<div className="mx-auto max-w-3xl px-4 py-10 lg:py-16">
				<h1 className="text-3xl font-bold tracking-tight mb-6">Book MixtapeMassey</h1>
				<p className="text-muted-foreground mb-10">
					Tell me about your event and I’ll get back to you shortly.
				</p>
				{/* Cloudflare Turnstile script for spam protection */}
				{turnstileSiteKey ? (
					<Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
				) : null}
				<BookingForm turnstileSiteKey={turnstileSiteKey} />
			</div>
		</MainLayout>
	)
}


