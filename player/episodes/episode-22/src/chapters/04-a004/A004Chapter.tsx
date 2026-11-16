import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A004Chapter.css";
import m002 from "./assets/m002.png";

const stateByStep = [
  "entity-baseline-set",
  "three-properties-set",
  "stability-qualified",
] as const;

/** S021：企业需要反复打交道、反复确认身份的对象 */
const ENTITIES = ["物料", "设备", "客户", "供应商", "产品", "员工"] as const;

/** S022–S024：三个等权特性 */
const PROPERTIES = ["唯一识别", "相对稳定", "跨部门跨系统共享"] as const;

export default function A004Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const propsOn = step >= 1;
  const boundaryOn = step >= 2;

  const rootCls = [
    "md-scene",
    "scene-pad",
    propsOn && "is-props",
    boundaryOn && "is-boundary",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootCls} data-state={state}>
      <header className="md-head">
        <h1 className="md-headline">
          主数据：<em>核心业务实体的基准</em>
        </h1>
        <div className="md-head-rule rule" />
      </header>

      <div className="md-body">
        <figure className="md-media">
          <div className="md-media-strip">
            <span className="md-media-name">同一台设备 · 不同岗位查看</span>
            <span className="md-media-missing">M002 · 待提供</span>
          </div>
          <div className="md-media-plate">
            <img
              className="md-media-shot"
              src={m002}
              alt="设备工作语境占位图（M002 待提供）"
            />
          </div>
        </figure>

        <div className="md-rails">
          <section className="md-rail md-rail--def">
            <span className="md-rail-idx">01</span>
            <div className="md-rail-body">
              <p className="md-rail-kicker">基准数据</p>
              <p className="md-rail-hero">围绕核心业务实体转</p>
              <ul className="md-def-list">
                <li>高价值基准数据</li>
                <li>关于一个对象的公认基本事实</li>
              </ul>
            </div>
          </section>

          <section className="md-rail md-rail--entity">
            <span className="md-rail-idx">02</span>
            <div className="md-rail-body">
              <p className="md-rail-kicker">什么叫核心业务实体</p>
              <p className="md-rail-sub">需要反复打交道、反复确认身份的对象</p>
              <ul className="md-entities">
                {ENTITIES.map((name, index) => (
                  <li
                    key={name}
                    className="md-entity"
                    style={{ "--md-i": index } as CSSProperties}
                  >
                    {name}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="md-rail md-rail--props">
            <span className="md-rail-idx">03</span>
            <div className="md-rail-body">
              <div className="md-props-head">
                <p className="md-rail-kicker">三个特性</p>
              </div>

              <ul className="md-props">
                {PROPERTIES.map((name, index) => (
                  <li
                    key={name}
                    className="md-prop"
                    style={{ "--md-p": index } as CSSProperties}
                  >
                    <span className="md-prop-no">{String(index + 1).padStart(2, "0")}</span>
                    <span className="md-prop-name">{name}</span>
                  </li>
                ))}
              </ul>

              <div className="md-boundary">
                <p className="md-boundary-hero">
                  稳定是<em>相对的</em>
                  <br />
                  不等于永远不变
                </p>
                <p className="md-boundary-note">
                  设备参数变了
                  <br />
                  设备的基准信息照样要跟着改
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
