import { api } from "#/config/apiConfig";

export type RegionDTO = {
  id: string;
  name: string; 
};

export type RegionWithStatesDTO = {
  id: string;
  name: string;
  states: {
    id: string;
    name: string;
    abbreviation: "AC" | "AP" | "AM" | "PA" | "RO" | "RR" | "TO" | string;
  }[];
};

function msg(err: any, fallback: string) {
  return (
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    fallback
  );
}

export async function listAllRegions() {
  try {
    const { data } = await api.get<RegionDTO[]>("/api/regions/list-all");
    return data;
  } catch (err: any) {
    const e = new Error(msg(err, "Falha ao listar regiões."));
    (e as any).status = err?.response?.status;
    throw e;
  }
}

export async function getRegionWithStates(regionId: string) {
  try {
    const { data } = await api.get<RegionWithStatesDTO>(`/api/regions/list-all-states/${regionId}`);
    return data;
  } catch (err: any) {
    const e = new Error(msg(err, "Falha ao obter estados da região."));
    (e as any).status = err?.response?.status;
    throw e;
  }
}
