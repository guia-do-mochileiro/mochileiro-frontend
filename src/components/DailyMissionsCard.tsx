
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import Bandeira from "../assets/icons/Bandeira.png";
import AchievementsIcon from "#/modules/guide/assets/icons/3 - Achievementscon.png";
import ImgCenter from "#/modules/guide/assets/quiz/4 - ImgCenter.png";

import {
  getAchievements,
  type Achievement,
} from "#/modules/guide/services/achievementsService";

type Props = {
  
  accent?: string; 
  
  cardBg?: string; 
  
  iconSize?: number; 
  
  barHeight?: number; 
};

const clamp = (v: number, min = 0, max = 100) => Math.max(min, Math.min(max, v));
const pct = (current: number, goal: number) =>
  clamp(Math.round((100 * (current ?? 0)) / Math.max(1, goal ?? 1)));

const iconModules = import.meta.glob<string>(
  "/src/modules/guide/assets/achievements/*.png",
  { eager: true, as: "url" }
);

function norm(s: string) {
  return s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/\.(png|jpg|jpeg|webp)$/i, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function resolveAchievementIcon(name: string): string {
  const target = norm(name);
  for (const [path, url] of Object.entries(iconModules)) {
    const filename = path.split("/").pop() || "";
    if (norm(filename) === target) return url as string;
  }
  return ImgCenter;
}

export default function DailyMissionsCard({
  accent = "#9db668",
  cardBg = "#FFFDE1",
  iconSize = 28,
  barHeight = 20,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [items, setItems] = useState<Achievement[]>([]);
  const [page, setPage] = useState(0);

  async function load() {
    setLoading(true);
    setErr(null);
    try {
      const res = await getAchievements({ page: 0, size: 50, sort: "name,asc" });
      const ordered = [...res.content].sort(
        (a, b) => Number(b.completed) - Number(a.completed)
      );
      setItems(ordered);
      setPage(0);
    } catch (e: any) {
      setErr(e?.message ?? "Falha ao carregar conquistas.");
      setItems([]);
      setPage(0);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const pageSize = 3;
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const start = page * pageSize;
  const slice = items.slice(start, start + pageSize);

  
  const trackBg = useMemo(
    () =>
      `
    radial-gradient(circle at 12px 50%, rgba(75,40,2,.30) 5px, transparent 6px) repeat-x,
    linear-gradient(#4B2802, #4B2802)
  `,
    []
  );
  const fillBg = useMemo(
    () =>
      `
    radial-gradient(circle at 12px 50%, rgba(90,160,95,.55) 5px, transparent 6px) repeat-x,
    linear-gradient(90deg, #98cf92, #5ea963)
  `,
    []
  );

  return (
    <div>
      <div
        className="inline-flex items-center gap-2 rounded-xl px-4 py-2 font-semibold text-white shadow mb-3"
        style={{ backgroundColor: accent }}
        aria-label="Missões"
      >
        <img src={AchievementsIcon} alt="" aria-hidden className="h-8 w-8 object-contain" />
        <span>MISSÕES</span>
      </div>

      <section
        className="rounded-2xl shadow relative"
        style={{
          background: cardBg,
          border: `6px solid ${accent}`,
          padding: "14px 14px 44px", 
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
        ) : items.length === 0 ? (
          <div className="text-sm text-[#6b5a2a] px-1 py-2">Sem conquistas por aqui.</div>
        ) : (
          <>
            <ul className="m-0 grid list-none gap-4 p-0">
              {slice.map((a) => {
                const progressVal = pct(a.progress, a.goal);
                const iconSrc = resolveAchievementIcon(a.name);
                return (
                  <li
                    key={a.achievementId}
                    className="items-center gap-3"
                    style={{
                      display: "grid",
                      gridTemplateColumns: `${iconSize}px 1fr ${iconSize}px`,
                    }}
                  >
                    <img
                      src={iconSrc}
                      alt=""
                      draggable={false}
                      className="select-none mt-[20px]"
                      style={{
                        width: iconSize,
                        height: iconSize,
                        objectFit: "contain",
                        filter: "drop-shadow(0 4px 0 rgba(0,0,0,.12))",
                      }}
                    />
                    <div>
                      <div
                        className="font-extrabold"
                        style={{
                          color: "#6fb05d",
                          fontSize: 14,
                          lineHeight: "18px",
                          marginBottom: 6,
                        }}
                        title={a.name}
                      >
                        {a.name}
                      </div>

                      <div
                        aria-label="Progresso"
                        role="progressbar"
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-valuenow={progressVal}
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
                              width: `${progressVal}%`,
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
                            {Math.min(a.progress, a.goal)}/{a.goal}
                          </span>
                        </div>
                      </div>
                    </div>
                    <img
                      src={Bandeira}
                      alt="flag"
                      draggable={false}
                      className="select-none mt-[20px]"
                      style={{
                        width: iconSize,
                        height: iconSize,
                        objectFit: "contain",
                        filter: "drop-shadow(0 4px 0 rgba(0,0,0,.12))",
                      }}
                    />
                  </li>
                );
              })}
            </ul>
            <div className="absolute bottom-2 right-2 flex items-center gap-2">
              <button
                type="button"
                aria-label="Anterior"
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="grid h-8 w-8 place-items-center rounded-full bg-white text-[#6b5a2a] ring-1 ring-[#dcd7a8] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FFFDEB]"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                aria-label="Próximo"
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="grid h-8 w-8 place-items-center rounded-full bg-white text-[#6b5a2a] ring-1 ring-[#dcd7a8] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FFFDEB]"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
