"use client";

import type { Lang } from "@/lib/i18n";
import { useLanguage } from "./language-provider";

const options: { value: Lang; short: string }[] = [
  { value: "en", short: "EN" },
  { value: "pt", short: "PT" },
];

export function LanguageToggle() {
  const { lang, setLang, t } = useLanguage();

  return (
    <div
      role="group"
      aria-label={t.toggle.groupLabel}
      className="inline-flex items-center gap-0.5 border border-brand-900/20 bg-canvas p-0.5"
    >
      {options.map((option) => {
        const isActive = lang === option.value;
        const fullName = option.value === "pt" ? t.toggle.pt : t.toggle.en;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => setLang(option.value)}
            aria-pressed={isActive}
            aria-label={fullName}
            className={`px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
              isActive
                ? "bg-brand-900 text-canvas"
                : "text-brand-900/60 hover:bg-sage-200/60 hover:text-brand-900"
            }`}
          >
            {option.short}
          </button>
        );
      })}
    </div>
  );
}
