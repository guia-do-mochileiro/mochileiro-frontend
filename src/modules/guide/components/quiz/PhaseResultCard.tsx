// src/modules/guide/components/quiz/PhaseResultCard.tsx
import { ArrowRight, Menu as MenuIcon } from "lucide-react";

// Fundo de confetes + ícone de patente (fixo por enquanto)
import PatentBackdrop from "#/modules/guide/assets/patents/0 - back.png";
import PatentIcon from "#/modules/guide/assets/patents/1 - Pioneiro.png";

type Props = {
  passed: boolean;
  phaseName?: string;

  /** mostramos, mas sem emojis; com ícones da lucide */
  correct?: number;
  wrong?: number;

  /** callbacks dos botões */
  onMenu?: () => void;
  onNext?: () => void;

  /** permitir trocar o ícone da patente no futuro */
  patentIconSrc?: string;
};

export default function PhaseResultCard({
  passed,
  phaseName,
  onMenu,
  onNext,
  patentIconSrc,
}: Props) {
  return (
    <div className="mx-auto w-full max-w-3xl rounded-2xl border border-[#dcd7a8] bg-[#FFFDEB] p-6 sm:p-8 text-center shadow">
      {/* Título */}



      {/* Patente grande com fundo de confetes */}
      <div className="relative mx-auto h-[220px] w-[220px] sm:h-[260px] sm:w-[260px]">
        <img
          src={PatentBackdrop}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-contain select-none"
          draggable={false}
        />
        <img
          src={patentIconSrc ?? PatentIcon}
          alt="Patente conquistada"
          className="absolute left-1/2 top-1/2 h-[68%] w-[68%] -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow"
          draggable={false}
          style={{ filter: "drop-shadow(0 10px 0 rgba(0,0,0,.10))" }}
        />
      </div>
            <h3 className="flex items-center justify-center gap-2 text-3xl sm:text-4xl font-extrabold text-[#69521a]">
        {/* <Trophy className="h-8 w-8 shrink-0 text-[#8aa33f]" aria-hidden /> */}
        {passed ? "Parabéns!" : "Fase concluída"}
      </h3>
            <p className="mt-2 text-base sm:text-lg font-semibold text-[#7a6a32]">
        {passed
          ? `Você concluiu a fase${phaseName ? ` ${phaseName}` : ""}!`
          : `Você completou a fase${phaseName ? ` ${phaseName}` : ""}.`}
      </p>

      {/* {(correct != null || wrong != null) && (
        <div className="mt-5 flex flex-wrap justify-center gap-3 text-[#5b4d1e]">
          {correct != null && (
            <div className="inline-flex items-center gap-2 rounded-xl bg-[#eaf3d9] px-4 py-2 ring-1 ring-[#cfe3a2]">
              <CheckCircle className="h-5 w-5 text-[#6aa14f]" aria-hidden />
              <span className="font-semibold">Corretas:</span>
              <b className="tabular-nums">{correct}</b>
            </div>
          )}
          {wrong != null && (
            <div className="inline-flex items-center gap-2 rounded-xl bg-[#ffe9ea] px-4 py-2 ring-1 ring-[#ffd1d6]">
              <XCircle className="h-5 w-5 text-[#c65656]" aria-hidden />
              <span className="font-semibold">Erradas:</span>
              <b className="tabular-nums">{wrong}</b>
            </div>
          )}
        </div>
      )} */}

      {/* Ações: apenas MENU e PRÓXIMA FASE */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
        <button
          type="button"
          onClick={onMenu}
          className="inline-flex min-w-[190px] items-center justify-center gap-2 rounded-full bg-white px-6 py-3 font-extrabold text-[#7a9456] ring-2 ring-[#cfe3a2] transition hover:bg-[#f7ffe9]"
        >
          <MenuIcon className="h-5 w-5" aria-hidden />
          MENU
        </button>

        <button
          type="button"
          onClick={onNext}
          className="inline-flex min-w-[190px] items-center justify-center gap-2 rounded-full bg-[#8aa33f] px-6 py-3 font-extrabold text-white transition hover:brightness-105"
        >
          PRÓXIMA FASE
          <ArrowRight className="h-5 w-5" aria-hidden />
        </button>
      </div>
    </div>
  );
}
