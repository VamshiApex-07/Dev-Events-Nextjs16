import type { PostHog } from 'posthog-js'

declare global {
  interface Window {
    posthog: PostHog | undefined
  }
}

export function getPostHog(): PostHog | null {
  if (typeof window === 'undefined') return null
  return window.posthog ?? null
}
