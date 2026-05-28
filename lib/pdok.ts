export interface PdokResult {
  adres: string
  plaats: string
}

/**
 * Zoek een adres op via de PDOK Locatieserver op basis van postcode en huisnummer.
 * Geeft null terug als het adres niet gevonden wordt of de request mislukt.
 */
export async function zoekAdresViaPostcode(
  postcode: string,
  huisnummer: string
): Promise<PdokResult | null> {
  const pc = postcode.replace(' ', '')
  if (pc.length < 6 || !huisnummer) return null

  try {
    const res = await fetch(
      `https://api.pdok.nl/bzk/locatieserver/search/v3_1/free?q=${pc}+${huisnummer}&fq=type:adres&rows=1`
    )
    const data = await res.json()
    const doc = data.response?.docs?.[0]
    if (!doc) return null
    return {
      adres: `${doc.straatnaam || ''} ${huisnummer}`.trim(),
      plaats: doc.woonplaatsnaam || '',
    }
  } catch {
    return null
  }
}
