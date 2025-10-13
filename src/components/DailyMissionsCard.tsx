import React from "react";

import Folha from "../assets/Folha.png";
import Raio from "../assets/Raio.png";
import Relogio from "../assets/Relógio.png";
import Bandeira from "../assets/Bandeira.png";
import Bau from "../assets/Bau.png"; // ícone inicial para "bonus"

type Mission = {
  id: string;
  title: string;
  icon: "xp" | "time" | "bonus";
  current: number;
  goal: number;
};

type Props = {
  title?: string;
  missions: Mission[];
};

const clamp = (v: number, min = 0, max = 100) => Math.max(min, Math.min(max, v));
const pct = (current: number, goal: number) =>
  clamp(Math.round((100 * current) / Math.max(1, goal)));

const leftIcon = (kind: Mission["icon"]) =>
  kind === "xp" ? Raio : kind === "time" ? Relogio : Bau;

export default function DailyMissionsCard({
  title = "Missões diárias",
  missions,
}: Props) {
  return (
    <section className="missionCard missionCard--v2 missionCard--brand">
      <header className="missionCard__header missionCard__header--v2">
        <h3 className="missionCard__title missionCard__title--compact" aria-label={title}>
          <span>MISSÕES DIÁRIAS</span>
          <img src={Folha} alt="" className="missionCard__leafA" />
        </h3>
      </header>

      <div className="missionCard__divider missionCard__divider--thin" />

      <ul className="missionList missionList--compact">
        {missions.map((m) => {
          const progress = pct(m.current, m.goal);
          return (
            <li key={m.id} className="missionItem missionItem--grid">
              {/* ícone inicial */}
              <img className="missionIcon" src={leftIcon(m.icon)} alt={m.icon} draggable={false} />

              {/* conteúdo */}
              <div className="missionBody">
                <div className="missionTitle">{m.title}</div>

                <div
                  className="missionProgress"
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={progress}
                >
                  <div className="missionProgress__track">
                    <div
                      className="missionProgress__fill"
                      style={{ width: `${progress}%` }}
                    />
                    {/* contador central dentro da barra */}
                    <span className="missionProgress__counter">
                      {m.current}/{m.goal}
                    </span>
                  </div>
                </div>
              </div>

              {/* sempre bandeira no final */}
              <img className="missionIcon" src={Bandeira} alt="flag" draggable={false} />
            </li>
          );
        })}
      </ul>
    </section>
  );
}
