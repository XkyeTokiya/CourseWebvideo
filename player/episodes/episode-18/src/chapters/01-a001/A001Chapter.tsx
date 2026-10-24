import "./A001Chapter.css";
import { Fragment } from "react";
import m001Src from "./assets/M001.png";
import type {
  ChapterStepProps,
} from "../../../../../src/shared/presentation-runtime/registry/types";

/**
 * 01-opening-records · 开场与跨环节记录页（outline §1 · S-A001 · image-with-insight-rail）
 * 单一持续开场场景：左侧媒体区 + 右侧洞察轨（身份框架句弱化预置 → 环节前
 * 提轨按流转先后点亮 → 记录条带按环节盖入 → 疑问区升起、前置内容弱化）。
 * step → semantic state 显式映射（0 基，末态兜底）：
 * - title-established：标题区与弱预置框架句就位（step 1）
 * - journey-shown：流转图引入，前提轨按 生产线→仓库→装车→使用现场 顺序
 *   点亮并串线（step 2，R001 由环节条带与记录的先后排列承载）
 * - records-assigned：保持图像与前提轨，记录条带逐环节盖入（step 3，
 *   R001 延续）
 * - ambiguity-raised：前置内容权重弱化，疑问区出现身份疑问标记
 *   （step 4，R002 由记录并置后的疑问标记承载）
 * 护栏 C001：标题与场景不出现标准有效性、注册或解析断言；
 * 护栏 C002：情境只作匿名教学场景，不出现真实企业、真实编码或注册结果。
 */
const stateByStep = [
  "title-established",
  "journey-shown",
  "records-assigned",
  "ambiguity-raised",
] as const;

type A001State = (typeof stateByStep)[number];

const STAGE_ORDER: Record<A001State, number> = {
  "title-established": 0,
  "journey-shown": 1,
  "records-assigned": 2,
  "ambiguity-raised": 3,
};

/** 流转环节（G002：生产线 → 仓库 → 装车 → 使用现场，真实先后） */
const STAGES = ["生产线", "仓库", "装车", "使用现场"] as const;

/** 回旋隔位子序号，占位记号，不指任何真实编码（C002） */
const RECORD_MARKS = ["记录 · 一套", "换个记法", "又一套编法", "再来一套"] as const;

export default function A001Chapter({ step }: ChapterStepProps) {
  const state: A001State =
    stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const at = STAGE_ORDER[state];

  // is-on 门控：元素在其所属 step 起持续保留，动画只在新进入时播一遍
  const imageOn = at >= STAGE_ORDER["journey-shown"];
  const journeyOn = imageOn;
  const recordsOn = at >= STAGE_ORDER["records-assigned"];
  const ambiguityOn = at >= STAGE_ORDER["ambiguity-raised"];

  return (
    <div className="aw-root" data-state={state}>
      <header className="aw-head">
        <h1 className="aw-headline">
          <em>Ecode</em> 编码：版本、体系标识与主码
        </h1>
        <span className="aw-head-rule" aria-hidden="true" />
        <p className="aw-frame-note">
          Ecode 把版本、体系标识和主码，放进一个可识别的身份框架
        </p>
      </header>

      <div className="aw-main">
        <figure className={`aw-media${imageOn ? " is-on" : ""}`}>
          <img
            src={m001Src}
            alt="一件工业物品在生产线、仓库、装车、使用现场之间流转的匿名教学场景"
          />
          <figcaption className="aw-media-note">
            素材占位 · 真实场景图待提供
          </figcaption>
        </figure>

        <div className="aw-rail">
          <div className={`aw-journey${journeyOn ? " is-on" : ""}`}>
            <p className="aw-journey-title">跨环节流转</p>
            <div className="aw-stages" role="list">
              {STAGES.map((label, index) => (
                <Fragment key={label}>
                  {index > 0 && (
                    <span
                      className="aw-link"
                      style={{ "--aw-i": index } as React.CSSProperties}
                      aria-hidden="true"
                    />
                  )}
                  <span className="aw-stage" role="listitem">
                    <span className="aw-stage-dot" aria-hidden="true" />
                    <span className="aw-stage-name">{label}</span>
                  </span>
                </Fragment>
              ))}
            </div>
          </div>

          <div className={`aw-records${recordsOn ? " is-on" : ""}`}>
            <p className="aw-records-title">每个环节，都可能记下一套编号</p>
            <ul className="aw-record-list">
              {RECORD_MARKS.map((label, index) => (
                <li
                  key={label}
                  className="aw-record"
                  style={{ "--aw-i": index } as React.CSSProperties}
                >
                  <b>{STAGES[index]}</b>
                  <i className="aw-record-mark" aria-hidden="true">
                    〜
                  </i>
                  <span>{label}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className={`aw-ambiguity${ambiguityOn ? " is-on" : ""}`}>
        <span className="aw-ambiguity-mark" aria-hidden="true">
          ？
        </span>
        <p className="aw-ambiguity-line">
          记录放在一起，说不清一件事——
          <strong>它们说的是不是同一件物品？</strong>
        </p>
      </div>
    </div>
  );
}
