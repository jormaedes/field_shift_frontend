"use client";

import Image from "next/image";
import { useLanguage } from "@/components/language-provider";
import { Container } from "./container";

function FooterHeading({ children }: { children: string }) {
  return (
    <h2 className="font-mono text-[10px] uppercase tracking-[0.18em] text-brand-900/50">
      {children}
    </h2>
  );
}

export function SiteFooter() {
  const { t } = useLanguage();
  const { footer } = t;

  return (
    <footer className="border-t border-brand-900/10 bg-sage-200/50">
      <Container className="py-12 sm:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Image
              src="/NATERRA_logo.png"
              alt="NATERRA"
              width={195}
              height={41}
              className="h-7 w-auto"
            />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-brand-900/70">
              {footer.tagline}
            </p>
          </div>

          <div className="lg:col-span-3">
            <FooterHeading>{footer.projectLabel}</FooterHeading>
            <p className="mt-3 text-sm leading-relaxed text-brand-900/70">
              {footer.project}
            </p>
          </div>

          <div className="lg:col-span-2">
            <FooterHeading>{footer.sourcesLabel}</FooterHeading>
            <ul className="mt-3 space-y-1.5 text-sm text-brand-900/70">
              {footer.sources.map((source) => (
                <li key={source}>{source}</li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <FooterHeading>{footer.mapLabel}</FooterHeading>
            <p className="mt-3 text-sm leading-relaxed text-brand-900/70">
              {footer.map}
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-brand-900/15 pt-5 text-[11px] leading-relaxed text-brand-900/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 NATERRA · Field Shift</p>
          <p className="max-w-md sm:text-right">{footer.rights}</p>
        </div>
      </Container>
    </footer>
  );
}
