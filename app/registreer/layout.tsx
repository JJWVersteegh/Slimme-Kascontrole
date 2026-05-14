import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Inloggen of registreren',
  description: 'Log in of maak een account aan bij Slimme Kascontrole en ontvang uw kascontrolerapport.',
  alternates: { canonical: '/registreer' },
  robots: { index: false },
}

export default function RegistreerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
