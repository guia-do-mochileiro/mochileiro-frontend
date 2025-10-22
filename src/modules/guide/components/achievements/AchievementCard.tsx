// src/modules/guide/components/achievements/AchievementCard.tsx
import { useMemo } from "react";

import ImgCenter from "#/modules/guide/assets/quiz/4 - ImgCenter.png";
import LockImg from "#/modules/guide/assets/achievements/0 - Bloqueio.png";

type Props = {
  name: string;
  description: string;
  goal: number;
  progress: number;
  completed: boolean;
};

/** carrega todos os PNGs da pasta de conquistas como URLs em build-time */
const iconModules = import.meta.glob<string>(
  "/src/modules/guide/assets/achievements/*.png",
  { eager: true, as: "url" }
);

/** normaliza para comparar nomes de arquivo vs. `name` do backend */
function norm(s: string) {
  return s
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/\.(png|jpg|jpeg|webp)$/i, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function resolveAchievementIcon(name: string, completed: boolean): string {
  if (!completed) return LockImg;

  const target = norm(name);
  // encontra pelo nome do arquivo (sem extensão), ex.: "Mestre em Cultura e Sociedade.png"
  for (const [path, url] of Object.entries(iconModules)) {
    const filename = path.split("/").pop() || "";
    if (norm(filename) === target) return url as string;
  }
  // fallback se não achar imagem específica
  return ImgCenter;
}

/**
 * Card de conquista:
 * - Se completed = true: fundo claro, imagem da pasta /assets/achievements pelo nome.
 * - Se completed = false: fundo cinza + ícone "0 - Bloqueio.png".
 */
export default function AchievementCard({
  name,
  description,
  goal,
  progress,
  completed,
}: Props) {
  const pct = Math.min(100, Math.round(((progress ?? 0) / Math.max(1, goal ?? 1)) * 100));
  const locked = !completed;

  const iconUrl = useMemo(() => resolveAchievementIcon(name, completed), [name, completed]);

  return (
    <div
      className={[
        "rounded-xl border p-4 sm:p-5 transition shadow-sm",
        locked ? "border-slate-300 bg-slate-100" : "border-[#dcd7a8] bg-[#FFFDEB]",
      ].join(" ")}
      aria-live="polite"
    >
      {/* Cabeçalho */}
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-12 shrink-0">
          <img
            src={iconUrl}
            alt=""
            className="h-full w-full object-contain"
            draggable={false}
          />
        </div>
        <h3
          className={[
            "text-lg font-extrabold leading-snug",
            locked ? "text-slate-500" : "text-[#69521a]",
          ].join(" ")}
          title={name}
        >
          {name}
        </h3>
      </div>

      {/* Descrição */}
      <p
        className={[
          "mt-2 text-sm",
          locked ? "text-slate-500/80" : "text-[#7a6a32]",
        ].join(" ")}
      >
        {description}
      </p>

      {/* Progresso */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-sm font-semibold">
          <span className={locked ? "text-slate-500" : "text-[#5b4d1e]"}>Progresso</span>
          <span className={["tabular-nums", locked ? "text-slate-600" : "text-[#5b4d1e]"].join(" ")}>
            {Math.min(progress, goal)}/{goal}
          </span>
        </div>

        {/* Barra */}
        <div className="mt-2 h-2 w-full rounded-full bg-slate-300/60">
          <div
            className={["h-2 rounded-full", locked ? "bg-slate-500/50" : "bg-[#9db668]"].join(" ")}
            style={{ width: `${pct}%` }}
          />
        </div>

        {/* Selo de concluído */}
        {completed && (
          <div className="mt-3 inline-flex items-center rounded-full bg-[#eaf3d9] px-3 py-1 text-xs font-bold text-[#7a9456] ring-1 ring-[#cfe3a2]">
            CONCLUÍDA
          </div>
        )}
      </div>
    </div>
  );
}
