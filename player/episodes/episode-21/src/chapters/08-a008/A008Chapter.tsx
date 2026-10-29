import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A008Chapter.css";

/**
 * 08-correlation-patterns · 关联与模式（outline §8 · S-A008 · linear-steps-to-result）
 * mechanism: ordered-progression — 四段推进带自上而下按口播先后落位：
 * 否定带（不是堆叠 → 整理/比较/分析）、语境关联带、线索识别带，末态结果
 * 区最后出现收底；已过各带保持可见并弱化。R010（语境关联支撑线索识别）
 * 由关联带到线索带的推进次序承载，R011（线索发现走向模式与知识）由线索
 * 带到结果区的推进次序承载。
 *
 * step → semantic state：stacking-reframed → clues-identified →
 * goal-established。
 *
 * exact 义务：S045（设备作业、生产流程和供应链的信息，在相应的语境里保持
 * 关联）与 S047（从复杂数据集中发现新的模式与知识，挖掘有价值的新信息）
 * 整句逐字渲染。护栏 C010：不承诺具体算法、模型输出或分析结果。
 */
const stateByStep = ["stacking-reframed", "clues-identified", "goal-established"] as const;

/** 语境关联三源行（exact S045） */
const CONTEXT_SOURCES = ["设备作业", "生产流程", "供应链"] as const;

/** 可被识别的线索（指导 S046，不承诺输出结果） */
const CLUE_KINDS = ["变化", "关系", "异常线索"] as const;

/** 否定带：错的一侧（堆叠）示意块 */
const PILE_BLOCKS = [0, 1, 2, 3, 4, 5] as const;

export default function A008Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const cluesOn = step >= 1;
  const goalOn = step >= 2;

  const rootCls = ["rr-scene", "scene-pad", cluesOn && "is-clues", goalOn && "is-goal"]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootCls} data-state={state}>
      <header className="rr-head">
        <h1 className="rr-headline">
          这条链的重点：<em>从记录到可解释的依据</em>
        </h1>
        <div className="rr-head-rule rule" />
      </header>

      <div className="rr-flow">
        {/* 段 1：否定带——不是堆叠 vs 而是整理比较分析 */}
        <section className={`rr-band rr-band--reframe${goalOn || cluesOn ? " is-past" : " is-current"}`}>
          <span className="rr-band-no hero-num">1</span>
          <div className="rr-reframe">
            <div className="rr-reframe-no">
              <p className="rr-reframe-tag rr-reframe-tag--no">不是</p>
              <div className="rr-pile" aria-hidden="true">
                {PILE_BLOCKS.map((b, i) => (
                  <span
                    key={b}
                    className="rr-pile-block"
                    style={{ "--rr-b": i } as CSSProperties}
                  />
                ))}
              </div>
              <span className="rr-reframe-text">把所有数据堆在一起</span>
            </div>
            <span className="rr-reframe-arrow" aria-hidden="true">
              <svg viewBox="0 0 44 20" width="44" height="20">
                <path d="M2 10 H34" className="rr-arrow-line" />
                <path d="M30 3 L42 10 L30 17" className="rr-arrow-line" />
              </svg>
            </span>
            <div className="rr-reframe-yes">
              <p className="rr-reframe-tag rr-reframe-tag--yes">而是</p>
              <span className="rr-reframe-text">
                让不同来源的记录能被<strong>整理、比较和分析</strong>
              </span>
            </div>
          </div>
        </section>

        {/* 段 2：语境关联带（exact S045） */}
        <section className={`rr-band rr-band--context${goalOn ? " is-past" : cluesOn ? " is-current" : ""}`}>
          <span className="rr-band-no hero-num">2</span>
          {cluesOn ? (
            <div className="rr-context">
              <div className="rr-context-chips">
                {CONTEXT_SOURCES.map((s, i) => (
                  <span
                    key={s}
                    className="rr-context-chip"
                    style={{ "--rr-i": i } as CSSProperties}
                  >
                    {s}
                  </span>
                ))}
              </div>
              <p className="rr-context-line">
                的信息，在相应的语境里<strong>保持关联</strong>
              </p>
            </div>
          ) : (
            <p className="rr-band-ghost-text">语境关联 · 待落位</p>
          )}
        </section>

        {/* 段 3：线索识别带（拍 2 随关联带落位） */}
        <section className={`rr-band rr-band--clues${goalOn ? " is-past" : cluesOn ? " is-current" : ""}`}>
          <span className="rr-band-no hero-num">3</span>
          {cluesOn ? (
            <div className="rr-clues">
              <p className="rr-clues-lead">分析才有可能识别出</p>
              {CLUE_KINDS.map((k, i) => (
                <span
                  key={k}
                  className="rr-clue-chip"
                  style={{ "--rr-j": i } as CSSProperties}
                >
                  {k}
                </span>
              ))}
            </div>
          ) : (
            <p className="rr-band-ghost-text">线索识别 · 待落位</p>
          )}
        </section>

        {/* 段 4：末态结果区（拍 3 收底，exact S047） */}
        <div className={`rr-goal${goalOn ? " is-on" : ""}`} aria-hidden={!goalOn}>
          <p className="rr-goal-ghost">目标 · 待收底</p>
          <div className="rr-goal-plate card-glass">
            <span className="rr-goal-kicker">它的目标</span>
            <div className="rr-goal-lines">
              <p className="rr-goal-line">
                从复杂数据集中<strong>发现新的模式与知识</strong>，
                <strong>挖掘有价值的新信息</strong>
              </p>
              <p className="rr-goal-line rr-goal-line--sub">
                让一条条记录，变成<em>可以解释的业务依据</em>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
