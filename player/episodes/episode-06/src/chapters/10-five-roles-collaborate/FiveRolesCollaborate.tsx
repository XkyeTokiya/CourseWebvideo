import type { CSSProperties, ReactNode } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./FiveRolesCollaborate.css";

const states = [
  "roles-placed",
  "layering-concluded",
] as const;
type FrState = (typeof states)[number];

const flags: Record<FrState, { notes: boolean; settled: boolean }> = {
  "roles-placed": { notes: false, settled: false },
  "layering-concluded": { notes: true, settled: true },
};

/** 全球协同徽记：两个交叠的范围圈，交叠处即协同 —— 指大范围协同 */
function ScopeRings() {
  return (
    <svg viewBox="0 0 76 76" className="fr-mark" aria-hidden>
      <circle cx="30" cy="38" r="21" className="fr-mark-line" />
      <circle cx="47" cy="38" r="21" className="fr-mark-line fr-mark-soft" />
      <circle cx="38.5" cy="38" r="4.5" className="fr-mark-node" />
    </svg>
  );
}

/** 行业徽记：一根主轴接出三行行业格 —— 指“连接行业” */
function IndustryComb() {
  return (
    <svg viewBox="0 0 76 76" className="fr-mark" aria-hidden>
      <line x1="20" y1="12" x2="20" y2="64" className="fr-mark-line" />
      <line x1="20" y1="19" x2="46" y2="19" className="fr-mark-line fr-mark-soft" />
      <line x1="20" y1="38" x2="46" y2="38" className="fr-mark-line fr-mark-soft" />
      <line x1="20" y1="57" x2="46" y2="57" className="fr-mark-line fr-mark-soft" />
      <rect x="48" y="13" width="12" height="12" className="fr-mark-box" />
      <rect x="48" y="32" width="12" height="12" className="fr-mark-box" />
      <rect x="48" y="51" width="12" height="12" className="fr-mark-box" />
    </svg>
  );
}

/** 企业徽记：对象本体与它的数据卡贴在一起 —— 指“贴近对象和它的数据” */
function EnterpriseCase() {
  return (
    <svg viewBox="0 0 76 76" className="fr-mark" aria-hidden>
      <rect x="12" y="22" width="30" height="32" className="fr-mark-box" />
      <circle cx="27" cy="38" r="3.5" className="fr-mark-node" />
      <rect x="40" y="28" width="24" height="26" className="fr-mark-card" />
      <line x1="45" y1="37" x2="58" y2="37" className="fr-mark-tick" />
      <line x1="45" y1="45" x2="54" y2="45" className="fr-mark-tick" />
    </svg>
  );
}

/** 查询侧徽记：敞开的入口门 + 进入的箭头 —— 指“守在查询者一侧提供入口” */
function QueryGate() {
  return (
    <svg viewBox="0 0 76 76" className="fr-mark" aria-hidden>
      <line x1="30" y1="16" x2="30" y2="62" className="fr-mark-line" />
      <line x1="58" y1="16" x2="58" y2="62" className="fr-mark-line" />
      <line x1="24" y1="16" x2="64" y2="16" className="fr-mark-line" />
      <line x1="8" y1="40" x2="40" y2="40" className="fr-mark-arrow" />
      <path d="M33 31 L44 40 L33 49" className="fr-mark-arrow" />
    </svg>
  );
}

/** 侧栏演示：一次查询扫过各服务范围，落到负责的角色上 —— 不预知存放位置 */
function LocatorGlyph() {
  return (
    <svg viewBox="0 0 400 128" className="fr-locator" aria-hidden>
      <rect x="16" y="86" width="80" height="16" rx="4" className="fr-seg" />
      <rect x="112" y="86" width="80" height="16" rx="4" className="fr-seg" />
      <rect x="208" y="86" width="80" height="16" rx="4" className="fr-seg fr-seg-hit" />
      <rect x="304" y="86" width="80" height="16" rx="4" className="fr-seg" />
      <path
        d="M56 40 C 140 4, 220 8, 248 46"
        pathLength={100}
        className="fr-locator-track"
      />
      <g className="fr-pin">
        <line x1="56" y1="34" x2="56" y2="58" className="fr-pin-stem" />
        <circle cx="56" cy="26" r="10" className="fr-pin-head" />
        <circle cx="56" cy="26" r="3.5" className="fr-pin-core" />
      </g>
      <circle cx="248" cy="94" r="22" className="fr-lock" />
    </svg>
  );
}

interface FrBandDef {
  id: string;
  scope: string;
  roles: string[];
  duty: string;
  glyph: ReactNode;
  querySide?: boolean;
}

const BANDS: FrBandDef[] = [
  {
    id: "scope",
    scope: "全球协同",
    roles: ["国际根节点", "国家顶级节点"],
    duty: "管大范围协同",
    glyph: <ScopeRings />,
  },
  {
    id: "industry",
    scope: "行业",
    roles: ["二级节点"],
    duty: "连接行业",
    glyph: <IndustryComb />,
  },
  {
    id: "enterprise",
    scope: "企业",
    roles: ["企业节点"],
    duty: "贴近对象和它的数据",
    glyph: <EnterpriseCase />,
  },
  {
    id: "query",
    scope: "查询侧",
    roles: ["递归解析节点"],
    duty: "守在查询者一侧，提供入口",
    glyph: <QueryGate />,
    querySide: true,
  },
];

export default function FiveRolesCollaborate({ step }: ChapterStepProps) {
  const state = states[step] ?? states[states.length - 1];
  const f = flags[state];

  return (
    <div className="fr-scene scene-pad">
      <header className="fr-header">
        <h1 className="fr-headline">
          五个角色，<em>一张协作网</em>
        </h1>
      </header>

      <div className={`fr-overview${f.settled ? " is-weak" : ""}`}>
        <p className="fr-overview-main">
          把这几个角色放在一起看——它们不是
          <span className="fr-strike">五个孤立的数据库</span>。
        </p>
      </div>

      <div className="fr-main">
        <div className="fr-stack">
          {BANDS.map((band, i) => (
            <div
              key={band.id}
              className="fr-slot"
              style={{ "--fr-b": String(i) } as CSSProperties}
            >
              <div className="fr-ghost" aria-hidden>
                <span className="fr-ghost-tag">待落位</span>
              </div>
              <section
                className={`fr-band card${band.querySide ? " fr-band-query" : ""}`}
              >
                <span
                  className="fr-scope"
                  style={{ "--fr-k": "0" } as CSSProperties}
                >
                  {band.scope}
                </span>
                <span
                  className="fr-roles"
                  style={{ "--fr-k": "1" } as CSSProperties}
                >
                  {band.roles.map((role) => (
                    <span key={role} className="fr-role">
                      {role}
                    </span>
                  ))}
                </span>
                <span
                  className="fr-duty"
                  style={{ "--fr-k": "2" } as CSSProperties}
                >
                  {band.duty}
                </span>
                <span
                  className="fr-mark-slot"
                  style={{ "--fr-k": "3" } as CSSProperties}
                >
                  {band.glyph}
                </span>
                {band.querySide ? (
                  <span
                    className="fr-query-side"
                    style={{ "--fr-k": "4" } as CSSProperties}
                  >
                    查询者一侧
                  </span>
                ) : null}
              </section>
            </div>
          ))}
        </div>

        <aside className={`fr-notes${f.notes ? " is-on" : ""}`}>
          <div className="fr-note-reserve" aria-hidden>
            <span className="fr-note-reserve-tag">协作注记</span>
          </div>
          <div className="fr-note card-glass" aria-hidden={!f.notes}>
            <p className="fr-note-kicker">分层协作的意义</p>
            <p className="fr-note-main">
              查询在<b>不同服务范围</b>之间，找到<b>负责的角色</b>
            </p>
            <div className="rule fr-note-rule" />
            <p className="fr-note-sub">查询的人不必预先知道，信息存放在哪里</p>
            <figure className="fr-note-demo">
              <LocatorGlyph />
              <figcaption className="fr-note-demo-cap">
                一次查询 · 扫过范围，落到负责角色
              </figcaption>
            </figure>
          </div>
        </aside>
      </div>
    </div>
  );
}

