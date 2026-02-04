"use client"

import { useEffect, useRef, useState } from "react"

export function SpiritOverlay() {
  const [pathD, setPathD] = useState("M 0 0")
  const [seedPosition, setSeedPosition] = useState({ cx: 0, cy: 40, r: 4 })
  const [pathOpacity, setPathOpacity] = useState(0.18)
  const [seedGlow, setSeedGlow] = useState(20)

  const pathRef = useRef<SVGPathElement | null>(null)
  const [pathLength, setPathLength] = useState(0)
  const offsetRef = useRef(0)

  // store base points from scroll/resize; RAF will apply time-based wobble to produce plasma effect
  const basePointsRef = useRef<Array<{ x: number; y: number }>>([])
  const scrollPercentRef = useRef(0)
  const amplitudeRef = useRef(60)

  // find hero H1 to position the seed above the "M"
  function computeSeedFromHero() {
    const h1 = document.querySelector("h1.font-serif")
    if (h1) {
      const rect = h1.getBoundingClientRect()
      const cx = rect.left + rect.width * 0.12 // slight offset toward the left where "M" sits
      const cy = window.innerHeight * 0.15 // a little below top so seed is just above hero M
      return { cx, cy: Math.max(32, cy), r: 4 }
    }
    // fallback center-top
    return { cx: window.innerWidth / 2, cy: window.innerHeight * 0.12, r: 4 }
  }

  useEffect(() => {
    function updateBasePoints() {
      const scrollY = window.scrollY
      const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1)
      const scrollPercent = Math.min(Math.max(scrollY / maxScroll, 0), 1)
      scrollPercentRef.current = scrollPercent

      const width = window.innerWidth
      const height = window.innerHeight

      // seed near hero
      const seed = computeSeedFromHero()
      setSeedPosition(seed)

      const steps = 40
      // amplitude smaller on small screens
      const baseAmp = width < 768 ? 36 : 80
      amplitudeRef.current = baseAmp * (0.6 + 0.4 * Math.sin(scrollPercent * Math.PI))

      const pts: Array<{ x: number; y: number }> = []
      for (let i = 0; i <= steps; i++) {
        const ratio = i / steps
        const py = ratio * (height * 1.6) // extend beyond viewport for a long flowing path
        const px =
          seed.cx +
          Math.sin(ratio * 5 + scrollPercent * 8) * (amplitudeRef.current * (0.5 + 0.5 * ratio))
        pts.push({ x: px, y: seed.cy + py })
      }

      basePointsRef.current = pts

      // make the path visible when page loads (and slightly stronger after tiny scroll)
      setPathOpacity(scrollPercent > 0.01 ? 0.22 : 0.18)
      setSeedGlow(15 + scrollPercent * 55)
    }

    updateBasePoints()
    window.addEventListener("scroll", updateBasePoints, { passive: true })
    window.addEventListener("resize", updateBasePoints)
    return () => {
      window.removeEventListener("scroll", updateBasePoints)
      window.removeEventListener("resize", updateBasePoints)
    }
  }, [])

  // compute wiggled path from basePointsRef and time, update pathD
  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const speed = 70 // flow speed for dash
    function tick(now: number) {
      const dt = now - last
      last = now

      // animate stroke offset for flowing dashes
      if (pathLength > 0) {
        offsetRef.current = (offsetRef.current + (dt / 1000) * speed) % pathLength
        if (pathRef.current) {
          const dashLen = Math.max(Math.round(pathLength * 0.08), 10)
          const gap = Math.max(Math.round(pathLength * 0.02), 6)
          pathRef.current.style.strokeDasharray = `${dashLen} ${gap}`
          pathRef.current.style.strokeDashoffset = `${-offsetRef.current}`
        }
      }

      // build wiggled path (plasma-like) from base points
      const pts = basePointsRef.current
      if (pts && pts.length > 0) {
        const t = now / 800 // time factor
        const amp = amplitudeRef.current * 0.25
        const wiggled = pts
          .map((p, i) => {
            const ratio = i / Math.max(1, pts.length - 1)
            // multi-frequency wobble for more organic plasma
            const wob =
              Math.sin(ratio * 6 + t * 1.2) * amp * (0.6 + 0.4 * Math.sin(t * 0.7 + ratio * 4)) +
              Math.sin(ratio * 12 + t * 0.4) * (amp * 0.12)
            return `${p.x + wob},${p.y}`
          })
          .join(" L ")

        const start = `${pts[0].x},${pts[0].y}`
        setPathD(`M ${start} L ${wiggled}`)
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [pathLength])

  // update path length when path is rendered
  useEffect(() => {
    if (!pathRef.current) return
    // small timeout to ensure path rendered
    const id = setTimeout(() => {
      try {
        const len = pathRef.current?.getTotalLength() ?? 0
        setPathLength(len)
      } catch {
        setPathLength(0)
      }
    }, 50)
    return () => clearTimeout(id)
  }, [pathD])

  return (
    <svg className="fixed inset-0 w-full h-full z-[25] pointer-events-none" aria-hidden="true">
      <defs>
        <linearGradient id="goldGrad" x1="0" x2="1">
          <stop offset="0%" stopColor="#f6e4a8" stopOpacity="1" />
          <stop offset="50%" stopColor="#d4af37" stopOpacity="1" />
          <stop offset="100%" stopColor="#ffd77a" stopOpacity="1" />
        </linearGradient>

        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* soft plasma core */}
      <path
        d={pathD}
        fill="none"
        stroke="url(#goldGrad)"
        strokeWidth={8}
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          filter: "blur(6px)",
          opacity: pathOpacity * 0.7,
          mixBlendMode: "screen",
          transition: "opacity 0.3s ease",
        }}
      />

      {/* moving dash (visible flow) */}
      <path
        ref={pathRef}
        d={pathD}
        fill="none"
        stroke="url(#goldGrad)"
        strokeWidth={1.6}
        strokeLinecap="round"
        style={{
          filter: "drop-shadow(0 0 8px rgba(212,175,55,0.9))",
          opacity: pathOpacity,
          transition: "opacity 0.3s ease",
        }}
      />

      {/* inner brighter core */}
      <path
        d={pathD}
        fill="none"
        stroke="#fff7e6"
        strokeWidth={0.8}
        strokeLinecap="round"
        style={{
          filter: "blur(1px)",
          opacity: pathOpacity ? pathOpacity * 0.9 : 0,
          transition: "opacity 0.25s ease",
        }}
      />

      {/* seed (bolinha) */}
      <circle
        cx={seedPosition.cx}
        cy={seedPosition.cy}
        r={seedPosition.r}
        fill="#d4af37"
        style={{
          filter: `drop-shadow(0 0 ${seedGlow}px #d4af37) drop-shadow(0 0 ${seedGlow *
            0.6}px #fff)`,
          transition: "filter 0.12s ease-out, r 0.12s ease-out",
        }}
      />
    </svg>
  )
}
