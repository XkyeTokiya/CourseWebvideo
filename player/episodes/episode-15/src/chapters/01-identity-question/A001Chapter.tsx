import "./A001Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

const stateByStep = [
  "scene-opened",
  "journey-established",
  "records-scattered",
  "question-dominant",
  "identity-proposed",
  "layering-question",
] as const;

const STATIONS = ["生产下线", "运输", "销售", "维护", "回收"] as const;

const RECORDS = [
  { tag: "记录 ①", system: "系统 A", code: "A-7741" },
  { tag: "记录 ②", system: "系统 B", code: "B-0293" },
  { tag: "记录 ③", system: "系统 C", code: "C-5518" },
  { tag: "记录 ④", system: "系统 D", code: "D-3086" },
  { tag: "记录 ⑤", system: "系统 E", code: "E-9472" },
] as const;

function BatteryGlyph() {
  return (
    <svg className="iq-glyph" viewBox="0 0 48 48" aria-hidden="true">
      <rect x="5" y="14" width="33" height="22" rx="3" fill="none" stroke="currentColor" strokeWidth="3.4" />
      <rect x="41" y="21" width="4.5" height="8" rx="1.4" fill="currentColor" />
      <path
        d="M24 18.5 17 27.5h4.8L20 34l7.6-9.6h-4.8L24 18.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StepStairs() {
  return (
    <svg className="iq-stairs" viewBox="0 0 132 48" aria-hidden="true">
      <path d="M8 8h30v12h30v12h30" fill="none" stroke="currentColor" strokeWidth="4" />
      <path d="M105 24l14 8-14 8" fill="none" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
    </svg>
  );
}

export default function A001Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad iq-root" data-state={state}>
      <header className="iq-header">
        <span className="iq-heading-mark" aria-hidden="true" />
        <h1 className="iq-headline">同一个对象怎样被认出来</h1>
      </header>

      <div className="iq-main">
        <div className="iq-journey">
          <span className="iq-route-rail" aria-hidden="true" />
          <span className="iq-battery" aria-hidden="true">
            <BatteryGlyph />
          </span>
          {STATIONS.map((name, index) => (
            <div className="iq-station" key={name}>
              <div className="iq-node">
                <span className="iq-node-no">{`0${index + 1}`}</span>
              </div>
              <p className="iq-station-name">{name}</p>
              <div className="iq-record">
                <span className="iq-record-tag">{RECORDS[index].tag}</span>
                <span className="iq-record-system">{RECORDS[index].system}</span>
                <span className="iq-record-code">{RECORDS[index].code}</span>
                {index < RECORDS.length - 1 ? (
                  <span className="iq-record-q" aria-hidden="true">
                    ？
                  </span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="iq-landing">
        <span className="iq-landing-ghost" aria-hidden="true">
          ？
        </span>

        <div className="iq-question">
          <p className="iq-question-line">怎样让运输方、销售方、维修方和回收方都确认——</p>
          <p className="iq-question-strong">他们记录的是同一块电池？</p>
        </div>

        <div className="iq-identity">
          <div className="iq-reject">
            <p className="iq-reject-main">再加一串编号</p>
            <p className="iq-reject-sub">只是又给它起了一个名字</p>
          </div>
          <div className="iq-vaa">
            <div className="iq-layers" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
            <div className="iq-vaa-copy">
              <p className="iq-vaa-main">VAA 给对象一个带层级的身份</p>
              <p className="iq-vaa-sub">让身份本身可以被管理起来</p>
            </div>
          </div>
        </div>

        <div className="iq-teaser">
          <p className="iq-teaser-main">这套层级怎么搭？</p>
          <p className="iq-teaser-sub">我们一层一层看</p>
          <span className="iq-teaser-stairs" aria-hidden="true">
            <StepStairs />
          </span>
        </div>
      </div>
    </div>
  );
}
