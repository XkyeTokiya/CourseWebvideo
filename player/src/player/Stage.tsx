import type { CSSProperties, ReactNode } from "react";
import { useStageScale } from "./useStageScale";

export function Stage({ children, onAdvance }: { children: ReactNode; onAdvance(): void }) {
  const scale = useStageScale();
  const fitter: CSSProperties = { width: 1920 * scale, height: 1080 * scale };
  return (
    <div className="player-shell">
      <div className="stage-fitter" style={fitter}>
        <div
          className="stage-frame"
          style={{ transform: `scale(${scale})` }}
          onClick={(event) => {
            const target = event.target as HTMLElement;
            if (!target.closest("button, a, input, [data-no-advance]")) onAdvance();
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
