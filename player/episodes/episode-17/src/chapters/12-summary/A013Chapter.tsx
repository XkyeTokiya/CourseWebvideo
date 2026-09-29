import "./A013Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

/**
 * 12-summary · A013 本期总结（3 拍，配方 linear-steps-with-takeaway）。
 * 关系机制 ordered-progression：分工行按"根→分支→叶→完整路径"线性落位，
 * 左侧测量树同步点亮层级，收束区最后合拢全片结论。
 *
 * 口径说明：本集 a-page screen guidance 与口播系统性错位约一页，A013 的
 * G036（四个动作：选根分支…点分编码）实属 A012 口播，本章未采用其文本，
 * 也未出现"点分编码"等编码方案表述（silent constraint C014）；上屏内容
 * 按 outline 内容槽位与批准口播重组。
 *
 * step → semantic state 显式映射，允许重复，末态兜底（outline S-A013）：
 * - object-recalled：标题与立场句建立，开场工业电池回场并接上树路径
 * - roles-summarized：分工四行线性落位，树层级同步点亮，支撑区呈现"不重名、可扩展"
 * - final-judgment-set：核心判断区收束"命名、范围、唯一性放进同一套结构"
 */
const stateByStep = [
  "object-recalled",
  "roles-summarized",
  "final-judgment-set",
] as const;

type SummaryState = (typeof stateByStep)[number];

/** 分工四行：全部来自批准口播拍 2 与 outline steps 槽位，不补编码方案（C014） */
type Role = {
  key: string;
  index: string;
  term: string;
  fn: string;
  sub?: string;
};

const ROLES: Role[] = [
  { key: "sm-role-1", index: "01", term: "根节点", fn: "提供方向" },
  { key: "sm-role-2", index: "02", term: "分支", fn: "提供范围" },
  { key: "sm-role-3", index: "03", term: "叶节点", fn: "指向具体对象" },
  {
    key: "sm-role-4",
    index: "04",
    term: "完整路径",
    fn: "串成身份",
    sub: "把这几层串成一个可以说清楚的身份",
  },
];

export default function A013Chapter({ step }: ChapterStepProps) {
  const state: SummaryState =
    stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad sm-root" data-state={state}>
      <header className="sm-header">
        <h1 className="sm-headline">OID 机制的分工</h1>
        <p className="sm-stance">
          靠的不是
          <span className="sm-stance-miss">名字起得花哨</span>
          ，而是
          <span className="sm-stance-hit">一条有边界的树路径</span>
        </p>
      </header>

      <div className="sm-main">
        <section className="sm-board">
          <div className="sm-board-head">
            <h2 className="sm-board-title">一件工业电池</h2>
            <span className="sm-board-note">
              在好几个组织和系统之间 · 被反复引用
            </span>
          </div>
          <svg className="sm-tree" viewBox="0 0 720 470" aria-hidden="true">
            {/* 有边界的树路径：虚线测量框先于树建立 */}
            <rect
              className="sm-frame"
              x={14}
              y={14}
              width={692}
              height={442}
              pathLength={1}
            />
            {/* 全路径辉光扫掠（第 3 拍），垫在绿路径下 */}
            <path
              className="sm-glowpath"
              d="M330,125 L200,211 L200,316"
              pathLength={1}
            />
            {/* 树链路：根→分支→叶 */}
            <line
              className="sm-link sm-lk1"
              x1={330}
              y1={125}
              x2={200}
              y2={211}
              pathLength={1}
            />
            <line
              className="sm-link sm-lk2"
              x1={330}
              y1={125}
              x2={460}
              y2={211}
              pathLength={1}
            />
            <line
              className="sm-link sm-lk3"
              x1={200}
              y1={259}
              x2={200}
              y2={312}
              pathLength={1}
            />
            {/* 完整路径自绘（第 2 拍第 ④ 行报到时） */}
            <path
              className="sm-path"
              d="M330,125 L200,211 L200,316"
              pathLength={1}
            />
            {/* 分工点亮环（第 2 拍，与四行同步） */}
            <circle className="sm-ring sm-ring-root" cx={330} cy={95} r={39} />
            <circle className="sm-ring sm-ring-bl" cx={200} cy={235} r={32} />
            <circle className="sm-ring sm-ring-br" cx={460} cy={235} r={32} />
            <rect
              className="sm-ring sm-ring-bat"
              x={154}
              y={306}
              width={92}
              height={78}
              rx={6}
            />
            {/* 树节点 */}
            <circle className="sm-node sm-node-root" cx={330} cy={95} r={30} />
            <circle
              className="sm-node sm-node-branch"
              cx={200}
              cy={235}
              r={24}
            />
            <circle
              className="sm-node sm-node-branch"
              cx={460}
              cy={235}
              r={24}
            />
            {/* 叶上的具体对象：开场工业电池 */}
            <g className="sm-battery">
              <rect
                className="sm-bat-term"
                x={192}
                y={314}
                width={16}
                height={12}
              />
              <rect
                className="sm-bat-body"
                x={162}
                y={326}
                width={76}
                height={48}
                rx={4}
              />
            </g>
            {/* 每一级的命名 */}
            <text className="sm-nodelab sm-lab-root" x={330} y={103}>
              根
            </text>
            <text className="sm-nodelab sm-lab-bl" x={200} y={242}>
              分支
            </text>
            <text className="sm-nodelab sm-lab-leaf" x={134} y={362}>
              叶
            </text>
            {/* 被反复引用：外部组织/系统的引用引线 */}
            <line
              className="sm-refline sm-rl1"
              x1={240}
              y1={336}
              x2={326}
              y2={294}
            />
            <line
              className="sm-refline sm-rl2"
              x1={240}
              y1={350}
              x2={348}
              y2={350}
            />
            <line
              className="sm-refline sm-rl3"
              x1={240}
              y1={364}
              x2={326}
              y2={406}
            />
            <circle className="sm-refdot sm-rd1" cx={334} cy={290} r={7} />
            <circle className="sm-refdot sm-rd2" cx={356} cy={350} r={7} />
            <circle className="sm-refdot sm-rd3" cx={334} cy={410} r={7} />
            <text className="sm-refcap" x={378} y={356}>
              被反复引用
            </text>
            {/* 分工点亮标签（第 2 拍，与四行同步） */}
            <g className="sm-tag sm-tag-1">
              <line className="sm-tagtick" x1={364} y1={95} x2={394} y2={95} />
              <rect className="sm-tagbox" x={398} y={78} width={64} height={34} />
              <text className="sm-tagtext" x={430} y={101}>
                方向
              </text>
            </g>
            <g className="sm-tag sm-tag-2">
              <line className="sm-tagtick" x1={488} y1={235} x2={518} y2={235} />
              <rect
                className="sm-tagbox"
                x={522}
                y={218}
                width={64}
                height={34}
              />
              <text className="sm-tagtext" x={554} y={241}>
                范围
              </text>
            </g>
            <g className="sm-tag sm-tag-3">
              <line className="sm-tagtick" x1={168} y1={322} x2={134} y2={304} />
              <rect className="sm-tagbox" x={64} y={272} width={64} height={34} />
              <text className="sm-tagtext" x={96} y={295}>
                对象
              </text>
            </g>
            {/* 路径还能往深处扩展（支撑区第 2 行报到时） */}
            <line
              className="sm-stub-line"
              x1={200}
              y1={378}
              x2={200}
              y2={418}
            />
            <circle className="sm-stub-node" cx={200} cy={430} r={9} />
          </svg>
        </section>

        <div className="sm-side">
          <div className="sm-rail">
            <p className="sm-rail-kicker">机制的分工</p>
            <div className="sm-roles">
              {ROLES.map((role) => (
                <div className={`sm-role ${role.key}`} key={role.key}>
                  <div className="sm-role-line">
                    <span className="sm-role-index">{role.index}</span>
                    <span className="sm-role-term">{role.term}</span>
                    <span className="sm-role-leader" aria-hidden="true" />
                    <span className="sm-role-fn">{role.fn}</span>
                  </div>
                  {role.sub ? <p className="sm-role-sub">{role.sub}</p> : null}
                </div>
              ))}
            </div>
          </div>
          <div className="sm-support">
            <div className="sm-note sm-note-1">
              <span className="sm-note-mark" aria-hidden="true" />
              <p className="sm-note-text">
                走的路径和别人的不一样，<b>不会和别处的重名</b>混在一起
              </p>
            </div>
            <div className="sm-note sm-note-2">
              <span className="sm-note-mark" aria-hidden="true" />
              <p className="sm-note-text">
                这条路径<b>还能继续往深处扩展</b>
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="sm-takeaway">
        <div className="sm-take-path">
          <svg className="sm-take-svg" viewBox="0 0 190 64" aria-hidden="true">
            <path
              className="sm-take-line"
              d="M14,32 L166,32"
              pathLength={1}
            />
            <circle className="sm-take-node" cx={14} cy={32} r={9} />
            <circle className="sm-take-node" cx={95} cy={32} r={9} />
            <rect className="sm-take-leaf" x={166} y={22} width={20} height={20} />
            <text className="sm-take-lab" x={14} y={60}>
              根
            </text>
            <text className="sm-take-lab" x={176} y={60}>
              叶
            </text>
          </svg>
          <p className="sm-take-line1">一条从根到叶的路径</p>
        </div>
        <div className="sm-take-div" aria-hidden="true" />
        <div className="sm-take-judge">
          <p className="sm-take-line2">
            <span className="sm-take-ba">把</span>
            <span className="sm-chips">
              <span className="sm-chip">命名</span>
              <span className="sm-chip">范围</span>
              <span className="sm-chip">唯一性</span>
              <span className="sm-bracket" aria-hidden="true" />
            </span>
            <span className="sm-take-tail">放在同一套结构里表达出来</span>
          </p>
        </div>
      </div>
    </div>
  );
}
