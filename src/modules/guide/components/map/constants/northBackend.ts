// src/modules/guide/components/map/constants/northBackend.ts
export const NORTH_REGION_ID = "4471c011-a867-11f0-beb2-0242ac140002";

// rótulo local -> sigla usada no backend
export const NORTH_ABBR_BY_LABEL: Record<string, "AC" | "AP" | "AM" | "PA" | "RO" | "RR" | "TO"> = {
  Acre: "AC",
  Amapá: "AP",
  Amazonas: "AM",
  Pará: "PA",
  Rondônia: "RO",
  Roraima: "RR",
  Tocantins: "TO",
};

// ✅ NOVO: enum local (ACRE/AMAPA/...) -> ID real do backend
export const STATE_ID_BY_CODE: Record<
  "ACRE" | "AMAPA" | "AMAZONAS" | "PARA" | "RONDONIA" | "RORAIMA" | "TOCANTINS",
  string
> = {
  PARA: "175a794b-ac4c-4138-aebe-666fddb4ea2f",
  RORAIMA: "3143809b-0875-4f07-b0b7-4afe6a13eb4c",
  RONDONIA: "3674f455-eb59-4d2c-aa9b-dae6785929b6",
  AMAZONAS: "3ae34fd7-4965-4c74-8c68-26a98e77c1b3",
  TOCANTINS: "5d2e0652-1644-43ab-a980-cea85f2551ad",
  ACRE: "81d72177-3c9c-4d35-a2d8-90a8206b224f",
  AMAPA: "984ab929-0683-4aac-9b58-9ad4d03481fd",
};
