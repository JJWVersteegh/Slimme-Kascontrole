import { redirect } from 'next/navigation'

export default function ViaPage({ params }: { params: { slug: string } }) {
  redirect(`/registreer?ref=${params.slug}`)
}
