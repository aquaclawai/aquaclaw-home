'use client'

import { useState } from 'react'
import type en from '../../../dictionaries/en.json'

interface DownloadSectionProps {
  dict: typeof en['aquarium']['download']
}

const INSTALL_CMD = 'npx @aquaclawai/aquarium'

export function DownloadSection({ dict }: DownloadSectionProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(INSTALL_CMD)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div>
      <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8 text-center">
        {dict.heading}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Aquarium Local card */}
        <div className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">
          <div className="text-4xl font-mono text-primary select-none" aria-hidden="true">
            &gt;_
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <h3 className="font-display text-xl font-semibold text-foreground">
              {dict.localTitle}
            </h3>
            <p className="font-sans text-sm text-foreground/70">
              {dict.localDescription}
            </p>
          </div>
          <button
            onClick={handleCopy}
            className="group flex items-center justify-between px-4 py-3 rounded-lg bg-foreground/5 border border-foreground/10 hover:border-primary/40 transition-colors cursor-pointer"
          >
            <code className="font-mono text-sm text-foreground">{INSTALL_CMD}</code>
            <span className="ml-3 text-xs font-sans text-foreground/50 group-hover:text-primary transition-colors">
              {copied ? '✓ Copied' : 'Copy'}
            </span>
          </button>
        </div>

        {/* Aquarium Cloud card */}
        <div className="bg-card rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">
          <div className="text-4xl select-none" aria-hidden="true">
            ☁️
          </div>
          <div className="flex flex-col gap-2 flex-1">
            <h3 className="font-display text-xl font-semibold text-foreground">
              {dict.cloudTitle}
            </h3>
            <p className="font-sans text-sm text-foreground/70">
              {dict.cloudDescription}
            </p>
          </div>
          <a
            href="https://platform.aquaclaw.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 rounded-pill font-semibold text-center bg-accent text-white transition-transform hover:scale-105"
          >
            {dict.cloudCta}
          </a>
        </div>
      </div>

      {/* Coming soon notice */}
      <p className="text-center text-sm text-foreground/50 mt-6">
        {dict.comingSoon}
      </p>
    </div>
  )
}
