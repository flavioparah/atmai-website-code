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
    function updateSpirit() {
      const scrollY = window.scrollY
      const maxScroll = document.body.scrollHeight - window.innerHeight
      // Normaliza o scroll, mas mantém um valor mínimo para a animação inicial
      const scrollPercent = Math.min(Math.max(scrollY / maxScroll, 0), 1)
      
      const width = window.innerWidth
      const height = window.innerHeight

      const steps = 50
      // A amplitude diminui conforme desce para dar um efeito de "foco"
      const amplitude = (width < 768 ? 30 : 60)
      const pts: string[] = []

      for (let i = 0; i <= steps; i++) {
        const ratio = i / steps
        const py = ratio * height
        // O movimento lateral simula um fluido/plasma
        const px = width / 2 + Math.sin(ratio * 4 + Date.now() * 0.002) * amplitude * (1 - ratio * 0.5)
        pts.push(`${px},${py}`)
      }

      const newD = `M ${pts[0]} L ${pts.join(" L ")}`
      setPathD(newD)
      
      // Sempre visível no início, indicando o scroll
      setPathOpacity(0.4 - scrollPercent * 0.3)

      // A semente (bolinha) agora flutua na parte superior/média para puxar o olhar para baixo
      const seedY = height * 0.2 + (Math.sin(Date.now() * 0.001) * 20)
      const seedRatio = seedY / height
      const seedX = width / 2 + Math.sin(seedRatio * 4 + Date.now() * 0.002) * amplitude * (1 - seedRatio * 0.5)

      setSeedPosition({
        cx: seedX,
        cy: seedY,
        r: 4 + Math.sin(Date.now() * 0.003) * 2, // Pulsação suave
      })

      setSeedGlow(20 + Math.sin(Date.now() * 0.002) * 10)
    }

    // Loop de animação para o efeito de plasma não depender apenas do scroll
    const animId = setInterval(updateSpirit, 16)
    window.addEventListener("scroll", updateSpirit)
    window.addEventListener("resize", updateSpirit)

    return () => {
      clearInterval(animId)
      window.removeEventListener("scroll", updateSpirit)
      window.removeEventListener("resize", updateSpirit)
    }
  }, [])

  useEffect(() => {
    if (!pathRef.current) return
    const len = pathRef.current.getTotalLength()
    setPathLength(len)
  }, [pathD])

  return (
    <svg className="fixed inset-0 w-full h-full z-[25] pointer-events-none" aria-hidden="true">
      <defs>
        {/* Gradiente para a linha sumir no final da tela */}
        <linearGradient id="plasmaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d4af37" stopOpacity="0.8" />
          <stop offset="50%" stopColor="#d4af37" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Brilho de fundo (Glow) */}
      <path
        d={pathD}
        fill="none"
        stroke="url(#plasmaGradient)"
        strokeWidth={4}
        style={{
          filter: "blur(8px)",
          opacity: pathOpacity * 0.5,
          transition: "opacity 0.5s ease",
        }}
      />

      {/* Linha Principal com Dash animado descendo */}
      <path
        ref={pathRef}
        d={pathD}
        fill="none"
        stroke="url(#plasmaGradient)"
        strokeWidth={1.5}
        strokeDasharray="20 150" // Cria pequenos segmentos de plasma
        style={{
          strokeDashoffset: (Date.now() * 0.1) % 1000, // Faz o plasma "descer"
          filter: "drop-shadow(0 0 5px #d4af37)",
          opacity: pathOpacity,
        }}
      />

      {/* Semente (Bolinha Dourada) */}
      <circle
        cx={seedPosition.cx}
        cy={seedPosition.cy}
        r={seedPosition.r}
        fill="#d4af37"
        style={{
          filter: `drop-shadow(0 0 ${seedGlow}px #d4af37) drop-shadow(0 0 ${seedGlow / 2}px #fff)`,
          opacity: pathOpacity + 0.2,
          transition: "filter 0.2s ease",
        }}
      />
    </svg>
  )
}
