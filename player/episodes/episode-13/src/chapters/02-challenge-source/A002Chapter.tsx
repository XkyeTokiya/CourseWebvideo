import "./A002Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

const stateByStep = [
  "intro-established",
  "heterogeneous-shown",
  "distributed-shown",
  "three-differences-equal",
  "silos-formed",
  "silos-everywhere",
] as const;

const BANDS = [
  { no: "01", term: "异构", desc: "数据由不同系统产生，结构和格式各不相同" },
  { no: "02", term: "异地", desc: "数据分布在不同地点" },
  { no: "03", term: "异主", desc: "数据归属不同主体" },
] as const;

const SILO_CHIPS = ["异构", "异地", "异主"] as const;

export default function A002Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep.at(-1)!;
  return (
    <div className="scene-pad cs-root" data-state={state}>
      <header className="cs-head">
        <h1 className="cs-headline">数据共享难在哪里</h1>
        <span className="cs-head-rule" aria-hidden="true" />
      </header>

      <div className="cs-intro">
        <span className="cs-intro-base">数据共享是工业数据流通和应用的基础，</span>
        <strong className="cs-intro-hard">但真正做起来并不容易。</strong>
      </div>

      <div className="cs-main">
        <div className="cs-bands">
          {BANDS.map((band) => (
            <article className="cs-band" key={band.no}>
              <div className="cs-band-body">
                <span className="cs-band-no">{band.no}</span>
                <h2 className="cs-band-term">{band.term}</h2>
                <span className="cs-band-colon">：</span>
                <p className="cs-band-desc">{band.desc}</p>
                <span className="cs-band-mark" aria-hidden="true">
                  {band.no}
                </span>
              </div>
            </article>
          ))}
        </div>

        <aside className="cs-side">
          <section className="cs-side-note">
            <span className="cs-side-plus" aria-hidden="true">
              ＋
            </span>

            <div className="cs-side-body">
              <span className="cs-side-kicker">三类差异叠加</span>
              <div className="cs-silo">
                <svg
                  className="cs-silo-frame"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <rect
                    className="cs-silo-rect"
                    x="1.5"
                    y="1.5"
                    width="97"
                    height="97"
                    pathLength={100}
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
                {SILO_CHIPS.map((chip) => (
                  <span className="cs-silo-chip" key={chip}>
                    {chip}
                  </span>
                ))}
              </div>
              <span className="cs-silo-arrow" aria-hidden="true">
                →
              </span>
              <h2 className="cs-silo-term">信息孤岛</h2>
            </div>

            <div className="cs-scope">
              <div className="cs-scope-row">
                <span className="cs-scope-dot" aria-hidden="true" />
                <div className="cs-scope-text">
                  <span className="cs-scope-name">企业之间</span>
                </div>
              </div>
              <div className="cs-scope-row">
                <span className="cs-scope-dot" aria-hidden="true" />
                <div className="cs-scope-text">
                  <span className="cs-scope-name">企业内部</span>
                  <span className="cs-scope-note">
                    同一家企业的不同部门、不同系统之间也很常见
                  </span>
                </div>
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
