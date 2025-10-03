import express from 'express'
import { pool } from '../db.js'
import { v4 as uuidv4 } from 'uuid'
import dotenv from 'dotenv'
import { stripe, createCheckoutSession } from '../services/stripe.js'
import bodyParser from 'body-parser'

dotenv.config()
const router = express.Router()

// GET /pixels
router.get('/pixels', async (req,res)=>{
  try{
    const {rows} = await pool.query("SELECT x,y,w,h,name,link,price,image_url FROM pixels_sale WHERE status='completed'")
    res.json(rows)
  }catch(e){ console.error(e); res.status(500).json({error:e.message}) }
})

// POST /reserve
router.post('/reserve', async (req,res)=>{
  try{
    const {x,y,w,h,pricePerPixel,name,link} = req.body
    const now = new Date()
    const {rows} = await pool.query(`SELECT * FROM pixels_sale WHERE NOT (x + w <= $1 OR x >= $2 OR y + h <= $3 OR y >= $4) AND status IN ('completed','reserved')`,[x,x+w,y,y+h])
    const blocked = rows.some(r=>{ if(r.status==='reserved' && r.reserved_until && new Date(r.reserved_until) < now) return false; return true })
    if(blocked) return res.status(400).json({error:'Área já vendida ou reservada'})
    const id = uuidv4()
    const reservedUntil = new Date(Date.now() + (15*60*1000))
    const price = w*h*parseFloat(pricePerPixel||0)
    await pool.query(`INSERT INTO pixels_sale (id,x,y,w,h,price,name,link,status,reserved_until) VALUES($1,$2,$3,$4,$5,$6,$7,$8,'reserved',$9)`,[id,x,y,w,h,price,name,link,reservedUntil])
    res.json({reserveId:id, reservedUntil})
  }catch(err){ console.error(err); res.status(500).json({error:err.message}) }
})

// POST /create-checkout-session
router.post('/create-checkout-session', async (req,res)=>{
  try{
    const {reserveId} = req.body
    const {rows} = await pool.query('SELECT * FROM pixels_sale WHERE id=$1',[reserveId])
    if(!rows[0]) return res.status(404).json({error:'Reserva não encontrada'})
    const sale = rows[0]
    const amount = parseFloat(sale.price)
    const host = process.env.FRONTEND_URL || 'http://localhost:5173'
    const session = await createCheckoutSession({amount, success_url:`${host}/success?session_id={CHECKOUT_SESSION_ID}`, cancel_url:`${host}/cancel`, metadata:{reserveId}})
    res.json({id:session.id, url:session.url})
  }catch(err){ console.error(err); res.status(500).json({error:err.message}) }
})

// Stripe webhook
router.post('/webhook', express.raw({type:'application/json'}), async (req,res)=>{
  const sig = req.headers['stripe-signature']
  let event
  try{
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  }catch(e){ console.error(e); return res.status(400).send(`Webhook Error: ${e.message}`) }
  if(event.type === 'checkout.session.completed'){
    const session = event.data.object
    const reserveId = session.metadata?.reserveId
    if(reserveId){
      await pool.query(`UPDATE pixels_sale SET status='completed', reserved_until=null WHERE id=$1`,[reserveId])
    }
  }
  res.json({received:true})
})

export default router
