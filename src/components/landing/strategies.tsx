"use client";

import { ArrowDownRight, BookOpen, Gauge } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { Container } from "./container";
import { SectionLabel } from "./section-label";

export function Strategies() {
  const { t } = useLanguage();
  const { strategies } = t;

  return (
    <section id="beneficios" className="scroll-mt-24 bg-sage-200/55">
      <Container className="grid gap-12 py-16 sm:py-20 lg:grid-cols-12 lg:gap-14 lg:py-24">
        <div className="lg:col-span-5">
          <SectionLabel tone="onSage">{strategies.label}</SectionLabel>
          <h2 className="mt-5 max-w-sm font-display text-4xl leading-[1.04] text-brand-900 sm:text-5xl">
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
          <div className="border-y border-brand-900/25 bg-canvas/70 px-5 sm:px-7">
            <div className="flex items-end justify-between gap-4 border-b border-brand-900/15 py-5">
              <div>
                <p className="font-mono text-[10px] uppercase text-solo-600">
                  {strategies.tabs.join("  /  ")}
                </p>
                <p className="mt-2 font-display text-2xl leading-snug text-brand-900">
                  {strategies.cardTitle}
                </p>
              </div>
              <ArrowDownRight aria-hidden className="mb-1 size-5 shrink-0 text-solo-600" />
            </div>

            <ul className="divide-y divide-brand-900/10">
              {strategies.fields.map((field, index) => (
                <li
                  key={field.name}
                  className="grid grid-cols-[2rem_1fr] gap-x-3 py-4"
                >
                  <span className="pt-0.5 font-mono text-[11px] text-solo-600">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-brand-900">
                      {field.name}
                    </p>
                    <p className="mt-1 text-xs leading-relaxed text-brand-900/65">
                      {field.text}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <p className="border-t border-brand-900/15 py-4 text-xs leading-relaxed text-brand-900/70">
              {strategies.reference}
            </p>
          </div>

          <p className="mt-4 flex items-start gap-2.5 text-xs leading-relaxed text-brand-900/70">
            <Gauge aria-hidden className="mt-0.5 size-4 shrink-0 text-solo-600" />
            {strategies.confidence}
          </p>
        </div>
      </Container>
    </section>
  );
}
