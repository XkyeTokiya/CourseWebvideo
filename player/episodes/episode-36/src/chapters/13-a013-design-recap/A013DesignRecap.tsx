import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A013DesignRecap.css";

const STATES = [
  "recap-opened",
  "anchor-pair-set",
  "groups-complete",
  "recap-judged",
  "size-deferred",
  "item-by-item",
] as const;

const PASS_ITEMS = ["版面", "材质", "位置", "信息主次"] as const;

export default function A013DesignRecap({ step }: ChapterStepProps) {
  const state = STATES[step] ?? STATES[STATES.length - 1];
  const pairIn = state !== "recap-opened";
  const groupsIn =
    state === "groups-complete" ||
    state === "recap-judged" ||
    state === "size-deferred" ||
    state === "item-by-item";
  const judged =
    state === "recap-judged" || state === "size-deferred" || state === "item-by-item";
  const deferred = state === "size-deferred" || state === "item-by-item";
  const passIn = state === "item-by-item";

  return (
    <div className="a13-root scene-pad">
      <header className={`a13-head${judged ? " is-focal" : ""}`}>
        <h1 className="a13-title">关系都理清了，设计才算做完</h1>
      </header>

      <div className="a13-body">
        <section className="a13-anchor card">
          <svg className="a13-scene" viewBox="0 0 520 300" aria-hidden>
            <rect className="a13-part" x="40" y="40" width="440" height="220" rx="20" />
            <rect className="a13-slice" x="300" y="92" width="128" height="96" rx="12" />
            <rect className="a13-mini" x="322" y="112" width="84" height="56" rx="8" />
          </svg>
          <div className={`a13-pair${pairIn ? " is-in" : ""}`}>
            <p className="a13-pair-row">
              <span className="a13-pair-name">载体</span>把信息装住
            </p>
            <p className="a13-pair-row">
              <span className="a13-pair-name">附着物</span>划出边界
            </p>
          </div>
        </section>

        <div className="a13-groups">
          <article className={`a13-group card${groupsIn ? " is-in" : ""}`}>
            <p className="a13-group-kicker">材质和位置</p>
            <p className="a13-group-line">决定它能不能稳稳待着。</p>
          </article>
          <article className={`a13-group card${groupsIn ? " is-in is-late" : ""}`}>
            <p className="a13-group-kicker">功能和美观</p>
            <p className="a13-group-line">决定它能不能被看见、被接受。</p>
          </article>
        </div>
      </div>

      <aside className={`a13-boundary${deferred ? " is-in" : ""}`}>
        <p className="a13-defer">别急着定下一个固定尺寸——先把附着物说清楚，把使用目的说清楚。</p>
        <div className={`a13-pass${passIn ? " is-in" : ""}`}>
          <p className="a13-pass-lead">再用</p>
          <div className="a13-pass-strip">
            {PASS_ITEMS.map((p, i) => (
              <span
                key={p}
                className="a13-pass-item"
                style={{ "--a13-i": String(i) } as CSSProperties}
              >
                {p}
              </span>
            ))}
          </div>
          <p className="a13-pass-lead">一项一项过。</p>
        </div>
      </aside>
    </div>
  );
}
