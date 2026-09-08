"use client";

import { useEffect, useState } from "react";
import { Languages } from "lucide-react";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate: {
        TranslateElement: new (options: Record<string, unknown>, elementId: string) => unknown;
      };
    };
  }
}

const COOKIE_NAME = "googtrans";

function getCurrentLang(): "en" | "es" {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(/googtrans=\/en\/(\w+)/);
  return match?.[1] === "es" ? "es" : "en";
}

function setLang(lang: "en" | "es") {
  const value = lang === "en" ? "" : `/en/${lang}`;
  const host = window.location.hostname;
  if (value) {
    document.cookie = `${COOKIE_NAME}=${value};path=/`;
    document.cookie = `${COOKIE_NAME}=${value};path=/;domain=${host}`;
  } else {
    document.cookie = `${COOKIE_NAME}=;path=/;expires=Thu, 01 Jan 1970 00:00:00 UTC`;
    document.cookie = `${COOKIE_NAME}=;path=/;domain=${host};expires=Thu, 01 Jan 1970 00:00:00 UTC`;
  }
  window.location.reload();
}

export default function LanguageToggle({ light = false }: { light?: boolean }) {
  const [lang, setLangState] = useState<"en" | "es">("en");

  useEffect(() => {
    setLangState(getCurrentLang());

    if (document.getElementById("google-translate-script")) return;

    const container = document.createElement("div");
    container.id = "google_translate_element";
    container.style.display = "none";
    document.body.appendChild(container);

    window.googleTranslateElementInit = () => {
      if (window.google?.translate) {
        new window.google.translate.TranslateElement(
          { pageLanguage: "en", includedLanguages: "en,es", autoDisplay: false },
          "google_translate_element"
        );
      }
    };

    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return (
    <div
      className={`notranslate inline-flex items-center gap-1 rounded-full border px-1 py-1 text-xs font-semibold ${
        light ? "border-purple-deep/20 text-purple-deep" : "border-ivory/30 text-ivory"
      }`}
      aria-label="Choose language / Elegir idioma"
      translate="no"
    >
      <Languages className="ml-1.5 h-3.5 w-3.5" aria-hidden="true" />
      <button
        type="button"
        onClick={() => setLang("en")}
        aria-pressed={lang === "en"}
        className={`rounded-full px-2 py-1 transition-colors ${
          lang === "en" ? "bg-gold-warm text-purple-deep" : "opacity-70 hover:opacity-100"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLang("es")}
        aria-pressed={lang === "es"}
        className={`rounded-full px-2 py-1 transition-colors ${
          lang === "es" ? "bg-gold-warm text-purple-deep" : "opacity-70 hover:opacity-100"
        }`}
      >
        ES
      </button>
    </div>
  );
}
