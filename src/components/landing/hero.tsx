"use client";

import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { Container } from "./container";
import { TerrainFigure } from "./terrain-figure";

export function Hero() {
  const { t } = useLanguage();
  const { hero } = t;

  return (
    <section className="relative">
      <Container className="grid gap-12 py-14 sm:py-20 lg:grid-cols-12 lg:items-center lg:gap-10 lg:py-28">
        <div className="lg:col-span-6">
          <p className="flex items-start gap-3 font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-brand-900/55">
            <span aria-hidden className="mt-2 h-px w-7 shrink-0 bg-solo-600" />
            {hero.eyebrow}
          </p>

          <h1 className="mt-6 font-display text-[2.6rem] leading-[1.02] tracking-[-0.02em] text-brand-900 sm:text-6xl xl:text-[4.25rem]">
            {hero.title}
            <span className="block italic text-solo-600">{hero.titleAccent}</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-brand-900/75 sm:text-lg">
            {hero.lead}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/dashboard"
              className="group inline-flex items-center justify-center gap-2 bg-brand-900 px-6 py-3.5 text-sm font-medium text-canvas transition-colors hover:bg-brand-700"
            >
              {hero.primaryCta}
              <ArrowRight
                aria-hidden
                className="size-4 transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <a
              href="#como-funciona"
              className="inline-flex items-center justify-center gap-2 border border-brand-900/25 px-6 py-3.5 text-sm font-medium text-brand-900 transition-colors hover:border-brand-900 hover:bg-sage-200/40"
            >
              {hero.secondaryCta}
            </a>
          </div>

          <p className="mt-7 flex max-w-md items-start gap-2.5 text-[13px] leading-relaxed text-brand-900/60">
            <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-solo-600" />
            {hero.note}
          </p>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <TerrainFigure />
        </div>
      </Container>
    </section>
  );
}
