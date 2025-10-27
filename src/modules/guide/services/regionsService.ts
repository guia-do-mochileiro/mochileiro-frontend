
import { api } from "#/config/apiConfig";


type BackendStateMissions = {
  id: string;
  name: string;
  abbreviation: string;
  phases: Array<{ id: string; name: string; orderIndex: number }>;
};

function extractMsg(err: any) {
  return (
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    "Falha ao carregar regiões."
  );
}



export async function getMissionsByStateId(stateId: string) {
  try {
    const { data } = await api.get<BackendStateMissions>(
      `/api/states/list-missions/${stateId}`
    );
    
    return data?.phases ?? [];
  } catch (err: any) {
    const e = new Error(extractMsg(err));
    (e as any).status = err?.response?.status;
    throw e;
  }
}
