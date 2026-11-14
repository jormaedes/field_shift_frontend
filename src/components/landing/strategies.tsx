"use client";

import { BookOpen, Gauge } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { Container } from "./container";
import { SectionLabel } from "./section-label";

export function Strategies() {
  const { t } = useLanguage();
  const { strategies } = t;

  return (
    <section className="border-y border-brand-900/10 bg-sage-200/45">
      <Container className="grid gap-12 py-16 sm:py-20 lg:grid-cols-12 lg:gap-14 lg:py-24">
        <div className="lg:col-span-5">
          <SectionLabel tone="onSage">{strategies.label}</SectionLabel>
          <h2 className="mt-5 max-w-sm font-display text-3xl leading-[1.08] tracking-[-0.01em] text-brand-900 sm:text-4xl">
            {strategies.title}
          </h2>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-brand-900/70 sm:text-base">
            {strategies.lead}
          </p>

          <p className="mt-8 flex items-start gap-2.5 border-t border-brand-900/20 pt-5 text-[13px] leading-relaxed text-solo-900">
            <BookOpen aria-hidden className="mt-0.5 size-4 shrink-0" />
            {strategies.note}
          </p>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <div className="border border-brand-900/15 bg-canvas shadow-sm">
            <div className="flex items-center justify-between border-b border-brand-900/10 px-5 py-4">
              <div className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.14em]">
                {strategies.tabs.map((tab, index) => (
                  <span
                    key={tab}
                    className={
                      index === 0
                        ? "border-b-2 border-solo-600 px-2.5 pb-0.5 text-brand-900"
                        : "px-2.5 pb-0.5 text-brand-900/40"
                    }
                  >
                    {tab}
                  </span>
                ))}
              </div>
              <span
                aria-hidden
                className="size-2 bg-solo-600"
              />
            </div>

            <div className="px-5 py-6 sm:px-6">
              <p className="font-display text-2xl leading-snug text-brand-900">
                {strategies.cardTitle}
              </p>

              <ul className="mt-5 divide-y divide-brand-900/10 border-t border-brand-900/10">
                {strategies.fields.map((field, index) => (
                  <li
                    key={field.name}
                    className="grid grid-cols-[1.75rem_1fr] gap-x-3 py-3.5"
                  >
                    <span className="pt-0.5 font-mono text-[10px] text-solo-600">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="text-sm font-medium text-brand-900">
                        {field.name}
                      </p>
                      <p className="mt-0.5 text-xs leading-relaxed text-brand-900/60">
                        {field.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <p className="border-t border-brand-900/10 bg-sage-200/40 px-5 py-3 text-xs leading-relaxed text-brand-900/70 sm:px-6">
              {strategies.reference}
            </p>
          </div>

          <p className="mt-4 flex items-start gap-2.5 text-xs leading-relaxed text-brand-900/65">
            <Gauge aria-hidden className="mt-0.5 size-4 shrink-0 text-solo-600" />
            {strategies.confidence}
          </p>
        </div>
      </Container>
    </section>
  );
}
