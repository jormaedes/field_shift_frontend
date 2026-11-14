"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/components/language-provider";
import { SiteHeader } from "@/components/landing/site-header";

// TODO(confirmar): página temporária. O dashboard (mapa + barra lateral)
// substitui este conteúdo na fase seguinte.
export default function DashboardPage() {
  const { lang } = useLanguage();

  return (
    <>
      <SiteHeader />
      <main className="flex flex-1 flex-col items-start justify-center px-5 py-24 sm:px-8">
        <div className="mx-auto w-full max-w-6xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-solo-600">
            {lang === "pt" ? "Próxima fase" : "Next phase"}
          </p>
          <h1 className="mt-4 max-w-lg font-display text-4xl leading-[1.05] text-brand-900">
            {lang === "pt"
              ? "O dashboard está a ser construído."
              : "The dashboard is being built."}
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-brand-900/65">
            {lang === "pt"
              ? "Aqui vai ficar o mapa para marcar o terreno e o formulário da análise."
              : "The map for marking your land and the analysis form will live here."}
          </p>
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 border border-brand-900/25 px-5 py-2.5 text-sm font-medium text-brand-900 transition-colors hover:border-brand-900 hover:bg-sage-200/40"
          >
            <ArrowLeft aria-hidden className="size-4" />
            {lang === "pt" ? "Voltar à página inicial" : "Back to home"}
          </Link>
        </div>
      </main>
    </>
  );
}
