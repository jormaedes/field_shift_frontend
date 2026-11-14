"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { Container } from "./container";

export function FinalCta() {
  const { t } = useLanguage();

  return (
    <section id="comecar" className="scroll-mt-24 border-t-2 border-solo-600 bg-canvas">
      <Container className="flex flex-col gap-8 py-16 sm:py-20 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="max-w-2xl font-display text-4xl leading-[1.04] tracking-[-0.015em] text-brand-900 sm:text-5xl">
            {t.cta.title}
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-brand-900/65 sm:text-base">
            {t.cta.text}
          </p>
        </div>

        <Link
          href="/dashboard"
          className="group inline-flex shrink-0 items-center justify-center gap-2 bg-brand-900 px-6 py-3.5 text-sm font-medium text-canvas transition-colors hover:bg-brand-700"
        >
          {t.cta.button}
          <ArrowRight
            aria-hidden
            className="size-4 transition-transform group-hover:translate-x-0.5"
          />
        </Link>
      </Container>
    </section>
  );
}
