'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function ViaPage() {
  const { slug } = useParams<{ slug: string }>()

  useEffect(() => {
    if (slug) {
      localStorage.setItem('skc_ref', slug)
    }
    window.location.replace('/')
  }, [slug])

  return null
}
