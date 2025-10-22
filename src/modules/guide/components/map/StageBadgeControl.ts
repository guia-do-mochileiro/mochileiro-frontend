import type { IControl, Map as MapboxMap } from "mapbox-gl";

type Variant = "country" | "region" | "state";

type Content = {
  subtitle: string;
  title: string;
  variant: Variant;
};

export class StageBadgeControl implements IControl {
  private _container!: HTMLDivElement;
  private _subtitleEl!: HTMLDivElement;
  private _titleEl!: HTMLDivElement;

  onAdd(map: MapboxMap) {
    void map;

    this._container = document.createElement("div");
    this._container.className = "pointer-events-none mb-3 ml-3";

    const card = document.createElement("div");
    card.className = [
      "rounded-[10px] px-6 py-4 shadow-2xl ring-1 ring-black/10",
      "backdrop-blur-[2px] transition-colors duration-200",
      "bg-[#1f4b44]/95",
      "w-[300px] md:w-[300px]",
    ].join(" ");

    this._subtitleEl = document.createElement("div");
    this._subtitleEl.className = "text-sm font-extrabold tracking-wide text-white/80";
    this._subtitleEl.textContent = "América do Sul";

    this._titleEl = document.createElement("div");
    this._titleEl.className =
      "mt-1 text-lg font-black text-white whitespace-nowrap overflow-hidden text-ellipsis";
    this._titleEl.textContent = "Mapa do Brasil";

    card.appendChild(this._subtitleEl);
    card.appendChild(this._titleEl);
    this._container.appendChild(card);

    return this._container;
  }

  onRemove() {
    this._container?.parentNode?.removeChild(this._container);
  }

  update(content: Content) {
    if (!this._container) return;
    this._subtitleEl.textContent = content.subtitle;
    this._titleEl.textContent = content.title;
  }
}
