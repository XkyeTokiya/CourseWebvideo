import "./OpeningCheck.css";
import m001Url from "./assets/m001-station.png";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

const stateByStep = [
  "opening-established",
  "parts-at-station",
  "checks-paired",
  "risks-visible",
  "question-dominant",
] as const;

type OpeningState = (typeof stateByStep)[number];

const CHECKS = [
  { tag: "核对 1", question: "它是不是当前这张订单要的零件？" },
  { tag: "核对 2", question: "它该不该装到眼前这辆车上？" },
];

const RISKS = ["错装", "漏装", "串货"];

const STAGES = ["供应商", "装配", "配件", "维修"];

export default function OpeningCheck({ step }: ChapterStepProps) {
  const state: OpeningState = stateByStep[step] ?? stateByStep[stateByStep.length - 1];

  return (
    <div className={`scene oc-scene state-${state}`}>
      <div className="scene-pad oc-pad">
        <h1 className="oc-headline serif-cn">汽车总装工位的装配前核对</h1>

        <div className="oc-main">
          <figure className="oc-media card">
            <img src={m001Url} alt="总装工位开场情境占位图（M001，待替换正式素材）" />
            <figcaption className="oc-media-caption mono">
              M001 · 总装工位开场情境（占位，待替换）
            </figcaption>
            <div className="oc-rail" aria-hidden="true">
              <span className="oc-part oc-part-a">
                <i className="oc-part-code" />
                <i className="oc-part-dot" />
              </span>
              <span className="oc-part oc-part-b">
                <i className="oc-part-code" />
                <i className="oc-part-dot" />
              </span>
            </div>
          </figure>

          <div className="oc-checks">
            <p className="oc-checks-lead">比“这是什么零件”更要紧的两个问题</p>
            {CHECKS.map((check) => (
              <div className="oc-check card" key={check.tag}>
                <span className="oc-check-tag mono">{check.tag}</span>
                <p className="oc-check-question serif-cn">{check.question}</p>
                <span className="oc-scan" aria-hidden="true" />
              </div>
            ))}
          </div>
        </div>

        <div className="oc-risk-band">
          <p className="oc-risk-cause">
            核对只要错一处
            <span className="oc-risk-arrow" aria-hidden="true">→</span>
          </p>
          <div className="oc-risks">
            {RISKS.map((risk) => (
              <span className="oc-risk serif-cn" key={risk}>{risk}</span>
            ))}
          </div>
        </div>

        <div className="oc-question card">
          <p className="oc-question-lead">一件零部件，从供应商出发，要经过这么多环节</p>
          <p className="oc-question-mid serif-cn">怎样才能让每个环节都认得出它、对得上它</p>
          <p className="oc-question-hero serif-cn">
            身份<em>始终不断线</em>？
          </p>
          <div className="oc-track" aria-hidden="true">
            <span className="oc-thread" />
            <span className="oc-dot" />
            {STAGES.map((stage) => (
              <span className="oc-stop" key={stage}>
                <b>{stage}</b>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
