import { api } from "#/config/apiConfig";

const API_URL_LOGIN = `/api/auth/login`;

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: string;
  token: string;
}

// util p/ setar cookie com opções seguras
function setCookie(
  name: string,
  value: string,
  days = 7, // expiração padrão (ajuste se quiser)
) {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  // SameSite=Lax cobre a maioria dos fluxos SPA; se precisar cross-site, estude SameSite=None; Secure
  document.cookie = `${name}=${encodeURIComponent(
    value,
  )}; Expires=${expires}; Path=/; SameSite=Lax`;
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  try {
    const response = await api.post<LoginResponse>(API_URL_LOGIN, data);
    const result = response.data;

    // guarda o token em cookie
    setCookie("authToken", result.token);

    // se quiser também guardar o id em cookie
    setCookie("userId", result.id);

    return result;
  } catch (err: any) {
    // normalizar a msg
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      "Erro ao realizar login.";
    throw new Error(msg);
  }
}
