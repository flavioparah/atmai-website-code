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
      const scrollPercent = Math.min(Math.max(scrollY / maxScroll, 0), 1)
      
      const width = window.innerWidth
      const height = window.innerHeight

      // 1. LINHA FLUIDA (Cálculo de Curva Suave)
      const steps = 12 // Menos passos com curvas geram um visual mais orgânico
      const amplitude = (width < 768 ? 50 : 100)
      let d = `M ${width / 2} 0`

      for (let i = 1; i <= steps; i++) {
        const ratio = i / steps
        const py = ratio * height
        const px = width / 2 + Math.sin(ratio * 4) * amplitude
        
        // Usamos Quadratic Curve (Q) para suavizar a "espinha dorsal" do plasma
        const prevRatio = (i - 0.5) / steps
        const midX = width / 2 + Math.sin(prevRatio * 4) * amplitude
        const midY = (prevRatio) * height
        
        d += ` Q ${midX} ${midY}, ${px} ${py}`
      }

      setPathD(d)
      setPathOpacity(0.15 + scrollPercent * 0.2)

      // 2. BOLINHA (Semente Energética)
      const startY = height * 0.15
      const endY = height * 0.9
      const currentY = startY + (endY - startY) * scrollPercent
      
      // Encontrar o X correspondente na curva para a bolinha seguir o caminho
      const yRatio = currentY / height
      const currentX = width / 2 + Math.sin(yRatio * 4) * amplitude

      setSeedPosition({
        cx: currentX,
        cy: currentY,
        r: 4 + (scrollPercent * 18), // Aumenta significativamente
      })

      setSeedGlow(20 + (scrollPercent * 60))
    }

    updateSpirit()
    window.addEventListener("scroll", updateSpirit)
    window.addEventListener("resize", updateSpirit)

    return () => {
      window.removeEventListener("scroll", updateSpirit)
      window.removeEventListener("resize", updateSpirit)
    }
  }, [])

  useEffect(() => {
    if (!pathRef.current) return
    try {
      const len = pathRef.current.getTotalLength()
      setPathLength(len)
    } catch { setPathLength(0) }
  }, [pathD])

  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const speed = -120 // Velocidade do plasma subindo

    function tick(now: number) {
      const dt = now - last
      last = now
      if (pathLength > 0) {
        offsetRef.current = (offsetRef.current + (dt / 1000) * speed) % pathLength
        if (pathRef.current) {
          // Dash mais longo e fluido para parecer feixes de energia
          const dashLen = pathLength * 0.25
          const gap = pathLength * 0.75
          pathRef.current.style.strokeDasharray = `${dashLen} ${gap}`
          pathRef.current.style.strokeDashoffset = `${offsetRef.current}`
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [pathLength])

  return (
    <svg className="fixed inset-0 w-full h-full z-[25] pointer-events-none" aria-hidden="true">
      <defs>
        <filter id="plasma-blur">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        {/* Gradiente para a energia não cortar bruscamente */}
        <linearGradient id="energyFade" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d4af37" stopOpacity="0" />
          <stop offset="20%" stopColor="#d4af37" stopOpacity="1" />
          <stop offset="80%" stopColor="#d4af37" stopOpacity="1" />
          <stop offset="100%" stopColor="#d4af37" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Camada 1: Brilho Difuso (Aura do Plasma) */}
      <path
        d={pathD}
        fill="none"
        stroke="url(#energyFade)"
        strokeWidth={6}
        style={{
          filter: "blur(12px)",
          opacity: pathOpacity * 0.4,
        }}
      />

      {/* Camada 2: Núcleo do Plasma (Animado e Fluido) */}
      <path
        ref={pathRef}
        d={pathD}
        fill="none"
        stroke="url(#energyFade)"
        strokeWidth={2}
        strokeLinecap="round"
        style={{
          filter: "url(#plasma-blur)",
          opacity: pathOpacity,
          transition: "opacity 0.5s ease",
        }}
      />

      {/* Semente Dourada (O "Core" da energia) */}
      <circle
        cx={seedPosition.cx}
        cy={seedPosition.cy}
        r={seedPosition.r}
        fill="#d4af37"
        style={{
          filter: `drop-shadow(0 0 ${seedGlow}px #d4af37) drop-shadow(0 0 ${seedGlow / 3}px #fff)`,
          transition: "r 0.15s ease-out, filter 0.15s ease-out",
          opacity: 0.9
        }}
      />
    </svg>
  )
}
