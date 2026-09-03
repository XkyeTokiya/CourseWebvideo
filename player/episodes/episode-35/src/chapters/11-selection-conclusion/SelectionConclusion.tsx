import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./SelectionConclusion.css";

const states = ["opening-recalled", "outcomes-compared", "judgment-pivoted"] as const;

const OUTCOMES = [
  {
    key: "smooth",
    tag: "结局 · 一",
    cond: "表面平整 · 环境简单",
    result: "低成本一次性方案可能就够用",
    tone: "process",
  },
  {
    key: "unstable",
    tag: "结局 · 二",
    cond: "曲面 · 反光 · 污染 · 工艺变化",
    result: "识读不稳时，回头重选载体 · 换打印方式 · 检查设备匹不匹配",
    tone: "warning",
  },
] as const;

const JUDGMENTS = [
  "先看对象，再看工艺",
  "先看现场风险，再看成本",
  "收口靠真实过程里的识读验证，不靠静态外观拍板",
] as const;

const QUESTIONS = [
  { label: "为什么选它", tone: "structural", tilt: "-2deg" },
  { label: "会在哪里失效", tone: "warning", tilt: "1.6deg" },
  { label: "怎样证明仍可用", tone: "process", tilt: "-1.2deg" },
] as const;

function KeepCheck() {
  return (
    <span className="sc-keep-check" aria-hidden>
      <svg viewBox="0 0 24 24">
        <path d="M5.5 12.5 L10 17 L18.5 7.5" pathLength={100} />
      </svg>
    </span>
  );
}

export default function SelectionConclusion({ step }: ChapterStepProps) {
  const state = states[step] ?? states[states.length - 1];
  const compared = state !== "opening-recalled";
  const pivoted = state === "judgment-pivoted";

  return (
    <div className={`sc-scene scene-pad${pivoted ? " is-pivoted" : ""}`}>
      <header className="sc-head">
        <div className="sc-head-main">
          <p className="sc-head-kicker">选型收束 · 回收与总结</p>
          <h1 className="sc-head-title">
            经<em>真实路线验证</em>的组合才保留
          </h1>
        </div>
        <p className="sc-head-note">两类结局 · 一套标准</p>
      </header>

      <div className="sc-recap">
        <span className="sc-recap-tag">回收开场</span>
        <p className="sc-recap-text">
          回到开头那个零件——不宣布唯一载体，把候选组合带到<em>工艺前后</em>去验证
        </p>
        <div className="sc-track" aria-hidden>
          <span className="sc-track-line" />
          <span className="sc-track-node">候选组合</span>
          <span className="sc-track-node">工艺前</span>
          <span className="sc-track-node">工艺后</span>
          <span className="sc-track-dot" />
        </div>
      </div>

      <div className="sc-body">
        <div className="sc-outcomes">
          {OUTCOMES.map((o, i) => (
            <article
              key={o.key}
              className={`sc-outcome card${compared ? " is-on" : ""}`}
              data-tone={o.tone}
              style={{ "--sc-i": String(i) } as CSSProperties}
            >
              {compared ? (
                <>
                  <p className="sc-outcome-tag">{o.tag}</p>
                  <p className="sc-outcome-cond">{o.cond}</p>
                  <p className="sc-outcome-result">{o.result}</p>
                </>
              ) : (
                <p className="sc-outcome-ghost">结局对照 · 待就位</p>
              )}
            </article>
          ))}
        </div>

        <div className={`sc-keep${compared ? " is-on" : ""}`}>
          <KeepCheck />
          <p className="sc-keep-text">
            留下<em>能在真实路线里一直读得出来</em>的那套组合
          </p>
        </div>

        <div className={`sc-pivot${pivoted ? " is-on" : ""}`}>
          <p className="sc-pivot-ghost">判断支点 · 待总结就位</p>
          <div className="sc-pivot-plate card-glass">
            <div className="sc-pivot-lines-wrap">
              <p className="sc-pivot-kicker">本期总结 · 判断支点</p>
              <ul className="sc-pivot-lines">
                {JUDGMENTS.map((j, i) => (
                  <li key={j} style={{ "--sc-i": String(i) } as CSSProperties}>
                    <span className="sc-pivot-idx hero-num">{`0${i + 1}`}</span>
                    <span className="sc-pivot-line">{j}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="sc-questions">
              <p className="sc-q-label">每个选择都要能回答</p>
              {QUESTIONS.map((q, i) => (
                <span
                  key={q.label}
                  className="sc-q-stamp"
                  data-tone={q.tone}
                  style={{ "--sc-i": String(i), "--sc-tilt": q.tilt } as CSSProperties}
                >
                  {q.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
