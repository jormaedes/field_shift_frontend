"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/components/language-provider";

export function SiteHeader({ overlay = false }: { overlay?: boolean }) {
  const { t } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { href: "#conteudo", label: t.nav.home },
    { href: "#sobre", label: t.nav.about },
    { href: "#como-funciona", label: t.nav.features },
    { href: "#beneficios", label: t.nav.benefits },
  ];

  return (
    <header
      className={
        overlay
          ? "fixed inset-x-0 top-4 z-50 px-3 sm:top-5 sm:px-6"
          : "sticky top-0 z-50 border-b border-brand-900/10 bg-canvas/90 backdrop-blur-md"
      }
    >
      <div
        className={`mx-auto flex min-h-14 w-full max-w-[1380px] items-center gap-3 px-4 sm:min-h-16 sm:px-6 ${
          overlay
            ? "rounded-full border border-white/60 bg-[#e7eedf]/95 shadow-[0_8px_30px_rgba(16,35,20,0.12)] backdrop-blur-md"
            : "max-w-6xl sm:px-8"
        }`}
      >
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

        {overlay && (
          <p className="hidden max-w-40 border-l border-brand-900/20 pl-4 text-[10px] leading-tight text-brand-900/65 xl:block">
            {t.nav.tagline}
          </p>
        )}

        <div className="ml-auto flex items-center gap-2 sm:gap-4">
          <nav aria-label={t.nav.label} className="hidden items-center gap-6 lg:flex xl:gap-8">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="border-b border-transparent py-1 text-[12px] font-medium text-brand-900/75 transition-colors hover:border-brand-900 hover:text-brand-900"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <LanguageToggle />

          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full text-brand-900 transition-colors hover:bg-brand-900/10 lg:hidden"
            aria-label={menuOpen ? "Fechar menu" : t.nav.label}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
          </button>

          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full bg-brand-900 px-3.5 py-2.5 text-[12px] font-semibold text-canvas transition-colors hover:bg-brand-700 sm:px-4"
          >
            <span className="hidden sm:inline">{t.nav.cta}</span>
            <ArrowUpRight aria-hidden className="size-4" />
          </Link>
        </div>
      </div>
      {menuOpen && (
        <nav
          id="mobile-navigation"
          aria-label={t.nav.label}
          className="absolute inset-x-4 top-[calc(100%+0.5rem)] z-50 rounded-2xl border border-white/70 bg-[#e7eedf]/97 p-2 shadow-[0_12px_36px_rgba(16,35,20,0.2)] backdrop-blur-md lg:hidden"
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="block rounded-xl px-4 py-3 text-sm font-medium text-brand-900 transition-colors hover:bg-brand-900/8"
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
