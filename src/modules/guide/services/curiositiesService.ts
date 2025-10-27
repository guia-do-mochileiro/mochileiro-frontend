
import { api } from "#/config/apiConfig";

export type CuriosityResponse = {
  curiosity: string;
};


export async function getRandomCuriosity(): Promise<string> {
  const { data } = await api.get<CuriosityResponse>("/api/curiosities/random");
  
  return data?.curiosity ?? "";
}
