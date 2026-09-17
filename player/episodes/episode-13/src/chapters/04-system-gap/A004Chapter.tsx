import "./A004Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

const stateByStep = [
  "question-open",
  "mes-introduced",
  "erp-added",
  "plm-added",
  "differences-stated",
  "custom-connection-cost",
] as const;

const SYSTEMS = [
  { no: "01", abbr: "MES", name: "制造执行系统 MES", duty: "生产执行与现场管控" },
  { no: "02", abbr: "ERP", name: "企业资源计划 ERP", duty: "企业资源与经营计划" },
  { no: "03", abbr: "PLM", name: "产品生命周期管理系统 PLM", duty: "产品从设计到退役的数据" },
] as const;

const DIFFS = ["厂商各不相同", "软硬件平台不同", "接口协议不统一", "数据格式不统一"] as const;

export default function A004Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep.at(-1)!;
  return (
    <div className="scene-pad gp-root" data-state={state}>
      <header className="gp-head">
        <span className="gp-head-mark" aria-hidden="true" />
        <h1 className="gp-headline">现有系统为什么难以做到</h1>
      </header>

      <div className="gp-main">
        <section className="gp-systems">
          {SYSTEMS.map((sys) => (
            <div className="gp-slot" key={sys.abbr}>
              <span className="gp-slot-no" aria-hidden="true">
                {sys.no}
              </span>
              <article className="gp-sys-card">
                <span className="gp-sys-abbr">{sys.abbr}</span>
                <span className="gp-sys-text">
                  <span className="gp-sys-name">
                    {sys.name}
                    <span className="gp-sys-sep">：</span>
                  </span>
                  <span className="gp-sys-duty">{sys.duty}</span>
                </span>
              </article>
            </div>
          ))}
        </section>

        <div className="gp-axis" aria-hidden="true">
          {[0, 1, 2].map((row) => (
            <div className="gp-axis-row" key={row}>
              <span className="gp-link" />
              <span className="gp-gap" />
              <span className="gp-adapter" />
            </div>
          ))}
        </div>

        <aside className="gp-diffzone">
          <span className="gp-diffzone-label">连接时的差异</span>
          <div className="gp-diffs">
            {DIFFS.map((text) => (
              <span className="gp-diff" key={text}>
                {text}
              </span>
            ))}
          </div>
        </aside>
      </div>

      <div className="gp-thesis">
        <p className="gp-thesis-q">现有系统，为什么很难做到这一点？</p>
        <p className="gp-thesis-t">
          <span className="gp-thesis-lead">要把它们连接起来，通常需要</span>
          <span className="gp-thesis-main">逐套开发接口、逐项适配数据</span>
        </p>
      </div>
    </div>
  );
}
