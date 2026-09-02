import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./FeedbackWithIdentity.css";
import m003 from "./assets/m003.png";

/* A007 · S-A007 —— narration step → semantic state
   4 拍各落一态，全部复用同一 base 构图：M003 场景图与 insight rail
   四阅读项全程持续不卸载；不另设 final judgment / 底部总结栏 */
const stateByStep = [
  "feedback-submitted",
  "identity-correspondence",
  "problem-located",
  "fact-boundary-stated",
] as const;

type FeedbackState = (typeof stateByStep)[number];

/* 各 semantic state 的阅读进度：
   onCount = 已完成阅读项数；focus = 当前阅读焦点项；dimCount = 已读弱化项数
   （售后业务为真实顺序过程，读过的项弱化保留，焦点随口播迁移） */
const PROGRESS: Record<
  FeedbackState,
  { onCount: number; focus: number; dimCount: number }
> = {
  "feedback-submitted": { onCount: 2, focus: 1, dimCount: 0 },
  "identity-correspondence": { onCount: 2, focus: 2, dimCount: 2 },
  "problem-located": { onCount: 3, focus: 2, dimCount: 2 },
  "fact-boundary-stated": { onCount: 4, focus: 3, dimCount: 3 },
};

/* R014 语境条：反馈身份对应的前序四类记录，等权 chips，
   不画连线、不画售后端返回生产端的回流线 */
const RECORD_KINDS = ["装配", "工艺", "质量", "物流"] as const;

/* 入场 stamp 延迟：拍 1 内项 1 → 项 2 先后完成（两项口播同句相连），
   全部入场 ≤3s；项 3/4 由后续拍的场景指令驱动 */
const STAMP_DELAY_MS = ["420ms", "1350ms", "0ms", "0ms"] as const;

export default function FeedbackWithIdentity({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const { onCount, focus, dimCount } = PROGRESS[state];

  /* 阅读项 3 独立三态：waiting → dawning（拍 2 语境开始）→ on（拍 3 完成） */
  const note3State =
    state === "feedback-submitted"
      ? "waiting"
      : state === "identity-correspondence"
        ? "dawning"
        : "on";

  const stampVar = (i: number) =>
    ({ "--fw-d": STAMP_DELAY_MS[i] } as CSSProperties);

  const itemClass = (i: number, extra = "") =>
    ["fw-item", "card", extra, focus === i ? "is-focus" : "", i < dimCount && focus !== i ? "is-dim" : ""]
      .filter(Boolean)
      .join(" ");

  const plainState = (i: number) => (i < onCount ? "on" : "waiting");

  return (
    <div className="fw-scene scene-pad" data-state={state}>
      <h1 className="fw-thesis">
        售后反馈<em>带着明确的发动机身份</em>，才接得回前序记录
      </h1>

      <div className="fw-main">
        {/* 媒体区 M003 · 场景图全程持续；不叠加完整句、回流路径或虚构系统界面 */}
        <figure className="fw-media">
          <div className="fw-photo">
            <img src={m003} alt="M003 售后查询与反馈现场占位图" />
          </div>
          <figcaption className="fw-media-cap">
            <span>M003 · 售后查询与反馈现场（占位图）</span>
            <span>不显示缺陷判定结果、软件界面或可读业务数据</span>
          </figcaption>
        </figure>

        {/* insight rail · 四阅读项按售后业务顺序依次完成，槽位固定不重排 */}
        <div className="fw-rail">
          <p className="fw-rail-lead">售后反馈 · 按顺序读</p>

          {/* 阅读项 1 · 确认对象（V014） */}
          <article
            className={itemClass(0)}
            data-state={plainState(0)}
            style={stampVar(0)}
            aria-hidden={plainState(0) === "waiting"}
          >
            <header className="fw-item-head">
              <span className="fw-no hero-num">01</span>
              <h2 className="fw-label">确认对象</h2>
            </header>
            <p className="fw-text">扫描同一发动机标识，获取产品基本信息。</p>
          </article>

          {/* 阅读项 2 · 提交反馈（V015）；拍 2 起身份短语锚定高亮（R014） */}
          <article
            className={itemClass(1)}
            data-state={plainState(1)}
            style={stampVar(1)}
            aria-hidden={plainState(1) === "waiting"}
          >
            <header className="fw-item-head">
              <span className="fw-no hero-num">02</span>
              <h2 className="fw-label">提交反馈</h2>
            </header>
            <p className="fw-text">
              通过互动服务发起故障报修或意见反馈，并
              <em className="fw-id-em">保留明确的发动机身份</em>。
            </p>
          </article>

          {/* 阅读项 3 · 回查记录：dawning 拍仅开语境（对应前序记录），
              完成拍正文 stamp-in；保持"从对象查相关记录"句式，不扩展为缺陷因果 */}
          <article
            className={itemClass(2, "fw-item-note")}
            data-state={note3State}
            style={stampVar(2)}
            aria-hidden={note3State === "waiting"}
          >
            <header className="fw-item-head">
              <span className="fw-no hero-num">03</span>
              <h2 className="fw-label">回查记录</h2>
            </header>
            <div className="fw-note3-context" aria-hidden="true">
              <span className="fw-ctx-lead">对应前序记录</span>
              <span className="fw-ctx-chips">
                {RECORD_KINDS.map((kind, i) => (
                  <span
                    key={kind}
                    className="fw-ctx-chip"
                    style={{ "--fw-i": String(i) } as CSSProperties}
                  >
                    {kind}
                  </span>
                ))}
              </span>
            </div>
            <p className="fw-text">
              从问题对象查找对应的装配、工艺、质量和物流记录，
              <em className="fw-key-em">定位相关业务环节</em>。
            </p>
          </article>

          {/* 阅读项 4 · 事实边界（R016）：正常主体阅读层级收束，不缩成角注 */}
          <article
            className={itemClass(3, "fw-item-boundary")}
            data-state={plainState(3)}
            style={stampVar(3)}
            aria-hidden={plainState(3) === "waiting"}
          >
            <header className="fw-item-head">
              <span className="fw-no hero-num">04</span>
              <h2 className="fw-label">事实边界</h2>
            </header>
            <p className="fw-text">
              这里完成的是<em className="fw-scope-em">业务层面的定位</em>，
              <span className="fw-negation">不展示也不承诺缺陷判定算法</span>。
            </p>
          </article>
        </div>
      </div>
    </div>
  );
}
