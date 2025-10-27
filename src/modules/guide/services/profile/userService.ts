
import { api } from "#/config/apiConfig";

export type Gender = "MASCULINO" | "FEMININO" | "OUTRO";

export type UserMe = {
  id: string;
  username: string;
  email: string;
  birthDate: string | null;   
  gender?: Gender | null;
  avatar?: string | null;     
};

export async function fetchMe(): Promise<UserMe> {
  const { data } = await api.get<UserMe>("/api/users/me");
  return data;
}

export async function updateMe(payload: {
  id: string;
  username: string;
  email: string;
  birthDate: string | null; 
  gender?: Gender | "";
  avatar?: string | null;   
}): Promise<void> {
  const { id, ...body } = payload;
  await api.put(`/api/users/update/${id}`, {
    ...body,
    
    gender: body.gender || null,
    avatar: body.avatar ?? null,
  });
}
