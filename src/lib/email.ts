import { Resend } from 'resend'

type BookingPayload = {
	name: string
	email: string
	phone?: string
	event_date?: string
	venue?: string
	attendees?: number
	budget_range?: string
	message?: string
}

const getResend = () => {
	const apiKey = process.env.RESEND_API_KEY
	if (!apiKey) return null
	return new Resend(apiKey)
}

export async function sendBookingNotification(booking: BookingPayload): Promise<void> {
	const resend = getResend()
	const to = process.env.BOOKING_NOTIFY_EMAIL
	if (!resend || !to) return

	const from = process.env.BOOKING_FROM_EMAIL || 'Bookings <notifications@example.com>'

	const subject = `New booking request from ${booking.name}`
	const html = `
		<h2>New Booking Request</h2>
		<p><strong>Name:</strong> ${escapeHtml(booking.name)}</p>
		<p><strong>Email:</strong> ${escapeHtml(booking.email)}</p>
		${booking.phone ? `<p><strong>Phone:</strong> ${escapeHtml(booking.phone)}</p>` : ''}
		${booking.event_date ? `<p><strong>Event date:</strong> ${escapeHtml(booking.event_date)}</p>` : ''}
		${booking.venue ? `<p><strong>Venue:</strong> ${escapeHtml(booking.venue)}</p>` : ''}
		${typeof booking.attendees === 'number' ? `<p><strong>Attendees:</strong> ${booking.attendees}</p>` : ''}
		${booking.budget_range ? `<p><strong>Budget:</strong> ${escapeHtml(booking.budget_range)}</p>` : ''}
		${booking.message ? `<p><strong>Message:</strong><br/>${escapeHtml(booking.message).replace(/\n/g, '<br/>')}</p>` : ''}
	`

	try {
		await resend.emails.send({ from, to, subject, html })
	} catch (error) {
		console.error('Failed to send booking email:', error)
	}
}

function escapeHtml(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;')
}


