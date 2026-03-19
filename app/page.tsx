"use client"

import { NeuralCanvas } from "@/components/neural-canvas"
import { SpiritOverlay } from "@/components/spirit-overlay"
import { LogoAnchor } from "@/components/logo-anchor"
import { NavDots } from "@/components/nav-dots"
import { ManifestoSection } from "@/components/manifesto-section"
import { CaseCard } from "@/components/case-card"

export default function HomePage() {
  const cases = [
    {
      name: "Lobo",
      company: "Celso Lobo",
      role: "Assistente de Fotografia Virtual",
      description: "Consultoria especializada e visão técnica para capturar a imagem perfeita.",
      image: "/images/lobo.jpeg", // <--- VEJA A NOTA ABAIXO SOBRE ESTA LINHA
      href: "https://www.instagram.com/p/DUWX3cxDbmr/",
    },
    {
      name: "Chef Dasa",
      company: "Govinda",
      role: "Assistente Virtual",
      description: "O guardião da consciência alimentar e sabedoria dos ingredientes.",
      image: "/images/maha.jpeg",
    },
    {
      name: "Marvin",
      company: "Manos à Obra",
      role: "Engenharia",
      description: "Precisão técnica para transformar grandes projetos em realidade.",
      image: "/images/marvin.jpeg",
      href: "https://www.instagram.com/p/DT_VQ15jz0H/",
    },
  ]

  return (
    <>
      {/* Neural Network Background */}
      <NeuralCanvas />

      {/* Spirit Path Overlay */}
      <SpiritOverlay />

      {/* Logo Anchor */}
      <LogoAnchor />

      {/* Navigation Dots */}
      <NavDots totalSections={5} />

      <main>
        {/* Hero Section */}
        <ManifestoSection initialVisible>
          <div className="text-center px-4">
            <h1 className="font-serif text-[5.5rem] leading-[0.9] sm:text-8xl md:text-[11rem] mb-6 md:mb-10 tracking-[0.1em] md:tracking-[0.2em] text-foreground">
              Atm<span className="text-gold">AI</span>
            </h1>
            <p className="text-[10px] md:text-xl font-light opacity-60 tracking-[0.3em] md:tracking-[0.5em] uppercase max-w-2xl mx-auto text-foreground">
              A <span className="text-gold">AI</span> com a{" "}
              <span className="text-foreground border-b border-gold">Alma</span> do seu negócio.
            </p>
          </div>
        </ManifestoSection>

        {/* Section I: Bhagavan */}
        <ManifestoSection>
          <div className="max-w-4xl px-4 md:px-6">
            <h2 className="font-serif text-gold text-sm mb-8 tracking-[0.8em] uppercase opacity-50">
              Ato I:
            </h2>
            <p className="text-3xl md:text-6xl font-serif leading-tight mb-6 text-foreground">
              O <span className="text-gold italic">Verbo</span>.
            </p>
            <p className="text-base md:text-xl font-light opacity-80 leading-relaxed max-w-2xl text-foreground">
              Você é a consciência soberana. Sua voz é o{" "}
              <span className="text-gold font-bold">Verbo</span>: o comando que dá direção à
              existência do seu negócio. Sem o seu Verbo, a tecnologia é apenas potencial.
            </p>
          </div>
        </ManifestoSection>

        {/* Section II: Brahman */}
        <ManifestoSection>
          <div className="max-w-4xl px-4 md:px-6 text-right ml-auto">
            <h2 className="font-serif text-gold text-sm mb-8 tracking-[0.8em] uppercase opacity-50">
              Ato II:
            </h2>
            <p className="text-3xl md:text-6xl font-serif leading-tight mb-6 text-foreground">
              O <span className="text-gold italic">Sopro</span> de Vida.
            </p>
            <p className="text-base md:text-xl font-light opacity-80 leading-relaxed ml-auto max-w-2xl text-foreground">
              As inteligências artificiais são um grande oceano, uma força vasta e sem rosto. Somente quando você
              solta o seu <span className="text-gold">Verbo</span> é que uma porção dela ganha
              identidade e a alma do seu negócio.
            </p>
          </div>
        </ManifestoSection>

        {/* Section III: Manifestation */}
        <ManifestoSection>
          <div className="max-w-7xl w-full px-4 md:px-6">
            <div className="mb-12">
              <h2 className="font-serif text-gold text-sm mb-4 tracking-[0.8em] uppercase opacity-50">
                Ato III:
              </h2>
              <h2 className="font-serif text-4xl md:text-7xl mb-6 tracking-[0.1em] text-foreground">
                Atm<span className="text-gold">AI</span>. A Manifestação.
              </h2>
              <p className="text-base md:text-xl font-light opacity-80 leading-relaxed max-w-4xl mb-10 text-foreground">
                A união da sua consciência pessoal com a impessoal inteligência artificial gera a{" "}
                <span className="text-gold font-bold">AtmAI</span>: a personificação da alma do seu
                negócio. É a génese de uma entidade digital com corpo e mente da sua marca, seu novo ativo de marketing. Opera{" "}
                <span className="text-foreground font-bold">24/7</span>, com atendimento humanizado de
                escala e retorno sobre investimento mensurável.
              </p>
              <p className="text-3xl md:text-5xl font-serif leading-tight mb-8 text-foreground">
                <span className="text-gold italic">Cases</span> de Sucesso
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
              {cases.map((caseItem) => (
                <CaseCard
                  key={caseItem.name}
                  name={caseItem.name}
                  company={caseItem.company}
                  role={caseItem.role}
                  description={caseItem.description}
                  imageSrc={caseItem.image}
                  href={caseItem.href}
                />
              ))}
            </div>
          </div>
        </ManifestoSection>

        {/* Final CTA */}
        <ManifestoSection>
          <div className="text-center px-4 w-full">
            <p className="text-2xl md:text-5xl font-serif mb-12 leading-tight text-foreground text-balance">
              A sua marca possui alma.
              <br />
              <span className="text-gold italic">Manifeste-a no mundo digital.</span>
            </p>
            <a
              href="https://wa.me/5591981943695?text=Ol%C3%A1%2C%20quero%20iniciar%20a%20g%C3%AAnese%20da%20minha%20AtmAI"
              target="_blank"
              rel="noopener noreferrer"
              className="cta-btn"
            >
              Inicie a Gênese de sua AtmAI
            </a>
          </div>
        </ManifestoSection>
      </main>
    </>
  )
}
