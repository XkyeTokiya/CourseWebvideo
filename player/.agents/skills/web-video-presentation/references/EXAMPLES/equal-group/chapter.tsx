import "./chapter.css";

type ChapterStepProps = { step: number };

const ITEMS = ["设备控制", "生产管理", "订单库存", "质量管理"];
const stateByStep = [
  "systems-equal",
  "systems-equal",
  "systems-with-takeaway",
] as const;

export default function EqualGroupExample({ step }: ChapterStepProps) {
  const state = stateByStep[step] ?? stateByStep.at(-1)!;
  const hasTakeaway = state === "systems-with-takeaway";

  return (
    <section className="eg-scene">
      <h1>四类系统，各自有效</h1>
      <div className="eg-grid">
        {ITEMS.map((item) => (
          <article className="eg-card" key={item}>
            <strong>{item}</strong>
            <span>承担局部任务</span>
          </article>
        ))}
      </div>
      {hasTakeaway && <p className="eg-takeaway">局部数字化 ≠ 整体互联</p>}
    </section>
  );
}
