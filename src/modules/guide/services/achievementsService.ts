import { api } from "#/config/apiConfig";

export type Achievement = {
  achievementId: string;
  name: string;
  description: string;
  goal: number;
  progress: number;
  completed: boolean;
};

export type AchievementPage = {
  content: Achievement[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    offset: number;
    paged: boolean;
    unpaged: boolean;
    sort?: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // página atual (0-index)
  sort?: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
};

function extractMsg(err: any) {
  return (
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    "Falha ao carregar conquistas."
  );
}

export async function getAchievements(params: {
  page?: number;
  size?: number;
  sort?: string;
} = {}) {
  const { page = 0, size = 9, sort } = params;
  try {
    const { data } = await api.get<AchievementPage>("/api/achievements", {
      params: { page, size, ...(sort ? { sort } : {}) },
    });
    return data;
  } catch (err: any) {
    const e = new Error(extractMsg(err));
    (e as any).status = err?.response?.status;
    throw e;
  }
}
