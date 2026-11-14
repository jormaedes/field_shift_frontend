"use client";

import { CloudRain, Droplets, Leaf, Ruler } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { Container } from "./container";
import { SectionLabel } from "./section-label";

const dataIcons = [CloudRain, Droplets, Leaf];

export function DataSources() {
  const { t } = useLanguage();
  const { data } = t;

  return (
    <section id="dados" className="scroll-mt-24 bg-canvas">
      <Container className="py-16 sm:py-20 lg:py-24">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-5">
            <SectionLabel>{data.label}</SectionLabel>
            <h2 className="mt-5 max-w-md font-display text-4xl leading-[1.04] text-brand-900 sm:text-5xl">
              {data.title}
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-brand-900/65 sm:text-base lg:col-span-5 lg:col-start-8">
            {data.lead}
          </p>
        </div>

        <div className="mt-12 grid border-y border-brand-900/15 md:grid-cols-3">
          {data.items.map((item, index) => {
            const Icon = dataIcons[index] ?? Leaf;

            return (
              <article
                key={item.name}
                className="border-b border-brand-900/15 py-7 md:border-b-0 md:px-6 md:py-8 md:first:pl-0 md:last:pr-0 md:not-last:border-r md:not-last:border-brand-900/15"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-solo-600">
                    0{index + 1}
                  </span>
                  <Icon aria-hidden className="size-5 text-brand-700" />
                </div>
                <p className="mt-6 font-mono text-[10px] uppercase text-brand-900/55">
                  {item.source}
                </p>
                <h3 className="mt-2 font-display text-2xl leading-tight text-brand-900">
                  {item.name}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-brand-900/70">
                  {item.text}
                </p>
              </article>
            );
          })}
        </div>

        <p className="mt-7 flex max-w-3xl items-start gap-2.5 text-xs leading-relaxed text-brand-900/60">
          <Ruler aria-hidden className="mt-0.5 size-4 shrink-0 text-solo-600" />
          {data.note}
        </p>
      </Container>
    </section>
  );
}
