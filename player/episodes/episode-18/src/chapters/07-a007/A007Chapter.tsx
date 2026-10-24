import "./A007Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

/**
 * 07-nsi-field · NSI 体系标识段页（outline §7 · S-A007 ·
 * split-compare-with-pivot，context-with-exclusions）
 * 持续语境场景：体系代码栏在上承载职责，语境注记经连接线下延到主码
 * 理解；排除栏在侧并列划界"不是什么"；不创建 NSI 对照表。
 * step → semantic state 显式映射（0 基，末态兜底）：
 * - context-provided：代码栏落位，语境注记经连接线下延（step 1，
 *   R013 由代码栏向语境注记的连接线承载）
 * - role-bounded：保持代码栏与连接线，排除栏并列，收束"职责只有一项"
 *   （step 2，R014 由代码栏与排除栏的并列承载）
 * 护栏：不创建 NSI 对照表，不虚构机构或行业的 NSI 值。
 */
const stateByStep = ["context-provided", "role-bounded"] as const;

type A007State = (typeof stateByStep)[number];

export default function A007Chapter({ step }: ChapterStepProps) {
  const state: A007State = stateByStep[step] ?? stateByStep[1];
  const bounded = state === "role-bounded";

  return (
    <div className="ey-root" data-state={state}>
      <header className="ey-head">
        <span className="ey-head-tag">第 2 段</span>
        <h1 className="ey-headline">
          NSI，<em>编码体系标识</em>
        </h1>
      </header>

      <div className="ey-main">
        <div className="ey-left">
          <section className="ey-code" aria-label="体系代码栏">
            <p className="ey-code-kicker">NSI 指示——</p>
            <p className="ey-code-text">某一<b>标识体系</b>的代码</p>
            <span className="ey-code-slot" aria-hidden="true">
              体系代码
            </span>
          </section>

          <span className="ey-connector" aria-hidden="true" />

          <section className={`ey-context${bounded ? " is-held" : ""}`}>
            <p className="ey-context-kicker">读的人靠它知道——</p>
            <p className="ey-context-text">
              主码应该放在<b>什么体系语境</b>下去理解
            </p>
          </section>
        </div>

        <aside className={`ey-exclusions${bounded ? " is-on" : ""}`}>
          <p className="ey-ex-kicker">NSI，不是——</p>
          <p className="ey-ex-item">
            <i>x</i> 组织名称
          </p>
          <p className="ey-ex-item">
            <i>x</i> 权限字段
          </p>
          <p className="ey-ex-final">
            职责只有一项：<b>指出属于哪套体系</b>
          </p>
        </aside>
      </div>
    </div>
  );
}
