import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./TwoPathsMeet.css";

const NOTES = [
  { no: "方向一", title: "互联网向产业延伸", desc: "从消费等场景，不断走向产业活动" },
  {
    no: "方向二",
    title: "工业走向数网智",
    desc: "从单点信息技术应用，走向数字化、网络化、智能化",
  },
] as const;

const stateByStep = [
  "direction-one-noted",
  "direction-two-noted",
  "convergence-located",
] as const;

export default function TwoPathsMeetChapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const converged = state === "convergence-located";

  return (
    <div className="tp-scene scene-pad">
      <div className="tp-body">
        <div className="tp-media">
          <span className="tp-media-mark">教材原图 · 完整呈现</span>
          <span className="tp-media-desc">图 1-1“工业互联网的产生”（原图待提供）</span>
          {converged && (
            <span className="tp-media-stamp hero-num">2012</span>
          )}
        </div>

        <div className="tp-notes">
          {NOTES.map((n, i) => {
            const appeared = i === 0 ? true : step >= 1;
            const focused =
              (i === 0 && step === 0) || (i === 1 && step >= 1);
            return (
              <div
                className={`tp-note${focused ? " is-focus" : ""}`}
                key={n.no}
                data-on={appeared}
              >
                <span className="tp-note-no">{n.no}</span>
                <span className="tp-note-title">{n.title}</span>
                <span className="tp-note-desc">{n.desc}</span>
              </div>
            );
          })}
          <div className={`tp-converge${converged ? " is-on" : ""}`}>
            <span className="tp-converge-mark" />
            两条路径在 2012 年前后相遇——比年份更重要的，是工业需求和信息技术在同一个问题上汇合。
          </div>
        </div>
      </div>
    </div>
  );
}
