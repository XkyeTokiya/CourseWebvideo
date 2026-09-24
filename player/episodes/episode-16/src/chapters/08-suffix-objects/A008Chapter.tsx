import "./A008Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import M003 from "./assets/M003.png";

/**
 * A008 · 后缀对象 —— image-with-insight-rail
 * 现场图像持续呈现企业内部多个独立对象（其中一个被核验），
 * 洞察带沿「区分 → 关联 → 道理」推进阅读焦点，
 * 引线标注承载 R008：后缀 associates 对象信息（linked-not-embedded）。
 * step（0 基）→ semantic state（handoff steps[].scene_state，1 基）。
 */
const stateByStep = [
  "suffix-role-established",
  "association-framed",
  "rationale-completed",
] as const;

type A008State = (typeof stateByStep)[number];

/** 现场图像上的对象标记（示意性结构标注，位置为画面百分比） */
const OBJECTS = [
  { label: "对象 ①", x: 18, y: 22, verified: false },
  { label: "对象 ②", x: 50, y: 34, verified: true },
  { label: "对象 ③", x: 24, y: 60, verified: false },
  { label: "对象 ④", x: 72, y: 62, verified: false },
] as const;

/** 可关联的信息类型：只作「可关联」语义，不进入任何后缀或字段方案 */
const LINKED_INFO = ["产品规格", "生产批次", "生产日期"] as const;

export default function A008Chapter({ step }: ChapterStepProps) {
  const state: A008State = stateByStep[step] ?? stateByStep.at(-1)!;

  return (
    <div className="scene-pad so-root" data-state={state}>
      <header className="so-header">
        <span className="so-header-mark" aria-hidden="true" />
        <h1 className="so-headline">后缀区分的是内部对象</h1>
      </header>

      <div className="so-main">
        <div className="so-stage">
          <figure className="so-scene">
            <img
              className="so-scene-img"
              src={M003}
              alt="企业内部多个独立对象的现场语境（占位图）"
            />
            {OBJECTS.map((obj) => (
              <span
                key={obj.label}
                className={obj.verified ? "so-obj so-obj--verified" : "so-obj"}
                style={{ left: `${obj.x}%`, top: `${obj.y}%` }}
              >
                {obj.label}
                {obj.verified ? <span className="so-obj-badge">核验</span> : null}
              </span>
            ))}
            <figcaption className="so-scene-caption">
              <span className="so-scene-badge">企业内部现场</span>
              <span className="so-scene-note">现场语境 · 占位图</span>
            </figcaption>
          </figure>

          <div className="so-container">
            <div className="so-container-head">
              <p className="so-container-title">对象背后的信息</p>
              <span className="so-container-tag">由系统连接</span>
            </div>
            <div className="so-info-row">
              {LINKED_INFO.map((info) => (
                <span className="so-info" key={info}>
                  {info}
                </span>
              ))}
            </div>
            <p className="so-container-note">由系统连接，不写进后缀</p>
          </div>

          <svg
            className="so-leader"
            viewBox="0 0 900 824"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <circle className="so-leader-dot" cx="450" cy="212" r="7" vector-effect="non-scaling-stroke" />
            <path
              className="so-leader-path"
              d="M450 212 C474 320 428 430 450 566"
              pathLength={1}
              vector-effect="non-scaling-stroke"
            />
          </svg>
          <span className="so-leader-tag">关联</span>
        </div>

        <aside className="so-rail">
          <div className="so-insight">
            <span className="so-node" aria-hidden="true" />
            <div className="so-card">
              <div className="so-card-head">
                <span className="so-idx">01</span>
                <h2 className="so-title">本地化的对象区分</h2>
              </div>
              <p className="so-line">直接使用本地化标识，由企业内部自己定义</p>
              <p className="so-line so-line--link">可关联：产品规格 · 生产批次 · 生产日期</p>
            </div>
          </div>

          <div className="so-insight">
            <span className="so-node" aria-hidden="true" />
            <div className="so-card">
              <div className="so-card-head">
                <span className="so-idx">02</span>
                <h2 className="so-title">关键词是「关联」</h2>
              </div>
              <p className="so-line">信息不必全都编码进后缀</p>
              <p className="so-judge">先稳定区分对象，再由系统连接信息</p>
            </div>
          </div>

          <div className="so-insight">
            <span className="so-node" aria-hidden="true" />
            <div className="so-card">
              <div className="so-card-head">
                <span className="so-idx">03</span>
                <h2 className="so-title">后缀为什么握在企业手里</h2>
              </div>
              <p className="so-line so-line--in">对象名称、批次规则，最熟悉的人在企业内部</p>
              <p className="so-line so-line--out">前缀只保证企业在外部的位置唯一</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
