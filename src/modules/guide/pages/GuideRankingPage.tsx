import { useEffect, useMemo, useState } from "react";
import Pagination from "#/components/Pagination";
import RankingCard from "#/modules/guide/components/ranking/RankingCard";
import { getRanking, type RankingPage } from "#/modules/guide/services/rankingService";
import { fetchMe } from "#/modules/guide/services/profile/userService";

export default function GuideRankingPage() {
  const [page, setPage] = useState(0);
  const [data, setData] = useState<RankingPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [meId, setMeId] = useState<string | null>(null);


  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");


  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);


  useEffect(() => {
    setPage(0);
  }, [debouncedSearch]);

  async function fetchAll(p: number, term: string) {
    setLoading(true);
    setErr(null);
    try {
      const [rankRes, me] = await Promise.all([
        getRanking({ page: p, size: 9, sort: "totalPoints,desc", search: term }),
        fetchMe().catch(() => null),
      ]);
      setData(rankRes);
      setMeId(me?.id ?? null);
    } catch (e: any) {
      setErr(e?.message ?? "Falha ao carregar ranking.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAll(page, debouncedSearch);

  }, [page, debouncedSearch]);


  const filteredContent = useMemo(() => {
    const list = data?.content ?? [];
    if (!debouncedSearch) return list;
    const q = debouncedSearch.toLowerCase();
    return list.filter((u) => (u.username || "").toLowerCase().includes(q));
  }, [data?.content, debouncedSearch]);

  return (
    <div className="min-h-full w-full bg-[#FFFFE0]">
      <div className="mx-auto max-w-6xl p-4 sm:p-6">
        <header className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#69521a]">
            Olá jogador(a)!
          </h1>
          <p className="mt-1 text-sm text-[#7a6a32]">
            Veja a colocação geral e seus pontos!
          </p>
          <div className="mt-4 flex justify-center">
            <div className="relative w-full max-w-xl">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Digite seu nome..."
                className="w-full rounded-xl border border-[#d2d8a8] bg-white px-4 py-3 pr-10 text-[#4b3e17] placeholder-[#a59559] outline-none focus:ring-2 focus:ring-emerald-500/50"
                aria-label="Buscar no ranking"
              />
              {search && (
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-sm font-semibold text-[#6b5a2a] hover:bg-[#f4f0cf]"
                  onClick={() => setSearch("")}
                  aria-label="Limpar busca"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </header>

        {loading && (
          <div className="grid h-[200px] place-items-center text-[#6b5a2a]">
            Carregando ranking…
          </div>
        )}

        {err && !loading && (
          <div className="rounded-lg border border-rose-300 bg-rose-50 p-4 text-rose-800">
            <p className="font-semibold">Ops! {err}</p>
            <button
              type="button"
              className="mt-3 rounded-md bg-white px-4 py-2 text-sm font-bold text-rose-900 ring-1 ring-rose-300 hover:bg-rose-100"
              onClick={() => fetchAll(page, debouncedSearch)}
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!loading && !err && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredContent.map((u, idx) => {
                const position =
                  u.rankPosition ??
                  ((data?.number ?? 0) * (data?.size ?? 9) + (idx + 1));

                const highlight = meId && u.userId === meId;

                return (
                  <RankingCard
                    key={`${u.userId}-${position}`}
                    position={position}
                    username={u.username}
                    points={u.totalPoints}
                    avatarKey={u.avatar}
                    highlight={!!highlight}
                  />
                );
              })}
            </div>

            <Pagination
              page={data?.number ?? 0}
              totalPages={data?.totalPages ?? 1}
              onChange={setPage}
            />
          </>
        )}
      </div>
    </div>
  );
}
