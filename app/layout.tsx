import React from "react"
import type { Metadata } from 'next'
import { Inter, Cinzel } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _inter = Inter({ subsets: ["latin"] })
const _cinzel = Cinzel({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: 'AtmAI | A IA com a Alma do seu Negócio',
  description: 'A união da sua consciência pessoal com a inteligência artificial impessoal gera a AtmAI: a personificação da alma do seu negócio.',
  generator: 'v0.app',
  icons: {
    icon: [
       {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-pt">
      <body className="font-sans antialiased bg-background text-foreground overflow-x-hidden scroll-smooth">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
