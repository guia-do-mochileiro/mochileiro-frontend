import { api } from "#/config/apiConfig";

/** Enum de avatar que o backend retorna (mesmo usado no ProfileModal) */
export type AvatarKey =
  | "AVATAR_1" | "AVATAR_2" | "AVATAR_3" | "AVATAR_4"
  | "AVATAR_5" | "AVATAR_6" | "AVATAR_7" | "AVATAR_8";

export type RankedUser = {
  userId: string;
  username: string;
  gender: "MASCULINO" | "FEMININO" | "OUTRO" | string;
  avatar: AvatarKey | string;
  totalPoints: number;
};

export type RankingPage = {
  content: RankedUser[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalPages: number;
  totalElements: number;
  first: boolean;
  last: boolean;
  number: number; // página atual (0-index)
  size: number;
  numberOfElements: number;
};

function extractMsg(err: any, fallback: string) {
  return (
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    fallback
  );
}

export async function getRanking(params: { page?: number; size?: number; sort?: string } = {}) {
  try {
    const { data } = await api.get<RankingPage>("/api/users/ranking", { params });
    return data;
  } catch (err: any) {
    const e = new Error(extractMsg(err, "Falha ao carregar o ranking."));
    (e as any).status = err?.response?.status;
    throw e;
  }
}
