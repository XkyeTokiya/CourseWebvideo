import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./KeySupportRole.css";

const ACCENT_STEP = 0;

const stateByStep = [
  "accent",
  "fusion-identity-set",
  "support-basis-and-role-set",
] as const;

type KeySupportState = Exclude<(typeof stateByStep)[number], "accent">;

function KeySupportAccent() {
  return (
    <div className="ks-accent scene-pad">
      <p className="ks-accent-kicker">目标 — 支撑关系 · 转折</p>
      <p className="ks-accent-statement">
        工业互联网提供的，就是
        <br />
        把这些要素组织起来的<em>关键支撑</em>
      </p>
    </div>
  );
}

function KeySupportScene({ state }: { state: KeySupportState }) {
  const roleOn = state === "support-basis-and-role-set";

  return (
    <div className="ks-scene scene-pad">
      <h1 className="ks-thesis">工业互联网把分散工业要素组织起来</h1>

      <div className="ks-cards">
        <section
          className="ks-card ks-card--identity"
          data-on="on"
          style={{ "--ks-i": "0" } as CSSProperties}
        >
          <div className="ks-card-body">
            <p className="ks-card-kicker">融合身份</p>
            <div className="ks-main">
              <div className="ks-fusion">
                <span className="ks-fusion-chip">新一代信息技术</span>
                <span className="ks-fusion-times hero-num">×</span>
                <span className="ks-fusion-chip">制造业</span>
              </div>
            </div>
            <p className="ks-sub">深度融合的产物</p>
          </div>
        </section>

        <section
          className="ks-card"
          data-on={roleOn ? "on" : "waiting"}
          style={{ "--ks-i": "0" } as CSSProperties}
        >
          <div className="ks-card-body">
            <p className="ks-card-kicker">支撑基础</p>
            <div className="ks-main">
              <p className="ks-main-term">数字基础设施</p>
            </div>
            <p className="ks-sub">面向工业运行的支撑</p>
          </div>
        </section>

        <section
          className="ks-card ks-card--role"
          data-on={roleOn ? "on" : "waiting"}
          style={{ "--ks-i": "1" } as CSSProperties}
        >
          <div className="ks-card-body">
            <p className="ks-card-kicker">组织作用</p>
            <div className="ks-main">
              <p className="ks-main-term">融合应用支撑</p>
            </div>
            <p className="ks-sub">
              组织<i>分散的工业要素</i>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function KeySupportRole({ step }: ChapterStepProps) {
  if (step === ACCENT_STEP) return <KeySupportAccent />;
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return <KeySupportScene state={state as KeySupportState} />;
}
