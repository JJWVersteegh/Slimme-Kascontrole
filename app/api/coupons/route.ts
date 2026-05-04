import { NextRequest, NextResponse } from 'next/server'

async function getStripe() {
  const Stripe = (await import('stripe')).default
  return new Stripe(process.env.STRIPE_SECRET_KEY || '', { apiVersion: '2025-01-27.acacia' as any })
}

// GET: haal alle coupons + promotiecodes op
export async function GET() {
  try {
    const stripe = await getStripe()
    const coupons = await stripe.coupons.list({ limit: 50 })

    const result = await Promise.all(coupons.data.map(async (coupon) => {
      const promoCodes = await stripe.promotionCodes.list({ coupon: coupon.id, limit: 10 })
      return {
        id: coupon.id,
        name: coupon.name,
        amount_off: coupon.amount_off,
        percent_off: coupon.percent_off,
        currency: coupon.currency,
        valid: coupon.valid,
        times_redeemed: coupon.times_redeemed,
        created: coupon.created,
        promoCodes: promoCodes.data.map(p => ({
          id: p.id,
          code: p.code,
          active: p.active,
          times_redeemed: p.times_redeemed,
          expires_at: p.expires_at,
        }))
      }
    }))

    return NextResponse.json(result)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// POST: maak nieuwe coupon + promotiecode aan
export async function POST(req: NextRequest) {
  try {
    const stripe = await getStripe()
    const { name, amount_off, code, expires_at } = await req.json()

    const coupon = await stripe.coupons.create({
      name,
      amount_off: Math.round(amount_off * 100),
      currency: 'eur',
      duration: 'once',
    })

    const promoData: any = {
      coupon: coupon.id,
      code,
    }
    if (expires_at) promoData.expires_at = Math.floor(new Date(expires_at).getTime() / 1000)

    const promoCode = await stripe.promotionCodes.create(promoData)

    return NextResponse.json({ coupon, promoCode })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

// DELETE: archiveer/deactiveer promotiecode
export async function DELETE(req: NextRequest) {
  try {
    const stripe = await getStripe()
    const { promoCodeId } = await req.json()

    const updated = await stripe.promotionCodes.update(promoCodeId, { active: false })
    return NextResponse.json(updated)
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
