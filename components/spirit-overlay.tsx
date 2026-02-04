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

      const steps = 40
      const amplitude = (width < 768 ? 40 : 80) * Math.sin(scrollPercent * Math.PI)
      const pts: string[] = []

      for (let i = 0; i <= steps; i++) {
        const ratio = i / steps
        const py = ratio * height
        const px = width / 2 + Math.sin(ratio * 5 + scrollPercent * 8) * amplitude
        pts.push(`${px},${py}`)
      }

      const newD = `M ${pts[0]} L ${pts.join(" L ")}`
      setPathD(newD)
      setPathOpacity(scrollPercent > 0.05 ? 0.12 : 0)
      const currentY = height * 0.4 + scrollPercent * (height * 0.5)
      const yRatio = currentY / height
      const currentX = width / 2 + Math.sin(yRatio * 5 + scrollPercent * 8) * amplitude

      setSeedPosition({
        cx: currentX,
        cy: currentY,
        r: 3 + scrollPercent * 10,
      })

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

  useEffect(() => {
    if (!pathRef.current) return
    const id = setTimeout(() => {
      try {
        const len = pathRef.current?.getTotalLength() ?? 0
        setPathLength(len)
      } catch {
        setPathLength(0)
      }
    }, 0)
    return () => clearTimeout(id)
  }, [pathD])

  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const speed = 80

    function tick(now: number) {
      const dt = now - last
      last = now
      if (pathLength > 0) {
        offsetRef.current = (offsetRef.current + (dt / 1000) * speed) % pathLength
        if (pathRef.current) {
          const dashLen = Math.max(Math.round(pathLength * 0.12), 8)
          const gap = Math.max(Math.round(pathLength * 0.04), 6)
          pathRef.current.style.strokeDasharray = `${dashLen} ${gap}`
          pathRef.current.style.strokeDashoffset = `${-offsetRef.current}`
        }
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [pathLength, pathD])

  return (
    <svg className="fixed inset-0 w-full h-full z-[25] pointer-events-none" aria-hidden="true">
      <path
        ref={pathRef}
        d={pathD}
        fill="none"
        stroke="#d4af37"
        strokeWidth={1.2}
        strokeLinecap="round"
        style={{
          filter: "drop-shadow(0 0 8px rgba(212,175,55,0.8))",
          opacity: pathOpacity,
          transition: "opacity 0.4s ease",
        }}
      />

      <path
        d={pathD}
        fill="none"
        stroke="rgba(212,175,55,0.6)"
        strokeWidth={0.6}
        strokeLinecap="round"
        style={{
          filter: "blur(2px)",
          opacity: pathOpacity ? pathOpacity * 0.8 : 0,
          transition: "opacity 0.4s ease",
        }}
      />

      <circle
        cx={seedPosition.cx}
        cy={seedPosition.cy}
        r={seedPosition.r}
        fill="#d4af37"
        style={{
          filter: `drop-shadow(0 0 ${seedGlow}px #d4af37) drop-shadow(0 0 ${seedGlow *
            0.5}px #fff)`,
          transition: "filter 0.12s ease-out, r 0.12s ease-out",
        }}
      />
    </svg>
  )
}