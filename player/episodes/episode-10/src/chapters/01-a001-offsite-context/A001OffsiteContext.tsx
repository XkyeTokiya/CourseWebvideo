import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A001OffsiteContext.css";

const states = [
  "offsite-anchored",
  "anomaly-surfaced",
  "checklist-opened",
  "blind-spot-declared",
] as const;

type A001State = (typeof states)[number];

const CHECKLIST = [
  { no: "01", label: "位置", text: "模具现在在哪儿？" },
  { no: "02", label: "加工次数", text: "总共加工了多少次？" },
  { no: "03", label: "维护记录", text: "最近有没有做过维护？" },
  { no: "04", label: "合规", text: "有没有被违规外放或私自调拨？" },
];

export default function A001OffsiteContext({ step }: ChapterStepProps) {
  const state: A001State = states[step] ?? states[states.length - 1];
  const anomalyOn = state !== "offsite-anchored";
  const checklistOn = state === "checklist-opened" || state === "blind-spot-declared";
  const blindOn = state === "blind-spot-declared";

  return (
    <div className={`ao-scene scene-pad${blindOn ? " is-blind" : ""}`}>
      <h1 className="ao-title">模具离厂后，谁还看得见它</h1>

      <div className="ao-main">
        <figure className="ao-media">
          <div className="ao-frame">
            <div className="ao-placeholder">
              <span className="ao-ph-tag">IMAGE · 16:9</span>
              <span className="ao-ph-title">外协模具委托加工 · 交接现场</span>
              <span className="ao-ph-note">素材待提供（photorealistic_ai）</span>
            </div>
            <div className={`ao-anomaly${anomalyOn ? " is-on" : ""}`} aria-hidden={!anomalyOn}>
              <span className="ao-anomaly-pin" aria-hidden="true" />
              <p className="ao-anomaly-title">产品精度异常</p>
              <p className="ao-anomaly-note">用这副模具生产的产品</p>
            </div>
          </div>
          <figcaption className="ao-cap">
            <span>M001 · 外协模具交接现场（placeholder）</span>
            <span>素材待提供 · 不显示数据与结论</span>
          </figcaption>

          <div className="ao-anchor">
            <span className="ao-anchor-lead">外协委托 · 交接定格</span>
            <div className="ao-parties">
              <span className="ao-party">
                <b>外协注塑模具</b>
                <i>企业的核心资产</i>
              </span>
              <span className="ao-delegate">被委托给</span>
              <span className="ao-party">
                <b>外部合作厂商</b>
                <i>离开厂区加工</i>
              </span>
            </div>
          </div>
        </figure>

        <aside className="ao-rail">
          <p className="ao-rail-lead">运营人员 · 需要确认</p>
          <div className="ao-checklist">
            {CHECKLIST.map((item, i) => (
              <article
                key={item.no}
                className={`ao-check${checklistOn ? " is-on" : ""}`}
                style={{ "--ao-i": String(i) } as CSSProperties}
              >
                <span className="ao-check-no hero-num">{item.no}</span>
                <div className="ao-check-body">
                  <h2>{item.label}</h2>
                  <p>{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </aside>
      </div>

      <div className={`ao-blind${blindOn ? " is-on" : ""}`} aria-hidden={!blindOn}>
        <p className="ao-blind-hero">
          模具还在生产，<em>企业却看不见、管不住。</em>
        </p>
        <p className="ao-blind-note">这一期，就看主动标识怎样扭转这种被动局面。</p>
      </div>
    </div>
  );
}
