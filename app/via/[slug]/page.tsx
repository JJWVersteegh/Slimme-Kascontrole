import { redirect } from 'next/navigation'

export default async function ViaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  redirect(`/registreer?ref=${slug}`)
}
