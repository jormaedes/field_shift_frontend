import type { AnalysisInput, AnalysisResponse, Crop, CropsResponse } from "@/types/analysis";
import mockAnalysis from "@/mocks/analise.v1.json";

const mockTemplate = mockAnalysis as unknown as AnalysisResponse;
let lastMockRequest: AnalysisInput | null = null;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export class AnalysisApiError extends Error {
  codigo?: string;

  constructor(message: string, codigo?: string) {
    super(message);
    this.name = "AnalysisApiError";
    this.codigo = codigo;
  }
}

// Cache local em memória para evitar pedidos duplicados ao backend
const analysisCache = new Map<string, AnalysisResponse>();

/**
 * Cria uma nova análise enviando os parâmetros da parcela para o backend.
 */
export async function createAnalysis(
  payload: AnalysisInput,
): Promise<{ id: string; estado: AnalysisResponse["estado"] }> {
  if (USE_MOCK) {
    lastMockRequest = payload;
    return { id: mockTemplate.id, estado: "concluida" as const };
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/analises`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      let errorMessage = "Erro ao submeter a análise ao backend.";
      let errorCode: string | undefined;
      try {
        const errorJson = await response.json();
        errorMessage = errorJson?.erro?.mensagem || errorJson?.error || errorMessage;
        errorCode = errorJson?.erro?.codigo;
      } catch {
        // Ignora erro de parse e mantém a mensagem padrão
      }
      throw new AnalysisApiError(errorMessage, errorCode);
    }

    const data: AnalysisResponse = await response.json();
    analysisCache.set(data.id, data);
    return { id: data.id, estado: data.estado };
  } catch (error) {
    if (error instanceof AnalysisApiError) throw error;
    throw new AnalysisApiError(
      "Não foi possível ligar ao servidor de análises. Verifique se o backend está em execução.",
    );
  }
}

/**
 * Devolve os resultados de uma análise criada pelo seu ID.
 */
export async function getAnalysis(id: string): Promise<AnalysisResponse> {
  if (USE_MOCK) {
    if (id !== mockTemplate.id) {
      throw new AnalysisApiError("A análise local pedida não existe.");
    }

    const analysis = structuredClone(mockTemplate);
    const mockRequest = lastMockRequest;
    if (mockRequest) {
      analysis.local = {
        latitude: mockRequest.latitude,
        longitude: mockRequest.longitude,
        area_ha: mockRequest.area_ha,
      };
      analysis.premissas = analysis.premissas?.map((assumption) =>
        assumption.id === "tipo_solo"
          ? { ...assumption, valor: mockRequest.tipo_solo }
          : assumption,
      ) ?? null;
    }
    return analysis;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/analises/${id}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      let errorMessage = "Análise não encontrada no servidor.";
      let errorCode: string | undefined;
      try {
        const errorJson = await response.json();
        errorMessage = errorJson?.erro?.mensagem || errorMessage;
        errorCode = errorJson?.erro?.codigo;
      } catch {
        // Ignora erro de parse
      }
      throw new AnalysisApiError(errorMessage, errorCode);
    }

    const data: AnalysisResponse = await response.json();
    analysisCache.set(data.id, data);
    return data;
  } catch (error) {
    if (error instanceof AnalysisApiError) throw error;
    throw new AnalysisApiError(
      "Erro de comunicação ao obter os resultados da análise.",
    );
  }
}

/**
 * Aguarda pela conclusão de uma análise, efetuando polling seguro enquanto estiver 'a_processar'.
 */
export async function waitForAnalysis(
  id: string,
  maxWaitMs = 45_000,
  pollIntervalMs = 2_500,
): Promise<AnalysisResponse> {
  // Se o resultado já veio completo no POST e está em cache, devolve de imediato
  const cached = analysisCache.get(id);
  if (cached && cached.estado === "concluida") {
    return cached;
  }

  const startTime = Date.now();

  while (Date.now() - startTime < maxWaitMs) {
    const result = await getAnalysis(id);
    if (result.estado === "concluida") {
      return result;
    }
    if (result.estado === "erro") {
      throw new AnalysisApiError(
        result.erro?.mensagem || "Ocorreu um erro ao processar a análise no backend.",
        result.erro?.codigo,
      );
    }
    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }

  throw new AnalysisApiError(
    "O tempo de espera pela análise expirou. Por favor, tente novamente.",
    "timeout",
  );
}

/**
 * Atualiza premissas (ex.: tipo de solo, rega) e devolve uma nova versão recalculada da análise.
 */
export async function updatePremises(
  id: string,
  premises: { tipo_solo?: string; rega?: boolean },
): Promise<AnalysisResponse> {
  if (USE_MOCK) {
    const mock = await getAnalysis(id);
    if (premises.tipo_solo && mock.premissas) {
      mock.premissas = mock.premissas.map((p) =>
        p.id === "tipo_solo" ? { ...p, valor: premises.tipo_solo!, estado: "validada" } : p,
      );
    }
    if (typeof premises.rega === "boolean" && mock.premissas) {
      mock.premissas = mock.premissas.map((p) =>
        p.id === "rega" ? { ...p, valor: premises.rega!, estado: "validada" } : p,
      );
    }
    mock.versao_analise = (mock.versao_analise ?? 1) + 1;
    return mock;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/analises/${id}/premissas`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(premises),
    });

    if (!response.ok) {
      let errorMessage = "Erro ao atualizar as premissas.";
      try {
        const errorJson = await response.json();
        errorMessage = errorJson?.erro?.mensagem || errorMessage;
      } catch {
        // Ignora erro de parse
      }
      throw new AnalysisApiError(errorMessage);
    }

    const data: AnalysisResponse = await response.json();
    analysisCache.set(data.id, data);
    return data;
  } catch (error) {
    if (error instanceof AnalysisApiError) throw error;
    throw new AnalysisApiError(
      "Não foi possível comunicar as novas premissas ao servidor.",
    );
  }
}

/**
 * Obtém a lista oficial de culturas de Angola registadas na base de dados do backend.
 */
export async function getCrops(): Promise<Crop[]> {
  if (USE_MOCK) {
    return [
      { id: "milho", nome: "Milho" },
      { id: "feijao_vulgar", nome: "Feijão Vulgar (Manteiga / Catarino)" },
      { id: "feijao_macunde", nome: "Feijão-macunde (Caupi)" },
      { id: "mandioca", nome: "Mandioca" },
      { id: "batata_doce", nome: "Batata-doce" },
      { id: "ginguba", nome: "Ginguba (Amendoim)" },
      { id: "massambala", nome: "Massambala (Sorgo)" },
    ];
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/culturas`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) return [];
    const data: CropsResponse = await response.json();
    return data.crops || [];
  } catch {
    return [];
  }
}
