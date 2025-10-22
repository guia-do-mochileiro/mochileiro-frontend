// src/modules/guide/pages/GuideQuizPage.tsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import GuideQuizNavbar from "#/modules/guide/components/quiz/GuideQuizNavbar";
import AnswerButton from "#/modules/guide/components/quiz/AnswerButton";
import QuizFooter from "#/modules/guide/components/quiz/QuizFooter";
import PhaseResultCard from "#/modules/guide/components/quiz/PhaseResultCard";
import GuideMenuModal from "#/modules/guide/components/GuideMenuModal";

import OverallProgressCard from "#/components/OverallProgressCard";
import TipCard from "#/components/TipCard";

import {
  getPhaseProgress,
  getPhaseQuiz,
  submitAnswer,
  resetPhaseProgress,
} from "#/modules/guide/services/quizService";

// ✅ Toast de sucesso com ícone opcional
import SuccessToast from "#/components/toasts/SuccessToast";
// ✅ Resolver ícone da conquista pelo nome (pasta assets/achievements)
import { resolveAchievementIcon } from "#/modules/guide/utils/resolveAchievementIcon";

// Mascotes
import ThinkImg from "#/modules/guide/assets/quiz/1 - think.png";
import SadImg from "#/modules/guide/assets/quiz/2 - sad.png";
import HappyImg from "#/modules/guide/assets/quiz/3 - happy.png";
// Imagem central (também usamos como fallback para ícone de conquista)
import ImgCenter from "#/modules/guide/assets/quiz/4 - ImgCenter.png";

// Fallbacks
import Phase1Icon from "#/modules/guide/assets/phases/1.png";
import Phase2Icon from "#/modules/guide/assets/phases/2.png";
import Phase3Icon from "#/modules/guide/assets/phases/3.png";
import Phase4Icon from "#/modules/guide/assets/phases/4.png";
import { toast } from "react-toastify";

type LocationState = {
  phaseLabel?: string;
  phaseColor?: "green" | "coral" | "yellow" | "blue";
  phaseIndex?: 1 | 2 | 3 | 4;
  iconSrc?: string;
};

const DEFAULT_LABELS: Record<1 | 2 | 3 | 4, string> = {
  1: "LOCALIZAÇÃO E CAPITAL",
  2: "HIDROGRAFIA E BIOMA",
  3: "CULTURA E SOCIEDADE",
  4: "ECONOMIA E DESAFIOS",
};
const DEFAULT_ICONS: Record<1 | 2 | 3 | 4, string> = {
  1: Phase1Icon,
  2: Phase2Icon,
  3: Phase3Icon,
  4: Phase4Icon,
};
// mesma paleta usada no mapa
const COLOR_BY_INDEX: Record<1 | 2 | 3 | 4, "green" | "blue" | "coral" | "yellow"> = {
  1: "green",
  2: "blue",
  3: "coral",
  4: "yellow",
};

type Mascot = "think" | "happy" | "sad";

// estrutura mínima que usamos do /progress
type PhaseProgress = {
  phaseName?: string;
  completed: boolean;
  passed: boolean;
  remaining: number;
  correctAnswers?: number;
  wrongAnswers?: number;
  nextPhaseId?: string;
  correctQuestionIds: string[];
  wrongQuestionIds: string[];
};

export default function GuideQuizPage() {
  const navigate = useNavigate();
  const { missionId, stateCode } = useParams<{ missionId: string; stateCode: string }>();
  const location = useLocation();
  const locState = (location.state || {}) as LocationState;

  const [confirmLeaveOpen, setConfirmLeaveOpen] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const { label, color, icon, index } = useMemo(() => {
    const idx = (locState.phaseIndex && [1, 2, 3, 4].includes(locState.phaseIndex)
      ? locState.phaseIndex
      : 1) as 1 | 2 | 3 | 4;
    return {
      label: locState.phaseLabel ?? DEFAULT_LABELS[idx],
      color: (locState.phaseColor ?? COLOR_BY_INDEX[idx]) as "green" | "blue" | "coral" | "yellow",
      icon: locState.iconSrc ?? DEFAULT_ICONS[idx],
      index: idx,
    };
  }, [locState]);

  // ====== Estado do Quiz ======
  const [loading, setLoading] = useState(true);
  const [queue, setQueue] = useState<number[]>([]);
  const [qIndex, setQIndex] = useState<number>(0);
  const [selectedAltId, setSelectedAltId] = useState<string | null>(null);
  const [mode, setMode] = useState<"answering" | "feedback">("answering");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [mascot, setMascot] = useState<Mascot>("think");

  const [questions, setQuestions] =
    useState<Awaited<ReturnType<typeof getPhaseQuiz>>["questions"]>([]);

  // progresso atual (para resultado e card)
  const [progressState, setProgressState] = useState<PhaseProgress | null>(null);
  const [finished, setFinished] = useState(false);

  const currentQuestion = useMemo(() => {
    if (!questions.length || !queue.length) return null;
    const absoluteIndex = queue[qIndex];
    return questions[absoluteIndex] ?? null;
  }, [questions, queue, qIndex]);

  // Carrega quiz + progresso
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!missionId) return;
      setLoading(true);
      try {
        const [quiz, progress] = await Promise.all([
          getPhaseQuiz(missionId),
          getPhaseProgress(missionId),
        ]);
        if (!mounted) return;

        const pg: PhaseProgress = {
          phaseName: progress.phaseName,
          completed: Boolean(progress.completed),
          passed: Boolean(progress.passed),
          remaining: Number(progress.remaining ?? 0),
          correctAnswers: Number(progress.correctAnswers ?? 0),
          wrongAnswers: Number(progress.wrongAnswers ?? 0),
          nextPhaseId: progress.nextPhaseId ?? undefined,
          correctQuestionIds: progress.correctQuestionIds ?? [],
          wrongQuestionIds: progress.wrongQuestionIds ?? [],
        };
        setProgressState(pg);

        setQuestions(quiz.questions || []);

        // Fila = tudo que ainda precisa ser ACERTADO.
        const total = quiz.questions?.length ?? 0;
        const allIdx = Array.from({ length: total }, (_, i) => i);
        const correctSet = new Set<string>(pg.correctQuestionIds);
        const wrongSet = new Set<string>(pg.wrongQuestionIds);

        const pendingIdx = allIdx.filter((i) => !correctSet.has(quiz.questions[i].id));
        const notTried = pendingIdx.filter((i) => !wrongSet.has(quiz.questions[i].id));
        const previouslyWrong = pendingIdx.filter((i) => wrongSet.has(quiz.questions[i].id));
        const ordered = [...notTried, ...previouslyWrong];

        if (pg.completed || ordered.length === 0) {
          setQueue([]);
          setFinished(true);
        } else {
          setQueue(ordered);
          setFinished(false);
        }

        setQIndex(0);
        setSelectedAltId(null);
        setMode("answering");
        setIsCorrect(null);
        setMascot("think");
      } catch (e) {
        console.error(e);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [missionId]);

  // Ações
  const handleSelect = (altId: string) => {
    if (mode !== "answering" || finished) return;
    setSelectedAltId(altId);
  };

  const handleVerify = async () => {
    if (!currentQuestion || !selectedAltId || finished) return;
    try {
      const res = await submitAnswer({
        questionId: currentQuestion.id,
        selectedAlternativeId: selectedAltId,
      });

      // ✅ Se houver conquistas desbloqueadas, dispara um toast para cada uma
      if (Array.isArray(res.unlockedAchievements) && res.unlockedAchievements.length) {
        res.unlockedAchievements.forEach((achName) => {
          const iconUrl = resolveAchievementIcon(achName, ImgCenter);
          toast(
            <SuccessToast
              title="Parabéns!"
              description={`Você desbloqueou a conquista "${achName}"`}
              iconSrc={iconUrl}
            />
          );
        });
      }

      const ok = Boolean(res.correct);
      setIsCorrect(ok);
      setMode("feedback");
      setMascot(ok ? "happy" : "sad");
    } catch (e) {
      console.error(e);
    }
  };

  // Revalida progresso para preencher o card final (server) quando terminar
  const refetchProgressForResult = async () => {
    if (!missionId) return;
    try {
      const p = await getPhaseProgress(missionId);
      const pg: PhaseProgress = {
        phaseName: p.phaseName,
        completed: Boolean(p.completed),
        passed: Boolean(p.passed),
        remaining: Number(p.remaining ?? 0),
        correctAnswers: Number(p.correctAnswers ?? 0),
        wrongAnswers: Number(p.wrongAnswers ?? 0),
        nextPhaseId: p.nextPhaseId ?? undefined,
        correctQuestionIds: p.correctQuestionIds ?? [],
        wrongQuestionIds: p.wrongQuestionIds ?? [],
      };
      setProgressState(pg);
    } catch (e) {
      console.error(e);
    }
  };

  // Avança após o feedback
  const goNextQuestion = () => {
    if (finished) return;
    if (!queue.length) return;

    // atualização otimista do progresso para o card
    if (isCorrect) {
      setProgressState((prev) => {
        if (!prev) return prev;
        const nextRemaining = Math.max(0, (prev.remaining ?? 0) - 1);
        return {
          ...prev,
          remaining: nextRemaining,
          correctAnswers: (prev.correctAnswers ?? 0) + 1,
        };
      });
    } else if (isCorrect === false) {
      setProgressState((prev) => {
        if (!prev) return prev;
        return { ...prev, wrongAnswers: (prev.wrongAnswers ?? 0) + 1 };
      });
    }

    setQueue((prev) => {
      let nextQueue = prev.slice();
      if (isCorrect) {
        nextQueue.splice(qIndex, 1);
      } else if (nextQueue.length > 1) {
        const [removed] = nextQueue.splice(qIndex, 1);
        nextQueue.push(removed);
      }

      if (nextQueue.length === 0) {
        setFinished(true);
        prev.length && refetchProgressForResult();
      } else {
        const nextIdx = Math.min(qIndex, nextQueue.length - 1);
        setQIndex(nextIdx);
      }

      return nextQueue;
    });

    setSelectedAltId(null);
    setMode("answering");
    setIsCorrect(null);
    setMascot("think");
  };

  const handleSkip = () => {
    if (finished) return;
    if (queue.length <= 1) {
      setQIndex(0);
      setSelectedAltId(null);
      setMode("answering");
      setIsCorrect(null);
      setMascot("think");
      return;
    }
    setQueue((arr) => {
      const absolute = arr[qIndex];
      const rest = arr.filter((_, i) => i !== qIndex);
      const next = [...rest, absolute];
      const nextIdx = Math.min(qIndex, next.length - 1);
      setQIndex(nextIdx);
      return next;
    });
    setSelectedAltId(null);
    setMode("answering");
    setIsCorrect(null);
    setMascot("think");
  };

  // Estados visuais das alternativas
  const altState = (altId: string): "idle" | "selected" | "right" | "wrong" | "disabled" => {
    if (mode === "answering") return selectedAltId === altId ? "selected" : "idle";
    if (!currentQuestion) return "idle";
    const correctAlt = currentQuestion.alternatives.find((a) => a.correct)?.id;
    if (altId === correctAlt) return "right";
    if (altId === selectedAltId && !isCorrect) return "wrong";
    return "idle";
  };

  // Dados para o feedback textual (footer)
  const correctAlt = currentQuestion?.alternatives.find((a) => a.correct);
  const correctIdx =
    correctAlt ? currentQuestion?.alternatives.findIndex((a) => a.id === correctAlt.id) ?? 0 : 0;
  const correctLetter = (["A", "B", "C", "D"][correctIdx] ?? "A") as "A" | "B" | "C" | "D";
  const correctText = correctAlt?.optionText ?? "";

  // Título dinâmico do modal
  const confirmTitle = finished
    ? "Sair do quiz?"
    : "Você está prestes a perder seu progresso desta fase. Deseja sair mesmo assim?";

  // ====== Dados para o OverallProgressCard (current = goal - remaining) ======
  const goal = useMemo(() => (questions?.length ?? 10) || 10, [questions]);
  const progressCurrent = useMemo(() => {
    const rem = progressState?.remaining;
    if (typeof rem !== "number") return 0;
    const v = goal - rem;
    return v < 0 ? 0 : v > goal ? goal : v;
  }, [goal, progressState?.remaining]);

  // ====== Actions dos botões do resultado ======
  const handleGoToMenu = () => {
    // 👉 Deep link para abrir o mapa já no nível do estado atual
    navigate("/guide", {
      state: { deepLink: { level: "state", stateCode } },
    });
  };

  const handleGoToNextPhase = () => {
    const nextId = progressState?.nextPhaseId;
    if (!nextId) {
      navigate("/guide", { state: { deepLink: { level: "state", stateCode } } });
      return;
    }

    // calcula metadados da PRÓXIMA fase (2->3, 3->4, etc.)
    const nextIdx = (Math.min(4, Math.max(1, (index as number) + 1)) as 1 | 2 | 3 | 4);
    navigate(`/guide/quiz/${stateCode}/${nextId}`, {
      state: {
        phaseLabel: DEFAULT_LABELS[nextIdx],
        phaseColor: COLOR_BY_INDEX[nextIdx],
        phaseIndex: nextIdx,
        iconSrc: DEFAULT_ICONS[nextIdx],
      },
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FFFFE0] text-slate-100">
      <GuideQuizNavbar
        label={label}
        color={color}
        iconSrc={icon}
        onBack={() => setConfirmLeaveOpen(true)}
      />

      <main className="grid flex-1 grid-cols-1 gap-4 p-4 lg:grid-cols-[1fr_360px]">
        <section className="relative min-h-[60vh] overflow-hidden rounded-xl border border-slate-700 bg-white p-6 lg:min-h-[calc(100vh-6rem-2rem)] flex flex-col">
          {loading ? (
            <div className="grid h-[300px] place-items-center text-[#6b5a2a]">Carregando…</div>
          ) : finished ? (
            <div className="flex flex-1 items-center justify-center">
              <PhaseResultCard
                passed={Boolean(progressState?.passed)}
                phaseName={progressState?.phaseName}
                correct={progressState?.correctAnswers}
                wrong={progressState?.wrongAnswers}
                onMenu={handleGoToMenu}
                onNext={handleGoToNextPhase}
              />
            </div>
          ) : !currentQuestion ? (
            <div className="grid h-[300px] place-items-center text-[#6b5a2a]">Carregando…</div>
          ) : (
            <>
              <div className="flex-1 flex flex-col">
                <div className="mb-6 flex items-start gap-4">
                  <img
                    src={mascot === "think" ? ThinkImg : mascot === "happy" ? HappyImg : SadImg}
                    alt=""
                    className="h-28 w-28 shrink-0 object-contain sm:h-32 sm:w-32"
                  />
                  <h2 className="flex-1 text-center text-4xl font-extrabold leading-snug text-[#69521a] sm:text-5xl">
                    {currentQuestion.questionText}
                  </h2>
                </div>

                <div className="mb-8 grid place-items-center">
                  <img src={ImgCenter} alt="" className="h-64 w-auto sm:h-72 md:h-80" />
                </div>

                <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2">
                  {currentQuestion.alternatives.map((a, idx) => (
                    <AnswerButton
                      key={a.id}
                      size="lg"
                      letter={(["A", "B", "C", "D"][idx] ?? "A") as "A" | "B" | "C" | "D"}
                      text={a.optionText}
                      state={altState(a.id)}
                      onClick={() => handleSelect(a.id)}
                    />
                  ))}
                </div>
              </div>

              <div className="mx-auto mt-6 w-full max-w-5xl">
                <QuizFooter
                  mode={mode}
                  canVerify={!!selectedAltId}
                  onSkip={handleSkip}
                  onVerify={handleVerify}
                  onNext={goNextQuestion}
                  correct={isCorrect}
                  correctLetter={mode === "feedback" && !isCorrect ? correctLetter : undefined}
                  correctText={mode === "feedback" && !isCorrect ? correctText : undefined}
                />
              </div>
            </>
          )}
        </section>

        <aside className="flex flex-col gap-4">
          <OverallProgressCard
            current={progressCurrent}
            goal={goal}
            accent="#9db668"
            cardBg="#FFFDE1"
          />
          <TipCard
            text={`No Amazonas a floresta libera tanta umidade que forma os “rios voadores”, responsáveis por levar chuva para outras regiões do Brasil!`}
            chipLabel="CURIOSIDADE"
          />
        </aside>
      </main>

      <GuideMenuModal
        open={confirmLeaveOpen}
        onClose={() => setConfirmLeaveOpen(false)}
        initialPhase="confirm"
        confirmTitle={confirmTitle}
        onConfirm={async () => {
          if (leaving) return;
          setLeaving(true);
          try {
            if (!finished && missionId) {
              await resetPhaseProgress(missionId);
            }
          } catch (e) {
            console.error("Falha ao resetar progresso ao sair do quiz:", e);
          } finally {
            setLeaving(false);
            setConfirmLeaveOpen(false);
            // 👉 Deep link para reabrir o /guide já no estado atual
            navigate("/guide", {
              state: { deepLink: { level: "state", stateCode } },
            });
          }
        }}
      />
    </div>
  );
}
