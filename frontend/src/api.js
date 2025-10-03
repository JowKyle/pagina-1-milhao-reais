const API = (path) => `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}${path}`

export async function fetchPixels(){
  const r = await fetch(API('/pixels'))
  return r.json()
}

export async function reserveBlock(body){
  const r = await fetch(API('/reserve'),{
    method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(body)
  })
  return r.json()
}

export async function createCheckout(sessionBody){
  const r = await fetch(API('/create-checkout-session'),{
    method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(sessionBody)
  })
  return r.json()
}
