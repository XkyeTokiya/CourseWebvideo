import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A008ControlShift.css";

const states = [
  "tracking-visible",
  "experience-sidelined",
  "triage-path-ready",
  "provenance-thesis",
] as const;

type A008State = (typeof states)[number];

// S038 定位入口（口播 beat 3 事实池，顺序即口播报到点）
const ENTRIES = ["加工次数", "位置", "维护记录", "运行异常"] as const;

export default function A008ControlShift({ step }: ChapterStepProps) {
  const state: A008State = states[step] ?? states[states.length - 1];

  // 语义态 → 槽位状态（不把 step 当 active 索引）
  // step0 建右栏（R018 落点，右栏入场走 .is-tracking-visible 下的 keyframes）
  const leftSolid = state !== "tracking-visible"; // step1 建左栏，完成 R017 两栏对照
  const stampOn = leftSolid; // S037：不再主要依赖
  const triageOn =
    state === "triage-path-ready" || state === "provenance-thesis"; // step2 补 S038 定位路径
  const thesisOn = state === "provenance-thesis"; // step3 bottom-thesis 收束（S039/S040 exact）

  return (
    <div className={`cs-scene scene-pad is-${state}`}>
      <h1 className="cs-title">从人工经验到可视化管控</h1>

      <div className="cs-main">
        {/* 左栏 · U021：人工经验被替代 + 定位入口（S037 / S038，后立） */}
        <section
          className={`cs-col cs-col-left${leftSolid ? " is-solid" : ""}${
            stampOn ? " has-stamp" : ""
          }`}
        >
          <div className="cs-col-head">
            <span className="cs-col-tag">以往</span>
            <h2 className="cs-col-title">管控主要靠人工经验</h2>
          </div>

          <div className="cs-memory">
            <div className="cs-note" style={{ "--cs-i": "0" } as CSSProperties}>
              <i>模具去向</i>
              <b>靠熟练人员记忆</b>
            </div>
            <div className="cs-note" style={{ "--cs-i": "1" } as CSSProperties}>
              <i>使用历史</i>
              <b>靠熟练人员记忆</b>
            </div>
            <div className={`cs-stamp${stampOn ? " is-on" : ""}`} aria-hidden={!stampOn}>
              <span>不再主要依赖</span>
            </div>
          </div>

          <div className="cs-idle">
            <b>被闲置、被浪费的产能</b>
            <span className="cs-idle-tag">有机会被发现</span>
          </div>

          <div className={`cs-triage${triageOn ? " is-on" : ""}`}>
            <p className="cs-triage-lead">遇到问题 · 从哪里入手定位</p>
            <div className="cs-entries">
              {ENTRIES.map((label, i) => (
                <span
                  key={label}
                  className="cs-entry"
                  style={{ "--cs-i": String(i) } as CSSProperties}
                >
                  <i>{`0${i + 1}`}</i>
                  {label}
                </span>
              ))}
            </div>
            <p className="cs-triage-out">定位之后 · 再决定怎么处理</p>
          </div>
        </section>

        {/* 右栏 · U020：可视化追踪 + 平台集中管理（S035 / S036，先立；R018 由层内分组承载） */}
        <section className="cs-col cs-col-right">
          <div className="cs-col-head">
            <span className="cs-col-tag cs-col-tag-now">现在</span>
            <h2 className="cs-col-title">可视化管控</h2>
          </div>

          <div className="cs-layer cs-layer-track">
            <p className="cs-layer-cap">
              这副模具的全生命周期 · 可视化追踪
              <span className="cs-demo-tag">示意演示</span>
            </p>
            <div className="cs-row" style={{ "--cs-i": "0" } as CSSProperties}>
              <b className="cs-row-label">加工次数</b>
              <span className="cs-tally" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
                <i className="cs-tally-cross" />
              </span>
              <i className="cs-row-note">逐次累加</i>
            </div>
            <div className="cs-row" style={{ "--cs-i": "1" } as CSSProperties}>
              <b className="cs-row-label">位置</b>
              <span className="cs-gridmap" aria-hidden="true">
                <i className="cs-pin" />
              </span>
              <i className="cs-row-note">所在可查</i>
            </div>
            <div className="cs-row" style={{ "--cs-i": "2" } as CSSProperties}>
              <b className="cs-row-label">维护记录</b>
              <span className="cs-ledger" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <i className="cs-row-note">留档可查</i>
            </div>
          </div>

          <div className="cs-layer cs-layer-manage">
            <div className="cs-manage-head">
              <span className="cs-platform">平台</span>
              <span className="cs-manage-verb">集中管理</span>
            </div>
            <div className="cs-manage-group">
              <span className="cs-mchip">模具履历</span>
              <span className="cs-mchip">模次统计</span>
              <span className="cs-mchip">生产日志</span>
            </div>
          </div>
        </section>
      </div>

      {/* bottom-thesis · U022：案例成效 + 结果归属（S039 / S040 exact，逐字） */}
      <section className={`cs-thesis${thesisOn ? " is-on" : ""}`} aria-hidden={!thesisOn}>
        <span className="cs-thesis-kicker">一项成效</span>
        <div className="cs-thesis-body">
          <p className="cs-thesis-main">
            <em>加密通信</em>、<em>双向监控</em>与<em>终端 IP 不暴露</em>列为案例成效
          </p>
          <p className="cs-thesis-src">
            <span className="cs-src-tag">来源限定</span>
            上述结果均为教材所述案例结果
          </p>
        </div>
      </section>
    </div>
  );
}
