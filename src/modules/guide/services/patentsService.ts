import { api } from "#/config/apiConfig";

export type PatentName =
  | "PIONEIRO"
  | "EXPLORADOR"
  | "NAVEGADOR"
  | "AVENTUREIRO"
  | "VIAJANTE"
  | "GUARDIÃO"
  | "LENDÁRIO";

export type PatentProgress = {
  id: string;
  name: PatentName | string;
  requiredPoints: number;
  unlocked: boolean;
  currentPoints: number;
};

type Paginated<T> = { content: T[] };

export async function fetchPatents(): Promise<PatentProgress[]> {
  const { data } = await api.get<Paginated<PatentProgress>>("/api/patents");
  return data?.content ?? [];
}
