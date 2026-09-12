import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A008RoundRectLayouts.css";

const STATES = [
  "example-placed",
  "dual-purpose-noted",
  "variety-acknowledged",
  "example-bounded",
] as const;

export default function A008RoundRectLayouts({ step }: ChapterStepProps) {
  const state = STATES[step] ?? STATES[STATES.length - 1];
  const dualIn = state !== "example-placed";
  const focus = state === "variety-acknowledged" || state === "example-bounded";
  const bounded = state === "example-bounded";

  return (
    <div className="a8-root scene-pad">
      <header className={`a8-head${focus ? " is-focal" : ""}`}>
        <h1 className="a8-title">同一类设计任务，可以有不同的版面</h1>
      </header>

      <div className="a8-body">
        <figure className="a8-image card">
          <svg className="a8-zones" viewBox="0 0 720 400" aria-hidden>
            <rect className="a8-frame" x="40" y="34" width="640" height="332" rx="16" />
            <line className="a8-divider" x1="360" y1="60" x2="360" y2="340" />
            <g className="a8-zone a8-zone-circle">
              <circle className="a8-circle" cx="200" cy="176" r="92" />
              <circle className="a8-circle-inner" cx="200" cy="176" r="54" />
              <rect className="a8-circle-core" x="172" y="152" width="56" height="20" rx="6" />
              <rect className="a8-circle-core" x="166" y="182" width="68" height="12" rx="6" />
            </g>
            <g className="a8-zone a8-zone-rect">
              <rect className="a8-rectbody" x="420" y="102" width="200" height="148" rx="14" />
              <rect className="a8-rect-hero" x="444" y="126" width="152" height="42" rx="8" />
              <rect className="a8-rect-sub" x="444" y="182" width="104" height="16" rx="8" />
              <rect className="a8-rect-sub" x="444" y="208" width="76" height="16" rx="8" />
            </g>
          </svg>
          <figcaption className="a8-ph">M004 · 教材图 4-7 原图（待补入）</figcaption>
        </figure>

        <div className="a8-rail">
          <article className="a8-item card">
            <p className="a8-item-kicker">例子来源</p>
            <p className="a8-item-line">教材图 4-7 是汽车行业的标识载体设计示例</p>
          </article>

          <article className="a8-item card">
            <p className="a8-item-kicker">两种版式</p>
            <p className="a8-item-line">左边用的是圆形版式，右边用的是长方形版式</p>
          </article>

          <article className={`a8-item card${dualIn ? " is-in" : ""}`}>
            <p className="a8-item-kicker">共同点</p>
            <p className="a8-item-line">两种版式，都同时考虑了营销和防伪。</p>
          </article>

          <article className={`a8-item a8-bound card${bounded ? " is-in" : ""}`}>
            <p className="a8-bound-line">
              不是圆形比长方形好——也不是能直接搬到所有产品上的尺寸答案。
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}
