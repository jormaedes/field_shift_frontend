"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { copy, type Lang, type LandingCopy } from "@/lib/i18n";

const STORAGE_KEY = "naterra.lang";

// Guardamos apenas a preferência de idioma (não é dado pessoal).
// useSyncExternalStore evita o descompasso de hidratação: o servidor
// renderiza por predefinição em EN e o cliente atualiza para a escolha guardada.
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function getSnapshot(): Lang {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved === "pt" ? "pt" : "en";
  } catch {
    return "en";
  }
}

function getServerSnapshot(): Lang {
  return "en";
}

type LanguageContextValue = {
  lang: Lang;
  t: LandingCopy;
  setLang: (lang: Lang) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setLang = useCallback((next: Lang) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Sem localStorage o idioma muda apenas nesta sessão.
    }
    listeners.forEach((listener) => listener());
  }, []);

  useEffect(() => {
    document.documentElement.lang = copy[lang].htmlLang;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, t: copy[lang], setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage tem de ser usado dentro de <LanguageProvider>.");
  }

  return context;
}
