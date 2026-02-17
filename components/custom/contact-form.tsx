'use client'
'use no memo'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import {
  Mail,
  Phone,
  Loader2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import { submitEnquiry, type FormState } from '@/app/enquire/actions'
import confetti from 'canvas-confetti'
import { Button } from '../ui/button'

type FormData = {
  firstName: string
  lastName: string
  phone: string
  email: string
  message: string
  age?: number
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say' | ''
  contactMethod: ('whatsapp' | 'call' | 'mail')[]
}

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formState, setFormState] = useState<FormState | null>(null)
  const [showSuccessCard, setShowSuccessCard] = useState(false)
  const [countdown, setCountdown] = useState(60) // 60 seconds = 1 minute rate limit
  const [confettiCount, setConfettiCount] = useState(0)

  // Load persisted state from localStorage on mount
  useEffect(() => {
    const savedEndTime = localStorage.getItem('successCardEndTime')
    const savedConfettiCount = localStorage.getItem('confettiCount')

    if (savedConfettiCount) {
      setConfettiCount(parseInt(savedConfettiCount, 10))
    }

    if (savedEndTime) {
      const endTime = parseInt(savedEndTime, 10)
      const now = Date.now()
      const remaining = Math.ceil((endTime - now) / 1000)

      if (remaining > 0) {
        setShowSuccessCard(true)
        setCountdown(remaining)
      } else {
        // Clear expired state
        localStorage.removeItem('successCardEndTime')
        localStorage.removeItem('confettiCount')
      }
    }
  }, [])

  // Countdown timer effect
  useEffect(() => {
    if (!showSuccessCard) return

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          localStorage.removeItem('successCardEndTime')
          return 0 // Stop at 0 instead of resetting
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [showSuccessCard])

  // Reset form and clear success card
  const resetForm = () => {
    setShowSuccessCard(false)
    localStorage.removeItem('successCardEndTime')
    setCountdown(60)
  }

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      message: '',
      age: undefined,
      gender: '',
      contactMethod: [],
    },
  })

  const contactMethod = watch('contactMethod')
  const email = watch('email')
  const phone = watch('phone')

  // Determine if email is required
  const isEmailRequired = contactMethod?.includes('mail')
  // Determine if phone is required
  const isPhoneRequired =
    contactMethod?.includes('whatsapp') || contactMethod?.includes('call')

  // Check if form is valid for submission
  const isFormValid = () => {
    if (!contactMethod || contactMethod.length === 0) return false
    if (isEmailRequired && (!email || email.trim() === '')) return false
    if (isPhoneRequired && (!phone || phone.trim() === '')) return false
    return true
  }

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    setFormState(null)

    const result = await submitEnquiry(data)
    setFormState(result)
    setIsSubmitting(false)

    if (result.success) {
      // Trigger confetti animation
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0d9488', '#14b8a6', '#2dd4bf'], // Teal theme colors
      })
      reset()

      // Show success card and persist end time in localStorage
      const endTime = Date.now() + 60 * 1000 // 60 seconds from now
      localStorage.setItem('successCardEndTime', endTime.toString())
      setShowSuccessCard(true)
      setCountdown(60)
    }
  }

  // Handle confetti button click
  const triggerConfetti = () => {
    if (confettiCount >= 10) return // Max 10 uses

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#0d9488', '#14b8a6', '#2dd4bf'],
    })

    const newCount = confettiCount + 1
    setConfettiCount(newCount)
    localStorage.setItem('confettiCount', newCount.toString())
  }

  // If success card is showing, render that instead of the form
  if (showSuccessCard) {
    return (
      <div className="mx-auto w-full max-w-3xl">
        <div className="bg-secondary/10 border-primary/40 h-full rounded-2xl border p-12 text-center">
          <div className="mb-6 flex justify-center">
            <div className="bg-primary/10 rounded-full p-6">
              <CheckCircle2 className="text-primary h-16 w-16" />
            </div>
          </div>
          <h2 className="text-primary mb-3 text-2xl font-bold">
            Enquiry Submitted Successfully!
          </h2>
          <p className="text-muted-foreground mb-6 text-lg">
            Thank you for reaching out. Our team will review your enquiry and
            get back to you soon.
          </p>

          {/* Fun confetti button */}
          <div className="mb-6">
            <button
              onClick={triggerConfetti}
              disabled={confettiCount >= 10}
              className={`inline-flex items-center gap-2 rounded-lg px-6 py-3 font-medium transition-all ${
                confettiCount >= 10
                  ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 active:scale-95'
              }`}
              title={
                confettiCount >= 10
                  ? 'Max confetti reached!'
                  : 'Trigger confetti celebration'
              }
            >
              <Sparkles className="h-5 w-5" />
              {confettiCount >= 10
                ? 'Confetti Depleted'
                : `Celebrate Again (${10 - confettiCount} left)`}
            </button>
          </div>

          <div className="bg-background dark:bg-background/50 rounded-xl p-4">
            <p className="text-muted-foreground text-sm">
              You can submit another enquiry in{' '}
              <span className="text-primary font-semibold">{countdown}s</span>
            </p>
            <Button onClick={resetForm} variant="link" disabled={countdown > 0}>
              Submit Another Query
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto mb-16 w-full max-w-3xl">
      <h1 className="text-primary mb-4 text-center text-3xl font-bold md:text-4xl">
        Send us your Query
      </h1>
      <p className="text-muted-foreground mb-6 text-center text-lg">
        We&apos;ll personally review it and get back to you.
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Row 1: First Name & Last Name */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="firstName"
              className="mb-2 block text-sm font-medium"
            >
              First Name <span className="text-destructive">*</span>
            </label>
            <input
              id="firstName"
              type="text"
              autoComplete="given-name"
              {...register('firstName', { required: 'First name is required' })}
              className="border-border bg-input focus:border-primary focus:ring-primary/20 w-full rounded-lg border px-4 py-3 transition-colors focus:ring-2 focus:outline-none"
              placeholder="First name"
            />
            {errors.firstName && (
              <p className="text-destructive mt-1 text-sm">
                {errors.firstName.message}
              </p>
            )}
            {formState?.errors?.firstName && (
              <p className="text-destructive mt-1 text-sm">
                {formState.errors.firstName[0]}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="mb-2 block text-sm font-medium"
            >
              Last Name <span className="text-destructive">*</span>
            </label>
            <input
              id="lastName"
              type="text"
              autoComplete="family-name"
              {...register('lastName', { required: 'Last name is required' })}
              className="border-border bg-input focus:border-primary focus:ring-primary/20 w-full rounded-lg border px-4 py-3 transition-colors focus:ring-2 focus:outline-none"
              placeholder="Last name"
            />
            {errors.lastName && (
              <p className="text-destructive mt-1 text-sm">
                {errors.lastName.message}
              </p>
            )}
            {formState?.errors?.lastName && (
              <p className="text-destructive mt-1 text-sm">
                {formState.errors.lastName[0]}
              </p>
            )}
          </div>
        </div>

        {/* Row 2: Phone & Email */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="phone" className="mb-2 block text-sm font-medium">
              Phone Number
              {isPhoneRequired && <span className="text-destructive"> *</span>}
            </label>
            <div className="relative">
              <Phone className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
              <input
                id="phone"
                type="tel"
                autoComplete="tel"
                {...register('phone', {
                  required: isPhoneRequired
                    ? 'Phone number is required'
                    : false,
                })}
                maxLength={10}
                pattern="[0-9]{10}"
                className="border-border bg-input focus:border-primary focus:ring-primary/20 w-full rounded-lg border py-3 pr-4 pl-11 transition-colors focus:ring-2 focus:outline-none"
                placeholder="+91 9087654321"
              />
            </div>
            {errors.phone && (
              <p className="text-destructive mt-1 text-sm">
                {errors.phone.message}
              </p>
            )}
            {formState?.errors?.phone && (
              <p className="text-destructive mt-1 text-sm">
                {formState.errors.phone[0]}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium">
              Email
              {isEmailRequired && <span className="text-destructive"> *</span>}
            </label>
            <div className="relative">
              <Mail className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                {...register('email', {
                  required: isEmailRequired ? 'Email is required' : false,
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                className="border-border bg-input focus:border-primary focus:ring-primary/20 w-full rounded-lg border py-3 pr-4 pl-11 transition-colors focus:ring-2 focus:outline-none"
                placeholder="your@email.com"
              />
            </div>
            {errors.email && (
              <p className="text-destructive mt-1 text-sm">
                {errors.email.message}
              </p>
            )}
            {formState?.errors?.email && (
              <p className="text-destructive mt-1 text-sm">
                {formState.errors.email[0]}
              </p>
            )}
          </div>
        </div>

        {/* Row 3.5: Age & Gender (Optional) */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="age" className="mb-2 block text-sm font-medium">
              Age{' '}
              <span className="text-muted-foreground text-xs">(Optional)</span>
            </label>
            <input
              id="age"
              type="number"
              min="1"
              max="100"
              {...register('age', { valueAsNumber: true })}
              className="border-border bg-input focus:border-primary focus:ring-primary/20 w-full rounded-lg border px-4 py-3 transition-colors focus:ring-2 focus:outline-none"
              placeholder="e.g. 25"
            />
            {formState?.errors?.age && (
              <p className="text-destructive mt-1 text-sm">
                {formState.errors.age[0]}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="gender" className="mb-2 block text-sm font-medium">
              Gender{' '}
              <span className="text-muted-foreground text-xs">(Optional)</span>
            </label>
            <select
              id="gender"
              {...register('gender')}
              className="border-border bg-input focus:border-primary focus:ring-primary/20 w-full rounded-lg border px-4 py-3 transition-colors focus:ring-2 focus:outline-none"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
            {formState?.errors?.gender && (
              <p className="text-destructive mt-1 text-sm">
                {formState.errors.gender[0]}
              </p>
            )}
          </div>
        </div>

        {/* Row 3: Message Textarea */}
        <div>
          <label htmlFor="message" className="mb-2 block text-sm font-medium">
            Message
          </label>
          <textarea
            id="message"
            rows={5}
            {...register('message')}
            className="border-border bg-input focus:border-primary focus:ring-primary/20 w-full resize-none rounded-lg border px-4 py-3 transition-colors focus:ring-2 focus:outline-none"
            placeholder="Ask something if you want to..."
          />
        </div>

        {/* Row 4: Contact Method Selection */}
        <div>
          <label className="mb-3 block text-sm font-medium">
            How do you want us to contact you?{' '}
            <span className="text-destructive">*</span>
          </label>
          <div className="flex flex-wrap gap-3">
            <label className="border-border bg-card hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/50 flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-3 transition-all">
              <input
                type="checkbox"
                value="whatsapp"
                {...register('contactMethod', {
                  required: 'Please select at least one contact method',
                })}
                className="border-border text-primary focus:ring-primary/20 h-4 w-4 rounded focus:ring-2"
              />
              <span className="text-sm font-medium">Text me on Whatsapp</span>
            </label>

            <label className="border-border bg-card hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/50 flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-3 transition-all">
              <input
                type="checkbox"
                value="call"
                {...register('contactMethod')}
                className="border-border text-primary focus:ring-primary/20 h-4 w-4 rounded focus:ring-2"
              />
              <span className="text-sm font-medium">Call me</span>
            </label>

            <label className="border-border bg-card hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/50 flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-3 transition-all">
              <input
                type="checkbox"
                value="mail"
                {...register('contactMethod')}
                className="border-border text-primary focus:ring-primary/20 h-4 w-4 rounded focus:ring-2"
              />
              <span className="text-sm font-medium">Send me a mail</span>
            </label>
          </div>
          {errors.contactMethod && (
            <p className="text-destructive mt-2 text-sm">
              {errors.contactMethod.message}
            </p>
          )}
          {formState?.errors?.contactMethod && (
            <p className="text-destructive mt-2 text-sm">
              {formState.errors.contactMethod[0]}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting || !isFormValid()}
          className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary/20 w-full rounded-lg px-6 py-3 font-semibold transition-all focus:ring-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              Submitting...
            </span>
          ) : (
            'Submit'
          )}
        </button>

        {/* Error Messages Only (Success is handled by success card) */}
        {formState && !formState.success && (
          <div className="border-destructive/20 bg-destructive/5 text-destructive rounded-lg border p-4">
            <p className="text-sm font-medium">{formState.message}</p>
          </div>
        )}
      </form>
    </div>
  )
}
