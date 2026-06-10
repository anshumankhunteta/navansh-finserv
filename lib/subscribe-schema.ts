import { z } from 'zod'

export const subscribeSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(254, 'Email is too long')
    .transform((e) => e.toLowerCase().trim()),
})

export type SubscribeInput = z.infer<typeof subscribeSchema>
