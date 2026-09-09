import type { ChapterStepProps } from "../../../src/runtime/types";
import "./TargetReading.css";

// A005 · S-A005(单持续 base-scene,evidence-cards-with-provenance-boundary)。
// narration step → semantic state(见 outline 视觉步组):
// numbers-displayed / targets-bounded / inference-bounded。
const stateByStep = [
  "numbers-displayed",
  "targets-bounded",
  "inference-bounded",
] as const;

type SceneState = (typeof stateByStep)[number];

// 五项目标卡:S028–S032 exact 逐字;短 kicker 取自 outline 步组括注。
const TARGETS = [
  { dim: "服务企业", value: "服务企业突破 50 万家" },
  { dim: "行业", value: "60 个行业推广应用" },
  { dim: "注册量", value: "累计注册量突破 6000 亿个" },
  { dim: "解析量", value: "日均解析量 3 亿次以上" },
  { dim: "载体", value: "主动标识载体部署超过 5000 万枚" },
] as const;

function TargetReadingScene({ state }: { state: SceneState }) {
  return (
    <div className="scene tr" data-state={state}>
      <div className="scene-pad tr-pad">
        <header className="tr-head">
          <h1 className="tr-headline">目标值，不是完成值</h1>
          <hr className="rule" />
        </header>

        <div className="tr-frame">
          <div className="tr-band tr-band-top">
            <p className="tr-band-text">总标签：到 2026 年的政策目标</p>
          </div>

          <div className="tr-cards">
            {TARGETS.map((t) => (
              <article className="tr-card card" key={t.dim}>
                <p className="tr-dim">{t.dim}</p>
                <p className="tr-value">{t.value}</p>
                <p className="tr-year-tag">到 2026 年</p>
              </article>
            ))}
          </div>

          <div className="tr-band tr-band-bottom">
            <p className="tr-bound">
              <span>目标</span>
              <span className="tr-neq">≠</span>
              <span>实绩</span>
            </p>
            <div className="tr-bound-meta">
              <p className="tr-meta-line">历史统计都有明确时点，不能当作当前情况使用</p>
              <p className="tr-meta-line">证据核验日：2026-07-20</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TargetReading({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return <TargetReadingScene state={state} />;
}
