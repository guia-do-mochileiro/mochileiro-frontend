import mapboxgl from "mapbox-gl";
import type { MutableRefObject } from "react";
import { createStatePhaseButton } from "../StatePhaseButton";
import { addOrShowPhasesDashedPath } from "./phasePath";
import { STATE_PHASE_SPOTS, type PhaseIndex } from "./statePhaseSpots";
import type { RegionNorthStateId } from "../constants/northRegion";

export type PhaseIconSet = {
  phase1: string;
  phase2: string;
  phase3: string;
  phase4: string;
};

export function clearPhaseButtons(listRef: MutableRefObject<mapboxgl.Marker[]>) {
  listRef.current.forEach((m) => m.remove());
  listRef.current = [];
}






const DEFAULT_LABELS: Record<PhaseIndex, string> = {
  1: "LOCALIZAÇÃO E CAPITAL",
  2: "HIDROGRAFIA E BIOMA",
  3: "CULTURA E SOCIEDADE",
  4: "ECONOMIA E DESAFIOS",
};

/**
 * Renderiza as 4 fases para QUALQUER estado suportado em STATE_PHASE_SPOTS.
 * Se o estado não tiver spots definidos, não renderiza nada.
 */
export function spawnPhaseButtonsForState(opts: {
  map: mapboxgl.Map;
  stateCode: RegionNorthStateId;
  listRef: MutableRefObject<mapboxgl.Marker[]>;
  icons: PhaseIconSet;
  onPhaseClick?: (index1to4: number) => void;
  labels?: Partial<Record<PhaseIndex, string>>;
  locked?: Partial<Record<PhaseIndex, boolean>>;
}) {
  const { map, stateCode, listRef, icons, onPhaseClick, labels, locked } = opts;

  const spots = STATE_PHASE_SPOTS[stateCode];
  if (!spots) return; 

  const getLabel = (i: PhaseIndex) => labels?.[i] ?? DEFAULT_LABELS[i];
  const isLocked = (i: PhaseIndex) => Boolean(locked?.[i]);

  const defs = [
    { idx: 1 as PhaseIndex, icon: icons.phase1, color: "green"  as const },
    { idx: 2 as PhaseIndex, icon: icons.phase2, color: "blue"   as const },
    { idx: 3 as PhaseIndex, icon: icons.phase3, color: "coral"  as const },
    { idx: 4 as PhaseIndex, icon: icons.phase4, color: "yellow" as const },
  ];

  defs.forEach(({ idx, icon, color }) => {
    const pos = spots[idx];
    if (!pos) return;

    const el = createStatePhaseButton({
      label: getLabel(idx),
      color,
      iconSrc: icon,
      locked: isLocked(idx),
      onClick: () => onPhaseClick?.(idx),
    });

    const marker = new mapboxgl.Marker({ element: el, anchor: "bottom" })
      .setLngLat(pos)
      .addTo(map);

    listRef.current.push(marker);
  });

  
  const coords: [number, number][] = [1, 2, 3, 4]
    .map((i) => spots[i as PhaseIndex])
    .filter(Boolean)
    .map((p) => [p!.lng, p!.lat]);

  if (coords.length >= 2) {
    addOrShowPhasesDashedPath(map, coords as [number, number][]);
  }
}
