import { useMemo } from "react";
import { resolveEpisodeAudioUrl } from "../runtime/audio";
import { getThemeTokens } from "../runtime/theme";
import type { ChapterDef } from "../shared/presentation-runtime/registry/types";
import { Stage } from "../shared/presentation-runtime/components/Stage";
import { useCaptureAudio } from "./useCaptureAudio";
import { useCaptureTimeline } from "./useCaptureTimeline";
import { useObsCaptureSignals } from "./useObsCaptureSignals";
import "../shared/presentation-runtime/styles/fonts.css";
import "../shared/presentation-runtime/styles/animations.css";
import "./obs-capture.css";

function estimateMs(text: string): number {
  return Math.max(1500, text.length * 250);
}

interface Props {
  chapters: ChapterDef[];
  episodeId: string;
  themeId: string;
}

export function ObsCaptureApp({ chapters, episodeId, themeId }: Props) {
  const timeline = useCaptureTimeline(chapters);
  const chapter = chapters[timeline.cursor.chapter]!;
  const text = chapter.narrations[timeline.cursor.step] ?? "";
  const audioSrc = text
    ? resolveEpisodeAudioUrl(episodeId, chapter.id, timeline.cursor.step + 1)
      ?? `/episodes/${episodeId}/media/audio/${chapter.id}/${timeline.cursor.step + 1}.mp3`
    : null;
  const themeTokens = useMemo(() => getThemeTokens(themeId), [themeId]);
  const Component = chapter.Component;
  const fallbackMs = chapter.stepDurationsMs?.[timeline.cursor.step] ?? estimateMs(text);
  const signalOptions = useMemo(() => ({
    episodeId,
    cursor: timeline.cursor,
    range: { start: timeline.start, end: timeline.end },
    status: timeline.status,
  }), [episodeId, timeline.cursor, timeline.end, timeline.start, timeline.status]);

  useCaptureAudio({
    src: audioSrc,
    fallbackMs,
    active: timeline.status === "playing",
    onEnded: timeline.advance,
  });
  useObsCaptureSignals(signalOptions);

  return (
    <>
      <style data-presentation-theme={themeId}>{themeTokens}</style>
      <Stage variant="capture">
        <div className="scene" data-obs-canvas data-episode={episodeId} data-chapter={chapter.id} data-step={timeline.cursor.step}>
          <Component step={timeline.cursor.step} />
        </div>
      </Stage>
    </>
  );
}
