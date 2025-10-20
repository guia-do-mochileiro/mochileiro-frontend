// src/components/map/BackControl.ts
import type { Map, IControl } from "mapbox-gl";

export class BackControl implements IControl {
  private _container!: HTMLElement;
  private _btn!: HTMLButtonElement;
  private _onClick: () => void;

  constructor(onClick: () => void) {
    this._onClick = onClick;
  }

  onAdd(_: Map) {
    // Use APENAS 'mapboxgl-ctrl' para evitar o estilo de grupo do Mapbox
    this._container = document.createElement("div");
    this._container.className = "mapboxgl-ctrl";
    this._container.style.margin = "12px";
    this._container.style.background = "transparent"; // sem fundo do grupo

    this._btn = document.createElement("button");
    this._btn.type = "button";
    this._btn.title = "Voltar";
    this._btn.setAttribute("aria-label", "Voltar");

    // Força estilos para não serem sobrescritos pelo CSS do Mapbox
    this._btn.style.width = "56px";
    this._btn.style.height = "56px";
    this._btn.style.borderRadius = "9999px";
    this._btn.style.backgroundColor = "#1D514B";   // verde
    this._btn.style.color = "#ffffff";
    this._btn.style.boxShadow = "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)";
    this._btn.style.border = "none";
    this._btn.style.display = "grid";
    this._btn.style.placeItems = "center";
    this._btn.style.cursor = "pointer";

    // Ícone Lucide (chevron-left) em SVG inline
    this._btn.innerHTML =
      '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
      'stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" ' +
      'aria-hidden="true" focusable="false">' +
      '<polyline points="15 18 9 12 15 6"></polyline>' +
      "</svg>";

    this._btn.onmouseenter = () => {
      this._btn.style.filter = "brightness(1.08)";
    };
    this._btn.onmouseleave = () => {
      this._btn.style.filter = "none";
    };
    this._btn.onmousedown = () => {
      this._btn.style.transform = "scale(0.98)";
    };
    this._btn.onmouseup = () => {
      this._btn.style.transform = "none";
    };

    this._btn.onclick = (e) => {
      e.stopPropagation();
      this._onClick();
    };

    this._container.appendChild(this._btn);
    this.setVisible(false);
    return this._container;
  }

  onRemove() {
    this._container?.parentNode?.removeChild(this._container);
  }

  setVisible(visible: boolean) {
    if (this._container) {
      this._container.style.display = visible ? "block" : "none";
    }
  }
}
