
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "#/components/ui/button";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import WaveImg from "#/modules/authentication/assets/4 - Ondas.png";
import WaveImgFlower from "#/modules/authentication/assets/10 - OndasFlor.png";
import { login } from "#/modules/authentication/services/authService";


import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import { loginWithGoogle } from "#/modules/authentication/services/googleAuthService";


import { toast } from "react-toastify";
import ErrorToast from "#/components/toasts/ErrorToast";
import SuccessToast from "#/components/toasts/SuccessToast";

export default function LoginOverlay() {
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);

    try {
      await login({ email, password });

      toast(
        <SuccessToast
          title="Login realizado!"
          description="Bem-vindo de volta ao Mochileiro."
        />
      );

      navigate("/guide", { replace: true });
    } catch {
      toast(
        <ErrorToast
          title="Não foi possível entrar!"
          description="E-mail ou senha incorretos. Tente novamente."
        />
      );
    } finally {
      setSubmitting(false);
    }
  }

  
  function handleGoogleSuccess(credentialResponse: CredentialResponse) {
    const idToken = credentialResponse.credential;
    if (!idToken) {
      toast(
        <ErrorToast
          title="Falha ao autenticar com Google"
          description="Não foi possível obter o token. Tente novamente."
        />
      );
      return;
    }

    loginWithGoogle(idToken)
      .then(({ insertAdditionalData }) => {
        const description = insertAdditionalData
          ? "Login realizado! Complete as informações faltantes DO seu perfil."
          : "Autenticado com a sua conta Google!";

        toast(<SuccessToast title="Login realizado!" description={description} />);

        
        navigate("/guide", {
          replace: true,
          state: { requireAdditionalData: insertAdditionalData },
        });
      })
      .catch(() => {
        toast(
          <ErrorToast
            title="Falha ao autenticar com Google"
            description="Não conseguimos autenticar sua conta. Tente novamente."
          />
        );
      });
  }

  function handleGoogleError() {
    toast(
      <ErrorToast
        title="Falha ao autenticar com Google"
        description="Tente novamente."
      />
    );
  }

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#9db668] to-[#7a9456]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
    >
      
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

      
      <motion.div
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.25 }}
      >
        <Button
          onClick={() => navigate("/register")}
          className="absolute right-4 top-4 rounded-md bg-white/90 px-4 py-2 text-xs font-semibold text-[#3d4a2c] shadow hover:bg-white"
        >
          CRIAR CONTA
        </Button>
      </motion.div>

      
      <img
        src={WaveImgFlower}
        alt=""
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-[-10%] w-[45%] max-w-none select-none opacity-95"
      />
      <img
        src={WaveImg}
        alt=""
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-[-10%] w-[45%] max-w-none -scale-x-100 select-none opacity-95"
      />

      
      <div className="mx-auto flex min-h-screen max-w-[1024px] flex-col items-center justify-center px-4">
        <motion.form
          onSubmit={handleSubmit}
          className="w-full max-w-[420px]"
          initial={{ y: 24, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        >
          <h1 className="mb-4 text-center text-lg font-semibold text-white">Entrar</h1>

          
          <label className="mb-2 block text-xs font-semibold text-white/90">Email</label>
          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            className="mb-3 w-full rounded-md bg-[#3d4a2c] px-3 py-2 text-sm text-white placeholder-white/60 outline-none ring-1 ring-black/10 focus:ring-white/20"
          />

          
          <label className="mb-2 block text-xs font-semibold text-white/90">Senha</label>
          <div className="relative">
            <input
              type={showPwd ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
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

          
          <div className="mt-1 mb-4 text-right">
            <button
              type="button"
              className="text-[11px] font-semibold text-white/90 underline-offset-2 hover:underline"
            >
              ESQUECEU?
            </button>
          </div>

          
          <Button
            type="submit"
            disabled={submitting}
            className="mb-4 w-full rounded-md bg-white text-[#3d4a2c] hover:bg-white/90 disabled:opacity-70"
          >
            {submitting ? "Entrando..." : "ENTRAR"}
          </Button>

          
          <div className="my-4 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/30" />
            <span className="select-none text-xs font-semibold text-white">OU</span>
            <div className="h-px flex-1 bg-white/30" />
          </div>

          
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
