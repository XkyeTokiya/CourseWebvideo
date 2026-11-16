import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A006Chapter.css";
import m003 from "./assets/m003.png";

const stateByStep = ["boundary-crossed", "context-diverged"] as const;

export default function A006Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const diverged = state === "context-diverged";

  return (
    <div className="ch-scene scene-pad">
      <header className="ch-head">
        <h1 className="ch-headline">第四、五层：产业链与跨行业</h1>
        <div className="ch-head-rule" />
      </header>

      <div className="ch-main">
        <div className="ch-rail">
          <section className="ch-note card is-on" aria-label="产业链">
            <p className="ch-note-tag">第四层 · 产业链</p>
            <p className="ch-note-main">质量线索跨过企业边界</p>
            <p className="ch-note-sub">不同主体各有业务职责和管理边界。</p>
            <p className="ch-note-extra">
              共享什么、怎样表达、按什么约定使用——先讲清楚。
            </p>
          </section>

          <section
            className={`ch-note card${diverged ? " is-on" : " is-pending"}`}
            aria-hidden={!diverged}
            aria-label="跨行业"
          >
            <p className="ch-note-tag">第五层 · 跨行业</p>
            <p className="ch-note-main">
              同一份数据换语境，连“合格”的定义都可能不一样
            </p>
            <p className="ch-note-sub">表达与管理差异更大。</p>
            <p className="ch-note-extra">
              也体现数字化转型连接全要素、全产业链、全价值链的方向。
            </p>
          </section>
        </div>

        <figure className="ch-media card">
          <img
            className="ch-media-img"
            src={m003}
            alt="跨企业交接核验场景占位图（M003，原图待提供）"
          />
          <figcaption className="ch-media-cap">
            跨企业交接核验 · M003 占位图 · 待提供
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
