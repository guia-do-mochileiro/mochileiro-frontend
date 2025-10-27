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


function setCookie(
  name: string,
  value: string,
  days = 7, 
) {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  
  document.cookie = `${name}=${encodeURIComponent(
    value,
  )}; Expires=${expires}; Path=/; SameSite=Lax`;
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  try {
    const response = await api.post<LoginResponse>(API_URL_LOGIN, data);
    const result = response.data;

    
    setCookie("authToken", result.token);

    
    setCookie("userId", result.id);

    return result;
  } catch (err: any) {
    
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      "Erro ao realizar login.";
    throw new Error(msg);
  }
}
