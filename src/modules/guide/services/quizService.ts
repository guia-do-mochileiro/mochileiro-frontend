import { api } from "#/config/apiConfig";

// ===== Tipos =====
export type AlternativeDTO = {
  id: string;
  optionText: string;
  correct: boolean;
};

export type QuestionDTO = {
  id: string;
  questionText: string;
  questionType: "MULTIPLA_ESCOLHA" | "VERDADEIRO_FALSO";
  bnccCode?: string;
  alternatives: AlternativeDTO[];
};

export type PhaseQuizDTO = {
  id: string;           // phaseId (missionId na sua nomenclatura)
  name: string;         // nome da fase
  orderIndex?: number;  // 1..4
  questions: QuestionDTO[];
};

export type SubmitAnswerIn = {
  questionId: string;
  selectedAlternativeId: string;
};

export type SubmitAnswerOut = {
  questionId: string;
  correctAlternativeId: string;
  unlockedAchievements: string[]; // pode vir vazio
  correct: boolean;
};

export type ProgressDTO = {
  phaseId: string;
  phaseName: string;
  totalQuestions: number;
  answered: number;
  correctAnswers: number;
  wrongAnswers: number;
  remaining: number;
  completed: boolean;
  passed: boolean;
  nextPhaseId?: string | null;
  correctQuestionIds: string[];
  wrongQuestionIds: string[];
};

// ===== Helpers =====
function extractMsg(err: any, fallback: string) {
  return (
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    fallback
  );
}

// ===== Calls =====

/** Carrega as questões de uma fase (mission/phase id). */
export async function getPhaseQuiz(phaseId: string) {
  try {
    const { data } = await api.get<PhaseQuizDTO>(`/api/phases/list-quizzes/${phaseId}`);
    return data;
  } catch (err: any) {
    const e = new Error(extractMsg(err, "Falha ao carregar o quiz."));
    (e as any).status = err?.response?.status;
    throw e;
  }
}

/** Envia a resposta de uma questão. */
export async function submitAnswer(payload: SubmitAnswerIn) {
  try {
    const { data } = await api.post<SubmitAnswerOut>(`/api/questions/submit-answer`, payload);
    return data;
  } catch (err: any) {
    const e = new Error(extractMsg(err, "Falha ao enviar resposta."));
    (e as any).status = err?.response?.status;
    throw e;
  }
}

/** Consulta o progresso atual da fase (quantas faltam etc). */
export async function getPhaseProgress(phaseId: string) {
  try {
    const { data } = await api.get<ProgressDTO>(`/api/progress/${phaseId}`);
    return data;
  } catch (err: any) {
    const e = new Error(extractMsg(err, "Falha ao carregar progresso."));
    (e as any).status = err?.response?.status;
    throw e;
  }
}

/** Reseta o progresso do jogador para uma fase específica. */
export async function resetPhaseProgress(phaseId: string) {
  try {
    const { data } = await api.delete<{ id: string; response: string }>(
      `/api/progress/reset/${phaseId}`
    );
    return data;
  } catch (err: any) {
    const e = new Error(extractMsg(err, "Falha ao resetar o progresso da fase."));
    (e as any).status = err?.response?.status;
    throw e;
  }
}
