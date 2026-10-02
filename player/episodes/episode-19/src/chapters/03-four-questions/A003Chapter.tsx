import "./A003Chapter.css";
import type { ChapterStepProps } from "../../../../../src/shared/presentation-runtime/registry/types";

/**
 * 03-four-questions · A003（四问卡片页 · condition-key-goal）
 * step → semantic state 显式映射，末态兜底（outline S-A003）：
 * - four-questions-set：标题区与"改写"引导行落位，四张问题卡等权依次落位，完成后全部等权
 * - constraints-over-name：四卡保持等权不选中，判断区落位收拢"名称只是入口、四约束定取舍"（R005 pivot）
 *
 * 视觉主体：一张"四约束检查单"——四张等权问题卡沿检查单轨道依次点亮，
 * 判断行是检查单底部唯一收束结论，不把四卡轮流 active。
 */
const stateByStep = ["four-questions-set", "constraints-over-name"] as const;

type A003State = (typeof stateByStep)[number];

const QUESTIONS = [
  { id: "Q1", lead: "要识别的", text: "对象是什么" },
  { id: "Q2", lead: "它主要在", text: "哪个环节使用" },
  { id: "Q3", lead: "需不需要", text: "跨企业、跨地域关联" },
  { id: "Q4", lead: "企业还要不要", text: "保留自己的内部细分" },
] as const;

export default function A003Chapter({ step }: ChapterStepProps) {
  const state: A003State = stateByStep[step] ?? stateByStep[stateByStep.length - 1];
  return (
    <div className="scene-pad fq-root" data-state={state}>
      <header className="fq-header">
        <h1 className="fq-headline">选型的四个业务问题</h1>
        <p className="fq-lead">
          先把
          <span className="fq-lead-mark">「选哪一种编码」</span>
          改写成四个业务问题
        </p>
      </header>

      <div className="fq-cards" aria-label="四个业务问题卡">
        {QUESTIONS.map((q) => (
          <article className="fq-card" key={q.id}>
            <span className="fq-card-id">{q.id}</span>
            <p className="fq-card-body">
              <span className="fq-card-lead">{q.lead}</span>
              <span className="fq-card-text">{q.text}</span>
            </p>
            <span className="fq-card-tick" aria-hidden="true" />
          </article>
        ))}
      </div>

      <div className="fq-verdict" aria-label="四个约束的收束判断">
        <svg
          className="fq-verdict-svg"
          viewBox="0 0 1180 46"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <line className="fq-verdict-line fq-vl-1" x1="140" y1="2" x2="560" y2="2" />
          <line className="fq-verdict-line fq-vl-2" x1="590" y1="2" x2="1030" y2="2" />
        </svg>
        <p className="fq-verdict-text">
          <span className="fq-verdict-name">编码名称只是候选入口</span>
          <span className="fq-verdict-key">四个约束决定取舍</span>
        </p>
      </div>
    </div>
  );
}
