import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./IdentityAsAnchor.css";

/* A005 · scope-responsibility-ledger
   semantic states（固定台账内逐行组装，见 outline §5）：
   step0 ledger-anchored   台账框架 + 共同条件行 + 统一标识锚点行
   step1 boundaries-set    按批准口播顺序先补边界列（不取代｜不承载）
   step2 duties-complete   再补职责列（统一标识确认归属；ERP/MES/WMS 同一职责组） */

const stateByStep = [
  "ledger-anchored",
  "boundaries-set",
  "duties-complete",
] as const;

type AnchorState = (typeof stateByStep)[number];

const BOUNDARY_ROWS = [
  { key: "不取代", text: "统一标识不替代原有业务系统" },
  { key: "不承载", text: "也不等于把企业全部业务数据装进一段编码" },
] as const;

export default function IdentityAsAnchor({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const boundariesSet =
    state === "boundaries-set" || state === "duties-complete";
  const dutiesComplete = state === "duties-complete";

  return (
    <div className="ia-scene scene-pad">
      <section className="ia-ledger card" data-state={state}>
        <div className="ia-condition">
          <span className="ia-condition-tag">共同条件</span>
          <p className="ia-condition-text">
            跨系统核对都围绕<em>同一台发动机</em>展开，讨论对象保持一致
          </p>
        </div>
        <div className="ia-condition-rule rule-accent" />

        <div className="ia-cols">
          <div className="ia-col ia-col-duty">
            <div className="ia-col-top">
              <header className="ia-col-head">
                <span className="ia-col-cn">职责</span>
                <span className="ia-col-en">DUTY</span>
              </header>
              <div className="ia-col-rule rule" />
            </div>

            <article className="ia-anchor-row">
              <div className="ia-anchor-head">
                <h2 className="ia-anchor-name">统一标识</h2>
                <span className="ia-anchor-chip">关联锚点</span>
              </div>
              {dutiesComplete ? (
                <p className="ia-anchor-duty">
                  负责确认记录归属：是否属于同一台发动机
                </p>
              ) : null}
            </article>

            {dutiesComplete ? (
              <article className="ia-group-row">
                <span className="ia-group-abbr hero-num">ERP · MES · WMS</span>
                <p className="ia-group-names">
                  企业资源计划 · 制造执行系统 · 仓库管理系统
                </p>
                <p className="ia-group-duty">继续承担各自原有业务职责</p>
              </article>
            ) : null}
          </div>

          <div className="ia-col ia-col-boundary">
            <div className="ia-col-top">
              <header className="ia-col-head">
                <span className="ia-col-cn">边界</span>
                <span className="ia-col-en">BOUNDARY</span>
              </header>
              <div className="ia-col-rule rule" />
            </div>

            {boundariesSet
              ? BOUNDARY_ROWS.map((row, i) => (
                  <article
                    key={row.key}
                    className="ia-boundary-row"
                    style={{ "--ia-b": String(i) } as CSSProperties}
                  >
                    <span className="ia-boundary-key">{row.key}</span>
                    <p className="ia-boundary-text">{row.text}</p>
                  </article>
                ))
              : null}
          </div>
        </div>
      </section>
    </div>
  );
}
