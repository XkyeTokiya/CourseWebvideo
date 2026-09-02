import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./FourDutiesChain.css";

const stateByStep = [
  "duty-faces-complete",
  "breakpoint-faces-marked",
  "chain-ends-named",
] as const;

type State = (typeof stateByStep)[number];

const CARDS = [
  {
    name: "网络",
    duty: "连接",
    dutyDesc: "信息能够传递",
    missing: "现场信息无法持续上来",
  },
  {
    name: "平台",
    duty: "汇聚",
    dutyDesc: "资源与能力能够协同",
    missing: "分散能力仍各自处理",
  },
  {
    name: "数据",
    duty: "驱动",
    dutyDesc: "理解和优化获得依据",
    missing: "判断失去根据",
  },
  {
    name: "安全",
    duty: "保障",
    dutyDesc: "信息与行动可信持续",
    missing: "整条协同无法放心运行",
    span: "覆盖整条协同",
  },
] as const;

export default function FourDutiesChainChapter({ step }: ChapterStepProps) {
  const state: State = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const idx = stateByStep.indexOf(state);
  const missingOn = idx >= 1;
  const closed = idx >= 2;

  return (
    <div className={`fd-scene scene-pad${closed ? " is-closed" : ""}`}>
      <header className="fd-title">
        <span className="fd-title-mark" />
        <h1 className="fd-title-text">
          四体系共同连接生产现场与数字空间，<em>任一职责缺位都会留下断点</em>
        </h1>
      </header>

      <div className="fd-cards">
        {CARDS.map((c, i) => (
          <article
            key={c.name}
            className={`card fd-card${idx >= 0 ? " is-on" : ""}`}
            style={{ "--fd-i": i } as CSSProperties}
          >
            <header className="fd-card-head">
              <span className="fd-card-name">{c.name}</span>
              <span className="fd-duty-chip">{c.duty}</span>
              {"span" in c && c.span && <span className="fd-span-tag">{c.span}</span>}
            </header>
            <div className="fd-face fd-duty">
              <span className="fd-face-label">承担什么</span>
              <p className="fd-face-desc" data-on={idx >= 0} style={{ transitionDelay: `${260 + i * 300}ms` }}>
                {c.dutyDesc}
              </p>
            </div>
            <div className={`fd-face fd-missing${missingOn ? " is-on" : ""}`}>
              <span className="fd-face-label">缺位时</span>
              <p className="fd-face-desc" data-on={missingOn} style={{ transitionDelay: `${200 + i * 300}ms` }}>
                {c.missing}
              </p>
            </div>
          </article>
        ))}
      </div>

      <aside className="fd-takeaway" data-on={closed}>
        <span className="fd-takeaway-slot">takeaway · 收束槽</span>
        <div className="fd-takeaway-body">
          <span className="fd-end-chip fd-takeaway-end">生产现场</span>
          <span className="fd-takeaway-mark" />
          <span className="fd-takeaway-text">连接、汇聚、驱动、保障共同构成一条协同链</span>
          <span className="fd-end-chip fd-takeaway-end">数字空间</span>
        </div>
      </aside>
    </div>
  );
}
