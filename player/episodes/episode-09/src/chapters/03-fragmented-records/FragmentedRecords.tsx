import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./FragmentedRecords.css";
import m002 from "./assets/m002.png";

/* A003 · S-A003 —— narration step → semantic state（3 拍各落一态，连续拍复用同一构图） */
const stateByStep = [
  "reading-order-established",
  "mismatch-noted",
  "gap-conclusion-stated",
] as const;

type FragmentedState = (typeof stateByStep)[number];

/* 阅读焦点随口播迁移：读图顺序 → 断点原因 → 业务后果 */
const focusByState: Record<FragmentedState, number> = {
  "reading-order-established": 0,
  "mismatch-noted": 1,
  "gap-conclusion-stated": 2,
};

/* 仅原图从左到右的相邻分段关系；不推定数据流，不加箭头 */
const ORDER_SEGMENTS = [
  "供应商 ERP",
  "生产企业 MES",
  "生产企业 WMS",
  "经销商 ERP",
];

export default function FragmentedRecords({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const stateIndex = stateByStep.indexOf(state);
  const shown = stateIndex + 1; /* 已就位的注数（累计保留，不消失） */
  const focus = focusByState[state];
  const final = state === "gap-conclusion-stated";

  const noteClass = (i: number) =>
    [
      "fr-note",
      "card",
      i === focus ? "is-focus" : "",
      i < shown && i !== focus ? "is-dim" : "",
    ]
      .filter(Boolean)
      .join(" ");

  const noteState = (i: number) => (i < shown ? "on" : "waiting");

  return (
    <div className="fr-scene scene-pad">
      <h1 className="fr-thesis">
        规范不一、共同线索缺失，让已有记录仍<em>难以接成追溯链</em>
      </h1>

      <div className="fr-main">
        <figure className="fr-media">
          <div className="fr-photo">
            <img src={m002} alt="M002 教材数据割裂原图占位图" />
          </div>
        </figure>

        <div className="fr-notes">
          <article
            className={noteClass(0)}
            data-state={noteState(0)}
            aria-hidden={noteState(0) === "waiting"}
          >
            <header className="fr-note-head">
              <span className="fr-note-no hero-num">01</span>
            </header>
            <div className="fr-note-body">
              <div className="fr-order">
                {ORDER_SEGMENTS.map((seg, i) => (
                  <span
                    key={seg}
                    className="fr-order-seg"
                    style={{ "--fr-i": String(i) } as CSSProperties}
                  >
                    {seg}
                  </span>
                ))}
              </div>
            </div>
          </article>

          <article
            className={noteClass(1)}
            data-state={noteState(1)}
            aria-hidden={noteState(1) === "waiting"}
          >
            <header className="fr-note-head">
              <span className="fr-note-no hero-num">02</span>
              <span className="fr-note-kind">断点原因</span>
            </header>
            <div className="fr-note-body">
              <p className="fr-note-text">
                不同企业和系统使用的<em>协议、数据规范并不一致</em>
                ，同一对象的记录难以直接对上。
              </p>
            </div>
          </article>

          <article
            className={noteClass(2)}
            data-state={noteState(2)}
            aria-hidden={noteState(2) === "waiting"}
          >
            <header className="fr-note-head">
              <span className="fr-note-no hero-num">03</span>
              <span className="fr-note-kind">业务后果</span>
            </header>
            <div className="fr-note-body">
              <p className="fr-note-text">
                跨部门、跨企业反复确认，查询反馈链条被拉长；
                <em>数据越积越多，问题反而越难定位</em>。
              </p>
            </div>
          </article>
        </div>
      </div>

      <div className="fr-takeaway" aria-hidden={!final}>
        <div className={`fr-takeaway-plate card-glass${final ? " is-on" : ""}`}>
          <span className="fr-takeaway-mark" aria-hidden="true" />
          <p className="fr-takeaway-text">
            记录都在，记录之间的<em>共同线索还没有建立</em>。
          </p>
        </div>
      </div>
    </div>
  );
}
