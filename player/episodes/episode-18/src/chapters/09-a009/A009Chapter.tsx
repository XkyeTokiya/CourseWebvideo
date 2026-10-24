import "./A009Chapter.css";
import m003Src from "./assets/M003.png";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

/**
 * 09-reading-example · 示例阅读页（outline §9 · S-A009 ·
 * image-with-reading-notes，parallel-then-converge）
 * 持续阅读场景：教材原图持续作阅读锚点，阅读顺序注记沿图侧逐段标注；
 * 连续写法栏与原图并列呈现，读法收束行最后归并全页。示例只作阅读
 * 练习，不作真实注册标识或可扫描码。
 * step → semantic state 显式映射（0 基，末态兜底）：
 * - segments-read：原图引入，顺序注记逐段标注三段职责（step 1）
 * - order-explained：保持原图与注记，补充"三段顺序是一份说明"
 *   （step 2）
 * - continuous-form-shown：连续写法栏并列落位（step 3，
 *   R018 由示例页对连续写法的同一读法承载）
 * - reading-converged：读法收束行聚合"先认职责，再看落业务"
 *   （step 4，R019 由两栏并列向同一读法的聚合承载）
 * 护栏：示例字符串只作阅读练习，不制成可扫描码、注册结果或接口参数。
 */
const stateByStep = [
  "segments-read",
  "order-explained",
  "continuous-form-shown",
  "reading-converged",
] as const;

type A009State = (typeof stateByStep)[number];

const STAGE_ORDER: Record<A009State, number> = {
  "segments-read": 0,
  "order-explained": 1,
  "continuous-form-shown": 2,
  "reading-converged": 3,
};

/** 阅读顺序注记（G029） */
const NOTES = [
  { label: "开头", value: "0", duty: "表示版本" },
  { label: "中间", value: "0001", duty: "表示编码体系标识" },
  { label: "结尾", value: "6901234567892", duty: "表示主码" },
] as const;

export default function A009Chapter({ step }: ChapterStepProps) {
  const state: A009State =
    stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const at = STAGE_ORDER[state];

  const orderOn = at >= 1;
  const continuousOn = at >= 2;
  const convergeOn = at >= 3;

  return (
    <div className="ku-root" data-state={state}>
      <header className="ku-head">
        <h1 className="ku-headline">
          示例：<em>按三段</em>读一条 Ecode
        </h1>
      </header>

      <div className="ku-main">
        <figure className="ku-image">
          <img src={m003Src} alt="教材中一条 Ecode 示例的三段标注" />
          <figcaption className="ku-image-note">
            素材占位 · 教材示例原图待提供（阅读练习用，不作注册标识）
          </figcaption>
        </figure>

        <div className="ku-rail">
          <ul className="ku-notes">
            {NOTES.map((note, index) => (
              <li
                key={note.label}
                className="ku-note"
                style={{ "--ku-i": index } as React.CSSProperties}
              >
                <span className="ku-note-label">{note.label}</span>
                <span className="ku-note-value">{note.value}</span>
                <span className="ku-note-duty">{note.duty}</span>
              </li>
            ))}
          </ul>

          <p className={`ku-order${orderOn ? " is-on" : ""}`}>
            <b>三段的顺序</b>，就是一份说明：先按哪个结构读，再放进哪个体系
          </p>
        </div>
      </div>

      <section className={`ku-continuous${continuousOn ? " is-on" : ""}`}>
        <p className="ku-continuous-kicker">连续写法——</p>
        <p className="ku-continuous-code">
          <span className="ku-cv">0</span>
          <span className="ku-ns">0001</span>
          <span className="ku-md">6901234567892</span>
        </p>
      </section>

      <div className={`ku-converge${convergeOn ? " is-on" : ""}`}>
        <span className="ku-converge-line" aria-hidden="true" />
        <p className="ku-converge-text">
          两种写法不一样，<b>读法却是一回事</b>：先认出三段职责，再看落到业务
        </p>
      </div>
    </div>
  );
}
