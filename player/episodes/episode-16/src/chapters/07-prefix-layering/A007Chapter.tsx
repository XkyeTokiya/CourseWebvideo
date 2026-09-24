import "./A007Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

/** step（0 基）→ handoff steps[].scene_state 的 semantic state（末位兜底） */
const stateByStep = [
  "extension-established",
  "example-extended",
  "levels-annotated",
  "boundary-framed",
] as const;

type A007State = (typeof stateByStep)[number];

/** 方向箭头：R007 向右扩展由同一行内分段排布承载 */
function ArrowGlyph() {
  return (
    <svg className="pl-arrow" viewBox="0 0 44 24" aria-hidden="true">
      <path
        d="M2 12h34M27 4l10 8-10 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function A007Chapter({ step }: ChapterStepProps) {
  const state: A007State = stateByStep[step] ?? stateByStep.at(-1)!;

  return (
    <div className="scene-pad pl-root" data-state={state}>
      <header className="pl-header">
        <span className="pl-header-mark" aria-hidden="true" />
        <h1 className="pl-headline">前缀怎样逐级扩展</h1>
      </header>

      <div className="pl-board">
        {/* 方向轨：从一级前缀开始向右依次扩展 */}
        <div className="pl-direction">
          <span className="pl-direction-label">向右依次扩展</span>
          <span className="pl-direction-rail" aria-hidden="true" />
          <span className="pl-direction-arrow" aria-hidden="true">
            <ArrowGlyph />
          </span>
        </div>

        {/* 分段带：同一行内自左向右 86 → 86.100 → 86.100.12 */}
        <div className="pl-band">
          <div className="pl-seg pl-seg--base">
            <span className="pl-origin">一级前缀</span>
            <span className="pl-ghost" aria-hidden="true" />
            <span className="pl-num hero-num">86</span>
          </div>
          <span className="pl-dot" aria-hidden="true" />
          <div className="pl-seg pl-seg--ext1">
            <span className="pl-ghost" aria-hidden="true" />
            <span className="pl-num hero-num">100</span>
          </div>
          <span className="pl-dot" aria-hidden="true" />
          <div className="pl-seg pl-seg--ext2">
            <span className="pl-ghost" aria-hidden="true" />
            <span className="pl-num hero-num">12</span>
          </div>
        </div>

        <p className="pl-fineer">每向右多一段，管理的位置就更细一层</p>

        {/* 旁注区：逐段层级说明 */}
        <div className="pl-notes">
          <div className="pl-note pl-note--1">
            <span className="pl-tick" aria-hidden="true" />
            <span className="pl-name">国家</span>
          </div>
          <div className="pl-note pl-note--2">
            <span className="pl-tick" aria-hidden="true" />
            <span className="pl-name">行业</span>
          </div>
          <div className="pl-note pl-note--3">
            <span className="pl-tick" aria-hidden="true" />
            <span className="pl-name">企业</span>
          </div>
        </div>
      </div>

      {/* 边界 + takeaway：三段只说明逐层细化，不固定层数与段长 */}
      <div className="pl-close">
        <span className="pl-close-ghost">边界与收束</span>
        <span className="pl-bracket" aria-hidden="true" />
        <p className="pl-boundary-note">这三段示例，只说明分级会逐层细化</p>
        <p className="pl-takeaway">
          <span className="pl-em">不固定</span>三层，也
          <span className="pl-em">不固定</span>每段长度
        </p>
      </div>
    </div>
  );
}
