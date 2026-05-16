'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'

export default function ViaPage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()

  useEffect(() => {
    if (slug) {
      localStorage.setItem('skc_ref', slug)
    }
    router.replace('/')
  }, [slug, router])

  return null
}
