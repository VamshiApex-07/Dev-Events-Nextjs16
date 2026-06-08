'use client'

import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'
import { getPostHog } from '@/lib/posthog'

const PH_API_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY

function getApiHost(): string {
  // Use relative path so rewrites proxy requests through our domain,
  // bypassing ad blockers that block direct PostHog calls.
  if (typeof window !== "undefined") return "/ingest"
  // On the server, use the full URL so SSR renders correctly.
  return process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com"
}

function PageViewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const posthog = getPostHog()
    if (!posthog) return
    let url = pathname
    if (searchParams?.toString()) {
      url += '?' + searchParams.toString()
    }
    posthog.capture('$pageview', { $current_url: url })
  }, [pathname, searchParams])

  return null
}

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  if (!PH_API_KEY) {
    return <>{children}</>
  }

  return (
    <PHProvider apiKey={PH_API_KEY} options={{ api_host: getApiHost() }}>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
      {children}
    </PHProvider>
  )
}
