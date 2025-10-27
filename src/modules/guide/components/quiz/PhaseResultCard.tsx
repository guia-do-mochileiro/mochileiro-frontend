
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Menu as MenuIcon } from "lucide-react";


import { useSfx } from "#/hooks/useSfx";


import PatentBackdrop from "#/modules/guide/assets/patents/0 - back.png";


import PatentPioneiro from "#/modules/guide/assets/patents/1 - Pioneiro.png";
import PatentExplorador from "#/modules/guide/assets/patents/2 - Explorador.png";
import PatentNavegador from "#/modules/guide/assets/patents/3 - Navegador.png";
import PatentAventureiro from "#/modules/guide/assets/patents/4 - Aventureiro.png";
import PatentViajante from "#/modules/guide/assets/patents/5 - Viajante.png";
import PatentGuardiao from "#/modules/guide/assets/patents/6 - Guardião.png";
import PatentLendario from "#/modules/guide/assets/patents/7-lendario.png";


import { fetchPatents, type PatentName, type PatentProgress } from "#/modules/guide/services/patentsService";

type Props = {
  passed: boolean;
  phaseName?: string;

  
  correct?: number;
  wrong?: number;

  
  onMenu?: () => void;
  onNext?: () => void;

  
  patentIconSrc?: string;
};


const PATENT_ICON_MAP: Record<PatentName, string> = {
  PIONEIRO: PatentPioneiro,
  EXPLORADOR: PatentExplorador,
  NAVEGADOR: PatentNavegador,
  AVENTUREIRO: PatentAventureiro,
  VIAJANTE: PatentViajante,
  "GUARDIÃO": PatentGuardiao,
  "LENDÁRIO": PatentLendario,
};


const ORDERED_NAMES: PatentName[] = [
  "PIONEIRO",
  "EXPLORADOR",
  "NAVEGADOR",
  "AVENTUREIRO",
  "VIAJANTE",
  "GUARDIÃO",
  "LENDÁRIO",
];

export default function PhaseResultCard({
  passed,
  phaseName,
  onMenu,
  onNext,
  patentIconSrc,
}: Props) {
  const { playClick } = useSfx(); 

  const [autoIcon, setAutoIcon] = useState<string | null>(null);
  const effectiveIcon = useMemo(() => patentIconSrc ?? autoIcon ?? PatentPioneiro, [patentIconSrc, autoIcon]);

  
  useEffect(() => {
    if (patentIconSrc) return; 
    let mounted = true;

    (async () => {
      try {
        const list = await fetchPatents(); 
        const highest = resolveHighestUnlocked(list);
        const icon = highest ? PATENT_ICON_MAP[highest as PatentName] ?? PatentPioneiro : PatentPioneiro;
        if (mounted) setAutoIcon(icon);
      } catch {
        if (mounted) setAutoIcon(PatentPioneiro);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [patentIconSrc]);

  function resolveHighestUnlocked(list: PatentProgress[]): PatentName | null {
    if (!Array.isArray(list) || list.length === 0) return null;

    
    for (let i = list.length - 1; i >= 0; i--) {
      const p = list[i];
      if (p?.unlocked) {
        
        const name = (p.name || "").toUpperCase() as PatentName;
        if (ORDERED_NAMES.includes(name)) return name;
        break;
      }
    }

    
    const unlocked = list.filter((p) => p.unlocked);
    if (unlocked.length) {
      const top = unlocked.reduce((acc, cur) =>
        cur.requiredPoints > acc.requiredPoints ? cur : acc
      );
      const name = (top.name || "").toUpperCase() as PatentName;
      return ORDERED_NAMES.includes(name) ? name : "PIONEIRO";
    }

    return "PIONEIRO";
  }

  const handleMenu = () => {
    playClick();
    onMenu?.();
  };
  const handleNext = () => {
    playClick();
    onNext?.();
  };

  return (
    <div className="mx-auto w-full max-w-3xl rounded-2xl border border-[#dcd7a8] bg-[#FFFDEB] p-6 sm:p-8 text-center shadow">
      
      <div className="relative mx-auto h-[220px] w-[220px] sm:h-[260px] sm:w-[260px]">
        <img
          src={PatentBackdrop}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-contain select-none"
          draggable={false}
        />
        <img
          src={effectiveIcon}
          alt="Patente conquistada"
          className="absolute left-1/2 top-1/2 h-[68%] w-[68%] -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow"
          draggable={false}
          style={{ filter: "drop-shadow(0 10px 0 rgba(0,0,0,.10))" }}
        />
      </div>

      <h3 className="flex items-center justify-center gap-2 text-3xl sm:text-4xl font-extrabold text-[#69521a]">
        {passed ? "Parabéns!" : "Fase concluída"}
      </h3>

      <p className="mt-2 text-base sm:text-lg font-semibold text-[#7a6a32]">
        {passed
          ? `Você concluiu a fase${phaseName ? ` ${phaseName}` : ""}!`
          : `Você completou a fase${phaseName ? ` ${phaseName}` : ""}.`}
      </p>

      
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={handleMenu}
          className="inline-flex min-w-[190px] items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-extrabold text-[#7a9456] ring-2 ring-[#cfe3a2] transition hover:bg-[#f7ffe9]"
        >
          <MenuIcon className="h-5 w-5" aria-hidden />
          MENU
        </button>

        <button
          type="button"
          onClick={handleNext}
          className="inline-flex min-w-[190px] items-center justify-center gap-2 rounded-full bg-[#8aa33f] px-6 py-3 font-extrabold text-white transition hover:brightness-105"
        >
          PRÓXIMA FASE
          <ArrowRight className="h-5 w-5" aria-hidden />
        </button>
      </div>
    </div>
  );
}
