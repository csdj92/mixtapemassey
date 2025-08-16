import { NextRequest, NextResponse } from 'next/server'
export const runtime = 'nodejs'
import { z } from 'zod'
import { bookingRequestSchema } from '@/lib/validations'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
import { sendBookingNotification } from '@/lib/email'

const TurnstileResponseSchema = z.object({
	success: z.boolean(),
	// other fields omitted
})

async function verifyTurnstile(token: string | undefined): Promise<boolean> {
	if (!token) return false
	const secret = process.env.TURNSTILE_SECRET_KEY
	if (!secret) return true // allow in dev if not configured

	try {
		const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams({ secret, response: token }).toString(),
		})
		const json = await res.json()
		const parsed = TurnstileResponseSchema.safeParse(json)
		if (!parsed.success) return false
		return parsed.data.success
	} catch {
		return false
	}
}

export async function POST(request: NextRequest) {
	try {
		const payload = await request.json()
		const { turnstileToken, ...raw } = payload || {}
		const parsed = bookingRequestSchema.parse(raw)

		const passed = await verifyTurnstile(turnstileToken)
		if (!passed) {
			return NextResponse.json({ error: 'Failed spam verification' }, { status: 400 })
		}

		const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
		const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
		const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
		const supabase = createClient<Database>(
			supabaseUrl,
			serviceKey || anonKey
		)

		const { error } = await supabase
			.from('booking_requests')
			.insert({
				name: parsed.name,
				email: parsed.email,
				phone: parsed.phone || null,
				event_date: parsed.event_date || null,
				venue: parsed.venue || null,
				attendees: parsed.attendees ?? null,
				budget_range: parsed.budget_range || null,
				message: parsed.message || null,
			})
			.select('id')
			.single()

		if (error) {
			console.error('Insert booking error:', error)
			const message = process.env.NODE_ENV === 'development' ? ((error as any)?.message || 'Insert failed') : 'Could not save booking request'
			return NextResponse.json({ error: message }, { status: 500 })
		}

		// Send notification email (if configured)
		const bookingForEmail = {
			name: parsed.name,
			email: parsed.email,
			...(parsed.phone ? { phone: parsed.phone } : {}),
			...(parsed.event_date ? { event_date: parsed.event_date } : {}),
			...(parsed.venue ? { venue: parsed.venue } : {}),
			...(typeof parsed.attendees === 'number' ? { attendees: parsed.attendees } : {}),
			...(parsed.budget_range ? { budget_range: parsed.budget_range } : {}),
			...(parsed.message ? { message: parsed.message } : {}),
		};
		await sendBookingNotification(bookingForEmail as any)

		return NextResponse.json({ ok: true })
	} catch (err: any) {
		if (err instanceof z.ZodError) {
			return NextResponse.json({ error: err.issues?.[0]?.message || 'Invalid input' }, { status: 400 })
		}
		return NextResponse.json({ error: 'Unexpected server error' }, { status: 500 })
	}
}


