import type { CSSProperties } from "react";
import "./A001Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import M001 from "./assets/M001.png";

const stateByStep = [
  "scene-opened",
  "journey-established",
  "records-scattered",
  "info-outside-code",
  "question-dominant",
  "entry-framed",
] as const;

type A001State = (typeof stateByStep)[number];

const STOPS = ["离开工厂", "运输", "装配", "维护", "回收"] as const;

/** 记录散落在各环节：位置与倾角本身表达“不集中存放” */
const RECORDS = [
  { system: "系统 ①", code: "L-2107", drop: 26, tilt: -2.5 },
  { system: "系统 ②", code: "W-8843", drop: 6, tilt: 1.8 },
  { system: "系统 ③", code: "M-5316", drop: 34, tilt: -1.2 },
  { system: "系统 ④", code: "R-6029", drop: 12, tilt: 2.4 },
] as const;

const INFO_TAGS = ["规格", "生产日期", "批次", "维修历史"] as const;

/** 电池 + 身份牌：被追问的对象是“带着身份的同一块电池” */
function BatteryTag() {
  return (
    <svg className="oq-glyph" viewBox="0 0 48 48" aria-hidden="true">
      <rect x="4" y="15" width="34" height="20" rx="3" fill="none" stroke="currentColor" strokeWidth="3.2" />
      <rect x="41" y="21" width="4" height="8" rx="1.2" fill="currentColor" />
      <circle cx="14.5" cy="25" r="3.4" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <path
        d="M21.5 21.5h11M21.5 25.5h8M21.5 29.5h11"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** 抽象身份符号：条码状竖线，不指向任何真实编码示例 */
function CodeGlyph() {
  return (
    <svg className="oq-codeglyph" viewBox="0 0 120 32" aria-hidden="true">
      <path
        d="M3 3v26M9 3v26M12 3v26M20 3v26M27 3v26M30 3v26M40 3v26M46 3v26M49 3v26M59 3v26M65 3v26M68 3v26M78 3v26M84 3v26M87 3v26M97 3v26M103 3v26M106 3v26M116 3v26"
        stroke="currentColor"
        strokeWidth="2.6"
        fill="none"
      />
    </svg>
  );
}

/** 入口：箭头进入门形，收束“理解 Handle 的入口” */
function EntryGlyph() {
  return (
    <svg className="oq-entryglyph" viewBox="0 0 64 48" aria-hidden="true">
      <path d="M42 4h16v40H42" fill="none" stroke="currentColor" strokeWidth="4" />
      <path
        d="M4 24h32M26 13l11 11-11 11"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function A001Chapter({ step }: ChapterStepProps) {
  const state: A001State = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad oq-root" data-state={state}>
      <header className="oq-header">
        <span className="oq-heading-mark" aria-hidden="true" />
        <h1 className="oq-headline">同一块电池，为什么认不出来</h1>
      </header>

      <div className="oq-main">
        <figure className="oq-scene">
          <img className="oq-scene-img" src={M001} alt="跨环节流转现场语境（占位图）" />
          <figcaption className="oq-scene-caption">
            <span className="oq-scene-badge">同一块电池</span>
            <span className="oq-scene-note">现场语境 · 占位图</span>
          </figcaption>
        </figure>

        <div className="oq-flow">
          <div className="oq-timeline" aria-hidden="true">
            <span className="oq-rail" />
            <span className="oq-battery">
              <BatteryTag />
            </span>
            {STOPS.map((name) => (
              <div className="oq-stop" key={name}>
                <span className="oq-stop-tick" />
                <span className="oq-stop-label">{name}</span>
              </div>
            ))}
          </div>

          <div className="oq-records">
            {RECORDS.map((record) => (
              <div
                className="oq-record"
                key={record.system}
                style={
                  {
                    "--oq-drop": `${record.drop}px`,
                    "--oq-tilt": `${record.tilt}deg`,
                  } as CSSProperties
                }
              >
                <span className="oq-record-leader" aria-hidden="true" />
                <span className="oq-record-system">{record.system}</span>
                <span className="oq-record-code">{record.code}</span>
              </div>
            ))}
            <p className="oq-records-note">记录并不集中放在同一个地方</p>
          </div>
        </div>
      </div>

      <div className="oq-context">
        <div className="oq-context-ghost" aria-hidden="true">
          <CodeGlyph />
        </div>
        <div className="oq-capsule">
          <span className="oq-capsule-label">那串身份符号</span>
          <span className="oq-capsule-code">
            <CodeGlyph />
          </span>
        </div>
        <span className="oq-barrier" aria-hidden="true" />
        <div className="oq-outside">
          <div className="oq-tags">
            {INFO_TAGS.map((tag) => (
              <span className="oq-tag" key={tag}>
                {tag}
              </span>
            ))}
          </div>
          <p className="oq-outside-note">不会都写进身份符号里</p>
        </div>
      </div>

      <div className="oq-landing">
        <span className="oq-landing-ghost" aria-hidden="true" />

        <div className="oq-question">
          <p className="oq-question-lead">信息根本不在编码里面</p>
          <p className="oq-question-strong">这串符号凭什么认出同一块电池、又找到相关的信息？</p>
        </div>

        <div className="oq-entry">
          <span className="oq-entry-mark" aria-hidden="true">
            <EntryGlyph />
          </span>
          <p className="oq-entry-line">这正是理解 Handle 的入口</p>
        </div>
      </div>
    </div>
  );
}
