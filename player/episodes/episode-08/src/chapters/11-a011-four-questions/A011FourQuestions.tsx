import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A011FourQuestions.css";

const CARDS = [
  {
    label: "对象",
    questions: [{ no: "01", text: "识别的是什么对象" }],
  },
  {
    label: "环节与主体",
    questions: [
      { no: "02", text: "连接了哪些环节" },
      { no: "03", text: "涉及哪些主体" },
    ],
  },
  {
    label: "信息去向",
    questions: [{ no: "04", text: "查询把信息带到了哪里" }],
  },
];

export default function A011FourQuestions(_props: ChapterStepProps) {
  return (
    <div className="fq-scene scene-pad">
      <h1 className="fq-title">看场景的四组问题</h1>

      <div className="fq-cards">
        {CARDS.map((card, ci) => (
          <article key={card.label} className="fq-card card">
            <p className="fq-card-label">{card.label}</p>
            <div className="fq-card-questions">
              {card.questions.map((q, qi) => (
                <div
                  key={q.no}
                  className="fq-question"
                  style={{ "--fq-i": String(ci * 2 + qi) } as CSSProperties}
                >
                  <span className="fq-question-no hero-num">{q.no}</span>
                  <p>{q.text}</p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
