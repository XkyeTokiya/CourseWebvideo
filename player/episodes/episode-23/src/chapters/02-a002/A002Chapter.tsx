import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A002Chapter.css";

const stateByStep = [
  "definition-anchored",
  "transfer-insufficient",
  "boundaries-clarified",
] as const;

const ELEMENTS = [
  { no: "01", text: "多个参与方，同一企业或不同企业" },
  { no: "02", text: "主体之间有规则或协议" },
  { no: "03", text: "数据能被共同利用" },
] as const;

export default function A002Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const transferOn = state !== "definition-anchored";
  const thesisOn = state === "boundaries-clarified";

  return (
    <div className="sh-scene scene-pad">
      <header className="sh-head">
        <h1 className="sh-headline">什么是数据共享</h1>
        <div className="sh-head-rule" />
      </header>

      <div className="sh-main">
        <section className="sh-def card" aria-label="共享定义与三要素">
          <p className="sh-def-quote">
            共享是不同主体基于一定规则或协议，让数据互通有无、共同利用的过程
          </p>
          <div className="sh-def-split" />
          <ul className="sh-els">
            {ELEMENTS.map((el, i) => (
              <li
                key={el.no}
                className="sh-el"
                style={{ "--sh-i": i } as CSSProperties}
              >
                <span className="sh-el-no">{el.no}</span>
                <span className="sh-el-text">{el.text}</span>
              </li>
            ))}
          </ul>
          <p className="sh-def-tail">规则和共同利用，缺一不可</p>
        </section>

        <section
          className={`sh-side card${transferOn ? " is-on" : ""}`}
          aria-hidden={!transferOn}
          aria-label="传输不等于共享"
        >
          <div className="sh-xfer">
            <span className="sh-node">设备记录</span>
            <svg className="sh-arrow" viewBox="0 0 140 18" aria-hidden="true">
              <line x1="4" y1="9" x2="108" y2="9" />
              <path d="M106 3 L124 9 L106 15 Z" />
            </svg>
            <span className="sh-node">质检</span>
          </div>
          <p className="sh-xfer-cap">文件发出去，只说明传输发生了</p>
          <div className="sh-judge">
            <p className="sh-judge-item">对方能不能看懂？</p>
            <p className="sh-judge-item">能不能按约定去用？</p>
          </div>
          <p className="sh-verdict">才决定共享是否成立</p>
        </section>
      </div>

      <aside
        className={`sh-thesis card${thesisOn ? " is-on" : ""}`}
        aria-hidden={!thesisOn}
      >
        <svg className="sh-ban" viewBox="0 0 40 40" aria-hidden="true">
          <circle cx="20" cy="20" r="15" />
          <line x1="9.5" y1="30.5" x2="30.5" y2="9.5" />
        </svg>
        <p className="sh-thesis-text">
          共享不是
          <span className="sh-deny" style={{ "--sh-j": 0 } as CSSProperties}>
            无条件开放
          </span>
          ，不是
          <span className="sh-deny" style={{ "--sh-j": 1 } as CSSProperties}>
            集中存储
          </span>
          ，更不是
          <span className="sh-deny" style={{ "--sh-j": 2 } as CSSProperties}>
            谁来了都能随手取用
          </span>
        </p>
      </aside>
    </div>
  );
}
