import { useCallback, useMemo } from "react";

// Sons
import sfxAchievement from "#/sounds/ConquistaAdiquirida.wav";
import sfxCorrect     from "#/sounds/RespostaCerta.mp3";
import sfxWrong       from "#/sounds/RespostaErrada.ogg";
import sfxFinish      from "#/sounds/VitoriaFimFase.wav";
import sfxClick       from "#/sounds/Click1.wav";

type Options = {
  volume?: number;       // volume padrão (0..1) para todos
  enabled?: boolean;
  clickVolume?: number;  // ⬅ novo: volume só do click (0..1)
};

function makeAudio(src: string, volume: number) {
  const a = new Audio(src);
  a.preload = "auto";
  a.volume = volume;
  return a;
}

export function useSfx(opts: Options = {}) {
  const { volume = 0.7, enabled = true, clickVolume } = opts;

  const audios = useMemo(() => {
    return {
      achievement: makeAudio(sfxAchievement, volume),
      correct:     makeAudio(sfxCorrect,     volume),
      wrong:       makeAudio(sfxWrong,       volume),
      finish:      makeAudio(sfxFinish,      volume ?? Math.min(1, volume)),
      click:       makeAudio(sfxClick,       clickVolume ?? Math.min(1, volume)),
    };
  }, [volume, clickVolume]);

  const play = useCallback((a?: HTMLAudioElement) => {
    if (!enabled || !a) return;
    try { a.currentTime = 0; a.play().catch(() => {}); } catch {}
  }, [enabled]);

  return {
    playAchievement: () => play(audios.achievement),
    playCorrect:     () => play(audios.correct),
    playWrong:       () => play(audios.wrong),
    playFinish:      () => play(audios.finish),
    playClick:       () => play(audios.click),
  };
}
