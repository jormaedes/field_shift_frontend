import type { PolygonFeature } from "@/lib/geo";

export type AnalysisState = "a_processar" | "concluida" | "erro";
export type ConfidenceLevel = "alta" | "media" | "baixa";

export type AnalysisRequest = {
  latitude: number;
  longitude: number;
  poligono: PolygonFeature;
  area_ha: number;
  cultura_atual: { nome: string; data_plantio: string | null } | null;
  cultura_habitual: string | null;
  rega: boolean;
  tipo_solo: "arenoso" | "franco" | "argiloso" | "nao_sei";
  objetivo_principal: "saude_solo" | "economizar_agua" | "reduzir_erosao" | "aumentar_rendimento";
  objetivo_secundario: "saude_solo" | "economizar_agua" | "reduzir_erosao" | "aumentar_rendimento" | null;
  num_epocas: 1 | 2 | 3;
};

export type AnalysisInput = Omit<AnalysisRequest, "poligono" | "area_ha"> & {
  poligono: PolygonFeature | null;
  area_ha: number | null;
};

export type MonthlyRainfall = {
  mes: string;
  historico_mm: number | null;
  atual_mm: number | null;
};

export type Strategy = {
  id: string;
  nome: string;
  sequencia: { epoca: number; cultura: string }[];
  pontuacao: number | null;
  pontuacao_por_criterio?: Record<string, number> | null;
  confianca: ConfidenceLevel;
  porque: string | null;
  evidencia: string | null;
  beneficios: string | null;
  lacunas: string | null;
  riscos: string | null;
  fontes: string[];
};

export type AnalysisResponse = {
  id: string;
  estado: AnalysisState;
  versao_analise?: number;
  local?: {
    latitude: number;
    longitude: number;
    area_ha: number | null;
  } | null;
  condicoes?: {
    chuva_mensal?: MonthlyRainfall[] | null;
    inicio_epoca?: { data_tipica: string; por_ano: unknown[] } | null;
    humidade_solo?: { valor: number; normal: number; escala: string } | null;
    campo_nu?: unknown[] | null;
    declive?: number | null;
  } | null;
  estado_epoca?: unknown | null;
  estrategias?: Strategy[] | null;
  cuidados?: unknown | null;
  premissas?: {
    id: string;
    nome: string;
    valor: string | number | boolean | null;
    tipo: "select" | "number" | "boolean";
    opcoes?: string[];
    origem: "agricultor" | "literatura" | "nasa";
    estado: "por_validar" | "validada";
    editavel: boolean;
  }[] | null;
  metadados?: {
    fontes?: string[];
    resolucoes?: string;
    datas_dados?: string;
    avisos?: string[];
  } | null;
  erro?: { codigo?: string; mensagem?: string } | null;
};
