import { getRegionWithStates, listAllRegions } from "#/modules/guide/services/regionsDirectoryService";

export type LocalNorthCode =
  | "ACRE"
  | "AMAPA"
  | "AMAZONAS"
  | "PARA"
  | "RONDONIA"
  | "RORAIMA"
  | "TOCANTINS";

const LOCAL_BY_ABBR: Record<string, LocalNorthCode | undefined> = {
  AC: "ACRE",
  AP: "AMAPA",
  AM: "AMAZONAS",
  PA: "PARA",
  RO: "RONDONIA",
  RR: "RORAIMA",
  TO: "TOCANTINS",
};

type Cache = {
  loaded: boolean;
  northRegionId: string | null;
  stateIdByLocalCode: Partial<Record<LocalNorthCode, string>>;
};
const cache: Cache = {
  loaded: false,
  northRegionId: null,
  stateIdByLocalCode: {},
};

let loadingPromise: Promise<void> | null = null;

export async function ensureNorthIdsLoaded(): Promise<void> {
  if (cache.loaded) return;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    const regions = await listAllRegions();
    const north = regions.find((r) => r.name?.toLowerCase() === "norte");
    cache.northRegionId = north?.id ?? null;

    if (!cache.northRegionId) {
      cache.loaded = true;
      return;
    }

    const region = await getRegionWithStates(cache.northRegionId);
    for (const st of region.states) {
      const local = LOCAL_BY_ABBR[st.abbreviation];
      if (local) {
        cache.stateIdByLocalCode[local] = st.id;
      }
    }

    cache.loaded = true;
  })();

  await loadingPromise;
}

export function getNorthRegionId(): string | null {
  return cache.northRegionId ?? null;
}

export function getStateIdByLocal(local: LocalNorthCode): string | null {
  return cache.stateIdByLocalCode[local] ?? null;
}

export const NORTH_ABBR_BY_LABEL: Record<string, "AC" | "AP" | "AM" | "PA" | "RO" | "RR" | "TO"> = {
  Acre: "AC",
  Amapá: "AP",
  Amazonas: "AM",
  Pará: "PA",
  Rondônia: "RO",
  Roraima: "RR",
  Tocantins: "TO",
};
