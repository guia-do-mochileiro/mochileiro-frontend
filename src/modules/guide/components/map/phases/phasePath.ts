// src/modules/guide/components/map/phases/phasePath.ts
import type { Map, GeoJSONSource } from "mapbox-gl";

export const PHASE_PATH_SOURCE = "phase-path-src";
export const PHASE_PATH_LAYER = "phase-path-layer";

/** Cria/atualiza e mostra a linha pontilhada conectando as fases (ABERTA: 1→2→3→4). */
export function addOrShowPhasesDashedPath(map: Map, coords: [number, number][]) {
  const data: GeoJSON.Feature<GeoJSON.LineString> = {
    type: "Feature",
    geometry: { type: "LineString", coordinates: coords },
    properties: {},
  };

  if (map.getSource(PHASE_PATH_SOURCE)) {
    (map.getSource(PHASE_PATH_SOURCE) as GeoJSONSource).setData(data);
    if (map.getLayer(PHASE_PATH_LAYER)) {
      map.setLayoutProperty(PHASE_PATH_LAYER, "visibility", "visible");
    }
    return;
  }

  map.addSource(PHASE_PATH_SOURCE, { type: "geojson", data });

  map.addLayer({
    id: PHASE_PATH_LAYER,
    type: "line",
    source: PHASE_PATH_SOURCE,
    layout: { "line-cap": "round", "line-join": "round" },
    paint: {
      "line-color": "#000000",
      "line-opacity": 0.55,
      "line-width": 3,
      "line-dasharray": [2, 2.5],
    },
  });
}

/** Esconde a camada (se existir). */
export function hidePhasesDashedPath(map: Map) {
  if (map.getLayer(PHASE_PATH_LAYER)) {
    map.setLayoutProperty(PHASE_PATH_LAYER, "visibility", "none");
  }
}
