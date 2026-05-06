import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://www.slimmekascontrole.nl', lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: 'https://www.slimmekascontrole.nl/registreer', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://www.slimmekascontrole.nl/tarieven', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://www.slimmekascontrole.nl/vve-kascontrole', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://www.slimmekascontrole.nl/vve-kascontrole-checklist', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://www.slimmekascontrole.nl/controle-jaarrekening-vve', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://www.slimmekascontrole.nl/vve-kascommissie', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://www.slimmekascontrole.nl/sportvereniging-kascontrole', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://www.slimmekascontrole.nl/kascommissie-rapport', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://www.slimmekascontrole.nl/stichting-kascontrole', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://www.slimmekascontrole.nl/bronnen', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://www.slimmekascontrole.nl/voorwaarden', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: 'https://www.slimmekascontrole.nl/mijn-omgeving', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]
}
