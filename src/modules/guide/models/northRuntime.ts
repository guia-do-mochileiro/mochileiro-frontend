// src/modules/guide/models/northRuntime.ts
export type NorthStateRuntime = {
  id: string;              // vindo da API
  name: string;
  abbreviation: string;
  center: { lng: number; lat: number };
  bounds: [[number, number],[number, number]];
};

export type NorthRuntime = Record<string, NorthStateRuntime>; // chave: abbreviation (AM, PA, ...)

