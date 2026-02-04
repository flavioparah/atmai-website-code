"use client"

import React from "react"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface ManifestoSectionProps {
  children: React.ReactNode
  className?: string
  initialVisible?: boolean
}

export function ManifestoSection({ children, className, initialVisible = false }: ManifestoSectionProps) {
  const [progress, setProgress] = useState(initialVisible ? 1 : 0)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    function handleScroll() {
      if (!sectionRef.current) return
      const rect = sectionRef.current.getBoundingClientRect()
      const height = window.innerHeight
      
      // Calculate progress: 0 when section enters viewport, 1 when fully visible
      // Start transition when top of section is at 80% of viewport height
      // Complete when top reaches 30% of viewport height
      const startPoint = height * 0.85
      const endPoint = height * 0.35
      
      if (rect.top >= startPoint) {
        setProgress(0)
      } else if (rect.top <= endPoint) {
        setProgress(1)
      } else {
        const p = 1 - (rect.top - endPoint) / (startPoint - endPoint)
        setProgress(Math.max(0, Math.min(1, p)))
      }
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Calculate blur and opacity based on progress
  const blurAmount = Math.max(0, 12 * (1 - progress))
  const opacity = progress
  const translateY = 40 * (1 - progress)

  return (
    <section
      ref={sectionRef}
      className={cn(
        "manifesto-section min-h-screen flex items-center justify-center relative z-10 py-24 px-6",
        className
      )}
      style={{
        opacity: opacity,
        filter: `blur(${blurAmount}px)`,
        transform: `translateY(${translateY}px)`,
        transition: "opacity 0.1s ease-out, filter 0.1s ease-out, transform 0.1s ease-out",
      }}
    >
      {children}
    </section>
  )
}
