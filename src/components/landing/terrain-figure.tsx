"use client";

import { CloudRain, Droplets, Leaf } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

/**
 * Ilustração editorial do terreno. É um esquema, não um mapa real:
 * por isso não mostra valores, coordenadas nem áreas inventadas.
 */
export function TerrainFigure() {
  const { t } = useLanguage();
  const { figure } = t.hero;

  return (
    <figure className="relative">
      <div className="relative aspect-[5/6] overflow-hidden border border-brand-900/15 bg-sage-200">
        <svg
          viewBox="0 0 480 560"
          role="img"
          aria-label={figure.alt}
          className="h-full w-full"
        >
          {/* Curvas de nível */}
          <g
            fill="none"
            stroke="#40603d"
            strokeWidth="1"
            opacity="0.28"
            aria-hidden
          >
            <path d="M-20 118 C 60 86, 152 58, 240 90 S 420 148, 500 116" />
            <path d="M-20 176 C 70 146, 160 126, 250 156 S 430 208, 500 186" />
            <path d="M-20 246 C 80 220, 170 200, 260 230 S 440 282, 500 260" />
            <path d="M-20 330 C 70 306, 168 288, 250 314 S 438 362, 500 342" />
            <path d="M-20 520 C 90 492, 200 500, 280 522 S 430 548, 500 528" />
          </g>

          {/* Parcelas de cultivo, em tons de verde */}
          <g aria-hidden>
            <polygon points="40,300 210,278 232,372 58,398" fill="#6b964e" opacity="0.42" />
            <polygon points="240,282 430,304 418,404 236,374" fill="#40603d" opacity="0.34" />
            <polygon points="70,410 236,388 258,470 96,486" fill="#26422d" opacity="0.2" />
            <polygon points="270,400 424,420 410,486 262,474" fill="#c9a277" opacity="0.5" />
          </g>

          {/* Linhas de sementeira */}
          <g stroke="#223b29" strokeWidth="0.75" opacity="0.18" aria-hidden>
            <path d="M62 322 L214 302" />
            <path d="M66 344 L218 324" />
            <path d="M70 366 L222 346" />
            <path d="M254 306 L412 326" />
            <path d="M252 330 L410 350" />
            <path d="M250 354 L408 374" />
          </g>

          {/* Contorno do terreno, a castanho tracejado */}
          <g aria-hidden>
            <path
              d="M96 250 L392 226 L430 438 L138 478 Z"
              fill="none"
              stroke="#5c3d26"
              strokeWidth="1.75"
              strokeDasharray="9 6"
              opacity="0.85"
            />
            <circle cx="264" cy="348" r="5" fill="#fcfbfe" stroke="#5c3d26" strokeWidth="1.5" />
            <path d="M264 334 L264 342 M264 354 L264 362 M250 348 L258 348 M270 348 L278 348" stroke="#5c3d26" strokeWidth="1.5" />
          </g>

          {/* Perfil de solo: onde o castanho ganha presença */}
          <g aria-hidden>
            <rect x="0" y="482" width="480" height="78" fill="#c9a277" opacity="0.62" />
            <path
              d="M0 482 C 90 470, 170 492, 260 484 S 400 468, 480 480"
              fill="none"
              stroke="#8b5e3c"
              strokeWidth="1.5"
              opacity="0.5"
            />
            <path d="M0 506 C 110 496, 200 514, 300 506 S 420 494, 480 504" fill="none" stroke="#8b5e3c" strokeWidth="1" opacity="0.35" />
            <path d="M0 530 C 120 520, 210 538, 310 530 S 430 518, 480 528" fill="none" stroke="#5c3d26" strokeWidth="1" opacity="0.28" />
            <path d="M0 550 C 120 542, 220 558, 320 550 S 440 540, 480 548" fill="none" stroke="#5c3d26" strokeWidth="1" opacity="0.2" />
          </g>

          {/* Norte */}
          <g aria-hidden stroke="#223b29" opacity="0.55">
            <path d="M438 44 L438 22" strokeWidth="1" />
            <path d="M433 30 L438 21 L443 30" fill="none" strokeWidth="1" />
          </g>
        </svg>

        <div className="absolute left-4 top-6 flex items-center gap-2 border border-brand-900/15 bg-canvas/95 px-3 py-2 shadow-sm sm:left-6 sm:top-8">
          <CloudRain aria-hidden className="size-4 text-brand-700" />
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand-900/80">
            {figure.rain}
          </span>
        </div>

        <div className="absolute right-4 top-[42%] flex items-center gap-2 border border-brand-900/15 bg-canvas/95 px-3 py-2 shadow-sm sm:right-6">
          <Droplets aria-hidden className="size-4 text-solo-600" />
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand-900/80">
            {figure.moisture}
          </span>
        </div>

        <div className="absolute bottom-20 left-4 flex items-center gap-2 border border-brand-900/15 bg-canvas/95 px-3 py-2 shadow-sm sm:bottom-24 sm:left-6">
          <Leaf aria-hidden className="size-4 text-brand-500" />
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-brand-900/80">
            {figure.vegetation}
          </span>
        </div>
      </div>

      <figcaption className="mt-3 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.16em] text-brand-900/50">
        <span aria-hidden className="h-px w-8 bg-solo-600" />
        {figure.caption}
      </figcaption>
    </figure>
  );
}
