import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A008Chapter.css";

const states = [
  "quality-limit-marked",
  "mechanisms-listed",
  "institution-limit-marked",
  "role-bounded",
] as const;

const MECHANISMS = ["数据格式", "语义标准", "采集质量", "系统互操作"] as const;

export default function A008Chapter({ step }: ChapterStepProps) {
  const state = states[step] ?? states[states.length - 1];
  const mechanismsOn = step >= 1;
  const instituteOn = step >= 2;
  const thesisOn = step >= 3;

  return (
    <div
      className={`a8-scene scene-pad${mechanismsOn ? " is-mech" : ""}${
        instituteOn ? " is-inst" : ""
      }${thesisOn ? " is-thesis" : ""}`}
      data-state={state}
    >
      <header className="a8-head">
        <p className="a8-kicker">能力边界 · 两重限制</p>
        <h1 className="a8-title">
          必要的基础，<em>不是</em>全部条件
        </h1>
      </header>

      <div className="a8-body">
        <div className="a8-main">
          <section className="a8-col card" aria-label="质量边界">
            <p className="a8-cap">01 · 质量边界</p>
            <p className="a8-claim">低质量的数据，变不成高质量的数据</p>
            <p className="a8-sub">记录本身错了、缺了、没有及时更新，身份再清楚也补不回事实</p>

            <div className="a8-mech">
              <div className="a8-chips">
                {MECHANISMS.map((m, i) => (
                  <span
                    key={m}
                    className="a8-chip"
                    style={{ "--a8-i": String(i) } as CSSProperties}
                  >
                    {m}
                  </span>
                ))}
              </div>
              <p className="a8-mech-cap">各自都需要治理机制</p>
            </div>
          </section>

          <div className="a8-right">
            <p
              className={`a8-ghost a8-inst-ghost${instituteOn ? " is-off" : ""}`}
              aria-hidden="true"
            >
              制度边界 · 待落位
            </p>
            <section className="a8-col card a8-inst" aria-label="制度边界">
              <p className="a8-cap">02 · 制度边界</p>
              <p className="a8-claim">
                标识体系也<strong>不替代授权、安全、权属和流通规则</strong>
              </p>
              <p className="a8-sub">能定位到数据，不等于任何主体都有权限访问</p>
              <p className="a8-sub">能关联记录，不等于确权、估值和交易都完成了</p>
            </section>
          </div>
        </div>

        <footer className="a8-thesis">
          <p
            className={`a8-ghost a8-thesis-ghost${thesisOn ? " is-off" : ""}`}
            aria-hidden="true"
          >
            判断 · 待落位
          </p>
          <div className="a8-thesis-plate card">
            <p className="a8-thesis-text">标识体系是必要的基础，但不是价值释放的全部条件</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
