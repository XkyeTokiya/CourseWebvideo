import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./WhyConcept.css";

const PREMISES = [
  { no: "01", name: "设备", duty: "在运行", spanPct: 30 },
  { no: "02", name: "控制系统", duty: "下达指令", spanPct: 26 },
  { no: "03", name: "管理软件", duty: "安排生产 · 记录订单", spanPct: 34 },
] as const;

const stateByStep = [
  "premises-established",
  "local-limits-shown",
  "question-dominant",
] as const;

export default function WhyConceptChapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const limits = state !== "premises-established";
  const dominant = state === "question-dominant";

  return (
    <div className="wc-scene scene-pad">
      <div className={`wc-premises${dominant ? " is-weak" : ""}`}>
        {PREMISES.map((p, i) => (
          <div
            className="card wc-tag"
            key={p.no}
            style={{ "--wc-i": String(i) } as CSSProperties}
          >
            <div className="wc-tag-head">
              <span className="hero-num wc-tag-no">{p.no}</span>
              <span className="wc-tag-name">{p.name}</span>
            </div>
            <div className="wc-tag-duty">{p.duty}</div>
            <div className="wc-track">
              <span
                className="wc-track-span"
                data-on={limits}
                style={{ width: `${p.spanPct}%`, transitionDelay: `${i * 180}ms` }}
              />
            </div>
            <div className="wc-limit" data-on={limits} style={{ transitionDelay: `${i * 180 + 220}ms` }}>
              只解决各自的一小段工作
            </div>
          </div>
        ))}
      </div>

      <div className="wc-center">
        <div className={`wc-layer${!limits ? " is-on" : ""}`}>
          <div className="wc-q-reserve">
            <span className="hero-num wc-q-reserve-mark">?</span>
            <span className="wc-q-reserve-caption">2012 前后 · 一个工业现场</span>
          </div>
        </div>
        <div className={`wc-layer${limits && !dominant ? " is-on" : ""}`}>
          <div className="wc-q-mid">
            <span className="wc-q-mid-line">既然工具都在，</span>
            <span className="wc-q-mid-line">
              为什么还要提出<em>“工业互联网”</em>？
            </span>
          </div>
        </div>
        <div className={`wc-layer${dominant ? " is-on" : ""}`}>
          <div className="wc-q-hero">
            <span className="wc-q-hero-line">人、机器和数据，</span>
            <span className="wc-q-hero-line">
              能不能跨过
              <span className="wc-q-barriers">
                <i>设备</i>
                <i>系统</i>
                <i>环节</i>
              </span>
              的界线，持续配合？
            </span>
          </div>
          <span className="hero-num wc-q-big">?</span>
        </div>
      </div>

      <div className="wc-note">
        <span className="wc-note-mark" />
        <span className="wc-note-text">
          局部任务能够完成，但人、机器和数据仍没有跨过边界持续配合。
        </span>
      </div>
    </div>
  );
}
