// src/modules/guide/services/curiositiesService.ts
import { api } from "#/config/apiConfig";

export type CuriosityResponse = {
  curiosity: string;
};

/** Busca uma curiosidade aleatória no backend. */
export async function getRandomCuriosity(): Promise<string> {
  const { data } = await api.get<CuriosityResponse>("/api/curiosities/random");
  // o schema do swagger mostra { curiosity: "string" }
  return data?.curiosity ?? "";
}
