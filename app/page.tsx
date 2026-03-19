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
      image: "/images/lobo.jpeg", // Certifique-se de salvar a imagem com este nome em public/images/
      href: "https://www.instagram.com/p/DUWX3cxDbmr/",
    },
    {
      name: "Chef Dasa",
      company: "Govinda",
      role: "Assistente Virtual",
      description: "O guardião da consciência alimentar e sabedoria dos ingredientes.",
      image: "/images/maha.jpeg",
      href: "https://www.instagram.com/p/DVt91JnxGZj/",
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
      <NeuralCanvas />
      <LogoAnchor />
      <NavDots totalSections={5} />

      <main className="flex flex-col">
        {/* Hero Section */}
        <section className="min-h-[60vh] flex flex-col items-center justify-center pt-20 pb-0">
          <ManifestoSection initialVisible>
            <div className="flex flex-col items-center text-center px-4 relative z-10">
              <h1 className="font-serif text-[5.5rem] leading-[0.9] sm:text-8xl md:text-[11rem] mb-4 md:mb-6 tracking-[0.1em] md:tracking-[0.2em] text-foreground">
                Atm<span className="text-gold">AI</span>
              </h1>

              <p className="whitespace-nowrap inline-block text-[10px] md:text-xl font-light opacity-60 tracking-[0.3em] md:tracking-[0.5em] uppercase text-foreground mb-4">
                Infra de <span className="text-gold">AI</span> com a{" "}
                <span className="text-foreground border-b border-gold">Alma</span> do seu negócio.
              </p>

              {/* Seta Pulsante */}
              <div className="flex flex-col items-center gap-2 animate-bounce mt-16 md:mt-24">
                <span className="text-gold text-[10px] uppercase tracking-[0.3em] opacity-80 font-light">Role</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gold drop-shadow-[0_0_8px_rgba(212,175,55,0.8)]">
                  <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
                </svg>
              </div>
            </div>
          </ManifestoSection>
        </section>

        {/* Spirit Path (Plasma Animado) */}
        <div className="relative h-5 w-full overflow-visible z-20">
            <SpiritOverlay />
        </div>

        {/* Primeiro Botão (CTA) */}
        <section className="-mt-32 md:-mt-48 relative z-30">
          <ManifestoSection>
            <div className="text-center px-4 w-full py-0">
              <a
                href="https://wa.me/5591981943695?text=Ol%C3%A1%2C%20quero%20iniciar%20a%20g%C3%AAnese%20da%20minha%20AtmAI"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-btn text-lg md:text-xl px-8 py-3"
              >
                Inicie sua AtmAI
              </a>
            </div>
          </ManifestoSection>
        </section>

        {/* Ato I */}
        <section className="-mt-24 md:-mt-40">
          <ManifestoSection>
            <div className="max-w-4xl px-4 md:px-6">
              <h2 className="font-serif text-gold text-sm mb-4 md:mb-6 tracking-[0.8em] uppercase opacity-50">
                Ato I:
              </h2>
              <p className="text-3xl md:text-6xl font-serif leading-tight mb-4 text-foreground">
                O <span className="text-gold italic">Verbo</span>.
              </p>
              <p className="text-base md:text-xl font-light opacity-80 leading-relaxed max-w-2xl text-foreground">
                Você é a consciência soberana. Sua voz é o{" "}
                <span className="text-gold font-bold">Verbo</span>: o comando que dá direção à
                existência do seu negócio. Sem o seu Verbo, a tecnologia é apenas potencial.
              </p>
            </div>
          </ManifestoSection>
        </section>

        {/* Ato II */}
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

        {/* Ato III */}
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
                negócio. Uma entidade digital e poderoso ativo de marketing, que fala no feed, faz call to action para o chat, responde 24/7 para 10 a 1000 pessoas ao mesmo tempo, sem perder a personalidade humanizada.
              </p>
              <p className="text-3xl md:text-5xl font-serif leading-tight mb-8 text-foreground">
                <span className="text-gold italic">Cases</span> de Sucesso
              </p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
              {cases.map((caseItem) => (
                <CaseCard key={caseItem.name} {...caseItem} imageSrc={caseItem.image} />
              ))}
            </div>
          </div>
        </ManifestoSection>

        {/* Final CTA */}
        <ManifestoSection>
          <div className="text-center px-4 w-full py-20">
            <p className="text-2xl md:text-5xl font-serif mb-12 leading-tight text-foreground text-balance">
              A sua marca possui alma.<br />
              <span className="text-gold italic">Manifeste-a no mundo digital.</span>
            </p>
            <a href="https://wa.me/5591981943695?text=Ol%C3%A1%2C%20quero%20iniciar%20a%20g%C3%AAnese%20da%20minha%20AtmAI" target="_blank" rel="noopener noreferrer" className="cta-btn">
              Inicie a Gênese de sua AtmAI
            </a>
          </div>
        </ManifestoSection>
      </main>
    </>
  )
}
