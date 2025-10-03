import React, {useEffect, useRef, useState} from 'react'
import CanvasBoard from './components/CanvasBoard'
import {fetchPixels, reserveBlock, createCheckout} from './api'

export default function App(){
  const [pixels,setPixels] = useState([])
  const [w,setW] = useState(100)
  const [h,setH] = useState(100)
  const [pricePerPixel,setPricePerPixel] = useState(1)
  const [imageFile,setImageFile] = useState(null)

  useEffect(()=>{ load() },[])
  async function load(){ const data = await fetchPixels(); setPixels(data) }

  async function onCanvasClick(e){
    const rect = e.target.getBoundingClientRect(); const scaleX = e.target.width/rect.width
    const x = Math.floor((e.clientX-rect.left)*scaleX)
    const y = Math.floor((e.clientY-rect.top)*scaleX)
    const payload = {x,y,w,h,pricePerPixel}
    const res = await reserveBlock(payload)
    if(res.error){ alert(res.error); return }
    const sessionResp = await createCheckout({reserveId:res.reserveId})
    if(sessionResp.url){ window.location.href = sessionResp.url }
  }

  return (
    <div style={{display:'flex',gap:16,padding:20}}>
      <div>
        <CanvasBoard pixels={pixels} onClick={onCanvasClick} />
        <div style={{marginTop:8}}>
          <label>W: <input type="number" value={w} onChange={e=>setW(+e.target.value)} /></label>
          <label>H: <input type="number" value={h} onChange={e=>setH(+e.target.value)} /></label>
          <label>Preço/pixel: <input type="number" value={pricePerPixel} onChange={e=>setPricePerPixel(+e.target.value)} step="0.01" /></label>
          <input type="file" onChange={e=>setImageFile(e.target.files[0])} />
        </div>
      </div>
      <div style={{width:340}}>
        <h3>Vendas</h3>
        <div>{pixels.map((p,i)=>(<div key={i}>{p.name||'(sem nome)'} — {p.w}×{p.h} — R$ {p.price}</div>))}</div>
      </div>
    </div>
  )
}
