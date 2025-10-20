// src/config/apiConfig.ts
import axios from "axios";
import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
  AxiosHeaders,
} from "axios";

// util simples p/ cookies
const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
};

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// helpers internos
const clearAuth = () => {
  // remove cookie authToken (fazendo “belt & suspenders”: Expires + Max-Age)
  document.cookie =
    "authToken=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Max-Age=0; Path=/; SameSite=Lax";
};

const redirectToLogin = () => {
  window.location.href = "/login";
};

// ---------- Interceptor de REQUEST: injeta Authorization do cookie ----------
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getCookie("authToken");
    if (token) {
      const h = config.headers as AxiosHeaders | Record<string, any> | undefined;
      if (h && typeof (h as any).set === "function") {
        // AxiosHeaders
        (h as AxiosHeaders).set("Authorization", `Bearer ${token}`);
      } else {
        // objeto plano
        config.headers = {
          ...(h ?? {}),
          Authorization: `Bearer ${token}`,
        } as any;
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ---------- Interceptor de RESPONSE: trata 401 ----------
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

    // rotas públicas que não devem redirecionar
    const isPublicAuthRoute =
      url.includes("/api/auth/login") || url.includes("/api/auth/register");

    if (status === 401 && !isPublicAuthRoute) {
      clearAuth();
      redirectToLogin();
    }

    return Promise.reject(error);
  }
);


export { getCookie };
