import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./TransformationBoundary.css";

const states = [
  "redefinition-framed",
  "scope-band-added",
  "continuity-noted",
] as const;

type TransformationBoundaryState = (typeof states)[number];

const SCOPE_ITEMS = ["产品", "服务", "运营", "组织方式"];

export default function TransformationBoundary({ step }: ChapterStepProps) {
  const state = states[step] ?? states[states.length - 1];
  const band2On = state !== "redefinition-framed";
  const note1On = band2On;
  const note2On = state === "continuity-noted";

  return (
    <div className="tb-scene scene-pad">
      <h1 className="tb-head">
        转型以<em>业务价值</em>为方向，而非软件数量
      </h1>

      <div className="tb-main">
        <div className="tb-bands">
          <article className="tb-band card">
            <div className="tb-band-head">
              <span className="tb-band-idx hero-num">01</span>
              <span className="tb-band-label">定义 · 重新组合</span>
            </div>
            <div className="tb-def">
              <div className="tb-not">
                <p>不是 · 把更多软件装进企业</p>
                <p>不是 · 纸面流程原样搬上屏幕</p>
              </div>
              <div className="tb-join">
                <span className="tb-chip tb-chip-tech">数字技术</span>
                <span className="tb-plus" aria-hidden="true">
                  +
                </span>
                <span className="tb-chip tb-chip-biz">业务要素</span>
                <span className="tb-arrow" aria-hidden="true" />
                <span className="tb-merged">重新组合</span>
              </div>
            </div>
          </article>

          <article
            className="tb-band card"
            data-on={band2On ? "on" : "waiting"}
          >
            <div className="tb-band-head">
              <span className="tb-band-idx hero-num">02</span>
              <span className="tb-band-label">范围 · 改变什么</span>
            </div>
            <div className="tb-scope">
              {SCOPE_ITEMS.map((item, i) => (
                <span
                  key={item}
                  className="tb-scope-item"
                  style={{ "--tb-i": String(i) } as CSSProperties}
                >
                  <span className="tb-scope-no">{i + 1}</span>
                  {item}
                </span>
              ))}
            </div>
          </article>
        </div>

        <aside className="tb-rail">
          <p className="tb-rail-lead">侧注 · 随讲随记</p>
          <article
            className="tb-note"
            data-on={note1On ? "on" : "waiting"}
            style={{ "--tb-i": "0" } as CSSProperties}
          >
            <p className="tb-note-tag">落点</p>
            <h2>业务价值是判断落点</h2>
            <p>不数装了多少软件，看业务改变了什么</p>
          </article>
          <article
            className="tb-note"
            data-on={note2On ? "on" : "waiting"}
            style={{ "--tb-i": "1" } as CSSProperties}
          >
            <p className="tb-note-tag">持续</p>
            <p className="tb-note-line">
              业务流程、人员分工随目标和工作方式持续调整
            </p>
            <p className="tb-boundary">不会在一次上线后结束</p>
          </article>
        </aside>
      </div>
    </div>
  );
}
