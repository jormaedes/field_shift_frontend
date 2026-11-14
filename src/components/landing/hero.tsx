"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CloudRain,
  Droplets,
  Info,
  Leaf,
  Satellite,
} from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { Container } from "./container";

const dataIcons = [CloudRain, Droplets, Leaf];

export function Hero() {
  const { t } = useLanguage();
  const { hero } = t;

  return (
    <section className="relative isolate min-h-[760px] overflow-hidden bg-brand-900 text-canvas sm:min-h-[800px] lg:min-h-[min(900px,100svh)]">
      <Image
        src="/bg.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_54%]"
      />
      <div aria-hidden className="hero-image-shade absolute inset-0" />

      <Container className="relative grid min-h-[760px] gap-10 pb-12 pt-36 sm:min-h-[800px] sm:pb-16 sm:pt-40 lg:min-h-[min(900px,100svh)] lg:grid-cols-12 lg:items-center lg:gap-8 lg:pt-28">
        <div className="hero-reveal max-w-2xl lg:col-span-7">
          <p className="flex items-center gap-3 font-mono text-[11px] uppercase leading-relaxed tracking-[0.16em] text-sage-200">
            <Leaf aria-hidden className="size-4 shrink-0 text-solo-200" />
            {hero.eyebrow}
          </p>

          <h1 className="mt-6 max-w-2xl font-display text-5xl leading-[1.02] text-white sm:text-6xl xl:text-7xl">
            {hero.title}
            <span className="mt-1 block italic text-solo-200">{hero.titleAccent}</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
            {hero.lead}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/dashboard"
              className="group inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-brand-900 px-6 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(8,24,12,0.24)] transition-colors hover:bg-brand-700"
            >
              {hero.primaryCta}
              <ArrowRight
                aria-hidden
                className="size-4 transition-transform group-hover:translate-x-0.5"
              />
            </Link>
            <a
              href="#como-funciona"
              className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/65 bg-white/10 px-6 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              {hero.secondaryCta}
            </a>
          </div>

          <p className="mt-6 flex max-w-lg items-start gap-2.5 text-[13px] leading-relaxed text-white/85">
            <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-solo-200" />
            {hero.note}
          </p>
        </div>

        <aside className="hero-reveal-late self-end rounded-lg border border-white/70 bg-[#eef2e6]/95 p-4 text-brand-900 shadow-[0_20px_60px_rgba(9,24,12,0.28)] backdrop-blur-md sm:p-5 lg:col-span-4 lg:col-start-9 lg:self-center">
          <div className="flex items-start gap-3 border-b border-brand-900/15 pb-4">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-sage-200 text-brand-900">
              <Satellite aria-hidden className="size-5" />
            </span>
            <div>
              <h2 className="font-display text-xl leading-tight text-brand-900">
                {t.data.title}
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-brand-900/65">
                {t.data.lead}
              </p>
            </div>
          </div>

          <ul className="divide-y divide-brand-900/10">
            {t.data.items.map((item, index) => {
              const Icon = dataIcons[index] ?? Leaf;

              return (
                <li key={item.name} className="flex gap-3 py-3.5 last:pb-1">
                  <Icon aria-hidden className="mt-0.5 size-4 shrink-0 text-solo-600" />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-snug text-brand-900">
                      {item.name}
                    </p>
                    <p className="mt-1 text-[11px] leading-relaxed text-brand-900/65">
                      {item.source}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </aside>
      </Container>
    </section>
  );
}
