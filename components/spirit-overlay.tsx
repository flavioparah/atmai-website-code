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

      // 1. LINHA CONTÍNUA E ONDULADA (Efeito Filamento Elétrico)
      const steps = 50
      const amplitude = (width < 768 ? 50 : 110)
      let d = `M ${width / 2} 0`

      for (let i = 1; i <= steps; i++) {
        const ratio = i / steps
        const py = ratio * height
        
        // Adiciona micro-oscilações baseadas no tempo para parecer "vivo" como no vídeo
        const microWobble = Math.sin(ratio * 20 + time * 5) * 2
        const px = width / 2 + Math.sin(ratio * 4 + time * 0.5) * amplitude + microWobble
        
        const prevRatio = (i - 0.5) / steps
        const midX = width / 2 + Math.sin(prevRatio * 4 + time * 0.5) * amplitude
        const midY = prevRatio * height
        
        d += ` Q ${midX} ${midY}, ${px} ${py}`
      }

      setPathD(d)
      setPathOpacity(0.2 + scrollPercent * 0.4)

      // 2. BOLINHA ENERGÉTICA (Núcleo Tesla)
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

      // Brilho pulsante baseado no tempo + scroll
      setSeedGlow(30 + (scrollPercent * 70) + Math.sin(time * 10) * 5)
      
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
        {/* Filtro de Turbulência para deformar a luz como plasma real */}
        <filter id="plasma-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" />
        </filter>

        <filter id="ultra-glow">
          <feGaussianBlur stdDeviation="2" result="blur1" />
          <feGaussianBlur stdDeviation="8" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id="plasmaLine" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f3cc4b" stopOpacity="0" />
          <stop offset="20%" stopColor="#f3cc4b" stopOpacity="0.8" />
          <stop offset="80%" stopColor="#f3cc4b" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#f3cc4b" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Camada 1: Aura Difusa (Radiação) */}
      <path
        d={pathD}
        fill="none"
        stroke="#d4af37"
        strokeWidth={15}
        style={{
          filter: "blur(25px)",
          opacity: pathOpacity * 0.3,
        }}
      />

      {/* Camada 2: Filamento Principal (Ondulado e Descendo) */}
      <path
        ref={pathRef}
        d={pathD}
        fill="none"
        stroke="url(#plasmaLine)"
        strokeWidth={2.5}
        strokeLinecap="round"
        style={{
          filter: "url(#ultra-glow)",
          // Efeito de fluxo descendo
          strokeDasharray: "100 300",
          strokeDashoffset: -(performance.now() * 0.4),
          opacity: pathOpacity,
        }}
      />

      {/* BOLINHA - NÚCLEO DE PLASMA (Baseado na imagem de referência) */}
      <g style={{ filter: `drop-shadow(0 0 ${seedGlow}px #f3cc4b)` }}>
        {/* Aura Externa Brilhante */}
        <circle
          cx={seedPosition.cx}
          cy={seedPosition.cy}
          r={seedPosition.r * 1.5}
          fill="rgba(243, 204, 75, 0.2)"
          style={{ filter: "blur(8px)" }}
        />
        {/* Corpo da Bolinha */}
        <circle
          cx={seedPosition.cx}
          cy={seedPosition.cy}
          r={seedPosition.r}
          fill="#f3cc4b"
        />
        {/* Núcleo Incandescente (Branco "Quente") */}
        <circle
          cx={seedPosition.cx}
          cy={seedPosition.cy}
          r={seedPosition.r * 0.4}
          fill="#fff"
          style={{ filter: "blur(2px)", opacity: 0.9 }}
        />
      </g>
    </svg>
  )
}
