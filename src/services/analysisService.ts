// eslint-disable-next-line @typescript-eslint/no-unused-vars -- keep import for the future real request
import { api } from "@/lib/api/client";

export interface AnalyzeRequest {
  target_sequence: string;
  species: string;
  analysis_type?: string;
  reference_genome?: string;
  notes?: string;
}

export interface AnalyzeResponse {
  result: string;
  score: number;
  details: Record<string, unknown> | string;
}

const ANALYSIS_ENDPOINT = "/api/v1/analysis";

export const analyzeGenome = async (
  payload: AnalyzeRequest,
): Promise<AnalyzeResponse> => {
  // Uncomment the lines below when the backend is ready.
  // const response = await api.post<AnalyzeResponse>(ANALYSIS_ENDPOINT, payload);
  // return response.data;

  const sequenceLength = payload.target_sequence.length || 5000;

  const mockGenome = {
    length: Math.max(sequenceLength, 6000),
    tracks: [
      {
        id: "primers",
        name: "Primer Candidates",
        height: 28,
        features: [
          { id: "p1", start: 500, end: 900, label: "P-Forward", color: "#2563eb" },
          { id: "p2", start: 1300, end: 1700, label: "P-Reverse", color: "#22c55e" },
          { id: "p3", start: 2400, end: 2800, label: "Alt-P", color: "#eab308" },
        ],
      },
      {
        id: "target",
        name: "Target Region",
        height: 18,
        features: [
          { id: "t1", start: 1100, end: 2300, label: "Amplicon", color: "#f97316" },
        ],
      },
    ],
  };

  const mockResponse: AnalyzeResponse = {
    result: "Success",
    score: 98.5,
    details: {
      summary: "Mock genome analysis completed.",
      analysis_endpoint: ANALYSIS_ENDPOINT,
      target_sequence_preview: payload.target_sequence.slice(0, 20),
      species: payload.species,
      detected_markers: ["BRCA1", "TP53"],
      gc_content: "51.2%",
      genome: mockGenome,
    },
  };

  return new Promise((resolve) => {
    setTimeout(() => resolve(mockResponse), 1500);
  });
};
