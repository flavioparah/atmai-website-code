"use client"

import { useEffect, useRef, useState } from "react"

export function SpiritOverlay() {
  const [pathD, setPathD] = useState("M 0 0")
  const [seedPosition, setSeedPosition] = useState({ cx: 0, cy: 0, r: 3 })
  const [pathOpacity, setPathOpacity] = useState(0)
  const [seedGlow, setSeedGlow] = useState(15)

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
      const time = performance.now() * 0.001 // Tempo para animação orgânica

      // 1. LINHA FIXA COM MOVIMENTO DE PLASMA (WOBBLE)
      const steps = 15
      const amplitude = (width < 768 ? 40 : 80)
      let d = `M ${width / 2} 0`

      for (let i = 1; i <= steps; i++) {
        const ratio = i / steps
        const py = ratio * height
        
        // Adiciona uma pequena variação temporal (time) para a linha "viver"
        const wobble = Math.sin(ratio * 6 + time) * 3 
        const px = width / 2 + Math.sin(ratio * 4) * amplitude + wobble
        
        const prevRatio = (i - 0.5) / steps
        const midWobble = Math.sin(prevRatio * 6 + time) * 3
        const midX = width / 2 + Math.sin(prevRatio * 4) * amplitude + midWobble
        const midY = prevRatio * height
        
        d += ` Q ${midX} ${midY}, ${px} ${py}`
      }

      setPathD(d)
      setPathOpacity(0.2 + scrollPercent * 0.3)

      // 2. BOLINHA (Semente de Plasma)
      const startY = height * 0.1
      const endY = height * 0.95
      const currentY = startY + (endY - startY) * scrollPercent
      
      const yRatio = currentY / height
      const seedWobble = Math.sin(yRatio * 6 + time) * 3
      const currentX = width / 2 + Math.sin(yRatio * 4) * amplitude + seedWobble

      setSeedPosition({
        cx: currentX,
        cy: currentY,
        r: 5 + (scrollPercent * 25), // Fica bem grande no final
      })

      setSeedGlow(25 + (scrollPercent * 70))
      
      animationFrame = requestAnimationFrame(updateSpirit)
    }

    animationFrame = requestAnimationFrame(updateSpirit)
    window.addEventListener("scroll", () => {}) // Trigger de re-render opcional
    window.addEventListener("resize", () => {})

    return () => {
      cancelAnimationFrame(animationFrame)
    }
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
        {/* Filtro de Plasma Avançado - Simula o "fuzz" da imagem */}
        <filter id="plasma-core">
          <feGaussianBlur stdDeviation="2" result="blur1" />
          <feGaussianBlur stdDeviation="6" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id="plasmaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f3cc4b" stopOpacity="0" />
          <stop offset="15%" stopColor="#f3cc4b" stopOpacity="0.8" />
          <stop offset="85%" stopColor="#f3cc4b" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#f3cc4b" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Camada 1: Brilho Externo (Aura Atmosférica) */}
      <path
        d={pathD}
        fill="none"
        stroke="#d4af37"
        strokeWidth={12}
        style={{
          filter: "blur(25px)",
          opacity: pathOpacity * 0.3,
        }}
      />

      {/* Camada 2: Filamento de Plasma (A linha que sobe) */}
      <path
        ref={pathRef}
        d={pathD}
        fill="none"
        stroke="url(#plasmaGradient)"
        strokeWidth={2.5}
        strokeLinecap="round"
        style={{
          filter: "url(#plasma-core)",
          strokeDasharray: "150 450", 
          strokeDashoffset: (performance.now() * 0.2) % 600, // Fluxo constante para cima
          opacity: pathOpacity + 0.2,
        }}
      />

      {/* Camada 3: Núcleo Brilhante (O centro do plasma) */}
      <path
        d={pathD}
        fill="none"
        stroke="#fff"
        strokeWidth={0.8}
        style={{
          filter: "blur(1px)",
          opacity: pathOpacity * 0.6,
        }}
      />

      {/* A SEMENTE (Bolinha de Energia Estilo Tesla) */}
      <g style={{ filter: `drop-shadow(0 0 ${seedGlow}px #f3cc4b)` }}>
        {/* Brilho Interno */}
        <circle
          cx={seedPosition.cx}
          cy={seedPosition.cy}
          r={seedPosition.r}
          fill="#f3cc4b"
          style={{ opacity: 0.9 }}
        />
        {/* Núcleo Branco para parecer quente/energético */}
        <circle
          cx={seedPosition.cx}
          cy={seedPosition.cy}
          r={seedPosition.r * 0.4}
          fill="#fff"
          style={{ filter: "blur(2px)", opacity: 0.8 }}
        />
      </g>
    </svg>
  )
}
