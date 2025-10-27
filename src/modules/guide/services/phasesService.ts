
import { api } from "#/config/apiConfig";

export type QuizAlternative = {
  id: string;
  optionText: string;
  correct: boolean;
};

export type QuizQuestion = {
  id: string;
  questionText: string;
  questionType: string; 
  bnccCode?: string;
  alternatives: QuizAlternative[];
};

export type PhaseQuiz = {
  id: string;
  name: string;
  orderIndex: number;
  questions: QuizQuestion[];
};

function extractMsg(err: any) {
  return (
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    "Falha ao carregar quiz da missão."
  );
}

export async function getQuizByPhase(phaseId: string) {
  try {
    const { data } = await api.get<PhaseQuiz>(
      `/api/phases/list-quizzes/${phaseId}`
    );
    return data;
  } catch (err: any) {
    const e = new Error(extractMsg(err));
    (e as any).status = err?.response?.status;
    throw e;
  }
}
