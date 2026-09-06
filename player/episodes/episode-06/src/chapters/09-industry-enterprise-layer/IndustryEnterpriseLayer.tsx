import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./IndustryEnterpriseLayer.css";

const states = [
  "industry-card-set",
  "enterprise-card-set",
  "narrowing-concluded",
] as const;
type IeState = (typeof states)[number];

const flags: Record<IeState, { industry: boolean; enterprise: boolean; takeaway: boolean }> = {
  "industry-card-set": { industry: true, enterprise: false, takeaway: false },
  "enterprise-card-set": { industry: true, enterprise: true, takeaway: false },
  "narrowing-concluded": { industry: true, enterprise: true, takeaway: true },
};

type DutyTone = "register" | "resolve" | "access";
type Duty = { tone: DutyTone; label: string; desc?: string };
type CardSpec = {
  slot: "industry" | "enterprise";
  scope: string;
  name: string;
  duties: Duty[];
  line: string;
};

const CARDS: CardSpec[] = [
  {
    slot: "industry",
    scope: "面向行业",
    name: "二级节点",
    duties: [
      { tone: "register", label: "注册" },
      { tone: "resolve", label: "解析" },
    ],
    line: "面向行业提供标识注册和解析服务",
  },
  {
    slot: "enterprise",
    scope: "服务特定工业企业",
    name: "企业节点",
    duties: [
      { tone: "register", label: "注册" },
      { tone: "resolve", label: "解析" },
      { tone: "access", label: "数据访问方式", desc: "可结合企业特点定义" },
    ],
    line: "服务特定工业企业，承担标识注册和解析，还可以结合企业特点定义数据访问方式。",
  },
];

function DutyGlyph({ tone }: { tone: DutyTone }) {
  if (tone === "register") {
    return (
      <svg viewBox="0 0 48 48" className="ie-glyph" aria-hidden>
        <rect x="9" y="8" width="30" height="32" rx="4" />
        <circle cx="24" cy="19" r="4.5" />
        <line x1="16" y1="31" x2="32" y2="31" />
      </svg>
    );
  }
  if (tone === "resolve") {
    return (
      <svg viewBox="0 0 48 48" className="ie-glyph" aria-hidden>
        <circle cx="21" cy="21" r="10" />
        <line x1="28.5" y1="28.5" x2="39" y2="39" />
        <circle cx="21" cy="21" r="2.2" className="ie-glyph-dot" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 48" className="ie-glyph" aria-hidden>
      <path d="M13 40 V9 H35 V40" />
      <line x1="7" y1="40" x2="41" y2="40" />
      <circle cx="24" cy="27" r="3.5" className="ie-glyph-dot" />
    </svg>
  );
}

function NarrowFunnel() {
  return (
    <svg viewBox="0 0 440 180" className="ie-funnel" aria-hidden>
      <line className="ie-funnel-guide" x1="70" y1="42" x2="180" y2="128" />
      <line className="ie-funnel-guide" x1="370" y1="42" x2="260" y2="128" />
      <rect
        className="ie-funnel-bar"
        x="70"
        y="10"
        width="300"
        height="30"
        style={{ "--ie-fi": "0" } as CSSProperties}
      />
      <text className="ie-funnel-barlabel" x="220" y="32" textAnchor="middle">
        行业
      </text>
      <rect
        className="ie-funnel-bar"
        x="125"
        y="56"
        width="190"
        height="30"
        style={{ "--ie-fi": "1" } as CSSProperties}
      />
      <text className="ie-funnel-barlabel" x="220" y="78" textAnchor="middle">
        企业
      </text>
      <circle className="ie-funnel-point" cx="220" cy="138" r="9" />
      <text className="ie-funnel-out" x="244" y="146">
        信息 / 访问入口
      </text>
    </svg>
  );
}

export default function IndustryEnterpriseLayer({ step }: ChapterStepProps) {
  const state = states[step] ?? states[states.length - 1];
  const f = flags[state];

  return (
    <div className="ie-scene scene-pad">
      <header className="ie-header">
        <h1 className="ie-headline">
          节点逐层下行，范围缩小：<em>行业与企业</em>
        </h1>
        <div className="ie-down">
          <svg viewBox="0 0 28 60" className="ie-down-glyph" aria-hidden>
            {[0, 1, 2].map((i) => (
              <path
                key={i}
                className="ie-down-chev"
                d={`M4 ${6 + i * 18} L14 ${14 + i * 18} L24 ${6 + i * 18}`}
                style={{ "--ie-di": String(i) } as CSSProperties}
              />
            ))}
          </svg>
          <span className="ie-down-text">再往下看 · 继续下行</span>
        </div>
      </header>

      <div className="ie-cards">
        {CARDS.map((spec) => {
          const on = spec.slot === "industry" ? f.industry : f.enterprise;
          return (
            <div key={spec.slot} className={`ie-slot${on ? " is-on" : ""}`}>
              <article className="ie-card card" aria-hidden={!on}>
                <span className="ie-card-scope">{spec.scope}</span>
                <h2 className="ie-card-name">{spec.name}</h2>
                <hr className="rule ie-card-rule" />
                <ul className="ie-duties">
                  {spec.duties.map((d, i) => (
                    <li
                      key={d.label}
                      className={`ie-duty ie-duty-${d.tone}`}
                      style={{ "--ie-ci": String(i) } as CSSProperties}
                    >
                      <DutyGlyph tone={d.tone} />
                      <div className="ie-duty-text">
                        <span className="ie-duty-label">{d.label}</span>
                        {d.desc ? <span className="ie-duty-desc">{d.desc}</span> : null}
                      </div>
                    </li>
                  ))}
                </ul>
                <p className="ie-card-line">{spec.line}</p>
              </article>
              <div className="ie-ghost" aria-hidden>
                <span className="ie-ghost-label">节点卡 · 待落位</span>
                <div className="ie-ghost-skel">
                  <span className="ie-ghost-bar ie-ghost-bar-name" />
                  {spec.duties.map((d) => (
                    <span key={d.label} className="ie-ghost-bar" />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div
        className={`ie-takeaway card${f.takeaway ? " is-on" : ""}`}
        aria-hidden={!f.takeaway}
      >
        <NarrowFunnel />
        <div className="ie-takeaway-text">
          <p className="ie-takeaway-kicker">请求的落点</p>
          <p className="ie-takeaway-sentence">
            请求就这样一层层缩小范围，落到具体企业能提供的<strong>信息</strong>或
            <strong>访问入口</strong>上。
          </p>
        </div>
      </div>
    </div>
  );
}

