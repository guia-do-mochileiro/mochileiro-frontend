import { api } from "#/config/apiConfig";


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
  number: number; 
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

/**
 * Busca paginação do ranking.
 * @param params.search termo para buscar por nome de usuário (enviado como `username`).
 *  -> Se sua API usar outro nome (ex.: `q`), troque a chave na montagem de `queryParams`.
 */
export async function getRanking(
  params: { page?: number; size?: number; sort?: string; search?: string } = {}
) {
  try {
    const { page, size, sort, search } = params;

    
    const queryParams: Record<string, any> = {};
    if (page !== undefined) queryParams.page = page;
    if (size !== undefined) queryParams.size = size;
    if (sort) queryParams.sort = sort;
    if (search && search.trim().length > 0) {
      queryParams.username = search.trim(); 
    }

    const { data } = await api.get<RankingPage>("/api/users/ranking", { params: queryParams });
    return data;
  } catch (err: any) {
    const e = new Error(extractMsg(err, "Falha ao carregar o ranking."));
    (e as any).status = err?.response?.status;
    throw e;
  }
}
