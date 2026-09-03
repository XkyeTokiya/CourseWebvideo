import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./DamageBranch.css";

const states = ["accumulation-shown", "branch-inspected", "fallback-returned"] as const;
type DbState = (typeof states)[number];

const ACCUMULATION_FACTORS = ["油污", "磨损", "划痕"] as const;
const CHECK_STEPS = ["确认损伤可处理", "验证现场设备稳定读取"] as const;
const FALLBACK_OPTIONS = ["重新挑载体", "换打印方式"] as const;

const DEMO_TAGS = ["累积", "检查", "回源"] as const;
const DEMO_VERDICTS: Record<DbState, { tone: "warn" | "ok" | "bad"; text: string }> = {
  "accumulation-shown": { tone: "warn", text: "污渍在累积：油污 · 磨损 · 划痕" },
  "branch-inspected": { tone: "ok", text: "是检查分支，不是自动恢复" },
  "fallback-returned": { tone: "bad", text: "修复后仍读不出，回到源头" },
};

// 9x9 QR-like matrix; finder blocks at three corners
const QR_ROWS = [
  "111001111",
  "101000101",
  "111001111",
  "000010000",
  "011011010",
  "100101101",
  "111001101",
  "101010011",
  "111011001",
] as const;

function QrWearDemo({ state }: { state: DbState }) {
  const inspected = state !== "accumulation-shown";
  return (
    <svg viewBox="0 0 216 216" className="db-qr" aria-hidden>
      <defs>
        <filter id="db-stain-blur" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>
      {QR_ROWS.flatMap((row, r) =>
        row.split("").map((v, c) =>
          v === "1" ? (
            <rect
              key={`${r}-${c}`}
              x={c * 24 + 3}
              y={r * 24 + 3}
              width={18}
              height={18}
              className="db-qr-cell"
            />
          ) : null,
        ),
      )}
      {/* step1: stains accumulate onto the code one by one */}
      <g transform="rotate(-14 122 142)">
        <ellipse
          cx={122}
          cy={142}
          rx={54}
          ry={32}
          filter="url(#db-stain-blur)"
          className="db-stain is-oil"
          style={{ "--db-s": "480ms" } as CSSProperties}
        />
      </g>
      <g transform="rotate(20 62 66)">
        <ellipse
          cx={62}
          cy={66}
          rx={36}
          ry={24}
          filter="url(#db-stain-blur)"
          className="db-stain is-wear"
          style={{ "--db-s": "1120ms" } as CSSProperties}
        />
      </g>
      <line
        x1={36}
        y1={180}
        x2={180}
        y2={36}
        className="db-stain is-scratch"
        style={{ "--db-s": "1760ms" } as CSSProperties}
      />
      {/* step2: inspection brackets + one-shot read sweep */}
      {inspected && (
        <g className="db-inspect">
          <path d="M8 40 V8 H40" />
          <path d="M176 8 H208 V40" />
          <path d="M208 176 V208 H176" />
          <path d="M40 208 H8 V176" />
        </g>
      )}
      {inspected && <line x1={0} y1={0} x2={216} y2={0} className="db-sweep" />}
    </svg>
  );
}

export default function DamageBranch({ step }: ChapterStepProps) {
  const state = states[step] ?? states[states.length - 1];
  const stateIndex = states.indexOf(state);
  const verdict = DEMO_VERDICTS[state];

  const cardClass = (i: number) => `db-issue${stateIndex > i ? " is-past" : ""}`;

  return (
    <div className="db-scene scene-pad">
      <header className="db-head">
        <p className="db-head-kicker">污损现场 · 修复决策</p>
        <h1 className="db-head-title">
          污染与损伤走<em>检查分支</em>，不会自动恢复
        </h1>
      </header>

      <div className="db-main">
        <ol className="db-track">
          <li className={cardClass(0)} data-tone="risk">
            <header className="db-issue-head">
              <span className="db-issue-idx hero-num">01</span>
              <div className="db-issue-titles">
                <p className="db-issue-kicker">累积因素</p>
                <h2 className="db-issue-title">码面可能读不出来</h2>
              </div>
              <span className="db-issue-tone">随时间累积</span>
            </header>
            <ul className="db-factors">
              {ACCUMULATION_FACTORS.map((f, i) => (
                <li
                  key={f}
                  className="db-factor"
                  style={{ "--db-i": String(i) } as CSSProperties}
                >
                  {f}
                </li>
              ))}
            </ul>
          </li>

          {stateIndex >= 1 && (
            <li className={cardClass(1)} data-tone="branch">
              <header className="db-issue-head">
                <span className="db-issue-idx hero-num">02</span>
                <div className="db-issue-titles">
                  <p className="db-issue-kicker">检查分支</p>
                  <h2 className="db-issue-title">修复不是自动完成的动作</h2>
                </div>
                <span className="db-issue-tone">先检查，再修复</span>
              </header>
              <ol className="db-checks">
                {CHECK_STEPS.map((s, i) => (
                  <li
                    key={s}
                    className="db-check"
                    style={{ "--db-i": String(i) } as CSSProperties}
                  >
                    <span className="db-check-box">
                      <svg viewBox="0 0 24 24" aria-hidden>
                        <path
                          d="M5 12.5 L10 17.5 L19 7"
                          className="db-tick"
                          style={{ "--db-t": `${950 + i * 1900}ms` } as CSSProperties}
                        />
                      </svg>
                    </span>
                    <span className="db-check-label">{s}</span>
                    <span className="db-check-order">{i === 0 ? "先" : "再"}</span>
                  </li>
                ))}
              </ol>
            </li>
          )}

          {stateIndex >= 2 && (
            <li className={cardClass(2)} data-tone="exit">
              <header className="db-issue-head">
                <span className="db-issue-idx hero-num">03</span>
                <div className="db-issue-titles">
                  <p className="db-issue-kicker">出路</p>
                  <h2 className="db-issue-title">修复完还是读不出来时</h2>
                </div>
                <span className="db-return-stamp">回到源头</span>
              </header>
              <p className="db-fallback-line">不硬撑，回到选型源头重选：</p>
              <ul className="db-fallbacks">
                {FALLBACK_OPTIONS.map((o, i) => (
                  <li
                    key={o}
                    className="db-fallback"
                    style={{ "--db-i": String(i) } as CSSProperties}
                  >
                    {o}
                  </li>
                ))}
              </ul>
            </li>
          )}
        </ol>

        <div className="db-side">
          <figure className="db-media">
            <div className="db-photo-placeholder card">
              <span className="db-ph-label">image · 16:9</span>
              <span className="db-ph-desc">M004 污损与划伤识别载体特写（待补入）</span>
            </div>
          </figure>

          <div className="db-demo card">
            <header className="db-demo-head">
              <span className="db-demo-title">码面状态演示</span>
              <span className={`db-demo-tag is-${verdict.tone}`}>{DEMO_TAGS[stateIndex]}</span>
            </header>
            <QrWearDemo state={state} />
            <p className={`db-demo-verdict is-${verdict.tone}`}>{verdict.text}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
