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

      // 1. LINHA FIXA (Geometria baseada na tela, mas estável)
      const steps = 40
      const amplitude = (width < 768 ? 40 : 80)
      const pts: string[] = []

      for (let i = 0; i <= steps; i++) {
        const ratio = i / steps
        const py = ratio * height
        // Seno fixo baseado na posição vertical (ratio), sem o fator tempo
        const px = width / 2 + Math.sin(ratio * 5) * amplitude
        pts.push(`${px},${py}`)
      }

      const newD = `M ${pts[0]} L ${pts.join(" L ")}`
      setPathD(newD)
      
      // Opacidade da linha aumenta sutilmente com o scroll
      setPathOpacity(0.1 + scrollPercent * 0.15)

      // 2. BOLINHA (Semente Espiritual)
      // Começa em 20% da altura e termina em 85% conforme o scroll desce
      const startY = height * 0.2
      const endY = height * 0.85
      const currentY = startY + (endY - startY) * scrollPercent
      
      const yRatio = currentY / height
      const currentX = width / 2 + Math.sin(yRatio * 5) * amplitude

      setSeedPosition({
        cx: currentX,
        cy: currentY,
        // Cresce de 3px para até 18px
        r: 3 + (scrollPercent * 15),
      })

      // O brilho aumenta drasticamente (de 15 para 60)
      setSeedGlow(15 + (scrollPercent * 45))
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
    } catch {
      setPathLength(0)
    }
  }, [pathD])

  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const speed = -60 // NEGATIVO para o fluxo subir (ao contrário)

    function tick(now: number) {
      const dt = now - last
      last = now
      if (pathLength > 0) {
        // O offset negativo faz o efeito de "partículas" subir pela linha fixa
        offsetRef.current = (offsetRef.current + (dt / 1000) * speed) % pathLength
        if (pathRef.current) {
          const dashLen = Math.max(Math.round(pathLength * 0.1), 10)
          const gap = 40 
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
      {/* Filtro de Plasma para a Linha */}
      <defs>
        <filter id="plasma-glow">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Linha de fundo (Rastro estático translúcido) */}
      <path
        d={pathD}
        fill="none"
        stroke="#d4af37"
        strokeWidth={0.5}
        style={{ opacity: pathOpacity * 0.5 }}
      />

      {/* Linha animada (Fluxo invertido) */}
      <path
        ref={pathRef}
        d={pathD}
        fill="none"
        stroke="#d4af37"
        strokeWidth={1.2}
        strokeLinecap="round"
        style={{
          filter: "url(#plasma-glow)",
          opacity: pathOpacity,
          transition: "opacity 0.4s ease",
        }}
      />

      {/* Semente Dourada (Aumenta e Brilha com Scroll) */}
      <circle
        cx={seedPosition.cx}
        cy={seedPosition.cy}
        r={seedPosition.r}
        fill="#d4af37"
        style={{
          filter: `drop-shadow(0 0 ${seedGlow}px #d4af37) drop-shadow(0 0 ${seedGlow / 2}px #fff)`,
          transition: "r 0.1s ease-out, filter 0.1s ease-out",
        }}
      />
    </svg>
  )
}
