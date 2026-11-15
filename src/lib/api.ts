import type { AnalysisInput, AnalysisResponse } from "@/types/analysis";
import mockAnalysis from "@/mocks/analise.v1.json";

const mockTemplate = mockAnalysis as unknown as AnalysisResponse;
let lastMockRequest: AnalysisInput | null = null;

export class AnalysisApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AnalysisApiError";
  }
}

export async function createAnalysis(payload: AnalysisInput) {
  lastMockRequest = payload;
  return { id: mockTemplate.id, estado: "concluida" as const };
}

export async function getAnalysis(id: string) {
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

export async function waitForAnalysis(
  id: string,
): Promise<AnalysisResponse> {
  return getAnalysis(id);
}
