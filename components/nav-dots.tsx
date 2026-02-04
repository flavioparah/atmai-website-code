"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface NavDotsProps {
  totalSections: number
}

export function NavDots({ totalSections }: NavDotsProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    function handleScroll() {
      const sections = document.querySelectorAll(".manifesto-section")
      const height = window.innerHeight

      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect()
        if (rect.top < height * 0.6 && rect.bottom > height * 0.4) {
          setActiveIndex(index)
        }
      })
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className="fixed right-6 top-1/2 -translate-y-1/2 z-[100]"
      aria-label="Navegação por seções"
    >
      {Array.from({ length: totalSections }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "w-1 h-1 rounded-full my-6 transition-all duration-500",
            activeIndex === index
              ? "bg-gold scale-[3]"
              : "bg-white/20"
          )}
          aria-current={activeIndex === index ? "true" : undefined}
        />
      ))}
    </nav>
  )
}
