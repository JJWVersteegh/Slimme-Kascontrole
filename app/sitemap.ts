import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: 'https://www.slimmekascontrole.nl', lastModified: new Date(), changeFrequency: 'monthly', priority: 1 },
    { url: 'https://www.slimmekascontrole.nl/tarieven', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://www.slimmekascontrole.nl/vve-kascontrole', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://www.slimmekascontrole.nl/vve-kascontrole-checklist', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://www.slimmekascontrole.nl/controle-jaarrekening-vve', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://www.slimmekascontrole.nl/vve-kascommissie', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://www.slimmekascontrole.nl/sportvereniging-kascontrole', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://www.slimmekascontrole.nl/kascommissie-rapport', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://www.slimmekascontrole.nl/stichting-kascontrole', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.8 },
    { url: 'https://www.slimmekascontrole.nl/voorbeeld-rapport', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://www.slimmekascontrole.nl/bronnen', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://www.slimmekascontrole.nl/bronnen/twinq', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: 'https://www.slimmekascontrole.nl/bronnen/isabel-yuki', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: 'https://www.slimmekascontrole.nl/bronnen/eigen-excel', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: 'https://www.slimmekascontrole.nl/voorwaarden', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: 'https://www.slimmekascontrole.nl/privacyverklaring', lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  ]
}
