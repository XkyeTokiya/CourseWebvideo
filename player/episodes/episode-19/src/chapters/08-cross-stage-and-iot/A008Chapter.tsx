import "./A008Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import M004 from "./assets/M004.png";

/**
 * 08-cross-stage-and-iot · A008（对照筛选页 · image-with-insight-rail）
 * step → semantic state 显式映射，末态兜底（outline S-A008）：
 * - identity-context-mapped：标题区与现场图落位，对照区落位 VAA 情境行
 *   （供应商、制造、维护间保持同一身份，看供应链与生命周期语境，留意跨环节关联与内部细分）
 * - two-alternatives-mapped：保持 VAA 行，对照区补落 Handle（数字资产）与 OID（网络资源），三行并列
 * - screening-boundary-stated：三行保持，筛选说明落位，补多映射边界
 * - iot-candidate-entered：条件行落位，Ecode 候选行按承接顺序落位（R025 sequence）
 *
 * 视觉主体：一次"候选筛选"演示——对照区三行是情境候选台，
 * 拍 4 把 Ecode 名牌沿承接线放进候选托盘，收在"再核对已有编码"。
 */
const stateByStep = [
  "identity-context-mapped",
  "two-alternatives-mapped",
  "screening-boundary-stated",
  "iot-candidate-entered",
] as const;

type A008State = (typeof stateByStep)[number];

export default function A008Chapter({ step }: ChapterStepProps) {
  const state: A008State = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad ci-root" data-state={state}>
      <header className="ci-header">
        <h1 className="ci-headline">跨环节、数字资产与物联网情境</h1>
        <p className="ci-lead">再换一种对象</p>
      </header>

      <div className="ci-main">
        <div className="ci-compare" aria-label="对照区三行候选语境">
          <article className="ci-row ci-row-vaa">
            <span className="ci-row-system">VAA</span>
            <p className="ci-row-body">
              <span className="ci-row-key">供应商、制造企业、维护环节之间保持同一个身份</span>
              <span className="ci-row-note">看供应链与生命周期语境：留意跨环节的关联，也留意企业内部怎么细分</span>
            </p>
          </article>
          <article className="ci-row ci-row-handle">
            <span className="ci-row-system">Handle</span>
            <p className="ci-row-body">
              <span className="ci-row-key">主要对象是数字资产</span>
              <span className="ci-row-note">数字资产管理语境</span>
            </p>
          </article>
          <article className="ci-row ci-row-oid">
            <span className="ci-row-system">OID</span>
            <p className="ci-row-body">
              <span className="ci-row-key">主要对象是网络资源</span>
              <span className="ci-row-note">网络资源管理语境</span>
            </p>
          </article>

          <div className="ci-screen" aria-label="筛选说明与多映射边界">
            <p className="ci-screen-text">
              <span className="ci-screen-key">这两类语境能帮我们先排除明显不匹配的候选</span>
              <span className="ci-screen-note">一个对象完全可以同时挂在不同的系统里，各有各的映射</span>
            </p>
          </div>

          <div className="ci-iot" aria-label="物联网条件行与候选行">
            <svg className="ci-iot-svg" viewBox="0 0 60 88" preserveAspectRatio="none" aria-hidden="true">
              <line className="ci-iot-link" x1="30" y1="2" x2="30" y2="86" />
            </svg>
            <p className="ci-condition">
              <span className="ci-condition-tag">物联网这一路</span>
              <span className="ci-condition-text">
                物流、仓储、生产制造这些环境，要求物联网对象有标准化的表达
              </span>
            </p>
            <p className="ci-candidate">
              <span className="ci-candidate-chip">Ecode</span>
              <span className="ci-candidate-tray">放进候选集合</span>
              <span className="ci-candidate-note">再核对企业已有的编码和跨系统的关系</span>
            </p>
          </div>
        </div>

        <figure className="ci-scene">
          <img
            className="ci-scene-img"
            src={M004}
            alt="物流、仓储、生产制造匿名环境图（占位，待提供生成图）"
          />
          <figcaption className="ci-scene-caption">
            <span className="ci-scene-badge">物流 · 仓储 · 生产制造</span>
            <span className="ci-scene-note">匿名教学场景 · 占位</span>
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
