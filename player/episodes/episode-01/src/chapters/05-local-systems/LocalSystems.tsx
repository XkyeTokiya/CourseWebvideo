import type { CSSProperties } from "react";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";
import "./LocalSystems.css";

const SYSTEMS = [
  { no: "01", name: "设备控制", duty: "一套系统负责机器侧控制任务" },
  { no: "02", name: "生产管理", duty: "另一套系统负责生产安排" },
  { no: "03", name: "订单与库存", duty: "分别记录经营和物料信息" },
  { no: "04", name: "质量管理", duty: "独立承担质量相关任务" },
] as const;

const stateByStep = [
  "systems-partial",
  "systems-equal-local-strong",
  "digitalized-not-connected",
] as const;

export default function LocalSystemsChapter({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  const visibleCount = step === 0 ? 2 : 4;
  const statusOn = step >= 1;
  const concluded = state === "digitalized-not-connected";

  return (
    <div className="ls-scene scene-pad">
      <div className="ls-grid">
        {SYSTEMS.map((s, i) => (
          <div
            className="card ls-card"
            key={s.no}
            data-visible={i < visibleCount}
            style={{ "--ls-i": String(i) } as CSSProperties}
          >
            <span className="hero-num ls-card-no">{s.no}</span>
            <span className="ls-card-name">{s.name}</span>
            <span className="ls-card-duty">{s.duty}</span>
          </div>
        ))}
      </div>

      <div className="ls-status" data-on={statusOn}>
        每套系统都能把局部任务做得更快、更准——但不保证状态及时进入生产安排，也不保证信息被其他环节理解使用。
      </div>

      <div className="ls-bottom" data-strong={concluded}>
        <span className="ls-bottom-mark" />
        局部环节已经数字化，不等于整个工业过程已经互联。
      </div>
    </div>
  );
}
