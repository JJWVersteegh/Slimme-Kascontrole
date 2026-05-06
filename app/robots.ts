import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/mijn-omgeving', '/api/', '/betaald', '/upload/'],
    },
    sitemap: 'https://www.slimmekascontrole.nl/sitemap.xml',
  }
}
