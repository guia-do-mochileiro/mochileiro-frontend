type Letter = "A" | "B" | "C" | "D";
type State = "idle" | "selected" | "right" | "wrong" | "disabled";

type Props = {
  letter: Letter;
  text: string;
  state: State;
  onClick?: () => void;
  size?: "md" | "lg";
};

export default function AnswerButton({
  letter,
  text,
  state,
  onClick,
  size = "md",
}: Props) {
  const base =
    "w-full rounded-2xl border transition flex items-center gap-3 text-left";
  const sizing =
    size === "lg"
      ? "px-5 py-5 text-xl"
      : "px-4 py-3 text-base";

  const palette: Record<State, string> = {
    idle:
      "bg-[#fff8dd] border-[#e6e0b8] text-[#5a4a1c] hover:bg-[#fff2c9] hover:border-[#dccf9a]",
    selected:
      "bg-[#eef5dc] border-[#cfe3a2] text-[#4b5b25]",
    right:
      "bg-[#e9f7e3] border-[#b4e1a6] text-[#2e5b2e]",
    wrong:
      "bg-[#fde7e4] border-[#f2b5ae] text-[#7a3d32]",
    disabled:
      "bg-[#f6f6f6] border-[#e6e6e6] text-[#888] cursor-default",
  };

  const bullet =
    size === "lg"
      ? "h-9 w-9 text-lg"
      : "h-8 w-8 text-base";

  return (
    <button
      type="button"
      onClick={onClick}
      className={[base, sizing, palette[state]].join(" ")}
      disabled={state === "disabled"}
    >
      <span
        className={[
          "grid place-items-center rounded-full font-bold",
          bullet,
          state === "wrong"
            ? "bg-[#f7c1bb] text-[#7a3d32]"
            : state === "right"
            ? "bg-[#c7e8bb] text-[#2e5b2e]"
            : state === "selected"
            ? "bg-[#dcecc0] text-[#4b5b25]"
            : "bg-white text-[#5a4a1c]",
        ].join(" ")}
      >
        {letter}
      </span>
      <span className="flex-1">{text}</span>
    </button>
  );
}
