import "./A001Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

const stateByStep = [
  "journey-established",
  "records-scattered",
  "confirmation-question",
  "episode-question",
] as const;

const STATIONS = ["工厂下线", "仓储", "装配", "维修"] as const;

const RECORDS = [
  { tag: "记录 ①", system: "记录系统 A" },
  { tag: "记录 ②", system: "记录系统 B" },
  { tag: "记录 ③", system: "记录系统 C" },
  { tag: "记录 ④", system: "记录系统 D" },
] as const;

function PartGlyph() {
  return (
    <svg className="oq-glyph" viewBox="0 0 48 48" aria-hidden="true">
      <path
        d="M24 5 40 14.5v19L24 43 8 33.5v-19L24 5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.6"
        strokeLinejoin="round"
      />
      <circle cx="24" cy="24" r="7.4" fill="none" stroke="currentColor" strokeWidth="3.6" />
    </svg>
  );
}

export default function A001Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad oq-root" data-state={state}>
      <header className="oq-header">
        <span className="oq-heading-mark" aria-hidden="true" />
        <h1 className="oq-headline">同一件零部件，为什么认不出来</h1>
      </header>

      <div className="oq-main">
        <div className="oq-journey">
          <span className="oq-route-rail" aria-hidden="true" />
          <span className="oq-part-marker" aria-hidden="true">
            <PartGlyph />
          </span>
          {STATIONS.map((name, index) => (
            <div className="oq-station" key={name}>
              <div className="oq-node">
                <span className="oq-node-no">{`0${index + 1}`}</span>
              </div>
              <p className="oq-station-name">{name}</p>
              <div className="oq-record">
                <span className="oq-record-tag">{RECORDS[index].tag}</span>
                <span className="oq-record-system">{RECORDS[index].system}</span>
                {index < RECORDS.length - 1 ? (
                  <span className="oq-record-q" aria-hidden="true">
                    ？
                  </span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="oq-question">
        <span className="oq-question-ghost" aria-hidden="true">
          ？
        </span>
        <p className="oq-question-confirm">我这条记录和别人的记录，说的是不是同一件东西？</p>
        <div className="oq-question-final">
          <p className="oq-question-kicker">这正是标识编码要回答的设计问题</p>
          <p className="oq-question-main">它到底是一种什么样的编码，又承担着哪些职责？</p>
        </div>
      </div>
    </div>
  );
}
