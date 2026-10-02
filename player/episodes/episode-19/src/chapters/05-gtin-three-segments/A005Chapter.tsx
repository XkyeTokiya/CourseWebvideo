import "./A005Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import M002 from "./assets/M002.png";

/**
 * 05-gtin-three-segments · A005（教材读图页 · image-with-reading-notes）
 * step → semantic state 显式映射，末态兜底（outline S-A005）：
 * - sample-displayed：教材图落位并保持，示例串完整点亮，三段括线就位
 * - manufacturer-segment-read：前段点亮 + 注释"厂商识别代码：归属哪家厂商"，其余段保持待读
 * - item-segment-read：保持前段注释，中段点亮 + 注释"商品项目代码：区分具体商品项目"
 * - check-digit-read：保持前两段注释，末段点亮 + 注释"校验码：校验编号对不对"
 * - three-segments-readable：三段全部稳定点亮，读法收束行落位
 *
 * 视觉主体：一次"读图"演示——教材原图在上持续不卸载（M002 占位，待提供真图），
 * 下方大号示例串固定在下，括线把一串数字切成三段，注释焦点逐段迁移
 * （persistent-media-reading），读法收束行收在底部。
 */
const stateByStep = [
  "sample-displayed",
  "manufacturer-segment-read",
  "item-segment-read",
  "check-digit-read",
  "three-segments-readable",
] as const;

type A005State = (typeof stateByStep)[number];

/** 示例串分段：6901234 / 56789 / 2 —— exact：6901234567892（G016–G019） */
const SEGMENTS = [
  { id: "manufacturer", digits: "6901234", label: "厂商识别代码", note: "归属哪家厂商" },
  { id: "item", digits: "56789", label: "商品项目代码", note: "区分具体商品项目" },
  { id: "check", digits: "2", label: "校验码", note: "校验编号对不对" },
] as const;

export default function A005Chapter({ step }: ChapterStepProps) {
  const state: A005State = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad gt-root" data-state={state}>
      <header className="gt-header">
        <h1 className="gt-headline">GTIN 的三段结构</h1>
        <p className="gt-lead">用一个示例，把 GTIN 的结构读出来</p>
      </header>

      <figure className="gt-textbook">
        <img
          className="gt-textbook-img"
          src={M002}
          alt="教材 GTIN 示例结构原图（图 2-7，占位，待提供原始图）"
        />
        <figcaption className="gt-textbook-caption">
          <span className="gt-textbook-badge">教材示例结构原图</span>
          <span className="gt-textbook-note">图 2-7 · 原始证据待提供 · 占位</span>
        </figcaption>
      </figure>

      <p className="gt-sample" aria-label="示例串 6901234567892，分成三段">
        {SEGMENTS.map((seg) => (
          <span className={`gt-seg gt-seg-${seg.id}`} key={seg.id}>
            <span className="gt-seg-digits">{seg.digits}</span>
            <svg className="gt-seg-bracket" viewBox="0 0 100 14" preserveAspectRatio="none" aria-hidden="true">
              <path className="gt-seg-bracket-path" d="M1 1 H99 M50 1 V13" />
            </svg>
            <span className="gt-seg-label">{seg.label}</span>
            <span className="gt-seg-note">{seg.note}</span>
          </span>
        ))}
      </p>

      <div className="gt-readline">
        <p className="gt-readline-text">
          <span className="gt-readline-lead">看懂这三段</span>
          <span className="gt-readline-key">再看类似的商品编号，就知道每一截在说什么</span>
        </p>
      </div>
    </div>
  );
}
