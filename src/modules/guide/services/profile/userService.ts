
import { api } from "#/config/apiConfig";

export type Gender = "MASCULINO" | "FEMININO" | "OUTRO";

export type UserMe = {
  id: string;
  username: string;
  email: string;
  birthDate: string | null;   // ISO
  gender?: Gender | null;
  avatar?: string | null;     // "AVATAR_1" ... "AVATAR_8"
};

export async function fetchMe(): Promise<UserMe> {
  const { data } = await api.get<UserMe>("/api/users/me");
  return data;
}

export async function updateMe(payload: {
  id: string;
  username: string;
  email: string;
  birthDate: string | null; // ISO
  gender?: Gender | "";
  avatar?: string | null;   // 👈 novo
}): Promise<void> {
  const { id, ...body } = payload;
  await api.put(`/api/users/update/${id}`, {
    ...body,
    // normaliza vazio para null
    gender: body.gender || null,
    avatar: body.avatar ?? null,
  });
}
