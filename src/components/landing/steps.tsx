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
      className="scroll-mt-24 overflow-hidden bg-brand-900 text-canvas"
    >
      <Container className="py-16 sm:py-20 lg:py-24">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-5">
            <SectionLabel tone="dark">{steps.label}</SectionLabel>
            <h2 className="mt-5 max-w-md font-display text-4xl leading-[1.04] sm:text-5xl">
              {steps.title}
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-sage-200/80 sm:text-base lg:col-span-5 lg:col-start-8">
            {steps.lead}
          </p>
        </div>

        <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8 lg:mt-20">
          {steps.items.map((step, index) => {
            const Icon = stepIcons[step.icon];

            return (
              <li key={step.title} className="border-t border-white/35 pt-5">
                <div className="flex items-start justify-between gap-4">
                  <span className="font-display text-5xl leading-none text-white/35">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <Icon aria-hidden className="mt-1 size-6 text-solo-200" />
                </div>
                <h3 className="mt-8 font-display text-2xl text-white">
                  {step.title}
                </h3>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-sage-200/80">
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
