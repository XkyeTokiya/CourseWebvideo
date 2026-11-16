import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A006Chapter.css";
import m003 from "./assets/m003.png";

const stateByStep = [
  "data-about-data",
  "scope-listed",
  "traits-summarized",
  "management-role-set",
] as const;

/** S034：七项描述范围，一次性等权铺开 */
const SCOPE = ["名称", "类型", "业务域", "取值", "关系", "规则", "来源"] as const;

/** S035–S036：五个特点与逐项释义 */
const TRAITS = [
  { name: "描述性", gloss: "天生用来讲别的数据" },
  { name: "共享性", gloss: "可以在不同部门通用" },
  { name: "结构化", gloss: "组织方式比较固定" },
  { name: "动态性", gloss: "会随数据一起变化" },
  { name: "多样性", gloss: "形式多种多样" },
] as const;

/** S037：四个核心管理动作 */
const ACTIONS = ["创建", "存储", "整合", "控制"] as const;

export default function A006Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const scopeOn = step >= 1;
  const traitsOn = step >= 2;
  const mgmtOn = step >= 3;

  const rootCls = [
    "mt-scene",
    "scene-pad",
    scopeOn && "is-scope",
    traitsOn && "is-traits",
    mgmtOn && "is-mgmt",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootCls} data-state={state}>
      <header className="mt-head">
        <h1 className="mt-headline">
          元数据：<em>关于数据的数据</em>
        </h1>
        <div className="mt-head-rule rule" />
      </header>

      <div className="mt-body">
        <figure className="mt-media">
          <div className="mt-media-strip">
            <span className="mt-media-name">梳理字段含义</span>
            <span className="mt-media-missing">M003 · 待提供</span>
          </div>
          <div className="mt-media-plate">
            <img
              className="mt-media-shot"
              src={m003}
              alt="数据管理人员梳理字段含义的占位图（M003 待提供）"
            />
          </div>
        </figure>

        <div className="mt-rails">
          <section className="mt-rail mt-rail--def">
            <div className="mt-rail-head">
              <span className="mt-rail-idx">01</span>
              <p className="mt-rail-kicker">经典说法</p>
            </div>
            <div className="mt-rail-content">
              <p className="mt-rail-hero">
                不围着<em>某一条记录</em>打转
              </p>
              <p className="mt-rail-sub">说明这些数据本身的意思和上下文</p>
            </div>
          </section>

          <section className="mt-rail mt-rail--scope">
            <div className="mt-rail-head">
              <span className="mt-rail-idx">02</span>
              <p className="mt-rail-kicker">描述的范围</p>
            </div>
            <div className="mt-rail-content">
              <ol className="mt-scope">
                {SCOPE.map((name, index) => (
                  <li
                    key={name}
                    className="mt-scope-item"
                    style={{ "--mt-i": index } as CSSProperties}
                  >
                    <span className="mt-scope-name">{name}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          <section className="mt-rail mt-rail--traits">
            <div className="mt-rail-head">
              <span className="mt-rail-idx">03</span>
              <p className="mt-rail-kicker">五个特点</p>
            </div>
            <div className="mt-rail-content">
              <ul className="mt-traits">
                {TRAITS.map((trait, index) => (
                  <li
                    key={trait.name}
                    className="mt-trait"
                    style={{ "--mt-t": index } as CSSProperties}
                  >
                    <span className="mt-trait-name">{trait.name}</span>
                    <span className="mt-trait-gloss">{trait.gloss}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>

      <div className="mt-judgment">
        <span className="mt-judgment-reserve" aria-hidden="true" />
        <div className="mt-judgment-plate">
          <div className="mt-actions">
            <p className="mt-actions-kicker">元数据管理</p>
            <p className="mt-actions-row">
              {ACTIONS.map((action) => (
                <span key={action} className="mt-action">
                  {action}
                </span>
              ))}
            </p>
          </div>

          <div className="mt-effects">
            <p className="mt-effects-kicker">它帮我们</p>
            <ul className="mt-effects-list">
              <li>弄清数据的含义</li>
              <li>看清上下游关系</li>
              <li>更准确地定位到要找的数据</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
