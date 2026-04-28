import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

export const NEWSLETTER_FROM = 'Navansh Finserv <newsletter@navansh.in>'
