
import { useEffect, useState } from "react";

import AchievementCard from "#/modules/guide/components/achievements/AchievementCard";
import Pagination from "#/components/Pagination";
import {
  getAchievements,
  type AchievementPage,
} from "#/modules/guide/services/achievementsService";

export default function GuideAchievementsPage() {
  
  const [page, setPage] = useState(0); 
  const [data, setData] = useState<AchievementPage | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function fetchPage(p: number) {
    setLoading(true);
    setErr(null);
    try {
      const res = await getAchievements({ page: p, size: 9, sort: "name,asc" });
      setData(res);
    } catch (e: any) {
      setErr(e?.message ?? "Falha ao carregar conquistas.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPage(page);
    
  }, [page]);

  return (
    <div className="min-h-full w-full bg-[#FFFFE0]">
      <div className="mx-auto max-w-6xl p-4 sm:p-6">
        <header className="mb-4 sm:mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#69521a]">
            Olá jogador(a)!
          </h1>
          <p className="mt-1 text-sm text-[#7a6a32]">
            Acompanhe seu progresso e desbloqueie todas as conquistas!
          </p>
        </header>

        
        {loading && (
          <div className="grid h-[200px] place-items-center text-[#6b5a2a]">
            Carregando conquistas…
          </div>
        )}

        {err && !loading && (
          <div className="rounded-lg border border-rose-300 bg-rose-50 p-4 text-rose-800">
            <p className="font-semibold">Ops! {err}</p>
            <button
              type="button"
              className="mt-3 rounded-md bg-white px-4 py-2 text-sm font-bold text-rose-900 ring-1 ring-rose-300 hover:bg-rose-100"
              onClick={() => fetchPage(page)}
            >
              Tentar novamente
            </button>
          </div>
        )}

        {!loading && !err && (
          <>
            
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(data?.content ?? []).map((a) => (
                <AchievementCard
                  key={a.achievementId}
                  name={a.name}
                  description={a.description}
                  goal={a.goal}
                  progress={a.progress}
                  completed={a.completed}
                />
              ))}
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
