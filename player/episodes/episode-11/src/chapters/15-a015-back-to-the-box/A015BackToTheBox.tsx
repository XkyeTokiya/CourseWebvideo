import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A015BackToTheBox.css";

/**
 * A015 · 回扣开场对象 — Courseplay-bound base scene S-A015。
 * recipe: image-with-summary-rail · 关系机制：persistent-media-reading ——
 * 收货台主图回扣开场并在左侧持续在场，编号总结带七站依次落位成一条完整链条；
 * 第 2 拍主图与总结带保持，最终判断条在下方收束。
 * R024 由主图与编号总结带的并列、以及主图在上判断在下的上下位置承载。
 * 全部主体逐字取自本章口播 beat 1，不引入 packet 外案例或主题（护栏 C016）。
 */
const stateByStep = [
  "roles-recapped",
  "island-recap-settled",
] as const;

type A015State = (typeof stateByStep)[number];

/** 七段主体 = 本章口播 beat 1 的罗列；不写各自职责，避免引入本拍之外的事实。 */
const RAIL_STOPS = [
  { no: "01", name: "原材料供应商" },
  { no: "02", name: "生产商" },
  { no: "03", name: "物流商" },
  { no: "04", name: "经销商" },
  { no: "05", name: "零售商" },
  { no: "06", name: "药店" },
  { no: "07", name: "医院" },
];

export default function A015BackToTheBox({ step }: ChapterStepProps) {
  const state: A015State =
    stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const settled = state === "island-recap-settled";

  return (
    <div className={`bb-scene scene-pad${settled ? " is-settled" : ""}`}>
      <header className="bb-head">
        <h1 className="bb-title">回到那盒药</h1>
        <p className="bb-lead">从原材料到药店医院，各自负责一段</p>
      </header>

      <div className="bb-body">
        {/* M004 未就位：只保留素净空白版位，不放任何占位图或占位文案 */}
        <div className="bb-media" aria-hidden="true" />

        <section className="bb-band" aria-label="各主体分工总结带">
          <span className="bb-band-line" aria-hidden="true" />
          <ol className="bb-stops">
            {RAIL_STOPS.map((role, i) => (
              <li
                key={role.no}
                className="bb-stop"
                style={{ "--bb-i": String(i) } as CSSProperties}
              >
                <span className="bb-stop-node" aria-hidden="true" />
                <span className="bb-stop-no hero-num">{role.no}</span>
                <span className="bb-stop-name">{role.name}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section className="bb-judgment" aria-label="最终判断">
        <svg className="bb-islands" viewBox="0 0 190 64" aria-hidden="true">
          <rect className="bb-island bb-island--a" x="8" y="24" width="26" height="26" />
          <rect className="bb-island bb-island--b" x="82" y="24" width="26" height="26" />
          <rect className="bb-island bb-island--c" x="156" y="24" width="26" height="26" />
          <line className="bb-broken bb-broken--a" x1="40" y1="37" x2="64" y2="37" />
          <line className="bb-broken bb-broken--b" x1="114" y1="37" x2="138" y2="37" />
        </svg>
        <p className="bb-chain">
          <span className="bb-chain-item">记录彼此不认识</span>
          <svg className="bb-chain-arrow bb-chain-arrow--a" viewBox="0 0 30 24" aria-hidden="true">
            <polyline points="4,4 20,12 4,20" />
          </svg>
          <span className="bb-chain-item">形成数据孤岛</span>
          <svg className="bb-chain-arrow bb-chain-arrow--b" viewBox="0 0 30 24" aria-hidden="true">
            <polyline points="4,4 20,12 4,20" />
          </svg>
          <span className="bb-chain-item">追溯变得困难</span>
        </p>
      </section>
    </div>
  );
}
