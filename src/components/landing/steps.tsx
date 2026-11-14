"use client";

import { ClipboardList, Layers, Map } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import type { LandingCopy } from "@/lib/i18n";
import { Container } from "./container";
import { SectionLabel } from "./section-label";

const stepIcons: Record<LandingCopy["steps"]["items"][number]["icon"], typeof Map> = {
  map: Map,
  form: ClipboardList,
  compare: Layers,
};

export function Steps() {
  const { t } = useLanguage();
  const { steps } = t;

  return (
    <section
      id="como-funciona"
      className="scroll-mt-24 border-t border-brand-900/10 bg-canvas"
    >
      <Container className="py-16 sm:py-20 lg:py-24">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-5">
            <SectionLabel>{steps.label}</SectionLabel>
            <h2 className="mt-5 max-w-md font-display text-3xl leading-[1.08] tracking-[-0.01em] text-brand-900 sm:text-4xl">
              {steps.title}
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-brand-900/65 sm:text-base lg:col-span-5 lg:col-start-8">
            {steps.lead}
          </p>
        </div>

        <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.items.map((step, index) => {
            const Icon = stepIcons[step.icon];

            return (
              <li key={step.title} className="border-t-2 border-brand-900/80 pt-5">
                <div className="flex items-start justify-between gap-4">
                  <span className="font-mono text-xs text-solo-600">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex size-10 items-center justify-center border border-brand-900/20 bg-canvas">
                    <Icon aria-hidden className="size-5 text-brand-700" />
                  </span>
                </div>
                <h3 className="mt-6 font-display text-2xl text-brand-900">
                  {step.title}
                </h3>
                <p className="mt-2.5 text-sm leading-relaxed text-brand-900/65">
                  {step.text}
                </p>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
