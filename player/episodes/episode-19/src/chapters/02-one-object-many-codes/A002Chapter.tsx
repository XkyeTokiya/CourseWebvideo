import "./A002Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import M001 from "./assets/M001.png";

/**
 * 02-one-object-many-codes · A002（对象旅程页 · issue-cards-with-image）
 * step → semantic state 显式映射，末态兜底（outline S-A002）：
 * - journey-established：零部件图像持续，多环节链路卡依次落位
 * - codes-everywhere：保持链路卡与图像，各环节挂“已有编号”标注
 * - first-question-anchored：旅程与编号弱化为背景，第一问成为焦点
 * - two-questions-anchored：第一问保持，第二问并置收束
 */
const stateByStep = [
  "journey-established",
  "codes-everywhere",
  "first-question-anchored",
  "two-questions-anchored",
] as const;

type A002State = (typeof stateByStep)[number];

/** 多环节旅程：指导 G003（E013）；匿名教学场景，环节为流转语境（C002/C003） */
const STAGES = ["贸易流通", "仓储", "生产线", "内部系统", "工业网络"] as const;

export default function A002Chapter({ step }: ChapterStepProps) {
  const state: A002State =
    stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad om-root" data-state={state}>
      <header className="om-header">
        <h1 className="om-headline">一个对象，多套编号</h1>
        <p className="om-sub">一件普通的工业零部件，在它经过的每个环节都被记录</p>
      </header>

      <div className="om-main">
        <figure className="om-object">
          <img
            className="om-object-img"
            src={M001}
            alt="零部件多环节工业现场语境（占位图）"
          />
          <figcaption className="om-object-caption">
            <span className="om-object-badge">一件普通的工业零部件</span>
            <span className="om-object-note">匿名教学场景 · 占位</span>
          </figcaption>
        </figure>

        <div className="om-track" aria-label="零部件经过的环节链路">
          <svg className="om-track-svg" viewBox="0 0 24 620" preserveAspectRatio="none" aria-hidden="true">
            <line className="om-track-line" x1="12" y1="4" x2="12" y2="616" />
          </svg>
          {STAGES.map((stage, index) => (
            <div className="om-node" key={stage}>
              <span className="om-node-dot" aria-hidden="true" />
              <span className="om-node-index">{String(index + 1).padStart(2, "0")}</span>
              <span className="om-node-name">{stage}</span>
              <span className="om-node-code">
                <span className="om-code-label">已有编号</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="om-questions">
        <p className="om-question">
          <span className="om-q-lead">面对 VAA、Handle、OID、Ecode、GS1 这么多体系</span>
          <span className="om-q-text">该先看什么，再决定用哪一套？</span>
        </p>
        <p className="om-question">
          <span className="om-q-lead">想把所有环节都管住</span>
          <span className="om-q-text">为什么不能只用一套编码？</span>
        </p>
      </div>
    </div>
  );
}
