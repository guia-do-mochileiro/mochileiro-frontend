// src/modules/guide/pages/GuidePage.tsx
import { useEffect, useState, useCallback } from "react";
import { Outlet, useLocation } from "react-router-dom";
import GuideNavbar from "../components/GuideNavbar";
import DailyMissionsCard from "#/components/DailyMissionsCard";
import TipCard from "#/components/TipCard";
import ProfileModal from "../components/ProfileModal";
import PromotionCard from "../components/patents/PromotionCard";

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

  function getCookie(name: string): string | null {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
  }

  useEffect(() => {
    const fromState = Boolean((location.state as any)?.requireAdditionalData === true);
    const fromCookie = getCookie("insertAdditionalDataRequired") === "1";
    const mustComplete = fromState || fromCookie;

    if (mustComplete) {
      setForceEditMode(true);
      setDisableClose(true);
      setProfileOpen(true);
    }

    if (fromState) {
      const url = `${window.location.pathname}${window.location.search}${window.location.hash}`;
      window.history.replaceState({}, "", url);
    }
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

  useEffect(() => {
    const onCompleted = () => {
      setDisableClose(false);
      setForceEditMode(false);
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
          {/* TipCard está presente em todas as guias */}
<TipCard/>

          {/* Alterna conforme a aba */}
          {active === "patents" ? (
            <PromotionCard />
          ) : (
            <DailyMissionsCard />
          )}
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
