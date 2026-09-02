import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./NetworkFoundation.css";

const stateByStep = [
  "objects-card-up",
  "transmission-card-up",
  "entry-value-card-up",
] as const;

type State = (typeof stateByStep)[number];

const OBJECTS = ["设备", "生产系统", "管理系统", "供应链环节"] as const;
const PULSES = [0, 1, 2] as const;

export default function NetworkFoundationChapter({ step }: ChapterStepProps) {
  const state: State = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const idx = stateByStep.indexOf(state);

  const cards = [
    {
      no: "01",
      name: "连接对象",
      kind: "objects" as const,
      desc: "",
    },
    {
      no: "02",
      name: "传递内容",
      kind: "text" as const,
      desc: "设备状态和业务活动能够持续离开局部。",
    },
    {
      no: "03",
      name: "入口价值",
      kind: "value" as const,
      desc: "",
    },
  ];

  return (
    <div className="nf-scene scene-pad">
      <header className="nf-title">
        <span className="nf-title-mark" />
        <h1 className="nf-title-text">
          网络把分散的工业对象接入一条<em>可持续传递</em>的信息路径
        </h1>
      </header>

      <div className="nf-path" aria-hidden="true">
        <span className="nf-path-label">信息路径</span>
        <span className="nf-path-track">
          {PULSES.map((i) => (
            <span key={i} className="nf-pulse" style={{ "--nf-i": i } as CSSProperties} />
          ))}
        </span>
      </div>

      <div className="nf-cards">
        {cards.map((c, i) => {
          const on = idx >= i;
          return (
            <article
              key={c.no}
              className={`card nf-card${on ? " is-on" : " is-ghost"}`}
              style={{ "--nf-i": i } as CSSProperties}
            >
              <span className="nf-slot">路径卡 · {c.no}</span>
              <div className="nf-card-body">
                <header className="nf-card-head">
                  <span className="hero-num nf-card-no">{c.no}</span>
                  <span className="nf-card-name">{c.name}</span>
                </header>
                {c.kind === "objects" ? (
                  <div className="nf-objects">
                    {OBJECTS.map((o, j) => (
                      <span
                        key={o}
                        className="nf-object"
                        style={{ "--nf-j": j } as CSSProperties}
                      >
                        {o}
                      </span>
                    ))}
                  </div>
                ) : c.kind === "text" ? (
                  <p className="nf-card-desc">{c.desc}</p>
                ) : (
                  <p className="nf-card-desc">
                    后续理解与判断由此获得<em>可进入</em>、<em>可持续</em>的信息。
                  </p>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
