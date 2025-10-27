
import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu } from "lucide-react";

import MapIcon from "#/modules/guide/assets/icons/1 - MapIcon.png";
import RankingIcon from "#/modules/guide/assets/icons/2 - RankingIcon.png";
import AchievementsIcon from "#/modules/guide/assets/icons/3 - Achievementscon.png";
import PatentsIcon from "#/modules/guide/assets/icons/4 - PatentsIcon.png";
import GuideMenuModal from "#/modules/guide/components/GuideMenuModal";


import { fetchMe } from "#/modules/guide/services/profile/userService";


import { useSfx } from "#/hooks/useSfx";


import Avatar1 from "#/modules/guide/assets/avatars/Avatar1.png";
import Avatar2 from "#/modules/guide/assets/avatars/Avatar2.png";
import Avatar3 from "#/modules/guide/assets/avatars/Avatar3.png";
import Avatar4 from "#/modules/guide/assets/avatars/Avatar4.png";
import Avatar5 from "#/modules/guide/assets/avatars/Avatar5.png";
import Avatar6 from "#/modules/guide/assets/avatars/Avatar6.png";
import Avatar7 from "#/modules/guide/assets/avatars/Avatar7.png";
import Avatar8 from "#/modules/guide/assets/avatars/Avatar8.png";

type TabKey = "map" | "ranking" | "achievements" | "patents";
type GuideNavbarProps = {
  active: TabKey;
  onMenuClick?: () => void;
  onAvatarClick?: () => void;
  userName?: string;
};

const tabs = [
  { key: "map", label: "MAPA", icon: MapIcon, to: "/guide" },
  { key: "ranking", label: "RANKING", icon: RankingIcon, to: "/guide/ranking" },
  { key: "achievements", label: "CONQUISTAS", icon: AchievementsIcon, to: "/guide/conquistas" },
  { key: "patents", label: "PATENTES", icon: PatentsIcon, to: "/guide/patentes" },
] as const;


type AvatarKey =
  | "AVATAR_1" | "AVATAR_2" | "AVATAR_3" | "AVATAR_4"
  | "AVATAR_5" | "AVATAR_6" | "AVATAR_7" | "AVATAR_8";

const AVATAR_MAP: Record<AvatarKey, string> = {
  AVATAR_1: Avatar1,
  AVATAR_2: Avatar2,
  AVATAR_3: Avatar3,
  AVATAR_4: Avatar4,
  AVATAR_5: Avatar5,
  AVATAR_6: Avatar6,
  AVATAR_7: Avatar7,
  AVATAR_8: Avatar8,
};

function resolveAvatarSrc(avatarKey?: string | null): string | null {
  if (!avatarKey) return null;
  const key = avatarKey as AvatarKey;
  return AVATAR_MAP[key] ?? null;
}

export default function GuideNavbar({ active, onMenuClick, onAvatarClick, userName }: GuideNavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement | null>(null);

  
  const [meName, setMeName] = useState<string | undefined>(userName);
  const [avatarKey, setAvatarKey] = useState<string | null>(null);
  const [loadingMe, setLoadingMe] = useState<boolean>(false);

  
  const { playClick } = useSfx({ volume: 0.9, clickVolume: 1 });

  
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoadingMe(true);
        const me = await fetchMe();
        if (!mounted) return;
        setMeName((prev) => prev || me.username || undefined);
        setAvatarKey(me.avatar ?? null);
      } catch {
        
      } finally {
        if (mounted) setLoadingMe(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const avatarSrc = useMemo(() => resolveAvatarSrc(avatarKey), [avatarKey]);
  const ariaAvatar = meName ? `Abrir perfil de ${meName}` : "Abrir perfil";

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
                    onClick={playClick} 
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
                  playClick();         
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
                onClick={() => {
                  playClick();         
                  onAvatarClick?.();
                }}
                aria-label={ariaAvatar}
                title={meName ?? "Perfil"}
                className="grid h-10 w-10 place-items-center overflow-hidden rounded-full ring-2 ring-[#9db668] bg-white"
              >
                {avatarSrc && !loadingMe ? (
                  <img
                    src={avatarSrc}
                    alt="Avatar do usuário"
                    className="h-9 w-9 object-contain"
                    draggable={false}
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-500" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      
      <GuideMenuModal
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onProfile={() => {
          
        }}
        anchorEl={menuBtnRef.current ?? undefined}
      />
    </>
  );
}
