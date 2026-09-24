import "./A002Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

const stateByStep = [
  "bands-established",
  "duties-annotated",
  "identity-combined",
] as const;

const BANDS = [
  { no: "01", name: "发码机构代码", note: "由哪个发码机构管理" },
  { no: "02", name: "服务机构代码", note: "在什么国家、什么行业、哪家企业里" },
  { no: "03", name: "企业内部编码", note: "企业内部具体是哪一个对象" },
] as const;

export default function A002Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad tsg-root" data-state={state}>
      <header className="tsg-header">
        <span className="tsg-heading-mark" aria-hidden="true" />
        <div className="tsg-heading-copy">
          <h1 className="tsg-headline">VAA 的三段结构</h1>
          <p className="tsg-headline-note">三段分别是发码机构代码、服务机构代码和企业内部编码</p>
        </div>
      </header>

      <div className="tsg-main">
        <div className="tsg-frame">
          <div className="tsg-bands">
            {BANDS.map((band) => (
              <section className="tsg-band" key={band.no}>
                <span className="tsg-band-no">{band.no}</span>
                <h2 className="tsg-band-name">{band.name}</h2>
                <div className="tsg-note">
                  <span className="tsg-note-tick" aria-hidden="true" />
                  <p className="tsg-note-text">
                    <span className="tsg-note-lead">回答</span>
                    {band.note}
                  </p>
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>

      <footer className="tsg-landing">
        <div className="tsg-ghost" aria-hidden="true">
          <i />
          <i />
          <i />
        </div>
        <div className="tsg-takeaway">
          <span className="tsg-takeaway-mark" aria-hidden="true" />
          <div className="tsg-takeaway-copy">
            <p className="tsg-takeaway-lead">职责不同，合在一起</p>
            <p className="tsg-takeaway-strong">才形成一条能继续关联下去的身份</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
