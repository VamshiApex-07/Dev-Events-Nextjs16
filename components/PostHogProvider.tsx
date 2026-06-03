'use client'

import { PostHogProvider as PHProvider } from 'posthog-js/react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'
import { getPostHog } from '@/lib/posthog'

const PH_API_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
const PH_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com'

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
    <PHProvider apiKey={PH_API_KEY} options={{ api_host: PH_HOST }}>
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
      {children}
    </PHProvider>
  )
}
