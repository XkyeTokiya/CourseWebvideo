import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A009Chapter.css";

const stateByStep = ["four-questions-parallel", "duty-framed"] as const;

/** S051–S054：四条判断问句，等权、不排先后、不标注概念名 */
const QUESTIONS = [
  "对象是谁",
  "对象经历了什么",
  "相关数据是什么意思、从哪里来、怎样关联",
  "数据库里的表和字段怎样定义",
] as const;

export default function A009Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const framedOn = step >= 1;

  const rootCls = ["qt-scene", "scene-pad", framedOn && "is-framed"]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootCls} data-state={state}>
      <header className="qt-head">
        <h1 className="qt-headline">
          四种职责<em>并排</em>
        </h1>
        <div className="qt-head-rule rule" />
      </header>

      <div className="qt-body">
        <div className="qt-bands">
          {QUESTIONS.map((question, index) => (
            <article
              key={question}
              className="qt-band"
              style={{ "--qt-i": index } as CSSProperties}
            >
              <span className="qt-band-no">{String(index + 1).padStart(2, "0")}</span>
              <p className="qt-band-q">{question}</p>
            </article>
          ))}
        </div>

        <aside className="qt-side">
          <span className="qt-side-reserve" aria-hidden="true" />
          <div className="qt-side-plate">
            <p className="qt-side-kicker">它们是</p>
            <p className="qt-side-hero">
              观察工业数据的
              <br />
              <em>四种职责</em>
            </p>
            <p className="qt-side-note">
              不是互相替代的几个仓库
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
