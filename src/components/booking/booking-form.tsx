'use client'

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { z } from 'zod'
import { bookingRequestSchema } from '@/lib/validations'

type BookingFormProps = {
	turnstileSiteKey?: string
}

type FormState = z.infer<typeof bookingRequestSchema> & {
	turnstileToken?: string
}

const BUDGET_OPTIONS = [
	'Under $500',
	'$500 - $1,000',
	'$1,000 - $2,500',
	'$2,500 - $5,000',
	'$5,000+',
]

export function BookingForm({ turnstileSiteKey }: BookingFormProps) {
	const [formState, setFormState] = useState<FormState>({
		name: '',
		email: '',
		phone: '',
		event_date: '',
		venue: '',
		budget_range: '',
		message: '',
	})
	const [submitting, setSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)
	const [success, setSuccess] = useState(false)

	// Register global callbacks for Turnstile auto-render
	useEffect(() => {
		if (!turnstileSiteKey) return
		;(window as any).onTurnstileSuccessBooking = (token: string) => {
			setFormState((prev) => ({ ...prev, turnstileToken: token }))
		}
		;(window as any).onTurnstileExpiredBooking = () => {
			setFormState((prev) => {
				const rest: any = { ...prev }
				delete rest.turnstileToken
				return rest
			})
		}
		return () => {
			delete (window as any).onTurnstileSuccessBooking
			delete (window as any).onTurnstileExpiredBooking
		}
	}, [turnstileSiteKey])

	const onInputChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
			const { name, value } = event.target
			if (name === 'attendees') {
				setFormState((prev) => {
					if (!value) {
						const rest: any = { ...prev }
						delete rest.attendees
						return rest
					}
					return { ...prev, attendees: Number(value) }
				})
				return
			}
			setFormState((prev) => ({ ...prev, [name]: value }))
		},
		[]
	)

	const validate = useCallback(() => {
		const result = bookingRequestSchema.safeParse({
			name: formState.name,
			email: formState.email,
			phone: formState.phone || undefined,
			event_date: formState.event_date || undefined,
			venue: formState.venue || undefined,
			attendees: typeof formState.attendees === 'number' ? formState.attendees : undefined,
			budget_range: formState.budget_range || undefined,
			message: formState.message || undefined,
		})

		if (!result.success) {
			const first = result.error.issues[0]
			throw new Error(first?.message || 'Please check the form inputs')
		}
		return result.data
	}, [formState])

	const canSubmit = useMemo(() => {
		return !!formState.name && !!formState.email
	}, [formState.name, formState.email])

	const onSubmit = useCallback(
		async (e: React.FormEvent<HTMLFormElement>) => {
			e.preventDefault()
			setError(null)
			setSuccess(false)

			try {
				const data = validate()

				if (turnstileSiteKey && !formState.turnstileToken) {
					throw new Error('Please complete the spam check')
				}

				setSubmitting(true)
				const response = await fetch('/api/booking', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ ...data, turnstileToken: formState.turnstileToken }),
				})
				if (!response.ok) {
					const payload = await response.json().catch(() => null)
					throw new Error(payload?.error || 'Submission failed')
				}
				setSuccess(true)
				setFormState({
					name: '',
					email: '',
					phone: '',
					event_date: '',
					venue: '',
					budget_range: '',
					message: '',
				} as FormState)
			} catch (err: any) {
				setError(err?.message || 'Something went wrong')
			} finally {
				setSubmitting(false)
			}
		},
		[formState.turnstileToken, turnstileSiteKey, validate]
	)

	return (
		<form onSubmit={onSubmit} className="space-y-6">
			{success ? (
				<div className="rounded-md bg-green-50 p-4 text-sm text-green-700">
					Thanks! Your booking request was sent.
				</div>
			) : null}
			{error ? (
				<div className="rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>
			) : null}

			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
				<div className="sm:col-span-1">
					<label htmlFor="name" className="block text-sm font-medium">Name*</label>
					<input
						id="name"
						name="name"
						type="text"
						required
						value={formState.name}
						onChange={onInputChange}
						className="mt-1 block w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
					/>
				</div>

				<div className="sm:col-span-1">
					<label htmlFor="email" className="block text-sm font-medium">Email*</label>
					<input
						id="email"
						name="email"
						type="email"
						required
						value={formState.email}
						onChange={onInputChange}
						className="mt-1 block w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
				<div className="sm:col-span-1">
					<label htmlFor="phone" className="block text-sm font-medium">Phone</label>
					<input
						id="phone"
						name="phone"
						type="tel"
						value={formState.phone || ''}
						onChange={onInputChange}
						className="mt-1 block w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
					/>
				</div>

				<div className="sm:col-span-1">
					<label htmlFor="event_date" className="block text-sm font-medium">Event date</label>
					<input
						id="event_date"
						name="event_date"
						type="date"
						value={formState.event_date || ''}
						onChange={onInputChange}
						className="mt-1 block w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
				<div className="sm:col-span-1">
					<label htmlFor="venue" className="block text-sm font-medium">Venue</label>
					<input
						id="venue"
						name="venue"
						type="text"
						value={formState.venue || ''}
						onChange={onInputChange}
						className="mt-1 block w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
					/>
				</div>

				<div className="sm:col-span-1">
					<label htmlFor="attendees" className="block text-sm font-medium">Estimated attendees</label>
					<input
						id="attendees"
						name="attendees"
						type="number"
						min={1}
						max={100000}
						value={formState.attendees ?? ''}
						onChange={onInputChange}
						className="mt-1 block w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
				<div className="sm:col-span-1">
					<label htmlFor="budget_range" className="block text-sm font-medium">Budget</label>
					<select
						id="budget_range"
						name="budget_range"
						value={formState.budget_range || ''}
						onChange={onInputChange}
						className="mt-1 block w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
					>
						<option value="">Select a range</option>
						{BUDGET_OPTIONS.map((opt) => (
							<option key={opt} value={opt}>
								{opt}
							</option>
						))}
					</select>
				</div>
			</div>

			<div>
				<label htmlFor="message" className="block text-sm font-medium">Message</label>
				<textarea
					id="message"
					name="message"
					rows={5}
					value={formState.message || ''}
					onChange={onInputChange}
					className="mt-1 block w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary"
				/>
			</div>

			{/* Turnstile widget - renders only if site key provided */}
			{turnstileSiteKey ? (
				<div className="pt-2">
					<div
						className="cf-turnstile"
						data-sitekey={turnstileSiteKey}
						data-callback="onTurnstileSuccessBooking"
						data-expired-callback="onTurnstileExpiredBooking"
					/>
				</div>
			) : null}

			<div className="pt-2">
				<button
					type="submit"
					disabled={!canSubmit || submitting}
					className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:opacity-90 disabled:opacity-50"
				>
					{submitting ? 'Sending…' : 'Send request'}
				</button>
			</div>
		</form>
	)
}


