// src/App.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import type { LngLatBoundsLike } from "mapbox-gl";
import DailyMissionsCard from "./components/DailyMissionsCard";

type BoundPair = [mapboxgl.LngLatLike, mapboxgl.LngLatLike];

type Region = {
  id: number;
  name: "Norte" | "Nordeste" | "Centro-Oeste" | "Sudeste" | "Sul";
  center: { lng: number; lat: number };
  bounds: [[number, number], [number, number]]; // [SW, NE] (lng,lat)
};

export default function App() {
  console.log("Mapbox Style:", import.meta.env.VITE_MAPBOX_STYLE);
  console.log("Mapbox Token:", import.meta.env.VITE_MAPBOX_TOKEN);

  // bbox do Brasil (lng, lat) fixo
  const brasilBounds = useMemo(
    () =>
      [
        [-73.9, -33.7], // SW
        [-34.8, 5.3],   // NE
      ] as [[number, number], [number, number]],
    []
  );

  // Regiões (centros e bounds aproximados; ajuste fino se quiser)
  const regions = useMemo<Region[]>(
    () => [
      {
        id: 1,
        name: "Norte",
        center: { lng: -60.0, lat: -3.0 },
        bounds: [
          [-73.9, -10.5],
          [-44.8, 5.3],
        ],
      },
      {
        id: 2,
        name: "Nordeste",
        center: { lng: -40.5, lat: -9.0 },
        bounds: [
          [-46.0, -17.0],
          [-34.8, -1.0],
        ],
      },
      {
        id: 3,
        name: "Centro-Oeste",
        center: { lng: -52.5, lat: -15.0 },
        bounds: [
          [-61.0, -22.0],
          [-45.0, -7.0],
        ],
      },
      {
        id: 4,
        name: "Sudeste",
        center: { lng: -45.5, lat: -21.0 },
        bounds: [
          [-52.0, -24.0],
          [-39.0, -18.0],
        ],
      },
      {
        id: 5,
        name: "Sul",
        center: { lng: -52.5, lat: -30.0 },
        bounds: [
          [-57.5, -34.0],
          [-48.0, -27.0],
        ],
      },
    ],
    []
  );

  // helpers
  const toPair = (b: [[number, number], [number, number]]): BoundPair => [
    { lng: b[0][0], lat: b[0][1] },
    { lng: b[1][0], lat: b[1][1] },
  ];

  const expand = (
    b: [[number, number], [number, number]],
    dx: number,
    dy: number
  ): [[number, number], [number, number]] => [
    [b[0][0] - dx, b[0][1] - dy],
    [b[1][0] + dx, b[1][1] + dy],
  ];

  // limites soft/hard para snap-back
  const softBoundsPair: BoundPair = useMemo(
    () => toPair(expand(brasilBounds, 2, 2)),
    [brasilBounds]
  );
  const hardBounds: LngLatBoundsLike = useMemo(
    () => expand(brasilBounds, 18, 12) as LngLatBoundsLike,
    [brasilBounds]
  );

  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<mapboxgl.Map | null>(null);

  // marcadores
  const regionMarkerRefs = useRef<mapboxgl.Marker[]>([]);
  const backMarkerRef = useRef<mapboxgl.Marker | null>(null);

  const [activeRegionId, setActiveRegionId] = useState<number | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN as string;

    const map = new mapboxgl.Map({
      container: mapRef.current,
      style: `mapbox://styles/${import.meta.env.VITE_MAPBOX_STYLE}`,
      center: [-51.9253, -14.235],
      zoom: 3.5,
      cooperativeGestures: true,
      renderWorldCopies: false,
      maxBounds: hardBounds, // limite "hard"
    });

    map.addControl(new mapboxgl.NavigationControl({ visualizePitch: true }), "top-right");

    map.once("load", () => {
      map.fitBounds(toPair(brasilBounds), { padding: 20 });
      createRegionMarkers();
      createBackMarker();
      updateMarkersVisibility(null); // sem região ativa -> mostra números
    });

    // snap-back: se soltar fora do softBounds, volta pro Brasil
    const onDragEnd = () => {
      const center = map.getCenter();
      const soft = new mapboxgl.LngLatBounds(softBoundsPair);
      if (!soft.contains(center)) {
        map.fitBounds(toPair(brasilBounds), {
          padding: 20,
          duration: 600,
          pitch: 0,
          bearing: 0,
        });
        setActiveRegionId(null);
        updateMarkersVisibility(null);
      }
    };
    map.on("dragend", onDragEnd);

    // helpers locais
    // function createCircleButton(text: string, className: string, onClick: () => void) {
    //   const btn = document.createElement("button");
    //   btn.className = className;
    //   btn.textContent = text;
    //   btn.onclick = (e) => {
    //     e.stopPropagation();
    //     onClick();
    //   };
    //   return btn;
    // }

    function createRegionMarkers() {
      // limpa antigos se houver
      regionMarkerRefs.current.forEach((m) => m.remove());
      regionMarkerRefs.current = [];

      regions.forEach((r) => {
        const btn = createCircleButton(String(r.id), "map-pin-round", () => {
          map.fitBounds(toPair(r.bounds), { padding: 40, duration: 700 });
          setActiveRegionId(r.id);
          // posiciona o "voltar" sobre a região ativa pra ficar visível
          backMarkerRef.current?.setLngLat(r.center);
          updateMarkersVisibility(r.id);
        });

        const marker = new mapboxgl.Marker({ element: btn, anchor: "center" })
          .setLngLat(r.center)
          .addTo(map);

        regionMarkerRefs.current.push(marker);
      });
    }

    function createBackMarker() {
      if (backMarkerRef.current) return;
      const btn = createCircleButton("↩︎", "map-pin-back", () => {
        map.fitBounds(toPair(brasilBounds), { padding: 20, duration: 700, pitch: 0, bearing: 0 });
        setActiveRegionId(null);
        updateMarkersVisibility(null);
      });
      // posição inicial qualquer; quando ativar uma região, movemos pra região.center
      const marker = new mapboxgl.Marker({ element: btn, anchor: "center" })
        .setLngLat({ lng: -55, lat: -5 }) // será atualizado ao clicar numa região
        .addTo(map);
      backMarkerRef.current = marker;
    }

    function updateMarkersVisibility(activeId: number | null) {
      // quando há região ativa -> esconder números e mostrar "voltar"
      regionMarkerRefs.current.forEach((m) => {
        (m.getElement() as HTMLElement).style.display = activeId === null ? "flex" : "none";
      });
      if (backMarkerRef.current?.getElement()) {
        (backMarkerRef.current.getElement() as HTMLElement).style.display = activeId === null ? "none" : "flex";
      }
    }

    mapInstance.current = map;

    // cleanup
    return () => {
      map.off("dragend", onDragEnd);
      regionMarkerRefs.current.forEach((m) => m.remove());
      regionMarkerRefs.current = [];
      backMarkerRef.current?.remove();
      backMarkerRef.current = null;
      map.remove();
      mapInstance.current = null;
    };
  }, [brasilBounds, regions, softBoundsPair, hardBounds]);

  return (
    <div className="app">
      <header className="header">
        <div className="brand">Mochileiro</div>
        <nav className="nav">
          <button className="nav-btn active">Mapa</button>
          <button className="nav-btn">Definir</button>
          <button className="nav-btn">Definir</button>
          <button className="nav-btn">Definir</button>
          <button className="nav-btn">Definir</button>
          <button className="nav-btn">Definir</button>
        </nav>
        <div className="right-box">
          <span className="pill">Guia</span>
          <div className="avatar" />
        </div>
      </header>



      <main className="main">
        <section className="mapWrapper">
          <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
        </section>


        <aside className="sidebar">
<DailyMissionsCard
  missions={[
    { id: "xp10",    title: "Ganhe 10 XP",                 icon: "xp",    current: 7, goal: 10 },
    { id: "study5",  title: "Estude por 5 minutos",        icon: "time",  current: 0, goal: 5  },
    { id: "bonus15", title: "Ganhe 15 XP de superbônus",   icon: "bonus", current: 0, goal: 15 },
  ]}
/>

          <div className="card">
            <h3>Ranking (preview)</h3>
            <ol className="rank">
              <li>#1 Alex — 1200</li>
              <li>#2 Bea — 980</li>
              <li>#3 Dimitre — 910</li>
            </ol>
          </div>
          <div className="card muted">
            <h3>Super bônus</h3>
            <p>Complete 3 fases na Região Norte.</p>
          </div>
        </aside>
      </main>
    </div>
  );
}
