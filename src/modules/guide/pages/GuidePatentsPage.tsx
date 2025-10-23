import { useEffect, useMemo, useState } from "react";
import MapaPatentes from "#/modules/guide/assets/MapaPatentes.png";

// Escudos (patentes)
import Pioneiro from "#/modules/guide/assets/patents/1 - Pioneiro.png";
import Explorador from "#/modules/guide/assets/patents/2 - Explorador.png";
import Navegador from "#/modules/guide/assets/patents/3 - Navegador.png";
import Aventureiro from "#/modules/guide/assets/patents/4 - Aventureiro.png";
import Viajante from "#/modules/guide/assets/patents/5 - Viajante.png";
import Guardiao from "#/modules/guide/assets/patents/6 - Guardião.png";
import Lendario from "#/modules/guide/assets/patents/7 - lendário.png";

// Ícone de bloqueio (mesmo usado nas conquistas)
import LockIcon from "#/modules/guide/assets/achievements/0 - Bloqueio.png";

import {
  fetchPatents,
  type PatentProgress,
} from "#/modules/guide/services/patentsService";

type Pin = {
  /** nome para casar com o back (normalizado) */
  key: "PIONEIRO" | "EXPLORADOR" | "NAVEGADOR" | "AVENTUREIRO" | "VIAJANTE" | "GUARDIAO" | "LENDARIO";
  src: string;
  alt: string;
  /** posições relativas ao container (imagem) */
  topPct: number; // 0..100 (pode passar >100 para partes bem abaixo)
  leftPct: number; // 0..100
  /** largura relativa ao container (mantém escala responsiva) */
  widthPct?: number; // default 10%
};

/** normaliza nome do back para lookup (tira acentos e deixa MAIÚSCULO) */
function normName(s: string) {
  return s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toUpperCase().trim();
}

/**
 * Distribuição (topo -> base) seguindo sua última versão.
 * Obs: para GUARDIÃO/LENDÁRIO usei as chaves normalizadas.
 */
const PINS: Pin[] = [
  { key: "PIONEIRO",    src: Pioneiro,    alt: "Pioneiro",    topPct: 10,  leftPct: 78, widthPct: 10 },
  { key: "EXPLORADOR",  src: Explorador,  alt: "Explorador",  topPct: 40,  leftPct: 63, widthPct: 10 },
  { key: "NAVEGADOR",   src: Navegador,   alt: "Navegador",   topPct: 75,  leftPct: 72, widthPct: 10 },
  { key: "AVENTUREIRO", src: Aventureiro, alt: "Aventureiro", topPct: 115, leftPct: 70, widthPct: 10 },
  { key: "VIAJANTE",    src: Viajante,    alt: "Viajante",    topPct: 118, leftPct: 28, widthPct: 10 },
  { key: "GUARDIAO",    src: Guardiao,    alt: "Guardião",    topPct: 155, leftPct: 35, widthPct: 10 },
  { key: "LENDARIO",    src: Lendario,    alt: "Lendário",    topPct: 205, leftPct: 40, widthPct: 10 },
];

export default function GuidePatentsPage() {
  const [items, setItems] = useState<PatentProgress[] | null>(null);
  const [loading, setLoading] = useState(false);

  // carrega progresso do usuário
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const list = await fetchPatents();
        if (!alive) return;
        setItems(list);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // indexa por nome normalizado para lookup rápido
  const byName = useMemo(() => {
    const map: Record<string, PatentProgress> = {};
    (items ?? []).forEach((p) => (map[normName(p.name)] = p));
    return map;
  }, [items]);

  return (
    /**
     * O <section> pai (de GuidePage) é "relative".
     * Aqui usamos "absolute inset-0" para ocupar 100% da área e
     * transformamos toda a área preta em um container rolável com a imagem ao fundo.
     */
    <div className="absolute inset-0">
      <div
        className="
          relative h-full w-full overflow-y-auto overflow-x-hidden
          [scrollbar-width:thin]
        "
        aria-label="Mapa de patentes rolável"
      >
        {/* Imagem base (fundo) */}
        <img
          src={MapaPatentes}
          alt="Mapa de patentes"
          className="block w-full select-none pointer-events-none"
          draggable={false}
        />

        {/* Escudos sobre o mapa */}
        {PINS.map((pin, i) => {
          const info = byName[pin.key]; // já normalizado
          const unlocked =
            info ? (info.unlocked ?? info.currentPoints >= info.requiredPoints) : false;

          // dica ao passar o mouse
          const title =
            info
              ? `${pin.alt} — ${unlocked ? "Desbloqueada" : "Bloqueada"} • ${info.currentPoints}/${info.requiredPoints} pts`
              : pin.alt;

          return (
            <div
              key={i}
              className="absolute z-[2] select-none"
              style={{
                top: `${pin.topPct}%`,
                left: `${pin.leftPct}%`,
                width: `${pin.widthPct ?? 10}%`,
                transform: "translate(-50%, -50%)",
              }}
              title={title}
              aria-label={title}
            >
              {/* selo */}
              <img
                src={pin.src}
                alt={pin.alt}
                draggable={false}
                className={[
                  "block w-full h-auto drop-shadow-[0_2px_2px_rgba(0,0,0,0.25)]",
                  unlocked ? "" : "grayscale opacity-70",
                  loading ? "animate-pulse" : "",
                ].join(" ")}
              />
              {/* cadeado sobreposto quando bloqueado */}
              {!unlocked && (
                <img
                  src={LockIcon}
                  alt="Bloqueado"
                  draggable={false}
                  className="pointer-events-none absolute left-1/2 top-1/2 h-[60%] w-auto -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_2px_2px_rgba(0,0,0,0.35)]"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
