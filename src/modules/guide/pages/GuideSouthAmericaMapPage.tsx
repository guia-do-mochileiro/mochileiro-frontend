
import { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import type { LngLatBoundsLike } from "mapbox-gl";
import { useLocation, useNavigate } from "react-router-dom";
import { useSfx } from "#/hooks/useSfx";

import { createMapChipButton } from "#/modules/guide/components/map/MapChipButton";
import { BackControl } from "#/modules/guide/components/map/BackControl";
import { StageBadgeControl } from "#/modules/guide/components/map/StageBadgeControl";

import {
  northRegion,
  type RegionNorthStateId,
} from "#/modules/guide/components/map/constants/northRegion";
import { expand, toPair, type BoundPair } from "#/modules/guide/components/map/utils/bounds";
import { hidePhasesDashedPath } from "#/modules/guide/components/map/phases/phasePath";

import {
  clearPhaseButtons,
  spawnPhaseButtonsForState,
} from "#/modules/guide/components/map/phases/spawnPhases";

import {
  ensureNorthIdsLoaded,
  getStateIdByLocal,
} from "#/modules/guide/components/map/constants/northBackend";


import { getMissionsByStateId } from "#/modules/guide/services/regionsService";
import { getPhaseProgress, resetPhaseProgress } from "#/modules/guide/services/quizService";


import Phase1Icon from "#/modules/guide/assets/phases/1.png";
import Phase2Icon from "#/modules/guide/assets/phases/2.png";
import Phase3Icon from "#/modules/guide/assets/phases/3.png";
import Phase4Icon from "#/modules/guide/assets/phases/4.png";


import LockImg from "#/modules/guide/assets/achievements/0 - Bloqueio.png";

type Level = "country" | "region" | "state";

const PHASE_TITLES: Record<number, string> = {
  1: "LOCALIZAÇÃO E CAPITAL",
  2: "HIDROGRAFIA E BIOMA",
  3: "CULTURA E SOCIEDADE",
  4: "ECONOMIA E DESAFIOS",
};

type Mission = { id: string; title: string; orderIndex?: number };

export default function GuideSouthAmericaMapPage() {
  const brasilBounds = useMemo(
    () =>
      [
        [-73.9, -33.7],
        [-34.8, 5.3],
      ] as [[number, number], [number, number]],
    []
  );

  const softBoundsPair: BoundPair = useMemo(
    () => toPair(expand(brasilBounds, 2, 2)),
    [brasilBounds]
  );
  const hardBounds: LngLatBoundsLike = useMemo(
    () => expand(brasilBounds, 18, 12) as LngLatBoundsLike,
    [brasilBounds]
  );

const { playClick } = useSfx({ volume: 0.9, clickVolume: 1 });
  const mapRef = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const navigate = useNavigate();
  const location = useLocation() as { state?: any };

  const chipRegionMarker = useRef<mapboxgl.Marker | null>(null);
  const chipStateMarkers = useRef<mapboxgl.Marker[]>([]);
  const phaseMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const backCtrl = useRef<BackControl | null>(null);
  const stageBadge = useRef<StageBadgeControl | null>(null);

  
  const lockMarkersRef = useRef<mapboxgl.Marker[]>([]);

  const missionsByStateRef = useRef<Record<string, Mission[]>>({});
  const [level, setLevel] = useState<Level>("country");
  const [activeState, setActiveState] = useState<RegionNorthStateId | null>(null);
  const levelRef = useRef<Level>("country");

  const isTransitioning = useRef(false);
  const isOpeningPhaseRef = useRef(false); 

  const PHASE_META = {
    1: { color: "green" as const, icon: Phase1Icon, label: PHASE_TITLES[1] },
    2: { color: "blue" as const, icon: Phase2Icon, label: PHASE_TITLES[2] },
    3: { color: "coral" as const, icon: Phase3Icon, label: PHASE_TITLES[3] },
    4: { color: "yellow" as const, icon: Phase4Icon, label: PHASE_TITLES[4] },
  };

  useEffect(() => {
    levelRef.current = level;
  }, [level]);

  
  function beginTransition() {
    isTransitioning.current = true;
    backCtrl.current?.setVisible(false);
    clearPhaseButtons(phaseMarkersRef);
    if (map.current) hidePhasesDashedPath(map.current);
  }
  function endTransition() {
    isTransitioning.current = false;
    backCtrl.current?.setVisible(levelRef.current !== "country");
  }
  function showAfterMoveEnd(fn: () => void) {
    if (!map.current) return;
    map.current.once("moveend", () => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          fn();
          endTransition();
        });
      });
    });
  }
  function applyGesturesFor(lvl: Level) {
    if (!map.current) return;
    const m = map.current;

    const disableAll = () => {
      m.dragPan.disable();
      m.scrollZoom.disable();
      m.doubleClickZoom.disable();
      m.boxZoom.disable();
      m.keyboard.disable();
      m.touchZoomRotate.disable();
    };
    const enableCountry = () => {
      m.dragPan.enable();
      m.scrollZoom.enable();
      m.doubleClickZoom.enable();
      m.boxZoom.enable();
      m.keyboard.enable();
      m.touchZoomRotate.enable();
    };

    if (lvl === "country") {
      enableCountry();
      m.setMaxBounds(hardBounds);
    } else if (lvl === "region") {
      disableAll();
      m.setMaxBounds(expand(northRegion.bounds, 1.0, 1.0));
    } else {
      disableAll();
      if (activeState) {
        const b = northRegion.states[activeState].bounds;
        m.setMaxBounds(expand(b, 0.4, 0.4));
      }
    }
  }

  
  function getBackendStateId(stateCode: RegionNorthStateId): string | null {
    return getStateIdByLocal(stateCode as any) ?? null;
  }

  function resolveMissionId(stateCode: RegionNorthStateId, index1to4: number): string | null {
    const backendStateId = getBackendStateId(stateCode);
    if (!backendStateId) return null;
    const list = missionsByStateRef.current[backendStateId] || [];

    const byIndex = list.find((m) => Number(m.orderIndex) === index1to4);
    if (byIndex) return byIndex.id;

    const wantedTitle = PHASE_TITLES[index1to4];
    const norm = (s: string) =>
      s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim();
    const aliases: Record<number, string[]> = {
      1: ["localizacao e capital"],
      2: ["cultura e sociedade"],
      3: ["economia", "economia e desafios"],
      4: ["hidrografia e bioma", "hidrogafia e bioma"],
    };
    const wantedSet = new Set([norm(wantedTitle), ...(aliases[index1to4] || []).map(norm)]);
    const byTitle = list.find((m) => wantedSet.has(norm(m.title)));
    return byTitle?.id ?? null;
  }

  
  async function buildLockedForMissions(missions: Mission[]) {
    const idsByIndex: Record<1 | 2 | 3 | 4, string | null> = { 1: null, 2: null, 3: null, 4: null };
    missions.forEach((m) => {
      const idx = Number(m.orderIndex) as 1 | 2 | 3 | 4;
      if (idx >= 1 && idx <= 4 && m.id) idsByIndex[idx] = m.id;
    });

    const prog: Partial<Record<1 | 2 | 3 | 4, { passed: boolean }>> = {};
    await Promise.all(
      ([1, 2, 3, 4] as const)
        .filter((i) => !!idsByIndex[i])
        .map(async (i) => {
          try {
            const p = await getPhaseProgress(idsByIndex[i]!);
            prog[i] = { passed: Boolean(p.passed) };
          } catch {
            prog[i] = { passed: false };
          }
        })
    );

    return {
      1: false, 
      2: !(prog[1]?.passed === true),
      3: !(prog[2]?.passed === true),
      4: !(prog[3]?.passed === true),
    } as Record<1 | 2 | 3 | 4, boolean>;
  }

  
  const handleOpenPhase = async (stateId: RegionNorthStateId, idx: 1 | 2 | 3 | 4) => {
    if (isOpeningPhaseRef.current) return;
    const missionId = resolveMissionId(stateId, idx);
    if (!missionId) {
      console.warn("Sem missionId para", { stateId, index: idx });
      return;
    }
    isOpeningPhaseRef.current = true;
    try {
      const progress = await getPhaseProgress(missionId);
      if (progress?.passed) {
        await resetPhaseProgress(missionId);
      }
    } catch (e) {
      console.error("Falha ao consultar/resetar progresso da fase", e);
    } finally {
      isOpeningPhaseRef.current = false;
    }

    const meta = PHASE_META[idx];
    navigate(`/guide/quiz/${stateId}/${missionId}`, {
      state: {
        phaseLabel: meta.label,
        phaseColor: meta.color,
        phaseIndex: idx,
        iconSrc: meta.icon,
      },
    });
  };

  
  function goToCountry() {
    if (!map.current || isTransitioning.current) return;
    beginTransition();

    setLevel("country");
    setActiveState(null);
    stageBadge.current?.update({
      variant: "country",
      subtitle: "América do Sul",
      title: "Mapa do Brasil",
    });

    showRegionChip(false);
    clearStateChips();
    clearPhaseButtons(phaseMarkersRef);

    
    ensureLockMarkers();
    showLockMarkers(false);

    map.current.fitBounds(toPair(brasilBounds), { padding: 24, duration: 700, pitch: 0, bearing: 0 });
    applyGesturesFor("country");

    showAfterMoveEnd(() => {
      showRegionChip(true);
      showLockMarkers(true);
    });
  }

  function goToRegionNorte() {
    if (!map.current || isTransitioning.current) return;
    beginTransition();

    setLevel("region");
    setActiveState(null);
    stageBadge.current?.update({
      variant: "region",
      subtitle: "Brasil",
      title: "Mapa da Região Norte",
    });

    showRegionChip(false);
    showLockMarkers(false); 
    clearStateChips();
    clearPhaseButtons(phaseMarkersRef);

    map.current.fitBounds(toPair(northRegion.bounds), { padding: 40, duration: 700 });
    applyGesturesFor("region");

    showAfterMoveEnd(() => spawnStateChips());
  }

  function goToState(stateId: RegionNorthStateId) {
    if (!map.current || isTransitioning.current) return;
    beginTransition();

    setLevel("state");
    setActiveState(stateId);
    const state = northRegion.states[stateId];
    stageBadge.current?.update({
      variant: "state",
      subtitle: "Região Norte do Brasil",
      title: `Mapa do ${state.label}`,
    });

    showLockMarkers(false);
    clearStateChips();
    clearPhaseButtons(phaseMarkersRef);
    hidePhasesDashedPath(map.current!);

    map.current.fitBounds(toPair(state.bounds), { padding: 60, duration: 700 });
    applyGesturesFor("state");

    showAfterMoveEnd(() => {
      const backendStateId = getBackendStateId(stateId);

      const commonSpawn = async () => {
        const list = missionsByStateRef.current[backendStateId!];
        const locked =
          list && list.length
            ? await buildLockedForMissions(list)
            : ({ 1: false, 2: true, 3: true, 4: true } as Record<1 | 2 | 3 | 4, boolean>);

        spawnPhaseButtonsForState({
          map: map.current!,
          stateCode: stateId,
          listRef: phaseMarkersRef,
          icons: { phase1: Phase1Icon, phase2: Phase2Icon, phase3: Phase3Icon, phase4: Phase4Icon },
          locked,
          onPhaseClick: (i) => {
            playClick();
            handleOpenPhase(stateId, i as 1 | 2 | 3 | 4);
          },
        });

      };

      if (!backendStateId) {
        spawnPhaseButtonsForState({
          map: map.current!,
          stateCode: stateId,
          listRef: phaseMarkersRef,
          icons: { phase1: Phase1Icon, phase2: Phase2Icon, phase3: Phase3Icon, phase4: Phase4Icon },
          locked: { 1: false, 2: true, 3: true, 4: true },
          onPhaseClick: (i) => {
            playClick();
            handleOpenPhase(stateId, i as 1 | 2 | 3 | 4);
          },
        });
        return;
      }

      if (missionsByStateRef.current[backendStateId]) {
        commonSpawn();
        return;
      }

      (async () => {
        try {
          const missions = await getMissionsByStateId(backendStateId);
          const mapped: Mission[] = (missions || []).map((m: any) => ({
            id: String(m?.id ?? ""),
            title: String(m?.title ?? m?.name ?? ""),
            orderIndex: Number(m?.orderIndex ?? m?.order ?? NaN),
          }));
          missionsByStateRef.current[backendStateId] = mapped;
        } catch (e) {
          console.error("Falha ao carregar missões do estado", backendStateId, e);
          missionsByStateRef.current[backendStateId] = [];
        } finally {
          await commonSpawn();
        }
      })();
    });
  }

  function handleBackClick() {
    playClick();
    if (isTransitioning.current) return;
    const cur = levelRef.current;
    if (cur === "state") goToRegionNorte();
    else if (cur === "region") goToCountry();
  }


  
  function showRegionChip(visible: boolean) {
    if (!map.current) return;
    if (!chipRegionMarker.current) {
      const el = createMapChipButton({
        label: "NORTE",
        variant: "region",
        onClick: () => {
          if (isTransitioning.current) return;
          playClick();            
          goToRegionNorte();
        },
      });

      chipRegionMarker.current = new mapboxgl.Marker({ element: el, anchor: "center" })
        .setLngLat(northRegion.center)
        .addTo(map.current);
    }
    (chipRegionMarker.current.getElement() as HTMLElement).style.display = visible ? "flex" : "none";
  }

  
  
  const OTHER_REGIONS_LOCKS: Array<{ id: "NE" | "CO" | "SE" | "S"; center: [number, number] }> = [
    { id: "NE", center: [-42.0, -8.0] },   
    { id: "CO", center: [-53.5, -17.0] },  
    { id: "SE", center: [-47.0, -20.5] },  
    { id: "S", center: [-51.5, -27.5] },  
  ];

  function ensureLockMarkers() {
    if (!map.current) return;
    if (lockMarkersRef.current.length) return; 
    OTHER_REGIONS_LOCKS.forEach((r) => {
      const el = document.createElement("div");
      el.style.display = "grid";
      el.style.placeItems = "center";
      el.style.width = "64px";
      el.style.height = "64px";
      el.style.borderRadius = "50%";
      el.style.background = "#00000011";
      el.style.backdropFilter = "blur(1px)";
      el.style.boxShadow = "0 4px 10px rgba(0,0,0,.15)";

      const img = document.createElement("img");
      img.src = LockImg;
      img.alt = "Região bloqueada";
      img.draggable = false;
      img.style.width = "44px";
      img.style.height = "44px";
      img.style.objectFit = "contain";
      el.appendChild(img);

      const mk = new mapboxgl.Marker({ element: el, anchor: "center" })
        .setLngLat(r.center)
        .addTo(map.current!);

      
      (mk.getElement() as HTMLElement).style.pointerEvents = "none";

      lockMarkersRef.current.push(mk);
    });
  }

  function showLockMarkers(visible: boolean) {
    lockMarkersRef.current.forEach((m) => {
      (m.getElement() as HTMLElement).style.display = visible ? "grid" : "none";
    });
  }

  function clearLockMarkers() {
    lockMarkersRef.current.forEach((m) => m.remove());
    lockMarkersRef.current = [];
  }

  function clearStateChips() {
    chipStateMarkers.current.forEach((m) => m.remove());
    chipStateMarkers.current = [];
  }
  function spawnStateChips() {
    if (!map.current) return;
    clearStateChips();
    (
      Object.entries(northRegion.states) as [
        RegionNorthStateId,
        (typeof northRegion)["states"][RegionNorthStateId]
      ][]
    ).forEach(([id, def]) => {
      const el = createMapChipButton({
        label: def.label,
        variant: "state",
        onClick: () => {
          if (isTransitioning.current) return;
          playClick();            
          goToState(id);
        },
      });

      const marker = new mapboxgl.Marker({ element: el, anchor: "center" })
        .setLngLat(def.center)
        .addTo(map.current!);
      chipStateMarkers.current.push(marker);
    });
  }

  
  useEffect(() => {
    (async () => {
      await ensureNorthIdsLoaded();
      if (!mapRef.current) return;
      mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN as string;

      const m = new mapboxgl.Map({
        container: mapRef.current,
        style: `mapbox://styles/${import.meta.env.VITE_MAPBOX_STYLE}`,
        center: [-51.9253, -14.235],
        zoom: 3.5,
        cooperativeGestures: true,
        renderWorldCopies: false,
        maxBounds: hardBounds,
      });

      m.addControl(new mapboxgl.NavigationControl({ visualizePitch: false }), "top-right");
      backCtrl.current = new BackControl(handleBackClick);
      m.addControl(backCtrl.current as any, "top-left");
      stageBadge.current = new StageBadgeControl();
      m.addControl(stageBadge.current as any, "bottom-left");

      
      const shouldShowRegionUI = () => {
        if (levelRef.current !== "country") return false;
        const soft = new mapboxgl.LngLatBounds(softBoundsPair);
        return soft.contains(m.getCenter());
      };

      const onDragEnd = () => {
        if (!m || levelRef.current !== "country") return;
        const center = m.getCenter();
        const soft = new mapboxgl.LngLatBounds(softBoundsPair);
        if (!soft.contains(center)) {
          m.fitBounds(toPair(brasilBounds), { padding: 24, duration: 600, pitch: 0, bearing: 0 });
        }
      };
      m.on("dragend", onDragEnd);

      
      const onMoveStart = () => {
        if (levelRef.current === "country") {
          showRegionChip(false);
          showLockMarkers(false);
        }
      };
      const onMoveEnd = () => {
        const visible = shouldShowRegionUI();
        showRegionChip(visible);
        showLockMarkers(visible);
      };
      m.on("movestart", onMoveStart);
      m.on("moveend", onMoveEnd);

      m.once("load", () => {
        const deep = (location.state as any)?.deepLink as
          | { level?: "state" | "region"; stateCode?: string }
          | undefined;

        const isValidState = (code: any): code is RegionNorthStateId =>
          typeof code === "string" && code in northRegion.states;

        if (deep?.level === "state" && isValidState(deep.stateCode)) {
          goToState(deep.stateCode);
        } else if (deep?.level === "region") {
          goToRegionNorte();
        } else {
          m.fitBounds(toPair(brasilBounds), { padding: 24, duration: 650 });
          applyGesturesFor("country");
          stageBadge.current?.update({
            variant: "country",
            subtitle: "América do Sul",
            title: "Mapa do Brasil",
          });
          backCtrl.current?.setVisible(false);

          
          ensureLockMarkers();
          showLockMarkers(false);

          m.once("moveend", () =>
            requestAnimationFrame(() => {
              const visible = shouldShowRegionUI();
              showRegionChip(visible);
              showLockMarkers(visible);
            })
          );
        }
      });

      map.current = m;
      return () => {
        m.off("dragend", onDragEnd);
        m.off("movestart", onMoveStart);
        m.off("moveend", onMoveEnd);
        hidePhasesDashedPath(m);
        clearPhaseButtons(phaseMarkersRef);
        clearStateChips();
        showRegionChip(false);
        clearLockMarkers();
        chipRegionMarker.current?.remove();
        chipRegionMarker.current = null;
        map.current = null;
        m.remove();
      };
    })();
  }, [location.state]);

  useEffect(() => {
    if (level === "state") applyGesturesFor("state");
  }, [activeState]);

  return <div ref={mapRef} className="h-full w-full" />;
}
