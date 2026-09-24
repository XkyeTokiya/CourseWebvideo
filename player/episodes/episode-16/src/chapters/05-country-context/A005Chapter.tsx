import "./A005Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

/**
 * A005 · 国家语境 —— layered-bands-with-side-notes
 * 两级职责条纵向排布作锚点（R004 委托分配由纵向排布承载），
 * 旁注补充分配语境，示例前缀 86 作为落点收束。
 * step（0 基）→ semantic state（handoff steps[].scene_state，1 基）。
 */
const stateByStep = [
  "national-band-established",
  "example-86-anchored",
] as const;

type A005State = (typeof stateByStep)[number];

export default function A005Chapter({ step }: ChapterStepProps) {
  const state: A005State = stateByStep[step] ?? stateByStep.at(-1)!;

  return (
    <div className="scene-pad nc-root" data-state={state}>
      <header className="nc-header">
        <span className="nc-header-mark" aria-hidden="true" />
        <h1 className="nc-headline">国家级一级前缀</h1>
        <span className="nc-header-sub">具体到国家一级</span>
      </header>

      <div className="nc-main">
        <div className="nc-bands">
          <div className="nc-band nc-band-a">
            <span className="nc-band-tier">一级前缀层</span>
            <div className="nc-band-body">
              <p className="nc-band-name">国家级一级前缀</p>
              <p className="nc-band-note">对应到某个国家</p>
            </div>
            <svg className="nc-pin" viewBox="0 0 40 48" aria-hidden="true">
              <path
                d="M20 4C11.7 4 5 10.6 5 18.9 5 29.6 20 44 20 44s15-14.4 15-25.1C35 10.6 28.3 4 20 4z"
                fill="none"
                stroke="currentColor"
                strokeWidth="3.2"
              />
              <circle
                cx="20"
                cy="18.5"
                r="5.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
            </svg>
          </div>

          <div className="nc-delegate" aria-hidden="true">
            <span className="nc-delegate-line" />
            <span className="nc-delegate-head" />
          </div>

          <div className="nc-band nc-band-b">
            <span className="nc-band-tier">国家管理层</span>
            <div className="nc-band-body">
              <p className="nc-band-name">该国的管理机构</p>
              <p className="nc-band-note">接着往下分配</p>
            </div>
            <span className="nc-band-instance">示例 · 中国 MPA</span>
          </div>

          <div className="nc-continue" aria-hidden="true">
            <span className="nc-continue-chevron" />
            <span className="nc-continue-chevron" />
            <span className="nc-continue-chevron" />
          </div>
        </div>

        <aside className="nc-side">
          <section className="nc-note">
            <p className="nc-note-kicker">旁注 · 分配语境</p>
            <p className="nc-note-line">有些一级前缀，可对应到某个国家</p>
            <p className="nc-note-line">由该国的管理机构继续往下分配</p>
          </section>

          <section className="nc-anchor">
            <p className="nc-anchor-kicker">示例前缀</p>
            <span className="nc-anchor-num hero-num">86</span>
            <p className="nc-anchor-line">属于国家级的一级前缀</p>
          </section>
        </aside>
      </div>

      <div className="nc-bottom">
        <div className="nc-boundary">
          <span className="nc-boundary-kicker">管理落点</span>
          <p className="nc-boundary-line">中国 MPA 负责管理 86</p>
        </div>
        <span className="nc-bottom-sep" aria-hidden="true" />
        <div className="nc-takeaway">
          <svg className="nc-continue-glyph" viewBox="0 0 28 36" aria-hidden="true">
            <path
              d="M5 6l9 9 9-9M5 19l9 9 9-9"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="nc-takeaway-line">相关的子前缀，从这里继续往下分</p>
        </div>
      </div>
    </div>
  );
}
