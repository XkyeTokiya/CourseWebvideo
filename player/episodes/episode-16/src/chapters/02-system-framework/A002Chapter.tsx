import "./A002Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

const stateByStep = [
  "system-framed",
  "parts-annotated",
  "not-a-string",
  "duties-mapped",
  "order-established",
] as const;

type A002State = (typeof stateByStep)[number];

/** 三部分围合同一锚点：等权积累，落位方向由围合位置决定（R002 载体） */
const PARTS = [
  { key: "code", pos: "left", index: "01", name: "编码规则", note: null, duty: "标明身份" },
  { key: "gov", pos: "bottom", index: "02", name: "管理体系", note: "分布式管理架构", duty: "分配命名空间" },
  { key: "resolve", pos: "right", index: "03", name: "解析体系", note: "独立于互联网域名系统", duty: "把标识和对象信息联系起来" },
] as const;

/** 机制先后：范围边界收束的三段顺序 */
const ORDER_STAGES = [
  { marker: "先", text: "确定谁来管一段前缀" },
  { marker: "再", text: "确定组织内部怎样区分具体对象" },
  { marker: "最后", text: "通过完整标识去访问信息" },
] as const;

/** 体系锚点：中心枢纽向三个围合位伸出端口 */
function AnchorGlyph() {
  return (
    <svg className="sf-anchor-glyph" viewBox="0 0 96 76" aria-hidden="true">
      <circle cx="48" cy="34" r="14" fill="none" stroke="currentColor" strokeWidth="4" />
      <circle cx="48" cy="34" r="4.5" fill="currentColor" />
      <path
        d="M34 34H16M62 34h18M48 48v14"
        fill="none"
        stroke="currentColor"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
      <circle cx="11" cy="34" r="5" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="85" cy="34" r="5" fill="none" stroke="currentColor" strokeWidth="3" />
      <circle cx="48" cy="68" r="5" fill="none" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}

/** 带斜杠的字符串（示意块，非真实字符）；划除线在进入态绘制 */
function SlashStringGlyph() {
  return (
    <svg className="sf-slashglyph" viewBox="0 0 220 64" aria-hidden="true">
      <rect x="6" y="14" width="44" height="36" fill="none" stroke="currentColor" strokeWidth="3" />
      <rect x="88" y="14" width="44" height="36" fill="none" stroke="currentColor" strokeWidth="3" />
      <rect x="170" y="14" width="44" height="36" fill="none" stroke="currentColor" strokeWidth="3" />
      <path
        d="M60 50 74 14M142 50 156 14"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <path
        className="sf-slashglyph-strike"
        pathLength={1}
        d="M4 56 216 8"
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function A002Chapter({ step }: ChapterStepProps) {
  const state: A002State = stateByStep[step] ?? stateByStep.at(-1)!;
  return (
    <div className="scene-pad sf-root" data-state={state}>
      <header className="sf-header">
        <h1 className="sf-headline">Handle：编码、管理、解析三部分合一的体系</h1>
        <span className="sf-header-rule" aria-hidden="true" />
      </header>

      <div className="sf-frame">
        <div className="sf-anchor">
          <span className="sf-link sf-link-left" aria-hidden="true" />
          <span className="sf-link sf-link-bottom" aria-hidden="true" />
          <span className="sf-link sf-link-right" aria-hidden="true" />
          <AnchorGlyph />
          <p className="sf-anchor-name">Handle 体系</p>
          <p className="sf-anchor-note">不只是编码规则</p>
        </div>

        {PARTS.map((part) => (
          <section className={`sf-part sf-part-${part.pos}`} key={part.key}>
            <div className="sf-part-head">
              <span className="sf-part-index">{part.index}</span>
              <h2 className="sf-part-name">{part.name}</h2>
            </div>
            {part.note ? (
              <p className="sf-part-note">{part.note}</p>
            ) : (
              <div className="sf-part-note-slot" aria-hidden="true" />
            )}
            <p className="sf-part-duty">
              <span className="sf-part-duty-verb">负责</span>
              {part.duty}
            </p>
          </section>
        ))}
      </div>

      <div className="sf-support">
        <div className="sf-support-glyph">
          <SlashStringGlyph />
          <span className="sf-support-glyph-tag">示意</span>
        </div>
        <p className="sf-support-text">Handle 不能当成一串带斜杠的字符来背</p>
      </div>

      <div className="sf-scope">
        <p className="sf-scope-label">机制有了先后</p>
        <div className="sf-scope-stages">
          {ORDER_STAGES.map((stage, i) => (
            <div className="sf-order-step" key={stage.marker}>
              <span className="sf-order-marker">{stage.marker}</span>
              <span className="sf-order-text">{stage.text}</span>
              {i < ORDER_STAGES.length - 1 && (
                <span className="sf-order-chevron" aria-hidden="true" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
