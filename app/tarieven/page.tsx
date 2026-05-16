import type { Metadata } from 'next'
import TarievenClient from './TarievenClient'

export const metadata: Metadata = {
  title: 'Tarieven – Kascontrolerapport voor €59 | Slimme Kascontrole',
  description: 'Eenmalig €59 incl. btw voor een volledig kascontrolerapport. Geen abonnement. Direct betalen via iDEAL of creditcard.',
  alternates: { canonical: '/tarieven' },
  openGraph: { title: 'Tarieven – Kascontrolerapport voor €59 | Slimme Kascontrole', description: 'Eenmalig €59 incl. btw voor een volledig kascontrolerapport. Geen abonnement.', url: 'https://www.slimmekascontrole.nl/tarieven', images: [{ url: '/og-image.jpg', width: 1200, height: 630 }] },
  twitter: { card: 'summary_large_image', title: 'Tarieven – Kascontrolerapport voor €59 | Slimme Kascontrole', images: ['/og-image.jpg'] },
}

export default function Tarieven() {
  return <TarievenClient />
}
