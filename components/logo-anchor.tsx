"use client"

import { useEffect, useState } from "react"

export function LogoAnchor() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    function handleScroll() {
      const scrollY = window.scrollY
      const maxScroll = document.body.scrollHeight - window.innerHeight
      const scrollPercent = Math.min(Math.max(scrollY / maxScroll, 0), 1)
      setIsScrolled(scrollPercent > 0.01)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div
      className="fixed left-1/2 z-20 pointer-events-none transition-all duration-[1200ms]"
      style={{
        top: isScrolled ? "6%" : "50%",
        transform: isScrolled
          ? "translate(-50%, -50%) scale(0.5)"
          : "translate(-50%, -50%) scale(1)",
        opacity: isScrolled ? 0.3 : 1,
        transitionTimingFunction: "cubic-bezier(0.19, 1, 0.22, 1)",
      }}
      aria-hidden="true"
    >
      <svg width="120" height="120" viewBox="0 0 200 200">
        <circle
          cx="100"
          cy="100"
          r="45"
          fill="none"
          stroke="rgba(212, 175, 55, 0.15)"
          strokeWidth="0.5"
        />
      </svg>
    </div>
  )
}
