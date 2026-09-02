import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./ReconnectSameObject.css";
import m004 from "./assets/m004.png";

/* A010 · S-A010 —— narration step → semantic state
   前 3 拍复用同一 base 构图（M004 主图持续，总结带 1→2 依次就位），
   第 4 拍切换 K-A010-01 accent（最终判断，base 不重复） */
const stateByStep = [
  "systems-and-own-records",
  "chain-formed",
  "pattern-named",
] as const;

type ReconnectState = (typeof stateByStep)[number];

const ACCENT_STEP = 3;

/* R022 并列列举：三系统等权罗列，不画互连 */
const SYSTEMS = ["ERP", "MES", "WMS"] as const;

/* R023 共同对象分组：六类记录围合同一锚点，不画网络节点 */
const RECORD_KINDS = ["基本", "装配", "工艺", "质量", "物流", "售后"] as const;

function ReconnectScene({ state }: { state: ReconnectState }) {
  const bandTwoOn = state !== "systems-and-own-records";

  return (
    <div className="rs-scene scene-pad" data-state={state}>
      <h1 className="rs-thesis">
        分散数据<em>围绕同一对象重新连接</em>，才形成可协作的追溯关系
      </h1>

      <div className="rs-main">
        <figure className="rs-media">
          <div className="rs-photo">
            <img src={m004} alt="M004 收束回扣现场占位图" />
            <span className="rs-recall-chip" aria-hidden="true">
              回到开头 · 同一台发动机
            </span>
          </div>
        </figure>

        <div className="rs-rail">
          {/* 总结带 1 · 系统各司其职（V022/R022）：并列列举，不画互连 */}
          <article className="rs-band card" data-on="on">
            <span className="rs-band-glow" aria-hidden="true" />
            <header className="rs-band-head">
              <span className="rs-band-no hero-num">01</span>
              <h2 className="rs-band-name">系统各司其职</h2>
            </header>
            <p className="rs-band-text">
              ERP、MES、WMS 继续管理各自业务，并保留各自产生的发动机记录。
            </p>
            <div className="rs-sys-row" aria-hidden="true">
              {SYSTEMS.map((sys, i) => (
                <span
                  key={sys}
                  className="rs-sys-cell"
                  style={{ "--rs-i": String(i) } as CSSProperties}
                >
                  <span className="rs-sys-chip">{sys}</span>
                  <span className="rs-sys-ledger">
                    {[0, 1].map((j) => (
                      <i
                        key={j}
                        style={{ "--rs-j": String(j) } as CSSProperties}
                      />
                    ))}
                  </span>
                </span>
              ))}
            </div>
          </article>

          {/* 总结带 2 · 统一标识串起记录（R023）：共同对象分组，不画网络节点 */}
          <article className="rs-band card" data-on={bandTwoOn ? "on" : "waiting"}>
            <span className="rs-band-glow" aria-hidden="true" />
            <header className="rs-band-head">
              <span className="rs-band-no hero-num">02</span>
              <h2 className="rs-band-name">统一标识串起记录</h2>
            </header>
            <p className="rs-band-text">
              基本、装配、工艺、质量、物流和售后记录围绕同一台发动机形成可追溯链。
            </p>
            <div className="rs-anchor-group" aria-hidden="true">
              <span className="rs-anchor-tab">同一台发动机</span>
              <div className="rs-kind-row">
                {RECORD_KINDS.map((kind, i) => (
                  <span
                    key={kind}
                    className="rs-kind-chip"
                    style={{ "--rs-i": String(i) } as CSSProperties}
                  >
                    {kind}
                  </span>
                ))}
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}

/* K-A010-01 · accent：低成本全屏最终判断，价值条件由本页唯一承载 */
function ReconnectAccent() {
  return (
    <div className="rs-accent scene-pad">
      <p className="rs-accent-kicker">收束 · 最终判断</p>
      <p className="rs-accent-statement">
        真正产生价值的，<span className="rs-not">不是某个系统名称</span>，
        <br />
        而是企业对相关数据的<em className="rs-value">治理、分析和协同</em>。
      </p>
    </div>
  );
}

export default function ReconnectSameObject({ step }: ChapterStepProps) {
  if (step === ACCENT_STEP) return <ReconnectAccent />;
  return <ReconnectScene state={stateByStep[step] ?? stateByStep[2]} />;
}
