import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./RecordsWithoutChain.css";

const ACCENT_STEP = 1;

const stateByStep = ["three-systems-recorded"] as const;

type RecordsState = (typeof stateByStep)[number];

const SYSTEMS = [
  {
    abbr: "ERP",
    cn: "企业资源计划",
    en: "Enterprise Resource Planning",
    note: "保留与发动机相关的业务记录。",
  },
  {
    abbr: "MES",
    cn: "制造执行系统",
    en: "Manufacturing Execution System",
    note: "保留与发动机相关的生产现场记录。",
  },
  {
    abbr: "WMS",
    cn: "仓库管理系统",
    en: "Warehouse Management System",
    note: "保留与发动机相关的仓储业务记录。",
  },
] as const;

function RecordsScene({ state }: { state: RecordsState }) {
  return (
    <div className="rw-scene scene-pad">
      <h1 className="rw-thesis">
        基本、生产装配和质量信息分散在多个系统，
        <em>有数据不等于有追溯链</em>
      </h1>

      <div className="rw-cards">
        {SYSTEMS.map((s, i) => (
          <article
            key={s.abbr}
            className="rw-card card"
            data-state={state}
            style={{ "--rw-i": String(i) } as CSSProperties}
          >
            <span className="rw-abbr hero-num">{s.abbr}</span>
            <h2 className="rw-cn">{s.cn}</h2>
            <p className="rw-en">{s.en}</p>

            <div className="rw-ledger" aria-hidden="true">
              {[0, 1, 2].map((j) => (
                <span
                  key={j}
                  className="rw-row"
                  style={{ "--rw-j": String(j) } as CSSProperties}
                />
              ))}
            </div>

            <div className="rw-rule rule" />

            <p className="rw-note">
              <span className="rw-note-mark" aria-hidden="true" />
              {s.note}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}

function RecordsAccent() {
  return (
    <div className="rw-accent scene-pad">
      <span className="rw-neq" aria-hidden="true">
        ≠
      </span>
      <p className="rw-kicker">旧状态 · 收束判断</p>
      <p className="rw-statement">
        系统<em className="rw-has-data">有数据</em>，和能顺着数据找到问题，
        <br />
        是<em className="rw-two-things">两回事</em>。
      </p>
    </div>
  );
}

export default function RecordsWithoutChain({ step }: ChapterStepProps) {
  if (step === ACCENT_STEP) return <RecordsAccent />;
  return <RecordsScene state={stateByStep[step] ?? stateByStep[0]} />;
}
