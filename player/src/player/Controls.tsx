import type { PlaybackMode } from "../runtime/types";

const labels: Record<PlaybackMode, string> = { manual: "手动", audio: "音频", auto: "自动" };

export function Controls({ mode, onCycle, autoStarted, onStart }: { mode: PlaybackMode; onCycle(): void; autoStarted: boolean; onStart(): void }) {
  return (
    <div className="player-controls" data-no-advance>
      {mode === "auto" && !autoStarted && <button onClick={onStart}>开始自动播放</button>}
      <button onClick={onCycle} aria-label="切换播放模式">模式：{labels[mode]}</button>
    </div>
  );
}
