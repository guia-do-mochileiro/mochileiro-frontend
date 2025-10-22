type Props = {
  /** página atual (0-index) */
  page: number;
  /** total de páginas */
  totalPages: number;
  /** callback para trocar de página (0-index) */
  onChange: (page: number) => void;
  /** opcional: quantos números mostrar (padrão 5) */
  window?: number;
};

export default function Pagination({
  page,
  totalPages,
  onChange,
  window = 5,
}: Props) {
  if (totalPages <= 1) return null;

  const go = (p: number) => {
    const clamped = Math.max(0, Math.min(totalPages - 1, p));
    if (clamped !== page) onChange(clamped);
  };

  // calcula janela de páginas
  const half = Math.floor(window / 2);
  let start = Math.max(0, page - half);
  let end = Math.min(totalPages - 1, start + window - 1);
  start = Math.max(0, Math.min(start, end - window + 1));

  const pages: number[] = [];
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="mt-6 flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => go(page - 1)}
        disabled={page <= 0}
        className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 disabled:opacity-50"
      >
        Anterior
      </button>

      {/* Primeira + reticências */}
      {start > 0 && (
        <>
          <PageButton n={0} current={page} onClick={go} />
          <span className="px-1 text-slate-500">…</span>
        </>
      )}

      {/* Janela */}
      {pages.map((n) => (
        <PageButton key={n} n={n} current={page} onClick={go} />
      ))}

      {/* Reticências + Última */}
      {end < totalPages - 1 && (
        <>
          <span className="px-1 text-slate-500">…</span>
          <PageButton n={totalPages - 1} current={page} onClick={go} />
        </>
      )}

      <button
        type="button"
        onClick={() => go(page + 1)}
        disabled={page >= totalPages - 1}
        className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-semibold text-slate-700 disabled:opacity-50"
      >
        Próxima
      </button>
    </div>
  );
}

function PageButton({
  n,
  current,
  onClick,
}: {
  n: number;
  current: number;
  onClick: (p: number) => void;
}) {
  const active = n === current;
  return (
    <button
      type="button"
      onClick={() => onClick(n)}
      className={[
        "min-w-[36px] rounded-md border px-3 py-1.5 text-sm font-bold",
        active
          ? "border-[#9db668] bg-[#eaf3d9] text-[#7a9456]"
          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-100",
      ].join(" ")}
      aria-current={active ? "page" : undefined}
    >
      {n + 1}
    </button>
  );
}
