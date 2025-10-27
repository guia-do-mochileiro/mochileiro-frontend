
import { ChevronLeft } from "lucide-react";
import { useSfx } from "#/hooks/useSfx";

type PhaseColor = "green" | "coral" | "yellow" | "blue";

type Props = {
  iconSrc: string;
  label: string;
  color?: PhaseColor;
  onBack?: () => void;
  backAriaLabel?: string;
};

const palette: Record<PhaseColor, { circle: string; chip: string }> = {
  green:  { circle: "#3d5f3a", chip: "#3d5f3a" },
  coral:  { circle: "#f2998e", chip: "#f2998e" },
  yellow: { circle: "#f6c56b", chip: "#f6c56b" },
  blue:   { circle: "#7ab6f2", chip: "#7ab6f2" },
};

export default function GuideQuizNavbar({
  iconSrc,
  label,
  color = "green",
  onBack,
  backAriaLabel = "Voltar",
}: Props) {
  const colors = palette[color];
  const { playClick } = useSfx({ volume: 0.8, clickVolume: 1 });

  const handleBack = () => {
    playClick();
    onBack?.();
  };

  return (
    <div className="w-full bg-[#9db668]">
      <div className="mx-auto px-3 py-3">
        <div className="flex items-center justify-between rounded-xl bg-[#FFFDE1] px-3 py-2 shadow">
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label={backAriaLabel}
              onClick={handleBack}
              className="grid h-9 w-9 place-items-center rounded-full bg-[#9db668] text-white shadow hover:opacity-90"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3">
              <div
                className="relative grid h-12 w-12 place-items-center rounded-full shadow ring-2 ring-white/80"
                style={{ background: colors.circle }}
              >
                <img src={iconSrc} alt="" className="h-6 w-6 object-contain" />
              </div>

              <div
                className="rounded-full px-4 py-2 text-[12px] font-extrabold tracking-wide text-white ring-2 ring-white shadow"
                style={{ background: colors.chip }}
              >
                {label}
              </div>
            </div>
          </div>

          <div className="h-9" />
        </div>
      </div>
    </div>
  );
}
