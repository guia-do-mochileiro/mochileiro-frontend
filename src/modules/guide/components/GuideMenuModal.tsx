import { useEffect, useLayoutEffect, useState } from "react";
import { X } from "lucide-react";
import { logout } from "#/utils/auth";
import ProfileModal from "./ProfileModal";
import { useSfx } from "#/hooks/useSfx";

type Props = {
  open: boolean;
  onClose: () => void;
  onProfile?: () => void;
  anchorEl?: HTMLElement | null;
  initialPhase?: "menu" | "confirm";
  confirmTitle?: string;
  onConfirm?: () => void;
};

export default function GuideMenuModal({
  open,
  onClose,
  onProfile,
  anchorEl,
  initialPhase = "menu",
  confirmTitle = "Tem certeza?",
  onConfirm,
}: Props) {
  const [phase, setPhase] = useState<"menu" | "confirm">(initialPhase);
  const [showProfile, setShowProfile] = useState(false);

  const { playClick } = useSfx({ volume: 0.8, clickVolume: 1 });

  useEffect(() => {
    if (!open) {
      setPhase(initialPhase);
      setShowProfile(false);
    } else {
      setPhase(initialPhase);
    }
  }, [open, initialPhase]);

  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);
  const width = 220;

  const computePos = () => {
    if (!anchorEl) return setPos(null);
    const rect = anchorEl.getBoundingClientRect();
    const top = rect.bottom + 8 + window.scrollY;
    const left = rect.right - width + window.scrollX;
    setPos({ top, left });
  };

  useLayoutEffect(() => {
    if (!open || phase !== "menu") return;
    computePos();
    const onResize = () => computePos();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [open, phase, anchorEl]);

  if (!open) return null;

  if (phase === "menu" && pos) {
    return (
      <>
        <div className="fixed inset-0 z-[99]" onClick={onClose} aria-hidden />
        <div
          role="menu"
          aria-label="Menu rápido"
          className="fixed z-[100] rounded-xl bg-[#9db668] p-2 shadow-lg ring-1 ring-black/10"
          style={{ top: pos.top, left: pos.left, width }}
        >
          <button
            role="menuitem"
            onClick={() => {
              playClick();
              setShowProfile(true);
              onProfile?.();
            }}
            className="w-full rounded-xl bg-white px-4 py-3 text-center font-extrabold text-[#9db668] hover:bg-white/95"
          >
            PERFIL
          </button>

          {/* NOVO BOTÃO: AVALIAR */}
          <button
            role="menuitem"
            onClick={() => {
              playClick();
              window.open(
                "https://forms.gle/qtn7byCnymUdVvJF6",
                "_blank",
                "noopener,noreferrer"
              );
            }}
            className="mt-2 w-full rounded-xl bg-white px-4 py-3 text-center font-extrabold text-[#9db668] hover:bg-white/95"
          >
            AVALIAR
          </button>

          <button
            role="menuitem"
            onClick={() => {
              playClick();
              setPhase("confirm");
            }}
            className="mt-2 w-full rounded-xl bg-white px-4 py-3 text-center font-extrabold text-[#9db668] hover:bg-white/95"
          >
            SAIR
          </button>
        </div>

        <ProfileModal open={showProfile} onClose={() => setShowProfile(false)} />
      </>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-black/50 backdrop-blur-[1px] p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-xl rounded-[28px] bg-[#9db668] p-6 md:p-8 shadow-2xl">
        <button
          type="button"
          aria-label="Fechar"
          onClick={() => {
            playClick();
            onClose();
          }}
          className="absolute right-4 top-4 rounded-full p-1 text-white/95 hover:opacity-90"
        >
          <X size={28} />
        </button>

        <div className="mx-auto w-full max-w-2xl pt-4">
          <p className="mb-6 text-center text-2xl font-extrabold text-white">
            {confirmTitle}
          </p>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                playClick();
                onConfirm ? onConfirm() : logout();
              }}
              className="w-full rounded-[32px] bg-white px-6 py-6 text-center text-2xl font-extrabold text-[#7a9456] shadow hover:opacity-95"
            >
              SIM
            </button>

            <button
              type="button"
              onClick={() => {
                playClick();
                if (!anchorEl || initialPhase === "confirm") {
                  onClose();
                } else {
                  setPhase("menu");
                }
              }}
              className="w-full rounded-[32px] bg-white px-6 py-6 text-center text-2xl font-extrabold text-[#7a9456] shadow hover:opacity-95"
            >
              NÃO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
