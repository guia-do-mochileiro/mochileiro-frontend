
import { getCookie } from "#/config/apiConfig";

type JwtPayload = { exp?: number; [k: string]: any };

function parseJwt(token: string): JwtPayload | null {
  try {
    const [, payload] = token.split(".");
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return null;
  }
}

export function isAuthenticated(): boolean {
  const token = getCookie("authToken");
  if (!token) return false;
  const payload = parseJwt(token);
  if (!payload?.exp) return true; 
  const now = Math.floor(Date.now() / 1000);
  return now < payload.exp;
}

export function logout(): void {
  
  document.cookie = `authToken=; Max-Age=0; path=/; SameSite=Lax`;
  document.cookie = `userId=; Max-Age=0; path=/; SameSite=Lax`;
  
  window.location.href = "/login";
}
