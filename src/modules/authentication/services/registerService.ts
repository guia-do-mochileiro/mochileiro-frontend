// src/modules/authentication/services/registerService.ts
import { api } from "#/config/apiConfig";

export type Gender = "MASCULINO" | "FEMININO" | "OUTRO";

type RegisterIn = {
  username: string;
  email: string;
  password: string;
  birthDate: string; // ISO "yyyy-mm-dd"
  gender: Gender;
};

export function toISODateFromBR(br: string): string {
  const m = br.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return "";
  const [, d, mm, y] = m;
  return `${y}-${mm}-${d}`;
}

export async function register(payload: RegisterIn) {
  try {
    const { data } = await api.post("/api/auth/register", payload);
    return data;
  } catch (err: any) {
    // Extrai a melhor mensagem possível do backend
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      "Falha ao registrar.";
    const e = new Error(msg);
    (e as any).status = err?.response?.status;
    throw e; // importante propagar para o catch do componente
  }
}
