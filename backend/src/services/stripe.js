import Stripe from 'stripe'
import dotenv from 'dotenv'
dotenv.config()
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' })

export async function createCheckoutSession({amount, currency='brl', success_url, cancel_url, metadata}){
  const session = await stripe.checkout.sessions.create({
    payment_method_types:['card'],
    line_items:[{price_data:{currency,product_data:{name:metadata?.name||'Pixel block'},unit_amount: Math.round(amount*100)},quantity:1}],
    mode:'payment',
    success_url, cancel_url,
    metadata
  })
  return session
}
