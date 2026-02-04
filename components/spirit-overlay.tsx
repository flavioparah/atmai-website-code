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
      const time = performance.now() * 0.001

      // 1. LINHA COM WOBBLE MAIS RÁPIDO (INSTABILIDADE ELÉTRICA)
      const steps = 20
      const amplitude = (width < 768 ? 45 : 95)
      let d = `M ${width / 2} 0`

      for (let i = 1; i <= steps; i++) {
        const ratio = i / steps
        const py = ratio * height
        // Wobble mais frenético (time * 4) para simular a eletricidade da referência
        const wobble = Math.sin(ratio * 10 + time * 4) * (4 + scrollPercent * 12)
        const px = width / 2 + Math.sin(ratio * 4) * amplitude + wobble
        
        const prevRatio = (i - 0.5) / steps
        const midX = width / 2 + Math.sin(prevRatio * 4) * amplitude + wobble
        const midY = prevRatio * height
        
        d += ` Q ${midX} ${midY}, ${px} ${py}`
      }

      setPathD(d)
      setPathOpacity(0.4 + scrollPercent * 0.4)

      // 2. BOLINHA (CRESCIMENTO E DESCIDA)
      const startY = height * 0.1
      const endY = height * 0.95
      const currentY = startY + (endY - startY) * scrollPercent
      const yRatio = currentY / height
      const seedX = width / 2 + Math.sin(yRatio * 4) * amplitude

      setSeedPosition({
        cx: seedX,
        cy: currentY,
        r: 6 + (scrollPercent * 22),
      })

      setSeedGlow(35 + (scrollPercent * 85))
      
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
        <filter id="plasma-core">
          <feGaussianBlur stdDeviation="1.2" result="blur1" />
          <feGaussianBlur stdDeviation="3.5" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id="plasmaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f3cc4b" stopOpacity="0" />
          <stop offset="20%" stopColor="#f3cc4b" stopOpacity="1" />
          <stop offset="80%" stopColor="#f3cc4b" stopOpacity="1" />
          <stop offset="100%" stopColor="#f3cc4b" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Brilho Atmosférico */}
      <path
        d={pathD}
        fill="none"
        stroke="#d4af37"
        strokeWidth={14}
        style={{
          filter: "blur(22px)",
          opacity: pathOpacity * 0.35,
        }}
      />

      {/* FLUXO INVERTIDO E INTERVALOS MENORES */}
      <path
        ref={pathRef}
        d={pathD}
        fill="none"
        stroke="url(#plasmaGradient)"
        strokeWidth={3.5}
        strokeLinecap="round"
        style={{
          filter: "url(#plasma-core)",
          // Fragmentos menores (5%) e intervalos menores (10%) para maior densidade
          strokeDasharray: `${pathLength * 0.05} ${pathLength * 0.10}`, 
          // Valor POSITIVO no Dashoffset com movimento contínuo faz o fluxo SUBIR
          strokeDashoffset: (performance.now() * 0.5), 
          opacity: pathOpacity,
        }}
      />

      {/* Núcleo Incandescente (Fios brancos rápidos) */}
      <path
        d={pathD}
        fill="none"
        stroke="#fff"
        strokeWidth={0.6}
        style={{
          filter: "blur(1px)",
          strokeDasharray: `${pathLength * 0.02} ${pathLength * 0.08}`,
          strokeDashoffset: (performance.now() * 0.6),
          opacity: pathOpacity * 0.9,
        }}
      />

      {/* BOLINHA DE PLASMA (SEMENTE) */}
      <g style={{ filter: `drop-shadow(0 0 ${seedGlow}px #f3cc4b)` }}>
        <circle
          cx={seedPosition.cx}
          cy={seedPosition.cy}
          r={seedPosition.r}
          fill="#f3cc4b"
        />
        {/* Centro de calor intenso */}
        <circle
          cx={seedPosition.cx}
          cy={seedPosition.cy}
          r={seedPosition.r * 0.35}
          fill="#fff"
          style={{ filter: "blur(1.5px)" }}
        />
      </g>
    </svg>
  )
}
