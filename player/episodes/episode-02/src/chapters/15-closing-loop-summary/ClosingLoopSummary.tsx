import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./ClosingLoopSummary.css";

const stateByStep = [
  "connect-aggregate-recalled",
  "drive-secure-recalled",
  "two-flows-met",
] as const;

type State = (typeof stateByStep)[number];

const RAIL = [
  {
    name: "网络连接｜平台汇聚",
    desc: "信息能够传递，资源与能力进入共同环境。",
  },
  {
    name: "数据驱动｜安全保障",
    desc: "生产状态能够被理解，信息与行动能够可信运行。",
  },
  {
    name: "双向流相接",
    desc: "上行信息遇到下行决策，现场变化再形成持续优化所需的新信息。",
  },
] as const;

export default function ClosingLoopSummaryChapter({ step }: ChapterStepProps) {
  /* K-A015-01 accent：全集最终结论，独立全屏强调 */
  if (step >= 3) {
    return (
      <div className="cs-accent scene-pad">
        <span className="cs-accent-kicker">全集结论</span>
        <p className="cs-accent-line">
          这就是<em>网络、平台、数据与安全</em>共同作用的意义。
        </p>
      </div>
    );
  }

  const state: State = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const idx = stateByStep.indexOf(state);

  return (
    <div className="cs-scene scene-pad">
      <header className="cs-title">
        <span className="cs-title-mark" />
        <h1 className="cs-title-text">
          当信息上行、决策下行、结果再反馈，开篇产线才<em>从联网走向闭环</em>
        </h1>
      </header>

      <div className="cs-main">
        <div className="cs-rail">
          {RAIL.map((r, i) => {
            const on = idx >= i;
            const endpoint = i === 2;
            return (
              <article
                key={r.name}
                className={`cs-item${on ? " is-on" : " is-ghost"}${
                  endpoint && on ? " is-endpoint" : ""
                }`}
                style={{ "--cs-i": i } as CSSProperties}
              >
                <span className="cs-slot">回顾 · {i + 1}</span>
                <div className="cs-item-body">
                  <span className="cs-item-mark" />
                  <div className="cs-item-text">
                    <span className="cs-item-name">{r.name}</span>
                    <p className="cs-item-desc">{r.desc}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <figure className="card cs-media">
          <div className="cs-canvas" aria-hidden="true">
            <span className="cs-lane-label cs-lane-up">信息上行</span>
            <span className="cs-lane-label cs-lane-down">决策下行</span>
            <span className="cs-dot cs-dot-up" style={{ "--cs-d": 0 } as CSSProperties} />
            <span className="cs-dot cs-dot-up" style={{ "--cs-d": 1 } as CSSProperties} />
            <span className="cs-dot cs-dot-down" style={{ "--cs-d": 0 } as CSSProperties} />
            <span className="cs-dot cs-dot-down" style={{ "--cs-d": 1 } as CSSProperties} />
            <div className="cs-floor">
              <span className="cs-machine" />
              <span className="cs-machine" />
              <span className="cs-machine" />
            </div>
          </div>
          <figcaption className="cs-cap">
            <span className="cs-cap-mark">image · 16:9</span>
            <span className="cs-cap-desc">判断与行动回到现场 · M005（素材待提供）</span>
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
