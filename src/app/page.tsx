"use client";

import { useLanguage } from "@/components/language-provider";
import { DataSources } from "@/components/landing/data-sources";
import { FinalCta } from "@/components/landing/final-cta";
import { Hero } from "@/components/landing/hero";
import { Limits } from "@/components/landing/limits";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { Statement } from "@/components/landing/statement";
import { Steps } from "@/components/landing/steps";
import { Strategies } from "@/components/landing/strategies";

export default function Home() {
  const { t } = useLanguage();

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:bg-brand-900 focus:px-4 focus:py-2 focus:text-sm focus:text-canvas"
      >
        {t.a11y.skipToContent}
      </a>

      <div className="relative flex-1">
        <SiteHeader overlay />

        <main id="conteudo">
          <Hero />
          <Statement />
          <Steps />
          <Strategies />
          <DataSources />
          <Limits />
          <FinalCta />
        </main>
      </div>

      <SiteFooter />
    </>
  );
}
