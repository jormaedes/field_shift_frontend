"use client";

import { useLanguage } from "@/components/language-provider";
import { Container } from "./container";
import { SectionLabel } from "./section-label";

export function Statement() {
  const { t } = useLanguage();
  const { statement } = t;

  return (
    <section className="border-t border-brand-900/10">
      <Container className="grid gap-10 py-16 sm:py-20 lg:grid-cols-12 lg:gap-16 lg:py-24">
        <div className="lg:col-span-5">
          <SectionLabel>{statement.label}</SectionLabel>
          <h2 className="mt-5 max-w-md font-display text-3xl leading-[1.08] tracking-[-0.01em] text-brand-900 sm:text-4xl">
            {statement.title}
          </h2>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <p className="max-w-xl text-base leading-relaxed text-brand-900/75 sm:text-lg">
            {statement.lead}
          </p>

          <ol className="mt-9 border-t border-brand-900/15">
            {statement.points.map((point, index) => (
              <li
                key={point.title}
                className="grid grid-cols-[2.25rem_1fr] gap-x-4 border-b border-brand-900/15 py-5 sm:grid-cols-[2.75rem_1fr]"
              >
                <span className="font-mono text-xs text-solo-600">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-xl text-brand-900">
                    {point.title}
                  </h3>
                  <p className="mt-1.5 max-w-md text-sm leading-relaxed text-brand-900/65">
                    {point.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Container>
    </section>
  );
}
