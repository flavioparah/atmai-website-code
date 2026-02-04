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

      // 1. LINHA COM CURVATURA E WOBBLE (PLASMA VIVO)
      const steps = 15
      const amplitude = (width < 768 ? 40 : 90)
      let d = `M ${width / 2} 0`

      for (let i = 1; i <= steps; i++) {
        const ratio = i / steps
        const py = ratio * height
        // O wobble simula a instabilidade do plasma da foto
        const wobble = Math.sin(ratio * 8 + time * 2) * (5 + scrollPercent * 10)
        const px = width / 2 + Math.sin(ratio * 4) * amplitude + wobble
        
        const prevRatio = (i - 0.5) / steps
        const midX = width / 2 + Math.sin(prevRatio * 4) * amplitude + wobble
        const midY = prevRatio * height
        
        d += ` Q ${midX} ${midY}, ${px} ${py}`
      }

      setPathD(d)
      setPathOpacity(0.3 + scrollPercent * 0.4)

      // 2. BOLINHA (CRESCIMENTO E BRILHO)
      const startY = height * 0.1
      const endY = height * 0.9
      const currentY = startY + (endY - startY) * scrollPercent
      
      const yRatio = currentY / height
      const seedX = width / 2 + Math.sin(yRatio * 4) * amplitude

      setSeedPosition({
        cx: seedX,
        cy: currentY,
        r: 6 + (scrollPercent * 20),
      })

      setSeedGlow(30 + (scrollPercent * 80))
      
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
          <feGaussianBlur stdDeviation="1.5" result="blur1" />
          <feGaussianBlur stdDeviation="4" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <linearGradient id="plasmaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f3cc4b" stopOpacity="0" />
          <stop offset="20%" stopColor="#f3cc4b" stopOpacity="0.9" />
          <stop offset="80%" stopColor="#f3cc4b" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#f3cc4b" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Camada de Aura (Glow de Fundo) */}
      <path
        d={pathD}
        fill="none"
        stroke="#d4af37"
        strokeWidth={10}
        style={{
          filter: "blur(20px)",
          opacity: pathOpacity * 0.4,
        }}
      />

      {/* CAMADA FRAGMENTADA (O segredo do plasma não ser contínuo) */}
      <path
        ref={pathRef}
        d={pathD}
        fill="none"
        stroke="url(#plasmaGradient)"
        strokeWidth={3}
        strokeLinecap="round"
        style={{
          filter: "url(#plasma-core)",
          // Aqui definimos traços longos com espaços grandes (Fragmentação)
          strokeDasharray: `${pathLength * 0.15} ${pathLength * 0.35}`, 
          strokeDashoffset: (performance.now() * 0.3), // Faz os fragmentos subirem rápido
          opacity: pathOpacity,
        }}
      />

      {/* Núcleo Incandescente (Linha branca central fina) */}
      <path
        d={pathD}
        fill="none"
        stroke="#fff"
        strokeWidth={0.5}
        style={{
          filter: "blur(1px)",
          strokeDasharray: `${pathLength * 0.05} ${pathLength * 0.45}`,
          strokeDashoffset: (performance.now() * 0.3),
          opacity: pathOpacity * 0.8,
        }}
      />

      {/* BOLINHA DE PLASMA */}
      <g style={{ filter: `drop-shadow(0 0 ${seedGlow}px #f3cc4b)` }}>
        <circle
          cx={seedPosition.cx}
          cy={seedPosition.cy}
          r={seedPosition.r}
          fill="#f3cc4b"
        />
        <circle
          cx={seedPosition.cx}
          cy={seedPosition.cy}
          r={seedPosition.r * 0.3}
          fill="#fff"
          style={{ filter: "blur(2px)" }}
        />
      </g>
    </svg>
  )
}
