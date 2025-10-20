// src/modules/authentication/pages/RegisterOverlay.tsx
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import { Button } from "#/components/ui/button";
import { X, Calendar, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import WaveImg from "#/modules/authentication/assets/4 - Ondas.png";
import WaveImg2 from "#/modules/authentication/assets/11 - Ondas2.png";
import { register, toISODateFromBR, type Gender } from "#/modules/authentication/services/registerService";

// Google
import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import { loginWithGoogle } from "#/modules/authentication/services/googleAuthService";

// Toasts
import { toast } from "react-toastify";
import ErrorToast from "#/components/toasts/ErrorToast";
import SuccessToast from "#/components/toasts/SuccessToast";

export default function RegisterOverlay() {
  const navigate = useNavigate();

  // campos
  const [showPwd, setShowPwd] = useState(false);
  const [birthDateBR, setBirthDateBR] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState<Gender | "">("");
  const [genderOpen, setGenderOpen] = useState(false);

  // controle
  const [submitting, setSubmitting] = useState(false);
  const datePickerRef = useRef<HTMLInputElement | null>(null);

  // máscara dd/mm/aaaa
  function handleBirthInput(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, "").slice(0, 8);
    let out = "";
    if (digits.length <= 2) out = digits;
    else if (digits.length <= 4) out = `${digits.slice(0, 2)}/${digits.slice(2)}`;
    else out = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
    setBirthDateBR(out);
  }

  function handlePickFromCalendar(e: React.ChangeEvent<HTMLInputElement>) {
    const iso = e.target.value;
    if (!iso) return;
    const [y, m, d] = iso.split("-");
    setBirthDateBR(`${d}/${m}/${y}`);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;

    if (!gender) {
      toast(<ErrorToast title="Campo obrigatório" description="Selecione um gênero." />);
      return;
    }

    setSubmitting(true);

    try {
      await register({
        username: fullName,
        email,
        password,
        birthDate: toISODateFromBR(birthDateBR),
        gender,
      });

      toast(
        <SuccessToast
          title="Conta criada com sucesso!"
          description="Agora é só entrar com seus dados."
        />
      );

      setSubmitting(false);
      navigate("/login", { replace: true });
      return;
    } catch (err: any) {
      const msg = err?.message || "Não foi possível criar a conta. Tente novamente.";
      toast(<ErrorToast title="Falha no cadastro" description={msg} />);
    } finally {
      setSubmitting(false);
    }
  }

  // Google handlers
  function handleGoogleSuccess(credentialResponse: CredentialResponse) {
    const idToken = credentialResponse.credential;
    if (!idToken) {
      toast(
        <ErrorToast
          title="Falha no login com Google"
          description="Não foi possível obter o token do Google."
        />
      );
      return;
    }

    loginWithGoogle(idToken)
      .then(({ insertAdditionalData }) => {
        const description = insertAdditionalData
          ? "Login realizado! Complete as informações faltantes para finalizar seu perfil."
          : "Bem-vindo ao Mochileiro!";

        toast(<SuccessToast title="Login com Google realizado!" description={description} />);

        // Vai para o Guide passando o state que o GuidePage vai ler na montagem
        navigate("/guide", {
          replace: true,
          state: { requireAdditionalData: insertAdditionalData },
        });
      })
      .catch((e) =>
        toast(
          <ErrorToast
            title="Falha no login com Google"
            description={e?.message || "Tente novamente."}
          />
        )
      );
  }

  function handleGoogleError() {
    toast(<ErrorToast title="Erro" description="Falha ao autenticar com Google. Tente novamente." />);
  }

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#9db668] to-[#7a9456]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      {/* Fechar */}
      <motion.button
        aria-label="Fechar"
        onClick={() => navigate("/")}
        className="absolute left-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-[#3d4a2c] shadow hover:bg-white focus:outline-none focus:ring-2 focus:ring-white/60"
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.25 }}
      >
        <X className="h-5 w-5" />
      </motion.button>

      {/* Entrar */}
      <motion.div
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.25 }}
      >
        <Button
          onClick={() => navigate("/login")}
          className="absolute right-4 top-4 rounded-md bg-white/90 px-4 py-2 text-xs font-semibold text-[#3d4a2c] shadow hover:bg-white"
        >
          ENTRAR
        </Button>
      </motion.div>

      {/* Ondas decorativas */}
      <img
        src={WaveImg}
        alt=""
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-[-10%] w-[45%] max-w-none select-none opacity-95"
      />
      <img
        src={WaveImg2}
        alt=""
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-[-10%] w-[45%] max-w-none -scale-x-100 select-none opacity-95"
      />

      {/* Conteúdo */}
      <div className="mx-auto flex min-h-screen max-w-[1024px] flex-col items-center justify-center px-4">
        <motion.form
          onSubmit={handleSubmit}
          className="w-full max-w-[420px]"
          initial={{ y: 24, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <h1 className="mb-4 text-center text-lg font-semibold text-white">Crie o seu perfil</h1>

          {/* Aniversário */}
          <label className="mb-2 block text-xs font-semibold text-white/90">Aniversário</label>
          <div className="relative mb-3">
            <input
              type="text"
              required
              inputMode="numeric"
              placeholder="dd / mm / aaaa"
              value={birthDateBR}
              onChange={handleBirthInput}
              maxLength={10}
              className="w-full rounded-md bg-[#3d4a2c] px-3 py-2 pr-10 text-sm text-white placeholder-white/60 outline-none ring-1 ring-black/10 focus:ring-white/20"
            />
            <button
              type="button"
              aria-label="Selecionar data"
              onClick={() => datePickerRef.current?.showPicker?.() ?? datePickerRef.current?.click()}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-white/90 hover:text-white"
            >
              <Calendar className="h-5 w-5" />
            </button>
            <input ref={datePickerRef} type="date" className="sr-only" onChange={handlePickFromCalendar} />
          </div>

          {/* Nome */}
          <label className="mb-2 block text-xs font-semibold text-white/90">Nome</label>
          <input
            type="text"
            required
            placeholder="Nome"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mb-3 w-full rounded-md bg-[#3d4a2c] px-3 py-2 text-sm text-white placeholder-white/60 outline-none ring-1 ring-black/10 focus:ring-white/20"
          />

          {/* Email */}
          <label className="mb-2 block text-xs font-semibold text-white/90">E-mail</label>
          <input
            type="email"
            required
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            className="mb-3 w-full rounded-md bg-[#3d4a2c] px-3 py-2 text-sm text-white placeholder-white/60 outline-none ring-1 ring-black/10 focus:ring-white/20"
          />

          {/* Senha */}
          <label className="mb-2 block text-xs font-semibold text-white/90">Senha</label>
          <div className="relative mb-3">
            <input
              type={showPwd ? "text" : "password"}
              placeholder="Senha"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full rounded-md bg-[#3d4a2c] px-3 py-2 pr-10 text-sm text-white placeholder-white/60 outline-none ring-1 ring-black/10 focus:ring-white/20"
            />
            <button
              type="button"
              aria-label={showPwd ? "Ocultar senha" : "Mostrar senha"}
              onClick={() => setShowPwd((v) => !v)}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-white/90 hover:text-white"
            >
              {showPwd ? (
                <svg width="20" height="20" viewBox="0 0 24 24" className="fill-none stroke-current">
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" strokeWidth="2" />
                  <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" strokeWidth="2" />
                  <path d="M3 3l18 18" strokeWidth="2" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" className="fill-none stroke-current">
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" strokeWidth="2" />
                  <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" strokeWidth="2" />
                </svg>
              )}
            </button>
          </div>

          {/* Gênero */}
          <label className="mb-2 block text-xs font-semibold text-white/90">Gênero</label>
          <div className="relative">
            <select
              required
              value={gender}
              onChange={(e) => {
                setGender(e.target.value as Gender | "");
                setGenderOpen(false);
              }}
              onFocus={() => setGenderOpen(true)}
              onMouseDown={() => setGenderOpen(true)}
              onBlur={() => setGenderOpen(false)}
              onKeyDown={(e) => {
                if (e.key === "Escape" || e.key === "Enter" || e.key === " ") {
                  setGenderOpen(false);
                }
              }}
              className="
                w-full rounded-md bg-[#3d4a2c] px-3 py-2 pr-10 text-sm text-white
                outline-none ring-1 ring-black/10 focus:ring-white/20
                appearance-none
              "
            >
              <option value="" disabled>Selecione…</option>
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

          {/* Botão Criar Conta */}
          <Button
            type="submit"
            disabled={submitting}
            className="mt-1 mb-4 w-full rounded-md bg-white text-[#3d4a2c] hover:bg-white/90 disabled:opacity-70"
          >
            {submitting ? "Criando..." : "CRIAR CONTA"}
          </Button>

          {/* Divisor OU */}
          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/30" />
            <span className="select-none text-xs font-semibold text-white">OU</span>
            <div className="h-px flex-1 bg-white/30" />
          </div>

          {/* Google */}
          <div className="flex w-full justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              size="large"
              shape="pill"
              text="continue_with"
            />
          </div>
        </motion.form>
      </div>
    </motion.div>
  );
}
