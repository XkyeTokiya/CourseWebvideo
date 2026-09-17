import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./A003RecordsUnrecognized.css";

/**
 * A003 · 记录很多却不互认 —— split-compare-with-thesis
 *
 * step → semantic state（handoff steps 逐行声明，允许重复，不把 step 当 active 索引）：
 *   0  compare-frame-open    建立标题与空置两栏骨架，亮出命题
 *   1  records-listed        左栏依次补入四类记录
 *   2  recognition-missing   右栏补入互认缺口，两栏并列成立
 *   3  islands-formed        中部口径条补入三类不一致，向底部判断条收束出数据孤岛
 */
const stateByStep = [
  "compare-frame-open",
  "records-listed",
  "recognition-missing",
  "islands-formed",
] as const;

type A003State = (typeof stateByStep)[number];

const RECORDS = [
  { no: "01", party: "原材料供应商", record: "原料批次" },
  { no: "02", party: "生产商", record: "生产工单" },
  { no: "03", party: "物流商", record: "运输单据" },
  { no: "04", party: "药店", record: "销售流水" },
];

const MISMATCHES = ["编码规则", "数据口径", "系统接口"];

/* 对不齐刻度的落点（对齐基准线在 x=52）：每个口径条的错误位置不同 */
const TICK_X: ReadonlyArray<readonly [number, number]> = [
  [38, 66],
  [30, 74],
  [44, 60],
];

const DROP_X = [274, 850, 1426];

export default function A003RecordsUnrecognized({ step }: ChapterStepProps) {
  const state: A003State = stateByStep[step] ?? stateByStep[stateByStep.length - 1];

  const hasRecords = state !== "compare-frame-open";
  const hasGap = state === "recognition-missing" || state === "islands-formed";
  const hasMid = state === "islands-formed";
  const hasThesis = state === "islands-formed";

  const rootClass = [
    "ru-scene",
    "scene-pad",
    hasRecords && "has-records",
    hasGap && "has-gap",
    hasMid && "has-mid",
    hasThesis && "has-thesis",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClass}>
      {/* ── headline slot · S009：两栏共同的命题标题 ── */}
      <header className="ru-head">
        <h1 className="ru-title">
          有记录<span className="ru-not">不等于</span>互相认识
        </h1>
        <hr className="rule ru-head-rule" />
      </header>

      <div className="ru-columns">
        {/* ── left slot · U007：各自的记录（记录本身清楚扎实） ── */}
        <section className="ru-col ru-col--ledger">
          <h2 className="ru-col-cap">各自的记录</h2>
          <ul className="ru-ledger">
            {RECORDS.map((item, i) => (
              <li key={item.no} className={`ru-rec ru-rec-${i}`}>
                <span className="ru-rec-no hero-num">{item.no}</span>
                <span className="ru-rec-party">{item.party}</span>
                <span className="ru-rec-lead" aria-hidden="true">
                  <i>记的是</i>
                </span>
                <span className="ru-rec-chip">{item.record}</span>
              </li>
            ))}
          </ul>
          <div className="ru-verdict">
            <svg className="ru-verdict-mark" viewBox="0 0 26 26" aria-hidden="true">
              <path className="ru-verdict-path" d="M4 14 L10 20 L22 6" pathLength={100} />
            </svg>
            <span>各自都很清楚</span>
          </div>
        </section>

        {/* ── right slot · U008：彼此之间（缺一个共同依据） ── */}
        <section className="ru-col ru-col--gap">
          <h2 className="ru-col-cap">彼此之间</h2>
          <div className="ru-gap">
            <div className="ru-gap-row">
              {RECORDS.flatMap((item, i) => {
                const nodes = [
                  <span key={item.record} className={`ru-chip ru-chip-${i}`}>
                    {item.record}
                  </span>,
                ];
                if (i < RECORDS.length - 1) {
                  nodes.push(
                    <svg
                      key={`brk-${i}`}
                      className={`ru-break ru-break-${i}`}
                      viewBox="0 0 40 28"
                      aria-hidden="true"
                    >
                      <line className="ru-break-line" x1="11" y1="5" x2="29" y2="23" pathLength={100} />
                      <line className="ru-break-line" x1="29" y1="5" x2="11" y2="23" pathLength={100} />
                    </svg>,
                  );
                }
                return nodes;
              })}
            </div>
            <p className="ru-gap-line">
              <span className="ru-gap-mark">缺少一个共同的依据</span>
            </p>
          </div>
        </section>
      </div>

      {/* ── medium slot · U009/G009：不同主体之间的三类不一致 ── */}
      <div className="ru-mid">
        {MISMATCHES.map((term, i) => (
          <div key={term} className={`ru-inc ru-inc-${i}`}>
            <svg className="ru-inc-glyph" viewBox="0 0 104 44" aria-hidden="true">
              <line className="ru-inc-guide" x1="52" y1="5" x2="52" y2="39" />
              <line className="ru-inc-rule" x1="10" y1="13" x2="94" y2="13" />
              <line className="ru-inc-rule" x1="10" y1="31" x2="94" y2="31" />
              <line
                className="ru-inc-tick ru-inc-tick-a"
                x1={TICK_X[i][0]}
                y1="6"
                x2={TICK_X[i][0]}
                y2="20"
              />
              <line
                className="ru-inc-tick ru-inc-tick-b"
                x1={TICK_X[i][1]}
                y1="24"
                x2={TICK_X[i][1]}
                y2="38"
              />
            </svg>
            <span className="ru-inc-term">{term}</span>
            <span className="ru-inc-tag">不一致</span>
          </div>
        ))}
      </div>

      {/* ── 单向收束：口径条 → 底部判断条（R006 载体，只朝下） ── */}
      <div className="ru-drop" aria-hidden="true">
        <svg className="ru-drop-svg" viewBox="0 0 1700 34">
          {DROP_X.map((x, i) => (
            <polyline
              key={x}
              className={`ru-drop-arrow ru-drop-${i}`}
              points={`${x - 16},6 ${x},22 ${x + 16},6`}
            />
          ))}
        </svg>
      </div>

      {/* ── bottom-thesis slot · U009/G010：上下游不易关联，形成数据孤岛 ── */}
      <div className="ru-thesis">
        <div className="ru-thesis-copy">
          <p className="ru-thesis-line">上下游信息不易关联</p>
          <p className="ru-thesis-verdict">形成一个个数据孤岛</p>
        </div>
        <svg className="ru-islands" viewBox="0 0 1160 156" aria-hidden="true">
          <line className="ru-chain" x1="8" y1="112" x2="1152" y2="112" />
          {RECORDS.map((item, i) => {
            const cx = 150 + i * 285;
            return (
              <g key={item.party} className={`ru-island ru-island-${i}`}>
                <line className="ru-island-base" x1={cx - 98} y1="112" x2={cx + 98} y2="112" />
                <path
                  className="ru-island-mound"
                  d={`M ${cx - 86} 112 Q ${cx} 36 ${cx + 86} 112 Z`}
                />
                <text className="ru-island-label" x={cx} y="148" textAnchor="middle">
                  {item.party}
                </text>
              </g>
            );
          })}
          {[0, 1, 2].map((i) => {
            const x = 292 + i * 285;
            return (
              <g key={`cut-${i}`} className={`ru-cut ru-cut-${i}`}>
                <line x1={x - 12} y1="98" x2={x + 2} y2="126" />
                <line x1={x - 2} y1="98" x2={x + 12} y2="126" />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
