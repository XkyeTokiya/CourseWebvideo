import { Fragment } from "react";
import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./ThreeDecisionCombo.css";

const states = ["reading-chain-set", "cards-assembled", "interlock-concluded"] as const;

const CHAIN_STEPS = [
  { name: "附着表面", desc: "设备·物料·半成品·成品" },
  { name: "设备读取", desc: "条码枪·手机·PDA" },
  { name: "系统解析", desc: "读出的内容 → 有用信息" },
] as const;

const DECISIONS = [
  {
    kicker: "第一件事",
    title: "载体类型",
    options: ["条形码", "二维码", "RFID"],
    glyph: "carrier",
  },
  {
    kicker: "第二件事",
    title: "打印方式",
    options: ["喷码", "激光", "纸标签"],
    glyph: "print",
  },
  {
    kicker: "第三件事",
    title: "识读设备",
    options: ["条码枪", "手机", "PDA"],
    glyph: "device",
  },
] as const;

const INTERLOCK_RISKS = [
  { tone: "warning", label: "载体再合适", verdict: "现场没有对应设备 → 读不出来" },
  { tone: "danger", label: "设备再好", verdict: "码面经不起现场条件 → 白搭" },
] as const;

/* 一维条码（变宽竖条），坐标 [x, width] 手排 */
const CODE_BARS: Array<[number, number]> = [
  [8, 7],
  [19, 4],
  [27, 9],
  [40, 4],
  [48, 7],
  [59, 11],
  [74, 4],
  [82, 6],
  [92, 9],
  [105, 4],
];

function CarrierGlyph() {
  return (
    <svg viewBox="0 0 160 84" className="tc-glyph" aria-hidden>
      {CODE_BARS.map(([x, w], i) => (
        <rect
          key={x}
          x={x}
          y={16}
          width={w}
          height={48}
          className="tc-glyph-bar"
          style={{ "--tc-d": `${i * 40}ms` } as CSSProperties}
        />
      ))}
      <line x1={4} y1={70} x2={112} y2={70} className="tc-glyph-underline" />
      <rect x={116} y={54} width={20} height={20} className="tc-glyph-tagrect" />
      <path d="M114 46 a12 12 0 0 1 12 -12" pathLength={100} className="tc-glyph-arc" style={{ "--tc-d": "260ms" } as CSSProperties} />
      <path d="M114 34 a24 24 0 0 1 24 -24" pathLength={100} className="tc-glyph-arc" style={{ "--tc-d": "420ms" } as CSSProperties} />
    </svg>
  );
}

function PrintGlyph() {
  return (
    <svg viewBox="0 0 160 84" className="tc-glyph" aria-hidden>
      <path d="M64 6 h32 l-8 18 h-16 z" className="tc-glyph-nozzle" />
      <line x1={80} y1={26} x2={80} y2={56} className="tc-glyph-beam" />
      <circle cx={80} cy={58} r={4.5} className="tc-glyph-spark" />
      <line x1={22} y1={66} x2={138} y2={66} className="tc-glyph-surface" />
      <line x1={62} y1={73} x2={98} y2={73} className="tc-glyph-etch" />
    </svg>
  );
}

function DeviceGlyph() {
  return (
    <svg viewBox="0 0 160 84" className="tc-glyph" aria-hidden>
      <polygon points="72,34 148,10 148,56" className="tc-glyph-cone" />
      <rect x={14} y={24} width={48} height={20} rx={3} className="tc-glyph-gunbody" />
      <path d="M22 44 h16 l8 26 h-20 z" className="tc-glyph-gunbody" />
      <rect x={62} y={30} width={12} height={8} className="tc-glyph-gunbody" />
      <rect x={40} y={44} width={6} height={12} className="tc-glyph-trigger" />
      <line x1={136} y1={16} x2={136} y2={52} className="tc-glyph-target" />
      <line x1={144} y1={20} x2={144} y2={48} className="tc-glyph-target" />
    </svg>
  );
}

const GLYPHS = {
  carrier: CarrierGlyph,
  print: PrintGlyph,
  device: DeviceGlyph,
} as const;

export default function ThreeDecisionCombo({ step }: ChapterStepProps) {
  const state = states[step] ?? states[states.length - 1];
  const cardsAssembled = state !== "reading-chain-set";
  const interlocked = state === "interlock-concluded";

  return (
    <div className="tc-scene scene-pad">
      <header className="tc-anchor">
        <div>
          <p className="tc-anchor-kicker">判断方向 · 选型框架</p>
          <p className="tc-anchor-title">选型是一次三项组合决定</p>
        </div>
        <span className="tc-anchor-note">同时定三件事</span>
      </header>
      <div className="rule tc-anchor-rule" />

      <ol className="tc-chain">
        {CHAIN_STEPS.map((band, i) => (
          <Fragment key={band.name}>
            {i > 0 && (
              <li className="tc-chain-link" aria-hidden style={{ "--tc-i": String(i) } as CSSProperties}>
                <svg viewBox="0 0 64 24" className="tc-link-svg">
                  <line x1={4} y1={12} x2={44} y2={12} className="tc-link-line" />
                  <path d="M44 4 L58 12 L44 20 Z" className="tc-link-head" />
                </svg>
              </li>
            )}
            <li
              className="tc-chain-band card"
              style={{ "--tc-i": String(i) } as CSSProperties}
            >
              <span className="tc-band-lamp" aria-hidden />
              <span className="tc-band-idx hero-num">{`0${i + 1}`}</span>
              <span className="tc-band-text">
                <span className="tc-band-name">{band.name}</span>
                <span className="tc-band-desc">{band.desc}</span>
              </span>
            </li>
          </Fragment>
        ))}
      </ol>

      <ul className={`tc-candidates${interlocked ? " is-linked" : ""}`}>
        {DECISIONS.map((d, i) => {
          const Glyph = GLYPHS[d.glyph];
          return (
            <li
              key={d.title}
              className={`tc-card card${cardsAssembled ? "" : " is-ghost"}`}
              style={{ "--tc-i": String(i) } as CSSProperties}
            >
              <span className="tc-card-ghosttag" aria-hidden>
                候选 · 待落位
              </span>
              <div className="tc-card-body">
                <p className="tc-card-kicker">{d.kicker}</p>
                <p className="tc-card-title">{d.title}</p>
                <Glyph />
                <ul className="tc-card-options">
                  {d.options.map((o, oi) => (
                    <li
                      key={o}
                      className="tc-option"
                      style={{ "--tc-o": String(oi) } as CSSProperties}
                    >
                      {o}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ul>

      <div className={`tc-interlock${interlocked ? " is-on" : ""}`} aria-hidden={!interlocked}>
        <div className="tc-interlock-plate card-glass">
          <div className="tc-interlock-lead">
            <p className="tc-interlock-kicker">三项牵连</p>
            <p className="tc-interlock-hero">
              一套组合，<em>不是三张各管各的清单</em>
            </p>
            <p className="tc-interlock-sub">任一单项变化，牵动整体</p>
          </div>
          <div className="tc-interlock-risks">
            {INTERLOCK_RISKS.map((r, i) => (
              <div
                key={r.label}
                className="tc-risk"
                data-tone={r.tone}
                style={{ "--tc-i": String(i) } as CSSProperties}
              >
                <p className="tc-risk-label">{r.label}</p>
                <p className="tc-risk-verdict">{r.verdict}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
