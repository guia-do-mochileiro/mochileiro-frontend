// src/modules/guide/components/patents/PromotionCard.tsx
import { useEffect, useMemo, useState } from "react";

// chip/ícone
import IconPromocao from "#/modules/guide/assets/icons/4 - PatentsIcon.png";
// cadeado
import LockIcon from "#/modules/guide/assets/achievements/0 - Bloqueio.png";

// escudos
import Pioneiro from "#/modules/guide/assets/patents/1 - Pioneiro.png";
import Explorador from "#/modules/guide/assets/patents/2 - Explorador.png";
import Navegador from "#/modules/guide/assets/patents/3 - Navegador.png";
import Aventureiro from "#/modules/guide/assets/patents/4 - Aventureiro.png";
import Viajante from "#/modules/guide/assets/patents/5 - Viajante.png";
import Guardiao from "#/modules/guide/assets/patents/6 - Guardião.png";
import Lendario from "#/modules/guide/assets/patents/7 - lendário.png";

import {
  fetchPatents,
  type PatentProgress,
} from "#/modules/guide/services/patentsService";

type Props = {
  /** cor da borda/acento (chip e borda) */
  accent?: string; // default "#9db668"
  /** cor do fundo do card */
  cardBg?: string; // default "#FFFDE1"
  /** tamanho dos escudos em px */
  shieldSize?: number; // default 90
  /** altura da barra de progresso */
  barHeight?: number; // default 20
};

// utils
const clamp = (v: number, min = 0, max = 100) => Math.max(min, Math.min(max, v));
const pct = (value: number, goal: number) =>
  clamp(Math.round((100 * value) / Math.max(1, goal)));

const NAME_TO_ICON: Record<string, string> = {
  PIONEIRO: Pioneiro,
  EXPLORADOR: Explorador,
  NAVEGADOR: Navegador,
  AVENTUREIRO: Aventureiro,
  VIAJANTE: Viajante,
  "GUARDIÃO": Guardiao,
  GUARDIAO: Guardiao, // fallback sem acento
  "LENDÁRIO": Lendario,
  LENDARIO: Lendario, // fallback sem acento
};

function iconFor(name?: string) {
  if (!name) return Pioneiro;
  const key = name.normalize("NFD").replace(/\p{Diacritic}/gu, "").toUpperCase();
  return NAME_TO_ICON[key] ?? Pioneiro;
}

export default function PromotionCard({
  accent = "#9db668",
  cardBg = "#FFFDE1",
  shieldSize = 90,
  barHeight = 20,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [items, setItems] = useState<PatentProgress[]>([]);

  // carrega do endpoint /api/patents
  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const list = await fetchPatents();
      // ordena pelo requiredPoints crescente (garante sequência correta)
      const ordered = [...list].sort(
        (a, b) => (a.requiredPoints ?? 0) - (b.requiredPoints ?? 0)
      );
      setItems(ordered);
    } catch (e: any) {
      setErr(e?.message ?? "Falha ao carregar patentes.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // calcula atual, próxima e progresso
  const {
    current,
    next,
    stepStart,
    stepGoal,
    stepValue,
    stepPct,
    atMax,
  } = useMemo(() => {
    if (!items.length) {
      return {
        currentPoints: 0,
        currentIdx: 0,
        nextIdx: 0,
        current: undefined,
        next: undefined,
        stepStart: 0,
        stepGoal: 1,
        stepValue: 0,
        stepPct: 0,
        atMax: false,
      };
    }

    // a API repete currentPoints em todos os itens; pegue de qualquer um
    const pointsNow = Number(items[0]?.currentPoints ?? 0);

    // índice da maior patente alcançada (por pontos OU por unlocked)
    let idx = 0;
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      if (pointsNow >= (it.requiredPoints ?? 0) || it.unlocked) idx = i;
    }
    const nextIndex = Math.min(items.length - 1, idx + 1);

    const cur = items[idx];
    const nxt = items[nextIndex];

    const start = cur?.requiredPoints ?? 0;
    const goal =
      nextIndex === idx ? Math.max(start, 1) : (nxt?.requiredPoints ?? start + 1);
    const value = clamp(pointsNow - start, 0, goal - start);
    const percent = nextIndex === idx ? 100 : pct(value, goal - start);

    return {
      currentPoints: pointsNow,
      currentIdx: idx,
      nextIdx: nextIndex,
      current: cur,
      next: nxt,
      stepStart: start,
      stepGoal: goal,
      stepValue: value,
      stepPct: percent,
      atMax: nextIndex === idx && idx === items.length - 1,
    };
  }, [items]);

  // backgrounds da barra (iguais ao DailyMissionsCard)
  const trackBg = useMemo(
    () => `
      radial-gradient(circle at 12px 50%, rgba(75,40,2,.30) 5px, transparent 6px) repeat-x,
      linear-gradient(#4B2802, #4B2802)
    `,
    []
  );
  const fillBg = useMemo(
    () => `
      radial-gradient(circle at 12px 50%, rgba(90,160,95,.55) 5px, transparent 6px) repeat-x,
      linear-gradient(90deg, #98cf92, #5ea963)
    `,
    []
  );

  return (
    <div>
      {/* CHIP “PROMOÇÃO” */}
      <div
        className="inline-flex items-center gap-2 rounded-xl px-4 py-2 font-semibold text-white shadow mb-3"
        style={{ backgroundColor: accent }}
        aria-label="Promoção"
      >
        <img src={IconPromocao} alt="" aria-hidden className="h-8 w-8 object-contain" />
        <span>PONTOS</span>
      </div>

      {/* CARD */}
      <section
        className="rounded-2xl shadow"
        style={{
          background: cardBg,
          border: `6px solid ${accent}`,
          padding: "16px 16px 18px",
        }}
      >
        {loading ? (
          <div className="text-sm text-[#6b5a2a] px-1 py-2">Carregando…</div>
        ) : err ? (
          <div className="text-sm text-rose-700 px-1 py-2">
            {err}{" "}
            <button
              className="ml-2 rounded bg-white/60 px-2 py-0.5 text-rose-900 ring-1 ring-rose-300"
              onClick={load}
            >
              Tentar novamente
            </button>
          </div>
        ) : !items.length ? (
          <div className="text-sm text-[#6b5a2a] px-1 py-2">Sem patentes por aqui.</div>
        ) : (
          <>
            {/* Faixa com escudos e linha pontilhada */}
            <div
              className="relative rounded-2xl bg-white px-4 py-6"
              style={{ boxShadow: "inset 0 0 0 2px rgba(0,0,0,.04)" }}
            >
              {/* linha pontilhada entre eles */}
              <div
                aria-hidden
                className="absolute left-0 right-0"
                style={{
                  top: "50%",
                  transform: "translateY(-50%)",
                  borderBottom: "6px dotted #1E1E1E",
                  opacity: 0.9,
                  marginLeft: shieldSize * 0.9,
                  marginRight: shieldSize * 0.9,
                }}
              />

              <div className="flex items-center justify-between gap-4">
                {/* atual */}
                <div className="relative grid place-items-center">
                  <img
                    src={iconFor(current?.name)}
                    alt={current?.name ?? "Patente atual"}
                    className="select-none"
                    draggable={false}
                    style={{
                      width: shieldSize,
                      height: shieldSize,
                      objectFit: "contain",
                      filter: "drop-shadow(0 4px 0 rgba(0,0,0,.12))",
                    }}
                  />
                </div>

                {/* próxima (ou a mesma quando já é a última) */}
                <div className="relative grid place-items-center">
                  <img
                    src={iconFor(next?.name)}
                    alt={next?.name ?? "Próxima patente"}
                    className="select-none"
                    draggable={false}
                    style={{
                      width: shieldSize,
                      height: shieldSize,
                      objectFit: "contain",
                      filter: atMax
                        ? "drop-shadow(0 4px 0 rgba(0,0,0,.12))"
                        : "grayscale(1) contrast(0.9) brightness(0.95) drop-shadow(0 4px 0 rgba(0,0,0,.12))",
                    }}
                  />

                  {/* cadeado quando ainda não atingiu a próxima */}
                  {!atMax && (
                    <img
                      src={LockIcon}
                      alt="Bloqueado"
                      draggable={false}
                      className="pointer-events-none select-none"
                      style={{
                        position: "absolute",
                        width: Math.round(shieldSize * 0.7),
                        height: Math.round(shieldSize * 0.7),
                      }}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* título + barra */}
            <div className="mt-3 text-center">
              <div
                className="font-extrabold"
                style={{ color: "#7a9456", fontSize: 20 }}
              >
                {atMax ? "Máximo" : "Responda e Ganhe Pontos"}
              </div>

              <div
                className="mt-2"
                aria-label="Progresso até a próxima patente"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={stepPct}
              >
                <div
                  style={{
                    position: "relative",
                    height: barHeight,
                    borderRadius: 999,
                    background: trackBg,
                    backgroundSize: `26px ${barHeight}px, 100% 100%`,
                    overflow: "hidden",
                    boxShadow: "inset 0 -2px 0 rgba(0,0,0,.08)",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${stepPct}%`,
                      borderRadius: 999,
                      background: fillBg,
                      backgroundSize: `26px ${barHeight}px, 100% 100%`,
                      transition: "width .25s ease",
                    }}
                  />
                  <span
                    className="font-extrabold"
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                      fontSize: 14,
                      color: "#fff",
                      pointerEvents: "none",
                    }}
                  >
                    {atMax
                      ? `${current?.requiredPoints ?? 0}/${current?.requiredPoints ?? 0}`
                      : `${stepValue}/${Math.max(1, stepGoal - stepStart)}`}
                  </span>
                </div>

                {/* {!atMax && (
                  <div className="mt-1 text-xs font-semibold text-[#6b5a2a]">
                    {`Faltam ${Math.max(
                      0,
                      stepGoal - Math.max(stepStart, currentPoints)
                    )} pts para ${next?.name ?? ""}`}
                  </div>
                )} */}
              </div>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
