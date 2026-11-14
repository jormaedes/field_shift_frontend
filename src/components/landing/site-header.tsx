"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/components/language-provider";

export function SiteHeader() {
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 border-b border-brand-900/10 bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-4 px-5 sm:h-20 sm:px-8">
        <Link href="/" className="shrink-0" aria-label="NATERRA">
          <Image
            src="/NATERRA_logo.png"
            alt="NATERRA"
            width={195}
            height={41}
            priority
            className="h-6 w-auto sm:h-7"
          />
        </Link>

        <div className="ml-auto flex items-center gap-5">
          <nav aria-label={t.nav.label} className="hidden items-center gap-7 md:flex">
            <a
              href="#como-funciona"
              className="text-[13px] font-medium text-brand-900/70 transition-colors hover:text-brand-900"
            >
              {t.nav.how}
            </a>
            <a
              href="#dados"
              className="text-[13px] font-medium text-brand-900/70 transition-colors hover:text-brand-900"
            >
              {t.nav.data}
            </a>
            <a
              href="#limitacoes"
              className="text-[13px] font-medium text-brand-900/70 transition-colors hover:text-brand-900"
            >
              {t.nav.limits}
            </a>
          </nav>

          <LanguageToggle />

          <Link
            href="/dashboard"
            className="hidden items-center gap-1.5 bg-brand-900 px-4 py-2 text-[13px] font-medium text-canvas transition-colors hover:bg-brand-700 sm:inline-flex"
          >
            {t.nav.cta}
            <ArrowUpRight aria-hidden className="size-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
