// src/components/TipCard.tsx
import { useEffect, useMemo, useState } from "react";
import TipIcon from "#/modules/guide/assets/icons/5 - TipIcon.png";
import { getRandomCuriosity } from "#/modules/guide/services/curiositiesService";

type Props = {
  /** Texto da dica/curiosidade. Se omitido, o card buscará do backend. */
  text?: string;
  /** Rótulo do chip (ex.: "CURIOSIDADE" ou "DICA") */
  chipLabel?: string;               // default: "CURIOSIDADE"
  /** Cor da borda/acento */
  accent?: string;                  // default: "#9db668"
  /** Cor do fundo do card */
  cardBg?: string;                  // default: "#FFFDE1"
  /** Tamanho base do texto (px) */
  textSize?: number;                // default: 23
  /** Padding interno do card (px) */
  cardPadding?: number;             // default: 24
  /** Raio da borda (px) */
  radius?: number;                  // default: 24
  /** Mostrar botão “trocar” para buscar outra curiosidade */
  allowRefresh?: boolean;           // default: false
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
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [curiosity, setCuriosity] = useState<string>(text ?? "");

  const mustFetch = useMemo(() => !text, [text]);

  async function load() {
    if (!mustFetch) return;
    try {
      setLoading(true);
      setErr(null);
      const c = await getRandomCuriosity();
      setCuriosity(c || "");
    } catch (e: any) {
      setErr(e?.message ?? "Não foi possível carregar a curiosidade.");
      setCuriosity("");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // se o texto vier via prop, só garante o state local
    if (!mustFetch) {
      setCuriosity(text ?? "");
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mustFetch]);

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
        {loading ? (
          <div
            className="mx-auto flex items-center justify-center text-center font-semibold"
            style={{ color: accent, fontSize: 16 }}
          >
            Carregando curiosidade…
          </div>
        ) : err ? (
          <div className="text-center">
            <div
              className="mx-auto mb-2 font-semibold"
              style={{ color: "#b45309", fontSize: 14 }}
            >
              {err}
            </div>
            {mustFetch && (
              <button
                type="button"
                onClick={load}
                className="rounded bg-white/70 px-3 py-1 text-[#6b5a2a] ring-1 ring-[#dcd7a8] hover:bg-white"
              >
                Tentar novamente
              </button>
            )}
          </div>
        ) : (
          <div
            className="mx-auto flex items-center justify-center text-center font-extrabold leading-snug"
            style={{
              color: accent,
              fontSize: textSize,
              lineHeight: 1.25,
            }}
          >
            {curiosity || "—"}
          </div>
        )}
      </section>
    </div>
  );
}
