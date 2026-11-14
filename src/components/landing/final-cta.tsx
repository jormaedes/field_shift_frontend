"use client";

import Link from "next/link";
import { ArrowRight, Sprout } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { Container } from "./container";

export function FinalCta() {
  const { t } = useLanguage();

  return (
    <section id="comecar" className="scroll-mt-24 bg-sage-200">
      <Container className="grid gap-8 py-16 sm:py-20 md:grid-cols-12 md:items-end">
        <div className="md:col-span-8">
          <p className="flex items-center gap-2 font-mono text-[10px] uppercase text-solo-900">
            <Sprout aria-hidden className="size-4" />
            NATERRA · Field Shift
          </p>
          <h2 className="mt-4 max-w-2xl font-display text-4xl leading-[1.04] text-brand-900 sm:text-5xl">
            {t.cta.title}
          </h2>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-brand-900/75 sm:text-base">
            {t.cta.text}
          </p>
        </div>

        <Link
          href="/dashboard"
          className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-brand-900 px-6 text-sm font-semibold text-canvas transition-colors hover:bg-brand-700 md:col-span-4 md:justify-self-end"
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
