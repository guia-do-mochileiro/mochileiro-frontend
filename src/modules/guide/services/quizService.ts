import { api } from "#/config/apiConfig";


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
  id: string;           
  name: string;         
  orderIndex?: number;  
  questions: QuestionDTO[];
};

export type SubmitAnswerIn = {
  questionId: string;
  selectedAlternativeId: string;
};

export type SubmitAnswerOut = {
  questionId: string;
  correctAlternativeId: string;
  unlockedAchievements: string[]; 
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


function extractMsg(err: any, fallback: string) {
  return (
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    fallback
  );
}




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
