// src/modules/guide/components/ProfileModal.tsx
import { useEffect, useRef, useState, useMemo } from "react";
import {
  X,
  Calendar,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Mars,
  Venus,
} from "lucide-react";
import { fetchMe, updateMe, type Gender } from "#/modules/guide/services/profile/userService";

// Avatares (8 arquivos)
import Avatar1 from "#/modules/guide/assets/avatars/Avatar1.png";
import Avatar2 from "#/modules/guide/assets/avatars/Avatar2.png";
import Avatar3 from "#/modules/guide/assets/avatars/Avatar3.png";
import Avatar4 from "#/modules/guide/assets/avatars/Avatar4.png";
import Avatar5 from "#/modules/guide/assets/avatars/Avatar5.png";
import Avatar6 from "#/modules/guide/assets/avatars/Avatar6.png";
import Avatar7 from "#/modules/guide/assets/avatars/Avatar7.png";
import Avatar8 from "#/modules/guide/assets/avatars/Avatar8.png";

// Toasts
import { toast } from "react-toastify";
import SuccessToast from "#/components/toasts/SuccessToast";
import ErrorToast from "#/components/toasts/ErrorToast";

type Props = {
  open: boolean;
  onClose: () => void;
  /** quando true, o modal já abre em modo edição */
  forceEditMode?: boolean;
  /** quando true, desabilita qualquer tentativa de fechar (sem X e sem Esc) */
  disableClose?: boolean;
};

const AVATAR_ENUMS = [
  "AVATAR_1",
  "AVATAR_2",
  "AVATAR_3",
  "AVATAR_4",
  "AVATAR_5",
  "AVATAR_6",
  "AVATAR_7",
  "AVATAR_8",
] as const;
const AVATAR_SRCS = [Avatar1, Avatar2, Avatar3, Avatar4, Avatar5, Avatar6, Avatar7, Avatar8] as const;

// helpers de data
function toBRFromISO(iso?: string | null): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return y && m && d ? `${d}/${m}/${y}` : "";
}
function toISOFromBR(br?: string): string | null {
  if (!br) return null;
  const digits = br.replace(/\D/g, "");
  if (digits.length !== 8) return null;
  const d = digits.slice(0, 2),
    m = digits.slice(2, 4),
    y = digits.slice(4);
  return `${y}-${m}-${d}`;
}

export default function ProfileModal({
  open,
  onClose,
  forceEditMode = false,
  disableClose = false,
}: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // dados
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [birthDateBR, setBirthDateBR] = useState("");
  const [gender, setGender] = useState<Gender | "">("");
  const [genderOpen, setGenderOpen] = useState(false);

  // avatar
  const [avatarKey, setAvatarKey] = useState<(typeof AVATAR_ENUMS)[number]>("AVATAR_1");
  const [filter, setFilter] = useState<"ALL" | "BOYS" | "GIRLS">("ALL"); // atalhos de faixa

  // snapshot para cancelar
  const snapshot = useRef({
    name: "",
    email: "",
    birth: "",
    gender: "" as Gender | "",
    avatarKey: "AVATAR_1" as (typeof AVATAR_ENUMS)[number],
  });

  // índice atual no array completo (0..7)
  const currentIndex = useMemo(
    () => Math.max(0, AVATAR_ENUMS.indexOf(avatarKey)),
    [avatarKey]
  );

  // lista filtrada de índices conforme atalho
  const filteredIndexes = useMemo(() => {
    if (filter === "ALL") return AVATAR_ENUMS.map((_, i) => i);
    if (filter === "BOYS") return [0, 1, 2, 3];
    return [4, 5, 6, 7]; // GIRLS
  }, [filter]);

  // garante que o currentIndex sempre pertença ao filtro escolhido
  useEffect(() => {
    if (!filteredIndexes.includes(currentIndex)) {
      const first = filteredIndexes[0] ?? 0;
      setAvatarKey(AVATAR_ENUMS[first]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const showAvatarSrc = AVATAR_SRCS[currentIndex];

  // abrir => carregar do back
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetchMe()
      .then((me) => {
        setUserId(me.id);
        setName(me.username ?? "");
        setEmail(me.email ?? "");
        setBirthDateBR(toBRFromISO(me.birthDate));
        setGender((me.gender ?? "") as Gender | "");

        // avatar do back (enum); se vier algo fora, cai para AVATAR_1
        const idx = me.avatar ? AVATAR_ENUMS.indexOf(me.avatar as any) : -1;
        setAvatarKey(idx >= 0 ? AVATAR_ENUMS[idx] : "AVATAR_1");

        snapshot.current = {
          name: me.username ?? "",
          email: me.email ?? "",
          birth: toBRFromISO(me.birthDate),
          gender: (me.gender ?? "") as Gender | "",
          avatarKey: idx >= 0 ? AVATAR_ENUMS[idx] : "AVATAR_1",
        };
      })
      .catch(() =>
        toast(
          <ErrorToast
            title="Falha ao carregar perfil"
            description="Não foi possível obter seus dados."
          />
        )
      )
      .finally(() => setLoading(false));
  }, [open]);

  // abre/fecha => normaliza estado (e respeita forceEditMode/disableClose)
  useEffect(() => {
    if (!open) {
      // fechou: volta para visualização e restaura o último estado salvo
      setIsEditing(false);
      setGenderOpen(false);
      setFilter("ALL");
      setName(snapshot.current.name);
      setEmail(snapshot.current.email);
      setBirthDateBR(snapshot.current.birth);
      setGender(snapshot.current.gender as Gender | "");
      setAvatarKey(snapshot.current.avatarKey);
      return;
    }

    // abriu: começa em visualização ou já em edição (quando forçado)
    setIsEditing(!!forceEditMode);
    setGenderOpen(false);
    setFilter("ALL");
  }, [open, forceEditMode]);

  // bloqueia fechar via ESC quando disableClose=true
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (disableClose && e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    window.addEventListener("keydown", onKeyDown, { capture: true });
    return () => window.removeEventListener("keydown", onKeyDown, { capture: true } as any);
  }, [open, disableClose]);

  // date
  const datePickerRef = useRef<HTMLInputElement | null>(null);
  const handleBirthTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 8);
    const out =
      digits.length <= 2
        ? digits
        : digits.length <= 4
        ? `${digits.slice(0, 2)}/${digits.slice(2)}`
        : `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    setBirthDateBR(out);
  };
  const handlePickFromCalendar = (e: React.ChangeEvent<HTMLInputElement>) => {
    const iso = e.target.value;
    if (!iso) return;
    setBirthDateBR(toBRFromISO(iso));
  };

  // editar/cancelar/salvar
  function onEdit() {
    snapshot.current = { name, email, birth: birthDateBR, gender, avatarKey };
    setIsEditing(true);
  }
  function onCancel() {
    setName(snapshot.current.name);
    setEmail(snapshot.current.email);
    setBirthDateBR(snapshot.current.birth);
    setGender(snapshot.current.gender);
    setAvatarKey(snapshot.current.avatarKey);
    setIsEditing(false);
  }

    // helper para apagar o cookie quando concluir os dados adicionais
  function clearAdditionalDataCookie() {
    document.cookie =
      "insertAdditionalDataRequired=; Expires=Thu, 01 Jan 1970 00:00:00 GMT; Path=/; SameSite=Lax";
  }
  
 async function onSave() {
    if (!gender) {
      toast(<ErrorToast title="Campo obrigatório" description="Selecione um gênero." />);
      return;
    }
    setSaving(true);
    try {
      await updateMe({
        id: userId,
        username: name.trim(),
        email: email.trim(),
        birthDate: toISOFromBR(birthDateBR),
        gender,
        avatar: avatarKey,
      });

      toast(<SuccessToast title="Perfil atualizado!" description="Suas informações foram salvas." />);

      // snapshot e sai do modo edição
      snapshot.current = { name, email, birth: birthDateBR, gender, avatarKey };
      setIsEditing(false);

      // ✅ Se estava obrigatório, libera o fechamento:
      if (disableClose) {
        clearAdditionalDataCookie(); // não volta a obrigar após refresh
        // avisa o GuidePage para setar disableClose=false
        window.dispatchEvent(new CustomEvent("additional-data-completed"));
      }
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || "Não foi possível salvar. Tente novamente.";
      toast(<ErrorToast title="Erro ao salvar" description={msg} />);
    } finally {
      setSaving(false);
    }
  }

  // ui helpers
  const readOnly = !isEditing || loading || saving;
  const stepAvatar = (dir: -1 | 1) => {
    const list = filteredIndexes;
    const curIdxInList = Math.max(0, list.indexOf(currentIndex));
    const next = (curIdxInList + dir + list.length) % list.length;
    setAvatarKey(AVATAR_ENUMS[list[next]]);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[120] grid place-items-center bg-black/50 backdrop-blur-[1px] p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-2xl rounded-[28px] bg-[#9db668] p-6 md:p-8 shadow-2xl">
        {/* Fechar */}
        {!disableClose && (
          <button
            type="button"
            aria-label="Fechar"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-1 text-white/95 hover:opacity-90 disabled:opacity-60"
            disabled={saving}
          >
            <X size={28} />
          </button>
        )}

        {/* Avatar (+ controles somente em edição) */}
        <div className="mb-6 mt-2 grid place-items-center gap-3">
          {!isEditing ? (
            // --- Visualização: apenas a foto atual ---
            <div className="grid h-28 w-28 place-items-center overflow-hidden rounded-full ring-4 ring-white/50 bg-white shadow">
              <img src={showAvatarSrc} alt="Avatar atual" className="h-24 w-24 object-contain" />
            </div>
          ) : (
            <>
              {/* --- Edição: setas para alternar --- */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => stepAvatar(-1)}
                  className="rounded-full bg-white/70 p-2 text-[#2f4a31] shadow"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>

                <div className="grid h-28 w-28 place-items-center overflow-hidden rounded-full ring-4 ring-white/50 bg-white shadow">
                  <img
                    src={showAvatarSrc}
                    alt="Avatar selecionado"
                    className="h-24 w-24 object-contain"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => stepAvatar(1)}
                  className="rounded-full bg-white/70 p-2 text-[#2f4a31] shadow"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>

              {/* --- Filtros rápidos (meninos/meninas/todos) --- */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setFilter("ALL")}
                  className={`rounded-full px-3 py-1 text-sm font-semibold shadow ${
                    filter === "ALL" ? "bg-[#2f4a31] text-white" : "bg-white/80 text-[#2f4a31]"
                  }`}
                  title="Mostrar todos"
                >
                  Todos
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("BOYS")}
                  className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold shadow ${
                    filter === "BOYS" ? "bg-[#2f4a31] text-white" : "bg-white/80 text-[#2f4a31]"
                  }`}
                  title="Mostrar avatares meninos"
                >
                  <Mars className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setFilter("GIRLS")}
                  className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold shadow ${
                    filter === "GIRLS" ? "bg-[#2f4a31] text-white" : "bg-white/80 text-[#2f4a2f]"
                  }`}
                  title="Mostrar avatares meninas"
                >
                  <Venus className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
        </div>

        {/* Form */}
        <form
          className="mx-auto max-w-xl space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (isEditing && !saving) onSave();
          }}
        >
          {/* Nome */}
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white">
              Nome:
            </label>
            <input
              type="text"
              required
              value={name}
              readOnly={readOnly}
              onChange={(e) => setName(e.target.value)}
              className={`w-full rounded-md px-3 py-2 text-sm text-white placeholder-white/70 outline-none ring-1 ring-black/10 ${
                readOnly ? "bg-[#3d4a2c]/90" : "bg-[#3d4a2c] focus:ring-white/20"
              }`}
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white">
              Email:
            </label>
            <input
              type="email"
              required
              value={email}
              readOnly={readOnly}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full rounded-md px-3 py-2 text-sm text-white placeholder-white/70 outline-none ring-1 ring-black/10 ${
                readOnly ? "bg-[#3d4a2c]/90" : "bg-[#3d4a2c] focus:ring-white/20"
              }`}
            />
          </div>

          {/* Aniversário */}
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white">
              Aniversário:
            </label>
            <div className="relative">
              <input
                type="text"
                required
                inputMode="numeric"
                placeholder="dd/mm/aaaa"
                value={birthDateBR}
                readOnly={readOnly}
                onChange={handleBirthTyping}
                className={`w-full rounded-md pr-10 px-3 py-2 text-sm text-white placeholder-white/70 outline-none ring-1 ring-black/10 ${
                  readOnly ? "bg-[#3d4a2c]/90" : "bg-[#3d4a2c] focus:ring-white/20"
                }`}
              />
              <button
                type="button"
                aria-label="Selecionar data"
                disabled={readOnly}
                onClick={() => {
                  if (readOnly) return;
                  datePickerRef.current?.showPicker?.() ?? datePickerRef.current?.click();
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-white/90 hover:text-white disabled:opacity-50"
              >
                <Calendar className="h-5 w-5" />
              </button>
              <input
                ref={datePickerRef}
                type="date"
                className="sr-only"
                onChange={handlePickFromCalendar}
              />
            </div>
          </div>

          {/* Gênero */}
          <div>
            <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-white">
              Gênero:
            </label>
            <div className="relative">
              <select
                required
                value={gender}
                disabled={readOnly}
                onChange={(e) => {
                  setGender(e.target.value as Gender | "");
                  setGenderOpen(false);
                }}
                onFocus={() => !readOnly && setGenderOpen(true)}
                onMouseDown={() => !readOnly && setGenderOpen(true)}
                onBlur={() => setGenderOpen(false)}
                onKeyDown={(e) => {
                  if (["Escape", "Enter", " "].includes(e.key)) setGenderOpen(false);
                }}
                className={`w-full rounded-md bg-[#3d4a2c] px-3 py-2 pr-10 text-sm text-white outline-none ring-1 ring-black/10 focus:ring-white/20 appearance-none ${
                  readOnly ? "opacity-90 cursor-not-allowed" : ""
                }`}
              >
                <option value="" disabled>
                  Selecione…
                </option>
                <option value="MASCULINO">Masculino</option>
                <option value="FEMININO">Feminino</option>
                <option value="OUTRO">Outro</option>
              </select>
              <span
                aria-hidden
                className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-white/90"
              >
                {genderOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </span>
            </div>
          </div>

          {/* Ações */}
          {!isEditing ? (
            <div className="pt-2 grid place-items-center">
              <button
                type="button"
                onClick={onEdit}
                disabled={loading}
                className="rounded-full bg-[#2f4a31] px-8 py-3 text-sm font-bold text-white hover:brightness-110 disabled:opacity-60"
              >
                {loading ? "Carregando..." : "EDITAR"}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={onCancel}
                disabled={saving || disableClose /* impede sair da edição quando bloqueado */}
                className="rounded-full bg-white px-8 py-3 text-sm font-extrabold text-[#7a9456] shadow hover:opacity-95 disabled:opacity-60"
              >
                CANCELAR
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-full bg-[#2f4a31] px-8 py-3 text-sm font-extrabold text-white hover:brightness-110 disabled:opacity-60"
              >
                {saving ? "Salvando..." : "SALVAR"}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
