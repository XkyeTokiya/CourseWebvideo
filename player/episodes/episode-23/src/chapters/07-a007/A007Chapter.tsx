import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A007Chapter.css";

const stateByStep = ["three-questions-open", "mutual-necessity"] as const;

const QUESTIONS = [
  "双方说的，还是同一个对象吗？",
  "数据的格式和含义，能不能被共同理解？",
  "谁能用、在什么条件下用、怎样使用？",
] as const;

export default function A007Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const settled = state === "mutual-necessity";

  return (
    <div className="tq-scene scene-pad">
      <header className="tq-head">
        <h1 className="tq-headline">每跨一层，重新对齐三组问题</h1>
        <div className="tq-head-rule" />
      </header>

      <div className="tq-main">
        <section className="tq-cause card" aria-label="起因">
          <p className="tq-cause-main">
            范围每扩大一层 —— 参与主体越多、语义差异越大、管理边界越多
          </p>
          <p className="tq-cause-sub">先对齐差异，数据才谈得上流过去。</p>
        </section>

        <div className="tq-questions">
          {QUESTIONS.map((q, i) => (
            <section
              key={q}
              className="tq-q card"
              style={{ "--tq-i": i } as CSSProperties}
            >
              <span className="tq-q-mark" aria-hidden="true">
                ?
              </span>
              <p className="tq-q-text">{q}</p>
            </section>
          ))}
        </div>

        <aside
          className={`tq-takeaway card${settled ? " is-on" : ""}`}
          aria-hidden={!settled}
        >
          <div className="tq-gaps">
            <p className="tq-gap">
              <span className="tq-half" aria-hidden="true">
                <i />
                <i />
              </span>
              只对齐对象 —— 找得到，却读不懂
            </p>
            <p className="tq-gap">
              <span className="tq-half" aria-hidden="true">
                <i />
                <i />
              </span>
              只对齐对象和语义 —— 漏掉权属、安全与使用边界
            </p>
          </div>
          <p className="tq-verdict">网络连通只是前提，不等于共享成立</p>
        </aside>
      </div>
    </div>
  );
}
