"use client";

import { CircleAlert, CloudOff, Info, Ruler } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { Container } from "./container";
import { SectionLabel } from "./section-label";

const limitIcons = [CircleAlert, CloudOff, Ruler];

export function Limits() {
  const { t } = useLanguage();
  const { limits } = t;

  return (
    <section id="limitacoes" className="scroll-mt-24 bg-brand-900 text-canvas">
      <Container className="py-16 sm:py-20 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <SectionLabel tone="dark">{limits.label}</SectionLabel>
            <h2 className="mt-5 max-w-xs font-display text-3xl leading-[1.08] tracking-[-0.01em] sm:text-4xl">
              {limits.title}
            </h2>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-sage-200/80">
              {limits.lead}
            </p>
          </div>

          <ul className="grid gap-x-10 gap-y-7 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
            {limits.items.map((item, index) => {
              const Icon = limitIcons[index] ?? CircleAlert;

              return (
                <li
                  key={item}
                  className="border-t border-canvas/20 pt-4"
                >
                  <Icon aria-hidden className="size-5 text-solo-200" />
                  <p className="mt-3 text-sm leading-relaxed text-sage-200/90">
                    {item}
                  </p>
                </li>
              );
            })}
          </ul>
        </div>

        <p className="mt-12 flex max-w-3xl items-start gap-2.5 border-t border-canvas/15 pt-6 text-xs leading-relaxed text-sage-200/70">
          <Info aria-hidden className="mt-0.5 size-4 shrink-0 text-solo-200" />
          {limits.footnote}
        </p>
      </Container>
    </section>
  );
}
