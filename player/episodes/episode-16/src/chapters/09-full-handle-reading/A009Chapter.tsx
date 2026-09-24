import "./A009Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import M004 from "./assets/M004.png";

/**
 * A009 · 完整示例 —— image-with-reading-notes
 * 教材示例原图持续在场作为证据，读图序按分段拼接的横向顺序读取
 * 前缀 / 斜杠 / 后缀（R009 载体），要点区按层级拆读前缀，
 * takeaway 收束「谁管 / 管哪一个」。
 * 受保护示例串逐字原样出现；斜杠只作分隔段，不作网址或接口路径解释。
 * step（0 基）→ semantic state（handoff steps[].scene_state，1 基）。
 */
const stateByStep = [
  "assembly-goal-set",
  "string-assembled",
  "prefix-decomposed",
  "reading-summarized",
] as const;

type A009State = (typeof stateByStep)[number];

/** 受保护示例串：逐字原样，不改写 */
const PREFIX = "86.100.12";
const SUFFIX = "00121336401058520109";
const FULL_HANDLE = "86.100.12/00121336401058520109";

/** 前缀层级拆读：代码逐级生长，新增段用强调色 */
const LEVELS = [
  { head: "86", tail: "", level: "国家这一级" },
  { head: "86", tail: ".100", level: "行业这一级" },
  { head: "86.100", tail: ".12", level: "这一级里的企业" },
] as const;

const READ_ORDER = ["前缀", "斜杠", "后缀"] as const;

export default function A009Chapter({ step }: ChapterStepProps) {
  const state: A009State = stateByStep[step] ?? stateByStep.at(-1)!;

  return (
    <div className="scene-pad fh-root" data-state={state}>
      <header className="fh-header">
        <span className="fh-header-mark" aria-hidden="true" />
        <h1 className="fh-headline">读懂一串完整的 Handle</h1>
      </header>

      <div className="fh-track-zone">
        <div className="fh-track">
          <div className="fh-slot fh-slot--prefix">
            <span className="fh-code">{PREFIX}</span>
            <span className="fh-slot-label">前缀</span>
          </div>
          <div className="fh-slash">
            <span className="fh-code fh-code--slash">/</span>
            <span className="fh-slot-label">斜杠</span>
          </div>
          <div className="fh-slot fh-slot--suffix">
            <span className="fh-code">{SUFFIX}</span>
            <span className="fh-slot-label">后缀</span>
          </div>
        </div>
        <div className="fh-joined">
          <p className="fh-joined-goal">两部分拼起来，读出完整的 Handle</p>
          <div className="fh-joined-row">
            <span className="fh-joined-tag">连成完整标识</span>
            <span className="fh-joined-string">{FULL_HANDLE}</span>
          </div>
        </div>
      </div>

      <div className="fh-main">
        <div className="fh-evidence">
          <figure className="fh-plate">
            <img
              className="fh-plate-img"
              src={M004}
              alt="教材中的 Handle 编码示例原图（占位图）"
            />
            <figcaption className="fh-plate-caption">
              <span className="fh-plate-badge">教材示例原图</span>
              <span className="fh-plate-note">占位图 · 正式版为教材扫描件</span>
            </figcaption>
          </figure>
          <div className="fh-order">
            {READ_ORDER.map((name, i) => (
              <div className="fh-order-item" key={name}>
                <span className="fh-order-num">{i + 1}</span>
                <span className="fh-order-name">{name}</span>
                {i < READ_ORDER.length - 1 ? (
                  <span className="fh-order-arrow" aria-hidden="true" />
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="fh-points">
          <p className="fh-points-lead">前缀按层级拆开读</p>
          {LEVELS.map((lv) => (
            <div className="fh-point" key={lv.level}>
              <span className="fh-point-code">
                {lv.head}
                {lv.tail ? <span className="fh-point-tail">{lv.tail}</span> : null}
              </span>
              <span className="fh-point-dash" aria-hidden="true" />
              <span className="fh-point-level">{lv.level}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="fh-takeaway">
        <div className="fh-half">
          <span className="fh-swatch fh-swatch--who" aria-hidden="true" />
          <p className="fh-half-text">前半段 · 说明谁管</p>
        </div>
        <span className="fh-divider" aria-hidden="true" />
        <div className="fh-half">
          <span className="fh-swatch fh-swatch--which" aria-hidden="true" />
          <p className="fh-half-text">后半段 · 说明管哪一个</p>
        </div>
      </div>
    </div>
  );
}
