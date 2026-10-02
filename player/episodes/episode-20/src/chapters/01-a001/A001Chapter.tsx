import "./A001Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import M001 from "./assets/M001.png";

/**
 * 01-a001 · 标题与问题页（outline §1 · S-A001）
 * 全屏标题由 00-cover 承担：本章标题只作顶部窄条弱权重，画面主体是
 * 四环节记录卡组 + 匿名车间场景图，问题条在第二拍成为中心。
 * step → semantic state 显式映射（0 基，允许重复，末态兜底）：
 * - records-multiplied：四条记录线逐条点亮，场景图铺底（A001 · step 1）
 * - question-dominant：记录线向下汇聚，问题条升为中心焦点（A001 · step 2）
 */
const stateByStep = [
  "records-multiplied",
  "question-dominant",
] as const;

type A001State = (typeof stateByStep)[number];

/** U002 · issue-cards：四个环节各留一条记录；C002 护栏下不出现可读编码 */
const STAGES = ["生产", "出库", "运输", "售后"] as const;

export default function A001Chapter({ step }: ChapterStepProps) {
  const state: A001State =
    stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad oa-root" data-state={state}>
      <header className="oa-strip">
        <p className="oa-strip-label">本集主线</p>
        <h1 className="oa-strip-title">
          从前缀到后缀：设计一套可落地的编码规则
        </h1>
        <div className="oa-axis" aria-label="前缀与后缀两条主线（R001 并列）">
          <span className="oa-axis-tag">前缀 · 交代管理范围</span>
          <span className="oa-axis-slash" aria-hidden="true">
            /
          </span>
          <span className="oa-axis-tag">后缀 · 承载对象差异</span>
        </div>
      </header>

      <div className="oa-main">
        <div className="oa-cards">
          {STAGES.map((stage, index) => (
            <div className="oa-card" key={stage}>
              <span className="oa-card-no">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="oa-card-stage">{stage}</span>
              <span className="oa-card-line">留下一条记录</span>
            </div>
          ))}
        </div>

        <figure className="oa-media">
          <img
            className="oa-media-img"
            src={M001}
            alt="匿名车间与跨环节记录语境（占位图，无编码与企业标识）"
          />
          <figcaption className="oa-media-note">
            <span className="oa-media-badge">跨环节记录场景</span>
            <span className="oa-media-tag">占位图</span>
          </figcaption>
        </figure>
      </div>

      <div className="oa-question">
        <span className="oa-question-kicker">记录一多，真正的麻烦</span>
        <p className="oa-question-line">
          这些记录怎么证明它们说的是<b>同一个对象</b>？
        </p>
      </div>
    </div>
  );
}
