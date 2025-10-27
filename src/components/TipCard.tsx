// src/components/TipCard.tsx
import { useEffect, useMemo, useState } from "react";
import { RefreshCw } from "lucide-react";
import TipIcon from "#/modules/guide/assets/icons/5 - TipIcon.png";
import { getRandomCuriosity } from "#/modules/guide/services/curiositiesService";
import { useSfx } from "#/hooks/useSfx";

type Props = {
  text?: string;
  chipLabel?: string;
  accent?: string;
  cardBg?: string;
  textSize?: number;
  cardPadding?: number;
  radius?: number;
  allowRefresh?: boolean;
};

export default function TipCard({
  text,
  chipLabel = "CURIOSIDADE",
  accent = "#9db668",
  cardBg = "#ffffffff",
  textSize = 23,
  cardPadding = 24,
  radius = 24,
  allowRefresh = true,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [curiosity, setCuriosity] = useState<string>(text ?? "");

  const mustFetch = useMemo(() => !text, [text]);

  // 🔊 som de clique
  const { playClick } = useSfx({ volume: 0.7, clickVolume: 1 });

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
    if (!mustFetch) {
      setCuriosity(text ?? "");
      return;
    }
    load();
  }, [mustFetch, text]);

  return (
    <div>
      <div
        className="inline-flex items-center gap-2 rounded-xl px-4 py-2 font-semibold text-white shadow mb-3"
        style={{ backgroundColor: accent }}
        aria-label={chipLabel}
      >
        <img src={TipIcon} alt="" aria-hidden className="h-10 w-10 object-contain" />
        <span className="uppercase tracking-wide">{chipLabel}</span>

        {allowRefresh && mustFetch && (
          <button
            type="button"
            onClick={() => {
              playClick();
              load();
            }}
            disabled={loading}
            title="Trocar curiosidade"
            aria-label="Trocar curiosidade"
            className="ml-1 grid h-7 w-7 place-items-center rounded-full bg-white/10 hover:bg-white/20 disabled:opacity-60"
          >
            <RefreshCw className="h-4 w-4 text-white" />
          </button>
        )}
      </div>

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
                onClick={() => {
                  playClick();
                  load();
                }}
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
