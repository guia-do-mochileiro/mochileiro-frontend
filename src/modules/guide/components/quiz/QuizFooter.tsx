type Props = {
  mode: "answering" | "feedback";
  canVerify: boolean;
  onSkip: () => void;
  onVerify: () => void;
  onNext: () => void;
  correct?: boolean | null;
  correctLetter?: "A" | "B" | "C" | "D";
  correctText?: string;
};

export default function QuizFooter({
  mode,
  canVerify,
  onSkip,
  onVerify,
  onNext,
  correct,
  correctLetter,
  correctText,
}: Props) {
  return (
    <div className="mt-4 border-t border-[#d6e389] pt-6">
      {mode === "answering" ? (
        <div className="flex items-center justify-center gap-5">
          <button
            type="button"
            onClick={onSkip}
            className="min-w-[220px] rounded-full bg-[#eaf3d9] px-8 py-4 text-lg font-extrabold text-[#7a9456] ring-1 ring-[#cfe3a2] hover:opacity-90"
          >
            PULAR
          </button>
          <button
            type="button"
            onClick={onVerify}
            disabled={!canVerify}
            className={[
              "min-w-[220px] rounded-full px-8 py-4 text-lg font-extrabold text-white",
              canVerify ? "bg-[#8aa33f] hover:opacity-95" : "cursor-not-allowed bg-[#b7c686]/60",
            ].join(" ")}
          >
            VERIFICAR
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          {correct ? (
            <div className="inline-flex items-center gap-3 rounded-xl border border-green-300 bg-green-50 px-5 py-3 text-lg text-green-800">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#e8f3d6] font-bold text-[#4c5c2b] ring-2 ring-[#88a95b]">
                ✓
              </span>
              <span className="font-semibold">Excelente!</span>
            </div>
          ) : (
            <div className="inline-flex flex-wrap items-center gap-3 rounded-xl border border-rose-300 bg-rose-50 px-5 py-3 text-lg text-rose-800">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#fde6e1] font-bold text-[#7a3d32] ring-2 ring-[#d38a7d]">
                ×
              </span>
              <span className="font-semibold">Você errou!</span>
              <span className="opacity-90">A resposta correta é:</span>
              {correctLetter && (
                <span className="ml-1 inline-flex items-center justify-center rounded-full bg-green-600 px-3 py-1 text-base font-bold text-white">
                  {correctLetter}
                </span>
              )}
              {correctText && <span className="font-semibold text-[#3b3b3b]">{correctText}</span>}
            </div>
          )}

          <button
            type="button"
            onClick={onNext}
            className={[
              "min-w-[220px] rounded-full px-8 py-4 text-lg font-extrabold text-white",
              correct ? "bg-[#8aa33f] hover:opacity-95" : "bg-[#e0716a] hover:opacity-95",
            ].join(" ")}
          >
            PRÓXIMA
          </button>
        </div>
      )}
    </div>
  );
}
