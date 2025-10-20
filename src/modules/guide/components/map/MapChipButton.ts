// src/components/map/MapChipButton.ts
export type ChipVariant = "region" | "state";

type ChipOptions = {
  label: string;
  onClick: (ev: MouseEvent) => void;
  variant?: ChipVariant;
};

export function createMapChipButton({ label, onClick, variant = "region" }: ChipOptions) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = [
    "map-chip",
    "px-4 py-2 rounded-full font-extrabold shadow-lg whitespace-nowrap",
    "transition-transform duration-150 active:scale-95",
    variant === "region"
      ? "bg-white/90 text-[#1D514B] ring-4 ring-white/60"
      : "bg-white/90 text-[#24553b] ring-4 ring-white/70",
  ].join(" ");
  btn.textContent = label.toUpperCase();
  btn.onclick = (e) => {
    e.stopPropagation();
    onClick(e);
  };
  // acessibilidade
  btn.setAttribute("aria-label", label);
  btn.style.display = "flex";
  btn.style.alignItems = "center";
  btn.style.justifyContent = "center";
  btn.style.userSelect = "none";
  return btn;
}
