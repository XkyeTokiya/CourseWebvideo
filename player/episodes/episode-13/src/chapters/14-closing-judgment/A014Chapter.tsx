import { Fragment } from "react";
import "./A014Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

/** outline Step 映射：narration step → semantic state（S-A014，2 拍一一对应） */
const stateByStep = [
  "series-thread-shown",
  "core-judgment-complete",
] as const;

/** steps 槽：U034 系列线索（S068，reference），ordered-progression 依次落位 */
const THREAD = [
  { no: "01", label: "工业互联网与标识解析" },
  { no: "02", label: "对象与业务环节" },
  { no: "03", label: "产业链协同" },
  { no: "04", label: "典型应用" },
] as const;

/** takeaway 收益：S071（reference），不预告其他模块或分集（C010） */
const GAINS = ["减少重复定制", "降低系统协同和后续维护成本"] as const;

export default function A014Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep.at(-1)!;

  return (
    <div className="scene-pad cj-root" data-state={state}>
      {/* headline：S067 论点标题（可见标题：保留） */}
      <header className="cj-head">
        <h1 className="cj-headline">
          连接器<span className="cj-headline-not">不替代</span>系统
        </h1>
      </header>

      <div className="cj-body">
        {/* R016 汇聚载体：主线带末端向下收进结论条的位置，拍 2 激活 */}
        <span className="cj-drop" aria-hidden="true">
          <span className="cj-drop-arrow" />
        </span>

        {/* steps：系列线索主线带，拍 1 依次落位 */}
        <section className="cj-thread">
          {THREAD.map((item, i) => (
            <Fragment key={item.no}>
              {i > 0 ? (
                <span className={`cj-conn cj-conn-${i}`} aria-hidden="true">
                  <span className="cj-conn-line" />
                  <span className="cj-conn-tip" />
                </span>
              ) : null}
              <div className={`cj-stop cj-stop-${i + 1}`}>
                <span className="cj-stop-no">{item.no}</span>
                <span className="cj-stop-label">{item.label}</span>
              </div>
            </Fragment>
          ))}
        </section>

        {/* support：S069 exact —— 必须逐字完整可见 */}
        <section className="cj-support">
          <span className="cj-quote cj-quote-open" aria-hidden="true">
            「
          </span>
          <p className="cj-support-text">
            统一身份始终服务于跨系统、跨主体的数据协作
          </p>
          <span className="cj-quote cj-quote-close" aria-hidden="true">
            」
          </span>
        </section>

        {/* takeaway：U036 核心判断，成为全片视觉终点 */}
        <section className="cj-takeaway">
          <div className="cj-take-main">
            <span className="cj-take-tag">核心判断</span>
            <p className="cj-take-line cj-take-line-1">
              连接器<b className="cj-take-not">不替代</b>原有系统
            </p>
            <p className="cj-take-line cj-take-line-2">
              让异构数据按照<em className="cj-take-rule">同一套规则</em>流动
            </p>
            {/* 同一套规则的流动演示：异构形状、同速同向 */}
            <div className="cj-lane" aria-hidden="true">
              <span className="cj-glyph cj-glyph-a" />
              <span className="cj-glyph cj-glyph-b" />
              <span className="cj-glyph cj-glyph-c" />
            </div>
          </div>
          <div className="cj-take-side">
            {GAINS.map((gain, i) => (
              <p className={`cj-gain cj-gain-${i + 1}`} key={gain}>
                <span className="cj-gain-mark" aria-hidden="true" />
                {gain}
              </p>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
