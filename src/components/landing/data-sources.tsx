"use client";

import { Ruler } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { Container } from "./container";
import { SectionLabel } from "./section-label";

export function DataSources() {
  const { t } = useLanguage();
  const { data } = t;

  return (
    <section id="dados" className="scroll-mt-24 bg-canvas">
      <Container className="py-16 sm:py-20 lg:py-24">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-5">
            <SectionLabel>{data.label}</SectionLabel>
            <h2 className="mt-5 max-w-md font-display text-3xl leading-[1.08] tracking-[-0.01em] text-brand-900 sm:text-4xl">
              {data.title}
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-brand-900/65 sm:text-base lg:col-span-5 lg:col-start-8">
            {data.lead}
          </p>
        </div>

        <div className="mt-12 border-t border-brand-900/15">
          {data.items.map((item, index) => (
            <article
              key={item.name}
              className="grid gap-3 border-b border-brand-900/15 py-7 sm:grid-cols-12 sm:items-baseline sm:gap-8"
            >
              <div className="sm:col-span-4">
                <p className="font-mono text-[10px] text-solo-600">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-1.5 font-display text-xl text-brand-900">
                  {item.name}
                </h3>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-brand-900/45">
                  {item.source}
                </p>
              </div>
              <p className="text-sm leading-relaxed text-brand-900/70 sm:col-span-7 sm:col-start-6 sm:text-[15px]">
                {item.text}
              </p>
            </article>
          ))}
        </div>

        <p className="mt-7 flex max-w-3xl items-start gap-2.5 text-xs leading-relaxed text-brand-900/60">
          <Ruler aria-hidden className="mt-0.5 size-4 shrink-0 text-solo-600" />
          {data.note}
        </p>
      </Container>
    </section>
  );
}
