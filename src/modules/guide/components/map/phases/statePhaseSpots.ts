// src/modules/guide/components/map/phases/statePhaseSpots.ts
import type { RegionNorthStateId } from "../constants/northRegion";

export type PhaseIndex = 1 | 2 | 3 | 4;
export type Spot = { lng: number; lat: number };

/**
 * Ordem NOVA (1→4):
 * 1: Localização e Capital
 * 2: Hidrografia e Bioma
 * 3: Cultura e Sociedade
 * 4: Economia e Desafios
 *
 * OBS: Coordenadas aproximadas para UI — ajuste conforme o mock.
 */
export const STATE_PHASE_SPOTS: Partial<
  Record<RegionNorthStateId, Record<PhaseIndex, Spot>>
> = {
  // AMAZONAS
  AMAZONAS: {
    1: { lng: -70.3, lat: -7.0 },
    2: { lng: -66.0, lat: -2.0 },
    3: { lng: -60.0, lat: -3.2 },
    4: { lng: -63.3, lat: -7.3 },
  },

  // PARÁ
  PARA: {
    1: { lng: -55.0, lat: -0.5 },  // Localização e Capital
    2: { lng: -55.0, lat: -4.3 },   // Hidrografia e Bioma
    3: { lng: -55.0, lat: -8.0 }, // Cultura e Sociedade
    4: { lng: -50.0, lat: -4.3 },  // Economia e Desafios
  },

  // ACRE (bounds: [-73.99,-11.2] .. [-66.65,-7.0])
  ACRE: {
    1: { lng: -72.8, lat: -8.3 },  // prox. Rio Branco
    2: { lng: -70.5, lat: -8.6 },
    3: { lng: -69.5, lat: -10.0 },
    4: { lng: -67.8, lat: -10.2 },
  },

  // AMAPÁ (bounds: [-54.9,0.4] .. [-50.6,3.9])
  AMAPA: {
    1: { lng: -51.5, lat: 3.2  },   // prox. Macapá (ajustado p/ ficar dentro do bound)
    2: { lng: -51.5, lat: 2.3  },
    3: { lng: -52.0, lat: 1.4 },
    4: { lng: -52.0, lat: 0.4 },
  },

  // RONDÔNIA (bounds: [-66.9,-13.7] .. [-60.5,-8.5])
  RONDONIA: {
    1: { lng: -62.9, lat: -8.9 },  // prox. Porto Velho
    2: { lng: -64.2, lat: -10.0 },
    3: { lng: -64.2, lat: -11.4 },
    4: { lng: -61.2, lat: -12.2 },
  },

  // RORAIMA (bounds: [-63.4,0.05] .. [-59.34,5.26])
  RORAIMA: {
    1: { lng: -62.67, lat: 2.82 }, // prox. Boa Vista
    2: { lng: -60.8,  lat: 2.82 },
    3: { lng: -61.8,  lat: 1.3 },
    4: { lng: -59.8,  lat: 0.5 },
  },

  // TOCANTINS (bounds: [-50.7,-13.9] .. [-45.5,-5.0])
  TOCANTINS: {
    1: { lng: -48.33, lat: -8.0 }, // prox. Palmas
    2: { lng: -48.33,  lat: -10.2 },
    3: { lng: -49.5,  lat: -11.9 },
    4: { lng: -47.33,  lat: -12.9 },
  },
};
