import Raio from "../assets/icons/Raio.png";
import Relogio from "../assets/icons/Relógio.png";
import Bandeira from "../assets/icons/Bandeira.png";
import Bau from "../assets/icons/Bau.png";
import AchievementsIcon from "#/modules/guide/assets/icons/3 - Achievementscon.png";

type Mission = {
  id: string;
  title: string;
  icon: "xp" | "time" | "bonus";
  current: number;
  goal: number;
};

type Props = {
  missions: Mission[];
  /** cor da borda/acento do card */
  accent?: string;             // default: "#9db668"
  /** cor do fundo do card */
  cardBg?: string;             // default: "#FFFDE1"
  /** tamanho (px) dos ícones das missões/bandeira */
  iconSize?: number;           // default: 28
  /** altura (px) da barra de progresso */
  barHeight?: number;          // default: 20
};

const clamp = (v: number, min = 0, max = 100) => Math.max(min, Math.min(max, v));
const pct = (current: number, goal: number) =>
  clamp(Math.round((100 * current) / Math.max(1, goal)));

const leftIconSrc = (kind: Mission["icon"]) =>
  kind === "xp" ? Raio : kind === "time" ? Relogio : Bau;

export default function DailyMissionsCard({
  missions,
  accent = "#9db668",
  cardBg = "#ffffffff",
  iconSize = 25,
  barHeight = 20,
}: Props) {
  // backgrounds das barras (track e fill) com “bolinhas”
  const trackBg = `
    radial-gradient(circle at 12px 50%, rgba(75,40,2,.30) 5px, transparent 6px) repeat-x,
    linear-gradient(#4B2802, #4B2802)
  `;
  const fillBg = `
    radial-gradient(circle at 12px 50%, rgba(90,160,95,.55) 5px, transparent 6px) repeat-x,
    linear-gradient(90deg, #98cf92, #5ea963)
  `;

  return (
    <div>
      {/* CHIP “MISSÕES” */}
      <div
        className="inline-flex items-center gap-2 rounded-xl px-4 py-2 font-semibold text-white shadow mb-3"
        style={{ backgroundColor: accent }}
        aria-label="Missões"
      >
        <img src={AchievementsIcon} alt="" aria-hidden className="h-8 w-8 object-contain" />
        <span>MISSÕES</span>
      </div>

      {/* CARD (apenas as missões) */}
      <section
        className="rounded-2xl shadow"
        style={{
          background: cardBg,
          border: `6px solid ${accent}`,
          padding: "14px 14px 16px",
        }}
      >
        <ul className="m-0 grid list-none gap-4 p-0">
          {missions.map((m) => {
            const progress = pct(m.current, m.goal);
            return (
              <li
                key={m.id}
                className="items-center gap-3"
                style={{
                  display: "grid",
                  gridTemplateColumns: `${iconSize}px 1fr ${iconSize}px`,
                }}
              >
                {/* ícone esquerdo */}
                <img
                  src={leftIconSrc(m.icon)}
                  alt={m.icon}
                  draggable={false}
                  className="select-none mt-[20px]"
                  style={{
                    width: iconSize,
                    height: iconSize,
                    objectFit: "contain",
                    filter: "drop-shadow(0 4px 0 rgba(0,0,0,.12))",
                  }}
                />

                {/* conteúdo */}
                <div>
                  <div
                    className="font-extrabold"
                    style={{
                      color: "#6fb05d",
                      fontSize: 14,
                      lineHeight: "18px",
                      marginBottom: 6,
                    }}
                  >
                    {m.title}
                  </div>

                  <div aria-label="Progresso" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
                    <div
                      style={{
                        position: "relative",
                        height: barHeight,
                        borderRadius: 999,
                        background: trackBg,
                        backgroundSize: `26px ${barHeight}px, 100% 100%`,
                        overflow: "hidden",
                        boxShadow: "inset 0 -2px 0 rgba(0,0,0,.08)",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          width: `${progress}%`,
                          borderRadius: 999,
                          background: fillBg,
                          backgroundSize: `26px ${barHeight}px, 100% 100%`,
                          transition: "width .25s ease",
                        }}
                      />
                      <span
                        className="font-extrabold"
                        style={{
                          position: "absolute",
                          left: "50%",
                          top: "50%",
                          transform: "translate(-50%, -50%)",
                          fontSize: 14,
                          color: "#fff",
                          pointerEvents: "none",
                        }}
                      >
                        {m.current}/{m.goal}
                      </span>
                    </div>
                  </div>
                </div>

                {/* bandeira direita */}
                <img
                  src={Bandeira}
                  alt="flag"
                  draggable={false}
                  className="select-none mt-[20px]"
                  style={{
                    width: iconSize,
                    height: iconSize,
                    objectFit: "contain",
                    filter: "drop-shadow(0 4px 0 rgba(0,0,0,.12))",
                  }}
                />
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
