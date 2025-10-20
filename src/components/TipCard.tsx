import TipIcon from "#/modules/guide/assets/icons/5 - TipIcon.png";

type Props = {
  /** Texto da dica/curiosidade */
  text: string;
  /** Rótulo do chip (ex.: "CURIOSIDADE" ou "DICA") */
  chipLabel?: string;               // default: "CURIOSIDADE"
  /** Cor da borda/acento */
  accent?: string;                  // default: "#9db668"
  /** Cor do fundo do card */
  cardBg?: string;                  // default: "#FFFDE1"
  /** Tamanho base do texto (px) */
  textSize?: number;                // default: 28
  /** Padding interno do card (px) */
  cardPadding?: number;             // default: 24
  /** Raio da borda (px) */
  radius?: number;                  // default: 24
};

export default function TipCard({
  text,
  chipLabel = "CURIOSIDADE",
  accent = "#9db668",
  cardBg = "#ffffffff",
  textSize = 23,
  cardPadding = 24,
  radius = 24,
}: Props) {
  return (
    <div>
      {/* CHIP acima do card */}
      <div
        className="inline-flex items-center gap-2 rounded-xl px-4 py-2 font-semibold text-white shadow mb-3"
        style={{ backgroundColor: accent }}
        aria-label={chipLabel}
      >
        <img src={TipIcon} alt="" aria-hidden className="h-10 w-10 object-contain" />
        <span className="uppercase tracking-wide">{chipLabel}</span>
      </div>

      {/* CARD com o texto centralizado */}
      <section
        className="w-full shadow"
        style={{
          background: cardBg,
          border: `6px solid ${accent}`,
          borderRadius: radius,
          padding: cardPadding,
        }}
      >
        <div
          className="mx-auto flex items-center justify-center text-center font-extrabold leading-snug"
          style={{
            color: accent,
            fontSize: textSize,
            // responsividade suave
            // (aumenta/ reduz um pouco conforme a largura)
            lineHeight: 1.25,
          }}
        >
          {text}
        </div>
      </section>
    </div>
  );
}
