import { useCallback } from "react";
import { AutoStartGate } from "./components/AutoStartGate";
import { AutoToggle } from "./components/AutoToggle";
import { ProgressBar } from "./components/ProgressBar";
import { Stage } from "./components/Stage";
import { useAudioPlayer } from "./hooks/useAudioPlayer";
import { useAutoMode } from "./hooks/useAutoMode";
import { useStepper } from "./hooks/useStepper";
import type { ChapterDef } from "./registry/types";
import { resolveEpisodeAudioUrl } from "../../runtime/audio";
import { getThemeTokens } from "../../runtime/theme";
import "./styles/fonts.css";
import "./styles/base.css";
import "./styles/animations.css";

function estimateMs(text: string): number {
  if (!text) return 1500;
  return Math.max(1500, text.length * 250);
}

export interface LegacyPresentationAppProps {
  chapters: ChapterDef[];
  episodeId: string;
  themeId: string;
  audioBaseUrl?: string;
}

/**
 * The original presentation runtime, extracted without changing its public
 * ChapterDef contract. Only the instance identity and asset root are injected
 * so several episodes can share one development server safely.
 */
export function LegacyPresentationApp({
  chapters,
  episodeId,
  themeId,
  audioBaseUrl = `${import.meta.env.BASE_URL}episodes/${episodeId}/media/audio`,
}: LegacyPresentationAppProps) {
  const themeTokens = getThemeTokens(themeId);
  const stepper = useStepper(chapters, `presentation-cursor-v8:${episodeId}`);
  const ch = chapters[stepper.cursor.chapter]!;
  const Cmp = ch.Component;
  const stepText = ch.narrations[stepper.cursor.step] ?? "";
  const { mode, cycleMode, autoStarted, setAutoStarted } = useAutoMode();
  const audioSrc =
    mode === "manual" || stepText === ""
      ? null
      : resolveEpisodeAudioUrl(episodeId, ch.id, stepper.cursor.step + 1)
        ?? `${audioBaseUrl}/${ch.id}/${stepper.cursor.step + 1}.mp3`;
  const onAutoAdvance = useCallback(() => stepper.next(), [stepper]);

  useAudioPlayer({
    src: audioSrc,
    mode,
    trailMs: 200,
    estimateFallbackMs:
      ch.stepDurationsMs?.[stepper.cursor.step] ?? estimateMs(stepText),
    onAutoAdvance,
    autoStarted,
  });

  return (
    <>
      <style data-presentation-theme={themeId}>{themeTokens}</style>
      <Stage onAdvance={stepper.next}>
        <div key={ch.id} className="scene">
          <Cmp step={stepper.cursor.step} />
        </div>
      </Stage>
      <ProgressBar
        chapters={chapters}
        cursor={stepper.cursor}
        onJumpChapter={stepper.jumpToChapter}
      />
      <AutoToggle mode={mode} onCycle={cycleMode} />
      <AutoStartGate
        visible={mode === "auto" && !autoStarted}
        onStart={() => setAutoStarted(true)}
      />
    </>
  );
}
