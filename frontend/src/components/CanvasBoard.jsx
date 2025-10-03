import React, {useEffect, useRef} from 'react'

export default function CanvasBoard({pixels, onClick}){
  const ref = useRef(null)
  useEffect(()=>{
    const canvas = ref.current; const ctx = canvas.getContext('2d')
    ctx.fillStyle='#fff'; ctx.fillRect(0,0,canvas.width,canvas.height)
    ctx.strokeStyle='#eee'
    for(let x=0;x<=canvas.width;x+=10){ ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,canvas.height); ctx.stroke() }
    for(const p of pixels){ ctx.strokeStyle='#000'; ctx.strokeRect(p.x,p.y,p.w,p.h); ctx.fillStyle='rgba(0,0,0,0.8)'; ctx.fillText(p.name||p.link||'anúncio', p.x+4, p.y+12) }
  },[pixels])

  return <canvas ref={ref} width={1000} height={600} style={{border:'1px solid #ccc'}} onClick={onClick} />
}
