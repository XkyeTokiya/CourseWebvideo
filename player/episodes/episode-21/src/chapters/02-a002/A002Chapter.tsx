import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A002Chapter.css";

/**
 * 02-definition-scope · 定义与范围（outline §2 · S-A002 · split-compare-with-thesis）
 * mechanism: cumulative-assembly — 定义句先在左区落位，海量/多源/异构三条
 * 限定词带在其下逐条补齐；右区"数据集合"虚线边界随"至少覆盖"对象行与
 * "延展"环节行先后点亮；底部判断条最后出现并对照两侧。R002（限定词刻画
 * 集合属性）由左右两栏并排承载，R003（覆盖之外的排除口径）由右区覆盖带
 * 与底部判断条的上下对照承载。
 *
 * step → semantic state（0 基，末态兜底，与 outline step 一一对应）：
 * definition-stated → qualifiers-explained → coverage-extended →
 * shrinkage-excluded。
 *
 * exact 义务（S009/S010/S011/S014）以整句逐字渲染在限定词带与判断条中。
 * 护栏 C003：数据集合只画抽象虚线边界，不出现数据库产品、生产报表或
 * 软件存储界面。
 */
const stateByStep = [
  "definition-stated",
  "qualifiers-explained",
  "coverage-extended",
  "shrinkage-excluded",
] as const;

/** 三条限定词带（exact：S009/S010/S011 整句逐字可见） */
const QUALIFIERS = [
  { word: "海量", text: "数据量非常大", glyph: "volume" },
  { word: "多源", text: "数据来自不同的环节、不同的系统", glyph: "sources" },
  { word: "异构", text: "数据的结构和表达方式各不相同", glyph: "shapes" },
] as const;

/** 覆盖对象行（指导 S012） */
const COVER_OBJECTS = ["设备传感器", "生产流程", "供应链"] as const;

/** 延展环节行（指导 S013） */
const EXTEND_STAGES = ["设计", "工艺", "生产", "管理", "服务"] as const;

function QualifierGlyph({ kind }: { kind: "volume" | "sources" | "shapes" }) {
  if (kind === "volume") {
    return (
      <svg viewBox="0 0 48 48" className="df-glyph" aria-hidden="true">
        {[0, 1, 2].map((r) =>
          [0, 1, 2, 3].map((c) => (
            <rect
              key={`${r}-${c}`}
              x={6 + c * 10}
              y={8 + r * 12}
              width="6.5"
              height="6.5"
              rx="1.5"
              className="df-glyph-fill"
            />
          )),
        )}
      </svg>
    );
  }
  if (kind === "sources") {
    return (
      <svg viewBox="0 0 48 48" className="df-glyph" aria-hidden="true">
        <path d="M5 10 H26 C36 10 36 24 44 24" className="df-glyph-line" />
        <path d="M5 24 H44" className="df-glyph-line" />
        <path d="M5 38 H26 C36 38 36 24 44 24" className="df-glyph-line" />
        <circle cx="44" cy="24" r="4" className="df-glyph-dot" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 48" className="df-glyph" aria-hidden="true">
      <rect x="5" y="16" width="15" height="15" rx="2" className="df-glyph-line" />
      <circle cx="30.5" cy="23.5" r="8" className="df-glyph-line" />
      <path d="M39 32 L44 20 L48 32 Z" className="df-glyph-line" />
    </svg>
  );
}

export default function A002Chapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const qualsOn = step >= 1;
  const coverOn = step >= 2;
  const thesisOn = step >= 3;

  const rootCls = [
    "df-scene",
    "scene-pad",
    qualsOn && "is-quals",
    coverOn && "is-cover",
    thesisOn && "is-thesis",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootCls} data-state={state}>
      <header className="df-head">
        <h1 className="df-headline">
          工业大数据：<em>海量、多源、异构</em>的数据集合
        </h1>
        <div className="df-head-rule rule" />
      </header>

      <div className="df-main">
        {/* 左区：定义句 + 三条限定词带（U003） */}
        <div className="df-left">
          <section className="df-definition card" aria-label="定义">
            <p className="df-def-no">
              <strong>不是</strong>某一个软件里存的那份数据
            </p>
            <p className="df-def-yes">
              <strong>而是</strong>工业活动中产生的
              <span className="df-def-term">数据集合</span>
            </p>
          </section>

          <div className="df-bands">
            {QUALIFIERS.map((q, i) => (
              <section
                key={q.word}
                className="df-band"
                style={{ "--df-i": i } as CSSProperties}
              >
                <QualifierGlyph kind={q.glyph} />
                <p className="df-band-line">
                  <span className="df-band-word">{q.word}</span>
                  ：{q.text}
                </p>
              </section>
            ))}
          </div>
        </div>

        {/* 右区：数据集合的覆盖边界（U004），未点亮时保留 ghost 槽位 */}
        <div className="df-right">
          <p className="df-set-ghost">覆盖范围 · 待点亮</p>
          <section className="df-set" aria-label="数据集合覆盖范围">
            <p className="df-set-cap">数据集合 · 覆盖范围</p>
            <div className="df-set-row">
              <p className="df-set-label">至少覆盖 · 这些对象</p>
              <div className="df-chips">
                {COVER_OBJECTS.map((o, i) => (
                  <span
                    key={o}
                    className="df-chip df-chip--object"
                    style={{ "--df-j": i } as CSSProperties}
                  >
                    {o}
                  </span>
                ))}
              </div>
            </div>
            <div className="df-set-row">
              <p className="df-set-label">再往宽了看 · 延展环节</p>
              <div className="df-chips">
                {EXTEND_STAGES.map((s, i) => (
                  <span
                    key={s}
                    className="df-chip df-chip--stage"
                    style={{ "--df-j": i } as CSSProperties}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* 底部判断条：双排除标记（U005，exact S014） */}
      <div className="df-thesis" aria-hidden={!thesisOn}>
        <p className="df-thesis-ghost">排除口径 · 待收束</p>
        <div className="df-thesis-plate card-glass">
          <span className="df-thesis-kicker">所以 · 排除口径</span>
          <p className="df-thesis-line">
            不能缩减成
            <span className="df-exclude" style={{ "--df-k": 0 } as CSSProperties}>
              一张生产报表
            </span>
            ，也不能只看成
            <span className="df-exclude" style={{ "--df-k": 1 } as CSSProperties}>
              某类设备的实时曲线
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
