import type { AxiosResponse } from "axios";
import type {
  Range,
  PrimerDesignRequest,
  PrimerCandidate,
  PrimerDesignResponse,
} from "@/types";
import { apiClient } from "./client";

export type { Range, PrimerCandidate };

export const postDesignPrimers = async (
  payload: PrimerDesignRequest,
): Promise<PrimerDesignResponse> => {
  const response: AxiosResponse<PrimerDesignResponse> = await apiClient.post(
    "/api/v1/primer/design",
    payload,
  );

  return response.data;
};
