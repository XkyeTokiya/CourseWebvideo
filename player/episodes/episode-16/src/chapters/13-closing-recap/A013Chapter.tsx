import "./A013Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

/**
 * A013 · 收束回扣 —— split-compare-with-thesis
 * 左栏承载旅程回扣与机制收束，右栏承载同一块电池锚点与共同规律，
 * 底部统一结论条汇合最终判断（R012 载体）；回扣开场电池，不预告任何后续内容。
 * step（0 基）→ semantic state（handoff steps[].scene_state，1 基）。
 */
const stateByStep = [
  "callback-established",
  "mechanism-condensed",
  "entry-stabilized",
  "pattern-stated",
  "thesis-landed",
] as const;

type A013State = (typeof stateByStep)[number];

/** 旅程五站：来自批准口拍 1，示意行程，不指向真实单据 */
const STOPS = ["工厂", "运输", "装配", "维护", "回收"] as const;

/** 机制收成一句：前缀 / 后缀 / 完整标识各管什么 */
const MECH = [
  { part: "前缀", does: "定位组织和管理范围" },
  { part: "后缀", does: "识别组织内部的具体对象" },
  { part: "完整标识", does: "通过解析体系连接对象信息" },
] as const;

/** 内容留在原处：各环节的记录仍留在各环节（示意） */
const STAY = ["工厂", "运输", "维护"] as const;

/** 抽象身份符号：条码状竖线，示意那串字符 */
function CodeGlyph() {
  return (
    <svg className="cr-codeglyph" viewBox="0 0 150 34" aria-hidden="true">
      <path
        d="M6 3v28M15 3v28M20 3v28M34 3v28M48 3v28M56 3v28M72 3v28M84 3v28M90 3v28M106 3v28M118 3v28M124 3v28M142 3v28"
        stroke="currentColor"
        strokeWidth="2.8"
        fill="none"
      />
    </svg>
  );
}

/** 电池 + 身份牌：回扣开场的同一块电池 */
function BatteryGlyph() {
  return (
    <svg className="cr-batteryglyph" viewBox="0 0 48 48" aria-hidden="true">
      <rect x="4" y="15" width="34" height="20" rx="3" fill="none" stroke="currentColor" strokeWidth="3.2" />
      <rect x="41" y="21" width="4" height="8" rx="1.2" fill="currentColor" />
      <circle cx="14.5" cy="25" r="3.4" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <path
        d="M21.5 21.5h11M21.5 25.5h8M21.5 29.5h11"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function A013Chapter({ step }: ChapterStepProps) {
  const state: A013State = stateByStep[step] ?? stateByStep.at(-1)!;

  return (
    <div className="scene-pad cr-root" data-state={state}>
      <header className="cr-header">
        <span className="cr-heading-mark" aria-hidden="true" />
        <div className="cr-heading-text">
          <h1 className="cr-headline">回到那块电池</h1>
          <p className="cr-subline">收束机制与共同规律</p>
        </div>
      </header>

      <div className="cr-split">
        {/* 左栏：旅程回扣 + 机制收成一句 */}
        <section className="cr-left">
          <p className="cr-zone-label">从工厂到回收，一路被很多套系统记录</p>
          <div className="cr-journey">
            <span className="cr-rail" aria-hidden="true" />
            {STOPS.map((name, i) => (
              <div className="cr-stop" key={name}>
                <span className="cr-stop-node">{i + 1}</span>
                <span className="cr-stop-name">{name}</span>
                <span className="cr-stop-record">系统记录</span>
              </div>
            ))}
          </div>

          <div className="cr-mech">
            <p className="cr-zone-label">机制收成一句</p>
            {MECH.map((row) => (
              <div className="cr-mech-row" key={row.part}>
                <span className="cr-mech-part">{row.part}</span>
                <span className="cr-mech-arrow" aria-hidden="true" />
                <span className="cr-mech-does">{row.does}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 右栏：同一块电池锚点 + 共同规律 */}
        <section className="cr-right">
          <div className="cr-identity">
            <span className="cr-identity-battery">
              <BatteryGlyph />
            </span>
            <div className="cr-identity-text">
              <p className="cr-identity-name">同一块电池</p>
              <div className="cr-identity-code">
                <CodeGlyph />
              </div>
              <p className="cr-identity-note">那串字符</p>
            </div>
          </div>

          {/* 查询引线：把查询引到信息真正所在的地方 */}
          <div className="cr-query" aria-hidden="true">
            <span className="cr-query-line" />
            <span className="cr-query-head" />
            <span className="cr-query-tag">查询</span>
          </div>

          <div className="cr-pattern">
            <p className="cr-zone-label">共同规律</p>
            <p className="cr-pattern-line">
              编码只负责给对象一个<em>身份</em>和一个<em>入口</em>
            </p>
            <div className="cr-stay">
              {STAY.map((name) => (
                <div className="cr-stay-slot" key={name}>
                  <span className="cr-stay-stage">{name}</span>
                  <span className="cr-stay-card">
                    <span className="cr-stay-stroke" />
                    <span className="cr-stay-stroke cr-stay-stroke--short" />
                  </span>
                </div>
              ))}
            </div>
            <p className="cr-pattern-stay">内容仍然留在它原本的管理范围里</p>
          </div>
        </section>
      </div>

      {/* 底部统一结论条：R012 载体 */}
      <footer className="cr-thesis">
        <p className="cr-thesis-entry">
          三者合起来，那串字符就成了一个<em>稳定的身份入口</em>
          ——分散的记录围绕同一块电池被找到。
        </p>
        <div className="cr-thesis-final">
          <p className="cr-thesis-strong">完整的一串 Handle，不需要装下电池的全部资料</p>
          <p className="cr-thesis-sub">只要稳定地指认这块电池，把查询引到信息真正所在的地方，就够了。</p>
        </div>
      </footer>
    </div>
  );
}
