"use client";

import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type {
  PrimerDesignRequest,
  PrimerDesignResponse,
} from "@/lib/api/primer";
import { postDesignPrimers } from "@/lib/api/primer";

export const usePrimerDesign = () =>
  useMutation<PrimerDesignResponse, AxiosError, PrimerDesignRequest>({
    mutationFn: postDesignPrimers,
    onSuccess: (data) => {
      console.log("Primer design success", data);
      return data;
    },
    onError: (error) => {
      console.error("Primer design failed", error);
    },
  });

export default usePrimerDesign;
