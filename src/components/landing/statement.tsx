"use client";

import { useLanguage } from "@/components/language-provider";
import { CloudRain, Layers3, Sprout } from "lucide-react";
import { Container } from "./container";
import { SectionLabel } from "./section-label";

const pointIcons = [CloudRain, Sprout, Layers3];

export function Statement() {
  const { t } = useLanguage();
  const { statement } = t;

  return (
    <section id="sobre" className="scroll-mt-24 bg-canvas">
      <Container className="py-16 sm:py-20 lg:py-28">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-12">
          <div className="lg:col-span-6">
            <SectionLabel>{statement.label}</SectionLabel>
            <h2 className="mt-5 max-w-xl font-display text-4xl leading-[1.04] text-brand-900 sm:text-5xl">
              {statement.title}
            </h2>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="max-w-xl text-base leading-relaxed text-brand-900/75 sm:text-lg">
              {statement.lead}
            </p>
          </div>
        </div>

        <ol className="mt-14 grid gap-8 md:grid-cols-3 md:gap-6 lg:mt-20">
          {statement.points.map((point, index) => {
            const Icon = pointIcons[index] ?? Layers3;

            return (
              <li key={point.title} className="border-t border-brand-900/25 pt-5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-solo-600">
                    0{index + 1} <span className="text-brand-900/35">/ 03</span>
                  </span>
                  <Icon aria-hidden className="size-5 text-brand-700" />
                </div>
                <h3 className="mt-8 font-display text-2xl leading-tight text-brand-900">
                  {point.title}
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-brand-900/70">
                  {point.text}
                </p>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
