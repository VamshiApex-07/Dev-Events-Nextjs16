import { PostHog } from 'posthog-js'

export function getPostHog(): PostHog | null {
  if (typeof window === 'undefined') return null
  const ph = (window as any).posthog
  return ph || null
}
