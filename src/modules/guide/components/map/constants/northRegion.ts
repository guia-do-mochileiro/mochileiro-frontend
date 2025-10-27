
export type Bound = [[number, number], [number, number]];
export type RegionNorthStateId =
  | "ACRE"
  | "AMAPA"
  | "AMAZONAS"
  | "PARA"
  | "RONDONIA"
  | "RORAIMA"
  | "TOCANTINS";

export type RegionDef = {
  id: "NORTE";
  center: { lng: number; lat: number };
  bounds: Bound;
  states: Record<
    RegionNorthStateId,
    { label: string; center: { lng: number; lat: number }; bounds: Bound }
  >;
};

export const northRegion: RegionDef = {
  id: "NORTE",
  center: { lng: -60.0, lat: -3.0 },
  bounds: [
    [-77.9, -13.5],
    [-44.8, 5.3],
  ],
  states: {
    ACRE: {
      label: "Acre",
      center: { lng: -70.0, lat: -9.0 },
      bounds: [
        [-73.99, -11.2],
        [-66.65, -7.0],
      ],
    },
    AMAPA: {
      label: "Amapá",
      center: { lng: -52.0, lat: 1.2 },
      bounds: [
        [-54.9, 0.4],
        [-50.6, 3.9],
      ],
    },
    AMAZONAS: {
      label: "Amazonas",
      center: { lng: -63.0, lat: -4.0 },
      bounds: [
        [-73.99, -9.9],
        [-56.1, 2.3],
      ],
    },
    PARA: {
      label: "Pará",
      center: { lng: -52.0, lat: -3.5 },
      bounds: [
        [-56.2, -9.5],
        [-46.6, 2.1],
      ],
    },
    RONDONIA: {
      label: "Rondônia",
      center: { lng: -63.5, lat: -11.0 },
      bounds: [
        [-66.9, -12.7],
        [-60.5, -8.5],
      ],
    },
    RORAIMA: {
      label: "Roraima",
      center: { lng: -61.5, lat: 2.2 },
      bounds: [
        [-63.4, 0.05],
        [-59.34, 5.26],
      ],
    },
    TOCANTINS: {
      label: "Tocantins",
      center: { lng: -48.3, lat: -9.8 },
      bounds: [
        [-47.7, -9.0],
        [-60.5, -8.5],
      ],
    },
  },
};
