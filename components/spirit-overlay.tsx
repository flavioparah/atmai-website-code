"use client"

import { useEffect, useRef, useState } from "react"

export function SpiritOverlay() {
  const [pathD, setPathD] = useState("M 0 0")
  const [seedPosition, setSeedPosition] = useState({ cx: 0, cy: 0, r: 4 })
  const [pathOpacity, setPathOpacity] = useState(0)
  const [seedGlow, setSeedGlow] = useState(20)

  const pathRef = useRef<SVGPathElement | null>(null)
  const [pathLength, setPathLength] = useState(0)

  useEffect(() => {
    let animationFrame: number

    function updateSpirit() {
      const scrollY = window.scrollY
      const maxScroll = document.body.scrollHeight - window.innerHeight
      const scrollPercent = Math.min(Math.max(scrollY / maxScroll, 0), 1)
      
      const width = window.innerWidth
      const height = window.innerHeight
      const time = performance.now() * 0.001

      // 1. LINHA ONDULADA
      const steps = 50
      const amplitude = (width < 768 ? 50 : 110)
      let d = `M ${width / 2} 0`

      for (let i = 1; i <= steps; i++) {
        const ratio = i / steps
        const py = ratio * height
        const microWobble = Math.sin(ratio * 20 + time * 5) * 2
        const px = width / 2 + Math.sin(ratio * 4 + time * 0.5) * amplitude + microWobble
        const prevRatio = (i - 0.5) / steps
        const midX = width / 2 + Math.sin(prevRatio * 4 + time * 0.5) * amplitude
        const midY = prevRatio * height
        d += ` Q ${midX} ${midY}, ${px} ${py}`
      }

      setPathD(d)
      setPathOpacity(0.25 + scrollPercent * 0.4)

      // 2. BOLINHA (Núcleo de Energia)
      const startY = height * 0.15
      const endY = height * 0.9
      const currentY = startY + (endY - startY) * scrollPercent
      const yRatio = currentY / height
      const seedX = width / 2 + Math.sin(yRatio * 4 + time * 0.5) * amplitude

      setSeedPosition({
        cx: seedX,
        cy: currentY,
        r: 8 + (scrollPercent * 20), // Levemente maior para compensar o desfoque
      })

      // Pulsação suave do brilho
      setSeedGlow(40 + (scrollPercent * 60) + Math.sin(time * 8) * 10)
      
      animationFrame = requestAnimationFrame(updateSpirit)
    }

    animationFrame = requestAnimationFrame(updateSpirit)
    return () => cancelAnimationFrame(animationFrame)
  }, [])

  return (
    <svg className="fixed inset-0 w-full h-full z-[25] pointer-events-none" aria-hidden="true">
      <defs>
        {/* Filtro de Glow para a linha */}
        <filter id="ultra-glow">
          <feGaussianBlur stdDeviation="2.5" result="blur1" />
          <feGaussianBlur stdDeviation="10" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* GRADIENTE DA BOLA DE LUZ - Essencial para tirar a borda sólida */}
        <radialGradient id="seedGradient">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="30%" stopColor="#f3cc4b" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#f3cc4b" stopOpacity="0" />
        </radialGradient>

        <linearGradient id="plasmaLine" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f3cc4b" stopOpacity="0" />
          <stop offset="20%" stopColor="#f3cc4b" stopOpacity="0.9" />
          <stop offset="80%" stopColor="#f3cc4b" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#f3cc4b" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Aura Difusa do Caminho */}
      <path
        d={pathD}
        fill="none"
        stroke="#d4af37"
        strokeWidth={25}
        style={{ filter: "blur(40px)", opacity: pathOpacity * 0.3 }}
      />

      {/* FILAMENTO */}
      <path
        ref={pathRef}
        d={pathD}
        fill="none"
        stroke="url(#plasmaLine)"
        strokeWidth={2}
        strokeLinecap="round"
        style={{
          filter: "url(#ultra-glow)",
          strokeDasharray: "400 200", 
          strokeDashoffset: -(performance.now() * 0.6),
          opacity: pathOpacity,
        }}
      />

      {/* BOLINHA - Transformada em Bola de Luz */}
      <g style={{ filter: `drop-shadow(0 0 ${seedGlow}px #f3cc4b)` }}>
        {/* Brilho Externo (Aura) */}
        <circle
          cx={seedPosition.cx}
          cy={seedPosition.cy}
          r={seedPosition.r * 2.5}
          fill="#f3cc4b"
          fillOpacity="0.15"
          style={{ filter: "blur(15px)" }}
        />
        
        {/* Núcleo Gradiente (Substitui a bola sólida) */}
        <circle
          cx={seedPosition.cx}
          cy={seedPosition.cy}
          r={seedPosition.r * 1.5}
          fill="url(#seedGradient)"
          style={{ filter: "blur(2px)" }}
        />

        {/* Centro de incandescência (Hotspot) */}
        <circle
          cx={seedPosition.cx}
          cy={seedPosition.cy}
          r={seedPosition.r * 0.4}
          fill="#fff"
          style={{ filter: "blur(4px)", opacity: 0.8 }}
        />
      </g>
    </svg>
  )
}
