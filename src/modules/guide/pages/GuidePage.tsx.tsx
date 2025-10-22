// src/modules/guide/pages/GuidePage.tsx
import { useEffect, useState, useCallback } from "react";
import { Outlet, useLocation } from "react-router-dom";
import GuideNavbar from "../components/GuideNavbar";
import DailyMissionsCard from "#/components/DailyMissionsCard";
import TipCard from "#/components/TipCard";
import ProfileModal from "../components/ProfileModal";

type TabKey = "map" | "ranking" | "achievements" | "patents";

export default function GuidePage() {
  const location = useLocation();
  const { pathname } = location;

  const active: TabKey =
    pathname === "/guide"
      ? "map"
      : pathname.startsWith("/guide/ranking")
      ? "ranking"
      : pathname.startsWith("/guide/conquistas")
      ? "achievements"
      : pathname.startsWith("/guide/patentes")
      ? "patents"
      : "map";

  const [profileOpen, setProfileOpen] = useState(false);
  const [forceEditMode, setForceEditMode] = useState(false);
  const [disableClose, setDisableClose] = useState(false);

  const openProfile = useCallback(() => {
    setForceEditMode(false);
    setDisableClose(false);
    setProfileOpen(true);
  }, []);

  const handleCloseProfile = useCallback(() => {
    if (disableClose) return;
    setProfileOpen(false);
  }, [disableClose]);

  // Helpers de cookie
  function getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
  }

  // Checa state e cookie na montagem -> abre modal em modo forçado se preciso
  useEffect(() => {
    const fromState = Boolean((location.state as any)?.requireAdditionalData === true);
    const fromCookie = getCookie("insertAdditionalDataRequired") === "1";
    const mustComplete = fromState || fromCookie;

    if (mustComplete) {
      setForceEditMode(true);
      setDisableClose(true);
      setProfileOpen(true);
    }

    // Limpa apenas o state de navegação (para não “vazar” no histórico)
    if (fromState) {
      const url = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      window.history.replaceState({}, "", url);
    }
    // IMPORTANTE: NÃO apagar o cookie aqui. Ele só será removido após salvar no ProfileModal.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
  const onCompleted = () => {
    setDisableClose(false);
    setForceEditMode(false);
  };
  window.addEventListener("additional-data-completed", onCompleted);
  return () => window.removeEventListener("additional-data-completed", onCompleted);
}, []);


  // Redundância: ainda escuta open-profile-edit (acionamentos in-app)
  useEffect(() => {
    const handler = (e: Event) => {
      const custom = e as CustomEvent<{ requireAdditionalData?: boolean }>;
      const mustComplete = !!custom.detail?.requireAdditionalData;
      setForceEditMode(mustComplete);
      setDisableClose(mustComplete);
      setProfileOpen(true);
    };
    window.addEventListener("open-profile-edit", handler as EventListener);
    return () => window.removeEventListener("open-profile-edit", handler as EventListener);
  }, []);

  // Ouve quando o ProfileModal confirmar que os dados adicionais foram completados
  useEffect(() => {
    const onCompleted = () => {
      setDisableClose(false);
      setForceEditMode(false);
      // deixa o modal aberto; o usuário pode fechar normalmente agora
    };
    window.addEventListener("additional-data-completed", onCompleted);
    return () => window.removeEventListener("additional-data-completed", onCompleted);
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[#FFFFE0] text-slate-100">
      <GuideNavbar active={active} onAvatarClick={openProfile} />

      <main className="grid flex-1 grid-cols-1 gap-4 p-4 lg:grid-cols-[1fr_360px]">
        <section className="relative min-h-[60vh] overflow-hidden rounded-xl border border-slate-700 bg-slate-950 lg:min-h-[calc(100vh-6rem-2rem)]">
          <Outlet />
        </section>

        <aside className="flex flex-col gap-4">
{/* antes passava missions=[] */}
<DailyMissionsCard />

          <TipCard
            text={`No Amazonas a floresta libera tanta umidade que forma os “rios voadores”, responsáveis por levar chuva para outras regiões do Brasil!`}
            chipLabel="CURIOSIDADE"
          />
        </aside>
      </main>

      <ProfileModal
        open={profileOpen}
        onClose={handleCloseProfile}
        forceEditMode={forceEditMode as any}
        disableClose={disableClose as any}
      />
    </div>
  );
}
