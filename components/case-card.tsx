import Image from "next/image"
import Link from "next/link"

interface CaseCardProps {
  name: string
  company: string
  role: string
  description: string
  imageSrc?: string
  href?: string
}

export function CaseCard({ name, company, role, description, imageSrc, href }: CaseCardProps) {
  const Wrapper = href ? Link : "div"
  const wrapperProps = href
    ? { href, target: "_blank" as const, rel: "noopener noreferrer" }
    : {}

  return (
    <Wrapper {...wrapperProps} className="case-card group cursor-pointer">
      <div className="avatar-frame relative">
        {imageSrc ? (
          <Image
            src={imageSrc || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover object-top"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-[#111] to-[#050505] text-gold font-serif text-xs text-center p-5">
            <div>
              MANIFESTAÇÃO
              <span className="text-xl block mt-2 text-gold">{name.toUpperCase()}</span>
            </div>
          </div>
        )}
      </div>
      <div className="p-6 md:p-8 bg-[rgba(10,10,10,0.95)] flex-grow">
        <h3 className="font-serif text-gold text-xl md:text-2xl mb-2">{name}</h3>
        <p className="text-[9px] tracking-[0.3em] opacity-40 uppercase mb-4">
          {company} | {role}
        </p>
        <p className="text-xs font-light opacity-60 italic">{description}</p>
      </div>
    </Wrapper>
  )
}
