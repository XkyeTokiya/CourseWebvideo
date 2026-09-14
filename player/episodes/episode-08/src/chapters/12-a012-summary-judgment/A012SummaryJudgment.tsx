import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A012SummaryJudgment.css";

const states = [
  "division-recapped",
  "common-rule-formed",
  "final-judgment-fixed",
] as const;

type SjState = (typeof states)[number];

const DIVISION = [
  { role: "标识", text: "让设备和它的数字资料有稳定的指向" },
  { role: "解析", text: "让不同系统、环节和主体围绕这个指向，找到记录或入口" },
  { role: "业务应用", text: "再拿这些信息支持检修、维护和协作" },
];

const RULES = [
  "先有可指向的身份",
  "才有可关联的记录",
  "记录围绕身份关联后，跨主体的查询和共享才有落脚点",
];

export default function A012SummaryJudgment({ step }: ChapterStepProps) {
  const state: SjState = states[step] ?? states[states.length - 1];
  const ruleOn = state !== "division-recapped";
  const judgmentOn = state === "final-judgment-fixed";

  return (
    <div className="sj-scene scene-pad">
      <h1 className="sj-title">先有身份，才有可协作的信息关系</h1>

      <div className="sj-groups">
        <section className="sj-group">
          <p className="sj-group-kicker">回到那台泵 · 三分工</p>
          <div className="sj-rows">
            {DIVISION.map((item, i) => (
              <div key={item.role} className="sj-row card">
                <span className="sj-row-no hero-num">{`0${i + 1}`}</span>
                <p>
                  <b>{item.role}</b>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section
          className={`sj-group sj-group-rule${ruleOn ? " is-on" : ""}`}
          aria-hidden={!ruleOn}
        >
          <p className="sj-group-kicker">共同规律</p>
          <div className="sj-rows">
            {RULES.map((text, i) => (
              <div key={text} className="sj-row sj-row-rule">
                <i aria-hidden />
                <p>{text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer className="sj-takeaway">
        <p
          className={`sj-takeaway-line${judgmentOn ? " is-on" : ""}`}
          aria-hidden={!judgmentOn}
        >
          分散的数据才有可能变成<b>可以协作的信息关系</b>——标识解析在
          <b>对象、环节和产业链</b>之间起到<b>贯通作用</b>。
        </p>
      </footer>
    </div>
  );
}
