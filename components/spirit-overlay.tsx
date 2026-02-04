"use client"

import { useEffect, useState } from "react"

export function SpiritOverlay() {
  const [pathD, setPathD] = useState("M 0 0")
  const [seedPosition, setSeedPosition] = useState({ cx: 0, cy: 0, r: 3 })
  const [pathOpacity, setPathOpacity] = useState(0)
  const [seedGlow, setSeedGlow] = useState(15)

  useEffect(() => {
    function updateSpirit() {
      const scrollY = window.scrollY
      const maxScroll = document.body.scrollHeight - window.innerHeight
      const scrollPercent = Math.min(Math.max(scrollY / maxScroll, 0), 1)
      const width = window.innerWidth
      const height = window.innerHeight

      const steps = 40
      const amplitude = (width < 768 ? 40 : 80) * Math.sin(scrollPercent * Math.PI)
      const pts: string[] = []

      for (let i = 0; i <= steps; i++) {
        const ratio = i / steps
        const py = ratio * height
        const px = width / 2 + Math.sin(ratio * 5 + scrollPercent * 8) * amplitude
        pts.push(`${px},${py}`)
      }

      setPathD(`M ${pts[0]} L ${pts.join(" L ")}`)
      setPathOpacity(scrollPercent > 0.05 ? 0.1 : 0)

      const currentY = height * 0.4 + scrollPercent * (height * 0.5)
      const yRatio = currentY / height
      const currentX = width / 2 + Math.sin(yRatio * 5 + scrollPercent * 8) * amplitude

      setSeedPosition({
        cx: currentX,
        cy: currentY,
        r: 3 + scrollPercent * 10,
      })

      // Increase glow intensity as scroll progresses (15px to 60px)
      setSeedGlow(15 + scrollPercent * 45)
    }

    updateSpirit()
    window.addEventListener("scroll", updateSpirit)
    window.addEventListener("resize", updateSpirit)

    return () => {
      window.removeEventListener("scroll", updateSpirit)
      window.removeEventListener("resize", updateSpirit)
    }
  }, [])

  return (
    <svg className="fixed inset-0 w-full h-full z-[25] pointer-events-none" aria-hidden="true">
      <path
        d={pathD}
        fill="none"
        stroke="#d4af37"
        strokeWidth={1}
        style={{
          filter: "drop-shadow(0 0 5px #d4af37)",
          opacity: pathOpacity,
          transition: "opacity 0.8s ease",
        }}
      />
      <circle
        cx={seedPosition.cx}
        cy={seedPosition.cy}
        r={seedPosition.r}
        fill="#d4af37"
        style={{
          filter: `drop-shadow(0 0 ${seedGlow}px #d4af37) drop-shadow(0 0 ${seedGlow * 0.5}px #fff)`,
          transition: "filter 0.1s ease-out",
        }}
      />
    </svg>
  )
}
