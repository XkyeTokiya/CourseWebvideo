import { useCallback, useState } from "react";
import type { EpisodeDefinition } from "../runtime/types";
import { THEMES } from "../runtime/theme";
import { Controls } from "./Controls";
import { ProgressBar } from "./ProgressBar";
import { Stage } from "./Stage";
import { useAudioPlayer } from "./useAudioPlayer";
import { useAutoMode } from "./useAutoMode";
import { useStepper } from "./useStepper";

function estimateMs(text: string) { return Math.max(1500, text.length * 250); }

export function EpisodePlayer({ episode }: { episode: EpisodeDefinition }) {
  const stepper = useStepper(episode);
  const { mode, cycleMode, autoStarted, setAutoStarted } = useAutoMode();
  const [showExit, setShowExit] = useState(true);
  const chapter = episode.chapters[stepper.cursor.chapter];
  const text = chapter?.narrations[stepper.cursor.step] ?? "";
  const audioSrc = mode === "manual" || !text ? null : `/episodes/${episode.id}/media/audio/${chapter?.id}/${stepper.cursor.step + 1}.mp3`;
  const advance = useCallback(() => stepper.next(), [stepper]);
  useAudioPlayer({ src: audioSrc, mode, fallbackMs: chapter?.stepDurationsMs?.[stepper.cursor.step] ?? estimateMs(text), autoStarted, onAutoAdvance: advance });
  if (!chapter) return <div className="player-error">该实例还没有可播放章节。</div>;
  const Component = chapter.Component;
  const theme = THEMES[episode.theme as keyof typeof THEMES];

  return (
    <div className="episode-player" style={{ "--accent": theme?.accent, "--stage-bg": theme?.background, "--stage-surface": theme?.surface, "--stage-text": theme?.text, "--stage-muted": theme?.muted } as React.CSSProperties}>
      <Stage onAdvance={stepper.next}>
        <div className="episode-stage-content" data-episode={episode.id} data-theme={episode.theme}>
          <div className="stage-kicker">{episode.id} / {chapter.id}</div>
          <Component step={stepper.cursor.step} />
        </div>
      </Stage>
      {showExit && <button className="exit-player" data-no-advance onClick={() => window.history.back()}>返回 Studio</button>}
      <button className="hide-exit" data-no-advance onClick={() => setShowExit((value) => !value)} aria-label="显示或隐藏返回按钮">{showExit ? "隐藏界面" : "显示界面"}</button>
      <ProgressBar chapters={episode.chapters} cursor={stepper.cursor} onJump={stepper.jumpToChapter} />
      <Controls mode={mode} onCycle={cycleMode} autoStarted={autoStarted} onStart={() => setAutoStarted(true)} />
    </div>
  );
}
