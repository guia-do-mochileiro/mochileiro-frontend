// src/modules/guide/components/map/StageBadgeControl.ts
import type mapboxgl from "mapbox-gl";

type Variant = "country" | "region" | "state";

type Content = {
  subtitle: string;
  title: string;
  variant: Variant; // mantive no tipo para compatibilidade, mas não muda a cor
};

export class StageBadgeControl implements mapboxgl.IControl {
  private _container!: HTMLDivElement;
  private _subtitleEl!: HTMLDivElement;
  private _titleEl!: HTMLDivElement;

  onAdd(_: mapboxgl.Map) {
    // wrapper posicionado pelo Mapbox
    this._container = document.createElement("div");
    this._container.className = "pointer-events-none mb-3 ml-3";

    // CARD — tamanho fixo + verde escuro sempre
    const card = document.createElement("div");
    card.className = [
      "rounded-[10px] px-6 py-4 shadow-2xl ring-1 ring-black/10",
      "backdrop-blur-[2px] transition-colors duration-200",
      "bg-[#1f4b44]/95",
      // tamanho fixo (não cresce)
      "w-[300px] md:w-[300px]",
    ].join(" ");

    // subtítulo
    this._subtitleEl = document.createElement("div");
    this._subtitleEl.className =
      "text-sm font-extrabold tracking-wide text-white/80";
    this._subtitleEl.textContent = "América do Sul";

    // título (uma linha, com ellipsis)
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

  /** Atualiza apenas os textos (cor permanece sempre verde-escuro) */
  update(content: Content) {
    if (!this._container) return;
    this._subtitleEl.textContent = content.subtitle;
    this._titleEl.textContent = content.title;
  }
}
