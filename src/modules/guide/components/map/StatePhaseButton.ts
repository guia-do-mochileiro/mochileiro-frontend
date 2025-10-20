// src/modules/guide/components/map/StatePhaseButton.ts
type PhaseColor = "green" | "coral" | "yellow" | "blue";

type Options = {
  label: string;
  color: PhaseColor;         // cor quando liberada
  iconSrc: string;           // caminho do ícone da fase (png)
  locked?: boolean;          // bloqueado => grayscale + cadeado
  onClick?: () => void;      // ação ao clicar (só dispara se !locked)
};

export function createStatePhaseButton({
  label,
  color,
  iconSrc,
  locked = false,
  onClick,
}: Options): HTMLElement {
  // wrapper para permitir pointer-events no marker e layout vertical
  const root = document.createElement("div");
  root.className = "flex flex-col items-center gap-2 select-none";
  root.style.pointerEvents = "auto";

  // Paleta por cor (círculo e chip quando liberado)
  const palette: Record<PhaseColor, { circle: string; chip: string }> = {
    green:  { circle: "#3d5f3a", chip: "#3d5f3a" },
    coral:  { circle: "#f2998e", chip: "#f2998e" },
    yellow: { circle: "#f6c56b", chip: "#f6c56b" },
    blue:   { circle: "#7ab6f2", chip: "#7ab6f2" },
  };

  const colors = palette[color];

  // ---- CÍRCULO (ícone)
  const circle = document.createElement("div");
  circle.className =
    "relative grid place-items-center rounded-full shadow-lg ring-2 ring-white/80";
  circle.style.width = "72px";
  circle.style.height = "72px";
  circle.style.background = colors.circle;

  // Ícone da fase (imagem)
  const img = document.createElement("img");
  img.src = iconSrc;
  img.alt = "";
  img.className = "w-10 h-10 object-contain";
  circle.appendChild(img);

  // Overlay de cadeado quando bloqueado
  if (locked) {
    // escala de cinza
    circle.style.filter = "grayscale(100%)";
    // cadeado
    const lock = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    lock.setAttribute("viewBox", "0 0 24 24");
    lock.setAttribute("width", "28");
    lock.setAttribute("height", "28");
    lock.classList.add("absolute");
    lock.innerHTML =
      '<path d="M7 11V8a5 5 0 0 1 10 0v3M6 11h12v9H6z" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
    (lock as any).style.color = "#374151"; // cinza-700
    root.appendChild(circle);
    circle.appendChild(lock);
  }

  // ---- CHIP
  const chip = document.createElement("button");
  chip.type = "button";
  chip.className = [
    "px-5 py-2 rounded-full text-white font-extrabold text-[13px] tracking-wide",
    "shadow-md ring-2 ring-white",
    "transition-transform",
  ].join(" ");
  chip.style.background = colors.chip;
  chip.textContent = label;

  // estado bloqueado no chip: cinza + cursor
  if (locked) {
    chip.style.filter = "grayscale(100%)";
    chip.style.cursor = "not-allowed";
    chip.setAttribute("aria-disabled", "true");
  } else {
    chip.style.cursor = "pointer";
    chip.addEventListener("mouseenter", () => (chip.style.transform = "translateY(-1px)"));
    chip.addEventListener("mouseleave", () => (chip.style.transform = "translateY(0)"));
    chip.onclick = (e) => {
      e.stopPropagation();
      onClick?.();
    };
  }

  root.appendChild(circle);
  root.appendChild(chip);
  return root;
}
