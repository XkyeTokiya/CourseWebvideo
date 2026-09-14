import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A001OnsiteQuestion.css";
import m001 from "./assets/m001.png";

const states = [
  "object-identified",
  "records-needed",
  "info-scattered",
  "question-raised",
] as const;

type A001State = (typeof states)[number];

const RECORDS = [
  "设计型号",
  "生产批次",
  "质检记录",
  "交付信息",
  "历次维护记录",
];

export default function A001OnsiteQuestion({ step }: ChapterStepProps) {
  const state: A001State = states[step] ?? states[states.length - 1];
  const card2On = state !== "object-identified";
  const takeawayOn = state === "info-scattered" || state === "question-raised";
  const questionOn = state === "question-raised";

  return (
    <div className={`oq-scene scene-pad${questionOn ? " is-question" : ""}`}>
      <div className="oq-main">
        <section className="oq-content">
          <h1 className="oq-title">认出设备，信息仍然分散</h1>

          <div className="oq-cards">
            <article className="oq-card card">
              <span className="oq-card-no hero-num">01</span>
              <div className="oq-card-body">
                <p className="oq-line oq-line-anomaly">
                  工业泵出现<em>运行异常</em>，服务人员赶到现场
                </p>
                <p className="oq-line oq-line-scan">
                  现场扫码，<em>只能确认这是哪一台泵</em>
                </p>
              </div>
            </article>

            <article
              className={`oq-card card oq-card-records${card2On ? " is-on" : ""}`}
              aria-hidden={!card2On}
            >
              <span className="oq-card-no hero-num">02</span>
              <div className="oq-card-body">
                <p className="oq-records-lead">判断问题，还要查五类记录</p>
                <ul className="oq-records">
                  {RECORDS.map((item, i) => (
                    <li
                      key={item}
                      style={{ "--oq-i": String(i) } as CSSProperties}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </div>
        </section>

        <figure className="oq-media">
          <div className="oq-frame">
            <img
              className="oq-shot"
              src={m001}
              alt="工业设备检查与检修现场，工作人员核验设备"
            />
            <div className="oq-scan" aria-hidden="true">
              <span className="oq-scan-line" />
              <span className="oq-scan-target">
                <i />
                <b>已确认 · 这一台泵</b>
              </span>
            </div>
          </div>
          <figcaption className="oq-cap">
            <span>设备检查与检修现场</span>
            <span>扫码只完成身份确认</span>
          </figcaption>
        </figure>
      </div>

      <footer className="oq-takeaway">
        <p
          className={`oq-scatter${takeawayOn ? " is-on" : ""}`}
          aria-hidden={!takeawayOn}
        >
          这些记录产生在<em>不同阶段</em>，存在<em>不同系统</em>，甚至由
          <em>不同企业</em>保管
        </p>
      </footer>

      <div
        className={`oq-overlay${questionOn ? " is-on" : ""}`}
        aria-hidden={!questionOn}
      >
        <div className="oq-overlay-scrim" />
        <div className="oq-overlay-plate">
          <p className="oq-overlay-lead">设备认出来了，信息还是散的。</p>
          <p className="oq-overlay-hero">
            同一台设备的信息，怎样才能<em>从分散走向关联</em>？
          </p>
        </div>
      </div>
    </div>
  );
}
