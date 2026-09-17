import "./A005Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

const stateByStep = [
  "four-pains-equal",
  "amplification-started",
  "amplification-complete",
] as const;

const PAINS = [
  { no: "01", text: "系统适配能力有限" },
  { no: "02", text: "跨系统协同效率不高" },
  { no: "03", text: "实施和维护成本不断增加" },
  { no: "04", text: "供应商方案与实际需求错位" },
] as const;

export default function A005Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep.at(-1)!;
  return (
    <div className="scene-pad pm-root" data-state={state}>
      <header className="pm-head">
        <span className="pm-head-mark" aria-hidden="true" />
        <h1 className="pm-headline">四类痛点相互放大</h1>
      </header>

      <div className="pm-bands">
        {PAINS.map((pain) => (
          <div className="pm-band" key={pain.no}>
            <span className="pm-band-no">{pain.no}</span>
            <p className="pm-band-text">{pain.text}</p>
          </div>
        ))}
      </div>

      <div className="pm-chain">
        <span className="pm-chain-label">
          <svg className="pm-loop-svg" viewBox="0 0 46 46" aria-hidden="true">
            <path d="M 10 23 A 13 13 0 0 1 36 23" fill="none" strokeWidth="3.5" />
            <path d="M 36 23 A 13 13 0 0 1 10 23" fill="none" strokeWidth="3.5" />
            <polygon points="30,20 42,20 36,30" />
            <polygon points="4,26 16,26 10,16" />
          </svg>
          <span className="pm-chain-name">相互放大</span>
        </span>
        <span className="pm-link pm-link-1">系统越难适配，越依赖定制开发</span>
        <span className="pm-arrow" aria-hidden="true" />
        <span className="pm-link pm-link-2">定制接口越多，维护扩展越困难</span>
      </div>
    </div>
  );
}
