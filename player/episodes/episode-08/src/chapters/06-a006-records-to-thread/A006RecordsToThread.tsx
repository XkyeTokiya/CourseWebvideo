import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A006RecordsToThread.css";

const states = [
  "thread-formed",
  "four-records-detailed",
  "query-result-reached",
] as const;

type RtState = (typeof states)[number];

const RECORDS = [
  { term: "设计要求", desc: "说明对象按什么要求形成" },
  { term: "生产与质检记录", desc: "说明它怎样被制造、被确认" },
  { term: "仓储配送记录", desc: "说明它怎样流转" },
  { term: "售后记录", desc: "说明交付后的状态和服务历史" },
];

export default function A006RecordsToThread({ step }: ChapterStepProps) {
  const state: RtState = states[step] ?? states[states.length - 1];
  const detailed = state !== "thread-formed";
  const reached = state === "query-result-reached";

  return (
    <div className={`rt-scene scene-pad${reached ? " is-reached" : ""}`}>
      <h1 className="rt-title">分段记录连成线索</h1>

      <div className="rt-thread">
        {RECORDS.map((record, i) => (
          <div
            key={record.term}
            className="rt-row"
            style={{ "--rt-i": String(i) } as CSSProperties}
          >
            <span className="rt-node" aria-hidden />
            <div className="rt-row-body">
              <p className={`rt-term${detailed ? " is-on" : ""}`}>
                {record.term}
              </p>
              <p className={`rt-desc${detailed ? " is-on" : ""}`}>
                {record.desc}
              </p>
            </div>
          </div>
        ))}

        <div
          className={`rt-result${reached ? " is-on" : ""}`}
          aria-hidden={!reached}
        >
          <span className="rt-node rt-node-result" aria-hidden />
          <div className="rt-result-body">
            <p className="rt-result-lead">
              遇到业务问题时，沿着<b>对象身份</b>找到可提供的记录或入口
            </p>
            <p className="rt-result-note">
              不必把每个环节<b>重新人工核对一遍</b>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
