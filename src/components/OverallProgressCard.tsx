
import ProgressIcon from "../assets/progress/1 - ProgressIcon.png";
import StartIcon from "../assets/progress/2 - StartIcon.png";
import EndIcon from "../assets/progress/3 - EndIcon.png";
import RunnerIcon from "../assets/progress/4 -  Runner.png";

type Props = {
  
  current: number;
  
  goal?: number;

  
  accent?: string;      
  
  cardBg?: string;      

  
  barHeight?: number;   
  
  flagSize?: number;    
  
  runnerSize?: number;  
};

const clamp = (v: number, min = 0, max = 100) => Math.max(min, Math.min(max, v));
const pct = (current: number, goal: number) =>
  clamp(Math.round((100 * current) / Math.max(1, goal)));

export default function OverallProgressCard({
  current,
  goal = 10,
  accent = "#9db668",
  cardBg = "#FFFDE1",
  barHeight = 20,
  flagSize = 60,
  runnerSize = 64,
}: Props) {
  const progress = pct(current, goal);

  
  const trackBg = `
    radial-gradient(circle at 12px 50%, rgba(75,40,2,.30) 5px, transparent 6px) repeat-x,
    linear-gradient(#4B2802, #4B2802)
  `;
  const fillBg = `
    radial-gradient(circle at 12px 50%, rgba(90,160,95,.55) 5px, transparent 6px) repeat-x,
    linear-gradient(90deg, #98cf92, #5ea963)
  `;

  
  const laneSidePad = flagSize * 0.6; 

  return (
    <div>
      <div
        className="inline-flex items-center gap-2 rounded-xl px-4 py-2 font-semibold text-white shadow mb-3"
        style={{ backgroundColor: accent }}
        aria-label="Progresso"
      >
        <img src={ProgressIcon} alt="" aria-hidden className="h-8 w-8 object-contain" />
        <span>PROGRESSO</span>
      </div>
      <section
        className="rounded-2xl shadow"
        style={{
          background: cardBg,
          border: `6px solid ${accent}`,
          padding: "18px 16px 20px",
        }}
      >
        <div
          className="relative w-full rounded-2xl bg-white"
          style={{
            minHeight: Math.max(flagSize + 30, 150),
            boxShadow: "inset 0 0 0 2px rgba(0,0,0,.04)",
            padding: 12,
          }}
        >
          <img
            src={StartIcon}
            alt="Início"
            draggable={false}
            className="select-none mb-[19px]"
            style={{
              position: "absolute",
              left: 20,
              bottom: 18,
              width: flagSize,
              height: flagSize,
              objectFit: "contain",
              filter: "drop-shadow(0 4px 0 rgba(0,0,0,.08))",
            }}
          />
          <img
            src={EndIcon}
            alt="Chegada"
            draggable={false}
            className="select-none mb-[19px]"
            style={{
              position: "absolute",
              right: 1,
              bottom: 18,
              width: flagSize,
              height: flagSize,
              objectFit: "contain",
              filter: "drop-shadow(0 4px 0 rgba(0,0,0,.08))",
            }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              left: 12 + laneSidePad,
              right: 12 + laneSidePad,
              bottom: 28 + flagSize * 0.2,
              height: 0,
              borderBottom: "6px dotted #1E1E1E",
              opacity: 0.9,
            }}
          />
          <div
            className="relative"
            style={{
              position: "absolute",
              left: 12 + laneSidePad,
              right: 12 + laneSidePad,
              bottom: 28 + flagSize * 0.2,
              height: runnerSize, 
            }}
          >
            <img
              src={RunnerIcon}
              alt={`Progresso ${current}/${goal}`}
              draggable={false}
              className="select-none transition-[left] ease-in-out"
              style={{
                position: "absolute",
                left: `${progress}%`,
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: runnerSize,
                height: runnerSize,
                objectFit: "contain",
                filter: "drop-shadow(0 6px 0 rgba(0,0,0,.10))",
                transitionDuration: ".35s",
              }}
            />
          </div>
        </div>
        <div className="mt-4" aria-label="Progresso geral" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
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
              {current}/{goal}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
