// src/modules/guide/components/GuideNavbar.tsx
import { useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu } from "lucide-react";

import MapIcon from "#/modules/guide/assets/icons/1 - MapIcon.png";
import RankingIcon from "#/modules/guide/assets/icons/2 - RankingIcon.png";
import AchievementsIcon from "#/modules/guide/assets/icons/3 - Achievementscon.png";
import PatentsIcon from "#/modules/guide/assets/icons/4 - PatentsIcon.png";
import GuideMenuModal from "#/modules/guide/components/GuideMenuModal";

type TabKey = "map" | "ranking" | "achievements" | "patents";
type GuideNavbarProps = { active: TabKey; onMenuClick?: () => void; onAvatarClick?: () => void; userName?: string; };

const tabs = [
  { key: "map", label: "MAPA", icon: MapIcon, to: "/guide" },
  { key: "ranking", label: "RANKING", icon: RankingIcon, to: "/guide/ranking" },
  { key: "achievements", label: "CONQUISTAS", icon: AchievementsIcon, to: "/guide/conquistas" },
  { key: "patents", label: "PATENTES", icon: PatentsIcon, to: "/guide/patentes" },
] as const;

export default function GuideNavbar({ active, onMenuClick, onAvatarClick, userName }: GuideNavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement | null>(null);

  return (
    <>
      <div className="w-full bg-[#9db668]">
        <div className="mx-auto px-3 py-3">
          <div className="flex items-center justify-between rounded-xl bg-[#FFFDE1] px-3 py-2 shadow">
            <nav className="flex items-center gap-2 overflow-x-auto" aria-label="Navegação do guia">
              {tabs.map((t) => {
                const isActive = active === t.key;
                return (
                  <NavLink
                    key={t.key}
                    to={t.to}
                    className={[
                      "flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-semibold transition",
                      isActive ? "bg-[#7a9456] text-white shadow" : " text-[#9db668]",
                    ].join(" ")}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <img src={t.icon} alt="" aria-hidden className="h-5 w-5 object-contain" />
                    <span className="whitespace-nowrap">{t.label}</span>
                  </NavLink>
                );
              })}
            </nav>

            <div className="ml-3 flex items-center gap-2">
              <button
                ref={menuBtnRef}
                type="button"
                onClick={() => {
                  onMenuClick?.();
                  setMenuOpen(true);
                }}
                aria-label="Abrir menu"
                className="grid h-9 w-9 place-items-center rounded-full bg-[#9db668] text-white shadow hover:opacity-90"
              >
                <Menu className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={onAvatarClick}
                aria-label={userName ? `Abrir perfil de ${userName}` : "Abrir perfil"}
                className="grid h-10 w-10 place-items-center overflow-hidden rounded-full ring-2 ring-[#9db668] bg-white"
                title={userName ?? "Perfil"}
              >
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-500" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal controla menu (popover) e confirmação */}
      <GuideMenuModal
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onProfile={() => {
          // abra seu popup de perfil aqui, se quiser
        }}
        anchorEl={menuBtnRef.current ?? undefined}
      />
    </>
  );
}
