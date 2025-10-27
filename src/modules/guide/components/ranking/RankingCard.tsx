import Medal1 from "#/modules/guide/assets/medals/1.png";
import Medal2 from "#/modules/guide/assets/medals/2.png";
import Medal3 from "#/modules/guide/assets/medals/3.png";

import Avatar1 from "#/modules/guide/assets/avatars/Avatar1.png";
import Avatar2 from "#/modules/guide/assets/avatars/Avatar2.png";
import Avatar3 from "#/modules/guide/assets/avatars/Avatar3.png";
import Avatar4 from "#/modules/guide/assets/avatars/Avatar4.png";
import Avatar5 from "#/modules/guide/assets/avatars/Avatar5.png";
import Avatar6 from "#/modules/guide/assets/avatars/Avatar6.png";
import Avatar7 from "#/modules/guide/assets/avatars/Avatar7.png";
import Avatar8 from "#/modules/guide/assets/avatars/Avatar8.png";

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

function resolveAvatar(srcOrKey?: string) {
  if (!srcOrKey) return Avatar1;
  const key = srcOrKey as AvatarKey;
  return AVATAR_MAP[key] ?? Avatar1;
}

type Props = {
  position: number;
  username: string;
  points: number;
  avatarKey?: string;
  highlight?: boolean;
};

export default function RankingCard({
  position,
  username,
  points,
  avatarKey,
  highlight = false,
}: Props) {
  const showMedal = position <= 3;
  const medalSrc = position === 1 ? Medal1 : position === 2 ? Medal2 : Medal3;
  const avatarSrc = resolveAvatar(avatarKey);

  
  const compact = position >= 4;

  return (
    <div
      className={[
        "relative flex h-[200px] flex-col justify-between rounded-2xl border p-4 sm:p-5 shadow",
        highlight
          ? "border-[#7a9456] bg-[#F7FFD7] ring-2 ring-[#cfe3a2]"
          : "border-[#d8d5c0] bg-white",
      ].join(" ")}
    >
      
      <div className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-[#5b3a17] text-white shadow">
        <span className="text-sm font-extrabold">#{position}</span>
      </div>

      
      <div className="pl-14 pr-2">
        <h3
          className="line-clamp-2 h-[44px] text-xl font-extrabold leading-5 text-[#5b3a17]"
          title={username}
        >
          {username}
        </h3>
        <div className="mt-2 h-px w-full bg-[#c9bda4]" />
      </div>

      
      {!compact ? (
        
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            
            <div className="grid h-20 w-20 place-items-center overflow-hidden rounded-full bg-[#FFF5CF] ring-2 ring-[#f0e4b3] shadow">
              <img src={avatarSrc} alt="" className="h-16 w-16 object-contain" />
            </div>
            
            <div className="leading-6">
              <div className="tabular-nums text-2xl sm:text-3xl font-extrabold text-[#5b3a17]">
                {points}
              </div>
              <div className="text-base font-extrabold tracking-wide text-[#5b3a17]">
                PTS
              </div>
            </div>
          </div>

          {showMedal && (
            <img
              src={medalSrc}
              alt={`Medalha ${position}`}
              className="h-20 w-20 object-contain"
              draggable={false}
            />
          )}
        </div>
      ) : (
        
        <div className="mt-2 flex items-center justify-center gap-5">
          <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-full bg-[#FFF5CF] ring-2 ring-[#f0e4b3] shadow">
            <img src={avatarSrc} alt="" className="h-14 w-14 object-contain" />
          </div>
          <div className="leading-6 text-center">
            <div className="tabular-nums text-2xl font-extrabold text-[#5b3a17]">
              {points}
            </div>
            <div className="text-base font-extrabold tracking-wide text-[#5b3a17]">
              PTS
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
