
import { api } from "#/config/apiConfig";

export type PhaseSummary = {
  id: string;
  name: string;
  orderIndex: 1 | 2 | 3 | 4;
};

export type StateWithPhases = {
  id: string;
  name: string;
  abbreviation: string;
  phases: PhaseSummary[];
};

function extractMsg(err: any) {
  return (
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    "Falha ao carregar missões do estado."
  );
}

export async function listMissionsByState(stateId: string) {
  try {
    const { data } = await api.get<StateWithPhases>(
      `/api/states/list-missions/${stateId}`
    );
    return data;
  } catch (err: any) {
    const e = new Error(extractMsg(err));
    (e as any).status = err?.response?.status;
    throw e;
  }
}
