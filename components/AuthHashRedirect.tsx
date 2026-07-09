'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AuthHashRedirect() {
  const router = useRouter()

  useEffect(() => {
    if (typeof window === 'undefined') return
    const hash = window.location.hash
    if (hash && hash.includes('type=recovery')) {
      router.replace('/reset-wachtwoord' + hash)
    }
  }, [router])

  return null
}
