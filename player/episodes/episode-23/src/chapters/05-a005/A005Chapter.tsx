import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A005Chapter.css";
import m002 from "./assets/m002.png";

const stateByStep = ["inplant-alignment", "caliber-converged"] as const;

export default function A005Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const converged = state === "caliber-converged";

  return (
    <div className="fp-scene scene-pad">
      <header className="fp-head">
        <h1 className="fp-headline">第二、三层：工厂内部与企业层级</h1>
        <div className="fp-head-rule" />
      </header>

      <div className="fp-main">
        <figure className="fp-media card">
          <img
            className="fp-media-img"
            src={m002}
            alt="工厂内跨环节协同场景占位图（M002，原图待提供）"
          />
          <figcaption className="fp-media-cap">
            工厂内跨环节协同 · M002 占位图 · 待提供
          </figcaption>
        </figure>

        <div className="fp-rail">
          <section className="fp-note card is-on" aria-label="工厂内部">
            <p className="fp-note-tag">第二层 · 工厂内部</p>
            <p className="fp-note-main">
              同一批次的检验记录，跨车间、跨环节对齐
            </p>
            <p className="fp-note-sub">质检也要与车间核对参数。</p>
          </section>

          <section
            className={`fp-note card${converged ? " is-on" : " is-pending"}`}
            aria-hidden={!converged}
            aria-label="企业层级"
          >
            <p className="fp-note-tag">第三层 · 企业层级</p>
            <p className="fp-note-main">订单这类业务信息，需要跨部门核对</p>
            <p className="fp-note-sub">生产、销售、财务可能各记一份。</p>
          </section>
        </div>
      </div>

      <aside
        className={`fp-judgment card${converged ? " is-on" : ""}`}
        aria-hidden={!converged}
      >
        <span className="fp-j-mark" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <p className="fp-judgment-text">
          得放到<em>一个口径</em>下说清楚
        </p>
      </aside>
    </div>
  );
}
