import "./A006Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

/**
 * 06-version-v · V 版本段页（outline §6 · S-A006 ·
 * layered-bands-with-side-notes，bands-with-side-boundary）
 * 持续分层带场景：职责条与取值条上下衔接为有序带，排除注释在侧栏
 * 独立承载"不是什么"，收束行收拢全页；不轮播、不整体重排。
 * step → semantic state 显式映射（0 基，末态兜底）：
 * - version-role-shown：职责条先落位，取值条随后补齐 0–4 的范围
 *   （step 1，R011 由职责条与取值条的范围连接承载）
 * - misreads-ruled-out：保持两条带，侧栏排除注释落位
 *   （step 2，R012 由取值条旁的排除注释承载）
 * - reading-guide-set：保持带与注记，收束行呈现真实职责（step 3）
 * 护栏：不补 0–4 各版本的具体数据格式。
 */
const stateByStep = [
  "version-role-shown",
  "misreads-ruled-out",
  "reading-guide-set",
] as const;

type A006State = (typeof stateByStep)[number];

const STAGE_ORDER: Record<A006State, number> = {
  "version-role-shown": 0,
  "misreads-ruled-out": 1,
  "reading-guide-set": 2,
};

/** 版本取值范围（G019：0 到 4，共五个版本；不补各自的数据格式） */
const VERSIONS = ["0", "1", "2", "3", "4"] as const;

export default function A006Chapter({ step }: ChapterStepProps) {
  const state: A006State =
    stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const at = STAGE_ORDER[state];

  const notesOn = at >= 1;
  const guideOn = at >= 2;

  return (
    <div className="hb-root" data-state={state}>
      <header className="hb-head">
        <span className="hb-head-tag">第 1 段</span>
        <h1 className="hb-headline">
          V，<em>版本</em>
        </h1>
      </header>

      <div className="hb-main">
        <div className="hb-bands">
          <section className="hb-role" aria-label="职责条">
            <p className="hb-band-kicker">职责</p>
            <p className="hb-band-line">
              区分<b>不同数据结构</b>的 Ecode
            </p>
          </section>

          <section className="hb-range" aria-label="取值条">
            <p className="hb-band-kicker">取值</p>
            <div className="hb-tiles">
              {VERSIONS.map((v, index) => (
                <span
                  key={v}
                  className="hb-tile"
                  style={{ "--hb-i": index } as React.CSSProperties}
                >
                  {v}
                </span>
              ))}
            </div>
            <p className="hb-range-note">
              从 <b>0</b> 到 <b>4</b>，一共五个版本
            </p>
          </section>
        </div>

        <aside className={`hb-notes${notesOn ? " is-on" : ""}`}>
          <p className="hb-notes-title">版本，不是——</p>
          <p className="hb-note">
            <i>x</i> 产品的生产批次
          </p>
          <p className="hb-note">
            <i>x</i> 发布日期
          </p>
        </aside>
      </div>

      <div className={`hb-guide${guideOn ? " is-on" : ""}`}>
        <span className="hb-guide-arrow" aria-hidden="true">
          ↓
        </span>
        <p className="hb-guide-text">
          它先告诉读的人：后面的内容，应该<b>按哪一种数据结构去解释</b>
        </p>
      </div>
    </div>
  );
}
