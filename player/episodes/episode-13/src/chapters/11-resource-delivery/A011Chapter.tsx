import "./A011Chapter.css";
import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

/**
 * A011 · 资源交付 —— condition-key-goal / condition-to-goal
 * 上层条件区：三块条件牌依次落位（多级数据资源管理体系 / 连接器部署和运营标准 /
 * 适应产业链不同应用场景），完成后三项等权；保障梁（key）承接 R013；
 * 下层交付区在第二拍填充：不同来源、不同形态 → 转换汇聚 → 交给业务系统继续使用。
 * 与 A003/A007 的纵向三层构图区分：条件牌带图示、key 为受力求、交付区为左右向输送带。
 */
const stateByStep = [
  "system-and-standard-established",
  "delivery-enabled",
] as const;

const CONDS = [
  { tag: "体系", text: "多级数据资源管理体系" },
  { tag: "标准", text: "连接器部署和运营标准" },
  { tag: "场景", text: "适应企业产业链中的不同应用场景" },
] as const;

const SOURCES = ["不同来源", "不同形态"] as const;

export default function A011Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad rd-root" data-state={state}>
      <header className="rd-head">
        <h1 className="rd-headline">资源管理与部署运营标准</h1>
        <p className="rd-head-note">在此基础上，方案还要建立 ——</p>
      </header>

      <section className="rd-condition" aria-label="方案要建立的条件">
        {CONDS.map((cond, i) => (
          <article key={cond.tag} className={`rd-cond rd-cond-${i + 1}`}>
            <span className="rd-cond-tag">{cond.tag}</span>
            <p className="rd-cond-text">{cond.text}</p>
            <div className="rd-cond-fig" aria-hidden="true">
              {i === 0 ? (
                <div className="rd-tiers">
                  <span className="rd-tier" style={{ "--i": 0 } as CSSProperties} />
                  <span className="rd-tier" style={{ "--i": 1 } as CSSProperties} />
                  <span className="rd-tier" style={{ "--i": 2 } as CSSProperties} />
                </div>
              ) : null}
              {i === 1 ? (
                <div className="rd-checks">
                  {[0, 1, 2].map((j) => (
                    <span key={j} className="rd-check" style={{ "--i": j } as CSSProperties}>
                      <span className="rd-check-box">
                        <i className="rd-check-tick" />
                      </span>
                      <span className="rd-check-bar" />
                    </span>
                  ))}
                </div>
              ) : null}
              {i === 2 ? (
                <div className="rd-scenes">
                  {[0, 1, 2, 3].map((j) => (
                    <span key={j} className="rd-scene" style={{ "--i": j } as CSSProperties} />
                  ))}
                </div>
              ) : null}
            </div>
          </article>
        ))}
      </section>

      <div className="rd-key" aria-hidden="true">
        <svg className="rd-struts" viewBox="0 0 100 100" preserveAspectRatio="none">
          <path pathLength={1} className="rd-strut" style={{ "--i": 0 } as CSSProperties} d="M15.8 0 V 100" />
          <path pathLength={1} className="rd-strut" style={{ "--i": 1 } as CSSProperties} d="M50 0 V 100" />
          <path pathLength={1} className="rd-strut" style={{ "--i": 2 } as CSSProperties} d="M84.2 0 V 100" />
        </svg>
        <div className="rd-beam">
          <span className="rd-beam-tag">保障</span>
        </div>
      </div>

      <section className="rd-goal" aria-label="数据交付">
        <span className="rd-goal-tag">交付</span>
        <div className="rd-goal-flow">
          <div className="rd-sources">
            {SOURCES.map((src, i) => (
              <span key={src} className="rd-source" style={{ "--i": i } as CSSProperties}>
                {src}
              </span>
            ))}
          </div>
          <svg className="rd-merge" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path pathLength={1} className="rd-merge-path" style={{ "--i": 0 } as CSSProperties} d="M6 22 L 88 50" />
            <path pathLength={1} className="rd-merge-path" style={{ "--i": 1 } as CSSProperties} d="M6 78 L 88 50" />
          </svg>
          <span className="rd-agg">
            <span className="rd-agg-text">转换汇聚</span>
          </span>
          <svg className="rd-pass" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true">
            <path pathLength={1} className="rd-pass-line" d="M2 15 H 72" />
            <polygon className="rd-pass-head" points="70,5 96,15 70,25" />
          </svg>
          <div className="rd-biz">
            <span className="rd-biz-name">业务系统</span>
            <span className="rd-biz-sub">继续使用</span>
          </div>
        </div>
      </section>
    </div>
  );
}
