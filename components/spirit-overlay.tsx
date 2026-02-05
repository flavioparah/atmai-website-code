"use client"

import { useEffect, useRef, useState } from "react"

export function SpiritOverlay() {
  const [pathD, setPathD] = useState("M 0 0")
  const [seedPosition, setSeedPosition] = useState({ cx: 0, cy: 0, r: 4 })
  const [pathOpacity, setPathOpacity] = useState(0)
  const [seedGlow, setSeedGlow] = useState(20)

  const pathRef = useRef<SVGPathElement | null>(null)
  const [pathLength, setPathLength] = useState(0)
  const offsetRef = useRef(0)

  useEffect(() => {
    let animationFrame: number

    function updateSpirit() {
      const scrollY = window.scrollY
      const maxScroll = document.body.scrollHeight - window.innerHeight
      const scrollPercent = Math.min(Math.max(scrollY / maxScroll, 0), 1)
      
      const width = window.innerWidth
      const height = window.innerHeight
      const time = performance.now() * 0.001

      // 1. LINHA ONDULADA (Filamento Tesla)
      const steps = 50
      const amplitude = (width < 768 ? 50 : 110)
      let d = `M ${width / 2} 0`

      for (let i = 1; i <= steps; i++) {
        const ratio = i / steps
        const py = ratio * height
        // Micro-oscilação para o efeito "vivo"
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
        r: 6 + (scrollPercent * 24),
      })

      setSeedGlow(35 + (scrollPercent * 75) + Math.sin(time * 10) * 5)
      
      animationFrame = requestAnimationFrame(updateSpirit)
    }

    animationFrame = requestAnimationFrame(updateSpirit)
    return () => cancelAnimationFrame(animationFrame)
  }, [])

  useEffect(() => {
    if (!pathRef.current) return
    try {
      const len = pathRef.current.getTotalLength()
      setPathLength(len)
    } catch { setPathLength(0) }
  }, [pathD])

  return (
    <svg className="fixed inset-0 w-full h-full z-[25] pointer-events-none" aria-hidden="true">
      <defs>
        <filter id="ultra-glow">
          <feGaussianBlur stdDeviation="2.5" result="blur1" />
          <feGaussianBlur stdDeviation="10" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id="plasmaLine" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f3cc4b" stopOpacity="0" />
          <stop offset="20%" stopColor="#f3cc4b" stopOpacity="0.9" />
          <stop offset="80%" stopColor="#f3cc4b" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#f3cc4b" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Aura Difusa */}
      <path
        d={pathD}
        fill="none"
        stroke="#d4af37"
        strokeWidth={18}
        style={{
          filter: "blur(30px)",
          opacity: pathOpacity * 0.35,
        }}
      />

      {/* FILAMENTO COM TRAÇOS LONGOS */}
      <path
        ref={pathRef}
        d={pathD}
        fill="none"
        stroke="url(#plasmaLine)"
        strokeWidth={3}
        strokeLinecap="round"
        style={{
          filter: "url(#ultra-glow)",
          // Aumentado para 400 (traço longo) e 200 (espaço)
          strokeDasharray: "400 200", 
          strokeDashoffset: -(performance.now() * 0.6), // Descendo mais rápido
          opacity: pathOpacity,
        }}
      />

      {/* BOLINHA - NÚCLEO TESLA */}
      <g style={{ filter: `drop-shadow(0 0 ${seedGlow}px #f3cc4b)` }}>
        <circle
          cx={seedPosition.cx}
          cy={seedPosition.cy}
          r={seedPosition.r * 1.6}
          fill="rgba(243, 204, 75, 0.25)"
          style={{ filter: "blur(10px)" }}
        />
        <circle
          cx={seedPosition.cx}
          cy={seedPosition.cy}
          r={seedPosition.r}
          fill="#f3cc4b"
        />
        <circle
          cx={seedPosition.cx}
          cy={seedPosition.cy}
          r={seedPosition.r * 0.38}
          fill="#fff"
          style={{ filter: "blur(2.5px)", opacity: 0.95 }}
        />
      </g>
    </svg>
  )
}
