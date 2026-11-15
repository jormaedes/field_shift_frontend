"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  CloudRain,
  Compass,
  Droplets,
  LocateFixed,
  Map,
  MapPin,
  Plus,
  RotateCcw,
  Satellite,
  Sprout,
  TriangleAlert,
} from "lucide-react";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/components/language-provider";
import { AnalysisApiError, createAnalysis, getCrops, waitForAnalysis } from "@/lib/api";
import { createPolygonFeature, measurePolygon, type GeoPosition, type PolygonFeature } from "@/lib/geo";
import type { AnalysisInput, AnalysisRequest, AnalysisResponse, Crop, Strategy } from "@/types/analysis";

const MapCanvas = dynamic(
  () => import("@/components/map/map-view").then((module) => module.MapView),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-90 items-center justify-center bg-[#e6ece2] text-sm text-brand-900/65">
        <span className="flex items-center gap-2">
          <Satellite aria-hidden className="size-4" />
          A preparar o mapa…
        </span>
      </div>
    ),
  },
);

const copy = {
  pt: {
    workspace: "Área de trabalho",
    newAnalysis: "Nova análise",
    backHome: "Página inicial",
    steps: ["Terreno", "Situação", "Objetivo"],
    stepLabel: "Passo",
    of: "de",
    mapTitle: "Imagem de satélite",
    mapYear: "Sentinel-2 · 2025",
    locate: "A minha localização",
    drawing: "Toque no mapa para marcar o contorno. São necessários pelo menos 3 pontos.",
    draw: "Desenhar terreno",
    point: "Marcar ponto",
    finish: "Fechar contorno",
    undo: "Anular ponto",
    clear: "Limpar seleção",
    locationFound: "Mapa centrado. Confirme ou marque o terreno no mapa.",
    locationError: "Não foi possível obter a localização. Verifique a permissão do navegador.",
    locationUnsupported: "Este navegador não disponibiliza a localização.",
    title1: "Marque o seu terreno",
    intro1: "Toque no mapa para analisar um ponto ou desenhe o contorno para calcular a área do terreno.",
    area: "Área do terreno",
    areaHint: "O ponto permite analisar a localização. Desenhe um contorno se também quiser calcular a área.",
    selectedPoint: "Ponto marcado",
    noSelection: "Ainda sem terreno marcado",
    latitude: "Latitude",
    longitude: "Longitude",
    continue: "Continuar",
    back: "Voltar",
    title2: "Como é o terreno hoje?",
    intro2: "Conte-nos o que costuma plantar e os recursos de que dispõe.",
    plantedQuestion: "Tem alguma cultura plantada agora?",
    yes: "Sim",
    no: "Não",
    cropNow: "Cultura atual",
    cropNowPlaceholder: "Ex.: nome da cultura",
    plantDate: "Data de plantio (se souber)",
    usualCrop: "O que costuma plantar?",
    usualCropPlaceholder: "Escreva uma cultura ou deixe em branco",
    irrigation: "Tem acesso a rega?",
    soil: "Tipo de solo",
    soilUnknown: "Não sei",
    sandy: "Arenoso",
    loam: "Franco",
    clay: "Argiloso",
    choose: "Escolha uma opção",
    title3: "O que quer melhorar?",
    intro3: "Escolha a prioridade para comparar estratégias nas próximas épocas.",
    primaryGoal: "Objetivo principal",
    secondaryGoal: "Objetivo secundário (opcional)",
    noSecondary: "Sem objetivo secundário",
    soilHealth: "Melhorar a saúde do solo",
    saveWater: "Gastar menos água",
    erosion: "Reduzir a erosão",
    yield: "Aumentar o rendimento",
    seasons: "Número de épocas agrícolas",
    seasonOne: "1 época",
    seasonTwo: "2 épocas",
    seasonThree: "3 épocas",
    analyze: "Analisar terreno",
    advice: "Esta ferramenta apoia a decisão do agricultor. Não substitui o conhecimento local nem os técnicos agrícolas.",
    noForecast: "Não fazemos previsão do tempo. Mostramos padrões históricos e o que já aconteceu nesta época.",
    resolution: "A chuva, a temperatura e a humidade do solo são estimativas para uma área de cerca de 50 km. A vegetação é uma média do seu terreno.",
    analyzing: "A analisar o terreno",
    analyzingCopy: "A preparar os dados de demonstração para este local.",
    waiting: "A carregar dados mockados…",
    retry: "Tentar novamente",
    unavailableTitle: "A análise não ficou disponível",
    resultTitle: "Análise do terreno",
    results: "Resultados",
    partial: "Avisos dos dados",
    assumptions: "Premissas usadas na análise",
    origin: "Origem",
    validation: "Validação",
    validated: "Validada",
    toValidate: "Por validar",
    farmer: "Agricultor",
    literature: "Literatura",
    nasa: "NASA",
    unknown: "Não sei",
    yesValue: "Sim",
    noValue: "Não",
    dataPeriod: "Período dos dados",
    demoWarning: "MODO DE DEMONSTRAÇÃO: os valores exibidos são fictícios e não constituem recomendações agrícolas.",
    demoDataPeriod: "Amostra de interface; valores fictícios, não são dados reais.",
    rainfall: "Chuva mensal",
    rainfallDesc: "Valores apresentados em milímetros (mm), conforme os dados recebidos.",
    historical: "Histórico",
    current: "Atual",
    soilMoisture: "Humidade do solo",
    normal: "Normal do local",
    strategies: "Estratégias de rotação",
    score: "Pontuação",
    confidence: "Confiança",
    high: "Alta",
    medium: "Média",
    low: "Baixa",
    lowConfidence: "A ordem das estratégias pode mudar com pequenas alterações nas premissas.",
    sequence: "Sequência por época",
    why: "Porquê",
    evidence: "Evidência dos dados",
    benefits: "Benefícios",
    gaps: "Lacunas de informação",
    risks: "Riscos a validar localmente",
    sources: "Fontes",
    notProvided: "Não indicado pelo serviço.",
    startOver: "Nova análise",
    unconfigured: "Serviço de análise não configurado. Os dados deste terreno não foram enviados.",
    hectares: "ha",
    squareKm: "km²",
    mapFallback: "Mapa indisponível. Verifique a ligação à internet.",
  },
  en: {
    workspace: "Workspace",
    newAnalysis: "New analysis",
    backHome: "Home page",
    steps: ["Land", "Situation", "Goal"],
    stepLabel: "Step",
    of: "of",
    mapTitle: "Satellite imagery",
    mapYear: "Sentinel-2 · 2025",
    locate: "My location",
    drawing: "Tap the map to mark the outline. At least 3 points are required.",
    draw: "Draw plot",
    point: "Mark a point",
    finish: "Close outline",
    undo: "Undo point",
    clear: "Clear selection",
    locationFound: "Map centred. Confirm or mark the land on the map.",
    locationError: "Could not get your location. Check your browser permission.",
    locationUnsupported: "Location is not available in this browser.",
    title1: "Mark your land",
    intro1: "Tap the map to analyse a point, or draw an outline to calculate the land area.",
    area: "Land area",
    areaHint: "A point can analyse the location. Draw an outline as well if you need the land area.",
    selectedPoint: "Point marked",
    noSelection: "No land marked yet",
    latitude: "Latitude",
    longitude: "Longitude",
    continue: "Continue",
    back: "Back",
    title2: "What is the land like today?",
    intro2: "Tell us what you usually grow and the resources available to you.",
    plantedQuestion: "Is anything planted now?",
    yes: "Yes",
    no: "No",
    cropNow: "Current crop",
    cropNowPlaceholder: "For example, crop name",
    plantDate: "Planting date (if known)",
    usualCrop: "What do you usually grow?",
    usualCropPlaceholder: "Enter a crop or leave blank",
    irrigation: "Do you have access to irrigation?",
    soil: "Soil type",
    soilUnknown: "I don't know",
    sandy: "Sandy",
    loam: "Loam",
    clay: "Clay",
    choose: "Choose an option",
    title3: "What would you like to improve?",
    intro3: "Choose a priority to compare strategies over the coming seasons.",
    primaryGoal: "Main goal",
    secondaryGoal: "Secondary goal (optional)",
    noSecondary: "No secondary goal",
    soilHealth: "Improve soil health",
    saveWater: "Use less water",
    erosion: "Reduce erosion",
    yield: "Increase yield",
    seasons: "Number of growing seasons",
    seasonOne: "1 season",
    seasonTwo: "2 seasons",
    seasonThree: "3 seasons",
    analyze: "Analyse land",
    advice: "This tool supports farmers' decisions. It does not replace local knowledge or agricultural advisers.",
    noForecast: "We do not forecast the weather. We show historical patterns and what has already happened this season.",
    resolution: "Rainfall, temperature and soil moisture are estimates for an area of about 50 km. Vegetation is an average for your land.",
    analyzing: "Analysing the land",
    analyzingCopy: "Preparing demonstration data for this location.",
    waiting: "Loading mocked data…",
    retry: "Try again",
    unavailableTitle: "Analysis is unavailable",
    resultTitle: "Land analysis",
    results: "Results",
    partial: "Data warnings",
    assumptions: "Assumptions used in this analysis",
    origin: "Source",
    validation: "Validation",
    validated: "Validated",
    toValidate: "To validate",
    farmer: "Farmer",
    literature: "Literature",
    nasa: "NASA",
    unknown: "I don't know",
    yesValue: "Yes",
    noValue: "No",
    dataPeriod: "Data period",
    demoWarning: "DEMO MODE: displayed values are fictional and are not agricultural recommendations.",
    demoDataPeriod: "Interface sample; fictional values, not real data.",
    rainfall: "Monthly rainfall",
    rainfallDesc: "Values are shown in millimetres (mm), as returned by the service.",
    historical: "Historical",
    current: "Current",
    soilMoisture: "Soil moisture",
    normal: "Local normal",
    strategies: "Crop rotation strategies",
    score: "Score",
    confidence: "Confidence",
    high: "High",
    medium: "Medium",
    low: "Low",
    lowConfidence: "Strategy order may change with small changes to the assumptions.",
    sequence: "Sequence by season",
    why: "Why",
    evidence: "Evidence from data",
    benefits: "Benefits",
    gaps: "Information gaps",
    risks: "Risks to validate locally",
    sources: "Sources",
    notProvided: "Not provided by the service.",
    startOver: "New analysis",
    unconfigured: "Analysis service is not configured. This land's data has not been sent.",
    hectares: "ha",
    squareKm: "km²",
    mapFallback: "Map unavailable. Check your internet connection.",
  },
} as const;

type DashboardCopy = {
  [Key in keyof (typeof copy)["pt"]]: (typeof copy)["pt"][Key] extends readonly string[]
    ? readonly string[]
    : string;
};
type Goal = AnalysisRequest["objetivo_principal"];

const goals: { value: Goal; label: keyof DashboardCopy }[] = [
  { value: "saude_solo", label: "soilHealth" },
  { value: "economizar_agua", label: "saveWater" },
  { value: "reduzir_erosao", label: "erosion" },
  { value: "aumentar_rendimento", label: "yield" },
];

const fieldLabels: { key: keyof Strategy; label: keyof DashboardCopy }[] = [
  { key: "porque", label: "why" },
  { key: "evidencia", label: "evidence" },
  { key: "beneficios", label: "benefits" },
  { key: "lacunas", label: "gaps" },
  { key: "riscos", label: "risks" },
];

function formatNumber(value: number, lang: "pt" | "en", digits = 2) {
  return new Intl.NumberFormat(lang === "pt" ? "pt-PT" : "en-GB", {
    maximumFractionDigits: digits,
  }).format(value);
}

function StepIndicator({ step, text }: { step: number; text: DashboardCopy }) {
  return (
    <ol className="grid grid-cols-3 gap-2" aria-label={`${text.stepLabel} ${step} ${text.of} 3`}>
      {text.steps.map((label, index) => {
        const number = index + 1;
        const isCurrent = number === step;
        const isDone = number < step;

        return (
          <li key={label} className="min-w-0">
            <div className={`mb-2 h-1 rounded-full ${isDone || isCurrent ? "bg-brand-700" : "bg-brand-900/10"}`} />
            <p className={`truncate text-[11px] ${isCurrent ? "font-semibold text-brand-900" : "text-brand-900/50"}`}>
              {label}
            </p>
          </li>
        );
      })}
    </ol>
  );
}

function FieldLabel({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block text-sm font-semibold text-brand-900">
      {children}
    </label>
  );
}

function StrategyResult({ strategy, text, lang }: { strategy: Strategy; text: DashboardCopy; lang: "pt" | "en" }) {
  const confidenceLabel = strategy.confianca === "alta" ? text.high : strategy.confianca === "media" ? text.medium : text.low;

  return (
    <article className="border border-brand-900/15 bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-brand-900/10 pb-4">
        <div>
          <p className="font-mono text-[10px] uppercase text-solo-600">{text.strategies} · {strategy.id}</p>
          <h3 className="mt-2 font-display text-2xl leading-tight text-brand-900">{strategy.nome}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {strategy.pontuacao !== null && (
            <span className="rounded-full bg-sage-200/70 px-3 py-1.5 text-xs font-semibold text-brand-900">
              {text.score} · {formatNumber(strategy.pontuacao, lang)}
            </span>
          )}
          <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${strategy.confianca === "baixa" ? "bg-[#f4e3d3] text-solo-900" : "bg-sage-200/70 text-brand-900"}`}>
            {text.confidence} · {confidenceLabel}
          </span>
        </div>
      </div>

      {strategy.confianca === "baixa" && (
        <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-solo-900">
          <TriangleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
          {text.lowConfidence}
        </p>
      )}

      {strategy.sequencia.length > 0 && (
        <div className="mt-5">
          <h4 className="text-[11px] font-semibold uppercase text-brand-900/55">{text.sequence}</h4>
          <ol className="mt-2 flex flex-wrap gap-2">
            {strategy.sequencia.map((season) => (
              <li key={`${season.epoca}-${season.cultura}`} className="inline-flex items-center gap-2 rounded-full border border-brand-900/15 px-3 py-1.5 text-xs text-brand-900">
                <span className="font-mono text-[10px] text-solo-600">{season.epoca}</span>
                <Sprout aria-hidden className="size-3.5 text-brand-700" />
                {season.cultura}
              </li>
            ))}
          </ol>
        </div>
      )}

      <dl className="mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-2">
        {fieldLabels.map(({ key, label }) => {
          const value = strategy[key];
          return (
            <div key={key} className="border-t border-brand-900/10 pt-3">
              <dt className="text-xs font-semibold text-brand-900">{text[label]}</dt>
              <dd className="mt-1 text-xs leading-relaxed text-brand-900/70">
                {typeof value === "string" && value.length > 0 ? value : text.notProvided}
              </dd>
            </div>
          );
        })}
      </dl>

      <div className="mt-5 border-t border-brand-900/10 pt-3">
        <h4 className="text-xs font-semibold text-brand-900">{text.sources}</h4>
        {strategy.fontes.length > 0 ? (
          <ul className="mt-2 flex flex-wrap gap-2">
            {strategy.fontes.map((source) => (
              <li key={source} className="rounded-full bg-sage-200/55 px-3 py-1 text-[11px] text-brand-900">{source}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-1 text-xs text-brand-900/60">{text.notProvided}</p>
        )}
      </div>
    </article>
  );
}

function AnalysisResults({ analysis, text, lang }: { analysis: AnalysisResponse; text: DashboardCopy; lang: "pt" | "en" }) {
  const rainfall = analysis.condicoes?.chuva_mensal?.filter((item) => item.historico_mm !== null || item.atual_mm !== null) ?? [];
  const allRain = rainfall.flatMap((item) => [item.historico_mm, item.atual_mm].filter((value): value is number => value !== null));
  const maxRain = Math.max(...allRain, 0);
  const moisture = analysis.condicoes?.humidade_solo;
  const strategies = [...(analysis.estrategias ?? [])].sort((a, b) => {
    if (a.id === "A") return -1;
    if (b.id === "A") return 1;
    return a.id.localeCompare(b.id);
  });
  const assumptions = analysis.premissas ?? [];

  function displayAssumptionValue(value: string | number | boolean | null) {
    if (value === null) return text.notProvided;
    if (typeof value === "boolean") return value ? text.yesValue : text.noValue;
    if (value === "nao_sei") return text.unknown;
    if (typeof value === "number") return formatNumber(value, lang);
    return value;
  }

  if (analysis.estado === "erro") {
    return (
      <div className="border border-[#c78155]/30 bg-[#f7ebe1] p-5" role="alert">
        <div className="flex gap-3">
          <AlertCircle aria-hidden className="mt-0.5 size-5 shrink-0 text-solo-900" />
          <div>
            <h2 className="font-display text-xl text-brand-900">{text.unavailableTitle}</h2>
            <p className="mt-2 text-sm leading-relaxed text-brand-900/75">
              {analysis.erro?.mensagem ?? text.notProvided}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {analysis.local && (
        <div className="grid grid-cols-2 gap-3 border border-brand-900/12 bg-white p-4 text-xs">
          <p>{text.latitude}: <strong className="font-mono text-brand-900">{formatNumber(analysis.local.latitude, lang, 5)}</strong></p>
          <p>{text.longitude}: <strong className="font-mono text-brand-900">{formatNumber(analysis.local.longitude, lang, 5)}</strong></p>
          {analysis.local.area_ha !== null && (
            <p className="col-span-2 border-t border-brand-900/10 pt-2">{text.area}: <strong className="text-brand-900">≈ {formatNumber(analysis.local.area_ha, lang)} {text.hectares}</strong></p>
          )}
        </div>
      )}
      {analysis.metadados?.avisos && analysis.metadados.avisos.length > 0 && (
        <section className="border-l-4 border-solo-600 bg-[#f7eee6] p-4" aria-label={text.partial}>
          <h2 className="flex items-center gap-2 text-sm font-semibold text-solo-900">
            <TriangleAlert aria-hidden className="size-4" />
            {text.partial}
          </h2>
          <ul className="mt-2 list-inside list-disc space-y-1 text-xs leading-relaxed text-brand-900/75">
            {analysis.metadados.avisos.map((warning) => (
              <li key={warning}>
                {analysis.id === "demo" ? text.demoWarning : warning}
              </li>
            ))}
          </ul>
        </section>
      )}

      {(rainfall.length > 0 || moisture) && (
        <section>
          <div className="mb-3 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl text-brand-900">{text.rainfall}</h2>
              <p className="mt-1 text-xs leading-relaxed text-brand-900/60">{text.rainfallDesc}</p>
            </div>
            <CloudRain aria-hidden className="size-5 shrink-0 text-solo-600" />
          </div>
          {rainfall.length > 0 && (
            <div className="space-y-3 border-y border-brand-900/10 py-4">
              <div className="flex gap-4 text-[10px] text-brand-900/65">
                <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-brand-700" />{text.historical}</span>
                <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-full bg-solo-600" />{text.current}</span>
              </div>
              {rainfall.map((month) => {
                const monthLabel = month.mes.includes("-")
                  ? new Intl.DateTimeFormat(lang === "pt" ? "pt-PT" : "en-GB", { month: "short", year: "numeric" }).format(new Date(`${month.mes}-01T12:00:00`))
                  : month.mes;
                return (
                  <div key={month.mes} className="grid grid-cols-[4.5rem_1fr_auto] items-center gap-x-3 gap-y-1.5">
                    <span className="row-span-2 text-[10px] capitalize text-brand-900/65">{monthLabel}</span>
                    <div className="h-2 overflow-hidden rounded-full bg-brand-900/8" aria-label={`${text.historical}: ${month.historico_mm ?? text.notProvided} mm`}>
                      <div className="h-full rounded-full bg-brand-700" style={{ width: `${maxRain > 0 && month.historico_mm !== null ? (month.historico_mm / maxRain) * 100 : 0}%` }} />
                    </div>
                    <span className="text-[10px] tabular-nums text-brand-900/70">{month.historico_mm === null ? "—" : `${formatNumber(month.historico_mm, lang)} mm`}</span>
                    <div className="h-2 overflow-hidden rounded-full bg-brand-900/8" aria-label={`${text.current}: ${month.atual_mm ?? text.notProvided} mm`}>
                      <div className="h-full rounded-full bg-solo-600" style={{ width: `${maxRain > 0 && month.atual_mm !== null ? (month.atual_mm / maxRain) * 100 : 0}%` }} />
                    </div>
                    <span className="text-[10px] tabular-nums text-brand-900/70">{month.atual_mm === null ? "—" : `${formatNumber(month.atual_mm, lang)} mm`}</span>
                  </div>
                );
              })}
            </div>
          )}
          {moisture && (
            <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 border-b border-brand-900/10 pb-4">
              <p className="inline-flex items-center gap-2 text-xs text-brand-900/70">
                <Droplets aria-hidden className="size-4 text-brand-700" />
                {text.soilMoisture}: <strong className="text-brand-900">{formatNumber(moisture.valor, lang)}</strong> {moisture.escala}
              </p>
              <p className="text-xs text-brand-900/70">{text.normal}: <strong className="text-brand-900">{formatNumber(moisture.normal, lang)}</strong> {moisture.escala}</p>
            </div>
          )}
          {analysis.metadados?.datas_dados && (
            <p className="mt-3 text-[11px] leading-relaxed text-brand-900/55">
              {text.dataPeriod}: {analysis.id === "demo" ? text.demoDataPeriod : analysis.metadados.datas_dados}
            </p>
          )}
        </section>
      )}

      {assumptions.length > 0 && (
        <section>
          <div className="mb-3 flex items-center justify-between gap-4">
            <h2 className="font-display text-2xl text-brand-900">{text.assumptions}</h2>
            <CircleHelp aria-hidden className="size-4 shrink-0 text-solo-600" />
          </div>
          <ul className="divide-y divide-brand-900/10 border-y border-brand-900/10 bg-white">
            {assumptions.map((assumption) => (
              <li key={assumption.id} className="grid gap-2 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-5">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-brand-900">{assumption.nome}</p>
                  <p className="mt-1 wrap-break-word text-xs text-brand-900/65">{displayAssumptionValue(assumption.valor)}</p>
                </div>
                <div className="flex flex-wrap gap-2 text-[10px]">
                  <span className="rounded-full bg-sage-200/55 px-2.5 py-1 text-brand-900/75">
                    {text.origin}: {assumption.origem === "agricultor" ? text.farmer : assumption.origem === "literatura" ? text.literature : text.nasa}
                  </span>
                  <span className={`rounded-full px-2.5 py-1 ${assumption.estado === "validada" ? "bg-sage-200 text-brand-900" : "bg-[#f4e3d3] text-solo-900"}`}>
                    {text.validation}: {assumption.estado === "validada" ? text.validated : text.toValidate}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="font-display text-2xl text-brand-900">{text.strategies}</h2>
          <span className="font-mono text-[10px] uppercase text-solo-600">{strategies.length} {text.results.toLowerCase()}</span>
        </div>
        {strategies.length > 0 ? (
          <div className="space-y-4">
            {strategies.map((strategy) => <StrategyResult key={strategy.id} strategy={strategy} text={text} lang={lang} />)}
          </div>
        ) : (
          <p className="border border-dashed border-brand-900/20 p-5 text-sm text-brand-900/65">{text.notProvided}</p>
        )}
      </section>

      {analysis.metadados?.fontes && analysis.metadados.fontes.length > 0 && (
        <p className="text-xs leading-relaxed text-brand-900/60">{text.sources}: {analysis.metadados.fontes.join(" · ")}</p>
      )}
    </div>
  );
}

export function DashboardClient() {
  const { lang } = useLanguage();
  const text = copy[lang];
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [point, setPoint] = useState<GeoPosition | null>(null);
  const [polygon, setPolygon] = useState<PolygonFeature | null>(null);
  const [draftPositions, setDraftPositions] = useState<GeoPosition[]>([]);
  const [drawing, setDrawing] = useState(false);
  const [cameraCenter, setCameraCenter] = useState<GeoPosition | null>(null);
  const [locationMessage, setLocationMessage] = useState("");
  const [hasCropNow, setHasCropNow] = useState<boolean | null>(null);
  const [currentCrop, setCurrentCrop] = useState("");
  const [plantDate, setPlantDate] = useState("");
  const [usualCrop, setUsualCrop] = useState("");
  const [irrigation, setIrrigation] = useState<boolean | null>(null);
  const [soil, setSoil] = useState<AnalysisRequest["tipo_solo"] | "">("");
  const [primaryGoal, setPrimaryGoal] = useState<Goal | "">("");
  const [secondaryGoal, setSecondaryGoal] = useState<Goal | "">("");
  const [seasons, setSeasons] = useState<1 | 2 | 3>(2);
  const [phase, setPhase] = useState<"form" | "analyzing" | "error" | "result">("form");
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [availableCrops, setAvailableCrops] = useState<Crop[]>([]);

  useEffect(() => {
    getCrops()
      .then((crops) => {
        if (crops && crops.length > 0) {
          setAvailableCrops(crops);
        }
      })
      .catch(() => {
        // Falha silenciosa: inputs mantêm comportamento livre
      });
  }, []);

  const measurement = polygon ? measurePolygon(polygon) : null;
  const selectedPosition = measurement?.point ?? point;
  const canContinueTerrain = selectedPosition !== null;
  const canContinueSituation = hasCropNow !== null && irrigation !== null && soil !== "" && (hasCropNow === false || currentCrop.trim().length > 0);
  // TODO(confirmar): acordar com o backend os limites de área que devem gerar aviso.

  function handleMapSelect(position: GeoPosition) {
    setLocationMessage("");
    if (drawing) {
      setDraftPositions((positions) => [...positions, position]);
      setPoint(position);
      setPolygon(null);
      return;
    }

    setPoint(position);
    setPolygon(null);
    setDraftPositions([]);
  }

  function startDrawing() {
    setDrawing(true);
    setPoint(null);
    setPolygon(null);
    setDraftPositions([]);
    setLocationMessage("");
  }

  function finishDrawing() {
    const nextPolygon = createPolygonFeature(draftPositions);
    if (!nextPolygon) return;
    setPolygon(nextPolygon);
    setPoint(measurePolygon(nextPolygon).point);
    setDraftPositions([]);
    setDrawing(false);
  }

  function clearTerrain() {
    setPoint(null);
    setPolygon(null);
    setDraftPositions([]);
    setDrawing(false);
    setLocationMessage("");
  }

  function locateUser() {
    if (!navigator.geolocation) {
      setLocationMessage(text.locationUnsupported);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const position: GeoPosition = [coords.longitude, coords.latitude];
        setCameraCenter(position);
        setLocationMessage(text.locationFound);
      },
      () => setLocationMessage(text.locationError),
      { enableHighAccuracy: false, timeout: 10_000 },
    );
  }

  function buildRequest(): AnalysisInput | null {
    if (!selectedPosition || !soil || irrigation === null || !primaryGoal) return null;
    const [longitude, latitude] = selectedPosition;

    return {
      latitude,
      longitude,
      poligono: polygon,
      area_ha: measurement?.areaHectares ?? null,
      cultura_atual: hasCropNow ? { nome: currentCrop.trim(), data_plantio: plantDate || null } : null,
      cultura_habitual: hasCropNow ? null : usualCrop.trim() || null,
      rega: irrigation,
      tipo_solo: soil,
      objetivo_principal: primaryGoal,
      objetivo_secundario: secondaryGoal || null,
      num_epocas: seasons,
    };
  }

  async function submitAnalysis() {
    const payload = buildRequest();
    if (!payload) return;

    setPhase("analyzing");
    setErrorMessage("");
    setAnalysis(null);

    try {
      const created = await createAnalysis(payload);
      const result = await waitForAnalysis(created.id);
      setAnalysis(result);
      setPhase("result");
    } catch (error) {
      setErrorMessage(error instanceof AnalysisApiError ? error.message : text.unavailableTitle);
      setPhase("error");
    }
  }

  function resetAnalysis() {
    setPhase("form");
    setAnalysis(null);
    setErrorMessage("");
    setStep(1);
  }

  function startNewAnalysis() {
    resetAnalysis();
    setPoint(null);
    setPolygon(null);
    setDraftPositions([]);
    setDrawing(false);
    setCameraCenter(null);
    setLocationMessage("");
    setHasCropNow(null);
    setCurrentCrop("");
    setPlantDate("");
    setUsualCrop("");
    setIrrigation(null);
    setSoil("");
    setPrimaryGoal("");
    setSecondaryGoal("");
    setSeasons(2);
  }

  const panelTitle = phase === "analyzing" ? text.analyzing : phase === "result" ? text.resultTitle : step === 1 ? text.title1 : step === 2 ? text.title2 : text.title3;
  const panelIntro = phase === "analyzing" ? text.analyzingCopy : step === 1 ? text.intro1 : step === 2 ? text.intro2 : text.intro3;

  return (
    <div className="min-h-screen bg-[#f6f7f2] text-brand-900">
      <header className="relative z-20 flex min-h-18 items-center justify-between border-b border-brand-900/10 bg-white/95 px-4 sm:px-7">
        <div className="flex min-w-0 items-center gap-4 sm:gap-6">
          <Link href="/" aria-label="NATERRA · página inicial" className="shrink-0">
            <Image src="/NATERRA_logo.png" alt="NATERRA" width={195} height={41} priority className="h-6 w-auto sm:h-7" />
          </Link>
          <span className="hidden h-7 w-px bg-brand-900/15 sm:block" />
          <div className="hidden min-w-0 sm:block">
            <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-solo-600">NATERRA · Field Shift</p>
            <p className="mt-0.5 truncate text-xs text-brand-900/65">{text.workspace}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <LanguageToggle />
          <Link href="/" className="hidden items-center gap-2 text-xs font-medium text-brand-900/70 transition-colors hover:text-brand-900 sm:inline-flex">
            <ArrowLeft aria-hidden className="size-4" />
            {text.backHome}
          </Link>
        </div>
      </header>

      <main className="mx-auto grid min-h-[calc(100svh-72px)] max-w-[1680px] grid-cols-1 lg:grid-cols-[minmax(360px,430px)_minmax(0,1fr)]">
        <section className="relative order-1 min-w-0 p-3 sm:p-5 lg:order-2 lg:p-5">
          <div className="relative h-[52svh] min-h-90 overflow-hidden border border-brand-900/12 bg-[#dce5d8] shadow-[0_12px_40px_rgba(27,52,30,0.12)] lg:h-[calc(100svh-112px)]">
            <MapCanvas
              point={point}
              polygon={polygon}
              draftPositions={draftPositions}
              drawing={drawing}
              cameraCenter={cameraCenter}
              onMapSelect={handleMapSelect}
            />
            <div className="pointer-events-none absolute inset-x-3 top-3 z-[500] flex items-start justify-between gap-2 sm:inset-x-4 sm:top-4">
              <div className="rounded-lg border border-white/80 bg-white/95 px-3 py-2 shadow-sm backdrop-blur-sm">
                <p className="flex items-center gap-2 text-xs font-semibold text-brand-900">
                  <Satellite aria-hidden className="size-4 text-brand-700" />
                  {text.mapTitle}
                </p>
                <p className="mt-1 pl-6 font-mono text-[9px] uppercase tracking-[0.12em] text-brand-900/55">{text.mapYear}</p>
              </div>
              <button
                type="button"
                onClick={locateUser}
                className="pointer-events-auto inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/80 bg-white/95 px-3 text-xs font-semibold text-brand-900 shadow-sm backdrop-blur-sm transition-colors hover:bg-white"
              >
                <LocateFixed aria-hidden className="size-4 text-brand-700" />
                <span className="hidden sm:inline">{text.locate}</span>
              </button>
            </div>

            <div className="absolute bottom-20 left-3 z-[500] flex max-w-[calc(100%-2rem)] flex-wrap items-center gap-2 sm:bottom-10 sm:left-4">
              <button
                type="button"
                onClick={() => { setDrawing(false); setDraftPositions([]); setPoint(null); setPolygon(null); }}
                aria-pressed={!drawing}
                className={`inline-flex min-h-10 items-center gap-2 rounded-lg border px-3 text-xs font-semibold shadow-sm transition-colors ${!drawing ? "border-brand-900 bg-brand-900 text-white" : "border-white/80 bg-white/95 text-brand-900 hover:bg-white"}`}
              >
                <MapPin aria-hidden className="size-4" />
                {text.point}
              </button>
              <button
                type="button"
                onClick={startDrawing}
                aria-pressed={drawing}
                className={`inline-flex min-h-10 items-center gap-2 rounded-lg border px-3 text-xs font-semibold shadow-sm transition-colors ${drawing ? "border-brand-900 bg-brand-900 text-white" : "border-white/80 bg-white/95 text-brand-900 hover:bg-white"}`}
              >
                <Map aria-hidden className="size-4" />
                {text.draw}
              </button>
              {drawing && (
                <>
                  <button type="button" onClick={() => setDraftPositions((positions) => positions.slice(0, -1))} disabled={draftPositions.length === 0} aria-label={text.undo} title={text.undo} className="inline-flex size-10 items-center justify-center rounded-lg border border-white/80 bg-white/95 text-brand-900 shadow-sm disabled:opacity-40">
                    <RotateCcw aria-hidden className="size-4" />
                  </button>
                  <button type="button" onClick={finishDrawing} disabled={draftPositions.length < 3} className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-brand-900 bg-brand-900 px-3 text-xs font-semibold text-white shadow-sm disabled:cursor-not-allowed disabled:opacity-45">
                    <Check aria-hidden className="size-4" />
                    <span className="hidden sm:inline">{text.finish}</span>
                  </button>
                </>
              )}
              {(point || polygon || draftPositions.length > 0) && !drawing && (
                <button type="button" onClick={clearTerrain} aria-label={text.clear} title={text.clear} className="inline-flex size-10 items-center justify-center rounded-lg border border-white/80 bg-white/95 text-brand-900 shadow-sm hover:bg-white">
                  <RotateCcw aria-hidden className="size-4" />
                </button>
              )}
            </div>
            {drawing && (
              <p className="absolute bottom-36 left-3 z-[500] max-w-xs rounded-lg bg-brand-900/90 px-3 py-2 text-[11px] leading-relaxed text-white shadow-sm sm:bottom-22 sm:left-4">
                {text.drawing}
              </p>
            )}
            {locationMessage && (
              <p role="status" className="absolute right-3 top-[4.8rem] z-[500] max-w-[min(22rem,calc(100%-1.5rem))] rounded-lg border border-white/80 bg-white/95 px-3 py-2 text-[11px] leading-relaxed text-brand-900 shadow-sm sm:right-4">
                {locationMessage}
              </p>
            )}
          </div>
        </section>

        <aside className="order-2 min-w-0 bg-[#f6f7f2] px-5 pb-8 pt-4 sm:px-8 sm:pb-10 lg:order-1 lg:h-[calc(100svh-72px)] lg:overflow-y-auto lg:border-r lg:border-brand-900/10 lg:px-8 lg:py-7">
          <div className="mx-auto max-w-xl lg:mx-0">
            {phase === "form" && (
              <>
                <div className="mb-7 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-solo-600">{text.newAnalysis}</p>
                    <p className="mt-1 text-xs text-brand-900/55">{text.stepLabel} {step} {text.of} 3</p>
                  </div>
                  <Compass aria-hidden className="size-5 text-brand-700" />
                </div>
                <StepIndicator step={step} text={text} />
                <div className="mt-8">
                  <h1 className="font-display text-3xl leading-tight text-brand-900 sm:text-4xl">{panelTitle}</h1>
                  <p className="mt-3 text-sm leading-relaxed text-brand-900/65">{panelIntro}</p>
                </div>

                {step === 1 && (
                  <div className="mt-7 space-y-5">
                    <div className="border border-brand-900/12 bg-white p-4 sm:p-5">
                      <div className="flex items-start gap-3">
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sage-200/70 text-brand-700">
                          {polygon ? <CheckCircle2 aria-hidden className="size-5" /> : <MapPin aria-hidden className="size-5" />}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold uppercase tracking-wide text-brand-900/55">{text.area}</p>
                          {measurement ? (
                            <>
                              <p className="mt-1 font-display text-2xl text-brand-900">≈ {formatNumber(measurement.areaHectares, lang)} {text.hectares}</p>
                              <p className="mt-1 text-xs text-brand-900/60">({formatNumber(measurement.areaSquareKilometers, lang, 4)} {text.squareKm})</p>
                            </>
                          ) : point ? (
                            <>
                              <p className="mt-1 text-sm font-semibold text-brand-900">{text.selectedPoint}</p>
                            </>
                          ) : (
                            <p className="mt-1 text-sm text-brand-900/65">{text.noSelection}</p>
                          )}
                          {selectedPosition && (
                            <p className="mt-2 text-[11px] leading-relaxed text-brand-900/65">
                              {text.latitude}: {formatNumber(selectedPosition[1], lang, 5)} · {text.longitude}: {formatNumber(selectedPosition[0], lang, 5)}
                            </p>
                          )}
                        </div>
                      </div>
                      {!measurement && (
                        <p className="mt-4 flex items-start gap-2 border-t border-brand-900/10 pt-3 text-[11px] leading-relaxed text-brand-900/60">
                          <CircleHelp aria-hidden className="mt-0.5 size-4 shrink-0 text-solo-600" />
                          {text.areaHint}
                        </p>
                      )}
                    </div>
                    <button type="button" onClick={() => setStep(2)} disabled={!canContinueTerrain} className="group inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-brand-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-900/25">
                      {text.continue}<ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </button>
                  </div>
                )}

                {step === 2 && (
                  <div className="mt-7 space-y-6">
                    <fieldset>
                      <legend className="mb-2 text-sm font-semibold text-brand-900">{text.plantedQuestion}</legend>
                      <div className="grid grid-cols-2 gap-2">
                        {[{ value: true, label: text.yes }, { value: false, label: text.no }].map((option) => (
                          <button key={String(option.value)} type="button" aria-pressed={hasCropNow === option.value} onClick={() => setHasCropNow(option.value)} className={`min-h-11 rounded-lg border text-sm font-medium transition-colors ${hasCropNow === option.value ? "border-brand-900 bg-brand-900 text-white" : "border-brand-900/15 bg-white text-brand-900 hover:border-brand-700"}`}>
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </fieldset>

                    {availableCrops.length > 0 && (
                      <datalist id="crops-list">
                        {availableCrops.map((crop) => (
                          <option key={crop.id} value={crop.nome} />
                        ))}
                      </datalist>
                    )}

                    {hasCropNow === true && (
                      <div>
                        <FieldLabel htmlFor="current-crop">{text.cropNow}</FieldLabel>
                        <input id="current-crop" list="crops-list" value={currentCrop} onChange={(event) => setCurrentCrop(event.target.value)} placeholder={text.cropNowPlaceholder} className="min-h-11 w-full rounded-lg border border-brand-900/15 bg-white px-3 text-sm text-brand-900 placeholder:text-brand-900/40 focus:border-brand-700 focus:outline-none" />
                        <FieldLabel htmlFor="plant-date" >{text.plantDate}</FieldLabel>
                        <input id="plant-date" type="date" value={plantDate} onChange={(event) => setPlantDate(event.target.value)} className="min-h-11 w-full rounded-lg border border-brand-900/15 bg-white px-3 text-sm text-brand-900 focus:border-brand-700 focus:outline-none" />
                      </div>
                    )}
                    {hasCropNow === false && (
                      <div>
                        <FieldLabel htmlFor="usual-crop">{text.usualCrop}</FieldLabel>
                        <input id="usual-crop" list="crops-list" value={usualCrop} onChange={(event) => setUsualCrop(event.target.value)} placeholder={text.usualCropPlaceholder} className="min-h-11 w-full rounded-lg border border-brand-900/15 bg-white px-3 text-sm text-brand-900 placeholder:text-brand-900/40 focus:border-brand-700 focus:outline-none" />
                      </div>
                    )}

                    <fieldset>
                      <legend className="mb-2 text-sm font-semibold text-brand-900">{text.irrigation}</legend>
                      <div className="grid grid-cols-2 gap-2">
                        {[{ value: true, label: text.yes }, { value: false, label: text.no }].map((option) => (
                          <button key={String(option.value)} type="button" aria-pressed={irrigation === option.value} onClick={() => setIrrigation(option.value)} className={`min-h-11 rounded-lg border text-sm font-medium transition-colors ${irrigation === option.value ? "border-brand-900 bg-brand-900 text-white" : "border-brand-900/15 bg-white text-brand-900 hover:border-brand-700"}`}>
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </fieldset>

                    <div>
                      <FieldLabel htmlFor="soil-type">{text.soil}</FieldLabel>
                      <select id="soil-type" value={soil} onChange={(event) => setSoil(event.target.value as AnalysisRequest["tipo_solo"] | "")} className="min-h-11 w-full rounded-lg border border-brand-900/15 bg-white px-3 text-sm text-brand-900 focus:border-brand-700 focus:outline-none">
                        <option value="">{text.choose}</option>
                        <option value="nao_sei">{text.soilUnknown}</option>
                        <option value="arenoso">{text.sandy}</option>
                        <option value="franco">{text.loam}</option>
                        <option value="argiloso">{text.clay}</option>
                      </select>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button type="button" onClick={() => setStep(1)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-brand-900/20 px-5 text-sm font-semibold text-brand-900 hover:bg-sage-200/50"><ArrowLeft aria-hidden className="size-4" />{text.back}</button>
                      <button type="button" onClick={() => setStep(3)} disabled={!canContinueSituation} className="group inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-brand-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-900/25">{text.continue}<ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" /></button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="mt-7 space-y-6">
                    <fieldset>
                      <legend className="mb-3 text-sm font-semibold text-brand-900">{text.primaryGoal}</legend>
                      <div className="space-y-2">
                        {goals.map((goal) => (
                          <button key={goal.value} type="button" aria-pressed={primaryGoal === goal.value} onClick={() => setPrimaryGoal(goal.value)} className={`flex min-h-12 w-full items-center gap-3 rounded-lg border px-3 text-left text-sm transition-colors ${primaryGoal === goal.value ? "border-brand-900 bg-sage-200/65 font-semibold text-brand-900" : "border-brand-900/15 bg-white text-brand-900/80 hover:border-brand-700"}`}>
                            <span className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${primaryGoal === goal.value ? "border-brand-700 bg-brand-700 text-white" : "border-brand-900/25"}`}>{primaryGoal === goal.value && <Check aria-hidden className="size-3.5" />}</span>
                            {text[goal.label]}
                          </button>
                        ))}
                      </div>
                    </fieldset>

                    <div>
                      <FieldLabel htmlFor="secondary-goal">{text.secondaryGoal}</FieldLabel>
                      <select id="secondary-goal" value={secondaryGoal} onChange={(event) => setSecondaryGoal(event.target.value as Goal | "")} className="min-h-11 w-full rounded-lg border border-brand-900/15 bg-white px-3 text-sm text-brand-900 focus:border-brand-700 focus:outline-none">
                        <option value="">{text.noSecondary}</option>
                        {goals.filter((goal) => goal.value !== primaryGoal).map((goal) => <option key={goal.value} value={goal.value}>{text[goal.label]}</option>)}
                      </select>
                    </div>

                    <div>
                      <FieldLabel htmlFor="seasons">{text.seasons}</FieldLabel>
                      <div className="grid grid-cols-3 gap-2" id="seasons">
                        {([1, 2, 3] as const).map((number) => (
                          <button key={number} type="button" aria-pressed={seasons === number} onClick={() => setSeasons(number)} className={`min-h-11 rounded-lg border text-xs font-semibold transition-colors ${seasons === number ? "border-brand-900 bg-brand-900 text-white" : "border-brand-900/15 bg-white text-brand-900 hover:border-brand-700"}`}>
                            {number === 1 ? text.seasonOne : number === 2 ? text.seasonTwo : text.seasonThree}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 border-l-2 border-solo-600 pl-3">
                      <p className="text-[11px] leading-relaxed text-brand-900/70">{text.advice}</p>
                      <p className="text-[11px] leading-relaxed text-brand-900/70">{text.noForecast}</p>
                      <p className="text-[11px] leading-relaxed text-brand-900/70">{text.resolution}</p>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button type="button" onClick={() => setStep(2)} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-brand-900/20 px-5 text-sm font-semibold text-brand-900 hover:bg-sage-200/50"><ArrowLeft aria-hidden className="size-4" />{text.back}</button>
                      <button type="button" onClick={submitAnalysis} disabled={!primaryGoal} className="group inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-full bg-brand-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-900/25">{text.analyze}<ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" /></button>
                    </div>
                  </div>
                )}
              </>
            )}

            {phase === "analyzing" && (
              <div className="flex min-h-[55vh] flex-col justify-center py-10 lg:min-h-[60vh]">
                <span className="flex size-12 items-center justify-center rounded-full bg-sage-200/70 text-brand-700"><Satellite aria-hidden className="size-6 animate-pulse" /></span>
                <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-solo-600">NATERRA · Field Shift</p>
                <h1 className="mt-3 font-display text-3xl text-brand-900">{panelTitle}</h1>
                <p className="mt-3 max-w-sm text-sm leading-relaxed text-brand-900/65">{panelIntro}</p>
                <div className="mt-7 flex items-center gap-3 border-t border-brand-900/12 pt-5 text-xs text-brand-900/65">
                  <span className="size-2 animate-pulse rounded-full bg-solo-600" />
                  {text.waiting}
                </div>
              </div>
            )}

            {phase === "error" && (
              <div className="py-10">
                <span className="flex size-12 items-center justify-center rounded-full bg-[#f4e3d3] text-solo-900"><AlertCircle aria-hidden className="size-6" /></span>
                <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.14em] text-solo-600">{text.newAnalysis}</p>
                <h1 className="mt-3 font-display text-3xl text-brand-900">{text.unavailableTitle}</h1>
                <p role="alert" className="mt-3 text-sm leading-relaxed text-brand-900/70">{errorMessage || text.unconfigured}</p>
                <div className="mt-7 flex flex-wrap gap-2">
                  <button type="button" onClick={submitAnalysis} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-brand-900 px-5 text-sm font-semibold text-white hover:bg-brand-700"><RotateCcw aria-hidden className="size-4" />{text.retry}</button>
                  <button type="button" onClick={resetAnalysis} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-brand-900/20 px-5 text-sm font-semibold text-brand-900 hover:bg-sage-200/50"><ArrowLeft aria-hidden className="size-4" />{text.back}</button>
                </div>
              </div>
            )}

            {phase === "result" && analysis && (
              <div className="py-2 sm:py-4">
                <div className="mb-7 flex items-start justify-between gap-4">
                  <div>
                    <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-solo-600"><CheckCircle2 aria-hidden className="size-4" />{text.results}</p>
                    <h1 className="mt-3 font-display text-3xl leading-tight text-brand-900">{text.resultTitle}</h1>
                    {analysis.versao_analise && <p className="mt-1 text-xs text-brand-900/55">v{analysis.versao_analise}</p>}
                  </div>
                  <button type="button" onClick={startNewAnalysis} aria-label={text.startOver} title={text.startOver} className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-brand-900/20 text-brand-900 hover:bg-sage-200/50"><Plus aria-hidden className="size-5" /></button>
                </div>
                <AnalysisResults analysis={analysis} text={text} lang={lang} />
                <div className="mt-8 border-t border-brand-900/12 pt-5">
                  <button type="button" onClick={startNewAnalysis} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-brand-900/20 px-5 text-sm font-semibold text-brand-900 hover:bg-sage-200/50"><RotateCcw aria-hidden className="size-4" />{text.startOver}<ChevronRight aria-hidden className="size-4" /></button>
                </div>
              </div>
            )}
          </div>
        </aside>
      </main>

      <footer className="border-t border-brand-900/10 bg-white px-5 py-4 sm:px-8">
        <p className="mx-auto flex max-w-7xl items-start gap-2 text-[10px] leading-relaxed text-brand-900/55">
          <TriangleAlert aria-hidden className="mt-px size-3.5 shrink-0 text-solo-600" />
          {text.advice}
        </p>
      </footer>
    </div>
  );
}
