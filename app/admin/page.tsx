import { redirect } from 'next/navigation'

export default function AdminRootPage() {
  // Default to blog admin tab
  redirect('/admin/blog')
}
