import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A007Chapter.css";

const stateByStep = [
  "db-scope-bounded",
  "consistency-served",
  "field-spec-closed",
] as const;

/** S041：被定义的三类数据元素 */
const ELEMENTS = ["表", "字段", "数据类型"] as const;

export default function A007Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const servedOn = step >= 1;
  const closedOn = step >= 2;

  const rootCls = [
    "dd-scene",
    "scene-pad",
    servedOn && "is-served",
    closedOn && "is-closed",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootCls} data-state={state}>
      <header className="dd-head">
        <h1 className="dd-headline">
          数据字典：<em>数据库内的字段规范</em>
        </h1>
        <div className="dd-head-rule rule" />
      </header>

      <div className="dd-body">
        <div className="dd-bands">
          <section className="dd-band dd-band--scope">
            <div className="dd-band-head">
              <span className="dd-band-idx">01</span>
              <p className="dd-band-kicker">适用范围</p>
            </div>
            <p className="dd-band-hero">
              在<em>数据库之内</em>
            </p>
            <div className="dd-fence" aria-hidden="true">
              <span className="dd-fence-label">数据库边界</span>
            </div>
          </section>

          <div className="dd-arrow" aria-hidden="true">
            <span className="dd-arrow-line" />
            <span className="dd-arrow-tip" />
          </div>

          <section className="dd-band dd-band--define">
            <div className="dd-band-head">
              <span className="dd-band-idx">02</span>
              <p className="dd-band-kicker">被定义的对象</p>
            </div>
            <ul className="dd-elements">
              {ELEMENTS.map((name, index) => (
                <li
                  key={name}
                  className="dd-element"
                  style={{ "--dd-i": index } as CSSProperties}
                >
                  {name}
                </li>
              ))}
            </ul>
            <p className="dd-band-note">
              这些数据元素的集合
              <br />
              为它们做定义、给描述
            </p>
          </section>
        </div>

        <aside className="dd-side">
          <section className="dd-note dd-note--served">
            <p className="dd-note-kicker">它服务的对象</p>
            <p className="dd-note-hero">
              数据库的<em>一致性</em>和<em>完整性</em>
            </p>
            <ul className="dd-note-list">
              <li>口径保持一致</li>
              <li>内容完整不出差错</li>
              <li>为设计和维护提供依据</li>
            </ul>
          </section>

          <section className="dd-note dd-note--manual">
            <p className="dd-note-kicker">可以把它看作</p>
            <p className="dd-note-hero">
              一本可以随时翻查的<em>字段规范手册</em>
            </p>
          </section>

          <section className="dd-note dd-note--answer">
            <p className="dd-note-kicker">它回答的问题</p>
            <p className="dd-note-hero">
              数据库里的表和字段
              <br />
              <em>应该怎么定义</em>
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
