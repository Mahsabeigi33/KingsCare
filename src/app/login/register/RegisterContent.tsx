'use client'

import { type ChangeEvent, type FormEvent, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Image from 'next/image'
const apiUrl=process.env.ADMIN_API_BASE_URL ?? 'http://localhost:3000';
export function RegisterContent() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [formState, setFormState] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  const onFieldChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setFormState((prev) => ({ ...prev, [name]: value }))
    setFieldErrors((prev) => {
      if (!prev[name]) return prev
      const next = { ...prev }
      delete next[name]
      return next
    })
  }

  const handleGoogle = async () => {
    await signIn('google', {
      callbackUrl: process.env.NEXT_PUBLIC_POST_LOGIN_REDIRECT ?? '/',
    })
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setFieldErrors({})

    const nextErrors: Record<string, string> = {}
    if (!formState.firstName.trim()) nextErrors.firstName = 'First name is required'
    if (!formState.lastName.trim()) nextErrors.lastName = 'Last name is required'
    if (!formState.email.trim()) {
      nextErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      nextErrors.email = 'Enter a valid email'
    }
    if (formState.password.length < 8) {
      nextErrors.password = 'Password must be at least 8 characters'
    }
    if (formState.password !== formState.confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match'
    }

    if (Object.keys(nextErrors).length) {
      setFieldErrors(nextErrors)
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`${apiUrl}/api/patient-auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: formState.firstName.trim(),
          lastName: formState.lastName.trim(),
          email: formState.email.trim(),
          phone: formState.phone.trim() || undefined,
          password: formState.password,
          confirmPassword: formState.confirmPassword,
        }),
      })

      const payload = await response.json().catch(() => null)

      if (!response.ok) {
        if (response.status === 409) {
          setFieldErrors({ email: 'Email already in use.' })
        } else if (payload?.details?.fieldErrors) {
          const mapped: Record<string, string> = {}
          Object.entries(payload.details.fieldErrors as Record<string, string[]>).forEach(
            ([field, messages]) => {
              if (messages?.length) {
                mapped[field] = messages[0] as string
              }
            },
          )
          setFieldErrors(mapped)
        } else {
          const apiError =
            typeof payload?.error === 'string'
              ? payload.error
              : 'Unable to register patient account right now.'
          setError(apiError)
        }
        setIsSubmitting(false)
        return
      }

      router.push('/login?registered=1')
    } catch (err) {
      console.error('Patient registration failed', err)
      setError('Unexpected error occurred. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <section
      className="w-full min-h-screen text-gray-900 flex items-center justify-center bg-center bg-cover bg-no-repeat"
      style={{ backgroundImage: 'url("/website/login.png")' }}
    >
      <div
        className="lg:w-1/2 w-full flex items-center justify-center text-center md:px-16 relative"
        style={{ backgroundColor: 'rgb(3 7 18 / 50%)' }}
      >
        <div className="relative z-30 w-full py-8 px-6">
          <h1 className="text-3xl font-semibold text-white mb-4">Create Your Account</h1>
          <p className="text-gray-200 mb-8">
            Register with your Google account or create an email &amp; password to book and manage appointments.
          </p>

          <div className="max-w-md mx-auto space-y-6">
            <button
              onClick={handleGoogle}
              className="w-full px-4 py-3 border flex justify-center gap-2 border-slate-200 rounded-lg text-white hover:border-slate-400 hover:text-amber-400 hover:shadow transition duration-150"
            >
              <Image
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="google logo"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              <span>Continue with Google</span>
            </button>

            <div className="flex items-center gap-4 text-gray-300">
              <span className="h-px flex-1 bg-gray-500/50" />
              <span className="text-sm uppercase tracking-wide">Or use your email</span>
              <span className="h-px flex-1 bg-gray-500/50" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-200 mb-1">
                    First name
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    value={formState.firstName}
                    onChange={onFieldChange}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 bg-white/90 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {fieldErrors.firstName ? (
                    <p className="mt-1 text-sm text-red-300">{fieldErrors.firstName}</p>
                  ) : null}
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-200 mb-1">
                    Last name
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    value={formState.lastName}
                    onChange={onFieldChange}
                    className="w-full rounded-md border border-slate-300 px-3 py-2 bg-white/90 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {fieldErrors.lastName ? (
                    <p className="mt-1 text-sm text-red-300">{fieldErrors.lastName}</p>
                  ) : null}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formState.email}
                  onChange={onFieldChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 bg-white/90 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {fieldErrors.email ? <p className="mt-1 text-sm text-red-300">{fieldErrors.email}</p> : null}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-200 mb-1">
                  Phone (optional)
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formState.phone}
                  onChange={onFieldChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 bg-white/90 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {fieldErrors.phone ? <p className="mt-1 text-sm text-red-300">{fieldErrors.phone}</p> : null}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formState.password}
                  onChange={onFieldChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 bg-white/90 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {fieldErrors.password ? <p className="mt-1 text-sm text-red-300">{fieldErrors.password}</p> : null}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-200 mb-1">
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formState.confirmPassword}
                  onChange={onFieldChange}
                  className="w-full rounded-md border border-slate-300 px-3 py-2 bg-white/90 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {fieldErrors.confirmPassword ? (
                  <p className="mt-1 text-sm text-red-300">{fieldErrors.confirmPassword}</p>
                ) : null}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-3 border flex justify-center gap-2 border-slate-200 rounded-lg text-white hover:border-slate-400 hover:text-amber-400 hover:shadow transition duration-150 disabled:opacity-70"
              >
                <span>{isSubmitting ? 'Creating account…' : 'Create account'}</span>
              </button>
            </form>

            {error ? <p className="text-red-300 text-sm">{error}</p> : null}
          </div>

          <p className="mt-8 text-gray-300">
            Already have an account?{' '}
              <Link href="/login" className="text-blue-400 hover:text-amber-400">
                Go to login
              </Link>
          </p>
        </div>
      </div>
    </section>
  )
}
