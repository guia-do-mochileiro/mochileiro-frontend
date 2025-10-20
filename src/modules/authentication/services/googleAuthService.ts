// src/modules/authentication/services/googleAuthService.ts
import { api } from "#/config/apiConfig";

const API_URL_GOOGLE = "/api/auth/login/google";

export interface GoogleLoginResponse {
  id: string;
  token: string;
  insertAdditionalData: boolean;
}

export function setCookie(name: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; Expires=${expires}; Path=/; SameSite=Lax`;
}

export async function loginWithGoogle(idToken: string): Promise<GoogleLoginResponse> {
  try {
    const { data } = await api.post<GoogleLoginResponse>(API_URL_GOOGLE, { idToken });

    const insertAdditionalData =
      typeof (data as any)?.insertAdditionalData === "boolean"
        ? (data as any).insertAdditionalData
        : false;

    // cookies padrão
    setCookie("authToken", data.token);
    setCookie("userId", data.id);

    // 👇 grava a flag que o GuidePage lê
    setCookie("insertAdditionalDataRequired", insertAdditionalData ? "1" : "0", 1);

    return {
      id: data.id,
      token: data.token,
      insertAdditionalData,
    };
  } catch (err: any) {
    const msg = err?.response?.data?.message || err?.message || "Erro ao autenticar com Google.";
    throw new Error(msg);
  }
}
