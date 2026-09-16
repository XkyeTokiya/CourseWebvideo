import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A002LinkageBoundary.css";

const states = [
  "premises-established",
  "linkage-goal",
  "misconceptions-ruled-out",
  "thesis-fixed",
] as const;

type LbState = (typeof states)[number];

export default function A002LinkageBoundary({ step }: ChapterStepProps) {
  const state: LbState = states[step] ?? states[states.length - 1];
  const goalOn = state !== "premises-established";
  const meaningFull = state === "misconceptions-ruled-out" || state === "thesis-fixed";
  const misOn = meaningFull;
  const thesisOn = state === "thesis-fixed";

  return (
    <div className={`lb-scene scene-pad${thesisOn ? " is-thesis" : ""}`}>
      <h1 className="lb-title">贯通不是合库，也不是全开放</h1>

      <div className="lb-main">
        <section className="lb-left">
          <p className="lb-col-kicker">两个前提已经具备</p>
          <div className="lb-premises">
            <p className="lb-premise lb-premise-1">
              <b>标识</b>回答“查的是谁”
            </p>
            <p className="lb-premise lb-premise-2">
              <b>解析</b>回答“到哪里查、能够得到什么”
            </p>
          </div>

          <div
            className={`lb-meaning${goalOn ? " is-goal" : ""}${meaningFull ? " is-full" : ""}`}
            aria-hidden={!goalOn}
          >
            <p className="lb-meaning-lead">贯通</p>
            <p className="lb-meaning-line">
              分散的系统和主体围绕<b>同一个对象身份</b>
            </p>
            <p className="lb-meaning-line lb-meaning-second">
              寻找彼此能够提供的<b>信息或访问入口</b>
            </p>
          </div>
        </section>

        <section className={`lb-right${misOn ? " is-on" : ""}`}>
          <p className="lb-col-kicker" aria-hidden={!misOn}>
            两种误解
          </p>
          <article className="lb-mis card lb-mis-1" aria-hidden={!misOn}>
            <p className="lb-mis-text">
              不是把所有企业的数据<em>搬进同一个数据库</em>
            </p>
            <span className="lb-mis-verdict">误解 · 排除</span>
          </article>
          <article className="lb-mis card lb-mis-2" aria-hidden={!misOn}>
            <p className="lb-mis-text">
              不是让任何人都能扫码<em>看到全部信息</em>
            </p>
            <span className="lb-mis-verdict">误解 · 排除</span>
          </article>
        </section>
      </div>

      <footer className="lb-thesis">
        <p
          className={`lb-thesis-line${thesisOn ? " is-on" : ""}`}
          aria-hidden={!thesisOn}
        >
          有了可以关联、可以查询的关系，<em>协作才有共同的起点</em>。
        </p>
      </footer>
    </div>
  );
}
