import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A002ChainRoles.css";

/**
 * A002 · 链条上的角色 — Courseplay-bound base scene S-A002。
 * recipe: time-anchor-opening · 关系机制：等权累积（equal-weight-accumulation）——
 * 五段角色条沿同一水平轴依次落位，完成后全链等权保留、不产生当前选中项；
 * R003 由两段角色条（上游 U004 / 下游 U005）沿同一轴依次排布承载，
 * R004 由角色条与下方从属记录带之间的层级承载。
 */
const stateByStep = [
  "role-question-raised",
  "role-chain-laid-out",
  "records-attributed",
] as const;

type A002State = (typeof stateByStep)[number];

/** 五段角色条：名称与职责均取自本章口播 beat 2 的压缩复刻，无 packet 外事实。 */
const ROLES = [
  { no: "01", name: "原材料供应商", duty: "提供原料" },
  { no: "02", name: "生产商", duty: "负责制药" },
  { no: "03", name: "物流商", duty: "负责运输" },
  { no: "04", name: "经销商·零售商", duty: "把药送出去" },
  { no: "05", name: "药店·医院", duty: "最终交到使用者手里" },
];

export default function A002ChainRoles({ step }: ChapterStepProps) {
  const state: A002State =
    stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const laid = state !== "role-question-raised";
  const attributed = state === "records-attributed";

  return (
    <div
      className={`cr-scene scene-pad${laid ? " is-laid" : ""}${
        attributed ? " is-attributed" : ""
      }`}
    >
      <header className="cr-head">
        <div className="cr-head-copy">
          <h1 className="cr-title">供应链上的多个角色</h1>
          <p className="cr-lead">这盒药背后，站着多少角色？</p>
        </div>
        {/* M002 未就位：只保留空白版位，不放任何占位图 */}
        <div className="cr-media" aria-hidden="true" />
      </header>

      <section className="cr-chain" aria-label="供应链角色轴">
        <div className="cr-bays">
          {ROLES.map((role, i) => (
            <article
              key={role.no}
              className="cr-role"
              style={{ "--cr-i": String(i) } as CSSProperties}
            >
              <span className="cr-role-no hero-num">{role.no}</span>
              <h2 className="cr-role-name">{role.name}</h2>
              <p className="cr-role-duty">{role.duty}</p>
            </article>
          ))}
          {[0, 1, 2, 3].map((k) => (
            <svg
              key={k}
              className="cr-flow"
              style={{ "--cr-k": String(k) } as CSSProperties}
              viewBox="0 0 22 34"
              aria-hidden="true"
            >
              <polyline
                points="4,4 17,17 4,30"
                fill="none"
                stroke="var(--theme-process)"
                strokeWidth="4.5"
                strokeLinecap="square"
              />
            </svg>
          ))}
        </div>
        <div className="cr-axis-wrap" aria-hidden="true">
          <div className="cr-axis" />
          <svg className="cr-axis-head" viewBox="0 0 20 26">
            <polyline
              points="4,3 15,13 4,23"
              fill="none"
              stroke="var(--theme-structural)"
              strokeWidth="5"
              strokeLinecap="square"
            />
          </svg>
        </div>
        <div className="cr-mark" aria-hidden="true">
          <span className="cr-mark-pop">
            <span className="cr-mark-glyph hero-num">?</span>
          </span>
        </div>
      </section>

      <section className="cr-records" aria-label="各角色的业务系统与记录">
        <div className="cr-slips">
          {ROLES.map((role, i) => (
            <div
              key={role.no}
              className="cr-slip"
              style={{ "--cr-i": String(i) } as CSSProperties}
            >
              <svg className="cr-slip-doc" viewBox="0 0 40 50" aria-hidden="true">
                <rect
                  x="1.5"
                  y="1.5"
                  width="37"
                  height="47"
                  fill="var(--surface)"
                  stroke="var(--theme-structural)"
                  strokeWidth="2.5"
                />
                <line x1="9" y1="14" x2="31" y2="14" stroke="var(--theme-process)" strokeWidth="3.5" />
                <line x1="9" y1="24" x2="31" y2="24" stroke="var(--rule)" strokeWidth="3" />
                <line x1="9" y1="33" x2="24" y2="33" stroke="var(--rule)" strokeWidth="3" />
                <line x1="9" y1="41" x2="19" y2="41" stroke="var(--rule)" strokeWidth="3" />
              </svg>
              <span className="cr-slip-label">记录</span>
            </div>
          ))}
        </div>
        <h2 className="cr-records-title">各有业务系统、各留记录</h2>
      </section>
    </div>
  );
}
