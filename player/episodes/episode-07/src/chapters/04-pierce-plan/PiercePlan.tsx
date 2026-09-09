import type { ChapterStepProps } from "../../../src/runtime/types";
import "./PiercePlan.css";

// A004 · S-A004(单持续 base-scene,layered-bands-with-side-notes)。
// narration step → semantic state(见 outline 视觉步组):
// identity-established / support-shown / dimensions-shown / side-notes-complete。
const stateByStep = [
  "identity-established",
  "support-shown",
  "dimensions-shown",
  "side-notes-complete",
] as const;

type SceneState = (typeof stateByStep)[number];

// 支撑对象:S023 guidance 三个对象 + beat 2 各自动词,带内三行并列等权。
const SUPPORT_ROWS = [
  { verb: "支撑", name: "企业数字化转型" },
  { verb: "打通", name: "产业链供应链" },
  { verb: "促进", name: "不同类型企业融通" },
] as const;

// 观察维度:S024 guidance 六项,原序。
const DIMENSIONS = [
  "服务企业数",
  "覆盖行业数",
  "累计注册量",
  "日均解析量",
  "主动标识载体部署量",
  "重点领域应用成效",
] as const;

// step 4 整体读法:beat 4 原句的四个读法透镜映射到对应维度条;
// “累计注册量”即口播中“不能只盯着”的单一总量。
const READ_TAGS: Record<string, { text: string; lone?: boolean }> = {
  服务企业数: { text: "覆盖范围" },
  覆盖行业数: { text: "覆盖范围" },
  累计注册量: { text: "单一总量", lone: true },
  日均解析量: { text: "使用频率" },
  主动标识载体部署量: { text: "现场部署" },
  重点领域应用成效: { text: "业务效果" },
};

// step 4 侧注卡:主动标识载体的工作机制示意(主动上报 vs 依赖外部识读)。
function CarrierSketch() {
  return (
    <svg
      className="pp-sketch"
      viewBox="0 0 540 108"
      role="img"
      aria-label="主动标识载体主动上报示意"
    >
      {/* 载体芯片 */}
      <rect x="26" y="40" width="76" height="46" rx="7" fill="var(--theme-paper)" stroke="var(--theme-structural)" strokeWidth="3" />
      <rect x="44" y="54" width="40" height="18" rx="3" fill="var(--theme-process-surface)" stroke="var(--theme-process)" strokeWidth="2.5" />
      <line x1="40" y1="86" x2="40" y2="96" stroke="var(--theme-structural)" strokeWidth="2.5" />
      <line x1="64" y1="86" x2="64" y2="96" stroke="var(--theme-structural)" strokeWidth="2.5" />
      <line x1="88" y1="86" x2="88" y2="96" stroke="var(--theme-structural)" strokeWidth="2.5" />
      {/* 主动上报波 */}
      <path className="pp-wave pp-wave-1" d="M40 30 Q64 8 88 30" fill="none" stroke="var(--theme-process)" strokeWidth="3" />
      <path className="pp-wave pp-wave-2" d="M30 22 Q64 -8 98 22" fill="none" stroke="var(--theme-process)" strokeWidth="3" />
      {/* 主动发起解析请求 */}
      <line x1="112" y1="63" x2="206" y2="63" stroke="var(--theme-process)" strokeWidth="3" strokeDasharray="9 7" />
      <polygon points="206,56 220,63 206,70" fill="var(--theme-process)" />
      {/* 解析服务节点 */}
      <rect x="226" y="38" width="78" height="50" rx="7" fill="var(--surface-3)" stroke="var(--theme-structural)" strokeWidth="3" />
      <line x1="238" y1="54" x2="292" y2="54" stroke="var(--theme-structural)" strokeWidth="2.5" />
      <line x1="238" y1="64" x2="292" y2="64" stroke="var(--theme-structural)" strokeWidth="2.5" />
      <line x1="238" y1="74" x2="272" y2="74" stroke="var(--theme-structural)" strokeWidth="2.5" />
      {/* 分隔 */}
      <line x1="344" y1="14" x2="344" y2="94" stroke="var(--theme-dashed-line)" strokeWidth="2" strokeDasharray="6 6" />
      {/* 不依赖的外部识读设备(被动,弱化) */}
      <rect x="384" y="48" width="60" height="30" rx="5" transform="rotate(-24 414 63)" fill="var(--surface-3)" stroke="var(--text-faint)" strokeWidth="2.5" />
      <rect x="452" y="42" width="46" height="34" rx="4" fill="var(--surface-3)" stroke="var(--text-faint)" strokeWidth="2.5" strokeDasharray="5 5" />
      <line x1="378" y1="86" x2="510" y2="30" stroke="var(--theme-warning)" strokeWidth="3" />
    </svg>
  );
}

function PiercePlanScene({ state }: { state: SceneState }) {
  return (
    <div className="scene pp" data-state={state}>
      <div className="scene-pad pp-pad">
        <header className="pp-head">
          <h1 className="pp-headline">
            2024—2026：以<span className="pp-keyword">“贯通”</span>为关键词
          </h1>
          <hr className="rule" />
        </header>

        <section className="pp-identity card">
          <p className="pp-doc">
            《工业互联网标识解析体系<span className="pp-keyword">“贯通”</span>行动计划（2024—2026 年）》
          </p>
          <div className="pp-id-meta">
            <p className="pp-meta-line">十二部门印发</p>
            <p className="pp-meta-line">文号：工信部联信管〔2023〕271 号</p>
            <p className="pp-meta-line">政策文本落款：2024 年 1 月 21 日</p>
          </div>
        </section>

        <div className="pp-lower">
          <section className="pp-support">
            <p className="pp-support-cap">关注点从「节点建了多少」推进到「如何应用」</p>
            <div className="pp-support-band">
              {SUPPORT_ROWS.map((row) => (
                <div className="pp-srow" key={row.name}>
                  <div className="pp-sghost" aria-hidden />
                  <div className="pp-sbody">
                    <span className="pp-sverb">{row.verb}</span>
                    <span className="pp-sname">{row.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside className="pp-notes">
            <p className="pp-notes-cap">观察维度 · 规模应用怎么看</p>
            <ul className="pp-dims">
              {DIMENSIONS.map((dim) => (
                <li className="pp-dim" key={dim}>
                  <span className="pp-dim-name">{dim}</span>
                  <span className="pp-dim-tag">{READ_TAGS[dim].text}</span>
                </li>
              ))}
            </ul>
            <div className="pp-carrier">
              <p className="pp-carrier-title">
                主动标识载体：能自己主动上报信息的载体
              </p>
              <p className="pp-carrier-line">
                嵌入芯片、通信模组或终端 · 主动发起解析请求 · 不依赖外部识读设备
              </p>
              <CarrierSketch />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export function PiercePlan({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return <PiercePlanScene state={state} />;
}
