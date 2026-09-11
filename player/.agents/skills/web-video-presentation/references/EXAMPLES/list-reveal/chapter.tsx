// ⚠️ 这是 anchor 参考代码，不会被任何项目编译。
//    在真实实例中重新实现到 episodes/<episode-id>/src/chapters/NN-list/，
//    不要直接复制旧模板 import。共享组件和类型从根级
//    src/shared/presentation-runtime/ 按实际相对路径导入。
import { MaskReveal } from "../../../templates/src/components/MaskReveal";
import type { ChapterStepProps } from "../../../templates/src/registry/types";
import "./chapter.css";

/**
 * list-reveal · 真实顺序过程示例
 * ─────────────────────────────────────────
 * 只适用于内容确有先后顺序、每个阶段有独立 narration beat 的情况。
 * 槽位状态切换：
 *     upcoming → active：mask reveal 标题 + 数字强调
 *     active → past   ：accent 灰化（filter）
 * - 关键：所有槽位的 React 节点位置不重排，只切换 className
 */
const ITEMS = [
  { num: "01", title: "采集", body: "从设备取得运行数据" },
  { num: "02", title: "分析", body: "识别状态与风险" },
  { num: "03", title: "行动", body: "把判断送回维护过程" },
];

export default function ListRevealChapter({ step }: ChapterStepProps) {
  const activeIdx = Math.min(Math.max(step, 0), ITEMS.length - 1);
  return (
    <div className="lr-scene scene-pad">
      <h1 className="lr-process-title">从数据到行动</h1>

      <div className="lr-grid">
        {ITEMS.map((it, i) => {
          const state =
            i < activeIdx ? "past" : i === activeIdx ? "active" : "upcoming";
          return <Slot key={it.num} state={state} item={it} />;
        })}
      </div>
    </div>
  );
}

function Slot({
  state,
  item,
}: {
  state: "upcoming" | "active" | "past";
  item: { num: string; title: string; body: string };
}) {
  return (
    <div className={`lr-slot lr-slot-${state}`}>
      <div className="lr-slot-num">{item.num}</div>
      <div className="lr-slot-content">
        {state !== "upcoming" && (
          <>
            <MaskReveal show duration={900} key={`${item.num}-title`}>
              <div className="lr-slot-title">{item.title}</div>
            </MaskReveal>
            {state === "active" && (
              <MaskReveal show delay={350} duration={900}>
                <div className="lr-slot-body">{item.body}</div>
              </MaskReveal>
            )}
          </>
        )}
      </div>
    </div>
  );
}
