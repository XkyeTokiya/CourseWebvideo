import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./AnchorGroups.css";

/**
 * A006 · common-anchor-association-groups
 * mechanism: anchor-group-nesting（本章新命名机制）
 *   五类信息通过邻近、围合与共享"同一发动机"标签形成关联组（R011）：
 *   共享锚点铭牌压在围合虚线框上沿，五张同构卡在区内等权就位，
 *   围合区一次收拢；不用星状连线、辐射节点或数据流。
 *   支撑说明组与作用范围组是围合区之后的独立阅读层，不与五类信息卡
 *   混层（R012/R013），出现后保持，正常阅读层级不以小字弱化。
 * step 0 → anchor-group-assembled  锚点铭牌 + 五卡等权组装 + 围合收拢
 *          （同拍内一次围合呈现，顿号枚举不机械拆分；围合组入场 ≤3s）
 * step 1 → platform-support-noted  围合组保持；支撑说明层出现（R012）
 * step 2 → platform-bounded        前序保持；作用范围层出现（R013）
 */
const stateByStep = [
  "anchor-group-assembled",
  "platform-support-noted",
  "platform-bounded",
] as const;

type AnchorGroupsState = (typeof stateByStep)[number];

/* group-5：五类信息，同构等权；完成后不留当前选中项 */
const INFO_GROUPS = [
  "产品基本信息",
  "生产装配信息",
  "工艺控制信息",
  "质量管理信息",
  "物流存储信息",
] as const;

export default function AnchorGroups({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const supportOn = state !== "anchor-group-assembled";
  const scopeOn = state === "platform-bounded";

  return (
    <div className="ag-scene scene-pad">
      <h1 className="ag-thesis">
        <em className="ag-thesis-cond">先对齐同一发动机标识</em>
        ，五类信息才获得<em className="ag-thesis-res">共同归属</em>
      </h1>

      <section className="ag-enclosure" aria-label="共享锚点围合关联组">
        <header className="ag-anchor-plate">
          <span className="ag-anchor-kicker">共享锚点</span>
          <p className="ag-anchor-name">同一发动机标识</p>
        </header>

        <div className="ag-cards">
          {INFO_GROUPS.map((name, i) => (
            <article
              key={name}
              className="ag-info card"
              style={{ "--ag-i": String(i) } as CSSProperties}
            >
              <span className="ag-info-no hero-num">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="ag-info-name">{name}</h2>
              <span className="ag-info-mark" aria-hidden="true" />
            </article>
          ))}
        </div>

        <p className="ag-enclosure-note">
          <span className="ag-note-mark" aria-hidden="true" />
          五类信息在同一围合区内按共同归属读取。
        </p>
      </section>

      <div className="ag-layers">
        <p
          className={`ag-layer${supportOn ? " is-on" : ""}`}
          data-kind="support"
          aria-hidden={!supportOn}
        >
          <span className="ag-layer-key">支撑说明</span>
          <span className="ag-layer-text">
            企业标识解析二级节点平台支持不同环节
            <em className="ag-em-anchor">依据同一发动机标识</em>
            查找相关记录。
          </span>
        </p>

        <p
          className={`ag-layer${scopeOn ? " is-on" : ""}`}
          data-kind="scope"
          aria-hidden={!scopeOn}
        >
          <span className="ag-layer-key">作用范围</span>
          <span className="ag-layer-text">
            二级节点承担关联和解析支撑，
            <em className="ag-em-bound">不集中保存企业全部业务数据</em>。
          </span>
        </p>
      </div>
    </div>
  );
}
